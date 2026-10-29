import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { getPublicAssetPath } from "@/lib/public-assets";

export const metadata: Metadata = {
  title: "Restaurant & Dining",
  description:
    "A newly renovated waterfront restaurant and bar at Exuma Yacht Club is expected to open in December 2026 in George Town, Great Exuma.",
  alternates: { canonical: "/dining" },
  openGraph: {
    title: "Restaurant & Dining · Exuma Yacht Club",
    description:
      "A newly renovated waterfront restaurant and bar is expected to open in December 2026.",
    images: [getPublicAssetPath("/images/dining.jpg")],
  },
};

export default function DiningPage() {
  return (
    <>
      <PageHero
        overline="Restaurant & Bar"
        title="Waterfront dining is coming to the harbour"
        lede="Newly Renovated Restaurant & Bar — Coming December 2026"
        image={getPublicAssetPath("/images/dining.jpg")}
        imageAlt="Waterfront restaurant space at Exuma Yacht Club"
      />

      <section
        aria-labelledby="restaurant-announcement"
        className="border-y border-sand-200 bg-brand-mint-300/25 py-16 sm:py-20 lg:py-24"
      >
        <Container className="max-w-4xl">
          <Reveal>
            <div className="border border-sand-300 bg-white p-7 sm:p-10 lg:p-12">
              <p className="overline-label">A new chapter by the water</p>
              <h2
                id="restaurant-announcement"
                className="mt-4 max-w-3xl font-display text-3xl leading-tight text-navy-900 sm:text-4xl lg:text-5xl"
              >
                Newly Renovated Restaurant &amp; Bar — Coming December 2026
              </h2>
              <span className="gold-rule mt-6 block" aria-hidden="true" />
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
                Something special is coming to Exuma Yacht Club. Our newly
                renovated waterfront restaurant and bar is expected to open in
                December 2026, bringing a refreshed dining experience to the
                heart of Georgetown, Great Exuma. We look forward to welcoming
                guests to enjoy the setting, the waterfront atmosphere, and the
                island&apos;s relaxed spirit.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
