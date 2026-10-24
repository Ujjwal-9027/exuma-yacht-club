"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

export function OrderAccessForm({ orderNumber }: { orderNumber: string }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(orderNumber)}/access`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: step,
            email,
            ...(step === "verify" ? { code } : {}),
          }),
        },
      );
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Order access could not be verified.");
      }
      if (step === "request") {
        setStep("verify");
        setMessage(
          result.message || "Check your email for a verification code.",
        );
      } else {
        window.location.replace(`/order/${encodeURIComponent(orderNumber)}`);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Order access could not be verified.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-lg border border-sand-300 bg-white p-7 sm:p-10">
        <p className="overline-label">Order access</p>
        <h1 className="mt-3 font-display text-3xl text-navy-900">
          Verify your order
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-500">
          Enter the email address used at checkout. We&apos;ll send a one-time
          code if it matches an order.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="order-access-email" className="field-label">
              Email address
            </label>
            <input
              id="order-access-email"
              type="email"
              autoComplete="email"
              required
              maxLength={160}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field"
            />
          </div>
          {step === "verify" && (
            <div>
              <label htmlFor="order-access-code" className="field-label">
                Verification code
              </label>
              <input
                id="order-access-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                required
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="field"
              />
            </div>
          )}
          {message && (
            <p role="status" className="text-sm text-ink-600">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-[#8f3526]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 border border-navy-900 bg-navy-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory-50 hover:bg-transparent hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {pending
              ? "Please wait…"
              : step === "request"
                ? "Email verification code"
                : "Verify and view order"}
          </button>
        </form>
      </div>
    </section>
  );
}
