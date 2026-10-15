import type { Metadata } from "next";
import { PackageOpen, ShoppingBag } from "lucide-react";
import { getActiveProducts } from "@/lib/products";
import { ButtonLink, Container } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { ShopHero } from "@/components/shop-hero";

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
    images: ["/images/shop-tee.jpg"],
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
  const products = activeCategory
    ? all.filter((p) => p.category === activeCategory)
    : all;

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
              {products.length} item{products.length === 1 ? "" : "s"} · Prices
              in USD · Collect at the dock or ship
            </p>
          </div>

          {categories.length > 1 && (
            <nav aria-label="Shop categories" className="mt-6">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a
                    href="/shop"
                    aria-current={!activeCategory ? "true" : undefined}
                    className={`inline-block border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      !activeCategory
                        ? "border-navy-900 bg-navy-900 text-ivory-50"
                        : "border-sand-300 bg-white text-ink-700 hover:border-navy-800"
                    }`}
                  >
                    All
                  </a>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <a
                      href={`/shop?category=${encodeURIComponent(cat)}`}
                      aria-current={activeCategory === cat ? "true" : undefined}
                      className={`inline-block border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                        activeCategory === cat
                          ? "border-navy-900 bg-navy-900 text-ivory-50"
                          : "border-sand-300 bg-white text-ink-700 hover:border-navy-800"
                      }`}
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {products.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <Reveal key={product.slug} delay={(i % 4) * 60}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center border border-sand-300 bg-white px-6 py-20 text-center">
              <PackageOpen className="h-10 w-10 text-gold-600" strokeWidth={1.4} aria-hidden="true" />
              <h2 className="mt-5 font-display text-2xl text-navy-900">
                The shop is being restocked
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
                Our online shelves are being filled. In the meantime, visit the
                gift shop at the marina — or ask the team about current
                merchandise.
              </p>
              <ButtonLink href="/contact" variant="primary" className="mt-8">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                Ask the Team
              </ButtonLink>
            </div>
          )}
        </Container>
      </section>

      {/* How ordering works */}
      <section aria-label="How ordering works" className="border-t border-sand-200 bg-ivory-100 py-16">
        <Container>
          <div className="grid gap-px overflow-hidden border border-sand-200 bg-sand-200 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Place your order",
                text: "Add items to your cart and check out — no online payment required.",
              },
              {
                step: "02",
                title: "We set it aside",
                text: "The gift shop confirms your order and holds your items at the marina.",
              },
              {
                step: "03",
                title: "Collect & pay at pickup",
                text: "Pick up at the gift shop on Queen's Highway and pay when you collect.",
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 70}>
                <div className="flex h-full flex-col gap-3 bg-white p-7">
                  <span className="font-display text-sm text-gold-600">
                    {item.step}
                  </span>
                  <h2 className="font-display text-lg text-navy-900">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-ink-500">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
