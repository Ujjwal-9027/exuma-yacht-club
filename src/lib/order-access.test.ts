import { describe, expect, it } from "vitest";
import type { Order } from "@/db/schema";
import {
  createOrderAccessToken,
  hasOrderAccess,
  hashOrderAccessToken,
} from "@/lib/order-access";

const accessToken = createOrderAccessToken();
const order: Order = {
  id: 1,
  orderNumber: "EYC-ABC123",
  customerName: "Customer Name",
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

describe("customer order access", () => {
  it("does not authorize by order number alone", () => {
    expect(hasOrderAccess(order, undefined, false)).toBe(false);
  });

  it("authorizes only the matching customer token or admin", () => {
    expect(hasOrderAccess(order, "wrong-token", false)).toBe(false);
    expect(hasOrderAccess(order, accessToken, false)).toBe(true);
    expect(hasOrderAccess(order, undefined, true)).toBe(true);
  });
});