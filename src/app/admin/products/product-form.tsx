"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveProductAction, type ActionState } from "@/app/admin/actions";
import type { Product } from "@/db/schema";
import { getProductImages } from "@/lib/product-utils";
import { ImageGalleryEditor } from "./image-gallery-editor";
import { VariantInventoryEditor } from "./variant-inventory-editor";

const initialState: ActionState = { error: null };

export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, pending] = useActionState(
    saveProductAction,
    initialState,
  );
  const inputClass = "field";
  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="border border-sand-300 bg-white p-6 sm:p-8"
    >
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="field-label">
            Product name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            defaultValue={product?.name ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="slug" className="field-label">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            maxLength={120}
            defaultValue={product?.slug ?? ""}
            placeholder="auto-generated from name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="sku" className="field-label">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            maxLength={80}
            defaultValue={product?.sku ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="category" className="field-label">
            Category
          </label>
          <input
            id="category"
            name="category"
            required
            maxLength={80}
            defaultValue={product?.category ?? ""}
            placeholder="Apparel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="price" className="field-label">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            required
            type="number"
            min="0"
            step="0.01"
            defaultValue={product ? (product.priceCents / 100).toFixed(2) : ""}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="field-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            maxLength={5000}
            defaultValue={product?.description ?? ""}
            className={`${inputClass} resize-y`}
          />
        </div>
        <ImageGalleryEditor
          initialImages={product ? getProductImages(product) : []}
        />
        <div>
          <label htmlFor="imageAlt" className="field-label">
            Image alt text
          </label>
          <input
            id="imageAlt"
            name="imageAlt"
            maxLength={200}
            defaultValue={product?.imageAlt ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="salePrice" className="field-label">
            Sale price (USD)
          </label>
          <input
            id="salePrice"
            name="salePrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={
              product?.salePriceCents != null
                ? (product.salePriceCents / 100).toFixed(2)
                : ""
            }
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="saleStartsAt" className="field-label">
            Sale starts
          </label>
          <input
            id="saleStartsAt"
            name="saleStartsAt"
            type="datetime-local"
            defaultValue={
              product?.saleStartsAt
                ? new Date(product.saleStartsAt).toISOString().slice(0, 16)
                : ""
            }
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="saleEndsAt" className="field-label">
            Sale ends
          </label>
          <input
            id="saleEndsAt"
            name="saleEndsAt"
            type="datetime-local"
            defaultValue={
              product?.saleEndsAt
                ? new Date(product.saleEndsAt).toISOString().slice(0, 16)
                : ""
            }
            className={inputClass}
          />
        </div>
        <VariantInventoryEditor
          initialSizes={product?.sizes ?? []}
          initialVariants={product?.variants ?? []}
        />
        <div>
          <label htmlFor="colors" className="field-label">
            Colours
          </label>
          <input
            id="colors"
            name="colors"
            defaultValue={product?.colors.join(", ") ?? ""}
            placeholder="Navy, White"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="stockQty" className="field-label">
            Stock quantity
          </label>
          <input
            id="stockQty"
            name="stockQty"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.stockQty ?? 0}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-ink-700">
          <input
            type="checkbox"
            name="trackInventory"
            defaultChecked={product?.trackInventory ?? true}
            className="accent-navy-900"
          />
          Track inventory for this product
        </label>
        <div>
          <label htmlFor="lowStockThreshold" className="field-label">
            Low-stock threshold
          </label>
          <input
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.lowStockThreshold ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="outOfStockBehavior" className="field-label">
            When out of stock
          </label>
          <select
            id="outOfStockBehavior"
            name="outOfStockBehavior"
            defaultValue={product?.outOfStockBehavior ?? "hide"}
            className={inputClass}
          >
            <option value="hide">Hide from shop</option>
            <option value="show">Show, but unavailable</option>
          </select>
        </div>
        <div className="sm:col-span-2 border-t border-sand-200 pt-5">
          <p className="field-label">Merchandising</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["featured", "Featured product"],
              ["newArrival", "New arrival"],
              ["limitedEdition", "Limited edition"],
              ["eycExclusive", "EYC exclusive"],
              ["giftIdea", "Gift idea"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-ink-700"
              >
                <input
                  type="checkbox"
                  name={value}
                  defaultChecked={Boolean(
                    product?.[
                      value as
                        | "featured"
                        | "newArrival"
                        | "limitedEdition"
                        | "eycExclusive"
                        | "giftIdea"
                    ],
                  )}
                  className="accent-navy-900"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="status" className="field-label">
            Publishing status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={
              product?.status ??
              (product?.active === false ? "draft" : "published")
            }
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label htmlFor="newArrivalWindowDays" className="field-label">
            New arrival window (days)
          </label>
          <input
            id="newArrivalWindowDays"
            name="newArrivalWindowDays"
            type="number"
            min="1"
            max="365"
            step="1"
            defaultValue={product?.newArrivalWindowDays ?? 30}
            className={inputClass}
          />
        </div>
        <div className="flex items-end gap-5 pb-2 sm:justify-end"></div>
      </div>
      {state.error && (
        <p
          role="alert"
          className="mt-5 border border-[#e3c2bb] bg-[#fbf1ef] p-3 text-sm text-[#8f3526]"
        >
          {state.error}
        </p>
      )}
      <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-sand-200 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 border border-navy-900 bg-navy-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory-50 hover:bg-transparent hover:text-navy-900 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          {pending ? "Saving" : product ? "Save product" : "Create product"}
        </button>
        <p className="text-xs text-ink-400">
          Prices are stored as integer cents and verified again during checkout.
        </p>
      </div>
    </form>
  );
}
