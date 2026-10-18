import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatMoney } from "@/lib/format";
import {
  getCurrentPriceCents,
  getLowStockLabel,
  getMainProductImage,
  getProductImages,
} from "@/lib/product-utils";

export function ProductCard({ product }: { product: Product }) {
  const images = getProductImages(product);
  const mainImage = getMainProductImage(product);
  const mainIndex = images.findIndex((image) => image.url === mainImage?.url);
  const hoverImage =
    images.length > 1
      ? images[(mainIndex + 1 + images.length) % images.length]
      : null;
  const currentPrice = getCurrentPriceCents(product);
  const lowStockLabel = getLowStockLabel(product);
  const tags = [
    product.newArrival && "New Arrival",
    product.featured && "Featured",
    product.eycExclusive && "EYC Exclusive",
    product.limitedEdition && "Limited Edition",
    product.giftIdea && "Gift Idea",
    currentPrice < product.priceCents && "Sale",
  ].filter((tag): tag is string => Boolean(tag));
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="lift-card group flex flex-col border border-sand-300 bg-white transition-colors hover:border-gold-500"
    >
      <div className="relative aspect-square border-b border-sand-200 bg-ivory-100">
        <Image
          src={mainImage?.url || product.image}
          alt={mainImage?.alt || product.imageAlt || product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-opacity duration-500 ${
            hoverImage ? "group-hover:opacity-0" : ""
          }`}
        />
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            aria-hidden="true"
            className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {lowStockLabel && (
          <span className="absolute left-3 top-3 border border-gold-400/70 bg-navy-950/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-400">
            {lowStockLabel}
          </span>
        )}
        {tags.length > 0 && (
          <div className="absolute inset-x-3 bottom-3 z-10 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] shadow-sm ${
                  tag === "Sale"
                    ? "border-gold-400 bg-gold-500 text-navy-950"
                    : tag === "New Arrival"
                      ? "border-ivory-50/80 bg-ivory-50 text-navy-900"
                      : "border-gold-400/70 bg-navy-950/90 text-gold-400"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-5 py-5">
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
          <p className="text-gold-600">{product.category}</p>
        </div>
        <h3 className="font-display text-lg leading-snug text-navy-900">
          {product.name}
        </h3>
        {product.tagline && (
          <p className="text-[13px] leading-relaxed text-ink-500">
            {product.tagline}
          </p>
        )}
        <p className="mt-auto pt-3 text-sm font-semibold tracking-wide text-navy-900">
          {formatMoney(currentPrice, product.currency)}
          {currentPrice < product.priceCents && (
            <span className="ml-2 text-xs text-ink-400 line-through">
              {formatMoney(product.priceCents, product.currency)}
            </span>
          )}
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-600 opacity-0 transition-opacity group-hover:opacity-100">
            View →
          </span>
        </p>
      </div>
    </Link>
  );
}
