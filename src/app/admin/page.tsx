import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { AdminShell } from "@/components/admin-shell";
import { formatDate, formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  const [stats, recentOrders, recentInquiries] = await Promise.all([
    db.dashboardStats(),
    db.listOrders({ limit: 5 }),
    db.recentInquiries(5),
  ]);

  const cards = [
    {
      label: "Orders awaiting action",
      value: stats.pendingOrders,
      href: "/admin/orders",
      note: "Processing or awaiting fulfilment",
    },
    {
      label: "Products",
      value: stats.productCount,
      href: "/admin/products",
      note: "Gift shop catalogue entries",
    },
    {
      label: "New inquiries",
      value: stats.newInquiries,
      href: "/admin/inquiries?status=new",
      note: "Messages awaiting review",
    },
    {
      label: "Unread messages",
      value: stats.unreadInquiries,
      href: "/admin/inquiries",
      note: "All inquiry types",
    },
    {
      label: "Orders awaiting confirmation",
      value: stats.pendingOrders,
      href: "/admin/orders?status=processing",
      note: "Processing or pending fulfilment",
    },
    {
      label: "Ready for pickup",
      value: stats.readyOrders,
      href: "/admin/orders?status=ready",
      note: "Ready or awaiting collection",
    },
    {
      label: "Verified sales",
      value: formatMoney(stats.salesCents, "USD"),
      href: "/admin/orders",
      note: `${stats.paidOrders} paid order${stats.paidOrders === 1 ? "" : "s"}`,
    },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex h-full flex-col border border-sand-300 bg-white p-7 transition-colors hover:border-gold-500"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
              {card.label}
            </p>
            <p className="mt-3 font-display text-4xl text-navy-900">
              {card.value}
            </p>
            <p className="mt-auto pt-4 text-xs text-ink-400">{card.note}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="border border-sand-300 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-navy-900">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-800 underline decoration-gold-500 underline-offset-4"
            >
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-5 text-sm text-ink-500">
              No orders have been placed yet.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-sand-200">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-2"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="mt-1 truncate text-xs text-ink-500">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-navy-900">
                    {formatMoney(order.totalCents, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="border border-sand-300 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-navy-900">
              Recent inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-800 underline decoration-gold-500 underline-offset-4"
            >
              View all
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="mt-5 text-sm text-ink-500">
              No inquiries have arrived yet.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-sand-200">
              {recentInquiries.map((inquiry) => (
                <li
                  key={inquiry.id}
                  className="flex items-start justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-2"
                    >
                      {inquiry.fullName}
                    </Link>
                    <p className="mt-1 truncate text-xs text-ink-500">
                      {inquiry.type} · {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                  {!inquiry.readAt && (
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold-500"
                      title="Unread"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="border border-sand-300 bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">
            Paid orders
          </p>
          <p className="mt-2 text-2xl font-semibold text-navy-900">
            {stats.paidOrders}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            Payment status is provider-controlled.
          </p>
        </div>
        <div className="border border-sand-300 bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">
            Cancelled
          </p>
          <p className="mt-2 text-2xl font-semibold text-navy-900">
            {stats.cancelledOrders}
          </p>
          <p className="mt-1 text-xs text-ink-500">Fulfilment cancellations.</p>
        </div>
        <div className="border border-sand-300 bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">
            Low stock
          </p>
          <p className="mt-2 text-2xl font-semibold text-navy-900">
            {stats.lowStockCount}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            Tracked products at five or fewer.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
