import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Order } from "@/db/schema";
import {
  hasOrderAccess,
  orderAccessCookieName,
} from "@/lib/order-access";

const mocks = vi.hoisted(() => ({
  getOrderByNumber: vi.fn(),
  rateLimit: vi.fn(),
  setOrderAccessCode: vi.fn(),
  consumeOrderAccessCode: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    getOrderByNumber: mocks.getOrderByNumber,
    rateLimit: mocks.rateLimit,
    setOrderAccessCode: mocks.setOrderAccessCode,
    consumeOrderAccessCode: mocks.consumeOrderAccessCode,
  },
}));
vi.mock("@/lib/server-utils", () => ({
  EMAIL_RE: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  clean: (value: unknown, maxLength: number) =>
    typeof value === "string" ? value.trim().slice(0, maxLength) : "",
  clientKey: () => "test-client",
  rateLimitDb: (key: string, limit: number, windowMs: number) =>
    mocks.rateLimit(key, limit, windowMs),
}));
vi.mock("@/lib/email", () => ({
  getEmailProvider: () => ({ configured: true, send: mocks.sendEmail }),
}));

import { POST } from "@/app/api/orders/[orderNumber]/access/route";

let order: Order;
const params = { params: Promise.resolve({ orderNumber: "EYC-ABC123" }) };

function request(body: Record<string, unknown>): Request {
  return new Request("https://example.test/api/orders/EYC-ABC123/access", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST order access recovery", () => {
  beforeEach(() => {
    order = {
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
    };
    mocks.getOrderByNumber.mockResolvedValue(order);
    mocks.rateLimit.mockResolvedValue(true);
    mocks.sendEmail.mockResolvedValue(undefined);
    mocks.setOrderAccessCode.mockImplementation(
      async (_id: number, hash: string, expiresAt: Date) => {
        order.customerAccessCodeHash = hash;
        order.customerAccessCodeExpiresAt = expiresAt;
      },
    );
    mocks.consumeOrderAccessCode.mockImplementation(
      async (_id: number, hash: string, now: Date, tokenHash: string) => {
        if (
          order.customerAccessCodeHash !== hash ||
          !order.customerAccessCodeExpiresAt ||
          order.customerAccessCodeExpiresAt <= now
        ) return false;
        order.customerAccessTokenHash = tokenHash;
        delete order.customerAccessCodeHash;
        delete order.customerAccessCodeExpiresAt;
        return true;
      },
    );
    mocks.rateLimit.mockImplementation(async (key: string) =>
      !key.startsWith("order-access-verify:") ||
      key === "order-access-verify:test-client" ||
      key.endsWith(order.orderNumber),
    );
  });

  it("does not reveal whether an order or email exists", async () => {
    mocks.getOrderByNumber.mockResolvedValue(null);

    const response = await POST(
      request({ action: "request", email: "customer@example.com" }),
      params,
    );

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({
      ok: true,
      message:
        "If the email matches an order and delivery is available, a verification code will be sent.",
    });
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("does not send a code to an address other than the stored customer email", async () => {
    const response = await POST(
      request({ action: "request", email: "other@example.com" }),
      params,
    );

    expect(response.status).toBe(202);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("limits verification guesses independently for each order", async () => {
    mocks.rateLimit.mockImplementation(async (key: string) =>
      key !== `order-access-verify:${order.orderNumber}`,
    );

    const response = await POST(
      request({ action: "verify", email: order.email, code: "000000" }),
      params,
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: "The verification code is invalid or expired.",
    });
    expect(mocks.rateLimit).toHaveBeenCalledWith(
      `order-access-verify:${order.orderNumber}`,
      5,
      15 * 60_000,
    );
  });

  it("sends a one-time code only to the stored customer and exchanges it for the access cookie", async () => {
    const requested = await POST(
      request({ action: "request", email: "customer@example.com" }),
      params,
    );
    const requestedBody = await requested.json();
    const email = mocks.sendEmail.mock.calls[0][0] as { to: string; text: string };
    const code = email.text.match(/code is (\d{6})/)?.[1];

    expect(requested.status).toBe(202);
    expect(email.to).toBe(order.email);
    expect(code).toBeDefined();
    expect(JSON.stringify(requestedBody)).not.toContain(code);

    const wrongEmail = await POST(
      request({ action: "verify", email: "other@example.com", code }),
      params,
    );
    expect(wrongEmail.status).toBe(400);
    expect(mocks.consumeOrderAccessCode).not.toHaveBeenCalled();

    const verified = await POST(
      request({ action: "verify", email: order.email, code }),
      params,
    );
    const cookie = verified.cookies.get(orderAccessCookieName(order.orderNumber));

    expect(verified.status).toBe(200);
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.value).toBeDefined();
    expect(hasOrderAccess(order, cookie?.value, false)).toBe(true);
    expect(JSON.stringify(await verified.json())).not.toContain(cookie?.value);

    const replay = await POST(
      request({ action: "verify", email: order.email, code }),
      params,
    );
    expect(replay.status).toBe(400);
  });
});