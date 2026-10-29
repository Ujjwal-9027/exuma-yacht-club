"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/db/schema";
import { Reveal } from "@/components/reveal";
import {
  getCurrentPriceCents,
  getProductImages,
  isNewArrival,
  type FeaturedProductReason,
} from "@/lib/product-utils";
import { formatMoney } from "@/lib/format";

function productBadge(product: Product): string | null {
  if (isNewArrival(product)) return "New Arrival";
  if (product.eycExclusive) return "EYC Exclusive";
  if (product.limitedEdition) return "Limited Edition";
  if (product.giftIdea) return "Gift Idea";
  if (product.featured) return "Featured";
  return null;
}

function ProductImageSlideshow({
  product,
  badge,
  large,
}: {
  product: Product;
  badge: string | null;
  large: boolean;
}) {
  const images = getProductImages(product);
  const fallbackImage = images[0] ?? {
    id: "fallback",
    url: product.image,
    alt: product.imageAlt || product.name,
    order: 0,
    isMain: true,
  };
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  function activateSlideshow() {
    setIsHovered(true);
    if (images.length > 1) {
      setActiveIndex((current) => (current + 1) % images.length);
    }
  }

  function resetSlideshow() {
    setIsHovered(false);
    setActiveIndex(0);
  }

  useEffect(() => {
    if (
      images.length <= 1 ||
      !isHovered ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [images.length, isHovered]);

  return (
    <div
      onMouseEnter={activateSlideshow}
      onMouseLeave={resetSlideshow}
      onFocus={activateSlideshow}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          resetSlideshow();
        }
      }}
      className="relative min-h-0 flex-1 overflow-hidden bg-white/5"
    >
      {[...images, ...(images.length ? [] : [fallbackImage])].map(
        (image, index) => (
          <Image
            key={image.id}
            src={image.url}
            alt={image.alt || product.name}
            fill
            sizes={
              large
                ? "(min-width: 1024px) 34vw, 100vw"
                : "(min-width: 1024px) 18vw, (min-width: 640px) 40vw, 50vw"
            }
            className={`object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
            priority={large && index === 0}
          />
        ),
      )}
      {badge && (
        <span
          className={`absolute z-10 bg-navy-950/85 font-semibold uppercase tracking-[0.16em] text-gold-400 ${large ? "left-5 top-5 border border-gold-400/70 px-3 py-2 text-[10px]" : "left-3 top-3 px-2 py-1 text-[9px]"}`}
        >
          {badge}
        </span>
      )}
    </div>
  );
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
  const supportingTrackRef = useRef<HTMLDivElement>(null);

  function showNextSupportingProduct() {
    const track = supportingTrackRef.current;
    const firstCard = track?.firstElementChild;
    if (!(track && firstCard instanceof HTMLElement)) return;

    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    const nextPosition = atEnd
      ? 0
      : track.scrollLeft + firstCard.offsetWidth + 16;
    track.scrollTo({
      left: nextPosition,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  function merchandiseCard(product: Product, large = false) {
    const badge = large ? featuredReason : productBadge(product);
    return (
      <Link
        href={`/shop/${product.slug}`}
        className="merchandise-card group flex h-96 w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/5 transition-[box-shadow,transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold-400/50 hover:shadow-[0_24px_50px_rgba(0,0,0,0.24)] motion-reduce:transition-none motion-reduce:hover:transform-none"
      >
        <ProductImageSlideshow product={product} badge={badge} large={large} />
        <div className={large ? "px-5 py-5 sm:px-6" : "px-5 pb-5 pt-4"}>
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
      aria-label="EYC merchandise showcase"
    >
      <Reveal className="h-96 [&>a]:h-full">
        {merchandiseCard(featured, true)}
      </Reveal>
      <div className="min-w-0 lg:flex lg:h-full lg:items-center">
        <div className="relative min-w-0 flex-1">
          <div
            ref={supportingTrackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Supporting products"
            className="home-supporting-track -mt-3 flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pt-3"
          >
            {supporting.map((product, index) => (
              <Reveal
                key={product.slug}
                delay={Math.min(index * 50, 250)}
                className="h-96 w-[62vw] max-w-[220px] shrink-0 snap-start sm:w-[38vw] sm:max-w-none lg:w-[30%]"
              >
                {merchandiseCard(product)}
              </Reveal>
            ))}
          </div>
          {supporting.length > 1 && (
            <button
              type="button"
              aria-label="Show next products"
              onClick={showNextSupportingProduct}
              className="absolute right-3 top-[40%] z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-transparent text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)] transition-[border-color,color,transform] duration-300 hover:scale-105 hover:border-gold-300 hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none motion-reduce:hover:transform-none"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
