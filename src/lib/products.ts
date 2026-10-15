import { db } from "@/db";
import type { Product } from "@/db/schema";

export async function getActiveProducts(): Promise<Product[]> {
  return db.getActiveProducts();
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  return db.getProductBySlug(slug);
}
