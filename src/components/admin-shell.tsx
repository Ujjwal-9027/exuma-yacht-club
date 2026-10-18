import Link from "next/link";
import type { ReactNode } from "react";
import {
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { logoutAction } from "@/app/admin/actions";
import { AnchorMark } from "@/components/logo";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Website content", href: "/admin/content", icon: Settings },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

/** Server shell for every authenticated admin page. */
export async function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  await requireAdmin();
  const unreadInquiries = await db.count("inquiries", {
    readAt: { $exists: false },
  });
  return (
    <div className="min-h-[70vh] bg-[#f4f3ef] lg:flex">
      <aside className="border-b border-navy-800 bg-navy-950 text-ivory-100 lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:w-64 lg:overflow-y-auto lg:self-start lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <AnchorMark className="h-5 w-5 text-gold-400" />
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em]">
              EYC Admin
            </span>
          </Link>
          <span className="hidden pt-2 text-[10px] uppercase tracking-[0.18em] text-ivory-100/45 lg:block">
            Operations console
          </span>
        </div>
        <nav
          aria-label="Admin"
          className="overflow-x-auto px-3 pb-3 lg:px-4 lg:pb-6"
        >
          <ul className="flex min-w-max gap-1 lg:block">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory-100/70 transition-colors hover:bg-ivory-100/10 hover:text-gold-400"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                    {item.href === "/admin/inquiries" &&
                      unreadInquiries > 0 && (
                        <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-navy-950">
                          {unreadInquiries > 99 ? "99+" : unreadInquiries}
                        </span>
                      )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden border-t border-ivory-100/10 px-4 py-5 lg:block">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-ivory-100/60 hover:text-gold-400"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> View website
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-ivory-100/60 hover:text-gold-400"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand-300 pb-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                Exuma Yacht Club
              </p>
              <h1 className="mt-2 font-display text-3xl text-navy-900">
                {title}
              </h1>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy-800 lg:hidden"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> Website
            </Link>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
