import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Order } from "@/db/schema";
import { hashOrderAccessToken, orderAccessCookieName } from "@/lib/order-access";

const mocks = vi.hoisted(() => ({
  getOrderByNumber: vi.fn(),
  isAdminAuthed: vi.fn(),
  getCookie: vi.fn(),
}));

vi.mock("@/db", () => ({ db: { getOrderByNumber: mocks.getOrderByNumber } }));
vi.mock("@/lib/admin-auth", () => ({ isAdminAuthed: mocks.isAdminAuthed }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: mocks.getCookie }),
}));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("not found"); } }));
vi.mock("@/components/order-access-form", () => ({
  OrderAccessForm: vi.fn(() => null),
}));

import OrderPage from "@/app/order/[orderNumber]/page";
import { OrderAccessForm } from "@/components/order-access-form";

const accessToken = "order-page-token";
const order: Order = {
  id: 12,
  orderNumber: "EYC-ABC123",
  customerName: "Private Customer",
  email: "customer@example.com",
  phone: null,
  fulfillment: "pickup",
  notes: null,
  items: [],
  subtotalCents: 1000,
  totalCents: 1000,
  currency: "USD",
  status: "pending",
  paymentMethod: "at_pickup",
  paymentStatus: "unpaid",
  createdAt: new Date(),
  customerAccessTokenHash: hashOrderAccessToken(accessToken),
};

const props = { params: Promise.resolve({ orderNumber: order.orderNumber }) };

describe("public order confirmation access", () => {
  beforeEach(() => {
    mocks.getOrderByNumber.mockResolvedValue(order);
    mocks.isAdminAuthed.mockResolvedValue(false);
    mocks.getCookie.mockReturnValue(undefined);
  });

  it("shows only the access form without a customer token or admin session", async () => {
    const result = await OrderPage(props);

    expect(result.type).toBe(OrderAccessForm);
  });

  it("renders order details for the matching customer credential", async () => {
    mocks.getCookie.mockReturnValue({
      name: orderAccessCookieName(order.orderNumber),
      value: accessToken,
    });

    const result = await OrderPage(props);

    expect(result.type).not.toBe(OrderAccessForm);
    expect(mocks.getOrderByNumber).toHaveBeenCalledWith(order.orderNumber);
  });

  it("preserves authenticated admin access without a customer token", async () => {
    mocks.isAdminAuthed.mockResolvedValue(true);

    const result = await OrderPage(props);

    expect(result.type).not.toBe(OrderAccessForm);
  });
});