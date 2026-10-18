"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const statuses = [
  "",
  "processing",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
] as const;
const payments = [
  "",
  "unpaid",
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

type Props = {
  initialQuery: string;
  initialStatus: string;
  initialPayment: string;
};

function buildUrl(
  pathname: string,
  query: string,
  status: string,
  payment: string,
): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (status) params.set("status", status);
  if (payment) params.set("payment", payment);
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function OrderFilters({
  initialQuery,
  initialStatus,
  initialPayment,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [payment, setPayment] = useState(initialPayment);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace(buildUrl(pathname, query, status, payment), {
        scroll: false,
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [pathname, payment, query, router, status]);

  function apply(nextStatus = status, nextPayment = payment) {
    router.replace(buildUrl(pathname, query, nextStatus, nextPayment), {
      scroll: false,
    });
  }

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <label
        className="flex min-w-[min(100%,24rem)] flex-1 gap-2"
        role="search"
      >
        <span className="sr-only">Search orders</span>
        <input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search order, customer, or email"
          className="field"
        />
        <button
          type="button"
          onClick={() => apply()}
          className="border border-navy-900 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-900 hover:bg-navy-900 hover:text-ivory-50"
        >
          Search
        </button>
      </label>
      <label>
        <span className="sr-only">Fulfilment status</span>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            apply(event.target.value, payment);
          }}
          className="field max-w-[12rem]"
        >
          <option value="">All fulfilment</option>
          {statuses.slice(1).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Payment status</span>
        <select
          value={payment}
          onChange={(event) => {
            setPayment(event.target.value);
            apply(status, event.target.value);
          }}
          className="field max-w-[12rem]"
        >
          <option value="">All payment</option>
          {payments.slice(1).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={() => apply()}
        className="border border-sand-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-900 hover:border-navy-900"
      >
        Filter
      </button>
    </div>
  );
}
