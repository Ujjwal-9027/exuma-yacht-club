import type { Collection } from "mongodb";
import type { Product } from "./schema";

export async function reserveProductStock(
  products: Collection<Product>,
  slug: string,
  quantity: number,
  size?: string | null,
  color?: string | null,
): Promise<boolean> {
  if (size || color) {
    const variantSelectors = [
      { size: size ?? null, color: color ?? null },
      ...(color ? [{ size: size ?? null, color: null }] : []),
      ...(size ? [{ size: null, color: color ?? null }] : []),
    ];

    for (const selector of variantSelectors) {
      const variant = await products.updateOne(
        {
          slug,
          active: true,
          variants: {
            $elemMatch: { ...selector, stockQty: { $gte: quantity } },
          },
        },
        { $inc: { "variants.$.stockQty": -quantity }, $set: { updatedAt: new Date() } },
      );
      if (variant.matchedCount > 0) return true;
    }

    const product = await products.findOne(
      { slug, active: true },
      { projection: { variants: 1 } },
    );
    if (product?.variants?.length) return false;
  }

  const tracked = await products.updateOne(
    { slug, active: true, trackInventory: true, stockQty: { $gte: quantity } },
    { $inc: { stockQty: -quantity }, $set: { updatedAt: new Date() } },
  );
  if (tracked.matchedCount > 0) return true;

  const product = await products.findOne(
    { slug, active: true },
    { projection: { trackInventory: 1, variants: 1 } },
  );
  return Boolean(product && product.trackInventory !== true);
}