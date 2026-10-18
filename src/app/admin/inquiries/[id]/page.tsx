import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MessageSquareText } from "lucide-react";
import { db } from "@/db";
import type { InquiryStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin-shell";
import {
  addInquiryNoteAction,
  updateInquiryStatusAction,
} from "@/app/admin/actions";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Inquiry detail",
  robots: { index: false, follow: false },
};

const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  read: "Read",
  in_progress: "Processing",
  replied: "Replied",
  confirmed: "Confirmed",
  declined: "Declined",
  archived: "Archived",
};

function fieldLabel(value: string | null | undefined): string {
  return value || "Not provided";
}

export default async function AdminInquiryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const inquiry = await db.getInquiryById(Number(id));
  if (!inquiry) notFound();
  await db.markInquiryRead(inquiry.id);
  const status = inquiry.status ?? "new";
  const statusOptions: InquiryStatus[] = [
    "new",
    "read",
    "in_progress",
    "replied",
    "archived",
  ];
  if (inquiry.type === "dining")
    statusOptions.splice(3, 0, "confirmed", "declined");
  const replyHref = `mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent("Re: your inquiry to Exuma Yacht Club")}`;

  return (
    <AdminShell title="Inquiry detail">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
            {inquiry.type === "general" ? "Contact" : inquiry.type}
          </p>
          <h2 className="mt-2 font-display text-3xl text-navy-900">
            {inquiry.fullName}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Received {formatDate(inquiry.createdAt)}
          </p>
        </div>
        <Link
          href="/admin/inquiries"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-800 underline decoration-gold-500 underline-offset-4"
        >
          Back to inquiries
        </Link>
      </div>

      {query.error === "status" && (
        <p
          role="alert"
          className="mb-6 border border-[#e3c2bb] bg-[#fbf1ef] p-4 text-sm text-[#8f3526]"
        >
          Confirmed and declined statuses are available only for dining
          inquiries.
        </p>
      )}
      {query.saved === "status" && (
        <p
          role="status"
          className="mb-6 border border-green-700/30 bg-green-50 p-4 text-sm text-green-900"
        >
          Inquiry status updated.
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="border border-sand-300 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sand-200 pb-6">
            <div>
              <h3 className="font-display text-2xl text-navy-900">
                Inquiry details
              </h3>
              <p className="mt-2 text-sm text-ink-500">
                {inquiry.message || "No written message was provided."}
              </p>
            </div>
            <a
              href={replyHref}
              className="inline-flex items-center gap-2 border border-navy-900 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-900 hover:bg-navy-900 hover:text-ivory-50"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Reply by email
            </a>
          </div>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="field-label">Email</dt>
              <dd className="text-sm text-ink-700">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="underline decoration-gold-500 underline-offset-4"
                >
                  {inquiry.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="field-label">Phone</dt>
              <dd className="text-sm text-ink-700">
                {fieldLabel(inquiry.phone)}
              </dd>
            </div>
            <div>
              <dt className="field-label">Vessel name</dt>
              <dd className="text-sm text-ink-700">
                {fieldLabel(inquiry.vesselName)}
              </dd>
            </div>
            <div>
              <dt className="field-label">Vessel length</dt>
              <dd className="text-sm text-ink-700">
                {fieldLabel(inquiry.vesselLength)}
              </dd>
            </div>
            <div>
              <dt className="field-label">Arrival</dt>
              <dd className="text-sm text-ink-700">
                {fieldLabel(inquiry.arrivalDate)}
              </dd>
            </div>
            <div>
              <dt className="field-label">Departure</dt>
              <dd className="text-sm text-ink-700">
                {fieldLabel(inquiry.departureDate)}
              </dd>
            </div>
            <div>
              <dt className="field-label">Preferred time</dt>
              <dd className="text-sm text-ink-700">
                {fieldLabel(inquiry.timeOfDay)}
              </dd>
            </div>
            <div>
              <dt className="field-label">Party size</dt>
              <dd className="text-sm text-ink-700">
                {fieldLabel(inquiry.partySize)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="field-label">Service requirements</dt>
              <dd className="text-sm leading-relaxed text-ink-700">
                {fieldLabel(inquiry.serviceRequirements)}
              </dd>
            </div>
          </dl>
        </section>

        <aside className="space-y-6">
          <section className="border border-sand-300 bg-white p-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">
              Workflow
            </h3>
            <form
              action={updateInquiryStatusAction.bind(null, inquiry.id)}
              className="mt-4 space-y-4"
            >
              <input
                type="hidden"
                name="returnTo"
                value={`/admin/inquiries/${inquiry.id}?saved=status`}
              />
              <label htmlFor="inquiry-status" className="field-label">
                Status
              </label>
              <select
                id="inquiry-status"
                name="status"
                defaultValue={status}
                className="field"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {statusLabels[option]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full border border-navy-900 bg-navy-900 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ivory-50 hover:bg-transparent hover:text-navy-900"
              >
                Save status
              </button>
            </form>
          </section>

          <section className="border border-sand-300 bg-white p-6">
            <div className="flex items-center gap-2">
              <MessageSquareText
                className="h-4 w-4 text-gold-600"
                aria-hidden="true"
              />
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                Internal notes
              </h3>
            </div>
            <div className="mt-4 space-y-3">
              {(inquiry.internalNotes ?? []).length === 0 ? (
                <p className="text-sm text-ink-400">No internal notes yet.</p>
              ) : (
                (inquiry.internalNotes ?? []).map((note) => (
                  <div
                    key={note.id}
                    className="border-l-2 border-gold-500 pl-3"
                  >
                    <p className="text-sm leading-relaxed text-ink-700">
                      {note.text}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink-400">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <form
              action={addInquiryNoteAction.bind(null, inquiry.id)}
              className="mt-5 border-t border-sand-200 pt-5"
            >
              <label htmlFor="note" className="field-label">
                Add note
              </label>
              <textarea
                id="note"
                name="note"
                rows={4}
                maxLength={2000}
                className="field resize-y"
                placeholder="Internal note for the team"
              />
              <button
                type="submit"
                className="mt-3 border border-navy-900 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-900 hover:bg-navy-900 hover:text-ivory-50"
              >
                Save note
              </button>
            </form>
          </section>
        </aside>
      </div>
    </AdminShell>
  );
}
