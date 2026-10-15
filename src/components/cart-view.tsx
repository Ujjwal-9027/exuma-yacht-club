"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useCatalog, type CatalogProduct } from "@/components/use-catalog";
import { formatMoney } from "@/lib/format";
import { findProductVariant, getProductStockLimit } from "@/lib/product-utils";

export type CartLine = {
  product: CatalogProduct;
  size: string | null;
  color: string | null;
  qty: number;
  lineTotal: number;
};

export function useCartLines() {
  const { items, hydrated } = useCart();
  const { products, loading, error } = useCatalog();

  if (!hydrated || loading || !products) {
    return { lines: null as CartLine[] | null, subtotal: 0, error };
  }

  const lines: CartLine[] = [];
  let subtotal = 0;
  for (const item of items) {
    const product = products.find((p) => p.slug === item.slug);
    if (!product) continue;
    const lineTotal = product.currentPriceCents * item.qty;
    subtotal += lineTotal;
    lines.push({
      product,
      size: item.size,
      color: item.color,
      qty: item.qty,
      lineTotal,
    });
  }
  return { lines, subtotal, error };
}

const lineKey = (
  l:
    | CartLine
    | { product: { slug: string }; size: string | null; color: string | null },
) => `${l.product.slug}:${l.size ?? ""}:${l.color ?? ""}`;

export function CartView() {
  const { updateQty, removeItem, count } = useCart();
  const { lines, subtotal, error } = useCartLines();
  const [shakingKey, setShakingKey] = useState<string | null>(null);

  function showStockError(key: string) {
    setShakingKey(null);
    window.requestAnimationFrame(() => setShakingKey(key));
    window.setTimeout(() => setShakingKey(null), 420);
  }

  if (error) {
    return (
      <div
        role="alert"
        className="border border-[#e3c2bb] bg-[#fbf1ef] p-6 text-sm text-[#8f3526]"
      >
        We couldn&apos;t load product details for your cart. Please refresh the
        page — your cart items are saved in this browser.
      </div>
    );
  }

  if (lines === null) {
    return (
      <div
        className="flex items-center gap-3 text-sm text-ink-500"
        role="status"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading your cart…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center border border-sand-300 bg-white px-6 py-20 text-center">
        <ShoppingBag
          className="h-10 w-10 text-gold-600"
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <h2 className="mt-5 font-display text-2xl text-navy-900">
          Your cart is empty
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
          Browse the club collection and add anything you&apos;d like to collect
          at the marina.
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
      {/* Lines */}
      <ul
        className="divide-y divide-sand-200 border border-sand-300 bg-white lg:col-span-8"
        aria-label={`${count} items in cart`}
      >
        {lines.map((line) => (
          <li
            key={lineKey(line)}
            className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6"
          >
            <Link
              href={`/shop/${line.product.slug}`}
              className="relative block h-24 w-24 shrink-0 overflow-hidden border border-sand-200 bg-ivory-100"
            >
              <Image
                src={line.product.image}
                alt={line.product.imageAlt || line.product.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/shop/${line.product.slug}`}
                className="font-display text-lg leading-snug text-navy-900 hover:text-gold-600"
              >
                {line.product.name}
              </Link>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-400">
                {line.size ? `Size ${line.size} · ` : ""}
                {line.color ? `${line.color} · ` : ""}
                {formatMoney(
                  line.product.currentPriceCents,
                  line.product.currency,
                )}{" "}
                each
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div
                  className={
                    shakingKey === lineKey(line)
                      ? "shake-error flex items-stretch border border-[#b3402e]"
                      : "flex items-stretch border border-sand-300"
                  }
                >
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${line.product.name}`}
                    onClick={() =>
                      updateQty(
                        line.product.slug,
                        line.size,
                        line.color,
                        line.qty - 1,
                      )
                    }
                    className="grid h-9 w-9 place-items-center text-navy-900 transition-colors hover:bg-ivory-100"
                  >
                    <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                  <span className="grid w-10 place-items-center border-x border-sand-300 text-sm font-semibold text-navy-900">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${line.product.name}`}
                    onClick={() => {
                      const stockLimit = getProductStockLimit(
                        line.product,
                        findProductVariant(line.product, line.size, line.color),
                      );
                      if (stockLimit !== null && line.qty >= stockLimit) {
                        showStockError(lineKey(line));
                        return;
                      }
                      updateQty(
                        line.product.slug,
                        line.size,
                        line.color,
                        line.qty + 1,
                      );
                    }}
                    className="grid h-9 w-9 place-items-center text-navy-900 transition-colors hover:bg-ivory-100"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
                {(() => {
                  const stockLimit = getProductStockLimit(
                    line.product,
                    findProductVariant(line.product, line.size, line.color),
                  );
                  return stockLimit !== null && line.qty >= stockLimit;
                })() && (
                  <p
                    role="alert"
                    className="text-xs font-semibold text-[#b3402e]"
                  >
                    {getProductStockLimit(
                      line.product,
                      findProductVariant(line.product, line.size, line.color),
                    ) === 0
                      ? "Out of stock. We'll restock soon."
                      : `Only ${getProductStockLimit(
                          line.product,
                          findProductVariant(
                            line.product,
                            line.size,
                            line.color,
                          ),
                        )} ${
                          getProductStockLimit(
                            line.product,
                            findProductVariant(
                              line.product,
                              line.size,
                              line.color,
                            ),
                          ) === 1
                            ? "unit is"
                            : "units are"
                        } available.`}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() =>
                    removeItem(line.product.slug, line.size, line.color)
                  }
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400 transition-colors hover:text-[#b3402e]"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
            <p className="shrink-0 font-display text-lg text-navy-900 sm:text-right">
              {formatMoney(line.lineTotal, line.product.currency)}
            </p>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <aside
        className="border border-sand-300 bg-white p-7 lg:col-span-4"
        aria-label="Order summary"
      >
        <h2 className="font-display text-xl text-navy-900">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between text-ink-500">
            <dt>
              Subtotal ({count} item{count === 1 ? "" : "s"})
            </dt>
            <dd className="font-semibold text-navy-900">
              {formatMoney(subtotal)}
            </dd>
          </div>
          <div className="flex justify-between text-ink-500">
            <dt>Delivery</dt>
            <dd>Chosen at checkout</dd>
          </div>
        </dl>
        <div className="mt-5 flex justify-between border-t border-sand-200 pt-5">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-900">
            Subtotal
          </span>
          <span className="font-display text-xl text-navy-900">
            {formatMoney(subtotal)}
          </span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-400">
          Prices in USD. No payment is taken online — pay when you collect, or
          once shipping is arranged.
        </p>
        <Link
          href="/checkout"
          className="mt-6 block border border-navy-900 bg-navy-900 px-7 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900"
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/shop"
          className="mt-3 block text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-500 transition-colors hover:text-navy-900"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
