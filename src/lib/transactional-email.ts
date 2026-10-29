import type { Order } from "@/db/schema";
import { site } from "@/lib/site";
import { formatMoney } from "@/lib/format";
import { escapeHtml } from "@/lib/escape-html";
import {
  getOrderStatusEmailTemplate,
  renderOrderEmailTemplate,
} from "@/lib/order-email-templates";

export type TransactionalOrderStatus =
  | "pending"
  | "processing"
  | "ready"
  | "shipped"
  | "delivered"
  | "fulfilled"
  | "cancelled";

const statusLabels: Record<TransactionalOrderStatus, string> = {
  pending: "Order received",
  processing: "Order processing",
  ready: "Ready for pickup",
  shipped: "Order shipped",
  delivered: "Order delivered",
  fulfilled: "Order fulfilled",
  cancelled: "Order cancelled",
};

const statusColors: Record<TransactionalOrderStatus, string> = {
  pending: "#B18A4A",
  processing: "#B18A4A",
  ready: "#B18A4A",
  shipped: "#B18A4A",
  delivered: "#B18A4A",
  fulfilled: "#B18A4A",
  cancelled: "#9A3F35",
};

function meaningful(value: string | null | undefined): value is string {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return Boolean(normalized && !["-", "—", "n/a", "na", "none", "null", "undefined", "i", "iiiii", "placeholder"].includes(normalized));
}

function paymentStatusLabel(order: Order): string {
  const status = order.paymentStatus.toLowerCase();
  if (status === "paid") return "Paid";
  if (status === "pending") return "Payment pending";
  if (status === "refunded") return "Refunded";
  if (status === "failed") return "Payment failed";
  if (order.paymentMethod === "at_pickup") {
    return order.fulfillment === "ship" ? "Payment to be arranged" : "Pay at pickup";
  }
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Not available";
}

function deliveryLabel(order: Order): string {
  if (order.fulfillment !== "ship") return "Store pickup";
  return `${order.deliverySpeed === "priority" ? "Priority" : "Standard"} delivery`;
}

function addressHtml(order: Order): string {
  if (!order.shippingAddress) return "";
  return [
    order.shippingAddress.addressLine1,
    order.shippingAddress.addressLine2,
    [order.shippingAddress.city, order.shippingAddress.region, order.shippingAddress.postalCode].filter(Boolean).join(", "),
    order.shippingAddress.country,
  ].filter((value): value is string => Boolean(value)).map((value) => escapeHtml(value)).join("<br>");
}

function itemRows(order: Order): string {
  return order.items.map((item) => {
    const image = meaningful(item.image)
      ? `<img src="${escapeHtml(item.image!)}" width="56" height="56" alt="${escapeHtml(item.name)}" style="display:block;width:56px;height:56px;object-fit:cover;border:1px solid #E7DCC6;background:#F7F1E5;" />`
      : `<div style="width:56px;height:56px;background:#F7F1E5;border:1px solid #E7DCC6;"></div>`;
    const variant = [item.size, item.color].filter(meaningful).map(escapeHtml).join(" · ");
    return `<tr>
      <td style="padding:12px 0;border-bottom:1px solid #E7DCC6;vertical-align:top;width:68px;">${image}</td>
      <td style="padding:12px 10px;border-bottom:1px solid #E7DCC6;vertical-align:top;color:#0D2935;font-size:14px;line-height:20px;">
        <strong>${escapeHtml(item.name)}</strong>${variant ? `<br><span style="color:#6B7477;font-size:12px;">${variant}</span>` : ""}<br><span style="color:#6B7477;font-size:12px;">Quantity ${item.qty}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #E7DCC6;text-align:right;vertical-align:top;color:#0D2935;font-size:14px;white-space:nowrap;">${formatMoney(item.priceCents * item.qty, order.currency)}</td>
    </tr>`;
  }).join("");
}

function summaryRow(label: string, value: string): string {
  return `<tr><td style="padding:6px 0;color:#6B7477;font-size:12px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;text-align:right;color:#0D2935;font-size:13px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td></tr>`;
}

function plainTextBody(order: Order, status: TransactionalOrderStatus, message: string): string {
  const lines = [
    `Exuma Yacht Club — ${statusLabels[status]}`,
    `Order ${order.orderNumber}`,
    "",
    message.replace(/<br\s*\/?>(\s*)/gi, "\n").replace(/<[^>]+>/g, ""),
    "",
    `Customer: ${order.customerName}`,
    `Order total: ${formatMoney(order.totalCents, order.currency)}`,
    `Payment: ${paymentStatusLabel(order)}`,
    `Fulfilment: ${deliveryLabel(order)}`,
  ];
  if (order.fulfillment === "ship" && order.shippingAddress) lines.push(`Shipping address: ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`);
  if (order.fulfillment !== "ship") lines.push("Pickup: Exuma Yacht Club marina gift shop, Queen's Highway, George Town.");
  if (status === "cancelled" && meaningful(order.cancellationReason)) {
    lines.push(`Cancellation reason: ${order.cancellationReason}`);
  }
  return lines.join("\n");
}

export function buildTransactionalOrderEmail(
  order: Order,
  status: TransactionalOrderStatus,
  templates?: Parameters<typeof getOrderStatusEmailTemplate>[1],
): { subject: string; html: string; text: string } {
  const label = statusLabels[status];
  const delivery = deliveryLabel(order);
  const rendered = renderOrderEmailTemplate(
    getOrderStatusEmailTemplate(status, templates),
    {
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      status: label,
      delivery,
      paymentStatus: paymentStatusLabel(order),
      total: formatMoney(order.totalCents, order.currency),
      carrier: meaningful(order.shippingCarrier) ? order.shippingCarrier : "",
      trackingNumber: meaningful(order.trackingNumber) ? order.trackingNumber : "",
      cancellationReason: meaningful(order.cancellationReason) ? order.cancellationReason : "",
    },
  );
  const pickup = order.fulfillment !== "ship";
  const statusMessage = status === "ready"
    ? `Your order is ready for collection at the Exuma Yacht Club marina gift shop. Please bring your order number when you arrive.`
    : rendered.body;
  const logoUrl = "/logo/EYCflag.png";
  const pickupOrDelivery = pickup
    ? `<tr><td style="padding:16px 0 0;"><div style="padding:16px;background:#F7F1E5;border-left:3px solid #B18A4A;"><strong style="color:#0D2935;font-size:14px;">Pickup details</strong><br><span style="color:#4F5D61;font-size:13px;line-height:20px;">Exuma Yacht Club marina gift shop<br>Queen's Highway, George Town, The Bahamas<br>Please bring your order number.</span></div></td></tr>`
    : `<tr><td style="padding:16px 0 0;"><div style="padding:16px;background:#F7F1E5;border-left:3px solid #B18A4A;"><strong style="color:#0D2935;font-size:14px;">Delivery details</strong><br><span style="color:#4F5D61;font-size:13px;line-height:20px;">${addressHtml(order)}</span>${meaningful(order.shippingCarrier) ? `<br><span style="color:#4F5D61;font-size:13px;">Carrier: ${escapeHtml(order.shippingCarrier)}</span>` : ""}${meaningful(order.trackingNumber) ? `<br><span style="color:#4F5D61;font-size:13px;">Tracking: ${escapeHtml(order.trackingNumber)}</span>` : ""}</div></td></tr>`;
  const cancellationReason = status === "cancelled" && meaningful(order.cancellationReason)
    ? `<tr><td style="padding:16px 0 0;"><div style="padding:16px;background:#FBF1EF;border-left:3px solid #9A3F35;"><strong style="color:#0D2935;font-size:14px;">Cancellation reason</strong><br><span style="color:#4F5D61;font-size:13px;line-height:20px;">${escapeHtml(order.cancellationReason)}</span></div></td></tr>`
    : "";
  const html = `<!doctype html><html lang="en"><head><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;padding:0;background:#F7F1E5;color:#0D2935;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F1E5;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;">
<tr><td align="center" style="background:#0D2935;padding:28px 24px 24px;"><img src="${escapeHtml(logoUrl)}" width="120" alt="Exuma Yacht Club" style="display:block;width:120px;height:auto;border:0;"><div style="margin-top:12px;color:#F7F1E5;font-size:11px;letter-spacing:2px;font-weight:bold;">EXUMA YACHT CLUB</div><div style="margin-top:5px;color:#B18A4A;font-size:10px;letter-spacing:1.5px;">GEORGE TOWN · BAHAMAS</div></td></tr>
<tr><td style="padding:34px 28px 30px;"><div style="display:inline-block;padding:6px 10px;border:1px solid ${statusColors[status]};color:${statusColors[status]};font-size:10px;font-weight:bold;letter-spacing:1.5px;">${escapeHtml(label.toUpperCase())}</div><h1 style="margin:16px 0 8px;color:#0D2935;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:36px;font-weight:normal;">${escapeHtml(rendered.subject)}</h1><p style="margin:0;color:#6B7477;font-size:13px;">Order <strong style="color:#0D2935;">${escapeHtml(order.orderNumber)}</strong></p><div style="margin-top:20px;width:44px;height:2px;background:#B18A4A;"></div><p style="margin:22px 0 0;color:#405054;font-size:14px;line-height:23px;">${statusMessage}</p></td></tr>
<tr><td style="padding:0 28px 28px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E7DCC6;border-bottom:1px solid #E7DCC6;padding:12px 0;">${summaryRow("Order date", new Date(order.createdAt).toLocaleDateString("en-US"))}${summaryRow("Customer", order.customerName)}${summaryRow("Total", formatMoney(order.totalCents, order.currency))}${summaryRow("Payment", paymentStatusLabel(order))}${summaryRow("Fulfilment", delivery)}${summaryRow("Status", label)}</table>${cancellationReason}${pickupOrDelivery}</td></tr>
<tr><td style="padding:0 28px 30px;"><h2 style="margin:0 0 8px;color:#0D2935;font-family:Georgia,'Times New Roman',serif;font-size:21px;font-weight:normal;">Order summary</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows(order)}<tr><td colspan="2" style="padding:16px 0 0;color:#6B7477;font-size:13px;">Order total</td><td style="padding:16px 0 0;text-align:right;color:#0D2935;font-size:16px;font-weight:bold;white-space:nowrap;">${formatMoney(order.totalCents, order.currency)}</td></tr></table></td></tr>
<tr><td style="background:#0D2935;padding:26px 28px;text-align:center;color:#F7F1E5;"><div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;">Exuma Yacht Club</div><div style="margin-top:5px;color:#B18A4A;font-size:11px;letter-spacing:1px;">GEORGE TOWN, BAHAMAS</div><div style="margin-top:14px;color:#C8D0D0;font-size:12px;line-height:20px;">${escapeHtml(site.phone.label)} · ${escapeHtml(site.url)}<br>Thank you for choosing Exuma Yacht Club.</div></td></tr>
</table></td></tr></table></body></html>`;
  return { subject: rendered.subject, html, text: plainTextBody(order, status, statusMessage) };
}
