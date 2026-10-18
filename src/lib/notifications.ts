import type { Inquiry, Order } from "@/db/schema";
import { formatMoney } from "@/lib/format";
import { escapeHtml, sendCustomerEmail, sendNotification } from "@/lib/email";
import { getManagedSiteSettings } from "@/lib/managed-site";
import { buildTransactionalOrderEmail } from "@/lib/transactional-email";

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
  const settings = await getManagedSiteSettings();
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
    to: settings.inquiryNotificationEmail ?? "",
    subject: `${typeLabel} — ${inquiry.fullName}`,
    html,
    replyTo: inquiry.email,
  });
}

export async function notifyNewOrder(order: Order): Promise<void> {
  const settings = await getManagedSiteSettings();
  const paymentStatus = order.paymentStatus.toLowerCase();
  const paymentLabel = paymentStatus === "paid"
    ? "Paid"
    : paymentStatus === "pending"
      ? "Payment pending"
      : paymentStatus === "refunded"
        ? "Refunded"
        : paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1);
  const totalLabel = paymentStatus === "paid" ? "Order total" : "Total due";
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
        ${row("Payment", paymentLabel)}
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
      <p style="font-size:14px"><strong>${totalLabel}: ${formatMoney(order.totalCents, order.currency)}</strong></p>
    </div>`;
  await sendNotification({
    to: settings.orderNotificationEmail ?? "",
    subject: `New order ${order.orderNumber} — ${formatMoney(order.totalCents, order.currency)}`,
    html,
    replyTo: order.email,
  });
}

/** Branded customer confirmation email, sent after the order is persisted. */
export async function sendOrderConfirmationToCustomer(order: Order): Promise<void> {
  const settings = await getManagedSiteSettings();
  const email = buildTransactionalOrderEmail(order, "pending", settings.orderStatusEmailTemplates);
  await sendCustomerEmail({ to: order.email, subject: email.subject, html: email.html, text: email.text });
}

export async function sendOrderCancellationToCustomer(order: Order, reason: string): Promise<void> {
  const settings = await getManagedSiteSettings();
  const email = buildTransactionalOrderEmail(
    { ...order, cancellationReason: reason },
    "cancelled",
    settings.orderStatusEmailTemplates,
  );
  await sendCustomerEmail({ to: order.email, subject: email.subject, html: email.html, text: email.text });
}

export async function sendOrderStatusUpdateToCustomer(
  order: Order,
  status: string,
): Promise<void> {
  const settings = await getManagedSiteSettings();
  const validStatuses = new Set([
    "pending",
    "processing",
    "ready",
    "shipped",
    "delivered",
    "fulfilled",
    "cancelled",
  ]);
  const emailStatus = validStatuses.has(status) ? status : "processing";
  const email = buildTransactionalOrderEmail(
    order,
    emailStatus as "pending" | "processing" | "ready" | "shipped" | "delivered" | "fulfilled" | "cancelled",
    settings.orderStatusEmailTemplates,
  );
  await sendCustomerEmail({ to: order.email, subject: email.subject, html: email.html, text: email.text });
}
