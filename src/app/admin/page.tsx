import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { AdminShell } from "@/components/admin-shell";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  const stats = await db.dashboardStats();

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
