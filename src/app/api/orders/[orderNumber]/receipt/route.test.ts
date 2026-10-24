import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Order } from "@/db/schema";
import { hashOrderAccessToken } from "@/lib/order-access";

const mocks = vi.hoisted(() => ({
  getOrderByNumber: vi.fn(),
  rateLimit: vi.fn(),
  isAdminAuthed: vi.fn(),
  getCookie: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    getOrderByNumber: mocks.getOrderByNumber,
    rateLimit: mocks.rateLimit,
  },
}));
vi.mock("@/lib/admin-auth", () => ({ isAdminAuthed: mocks.isAdminAuthed }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: mocks.getCookie }),
}));
vi.mock("@/lib/email", () => ({
  getEmailProvider: () => ({ configured: true, send: mocks.sendEmail }),
}));
vi.mock("@/lib/receipt", () => ({
  buildReceiptHtml: () => "<p>receipt</p>",
  toReceiptData: () => ({}),
}));

import { POST } from "@/app/api/orders/[orderNumber]/receipt/route";

const accessToken = "customer-access-token";
const order: Order = {
  id: 7,
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

function request(email = "customer@example.com"): Request {
  return new Request("https://example.test/api/orders/EYC-ABC123/receipt", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

const params = { params: Promise.resolve({ orderNumber: order.orderNumber }) };

describe("POST order receipt", () => {
  beforeEach(() => {
    mocks.getOrderByNumber.mockResolvedValue(order);
    mocks.rateLimit.mockResolvedValue(true);
    mocks.isAdminAuthed.mockResolvedValue(false);
    mocks.getCookie.mockReturnValue(undefined);
    mocks.sendEmail.mockResolvedValue(undefined);
  });

  it("does not email or disclose another customer's order without authorization", async () => {
    const response = await POST(request("attacker@example.com"), params);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(JSON.stringify(body)).not.toContain("Private Customer");
    expect(JSON.stringify(body)).not.toContain("customer@example.com");
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("allows a customer with the matching access cookie to email their receipt", async () => {
    mocks.getCookie.mockReturnValue({ value: accessToken });

    const response = await POST(request(), params);

    expect(response.status).toBe(200);
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "customer@example.com" }),
    );
  });

  it("preserves authenticated admin receipt access", async () => {
    mocks.isAdminAuthed.mockResolvedValue(true);

    const response = await POST(request(), params);

    expect(response.status).toBe(200);
    expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
  });
});