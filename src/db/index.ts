import { MongoClient, type Collection, type Db, type Document } from "mongodb";
import type { Inquiry, Order, Product, SiteSettings } from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  __exumaMongoClient?: MongoClient;
  __exumaMongoDb?: Db;
};

function client(): MongoClient {
  const databaseUrl = process.env.MONGODB_URI;
  if (!databaseUrl) throw new Error("MONGODB_URI is required. Add it to .env.local and restart Next.js.");
  const mongoClient = globalForDb.__exumaMongoClient ?? new MongoClient(databaseUrl);
  if (process.env.NODE_ENV !== "production") globalForDb.__exumaMongoClient = mongoClient;
  return mongoClient;
}

async function database(): Promise<Db> {
  if (!globalForDb.__exumaMongoDb) {
    const mongoClient = client();
    await mongoClient.connect();
    globalForDb.__exumaMongoDb = mongoClient.db(process.env.MONGODB_DB ?? "exuma_yacht_club");
    await Promise.all([
      globalForDb.__exumaMongoDb.collection("products").createIndex({ slug: 1 }, { unique: true }),
      globalForDb.__exumaMongoDb.collection("orders").createIndex({ orderNumber: 1 }, { unique: true }),
      globalForDb.__exumaMongoDb.collection("settings").createIndex({ id: 1 }, { unique: true }),
      globalForDb.__exumaMongoDb.collection("rate_limits").createIndex({ resetAt: 1 }, { expireAfterSeconds: 0 }),
    ]);
  }
  return globalForDb.__exumaMongoDb;
}

async function collection<T extends Document>(name: string): Promise<Collection<T>> {
  return (await database()).collection<T>(name);
}

function stripMongoId<T>(document: T): T {
  const { _id: _ignored, ...withoutId } = document as T & { _id?: unknown };
  return withoutId as T;
}

async function nextId(name: string): Promise<number> {
  const result = await (await database()).collection<{ _id: string; value: number }>("counters").findOneAndUpdate(
    { _id: name },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return result!.value;
}

export const db = {
  async ping() { await database(); },
  async getActiveProducts(): Promise<Product[]> {
    return collection<Product>("products").then((c) => c.find({
      active: true,
      status: { $nin: ["draft", "archived"] },
      $or: [
        { trackInventory: { $ne: true } },
        { stockQty: { $gt: 0 } },
        { outOfStockBehavior: "show" },
      ],
    }).sort({ sortOrder: 1, id: 1 }).toArray().then((products) => products.map(stripMongoId)));
  },
  async getProductBySlug(slug: string): Promise<Product | null> {
    return collection<Product>("products").then((c) => c.findOne({ slug }).then((product) => product ? stripMongoId(product) : null));
  },
  async getProductsBySlugs(slugs: string[]): Promise<Product[]> {
    return collection<Product>("products").then((c) => c.find({ slug: { $in: slugs } }).toArray().then((products) => products.map(stripMongoId)));
  },
  async reserveProductStock(slug: string, quantity: number, size?: string | null, color?: string | null): Promise<boolean> {
    const products = await collection<Product>("products");
    if (size || color) {
      const variant = await products.updateOne(
        {
          slug,
          active: true,
          variants: { $elemMatch: { size: size ?? null, color: color ?? null, stockQty: { $gte: quantity } } },
        },
        { $inc: { "variants.$.stockQty": -quantity }, $set: { updatedAt: new Date() } },
      );
      if (variant.matchedCount > 0) return true;
    }
    const tracked = await products.updateOne(
      { slug, active: true, trackInventory: true, stockQty: { $gte: quantity } },
      { $inc: { stockQty: -quantity }, $set: { updatedAt: new Date() } },
    );
    if (tracked.matchedCount > 0) return true;
    const product = await products.findOne({ slug, active: true }, { projection: { trackInventory: 1, variants: 1 } });
    if (size || color) {
      const hasVariants = Boolean(product?.variants?.length);
      if (hasVariants) return false;
    }
    return Boolean(product && product.trackInventory !== true);
  },
  async releaseProductStock(slug: string, quantity: number, size?: string | null, color?: string | null): Promise<void> {
    const products = await collection<Product>("products");
    if (size || color) {
      const variant = await products.updateOne({ slug, variants: { $elemMatch: { size: size ?? null, color: color ?? null } } }, { $inc: { "variants.$.stockQty": quantity }, $set: { updatedAt: new Date() } });
      if (variant.matchedCount > 0) return;
    }
    await products.updateOne({ slug, trackInventory: true }, { $inc: { stockQty: quantity }, $set: { updatedAt: new Date() } });
  },
  async listProducts(search?: string): Promise<Product[]> {
    const filter = search
      ? { $or: [{ name: { $regex: search, $options: "i" } }, { slug: { $regex: search, $options: "i" } }, { sku: { $regex: search, $options: "i" } }] }
      : {};
    return collection<Product>("products").then((c) => c.find(filter).sort({ sortOrder: 1, id: 1 }).toArray().then((products) => products.map(stripMongoId)));
  },
  async getProductById(id: number): Promise<Product | null> {
    return collection<Product>("products").then((c) => c.findOne({ id }).then((product) => product ? stripMongoId(product) : null));
  },
  async createProduct(input: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const product = { ...input, id: await nextId("products"), createdAt: new Date(), updatedAt: new Date() };
    await (await collection<Product>("products")).insertOne(product);
    return product;
  },
  async updateProduct(id: number, input: Partial<Omit<Product, "id" | "createdAt">>): Promise<void> {
    await (await collection<Product>("products")).updateOne({ id }, { $set: { ...input, updatedAt: new Date() } });
  },
  async deleteProduct(id: number): Promise<"deleted" | "ordered" | "missing"> {
    const product = await db.getProductById(id);
    if (!product) return "missing";
    const usedByOrder = await (await collection<Order>("orders")).countDocuments({ "items.slug": product.slug });
    if (usedByOrder > 0) return "ordered";
    await (await collection<Product>("products")).deleteOne({ id });
    return "deleted";
  },
  async createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "handled">): Promise<Inquiry> {
    const inquiry = { ...input, id: await nextId("inquiries"), handled: false, createdAt: new Date() };
    await (await collection<Inquiry>("inquiries")).insertOne(inquiry);
    return inquiry;
  },
  async listInquiries(type?: string): Promise<Inquiry[]> {
    return collection<Inquiry>("inquiries").then((c) => c.find(type ? { type } : {}).sort({ createdAt: -1 }).toArray());
  },
  async setInquiryHandled(id: number, handled: boolean) {
    await (await collection<Inquiry>("inquiries")).updateOne({ id }, { $set: { handled } });
  },
  async createOrder(input: Omit<Order, "id" | "createdAt">): Promise<Order> {
    const order = { ...input, id: await nextId("orders"), createdAt: new Date() };
    await (await collection<Order>("orders")).insertOne(order);
    return order;
  },
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    return collection<Order>("orders").then((c) => c.findOne({ orderNumber }));
  },
  async listOrders(filters: { q?: string; status?: string; paymentStatus?: string } = {}): Promise<Order[]> {
    const query: Record<string, unknown> = {};
    if (filters.status) query.$or = [{ fulfillmentStatus: filters.status }, { status: filters.status }];
    if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
    if (filters.q) {
      query.$and = [{ $or: [{ orderNumber: { $regex: filters.q, $options: "i" } }, { customerName: { $regex: filters.q, $options: "i" } }, { email: { $regex: filters.q, $options: "i" } }] }];
    }
    return collection<Order>("orders").then((c) => c.find(query).sort({ createdAt: -1 }).toArray());
  },
  async getOrderById(id: number): Promise<Order | null> {
    return collection<Order>("orders").then((c) => c.findOne({ id }));
  },
  async setOrderStatus(id: number, status: string, fields: Partial<Order> = {}) {
    await (await collection<Order>("orders")).updateOne({ id }, { $set: { status, fulfillmentStatus: status, ...fields, updatedAt: new Date() } });
  },
  async getSiteSettings(): Promise<SiteSettings | null> {
    return collection<SiteSettings>("settings").then((c) => c.findOne({ id: "site" }));
  },
  async setSiteSettings(input: Omit<SiteSettings, "id" | "updatedAt">): Promise<void> {
    await (await collection<SiteSettings>("settings")).replaceOne(
      { id: "site" },
      { id: "site", ...input, updatedAt: new Date() },
      { upsert: true },
    );
  },
  async dashboardStats() {
    const orders = collection<Order>("orders");
    const products = collection<Product>("products");
    const [totalOrders, pendingOrders, paidOrders, cancelledOrders, refundedOrders, productCount, lowStockCount, sales] = await Promise.all([
      orders.then((c) => c.countDocuments()),
      orders.then((c) => c.countDocuments({ $or: [{ fulfillmentStatus: "processing" }, { fulfillmentStatus: "pending" }, { status: "pending" }] })),
      orders.then((c) => c.countDocuments({ paymentStatus: "paid" })),
      orders.then((c) => c.countDocuments({ $or: [{ fulfillmentStatus: "cancelled" }, { status: "cancelled" }] })),
      orders.then((c) => c.countDocuments({ paymentStatus: "refunded" })),
      products.then((c) => c.countDocuments()),
      products.then((c) => c.countDocuments({ trackInventory: true, stockQty: { $lte: 5 } })),
      orders.then((c) => c.aggregate<{ _id: null; total: number }>([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalCents" } } },
      ]).toArray()),
    ]);
    return { totalOrders, pendingOrders, paidOrders, cancelledOrders, refundedOrders, productCount, lowStockCount, salesCents: sales[0]?.total ?? 0 };
  },
  async count(collectionName: "products" | "orders" | "inquiries", filter: Record<string, unknown> = {}) {
    return (await collection(collectionName)).countDocuments(filter);
  },
  async rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
    const rates = await collection<{ key: string; count: number; resetAt: Date }>("rate_limits");
    const now = new Date();
    const current = await rates.findOne({ key });
    if (!current || current.resetAt <= now) {
      await rates.replaceOne({ key }, { key, count: 1, resetAt: new Date(Date.now() + windowMs) }, { upsert: true });
      return true;
    }
    if (current.count >= limit) return false;
    await rates.updateOne({ key }, { $inc: { count: 1 } });
    return true;
  },
};
