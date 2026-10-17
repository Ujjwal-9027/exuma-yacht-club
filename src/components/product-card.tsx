import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { formatMoney } from "@/lib/format";
import {
  getCurrentPriceCents,
  getLowStockLabel,
  getMainProductImage,
  isNewArrival,
} from "@/lib/product-utils";

export function ProductCard({ product }: { product: Product }) {
  const mainImage = getMainProductImage(product);
  const currentPrice = getCurrentPriceCents(product);
  const lowStockLabel = getLowStockLabel(product);
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
          className="object-cover"
        />
        {lowStockLabel && (
          <span className="absolute left-3 top-3 border border-gold-400/70 bg-navy-950/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-400">
            {lowStockLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-5 py-5">
        <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
          <p className="text-gold-600">{product.category}</p>
          {product.featured && <span className="text-navy-900">Featured</span>}
          {isNewArrival(product) && <span className="text-navy-900">New</span>}
          {product.limitedEdition && (
            <span className="text-navy-900">Limited</span>
          )}
          {product.eycExclusive && (
            <span className="text-navy-900">EYC Exclusive</span>
          )}
          {product.giftIdea && <span className="text-navy-900">Gift idea</span>}
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
