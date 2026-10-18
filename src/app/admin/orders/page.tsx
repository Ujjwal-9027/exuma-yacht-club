import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { AdminShell } from "@/components/admin-shell";
import { updateOrderStatus } from "@/app/admin/actions";
import { formatDate, formatMoney } from "@/lib/format";
import { OrderFilters } from "./order-filters";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Orders",
  robots: { index: false, follow: false },
};

const STATUSES = [
  "processing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
] as const;

function StatusForm({ id, current }: { id: number; current: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STATUSES.map((status) => {
        const action = updateOrderStatus.bind(null, id, status);
        return (
          <form key={status} action={action}>
            <button
              type="submit"
              aria-pressed={current === status}
              className={`border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                current === status
                  ? "border-navy-900 bg-navy-900 text-ivory-50"
                  : "border-sand-300 bg-white text-ink-500 hover:border-navy-800"
              }`}
            >
              {status}
            </button>
          </form>
        );
      })}
    </div>
  );
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; payment?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const status = STATUSES.includes(params.status as (typeof STATUSES)[number])
    ? params.status
    : "";
  const payment = ["unpaid", "pending", "paid", "failed", "refunded"].includes(
    params.payment ?? "",
  )
    ? params.payment
    : "";
  const rows = await db.listOrders({
    q: query || undefined,
    status: status || undefined,
    paymentStatus: payment || undefined,
  });

  return (
    <AdminShell title="Orders">
      <OrderFilters
        initialQuery={query}
        initialStatus={status ?? ""}
        initialPayment={payment ?? ""}
      />
      {rows.length === 0 ? (
        <p className="border border-sand-300 bg-white p-8 text-sm text-ink-500">
          No orders yet. Orders placed in the gift shop appear here.
        </p>
      ) : (
        <div className="overflow-x-auto border border-sand-300 bg-white">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-ivory-100">
                {[
                  "Placed",
                  "Order",
                  "Customer",
                  "Items",
                  "Total",
                  "Delivery",
                  "Payment",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-900"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3.5 whitespace-nowrap text-ink-500">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-navy-900">
                    <Link
                      href={`/admin/orders/${row.id}`}
                      className="underline decoration-gold-500 underline-offset-2"
                    >
                      {row.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-navy-900">
                      {row.customerName}
                    </span>
                    <a
                      href={`mailto:${row.email}`}
                      className="block text-xs text-navy-700 underline decoration-gold-500 underline-offset-2"
                    >
                      {row.email}
                    </a>
                    {row.phone && (
                      <span className="block text-xs text-ink-400">
                        {row.phone}
                      </span>
                    )}
                  </td>
                  <td className="max-w-xs px-4 py-3.5 text-ink-500">
                    {row.items
                      .map(
                        (i) =>
                          `${i.name}${i.size ? ` (${i.size})` : ""}${i.color ? ` [${i.color}]` : ""} ×${i.qty}`,
                      )
                      .join(", ")}
                    {row.notes && (
                      <span className="block text-xs text-ink-400">
                        Note: {row.notes}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-navy-900">
                    {formatMoney(row.totalCents, row.currency)}
                  </td>
                  <td className="px-4 py-3.5 text-ink-500">
                    {row.fulfillment === "ship"
                      ? `Deliver (${formatMoney(row.shippingFeeCents ?? 0, row.currency)})`
                      : "Collect at dock"}
                  </td>
                  <td className="px-4 py-3.5 text-ink-500">
                    {row.paymentMethod === "at_pickup"
                      ? "At pickup"
                      : row.paymentMethod}
                    <span className="block text-xs">({row.paymentStatus})</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusForm
                      id={row.id}
                      current={row.fulfillmentStatus ?? row.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
