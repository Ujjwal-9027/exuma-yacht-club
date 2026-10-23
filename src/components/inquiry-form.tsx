"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

export type InquiryKind = "dockage" | "stay" | "fuel" | "general";

const kindLabels: Record<InquiryKind, string> = {
  dockage: "Request Dockage",
  stay: "Stay Inquiry",
  fuel: "Fuel Inquiry",
  general: "Send Message",
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Reusable inquiry form. Posts to /api/inquiries which validates and stores
 * the submission in the database. Success is only shown after the API
 * confirms the record was created.
 */
export function InquiryForm({
  kind,
  id,
  heading,
  subheading,
}: {
  kind: InquiryKind;
  id?: string;
  heading?: string;
  subheading?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const withDates = kind === "dockage" || kind === "stay";
  const isDockage = kind === "dockage";
  const isStay = kind === "stay";

  const today = new Date().toISOString().slice(0, 10);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Client-side validation mirroring the server rules
    const nextErrors: Record<string, string> = {};
    const fullName = String(data.get("fullName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const arrivalDate = String(data.get("arrivalDate") || "");
    const departureDate = String(data.get("departureDate") || "");
    if (!fullName) nextErrors.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Please enter a valid email address.";
    if (withDates && arrivalDate && departureDate && departureDate <= arrivalDate) {
      nextErrors.departureDate =
        "Departure must be after your arrival date.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      document
        .getElementById(`${kind}-${Object.keys(nextErrors)[0]}`)
        ?.focus();
      return;
    }

    setStatus("submitting");
    setError("");

    const payload: Record<string, string> = { type: kind };
    for (const [key, value] of data.entries()) {
      payload[key] = String(value);
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setStatus("error");
        setError(
          body.error ||
            "We couldn't send your inquiry just now. Please try again, or reach us by phone.",
        );
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError(
        "A network error prevented your inquiry from being sent. Please try again, or reach us by phone.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        id={id}
        role="status"
        className="border border-sand-300 bg-white p-8 sm:p-10"
      >
        <CheckCircle2
          className="h-10 w-10 text-gold-600"
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <h3 className="mt-5 font-display text-2xl text-navy-900">
          Thank you — your inquiry has been received.
        </h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
          Our team reviews every inquiry personally and will respond as soon as
          possible. For urgent matters, call the dock office on{" "}
          <a href="tel:+12428286973" className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-4">
            +1 (242) 828-6973
          </a>{" "}
          or hail us on VHF Channel 16.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 border border-navy-900/35 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-900 transition-colors hover:bg-navy-900 hover:text-ivory-50"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === "submitting"}
      className="border border-sand-300 bg-white p-6 sm:p-10"
    >
      {(heading || subheading) && (
        <div className="mb-8">
          {heading && (
            <h3 className="font-display text-2xl text-navy-900 sm:text-[1.75rem]">
              {heading}
            </h3>
          )}
          {subheading && (
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-500">
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Honeypot — hidden from humans, catches basic spam bots */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company website
          <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${kind}-fullName`} className="field-label">
            Full name <span className="text-gold-600">*</span>
          </label>
          <input
            id={`${kind}-fullName`}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            className="field"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? `${kind}-fullName-error` : undefined}
          />
          {errors.fullName && (
            <p id={`${kind}-fullName-error`} className="mt-1.5 text-xs text-[#b3402e]">
              {errors.fullName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${kind}-email`} className="field-label">
            Email address <span className="text-gold-600">*</span>
          </label>
          <input
            id={`${kind}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={160}
            className="field"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${kind}-email-error` : undefined}
          />
          {errors.email && (
            <p id={`${kind}-email-error`} className="mt-1.5 text-xs text-[#b3402e]">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${kind}-phone`} className="field-label">
            Phone number
          </label>
          <input
            id={`${kind}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            className="field"
          />
        </div>

        {isStay && (
          <div>
            <label htmlFor={`${kind}-partySize`} className="field-label">
              Party size
            </label>
            <input
              id={`${kind}-partySize`}
              name="partySize"
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="e.g. 2 adults"
              className="field"
            />
          </div>
        )}

        {isDockage && (
          <>
            <div>
              <label htmlFor={`${kind}-vesselName`} className="field-label">
                Vessel name
              </label>
              <input
                id={`${kind}-vesselName`}
                name="vesselName"
                type="text"
                maxLength={120}
                className="field"
              />
            </div>
            <div>
              <label htmlFor={`${kind}-vesselLength`} className="field-label">
                Vessel length (LOA)
              </label>
              <input
                id={`${kind}-vesselLength`}
                name="vesselLength"
                type="text"
                maxLength={30}
                placeholder="e.g. 42 ft"
                className="field"
              />
            </div>
          </>
        )}

        {withDates && (
          <>
            <div>
              <label htmlFor={`${kind}-arrivalDate`} className="field-label">
                Estimated arrival
              </label>
              <input
                id={`${kind}-arrivalDate`}
                name="arrivalDate"
                type="date"
                min={today}
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label htmlFor={`${kind}-departureDate`} className="field-label">
                Estimated departure
              </label>
              <input
                id={`${kind}-departureDate`}
                name="departureDate"
                type="date"
                min={arrival || today}
                value={departure}
                onChange={(e) => {
                  setDeparture(e.target.value);
                  if (errors.departureDate) {
                    setErrors((prev) => ({ ...prev, departureDate: "" }));
                  }
                }}
                className="field"
                aria-invalid={!!errors.departureDate}
                aria-describedby={
                  errors.departureDate ? `${kind}-departureDate-error` : undefined
                }
              />
              {errors.departureDate && (
                <p id={`${kind}-departureDate-error`} className="mt-1.5 text-xs text-[#b3402e]">
                  {errors.departureDate}
                </p>
              )}
            </div>
          </>
        )}

        {isDockage && (
          <div className="sm:col-span-2">
            <label htmlFor={`${kind}-serviceRequirements`} className="field-label">
              Service requirements
            </label>
            <input
              id={`${kind}-serviceRequirements`}
              name="serviceRequirements"
              type="text"
              maxLength={300}
              placeholder="e.g. shore power, water, fuel on arrival"
              className="field"
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor={`${kind}-message`} className="field-label">
            {isDockage ? "Additional message" : "Message"}
          </label>
          <textarea
            id={`${kind}-message`}
            name="message"
            rows={4}
            maxLength={2000}
            className="field resize-y"
          />
        </div>
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 border border-[#e3c2bb] bg-[#fbf1ef] p-4 text-sm text-[#8f3526]"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-400">
          {isStay
            ? "This is an inquiry, not a confirmed reservation — availability is confirmed by our team."
            : "Fields marked * are required. We only use your details to respond to this inquiry."}
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 border border-navy-900 bg-navy-900 px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {status === "submitting" ? "Sending…" : kindLabels[kind]}
        </button>
      </div>
    </form>
  );
}
