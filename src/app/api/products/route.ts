import { NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/products";
import { getCurrentPriceCents, getMainProductImage } from "@/lib/product-utils";

export const dynamic = "force-dynamic";

/** Public product catalog for the client-side cart. No sensitive data. */
export async function GET() {
  const products = await getActiveProducts();
  return NextResponse.json({
    products: products.map((p) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      category: p.category,
      priceCents: p.priceCents,
      currency: p.currency,
      image: getMainProductImage(p)?.url || p.image,
      imageAlt: getMainProductImage(p)?.alt || p.imageAlt,
      images: p.images ?? [],
      currentPriceCents: getCurrentPriceCents(p),
      trackInventory: p.trackInventory === true,
      stockQty: p.trackInventory === true ? p.stockQty ?? 0 : null,
      variants: (p.variants ?? []).map((variant) => ({
        id: variant.id,
        size: variant.size ?? null,
        color: variant.color ?? null,
        stockQty: variant.stockQty ?? null,
      })),
      badges: { featured: p.featured === true, newArrival: p.newArrival === true, limitedEdition: p.limitedEdition === true, eycExclusive: p.eycExclusive === true, giftIdea: p.giftIdea === true },
      sizes: p.sizes,
      colors: p.colors,
    })),
  });
}
