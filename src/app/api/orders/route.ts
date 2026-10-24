import { NextResponse } from "next/server";
import { db } from "@/db";
import type { OrderItem, ShippingAddress } from "@/db/schema";
import { EMAIL_RE, clean, clientKey, rateLimitDb } from "@/lib/server-utils";
import { getPaymentProvider } from "@/lib/payments";
import { getShippingFeeCents, type DeliverySpeed } from "@/lib/shipping";
import { notifyNewOrder, sendOrderConfirmationToCustomer } from "@/lib/notifications";
import { randomBytes } from "node:crypto";
import { findProductVariant, getCurrentPriceCents } from "@/lib/product-utils";
import {
  createOrderAccessToken,
  hashOrderAccessToken,
  orderAccessCookieName,
  ORDER_ACCESS_COOKIE_MAX_AGE,
} from "@/lib/order-access";

function makeOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = randomBytes(16).toString("hex").toUpperCase();
  return `EYC-${stamp}${rand}`;
}

type IncomingItem = {
  slug: string;
  size: string | null;
  color: string | null;
  qty: number;
};

/**
 * Creates an order. Prices are always taken from the database — never from
 * the client — and demo payment never collects or stores card data.
 */
export async function POST(req: Request) {
  const reserved: { slug: string; qty: number; size: string | null; color: string | null }[] = [];
  let orderPersisted = false;
  try {
    if (!(await rateLimitDb(`order:${clientKey(req)}`, 5, 60_000))) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    const body = (await req.json().catch(() => null)) as
      | {
          customerName?: unknown;
          email?: unknown;
          phone?: unknown;
          notes?: unknown;
          fulfillment?: unknown;
          shippingAddress?: unknown;
          items?: unknown;
          companyWebsite?: unknown;
          deliverySpeed?: unknown;
          demoPayment?: unknown;
          demoPaymentMethod?: unknown;
        }
      | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    if (clean(body.companyWebsite, 200)) {
      return NextResponse.json({ ok: true, orderNumber: "EYC-IGNORED" });
    }

    if (body.demoPayment === true && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, error: "Demo payments are not available in production." },
        { status: 400 },
      );
    }

    const customerName = clean(body.customerName, 120);
    const email = clean(body.email, 160);
    const phone = clean(body.phone, 40);
    const notes = clean(body.notes, 1000);
    const deliverySpeed: DeliverySpeed = clean(body.deliverySpeed, 20) === "priority" ? "priority" : "standard";
    const demoPayment = body.demoPayment === true;
    const demoPaymentMethod = clean(body.demoPaymentMethod, 20) === "card" ? "demo_card" : "demo_paypal";
    const fulfillmentRaw = clean(body.fulfillment, 10);
    const fulfillment: "pickup" | "ship" = fulfillmentRaw === "ship" ? "ship" : "pickup";
    const rawAddress =
      body.shippingAddress && typeof body.shippingAddress === "object"
        ? body.shippingAddress as Record<string, unknown>
        : null;
    const shippingAddress: ShippingAddress | null = rawAddress
      ? {
          addressLine1: clean(rawAddress.addressLine1, 160),
          addressLine2: clean(rawAddress.addressLine2, 160) || null,
          city: clean(rawAddress.city, 100),
          region: clean(rawAddress.region, 100) || null,
          postalCode: clean(rawAddress.postalCode, 30) || null,
          country: clean(rawAddress.country, 100),
        }
      : null;

    if (!customerName) {
      return NextResponse.json(
        { ok: false, error: "Please provide your full name." },
        { status: 400 },
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 },
      );
    }
    if (fulfillment === "ship" && (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.country)) {
      return NextResponse.json(
        { ok: false, error: "Please provide your complete shipping address." },
        { status: 400 },
      );
    }
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 30) {
      return NextResponse.json(
        { ok: false, error: "Your cart is empty." },
        { status: 400 },
      );
    }

    const incoming: IncomingItem[] = [];
    for (const raw of body.items as unknown[]) {
      const item = raw as Partial<IncomingItem>;
      const slug = clean(item?.slug, 120);
      const size = item?.size ? clean(item.size, 20) : null;
      const color = item?.color ? clean(item.color, 30) : null;
      const qty = Number(item?.qty);
      if (!slug || !Number.isInteger(qty) || qty < 1 || qty > 99) {
        return NextResponse.json(
          { ok: false, error: "One or more cart items are invalid." },
          { status: 400 },
        );
      }
      incoming.push({ slug, size, color, qty });
    }

    const dbProducts = await db.getProductsBySlugs([...new Set(incoming.map((i) => i.slug))]);

    const catalog = new Map(dbProducts.map((p) => [p.slug, p]));

    const items: OrderItem[] = [];
    let subtotal = 0;
    for (const item of incoming) {
      const product = catalog.get(item.slug);
      if (!product || !product.active || product.status === "draft" || product.status === "archived") {
        return NextResponse.json(
          {
            ok: false,
            error: `"${item.slug}" is no longer available. Please review your cart.`,
          },
          { status: 400 },
        );
      }
      if (item.size && !product.sizes.includes(item.size)) {
        return NextResponse.json(
          { ok: false, error: `Size "${item.size}" is not offered for ${product.name}.` },
          { status: 400 },
        );
      }
      if (product.sizes.length > 1 && !item.size) {
        return NextResponse.json(
          { ok: false, error: `Please choose a size for ${product.name}.` },
          { status: 400 },
        );
      }
      if (item.color && !product.colors.includes(item.color)) {
        return NextResponse.json(
          { ok: false, error: `Colour "${item.color}" is not offered for ${product.name}.` },
          { status: 400 },
        );
      }
      if (product.colors.length > 1 && !item.color) {
        return NextResponse.json(
          { ok: false, error: `Please choose a colour for ${product.name}.` },
          { status: 400 },
        );
      }
      const variant = product.variants?.length ? findProductVariant(product, item.size, item.color) : null;
      if (product.variants?.length && !variant) {
        return NextResponse.json({ ok: false, error: `${product.name} does not have that variant.` }, { status: 400 });
      }
      const priceCents = getCurrentPriceCents(product, variant);
      subtotal += priceCents * item.qty;
      items.push({
        slug: product.slug,
        name: product.name,
        priceCents,
        qty: item.qty,
        size: item.size,
        color: item.color,
        image: product.image,
      });
    }

    const shippingFeeCents = getShippingFeeCents(fulfillment, shippingAddress, deliverySpeed);
    const totalCents = subtotal + shippingFeeCents;

    for (const item of items) {
      if (!(await db.reserveProductStock(item.slug, item.qty, item.size, item.color))) {
        for (const previous of reserved) await db.releaseProductStock(previous.slug, previous.qty, previous.size, previous.color);
        return NextResponse.json(
          { ok: false, error: `${item.name} does not have enough stock available.` },
          { status: 409 },
        );
      }
      reserved.push({ slug: item.slug, qty: item.qty, size: item.size ?? null, color: item.color ?? null });
    }

    const orderNumber0 = makeOrderNumber();
    const accessToken = createOrderAccessToken();
    const checkout = demoPayment
      ? { paymentMethod: demoPaymentMethod, paymentStatus: "paid" as const }
      : await getPaymentProvider().createCheckout({
          orderNumber: orderNumber0,
          items: items.map((i) => ({
            name: i.name,
            qty: i.qty,
            priceCents: i.priceCents,
            size: i.size,
            color: i.color,
          })),
          totalCents,
          currency: "USD",
          customer: { name: customerName, email, phone: phone || null },
          fulfillment,
        });
    // Retry a few times in the unlikely event of an order-number collision.
    let orderNumber = "";
    for (let attempt = 0; attempt < 3; attempt += 1) {
      orderNumber = attempt === 0 ? orderNumber0 : makeOrderNumber();
      try {
        const created = await db.createOrder({
            orderNumber,
            customerName,
            email,
            phone: phone || null,
            shippingAddress,
            fulfillment,
            deliverySpeed: fulfillment === "ship" ? deliverySpeed : undefined,
            notes: notes || null,
            items,
            subtotalCents: subtotal,
            shippingFeeCents,
            totalCents,
            currency: "USD",
            status: "pending",
            paymentMethod: checkout.paymentMethod,
            paymentStatus: checkout.paymentStatus,
            customerAccessTokenHash: hashOrderAccessToken(accessToken),
          });
        orderPersisted = true;
        await notifyNewOrder(created);
        await sendOrderConfirmationToCustomer(created);
        const response = NextResponse.json({
          ok: true,
          orderNumber,
          redirectUrl: checkout.redirectUrl ?? null,
        });
        response.cookies.set(orderAccessCookieName(orderNumber), accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: ORDER_ACCESS_COOKIE_MAX_AGE,
        });
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (!message.includes("unique")) {
          throw err;
        }
      }
    }

    for (const reservedItem of reserved) await db.releaseProductStock(reservedItem.slug, reservedItem.qty, reservedItem.size, reservedItem.color);

    return NextResponse.json(
      { ok: false, error: "Could not allocate an order number. Please try again." },
      { status: 500 },
    );
  } catch (err) {
    if (!orderPersisted) {
      for (const reservedItem of reserved) await db.releaseProductStock(reservedItem.slug, reservedItem.qty, reservedItem.size, reservedItem.color);
    }
    console.error(
      "Order creation failed:",
      err instanceof Error ? err.name : "Unknown error",
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't place your order due to a server error. Your cart is unchanged — please try again.",
      },
      { status: 500 },
    );
  }
}
