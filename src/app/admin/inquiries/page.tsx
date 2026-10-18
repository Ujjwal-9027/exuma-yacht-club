import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import type { InquiryStatus } from "@/db/schema";
import { AdminShell } from "@/components/admin-shell";
import { updateInquiryStatusAction } from "@/app/admin/actions";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Inquiries",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 20;
const inquiryTypes = [
  { value: "", label: "All" },
  { value: "general", label: "Contact" },
  { value: "dining", label: "Dining" },
  { value: "dockage", label: "Dockage" },
  { value: "stay", label: "Stay" },
  { value: "fuel", label: "Fuel" },
] as const;
const statuses: { value: InquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "in_progress", label: "Processing" },
  { value: "replied", label: "Replied" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
  { value: "archived", label: "Archived" },
];

function dateValue(value: string | undefined, end = false): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T${end ? "23:59:59.999" : "00:00:00.000"}Z`);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

function labelForType(type: string): string {
  return type === "general"
    ? "Contact"
    : type.charAt(0).toUpperCase() + type.slice(1);
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    status?: InquiryStatus;
    from?: string;
    to?: string;
    page?: string;
    error?: string;
    saved?: string;
  }>;
}) {
  const params = await searchParams;
  const type = inquiryTypes.some((item) => item.value === params.type)
    ? params.type
    : "";
  const status = statuses.some((item) => item.value === params.status)
    ? params.status
    : undefined;
  const search = (params.q ?? "").trim().slice(0, 120);
  const from = dateValue(params.from);
  const to = dateValue(params.to, true);
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const filters = { type: type || undefined, status, search, from, to };
  const [inquiries, total] = await Promise.all([
    db.listInquiries({
      ...filters,
      skip: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    }),
    db.countInquiries(filters),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const exportParams = new URLSearchParams();
  if (search) exportParams.set("q", search);
  if (type) exportParams.set("type", type);
  if (status) exportParams.set("status", status);
  if (params.from) exportParams.set("from", params.from);
  if (params.to) exportParams.set("to", params.to);
  const querySuffix = exportParams.toString();
  const returnTo = `/admin/inquiries${querySuffix ? `?${querySuffix}&saved=status` : "?saved=status"}`;

  return (
    <AdminShell title="Inquiries">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-500">
            Contact, dining, dockage, stay, and fuel requests.
          </p>
          <p className="mt-2 text-xs text-ink-400">
            {total} result{total === 1 ? "" : "s"}
          </p>
        </div>
        <a
          href={`/api/admin/inquiries/export${querySuffix ? `?${querySuffix}` : ""}`}
          className="border border-navy-900 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-900 hover:bg-navy-900 hover:text-ivory-50"
        >
          Export CSV
        </a>
      </div>

      {params.error && (
        <p
          role="alert"
          className="mt-5 border border-[#e3c2bb] bg-[#fbf1ef] p-4 text-sm text-[#8f3526]"
        >
          The requested inquiry could not be found or the status was not
          allowed.
        </p>
      )}
      {params.saved === "status" && (
        <p
          role="status"
          className="mt-5 border border-green-700/30 bg-green-50 p-4 text-sm text-green-900"
        >
          Inquiry status updated.
        </p>
      )}

      <nav
        aria-label="Inquiry types"
        className="mt-6 flex gap-2 overflow-x-auto pb-1"
      >
        {inquiryTypes.map((item) => {
          const href = item.value
            ? `/admin/inquiries?type=${item.value}`
            : "/admin/inquiries";
          return (
            <Link
              key={item.value || "all"}
              href={href}
              className={`shrink-0 border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                type === item.value
                  ? "border-navy-900 bg-navy-900 text-ivory-50"
                  : "border-sand-300 bg-white text-ink-600 hover:border-navy-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form
        className="mt-5 grid gap-3 border border-sand-300 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6"
        role="search"
      >
        {type && <input type="hidden" name="type" value={type} />}
        <label className="lg:col-span-2">
          <span className="field-label">Search</span>
          <input
            name="q"
            defaultValue={search}
            placeholder="Name or email"
            className="field"
          />
        </label>
        <label>
          <span className="field-label">Status</span>
          <select name="status" defaultValue={status ?? ""} className="field">
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="field-label">From</span>
          <input
            name="from"
            type="date"
            defaultValue={params.from ?? ""}
            className="field"
          />
        </label>
        <label>
          <span className="field-label">To</span>
          <input
            name="to"
            type="date"
            defaultValue={params.to ?? ""}
            className="field"
          />
        </label>
        <button
          type="submit"
          className="self-end border border-navy-900 bg-navy-900 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory-50 hover:bg-transparent hover:text-navy-900"
        >
          Filter
        </button>
      </form>

      {inquiries.length === 0 ? (
        <div className="mt-6 border border-sand-300 bg-white p-10 text-center">
          <h2 className="font-display text-2xl text-navy-900">
            No inquiries found
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            New messages will appear here when guests contact the club.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-sand-300 bg-white">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-ivory-100">
                {["Date", "Type", "Guest", "Phone", "Message", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-900"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className={!inquiry.readAt ? "bg-gold-500/5" : ""}
                >
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-ink-500">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
                    {labelForType(inquiry.type)}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-2"
                    >
                      {inquiry.fullName}
                    </Link>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="mt-1 block text-xs text-ink-500 underline decoration-gold-500 underline-offset-2"
                    >
                      {inquiry.email}
                    </a>
                    {!inquiry.readAt && (
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                        Unread
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-ink-500">
                    {inquiry.phone || "—"}
                  </td>
                  <td className="max-w-xs px-4 py-4 text-xs leading-relaxed text-ink-500">
                    {(
                      inquiry.message ||
                      inquiry.serviceRequirements ||
                      "No message"
                    ).slice(0, 140)}
                    {(inquiry.message || inquiry.serviceRequirements || "")
                      .length > 140
                      ? "…"
                      : ""}
                  </td>
                  <td className="px-4 py-4">
                    <form
                      action={updateInquiryStatusAction.bind(null, inquiry.id)}
                      className="flex min-w-36 items-center gap-2"
                    >
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <label
                        htmlFor={`status-${inquiry.id}`}
                        className="sr-only"
                      >
                        Status for {inquiry.fullName}
                      </label>
                      <select
                        id={`status-${inquiry.id}`}
                        name="status"
                        defaultValue={inquiry.status ?? "new"}
                        className="field min-w-0 py-2 text-[11px]"
                      >
                        {statuses
                          .filter(
                            (option) =>
                              inquiry.type === "dining" ||
                              !["confirmed", "declined"].includes(option.value),
                          )
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                      <button
                        type="submit"
                        className="shrink-0 border border-navy-900 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-900 hover:bg-navy-900 hover:text-ivory-50"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <nav
          aria-label="Inquiry pages"
          className="mt-5 flex items-center justify-between gap-4 text-xs"
        >
          <span className="text-ink-400">
            Page {currentPage} of {pageCount}
          </span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/inquiries?${new URLSearchParams({ ...Object.fromEntries(exportParams), page: String(currentPage - 1) })}`}
                className="border border-sand-300 px-3 py-2 text-navy-900"
              >
                Previous
              </Link>
            )}
            {currentPage < pageCount && (
              <Link
                href={`/admin/inquiries?${new URLSearchParams({ ...Object.fromEntries(exportParams), page: String(currentPage + 1) })}`}
                className="border border-sand-300 px-3 py-2 text-navy-900"
              >
                Next
              </Link>
            )}
          </div>
        </nav>
      )}
    </AdminShell>
  );
}
