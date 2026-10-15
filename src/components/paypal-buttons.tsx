"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type CheckoutPayload = Record<string, unknown>;

export function PayPalButtons({
  getPayload,
  totalCents,
  onComplete,
  onError,
  disabled,
}: {
  getPayload: (mode: "demo") => CheckoutPayload | null;
  totalCents: number;
  onComplete: (orderNumber: string) => void;
  onError: (message: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"paypal" | "card">("paypal");
  const [processing, setProcessing] = useState(false);

  async function payDemo() {
    const payload = getPayload("demo");
    if (!payload) return;
    setProcessing(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          demoPayment: true,
          demoPaymentMethod: method,
        }),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        orderNumber?: string;
        error?: string;
      };
      if (!response.ok || !body.ok || !body.orderNumber) {
        throw new Error(
          body.error || "The demo payment could not be completed.",
        );
      }
      onComplete(body.orderNumber);
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "The demo payment failed.",
      );
      setProcessing(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 border border-[#0070ba] bg-[#0070ba] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#005ea6] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Pay with PayPal <span className="text-[10px] normal-case">(Demo)</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-navy-950/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-payment-title"
        >
          <div className="w-full max-w-md border border-sand-300 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="overline-label !text-gold-600">Demo checkout</p>
                <h2
                  id="demo-payment-title"
                  className="mt-2 font-display text-2xl text-navy-900"
                >
                  Choose a demo payment
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-2xl leading-none text-ink-400 hover:text-navy-900"
                aria-label="Close payment dialog"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              No real payment will be taken. Use any details, or leave the demo
              card fields blank.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["paypal", "Pay with PayPal", "Demo wallet"],
                  ["card", "Pay with debit or credit card", "Demo card"],
                ] as const
              ).map(([value, label, note]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMethod(value)}
                  className={`border p-4 text-left transition-colors ${method === value ? "border-navy-900 bg-ivory-100" : "border-sand-300 hover:border-navy-800"}`}
                >
                  <span className="block text-sm font-semibold text-navy-900">
                    {label}
                  </span>
                  <span className="mt-1 block text-xs text-ink-500">
                    {note}
                  </span>
                </button>
              ))}
            </div>

            {method === "card" && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input
                  aria-label="Demo card number"
                  placeholder="Card number (optional)"
                  className="field sm:col-span-2"
                />
                <input
                  aria-label="Demo expiry"
                  placeholder="MM / YY (optional)"
                  className="field"
                />
                <input
                  aria-label="Demo security code"
                  placeholder="CVV (optional)"
                  className="field"
                />
              </div>
            )}

            <button
              type="button"
              disabled={processing}
              onClick={payDemo}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-gold-500 bg-gold-500 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-950 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {processing
                ? "Processing demo payment…"
                : `Pay $${(totalCents / 100).toFixed(2)} (Demo)`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
