"use client";

import { useEffect, useState } from "react";

export type CatalogProduct = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  priceCents: number;
  currentPriceCents: number;
  trackInventory: boolean;
  stockQty: number | null;
  variants: { id: string; size: string | null; color: string | null; stockQty: number | null }[];
  currency: string;
  image: string;
  imageAlt: string;
  sizes: string[];
  colors: string[];
  images: { id: string; url: string; alt: string; order: number; isMain: boolean }[];
};

let cache: CatalogProduct[] | null = null;

/** Fetches the public product catalog once per session for cart/checkout display. */
export function useCatalog() {
  const [products, setProducts] = useState<CatalogProduct[] | null>(cache);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("catalog fetch failed");
        return res.json();
      })
      .then((data: { products: CatalogProduct[] }) => {
        if (cancelled) return;
        cache = data.products;
        setProducts(data.products);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading: products === null && !error, error };
}
