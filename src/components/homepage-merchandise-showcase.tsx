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
  type FeaturedProductReason,
} from "@/lib/product-utils";
import { formatMoney } from "@/lib/format";

const VISIBLE_SUPPORTING_COUNT = 6;

function productBadge(product: Product): string | null {
  if (isNewArrival(product)) return "New Arrival";
  if (product.eycExclusive) return "EYC Exclusive";
  if (product.limitedEdition) return "Limited Edition";
  if (product.giftIdea) return "Gift Idea";
  if (product.featured) return "Featured";
  return null;
}

function randomProduct(products: Product[]): Product | null {
  return products.length > 0
    ? products[Math.floor(Math.random() * products.length)]
    : null;
}

export function HomepageMerchandiseShowcase({
  featured,
  featuredReason,
  supporting,
}: {
  featured: Product;
  featuredReason: FeaturedProductReason;
  supporting: Product[];
}) {
  const [visibleSupporting, setVisibleSupporting] = useState(() =>
    supporting.slice(0, VISIBLE_SUPPORTING_COUNT),
  );
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const allProducts = supporting;
    if (
      allProducts.length <= VISIBLE_SUPPORTING_COUNT ||
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setVisibleSupporting((currentSupporting) => {
        const hiddenProducts = allProducts.filter(
          (product) =>
            !currentSupporting.some((visible) => visible.slug === product.slug),
        );
        const replacement = randomProduct(hiddenProducts);
        if (!replacement) return currentSupporting;
        const replacementIndex = Math.floor(
          Math.random() * currentSupporting.length,
        );
        return currentSupporting.map((product, index) =>
          index === replacementIndex ? replacement : product,
        );
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [supporting, paused]);

  function merchandiseCard(product: Product, large = false) {
    const image = getMainProductImage(product);
    const badge = large ? featuredReason : productBadge(product);
    return (
      <Link
        href={`/shop/${product.slug}`}
        className={large ? "group flex h-full flex-col" : "group block"}
      >
        <div
          className={`img-zoom relative overflow-hidden border border-white/15 bg-white/5 ${large ? "aspect-[4/5] min-h-0 flex-1 lg:aspect-auto" : "aspect-[4/5]"}`}
        >
          <Image
            src={image?.url || product.image}
            alt={image?.alt || product.imageAlt || product.name}
            fill
            sizes={
              large
                ? "(min-width: 1024px) 34vw, 100vw"
                : "(min-width: 1024px) 18vw, (min-width: 640px) 40vw, 50vw"
            }
            className="object-cover"
          />
          {badge && (
            <span
              className={`absolute bg-navy-950/85 font-semibold uppercase tracking-[0.16em] text-gold-400 ${large ? "left-5 top-5 border border-gold-400/70 px-3 py-2 text-[10px]" : "left-3 top-3 px-2 py-1 text-[9px]"}`}
            >
              {badge}
            </span>
          )}
        </div>
        <div
          className={
            large
              ? "border-x border-b border-white/15 px-5 py-5 sm:px-6"
              : "pt-3"
          }
        >
          {large && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-400">
              {product.category}
            </p>
          )}
          <div
            className={
              large
                ? "mt-2 flex items-baseline justify-between gap-4"
                : undefined
            }
          >
            <h3
              className={
                large
                  ? "font-display text-2xl leading-tight text-ivory-50"
                  : "font-display text-lg leading-tight text-ivory-50 transition-colors group-hover:text-gold-400"
              }
            >
              {product.name}
            </h3>
            <p
              className={
                large
                  ? "shrink-0 text-sm font-semibold text-ivory-50"
                  : "mt-1 text-sm text-ivory-100/65"
              }
            >
              {formatMoney(getCurrentPriceCents(product), product.currency)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      aria-label="EYC merchandise showcase"
    >
      <Reveal className="h-full [&>a]:h-full">
        {merchandiseCard(featured, true)}
      </Reveal>
      <div className="min-w-0 lg:h-full">
        <div
          className={`grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 ${visibleSupporting.length === VISIBLE_SUPPORTING_COUNT ? "lg:h-full lg:grid-rows-2" : ""}`}
        >
          {visibleSupporting.map((product, index) => (
            <Reveal
              key={product.slug}
              delay={index * 60}
              className={`${index >= 3 ? "hidden sm:block" : ""} ${visibleSupporting.length === VISIBLE_SUPPORTING_COUNT ? "h-full [&>a]:h-full" : ""}`}
            >
              {merchandiseCard(product)}
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
