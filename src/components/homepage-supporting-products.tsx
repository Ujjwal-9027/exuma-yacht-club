"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/db/schema";
import { Reveal } from "@/components/reveal";
import {
  getCurrentPriceCents,
  getMainProductImage,
  isNewArrival,
} from "@/lib/product-utils";
import { formatMoney } from "@/lib/format";

const VISIBLE_COUNT = 6;

function productBadge(product: Product): string | null {
  if (isNewArrival(product)) return "New Arrival";
  if (product.eycExclusive) return "EYC Exclusive";
  if (product.limitedEdition) return "Limited Edition";
  if (product.giftIdea) return "Gift Idea";
  if (product.featured) return "Featured";
  return null;
}

export function HomepageSupportingProducts({
  products,
}: {
  products: Product[];
}) {
  const [visibleProducts, setVisibleProducts] = useState(() =>
    products.slice(0, VISIBLE_COUNT),
  );
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (
      products.length <= VISIBLE_COUNT ||
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setVisibleProducts((current) => {
        const hiddenProducts = products.filter(
          (product) =>
            !current.some((visible) => visible.slug === product.slug),
        );
        if (hiddenProducts.length === 0) return current;
        const replacement =
          hiddenProducts[Math.floor(Math.random() * hiddenProducts.length)];
        const replacementIndex = Math.floor(Math.random() * current.length);
        return current.map((product, index) =>
          index === replacementIndex ? replacement : product,
        );
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [products, paused]);

  if (products.length === 0) return null;

  return (
    <div
      className="min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      aria-label="Supporting merchandise products"
    >
      <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product, index) => {
          const image = getMainProductImage(product);
          const badge = productBadge(product);
          return (
            <Reveal key={product.slug} delay={index * 60}>
              <Link href={`/shop/${product.slug}`} className="group block">
                <div className="img-zoom relative aspect-[4/5] overflow-hidden border border-white/15 bg-white/5">
                  <Image
                    src={image?.url || product.image}
                    alt={image?.alt || product.imageAlt || product.name}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 40vw, 50vw"
                    className="object-cover"
                  />
                  {badge && (
                    <span className="absolute left-3 top-3 bg-navy-950/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-400">
                      {badge}
                    </span>
                  )}
                </div>
                <div className="pt-3">
                  <h3 className="font-display text-lg leading-tight text-ivory-50 transition-colors group-hover:text-gold-400">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-ivory-100/65">
                    {formatMoney(
                      getCurrentPriceCents(product),
                      product.currency,
                    )}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
