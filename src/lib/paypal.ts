const PAYPAL_API =
  process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

function paypalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured on the server.");
  }
  return { clientId, clientSecret };
}

async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret } = paypalCredentials();
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("PayPal authentication failed.");
  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) throw new Error("PayPal did not return an access token.");
  return body.access_token;
}

async function paypalRequest<T>(path: string, init: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${PAYPAL_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("PayPal API error:", response.status, await response.text());
    throw new Error("PayPal could not process the payment.");
  }
  return (await response.json()) as T;
}

function amountValue(totalCents: number): string {
  return (totalCents / 100).toFixed(2);
}

export function getPayPalClientId(): string | null {
  return process.env.PAYPAL_CLIENT_ID || null;
}

export async function createPayPalOrder(input: {
  totalCents: number;
  currency: string;
}): Promise<string> {
  const body = await paypalRequest<{ id?: string }>("/v2/checkout/orders", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: input.currency, value: amountValue(input.totalCents) } }],
    }),
  });
  if (!body.id) throw new Error("PayPal did not return an order ID.");
  return body.id;
}

type PayPalCaptureResponse = {
  status?: string;
  purchase_units?: {
    payments?: { captures?: { id?: string; status?: string; amount?: { currency_code?: string; value?: string } }[] };
  }[];
};

export async function capturePayPalOrder(input: {
  orderId: string;
  totalCents: number;
  currency: string;
}): Promise<string> {
  const body = await paypalRequest<PayPalCaptureResponse>(
    `/v2/checkout/orders/${encodeURIComponent(input.orderId)}/capture`,
    { method: "POST", headers: { Prefer: "return=representation" }, body: "{}" },
  );
  const capture = body.purchase_units?.[0]?.payments?.captures?.[0];
  if (
    body.status !== "COMPLETED" ||
    capture?.status !== "COMPLETED" ||
    capture.amount?.currency_code !== input.currency ||
    capture.amount.value !== amountValue(input.totalCents) ||
    !capture.id
  ) {
    throw new Error("PayPal returned an incomplete or mismatched payment.");
  }
  return capture.id;
}

export async function refundPayPalCapture(captureId: string): Promise<void> {
  await paypalRequest(`/v2/payments/captures/${encodeURIComponent(captureId)}/refund`, {
    method: "POST",
    body: "{}",
  });
}