import type {
  OrderStatusEmailStatus,
  OrderStatusEmailTemplate,
  OrderStatusEmailTemplates,
} from "@/db/schema";

export const ORDER_STATUS_EMAIL_STATUSES: readonly OrderStatusEmailStatus[] = [
  "pending",
  "processing",
  "ready",
  "shipped",
  "delivered",
  "fulfilled",
  "cancelled",
];

export const ORDER_STATUS_EMAIL_LABELS: Record<OrderStatusEmailStatus, string> = {
  pending: "Order placed",
  processing: "Order processing",
  ready: "Ready for pickup",
  shipped: "Order shipped",
  delivered: "Order delivered",
  fulfilled: "Order fulfilled",
  cancelled: "Order cancelled",
};

export const DEFAULT_ORDER_STATUS_EMAIL_TEMPLATES: Record<
  OrderStatusEmailStatus,
  OrderStatusEmailTemplate
> = {
  pending: {
    subject: "Your order {{orderNumber}} has been placed",
    body: "Hello {{customerName}},\n\nThank you for choosing Exuma Yacht Club. Your order has been placed successfully and our team will review it shortly.\n\nWe will send another update as your order moves forward.\n\nThank you,\nExuma Yacht Club",
  },
  processing: {
    subject: "Your order {{orderNumber}} is being prepared",
    body: "Hello {{customerName}},\n\nOur team is now preparing your order. We will send another update when it is ready.\n\nThank you,\nExuma Yacht Club",
  },
  ready: {
    subject: "Your order {{orderNumber}} is ready for pickup",
    body: "Hello {{customerName}},\n\nYour order is ready for pickup at the marina gift shop. Please bring your order number when you collect it.\n\nThank you,\nExuma Yacht Club",
  },
  shipped: {
    subject: "Your order {{orderNumber}} has shipped",
    body: "Hello {{customerName}},\n\nYour order has been shipped. We will continue to share delivery information as it becomes available.\n\nThank you,\nExuma Yacht Club",
  },
  delivered: {
    subject: "Your order {{orderNumber}} was delivered",
    body: "Hello {{customerName}},\n\nOur records show that your order was delivered. Please contact us if you need assistance.\n\nThank you,\nExuma Yacht Club",
  },
  fulfilled: {
    subject: "Your order {{orderNumber}} is complete",
    body: "Hello {{customerName}},\n\nYour order has been marked complete. Thank you for shopping with Exuma Yacht Club.\n\nThank you,\nExuma Yacht Club",
  },
  cancelled: {
    subject: "Your order {{orderNumber}} has been cancelled",
    body: "Hello {{customerName}},\n\nYour order has been cancelled.\n\nCancellation reason: {{cancellationReason}}\n\nIf you have questions, please contact Exuma Yacht Club.\n\nThank you,\nExuma Yacht Club",
  },
};

export function getOrderStatusEmailTemplate(
  status: string,
  templates?: OrderStatusEmailTemplates,
): OrderStatusEmailTemplate {
  const key = status as OrderStatusEmailStatus;
  return templates?.[key] ?? DEFAULT_ORDER_STATUS_EMAIL_TEMPLATES[key] ?? DEFAULT_ORDER_STATUS_EMAIL_TEMPLATES.processing;
}

export function renderOrderEmailTemplate(
  template: OrderStatusEmailTemplate,
  values: Record<string, string>,
): { subject: string; body: string } {
  const replace = (text: string, transform: (value: string) => string) =>
    text.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) =>
      transform(values[key] ?? ""),
    );
  const subject = replace(template.subject, (value) => value);
  const body = replace(template.body, (value) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;"),
  ).replace(/\r?\n/g, "<br />");
  return { subject, body };
}
