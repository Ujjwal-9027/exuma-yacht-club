import type { Product, ProductImage, ProductVariant } from "@/db/schema";

export function getProductImages(product: Product): ProductImage[] {
  if (product.images?.length) {
    return [...product.images].sort((a, b) => a.order - b.order);
  }
  if (!product.image) return [];
  return [{ id: "legacy-main", url: product.image, alt: product.imageAlt || product.name, order: 0, isMain: true }];
}

export function getMainProductImage(product: Product): ProductImage | null {
  const images = getProductImages(product);
  return images.find((image) => image.isMain) ?? images[0] ?? null;
}

export function getSalePriceCents(product: Product, now = new Date()): number | null {
  if (!Number.isInteger(product.salePriceCents) || product.salePriceCents! < 0) return null;
  const comparisonPrice = product.compareAtPriceCents ?? product.priceCents;
  if (product.salePriceCents! >= comparisonPrice) return null;
  if (product.saleStartsAt && new Date(product.saleStartsAt) > now) return null;
  if (product.saleEndsAt && new Date(product.saleEndsAt) < now) return null;
  return product.salePriceCents!;
}

export function getCurrentPriceCents(product: Product, variant?: ProductVariant | null, now = new Date()): number {
  return getSalePriceCents(product, now) ?? variant?.priceCents ?? product.priceCents;
}

export function findProductVariant(product: Pick<Product, "variants">, size: string | null, color: string | null): ProductVariant | null {
  const variants = product.variants ?? [];
  return (
    variants.find(
      (variant) =>
        (variant.size ?? null) === size && (variant.color ?? null) === color,
    ) ??
    variants.find(
      (variant) =>
        (variant.size ?? null) === size && (variant.color ?? null) === null,
    ) ??
    variants.find(
      (variant) =>
        (variant.size ?? null) === null && (variant.color ?? null) === color,
    ) ??
    null
  );
}

export function isNewArrival(product: Product, now = new Date()): boolean {
  if (!product.newArrival || !product.publishedAt) return false;
  const days = product.newArrivalWindowDays ?? 30;
  return now.getTime() - new Date(product.publishedAt).getTime() <= days * 24 * 60 * 60 * 1000;
}

export function getLowStockLabel(
  product: Product,
  variant?: Pick<ProductVariant, "stockQty"> | null,
): string | null {
  if (product.trackInventory !== true) return null;
  const remaining = variant ? variant.stockQty ?? 0 : product.stockQty ?? 0;
  if (remaining === 0) return "Out of stock. We'll restock soon.";
  return remaining > 0 && remaining < 5 ? `Only ${remaining} left` : null;
}

export function getProductStockLimit(
  product: Pick<Product, "trackInventory" | "stockQty">,
  variant?: Pick<ProductVariant, "stockQty"> | null,
): number | null {
  if (product.trackInventory !== true) return null;
  return Math.max(0, variant ? variant.stockQty ?? 0 : product.stockQty ?? 0);
}

export type FeaturedProductReason =
  | "New Arrival"
  | "EYC Exclusive"
  | "Limited Edition"
  | "Gift Idea"
  | "Featured Product"
  | "From the Collection";

export type HomepageMerchandise = {
  featured: Product | null;
  featuredReason: FeaturedProductReason | null;
  supporting: Product[];
};

const featuredPriorities: Array<{
  label: Exclude<FeaturedProductReason, "From the Collection">;
  matches: (product: Product, now: Date) => boolean;
}> = [
  { label: "New Arrival", matches: (product, now) => isNewArrival(product, now) },
  { label: "EYC Exclusive", matches: (product) => Boolean(product.eycExclusive) },
  { label: "Limited Edition", matches: (product) => Boolean(product.limitedEdition) },
  { label: "Gift Idea", matches: (product) => Boolean(product.giftIdea) },
  { label: "Featured Product", matches: (product) => Boolean(product.featured) },
];

export function getFeaturedProductReason(
  product: Product,
  now = new Date(),
): FeaturedProductReason {
  return (
    featuredPriorities.find((priority) => priority.matches(product, now))?.label ??
    "From the Collection"
  );
}

function isAvailableForPurchase(product: Product): boolean {
  return product.trackInventory !== true || (product.stockQty ?? 0) > 0;
}

function preferAvailable(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => Number(isAvailableForPurchase(b)) - Number(isAvailableForPurchase(a)),
  );
}

export function getHomepageMerchandise(
  products: Product[],
  now = new Date(),
): HomepageMerchandise {
  const ordered = products.filter(
    (product) =>
      Boolean(getMainProductImage(product)?.url) &&
      isAvailableForPurchase(product),
  );
  let featured: Product | null = null;
  let featuredReason: FeaturedProductReason | null = null;

  for (const priority of featuredPriorities) {
    const candidate = preferAvailable(
      ordered.filter((product) => priority.matches(product, now)),
    )[0];
    if (candidate) {
      featured = candidate;
      featuredReason = priority.label;
      break;
    }
  }

  if (!featured) {
    featured = preferAvailable(ordered)[0] ?? null;
    featuredReason = featured ? "From the Collection" : null;
  }

  const remaining = ordered.filter((product) => product.slug !== featured?.slug);
  const supporting = remaining;

  return { featured, featuredReason, supporting };
}
