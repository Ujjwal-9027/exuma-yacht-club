import type { Order } from "@/db/schema";
import { formatMoney } from "@/lib/format";
import { escapeHtml } from "@/lib/escape-html";
import { site } from "@/lib/site";

export const PAYMENT_REFERENCE_PLACEHOLDER = "Pending provider reference";

export type ReceiptData = {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string | null;
  fulfillment: string;
  deliverySpeed?: string;
  shippingAddress?: Order["shippingAddress"];
  items: Order["items"];
  subtotalCents: number;
  shippingFeeCents: number;
  totalCents: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentReference: string;
  contactPhone: string;
  website: string;
};

export function toReceiptData(order: Order): ReceiptData {
  return {
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    fulfillment: order.fulfillment,
    deliverySpeed: order.deliverySpeed,
    shippingAddress: order.shippingAddress,
    items: order.items,
    subtotalCents: order.subtotalCents,
    shippingFeeCents: order.shippingFeeCents ?? 0,
    totalCents: order.totalCents,
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    paymentReference: PAYMENT_REFERENCE_PLACEHOLDER,
    contactPhone: site.phone.label,
    website: site.url,
  };
}

export function paymentLabel(paymentMethod: string, fulfillment: string): string {
  if (paymentMethod === "demo_card") return "Demo debit card";
  if (paymentMethod === "demo_paypal") return "Demo PayPal";
  if (paymentMethod === "at_pickup") {
    return fulfillment === "ship" ? "Payment to be arranged" : "Pay at pickup";
  }
  return paymentMethod;
}

export function paymentStatusLabel(data: ReceiptData): string {
  const status = data.paymentStatus.toLowerCase();
  if (data.paymentMethod.startsWith("demo_")) return `DEMO PAYMENT - ${status.toUpperCase()}`;
  if (status === "pending") return "PAYMENT PENDING";
  return status.toUpperCase();
}

export function deliveryLabel(data: ReceiptData): string {
  if (data.fulfillment !== "ship") return "Collect at the dock";
  return `${data.deliverySpeed === "priority" ? "Priority" : "Standard"} delivery`;
}

export function buildReceiptHtml(data: ReceiptData): string {
  const address = data.shippingAddress
    ? [
        data.shippingAddress.addressLine1,
        data.shippingAddress.addressLine2,
        [
          data.shippingAddress.city,
          data.shippingAddress.region,
          data.shippingAddress.postalCode,
        ]
          .filter(Boolean)
          .join(", "),
        data.shippingAddress.country,
      ]
        .filter(Boolean)
        .join("<br>")
    : "Collect at Exuma Yacht Club gift shop";
  const items = data.items
    .map(
      (item) =>
        `<tr><td>${escapeHtml(item.name)}${item.size ? ` · ${escapeHtml(item.size)}` : ""}${item.color ? ` · ${escapeHtml(item.color)}` : ""} × ${item.qty}</td><td>${formatMoney(item.priceCents * item.qty, data.currency)}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Receipt ${escapeHtml(data.orderNumber)}</title>
<style>body{font-family:Arial,sans-serif;color:#1e2427;max-width:720px;margin:40px auto;padding:0 24px}h1{color:#0c2733}table{width:100%;border-collapse:collapse;margin:24px 0}td{padding:10px 0;border-bottom:1px solid #ddd}td:last-child{text-align:right}dl{display:grid;grid-template-columns:180px 1fr;gap:8px;margin:24px 0}dt{font-weight:bold;color:#96774a}dd{margin:0} .total{font-size:20px;font-weight:bold}</style></head>
<body><h1>Exuma Yacht Club</h1><p>Order receipt</p><dl>
<dt>Order</dt><dd>${escapeHtml(data.orderNumber)}</dd>
<dt>Date</dt><dd>${escapeHtml(new Date(data.createdAt).toLocaleString("en-US"))}</dd>
<dt>Customer</dt><dd>${escapeHtml(data.customerName)}</dd>
<dt>Email</dt><dd>${escapeHtml(data.email)}</dd>
<dt>Phone</dt><dd>${escapeHtml(data.phone ?? "")}</dd>
<dt>Delivery</dt><dd>${escapeHtml(deliveryLabel(data))}</dd>
<dt>Address</dt><dd>${address}</dd>
<dt>Payment</dt><dd>${escapeHtml(paymentLabel(data.paymentMethod, data.fulfillment))} (${escapeHtml(data.paymentStatus)})</dd>
<dt>Payment reference</dt><dd>${escapeHtml(data.paymentReference)}</dd>
</dl><table><thead><tr><th style="text-align:left">Item</th><th style="text-align:right">Amount</th></tr></thead><tbody>${items}</tbody><tfoot>
<tr><td>Items</td><td>${formatMoney(data.subtotalCents, data.currency)}</td></tr>
<tr><td>Delivery</td><td>${data.shippingFeeCents ? formatMoney(data.shippingFeeCents, data.currency) : "Free"}</td></tr>
<tr class="total"><td>Total</td><td>${formatMoney(data.totalCents, data.currency)}</td></tr>
</tfoot></table><p>Thank you for your order.</p></body></html>`;
}
