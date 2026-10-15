"use client";

import { useState } from "react";
import type { ProductVariant } from "@/db/schema";

export function VariantInventoryEditor({
  initialSizes,
  initialVariants,
}: {
  initialSizes: string[];
  initialVariants: ProductVariant[];
}) {
  const [sizes, setSizes] = useState(initialSizes.join(", "));
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const parsedSizes = sizes
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);

  function generateSizeRows() {
    setVariants((current) =>
      parsedSizes.map((size, index) => {
        const existing = current.find((variant) => variant.size === size);
        return (
          existing ?? {
            id: `size-${index + 1}`,
            size,
            color: null,
            sku: null,
            priceCents: null,
            stockQty: 0,
          }
        );
      }),
    );
  }

  function updateVariant(index: number, stockQty: string) {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, stockQty: stockQty === "" ? null : Number(stockQty) }
          : variant,
      ),
    );
  }

  return (
    <div className="sm:col-span-2 border-t border-sand-200 pt-5">
      <label htmlFor="sizes" className="field-label">
        Sizes
      </label>
      <input
        id="sizes"
        name="sizes"
        value={sizes}
        onChange={(event) => setSizes(event.target.value)}
        placeholder="S, M, L"
        className="field"
      />
      <p className="mt-2 text-xs leading-relaxed text-ink-400">
        Leave blank for one shared product stock quantity. For sized products,
        create one inventory row for each size.
      </p>
      <input
        type="hidden"
        name="variants"
        value={JSON.stringify(variants)}
        readOnly
      />
      {parsedSizes.length > 1 && (
        <>
          <button
            type="button"
            onClick={generateSizeRows}
            className="mt-4 border border-navy-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-900 transition-colors hover:bg-navy-900 hover:text-ivory-50"
          >
            Set stock by size
          </button>
          {variants.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {variants.map((variant, index) => (
                <label key={variant.id} className="text-sm text-ink-700">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                    {variant.size}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={variant.stockQty ?? ""}
                    onChange={(event) =>
                      updateVariant(index, event.target.value)
                    }
                    className="field"
                    aria-label={`Stock quantity for size ${variant.size}`}
                  />
                </label>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
