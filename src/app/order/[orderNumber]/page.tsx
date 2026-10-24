import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import { db } from "@/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import { site } from "@/lib/site";
import { formatMoney } from "@/lib/format";
import { ButtonLink, Container } from "@/components/ui";
import { ReceiptActions } from "@/components/receipt-actions";
import { OrderAccessForm } from "@/components/order-access-form";
import { PAYMENT_REFERENCE_PLACEHOLDER, toReceiptData } from "@/lib/receipt";
import { hasOrderAccess, orderAccessCookieName } from "@/lib/order-access";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false },
};

type Props = { params: Promise<{ orderNumber: string }> };

const STATUS_LABELS: Record<string, string> = {
  pending: "Received — awaiting confirmation",
  ready: "Ready for pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Confirmation is shown only for orders that exist in the database. */
export default async function OrderPage({ params }: Props) {
  const { orderNumber } = await params;
  if (!/^EYC-[A-Z0-9]+$/.test(orderNumber)) notFound();

  const order = await db.getOrderByNumber(orderNumber);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(
    orderAccessCookieName(orderNumber),
  )?.value;
  if (!hasOrderAccess(order, accessToken, await isAdminAuthed())) {
    return <OrderAccessForm orderNumber={orderNumber} />;
  }

  return (
    <section className="py-14 lg:py-20">
      <Container className="max-w-4xl">
        <div className="border border-sand-300 bg-white p-7 sm:p-12">
          <CheckCircle2
            className="h-11 w-11 text-gold-600"
            strokeWidth={1.3}
            aria-hidden="true"
          />
          <p className="overline-label mt-6">Order {order.orderNumber}</p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-navy-900 sm:text-4xl">
            Thank you, {order.customerName.split(" ")[0]} — your order is in.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-500">
            We&apos;ve received your order and will confirm it shortly by email
            at{" "}
            <span className="font-semibold text-navy-900">{order.email}</span>.
            {order.paymentMethod === "at_pickup"
              ? order.fulfillment === "ship"
                ? "We will contact you to arrange payment for shipping."
                : "Please pay when you collect at the marina gift shop."
              : order.paymentMethod === "demo_card"
                ? "Your demo debit-card payment has been recorded."
                : "Your demo PayPal payment has been recorded."}
          </p>

          <div className="mt-10 border-t border-sand-200 pt-8">
            <h2 className="font-display text-xl text-navy-900">
              Order details
            </h2>
            <ul className="mt-5 space-y-4">
              {order.items.map((item, i) => (
                <li
                  key={`${item.slug}-${item.size ?? ""}-${i}`}
                  className="flex items-center gap-4"
                >
                  {item.image && (
                    <span className="relative block h-14 w-14 shrink-0 overflow-hidden border border-sand-200 bg-ivory-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  <span className="flex-1 text-sm text-ink-700">
                    {item.name}
                    {item.size && (
                      <span className="text-ink-400"> · {item.size}</span>
                    )}
                    {item.color && (
                      <span className="text-ink-400"> · {item.color}</span>
                    )}
                    <span className="block text-xs text-ink-400">
                      Qty {item.qty}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-navy-900">
                    {formatMoney(item.priceCents * item.qty, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between border-t border-sand-200 pt-5">
              <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-900">
                {order.fulfillment === "ship"
                  ? "Order total"
                  : "Total due at pickup"}
              </span>
              <span className="font-display text-xl text-navy-900">
                {formatMoney(order.totalCents, order.currency)}
              </span>
            </div>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                  Status
                </dt>
                <dd className="mt-1 text-ink-700">
                  {STATUS_LABELS[order.status] ?? order.status}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                  Delivery
                </dt>
                <dd className="mt-1 text-ink-700">
                  {order.fulfillment === "ship"
                    ? `${order.deliverySpeed === "priority" ? "Priority" : "Standard"} delivery to ${order.shippingAddress?.city ?? "your address"}${order.shippingFeeCents === 0 ? " — free" : ` — ${formatMoney(order.shippingFeeCents ?? 0, order.currency)}`}`
                    : "Collect at the dock (marina gift shop)"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                  Payment
                </dt>
                <dd className="mt-1 text-ink-700">
                  {order.paymentMethod === "at_pickup"
                    ? order.fulfillment === "ship"
                      ? "To be arranged"
                      : "Due at pickup"
                    : order.paymentMethod === "demo_card"
                      ? "Demo debit card"
                      : "Demo PayPal"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                  Payment reference
                </dt>
                <dd className="mt-1 text-ink-700">
                  {PAYMENT_REFERENCE_PLACEHOLDER}
                </dd>
              </div>
            </dl>
          </div>

          <ReceiptActions data={toReceiptData(order)} />

          <div className="mt-10 grid gap-px overflow-hidden border border-sand-200 bg-sand-200 sm:grid-cols-2">
            <div className="flex items-start gap-3 bg-ivory-100 p-5">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-ink-700">
                Collect at the gift shop — {site.address.street},{" "}
                {site.address.locality}, {site.address.country}. Bring your
                order number.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-ivory-100 p-5">
              <Phone
                className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-ink-700">
                Questions about your order? Call{" "}
                <a
                  href={site.phone.href}
                  className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-4"
                >
                  {site.phone.label}
                </a>{" "}
                or message us on WhatsApp.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/shop" variant="primary">
              Continue Shopping
            </ButtonLink>
            <ButtonLink href="/" variant="outline">
              Back to Home
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
