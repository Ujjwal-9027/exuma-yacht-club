/**
 * PAYMENT GATEWAY ADAPTER
 * ────────────────────────────────────────────────────────────────────────
 * The store talks to payments ONLY through the PaymentProvider interface.
 * The default provider is "manual": the order is recorded as pay-at-pickup
 * and no online payment is taken. To enable a real gateway, implement the
 * interface below and select it via the PAYMENT_PROVIDER env var.
 *
 * No gateway is hardcoded here — the client has not yet confirmed a
 * provider (see README → "Payments").
 */

export type CheckoutInput = {
  orderNumber: string;
  items: { name: string; qty: number; priceCents: number; size?: string | null; color?: string | null }[];
  totalCents: number;
  currency: string;
  customer: { name: string; email: string; phone: string | null };
  fulfillment: "pickup" | "ship";
};

export type CheckoutResult = {
  paymentMethod: string;
  paymentStatus: "unpaid" | "paid" | "pending";
  /** Set when the customer must be redirected to a hosted checkout page. */
  redirectUrl?: string;
};

export interface PaymentProvider {
  id: string;
  label: string;
  /** Prepares payment for an order (or defers it, for manual). */
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
}

/* ── Default: manual / pay on collection ─────────────────────────────── */
const manualProvider: PaymentProvider = {
  id: "manual",
  label: "Pay at pickup (manual)",
  async createCheckout() {
    return { paymentMethod: "at_pickup", paymentStatus: "unpaid" };
  },
};

/* ── Stub: Stripe (enable after client confirms + supplies keys) ────────
const stripeProvider: PaymentProvider = {
  id: "stripe",
  label: "Stripe Checkout",
  async createCheckout(input) {
    // 1. npm install stripe (server-side only — never expose the secret key)
    // 2. Create a Checkout Session with line items from `input`
    // 3. Return { paymentMethod: "stripe", paymentStatus: "pending",
    //              redirectUrl: session.url }
    // 4. Add /api/payments/stripe/webhook to mark orders paid
    //    (verify with the webhook signing secret)
    throw new Error("Stripe provider not implemented yet — see README.");
  },
};
───────────────────────────────────────────────────────────────────────── */

export function getPaymentProvider(): PaymentProvider {
  const id = process.env.PAYMENT_PROVIDER ?? "manual";
  switch (id) {
    // case "stripe": return stripeProvider;
    case "manual":
    default:
      return manualProvider;
  }
}
