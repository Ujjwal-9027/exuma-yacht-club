import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Store, Truck } from "lucide-react";
import { getActiveProducts, getProductBySlug } from "@/lib/products";
import { formatMoney } from "@/lib/format";
import { site } from "@/lib/site";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import {
  getCurrentPriceCents,
  getLowStockLabel,
  getProductImages,
} from "@/lib/product-utils";
import { getPublicAssetPath } from "@/lib/public-assets";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.metaTitle || product.name,
    description:
      product.metaDescription ||
      product.tagline ||
      product.description.slice(0, 155),
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} · ${site.shortName}`,
      description: product.tagline || undefined,
      images: [
        getPublicAssetPath(getProductImages(product)[0]?.url || product.image),
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const all = await getActiveProducts();
  const related = all.filter((p) => p.slug !== product.slug).slice(0, 4);
  const currentPrice = getCurrentPriceCents(product);
  const lowStockLabel = getLowStockLabel(product);
  const gallery = getProductImages(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.tagline,
    image: gallery.map((image) => `${site.url}${image.url}`),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: (currentPrice / 100).toFixed(2),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      url: `${site.url}/shop/${product.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Shop",
        item: `${site.url}/shop`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.name,
        item: `${site.url}/shop/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="py-10 lg:py-16">
        <Container>
          <Reveal>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-500 transition-colors hover:text-navy-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to the Shop
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <ProductGallery images={gallery} name={product.name} />
            </Reveal>

            <div>
              <Reveal>
                <p className="overline-label">{product.category}</p>
                <h1 className="mt-3 font-display text-3xl leading-[1.1] font-medium text-navy-900 sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-4 font-display text-2xl text-navy-900">
                  {formatMoney(currentPrice, product.currency)}
                  {currentPrice < product.priceCents && (
                    <span className="ml-2 text-base text-ink-400 line-through">
                      {formatMoney(product.priceCents, product.currency)}
                    </span>
                  )}
                  <span className="ml-2 align-middle text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-ink-400">
                    USD
                  </span>
                </p>
                {lowStockLabel && (
                  <p className="mt-3 inline-flex border border-gold-500/60 bg-ivory-100 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                    {lowStockLabel}
                  </p>
                )}
              </Reveal>
              <Reveal delay={80}>
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-700">
                  {product.description}
                </p>
              </Reveal>
              <Reveal delay={140} className="mt-8">
                <AddToCart product={product} />
              </Reveal>
              {(product.material ||
                product.fit ||
                product.careInstructions ||
                product.dimensions ||
                product.weight) && (
                <Reveal
                  delay={180}
                  className="mt-8 border-t border-sand-200 pt-6"
                >
                  <dl className="grid gap-3 text-sm leading-relaxed text-ink-500">
                    {product.material && (
                      <div>
                        <dt className="font-semibold text-navy-900">
                          Material
                        </dt>
                        <dd>{product.material}</dd>
                      </div>
                    )}
                    {product.fit && (
                      <div>
                        <dt className="font-semibold text-navy-900">Fit</dt>
                        <dd>{product.fit}</dd>
                      </div>
                    )}
                    {product.dimensions && (
                      <div>
                        <dt className="font-semibold text-navy-900">
                          Dimensions
                        </dt>
                        <dd>{product.dimensions}</dd>
                      </div>
                    )}
                    {product.weight && (
                      <div>
                        <dt className="font-semibold text-navy-900">Weight</dt>
                        <dd>{product.weight}</dd>
                      </div>
                    )}
                    {product.careInstructions && (
                      <div>
                        <dt className="font-semibold text-navy-900">Care</dt>
                        <dd>{product.careInstructions}</dd>
                      </div>
                    )}
                  </dl>
                </Reveal>
              )}
              <Reveal
                delay={200}
                className="mt-10 space-y-4 border-t border-sand-200 pt-8"
              >
                <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-500">
                  <Store
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  Orders placed online are collected and paid for at the marina
                  gift shop on Queen&apos;s Highway, George Town.
                </p>
                <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-500">
                  <Truck
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  Need it shipped?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-4 hover:text-gold-600"
                  >
                    Contact us
                  </Link>{" "}
                  for a shipping quote before ordering.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-t border-sand-200 bg-ivory-100 py-16 lg:py-20"
        >
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="overline-label">Keep Browsing</p>
                <h2
                  id="related-heading"
                  className="mt-3 font-display text-3xl text-navy-900"
                >
                  More from the collection
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden shrink-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-900 underline decoration-gold-500 underline-offset-6 hover:text-gold-600 sm:block"
              >
                View all
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
