"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, TriangleAlert } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useCartLines } from "@/components/cart-view";
import { formatMoney } from "@/lib/format";
import { PayPalButtons } from "@/components/paypal-buttons";
import { getShippingFeeCents, type DeliverySpeed } from "@/lib/shipping";

type CheckoutMode = "manual" | "demo";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear, hydrated } = useCart();
  const { lines, subtotal, error: catalogError } = useCartLines();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fulfillment, setFulfillment] = useState<"pickup" | "ship">("pickup");
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>("standard");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingRegion, setShippingRegion] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [paypalResetKey, setPaypalResetKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const resetPayPal = () => setPaypalResetKey((value) => value + 1);
  const shippingFeeCents = getShippingFeeCents(
    fulfillment,
    fulfillment === "ship"
      ? {
          city: shippingCity,
          region: shippingRegion,
          postalCode: shippingPostalCode,
        }
      : null,
    deliverySpeed,
  );

  function getCheckoutPayload(mode: CheckoutMode, paypalOrderId?: string) {
    const form = formRef.current;
    if (!form) return null;
    const data = new FormData(form);

    const nextErrors: Record<string, string> = {};
    const customerName = String(data.get("customerName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const shippingAddress =
      fulfillment === "ship"
        ? {
            addressLine1: String(data.get("addressLine1") || "").trim(),
            addressLine2: String(data.get("addressLine2") || "").trim(),
            city: String(data.get("city") || "").trim(),
            region: String(data.get("region") || "").trim(),
            postalCode: String(data.get("postalCode") || "").trim(),
            country: String(data.get("country") || "").trim(),
          }
        : null;
    if (!customerName) nextErrors.customerName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Please enter a valid email address.";
    if (fulfillment === "ship") {
      if (!shippingAddress?.addressLine1)
        nextErrors.addressLine1 = "Please enter your street address.";
      if (!shippingAddress?.city) nextErrors.city = "Please enter your city.";
      if (!shippingAddress?.country)
        nextErrors.country = "Please enter your country.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return null;

    if (items.length === 0) {
      setStatus("error");
      setError("Your cart is empty — add something from the shop first.");
      return null;
    }

    return {
      customerName,
      email,
      phone: String(data.get("phone") || ""),
      notes: String(data.get("notes") || ""),
      fulfillment,
      deliverySpeed,
      shippingAddress,
      companyWebsite: String(data.get("companyWebsite") || ""),
      items: items.map((i) => ({
        slug: i.slug,
        size: i.size,
        color: i.color,
        qty: i.qty,
      })),
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = getCheckoutPayload("manual");
    if (!payload) return;

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as {
        ok?: boolean;
        orderNumber?: string;
        redirectUrl?: string | null;
        error?: string;
      };
      if (!res.ok || !body.ok || !body.orderNumber) {
        setStatus("error");
        setError(
          body.error ||
            "We couldn't place your order just now. Please try again — your cart is unchanged.",
        );
        return;
      }
      clear();
      // When a real payment gateway is configured it may return a hosted
      // checkout URL; the default "manual" provider never does.
      if (body.redirectUrl) {
        window.location.href = body.redirectUrl;
        return;
      }
      router.push(`/order/${body.orderNumber}`);
    } catch {
      setStatus("error");
      setError(
        "A network error stopped your order from being placed. Please try again — your cart is unchanged.",
      );
    }
  }

  if (hydrated && items.length === 0 && status !== "submitting") {
    return (
      <div className="flex flex-col items-center border border-sand-300 bg-white px-6 py-20 text-center">
        <ShoppingBag
          className="h-10 w-10 text-gold-600"
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <h2 className="mt-5 font-display text-2xl text-navy-900">
          Nothing to check out yet
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
          Your cart is empty. Add items from the gift shop and return here to
          place your order.
        </p>
        <Link
          href="/shop"
          className="mt-8 border border-navy-900 bg-navy-900 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900"
        >
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-12">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        aria-busy={status === "submitting"}
        className="border border-sand-300 bg-white p-6 sm:p-10 lg:col-span-7"
      >
        <h2 className="font-display text-2xl text-navy-900">Your details</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          We&apos;ll confirm your order by email and prepare it for pickup or
          delivery.
        </p>

        <div className="hidden" aria-hidden="true">
          <label>
            Company website
            <input
              type="text"
              name="companyWebsite"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="customerName" className="field-label">
              Full name <span className="text-gold-600">*</span>
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              autoComplete="name"
              required
              maxLength={120}
              className="field"
              aria-invalid={!!errors.customerName}
            />
            {errors.customerName && (
              <p className="mt-1.5 text-xs text-[#b3402e]">
                {errors.customerName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="field-label">
              Email address <span className="text-gold-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={160}
              className="field"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-[#b3402e]">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="field-label">
              Phone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              className="field"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="field-label">
              Notes for the gift shop
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              maxLength={1000}
              placeholder="Expected pickup date, boat name, or anything else we should know."
              className="field resize-y"
            />
          </div>
        </div>

        {fulfillment === "ship" && (
          <fieldset className="mt-8 border-t border-sand-200 pt-8">
            <legend className="font-display text-2xl text-navy-900">
              Shipping address
            </legend>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Delivery is free to Miami. All other addresses are $8 standard or
              $12 priority.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="addressLine1" className="field-label">
                  Street address <span className="text-gold-600">*</span>
                </label>
                <input
                  id="addressLine1"
                  name="addressLine1"
                  type="text"
                  autoComplete="address-line1"
                  maxLength={160}
                  className="field"
                  aria-invalid={!!errors.addressLine1}
                />
                {errors.addressLine1 && (
                  <p className="mt-1.5 text-xs text-[#b3402e]">
                    {errors.addressLine1}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="addressLine2" className="field-label">
                  Apartment, suite, unit, etc.
                </label>
                <input
                  id="addressLine2"
                  name="addressLine2"
                  type="text"
                  autoComplete="address-line2"
                  maxLength={160}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="city" className="field-label">
                  City / town <span className="text-gold-600">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  maxLength={100}
                  className="field"
                  aria-invalid={!!errors.city}
                  onChange={(event) => setShippingCity(event.target.value)}
                  onBlur={resetPayPal}
                />
                {errors.city && (
                  <p className="mt-1.5 text-xs text-[#b3402e]">{errors.city}</p>
                )}
              </div>
              <div>
                <label htmlFor="region" className="field-label">
                  State / province / region
                </label>
                <input
                  id="region"
                  name="region"
                  type="text"
                  autoComplete="address-level1"
                  maxLength={100}
                  className="field"
                  onChange={(event) => setShippingRegion(event.target.value)}
                  onBlur={resetPayPal}
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="field-label">
                  Postal / ZIP code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  autoComplete="postal-code"
                  maxLength={30}
                  className="field"
                  onChange={(event) =>
                    setShippingPostalCode(event.target.value)
                  }
                  onBlur={resetPayPal}
                />
              </div>
              <div>
                <label htmlFor="country" className="field-label">
                  Country <span className="text-gold-600">*</span>
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  autoComplete="country-name"
                  maxLength={100}
                  className="field"
                  aria-invalid={!!errors.country}
                />
                {errors.country && (
                  <p className="mt-1.5 text-xs text-[#b3402e]">
                    {errors.country}
                  </p>
                )}
              </div>
            </div>
            <fieldset className="mt-6 border-t border-sand-200 pt-6">
              <legend className="field-label">Delivery speed</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["standard", "Standard delivery", "$8 · Free to Miami"],
                    ["priority", "Priority delivery", "$12 · Free to Miami"],
                  ] as const
                ).map(([speed, label, price]) => (
                  <label
                    key={speed}
                    className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
                      deliverySpeed === speed
                        ? "border-navy-900 bg-ivory-100"
                        : "border-sand-300 bg-white hover:border-navy-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliverySpeed"
                      value={speed}
                      checked={deliverySpeed === speed}
                      onChange={() => {
                        setDeliverySpeed(speed);
                        resetPayPal();
                      }}
                      className="mt-1 accent-navy-900"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-navy-900">
                        {label}
                      </span>
                      <span className="mt-1 block text-xs text-ink-500">
                        {price}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </fieldset>
        )}

        {/* Delivery options */}
        <fieldset className="mt-8">
          <legend className="field-label">Delivery option</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
                fulfillment === "pickup"
                  ? "border-navy-900 bg-ivory-100"
                  : "border-sand-300 bg-white hover:border-navy-800"
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                value="pickup"
                checked={fulfillment === "pickup"}
                onChange={() => {
                  setFulfillment("pickup");
                  resetPayPal();
                }}
                className="mt-1 accent-navy-900"
              />
              <span>
                <span className="block text-sm font-semibold text-navy-900">
                  Collect at the dock
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-500">
                  Free — pick up at the marina gift shop on Queen&apos;s
                  Highway.
                </span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
                fulfillment === "ship"
                  ? "border-navy-900 bg-ivory-100"
                  : "border-sand-300 bg-white hover:border-navy-800"
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                value="ship"
                checked={fulfillment === "ship"}
                onChange={() => {
                  setFulfillment("ship");
                  resetPayPal();
                }}
                className="mt-1 accent-navy-900"
              />
              <span>
                <span className="block text-sm font-semibold text-navy-900">
                  Deliver to an address
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-500">
                  Free to Miami, $8 standard or $12 priority elsewhere.
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        <div className="mt-6 border border-sand-300 bg-ivory-100 p-5">
          <p className="text-sm leading-relaxed text-ink-700">
            <span className="font-semibold text-navy-900">Payment:</span> pay
            securely with PayPal. Delivery fees are calculated from your
            address.{" "}
            <Link
              href="/shipping"
              className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-4 hover:text-gold-600"
            >
              Shipping & returns
            </Link>
          </p>
        </div>

        {status === "error" && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 border border-[#e3c2bb] bg-[#fbf1ef] p-4 text-sm text-[#8f3526]"
          >
            <TriangleAlert
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <p>{error}</p>
          </div>
        )}

        <div className="mt-8 border-t border-sand-200 pt-8">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-900">
            Pay securely with PayPal
          </p>
          <PayPalButtons
            key={paypalResetKey}
            getPayload={getCheckoutPayload}
            totalCents={subtotal + shippingFeeCents}
            disabled={status === "submitting" || lines === null}
            onComplete={(orderNumber) => {
              clear();
              router.push(`/order/${orderNumber}`);
            }}
            onError={(message) => {
              setStatus("error");
              setError(message);
            }}
          />
        </div>
      </form>

      {/* Summary */}
      <aside
        className="border border-sand-300 bg-white p-7 lg:col-span-5"
        aria-label="Order summary"
      >
        <h2 className="font-display text-xl text-navy-900">Your order</h2>
        {catalogError ? (
          <p role="alert" className="mt-4 text-sm text-[#8f3526]">
            We couldn&apos;t load the order summary. Please refresh.
          </p>
        ) : lines === null ? (
          <p
            role="status"
            className="mt-4 flex items-center gap-2 text-sm text-ink-500"
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading summary…
          </p>
        ) : (
          <>
            <ul className="mt-5 space-y-4">
              {lines.map((line) => (
                <li
                  key={`${line.product.slug}:${line.size ?? ""}:${line.color ?? ""}`}
                  className="flex items-baseline justify-between gap-4 text-sm"
                >
                  <span className="text-ink-700">
                    {line.product.name}
                    {line.size && (
                      <span className="text-ink-400"> · {line.size}</span>
                    )}
                    {line.color && (
                      <span className="text-ink-400"> · {line.color}</span>
                    )}
                    <span className="block text-xs text-ink-400">
                      Qty {line.qty}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold text-navy-900">
                    {formatMoney(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-sand-200 pt-5 text-sm">
              <div className="flex justify-between text-ink-500">
                <span>Items</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {fulfillment === "ship" && (
                <div className="flex justify-between text-ink-500">
                  <span>Delivery</span>
                  <span>
                    {shippingFeeCents === 0
                      ? "Free"
                      : formatMoney(shippingFeeCents)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-sand-200 pt-3">
                <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-900">
                  {fulfillment === "pickup"
                    ? "Total due at pickup"
                    : "Order total"}
                </span>
                <span className="font-display text-xl text-navy-900">
                  {formatMoney(subtotal + shippingFeeCents)}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-400">
              Prices in USD. Totals are verified again on the server when your
              order is placed.
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
