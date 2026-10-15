import type { Metadata } from "next";
import Image from "next/image";
import { destinationContent } from "@/data/pages";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Destination — Exuma & The Bahamas",
  description:
    "Discover the Exuma Cays and The Bahamas — 365 islands, Elizabeth Harbour, George Town and the famous turquoise water surrounding Exuma Yacht Club.",
  alternates: { canonical: "/destination" },
  openGraph: {
    title: "Destination · Exuma Yacht Club",
    description: "365 islands and cays — welcome to Exuma, The Bahamas.",
    images: ["/images/hero-marina-aerial.jpg"],
  },
};

export default function DestinationPage() {
  return (
    <>
      <PageHero
        overline="The Destination"
        title="Exuma & The Bahamas"
        lede={destinationContent.heroLede}
        image="/images/hero-marina-aerial.jpg"
        imageAlt="Aerial view of turquoise water and sandbars in the Exuma Cays"
      />

      <section aria-label="About the destination" className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            {destinationContent.sections.map((section, i) => (
              <Reveal key={section.title} delay={(i % 2) * 70}>
                <article className="flex h-full flex-col border border-sand-300 bg-white p-8">
                  <h2 className="font-display text-2xl text-navy-900">
                    {section.title}
                  </h2>
                  <span className="gold-rule mt-3 block" aria-hidden="true" />
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                    {section.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { src: "/images/hero-marina-aerial.jpg", alt: "Turquoise water and sandbars from the air in Exuma" },
              { src: "/images/marina-docks.jpg", alt: "Yachts at rest in Elizabeth Harbour" },
              { src: "/images/dining.jpg", alt: "Evening light over the club's waterfront restaurant" },
              { src: "/images/stay-room.jpg", alt: "A harbour-view room at the club's boutique hotel" },
            ].map((img, i) => (
              <Reveal key={img.src} delay={i * 60}>
                <div className={`img-zoom relative ${i % 2 === 1 ? "lg:mt-8" : ""} aspect-[4/5]`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 flex flex-col items-start gap-6 border border-sand-300 bg-ivory-100 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <h2 className="max-w-md font-display text-2xl text-navy-900">
              Make the club your base while you explore.
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/stay" variant="primary">
                Plan Your Stay
              </ButtonLink>
              <ButtonLink href="/attractions" variant="outline">
                Things to Do
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
