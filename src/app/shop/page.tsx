import type { Metadata } from "next";
import { PackageOpen, ShoppingBag } from "lucide-react";
import { getActiveProducts } from "@/lib/products";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { ShopHero } from "@/components/shop-hero";
import { ShopFilters } from "@/components/shop-filters";
import { OrderProcessCards } from "@/components/order-process-cards";
import { getPublicAssetPath } from "@/lib/public-assets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — Merchandise & Gifts",
  description:
    "Club apparel and island essentials from the Exuma Yacht Club gift shop. Order online and collect at the marina in George Town, Exuma.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Merchandise & Gift Shop · Exuma Yacht Club",
    description:
      "Club apparel and island essentials — order online and collect at the marina.",
    images: [getPublicAssetPath("/images/Shop/hero1.jpg")],
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const all = await getActiveProducts();
  const categories = [...new Set(all.map((p) => p.category))].sort();
  const activeCategory = categories.includes(category ?? "") ? category : null;

  return (
    <>
      <ShopHero />

      <section aria-labelledby="products-heading" className="py-16 lg:py-20">
        <Container>
          <div className="flex flex-col gap-3 border-b border-sand-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="overline-label">Shop the Collection</p>
              <h2
                id="products-heading"
                className="mt-3 font-display text-3xl text-navy-900"
              >
                {activeCategory ?? "All products"}
              </h2>
            </div>
            <p className="text-sm text-ink-500">
              {all.length} item{all.length === 1 ? "" : "s"} · Prices in USD ·
              Collect at the dock or ship
            </p>
          </div>

          {all.length > 0 ? (
            <ShopFilters
              products={all}
              categories={categories}
              initialCategory={activeCategory}
            />
          ) : (
            <div className="mt-10 flex flex-col items-center border border-sand-300 bg-white px-6 py-20 text-center">
              <PackageOpen
                className="h-10 w-10 text-gold-600"
                strokeWidth={1.4}
                aria-hidden="true"
              />
              <h2 className="mt-5 font-display text-2xl text-navy-900">
                The shop is being restocked
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
                Our online shelves are being filled. In the meantime, visit the
                gift shop at the marina — or ask the team about current
                merchandise.
              </p>
              <ButtonLink href="/contact" variant="primary" className="mt-8">
                <ShoppingBag
                  className="h-4 w-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                Ask the Team
              </ButtonLink>
            </div>
          )}
        </Container>
      </section>

      {/* How ordering works */}
      <section
        aria-label="How ordering works"
        className="border-t border-sand-200 bg-ivory-100 py-16"
      >
        <Container>
          <SectionHeading
            overline="How Ordering Works"
            title="Everything you need to know about your order"
            lede="Browse the collection, choose delivery or store pickup, and follow the simple steps from checkout to receiving your items."
          />
          <OrderProcessCards />
        </Container>
      </section>
    </>
  );
}
