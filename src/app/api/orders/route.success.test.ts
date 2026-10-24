import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Product } from "@/db/schema";
import { hasOrderAccess, orderAccessCookieName } from "@/lib/order-access";

const mocks = vi.hoisted(() => ({
  getProductsBySlugs: vi.fn(),
  reserveProductStock: vi.fn(),
  releaseProductStock: vi.fn(),
  createOrder: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    getProductsBySlugs: mocks.getProductsBySlugs,
    reserveProductStock: mocks.reserveProductStock,
    releaseProductStock: mocks.releaseProductStock,
    createOrder: mocks.createOrder,
  },
}));
vi.mock("@/lib/server-utils", () => ({
  EMAIL_RE: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  clean: (value: unknown, maxLength: number) =>
    typeof value === "string" ? value.trim().slice(0, maxLength) : "",
  clientKey: () => "test-client",
  rateLimitDb: async () => true,
}));
vi.mock("@/lib/payments", () => ({
  getPaymentProvider: () => ({
    createCheckout: async () => ({ paymentMethod: "at_pickup", paymentStatus: "unpaid" }),
  }),
}));
vi.mock("@/lib/shipping", () => ({ getShippingFeeCents: () => 0 }));
vi.mock("@/lib/notifications", () => ({
  notifyNewOrder: async () => undefined,
  sendOrderConfirmationToCustomer: async () => undefined,
}));
vi.mock("@/lib/product-utils", () => ({
  findProductVariant: () => null,
  getCurrentPriceCents: (product: Product) => product.priceCents,
}));

import { POST } from "@/app/api/orders/route";

const product: Product = {
  id: 3,
  slug: "eyc-cap",
  name: "EYC Cap",
  tagline: "",
  description: "",
  category: "Apparel",
  priceCents: 2500,
  currency: "USD",
  image: "/cap.jpg",
  imageAlt: "Cap",
  sizes: [],
  colors: [],
  active: true,
  sortOrder: 0,
  createdAt: new Date(),
};

describe("POST orders customer credential", () => {
  beforeEach(() => {
    mocks.getProductsBySlugs.mockResolvedValue([product]);
    mocks.reserveProductStock.mockResolvedValue(true);
    mocks.createOrder.mockImplementation(async (input) => ({
      ...input,
      id: 1,
      createdAt: new Date(),
    }));
  });

  it("sets an HttpOnly customer credential without returning the token in JSON", async () => {
    const request = new Request("https://example.test/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerName: "Customer Name",
        email: "customer@example.com",
        fulfillment: "pickup",
        items: [{ slug: product.slug, qty: 1 }],
      }),
    });

    const response = await POST(request);
    const body = await response.json();
    const savedOrder = mocks.createOrder.mock.calls[0][0];
    const cookie = response.cookies.get(orderAccessCookieName(body.orderNumber));

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(JSON.stringify(body)).not.toContain(cookie?.value);
    expect(cookie?.httpOnly).toBe(true);
    expect(hasOrderAccess(savedOrder, cookie?.value, false)).toBe(true);
  });
});