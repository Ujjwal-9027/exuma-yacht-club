import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { updateOrderDetailsAction } from "@/app/admin/actions";
import { db } from "@/db";
import { formatDate, formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Order detail",
  robots: { index: false, follow: false },
};
const statuses = ["processing", "ready", "shipped", "delivered", "cancelled"];

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const order = await db.getOrderById(Number(id));
  if (!order) notFound();
  const currentStatus = order.fulfillmentStatus ?? order.status;
  return (
    <AdminShell title={`Order ${order.orderNumber}`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-500">
          Placed {formatDate(order.createdAt)} · payment remains{" "}
          <span className="font-semibold text-navy-900">
            {order.paymentStatus}
          </span>
          .
        </p>
        <Link
          href="/admin/orders"
          className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-navy-800 underline decoration-gold-500 underline-offset-4"
        >
          Back to orders
        </Link>
      </div>
      {query.error === "cancel-reason" && (
        <p role="alert" className="mb-6 border border-[#e3c2bb] bg-[#fbf1ef] p-4 text-sm text-[#8f3526]">
          Enter a cancellation reason before cancelling this order.
        </p>
      )}
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <section className="border border-sand-300 bg-white p-6 sm:p-8">
          <h2 className="font-display text-2xl text-navy-900">Order items</h2>
          <ul className="mt-6 divide-y divide-sand-200">
            {order.items.map((item, index) => (
              <li
                key={`${item.slug}-${index}`}
                className="flex justify-between gap-5 py-4 text-sm"
              >
                <span className="text-ink-700">
                  {item.name}
                  <span className="block text-xs text-ink-400">
                    Qty {item.qty}
                    {item.size ? ` · ${item.size}` : ""}
                    {item.color ? ` · ${item.color}` : ""}
                  </span>
                </span>
                <span className="font-semibold text-navy-900">
                  {formatMoney(item.priceCents * item.qty, order.currency)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-sand-200 pt-5 text-sm font-semibold text-navy-900">
            <span>Items</span>
            <span>{formatMoney(order.subtotalCents, order.currency)}</span>
          </div>
          {order.fulfillment === "ship" && (
            <div className="flex justify-between pt-2 text-sm text-ink-500">
              <span>Delivery</span>
              <span>
                {formatMoney(order.shippingFeeCents ?? 0, order.currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2 text-sm font-semibold text-navy-900">
            <span>Total</span>
            <span>{formatMoney(order.totalCents, order.currency)}</span>
          </div>
          {order.notes && (
            <p className="mt-6 border border-sand-200 bg-ivory-100 p-4 text-sm text-ink-700">
              <span className="font-semibold text-navy-900">
                Customer note:
              </span>{" "}
              {order.notes}
            </p>
          )}
        </section>
        <aside className="space-y-5">
          <section className="border border-sand-300 bg-white p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">
              Customer
            </h2>
            <p className="mt-4 font-semibold text-navy-900">
              {order.customerName}
            </p>
            <a
              href={`mailto:${order.email}`}
              className="mt-1 block text-sm text-navy-700 underline decoration-gold-500 underline-offset-2"
            >
              {order.email}
            </a>
            {order.phone && (
              <p className="mt-1 text-sm text-ink-500">{order.phone}</p>
            )}
            <p className="mt-4 text-sm text-ink-500">
              {order.fulfillment === "ship"
                ? `${order.deliverySpeed === "priority" ? "Priority" : "Standard"} delivery requested`
                : "Collect at dock"}
            </p>
          </section>
          <section className="border border-sand-300 bg-white p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">
              Fulfilment
            </h2>
            <form
              action={updateOrderDetailsAction.bind(null, order.id)}
              className="mt-4 space-y-4"
            >
              <div>
                <label htmlFor="status" className="field-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={currentStatus}
                  className="field"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="shippingCarrier" className="field-label">
                  Carrier
                </label>
                <input
                  id="shippingCarrier"
                  name="shippingCarrier"
                  defaultValue={order.shippingCarrier ?? ""}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="trackingNumber" className="field-label">
                  Tracking number
                </label>
                <input
                  id="trackingNumber"
                  name="trackingNumber"
                  defaultValue={order.trackingNumber ?? ""}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="cancellationReason" className="field-label">
                  Cancellation reason
                </label>
                <textarea
                  id="cancellationReason"
                  name="cancellationReason"
                  defaultValue={order.cancellationReason ?? ""}
                  rows={3}
                  maxLength={1000}
                  placeholder="Required when cancelling an order"
                  className="field resize-y"
                />
              </div>
              <button
                type="submit"
                className="w-full border border-navy-900 bg-navy-900 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory-50 hover:bg-transparent hover:text-navy-900"
              >
                Save fulfilment
              </button>
            </form>
            <p className="mt-4 text-xs leading-relaxed text-ink-400">
              Payment status is read-only here and must come from a verified
              provider event. Delivery fees are calculated from the checkout
              address and selected delivery speed.
            </p>
          </section>
        </aside>
      </div>
    </AdminShell>
  );
}
