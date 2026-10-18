"use client";

import { useDeferredValue, useState } from "react";
import { PackageOpen, Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/db/schema";
import { formatMoney } from "@/lib/format";
import { getCurrentPriceCents, isNewArrival } from "@/lib/product-utils";
import { ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";

type SortOption = "featured" | "price-low" | "price-high" | "name" | "newest";
type BadgeOption =
  | "all"
  | "featured"
  | "new"
  | "limited"
  | "exclusive"
  | "gift";

type ShopFiltersProps = {
  products: Product[];
  categories: string[];
  initialCategory?: string | null;
};

export function ShopFilters({
  products,
  categories,
  initialCategory = null,
}: ShopFiltersProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState<SortOption>("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [badge, setBadge] = useState<BadgeOption>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const sizes = Array.from(
    new Set(products.flatMap((product) => product.sizes)),
  ).sort();
  const colors = Array.from(
    new Set(products.flatMap((product) => product.colors)),
  ).sort();
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const minimum = Number(minPrice) || 0;
  const maximum = Number(maxPrice) || Number.POSITIVE_INFINITY;

  const filteredProducts = products
    .filter((product) => {
      const currentPrice = getCurrentPriceCents(product);
      const matchesQuery =
        !normalizedQuery ||
        [product.name, product.tagline, product.description, product.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = !category || product.category === category;
      const matchesPrice =
        currentPrice >= minimum * 100 && currentPrice <= maximum * 100;
      const matchesSize = !size || product.sizes.includes(size);
      const matchesColor = !color || product.colors.includes(color);
      const available =
        product.trackInventory !== true || (product.stockQty ?? 0) > 0;
      const matchesBadge =
        badge === "all" ||
        (badge === "featured" && product.featured === true) ||
        (badge === "new" && isNewArrival(product)) ||
        (badge === "limited" && product.limitedEdition === true) ||
        (badge === "exclusive" && product.eycExclusive === true) ||
        (badge === "gift" && product.giftIdea === true);

      return (
        matchesQuery &&
        matchesCategory &&
        matchesPrice &&
        matchesSize &&
        matchesColor &&
        matchesBadge &&
        (!inStockOnly || available)
      );
    })
    .sort((first, second) => {
      if (sort === "price-low") {
        return getCurrentPriceCents(first) - getCurrentPriceCents(second);
      }
      if (sort === "price-high") {
        return getCurrentPriceCents(second) - getCurrentPriceCents(first);
      }
      if (sort === "name") {
        return first.name.localeCompare(second.name);
      }
      if (sort === "newest") {
        return (
          new Date(second.publishedAt ?? second.createdAt).getTime() -
          new Date(first.publishedAt ?? first.createdAt).getTime()
        );
      }
      return first.sortOrder - second.sortOrder;
    });

  const hasFilters = Boolean(
    query ||
    category ||
    minPrice ||
    maxPrice ||
    size ||
    color ||
    badge !== "all" ||
    inStockOnly,
  );

  function clearFilters() {
    setQuery("");
    setCategory("");
    setSort("featured");
    setMinPrice("");
    setMaxPrice("");
    setSize("");
    setColor("");
    setBadge("all");
    setInStockOnly(false);
  }

  return (
    <>
      <div
        id="shop-filters"
        className="mt-8 border-y border-sand-300 bg-white p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Search the collection
            </span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, details, or categories"
                className="field !pl-10"
              />
            </span>
          </label>
          <label className="lg:w-52">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="field"
            >
              <option value="featured">Featured order</option>
              <option value="newest">Newest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
              !category
                ? "border-navy-900 bg-navy-900 text-ivory-50"
                : "border-sand-300 text-ink-700 hover:border-navy-800"
            }`}
          >
            All categories
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                category === item
                  ? "border-navy-900 bg-navy-900 text-ivory-50"
                  : "border-sand-300 text-ink-700 hover:border-navy-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <details className="group mt-6 border-t border-sand-200 pt-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-900">
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal
                className="h-4 w-4 text-gold-600"
                aria-hidden="true"
              />
              Advanced filters
            </span>
            <span className="text-gold-600 transition-transform group-open:rotate-180">
              ⌄
            </span>
          </summary>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <label>
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-500">
                Minimum price
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="0"
                className="field"
              />
            </label>
            <label>
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-500">
                Maximum price
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="No limit"
                className="field"
              />
            </label>
            <label>
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-500">
                Size
              </span>
              <select
                value={size}
                onChange={(event) => setSize(event.target.value)}
                className="field"
              >
                <option value="">Any size</option>
                {sizes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-500">
                Colour
              </span>
              <select
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="field"
              >
                <option value="">Any colour</option>
                {colors.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-500">
                Collection marker
              </span>
              <select
                value={badge}
                onChange={(event) =>
                  setBadge(event.target.value as BadgeOption)
                }
                className="field"
              >
                <option value="all">Any marker</option>
                <option value="featured">Featured</option>
                <option value="new">New arrival</option>
                <option value="limited">Limited edition</option>
                <option value="exclusive">EYC exclusive</option>
                <option value="gift">Gift idea</option>
              </select>
            </label>
            <label className="flex items-end pb-2 sm:col-span-2">
              <span className="inline-flex items-center gap-3 text-sm text-navy-900">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(event) => setInStockOnly(event.target.checked)}
                  className="h-4 w-4 accent-[var(--color-navy-900)]"
                />
                Show in-stock items only
              </span>
            </label>
          </div>
        </details>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          <span className="font-semibold text-navy-900">
            {filteredProducts.length}
          </span>{" "}
          item{filteredProducts.length === 1 ? "" : "s"} found
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-900 underline decoration-gold-500 underline-offset-4 hover:text-gold-600"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <Reveal key={product.slug} delay={(index % 4) * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center border border-sand-300 bg-white px-6 py-20 text-center">
          <PackageOpen
            className="h-10 w-10 text-gold-600"
            strokeWidth={1.4}
            aria-hidden="true"
          />
          <h2 className="mt-5 font-display text-2xl text-navy-900">
            No products match those filters
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
            Try widening your price range or clearing one of the collection
            filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-8 inline-flex items-center justify-center gap-2 border border-navy-900 bg-transparent px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-900 transition-colors hover:bg-navy-900 hover:text-ivory-50"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
