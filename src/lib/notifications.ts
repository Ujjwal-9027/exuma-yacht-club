import type { Inquiry, Order } from "@/db/schema";
import { formatMoney } from "@/lib/format";
import { escapeHtml, sendCustomerEmail, sendNotification } from "@/lib/email";
import { PAYMENT_REFERENCE_PLACEHOLDER } from "@/lib/receipt";

const TYPE_LABELS: Record<string, string> = {
  dockage: "Dockage request",
  stay: "Stay inquiry",
  dining: "Reservation inquiry",
  fuel: "Fuel inquiry",
  general: "General message",
};

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px;vertical-align:top">${label}</td><td style="padding:4px 0;font-size:13px">${escapeHtml(value)}</td></tr>`;
}

export async function notifyNewInquiry(inquiry: Inquiry): Promise<void> {
  const typeLabel = TYPE_LABELS[inquiry.type] ?? inquiry.type;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#0c2733;margin:0 0 12px">New ${escapeHtml(typeLabel)}</h2>
      <p style="color:#666;font-size:13px;margin:0 0 16px">Submitted via exumayachtclub.net — reply directly to this email to respond to the guest.</p>
      <table style="border-collapse:collapse">
        ${row("Name", inquiry.fullName)}
        ${row("Email", inquiry.email)}
        ${row("Phone", inquiry.phone)}
        ${row("Vessel", inquiry.vesselName)}
        ${row("LOA", inquiry.vesselLength)}
        ${row("Arrival", inquiry.arrivalDate)}
        ${row("Departure", inquiry.departureDate)}
        ${row("Time", inquiry.timeOfDay)}
        ${row("Party size", inquiry.partySize)}
        ${row("Services", inquiry.serviceRequirements)}
        ${row("Message", inquiry.message)}
      </table>
    </div>`;
  await sendNotification({
    to: "",
    subject: `${typeLabel} — ${inquiry.fullName}`,
    html,
    replyTo: inquiry.email,
  });
}

export async function notifyNewOrder(order: Order): Promise<void> {
  const items = order.items
    .map(
      (i) =>
        `<li style="font-size:13px;margin-bottom:6px">${escapeHtml(i.name)}${i.size ? ` · ${escapeHtml(i.size)}` : ""}${i.color ? ` · ${escapeHtml(i.color)}` : ""} × ${i.qty} — <strong>${formatMoney(i.priceCents * i.qty, order.currency)}</strong></li>`,
    )
    .join("");
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#0c2733;margin:0 0 12px">New order ${escapeHtml(order.orderNumber)}</h2>
      <table style="border-collapse:collapse">
        ${row("Customer", order.customerName)}
        ${row("Email", order.email)}
        ${row("Phone", order.phone)}
        ${row("Delivery", order.fulfillment === "ship" ? `${order.deliverySpeed === "priority" ? "Priority" : "Standard"} delivery to ${order.shippingAddress?.city ?? "address"} (${formatMoney(order.shippingFeeCents ?? 0, order.currency)})` : "Collect at the dock")}
        ${row("Shipping address", order.shippingAddress ? [
          order.shippingAddress.addressLine1,
          order.shippingAddress.addressLine2,
          [order.shippingAddress.city, order.shippingAddress.region, order.shippingAddress.postalCode].filter(Boolean).join(", "),
          order.shippingAddress.country,
        ].filter(Boolean).join(" / ") : null)}
        ${row("Notes", order.notes)}
      </table>
      <ul style="padding-left:18px;margin:12px 0">${items}</ul>
      <p style="font-size:14px"><strong>Total due: ${formatMoney(order.totalCents, order.currency)}</strong></p>
    </div>`;
  await sendNotification({
    to: "",
    subject: `New order ${order.orderNumber} — ${formatMoney(order.totalCents, order.currency)}`,
    html,
    replyTo: order.email,
  });
}

/** Confirmation email TO the customer (sent only when email is configured). */
export async function sendOrderConfirmationToCustomer(order: Order): Promise<void> {
  const items = order.items
    .map(
      (i) =>
        `<li style="font-size:13px;margin-bottom:6px">${escapeHtml(i.name)}${i.size ? ` · ${escapeHtml(i.size)}` : ""}${i.color ? ` · ${escapeHtml(i.color)}` : ""} × ${i.qty} — <strong>${formatMoney(i.priceCents * i.qty, order.currency)}</strong></li>`,
    )
    .join("");
  const delivery =
    order.fulfillment === "ship"
      ? `You chose ${order.deliverySpeed === "priority" ? "priority" : "standard"} delivery to ${order.shippingAddress?.city ?? "your address"}. Delivery fee: ${formatMoney(order.shippingFeeCents ?? 0, order.currency)}.`
      : "Collect your order at the marina gift shop on Queen's Highway, George Town. Please bring your order number.";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#0c2733;margin:0 0 12px">Order placed successfully</h2>
      <p style="font-size:13px;color:#444">Order <strong>${escapeHtml(order.orderNumber)}</strong></p>
      <p style="font-size:13px;color:#444">Your order has been received and recorded. This email contains your order details.</p>
      <table style="border-collapse:collapse">
        ${row("Customer", order.customerName)}
        ${row("Email", order.email)}
        ${row("Payment status", order.paymentStatus)}
        ${row("Payment reference", PAYMENT_REFERENCE_PLACEHOLDER)}
      </table>
      <ul style="padding-left:18px;margin:12px 0">${items}</ul>
      <p style="font-size:14px"><strong>Order total: ${formatMoney(order.totalCents, order.currency)}</strong>${order.paymentMethod === "at_pickup" ? " (pay at pickup)" : order.paymentMethod === "demo_card" ? " (demo debit card)" : " (demo PayPal)"}</p>
      <p style="font-size:13px;color:#444">${delivery}</p>
      ${order.shippingAddress ? `<p style="font-size:13px;color:#444"><strong>Shipping address:</strong><br>${escapeHtml(order.shippingAddress.addressLine1)}${order.shippingAddress.addressLine2 ? `<br>${escapeHtml(order.shippingAddress.addressLine2)}` : ""}<br>${escapeHtml([order.shippingAddress.city, order.shippingAddress.region, order.shippingAddress.postalCode].filter(Boolean).join(", "))}<br>${escapeHtml(order.shippingAddress.country)}</p>` : ""}
      <p style="font-size:13px;color:#444">Questions? Call +1 (242) 336-2578.</p>
    </div>`;
  await sendCustomerEmail({
    to: order.email,
    subject: `Your Exuma Yacht Club order ${order.orderNumber}`,
    html,
  });
}

export async function sendOrderCancellationToCustomer(
  order: Order,
  reason: string,
): Promise<void> {
  const items = order.items
    .map(
      (item) =>
        `<li style="font-size:13px;margin-bottom:6px">${escapeHtml(item.name)}${item.size ? ` · ${escapeHtml(item.size)}` : ""}${item.color ? ` · ${escapeHtml(item.color)}` : ""} × ${item.qty} — <strong>${formatMoney(item.priceCents * item.qty, order.currency)}</strong></li>`,
    )
    .join("");
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#8f3526;margin:0 0 12px">Your order has been cancelled</h2>
      <p style="font-size:13px;color:#444">Order <strong>${escapeHtml(order.orderNumber)}</strong></p>
      <p style="font-size:13px;color:#444">We are sorry, but our team could not complete this order.</p>
      <table style="border-collapse:collapse">
        ${row("Customer", order.customerName)}
        ${row("Cancellation reason", reason)}
        ${row("Payment status", order.paymentStatus)}
        ${row("Payment reference", PAYMENT_REFERENCE_PLACEHOLDER)}
      </table>
      <ul style="padding-left:18px;margin:12px 0">${items}</ul>
      <p style="font-size:14px"><strong>Order total: ${formatMoney(order.totalCents, order.currency)}</strong></p>
      <p style="font-size:13px;color:#444">If you have questions, call +1 (242) 336-2578.</p>
    </div>`;
  await sendCustomerEmail({
    to: order.email,
    subject: `Order cancelled — ${order.orderNumber}`,
    html,
  });
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Order received",
  processing: "Order processing",
  ready: "Ready for pickup",
  shipped: "Order shipped",
  delivered: "Order delivered",
  fulfilled: "Order fulfilled",
  cancelled: "Order cancelled",
};

export async function sendOrderStatusUpdateToCustomer(
  order: Order,
  status: string,
): Promise<void> {
  const label = ORDER_STATUS_LABELS[status] ?? `Order status: ${status}`;
  const delivery = order.fulfillment === "ship"
    ? `${order.deliverySpeed === "priority" ? "Priority" : "Standard"} delivery to ${order.shippingAddress?.city ?? "your address"}`
    : "Collect at the dock";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#0c2733;margin:0 0 12px">${escapeHtml(label)}</h2>
      <p style="font-size:13px;color:#444">Order <strong>${escapeHtml(order.orderNumber)}</strong></p>
      <table style="border-collapse:collapse">
        ${row("Customer", order.customerName)}
        ${row("Current status", label)}
        ${row("Delivery", delivery)}
        ${row("Payment status", order.paymentStatus)}
        ${row("Total", formatMoney(order.totalCents, order.currency))}
        ${row("Carrier", order.shippingCarrier)}
        ${row("Tracking number", order.trackingNumber)}
      </table>
      <p style="font-size:13px;color:#444">Please contact Exuma Yacht Club if you have questions about this update.</p>
    </div>`;
  await sendCustomerEmail({
    to: order.email,
    subject: `${label} — ${order.orderNumber}`,
    html,
  });
}
