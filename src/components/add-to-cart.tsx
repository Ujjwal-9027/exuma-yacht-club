"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/db/schema";
import { useCart } from "@/components/cart-provider";
import {
  findProductVariant,
  getLowStockLabel,
  getProductStockLimit,
} from "@/lib/product-utils";

export function AddToCart({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [size, setSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null,
  );
  const [color, setColor] = useState<string | null>(
    product.colors.length === 1 ? product.colors[0] : null,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [stockError, setStockError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const needsSize = product.sizes.length > 1;
  const needsColor = product.colors.length > 1;
  const selectedVariant = findProductVariant(product, size, color);
  const stockLimit = getProductStockLimit(product, selectedVariant);
  const lowStockLabel = getLowStockLabel(product, selectedVariant);
  const outOfStock = stockLimit === 0;
  const cartQty =
    items.find(
      (item) =>
        item.slug === product.slug &&
        item.size === size &&
        item.color === color,
    )?.qty ?? 0;

  function showStockError() {
    setStockError(true);
    setShaking(false);
    window.requestAnimationFrame(() => setShaking(true));
    window.setTimeout(() => setShaking(false), 420);
  }

  function handleAdd() {
    let valid = true;
    if (needsSize && !size) {
      setSizeError(true);
      valid = false;
    }
    if (needsColor && !color) {
      setColorError(true);
      valid = false;
    }
    if (!valid) return;
    if (outOfStock || (stockLimit !== null && cartQty + qty > stockLimit)) {
      showStockError();
      return;
    }
    addItem(product.slug, size, color, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2600);
  }

  const pill = (active: boolean) =>
    `min-w-11 border px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
      active
        ? "border-navy-900 bg-navy-900 text-ivory-50"
        : "border-sand-300 bg-white text-ink-700 hover:border-navy-800"
    }`;

  return (
    <div>
      {product.colors.length > 0 && (
        <fieldset className="mb-6">
          <legend className="field-label">
            Colour {needsColor && <span className="text-gold-600">*</span>}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setQty(1);
                  setColorError(false);
                  setStockError(false);
                }}
                aria-pressed={color === c}
                className={pill(color === c)}
              >
                {c}
              </button>
            ))}
          </div>
          {colorError && (
            <p role="alert" className="mt-2 text-xs text-[#b3402e]">
              Please choose a colour before adding to your cart.
            </p>
          )}
        </fieldset>
      )}

      {product.sizes.length > 0 && (
        <fieldset className="mb-6">
          <legend className="field-label">
            Size {needsSize && <span className="text-gold-600">*</span>}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setQty(1);
                  setSizeError(false);
                  setStockError(false);
                }}
                aria-pressed={size === s}
                className={pill(size === s)}
              >
                {s}
              </button>
            ))}
          </div>
          {sizeError && (
            <p role="alert" className="mt-2 text-xs text-[#b3402e]">
              Please choose a size before adding to your cart.
            </p>
          )}
        </fieldset>
      )}

      {lowStockLabel && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
          {lowStockLabel}
        </p>
      )}

      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-stretch border border-sand-300 bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid w-11 place-items-center text-navy-900 transition-colors hover:bg-ivory-100"
          >
            <Minus className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <span
            aria-live="polite"
            aria-label={`Quantity: ${qty}`}
            className="grid w-12 place-items-center border-x border-sand-300 text-sm font-semibold text-navy-900"
          >
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => {
              if (stockLimit !== null && cartQty + qty >= stockLimit) {
                showStockError();
                return;
              }
              setStockError(false);
              setQty((q) => Math.min(99, q + 1));
            }}
            className={`grid w-11 place-items-center text-navy-900 transition-colors hover:bg-ivory-100 ${shaking ? "shake-error" : ""}`}
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="inline-flex flex-1 items-center justify-center gap-2 border border-navy-900 bg-navy-900 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900 disabled:cursor-not-allowed disabled:border-sand-300 disabled:bg-sand-200 disabled:text-ink-500 sm:flex-none"
        >
          <ShoppingBag
            className="h-4 w-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          Add to Cart
        </button>
      </div>

      {stockError && stockLimit !== null && (
        <p
          role="alert"
          className={`mt-3 text-xs font-semibold text-[#b3402e] ${shaking ? "shake-error" : ""}`}
        >
          {outOfStock
            ? "Out of stock. We'll restock soon."
            : `Only ${stockLimit} ${stockLimit === 1 ? "unit is" : "units are"} available.`}
        </p>
      )}

      {added && (
        <div
          role="status"
          className="mt-5 flex flex-wrap items-center gap-3 border border-sand-300 bg-ivory-100 p-4 text-sm text-navy-900"
        >
          <Check
            className="h-4 w-4 text-gold-600"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>Added to your cart.</span>
          <Link
            href="/cart"
            className="font-semibold underline decoration-gold-500 underline-offset-4 hover:text-gold-600"
          >
            Review cart →
          </Link>
        </div>
      )}
    </div>
  );
}
