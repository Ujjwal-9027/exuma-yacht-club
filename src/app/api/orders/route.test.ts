import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createOrder: vi.fn(),
}));

vi.mock("@/db", () => ({ db: { createOrder: mocks.createOrder } }));
vi.mock("@/lib/server-utils", () => ({
  EMAIL_RE: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  clean: (value: unknown, maxLength: number) =>
    typeof value === "string" ? value.trim().slice(0, maxLength) : "",
  clientKey: () => "test-client",
  rateLimitDb: async () => true,
}));

import { POST } from "@/app/api/orders/route";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST orders production payment guard", () => {
  it("rejects client-selected demo payments without creating a paid order", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const request = new Request("https://example.test/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ demoPayment: true }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      ok: false,
      error: "Demo payments are not available in production.",
    });
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });
});