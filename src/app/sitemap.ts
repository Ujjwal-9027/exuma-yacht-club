import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getActiveProducts } from "@/lib/products";
import { rooms } from "@/data/rooms";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/marina",
    "/stay",
    "/dining",
    "/shop",
    "/gallery",
    "/about",
    "/faq",
    "/destination",
    "/attractions",
    "/getting-here",
    "/contact",
    "/privacy",
    "/terms",
    "/shipping",
    "/booking-cancellation",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path === "/shop" || path === "/marina" ? 0.9 : 0.7,
  }));

  const roomRoutes: MetadataRoute.Sitemap = rooms.map((room) => ({
    url: `${site.url}/stay/${room.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getActiveProducts();
    productRoutes = products.map((p) => ({
      url: `${site.url}/shop/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // If the catalog is unavailable, the static routes still ship.
  }

  return [...staticRoutes, ...roomRoutes, ...productRoutes];
}
