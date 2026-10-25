import type { Metadata } from "next";
import Image from "next/image";
import { destinationContent } from "@/data/pages";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { DifferenceCardGrid } from "@/components/difference-card-grid";

const destinationCards = [
  {
    icon: "waves",
    title: destinationContent.sections[0].title,
    highlight: "365 islands and cays",
    description: "A 120-mile chain in the central Bahamas.",
    detail: destinationContent.sections[0].body,
  },
  {
    icon: "anchor",
    title: destinationContent.sections[1].title,
    highlight: "The Exumas' cruising hub",
    description: "A broad, protected natural harbour in George Town.",
    detail: destinationContent.sections[1].body,
  },
  {
    icon: "compass",
    title: destinationContent.sections[2].title,
    highlight: "Turquoise, from sandbank to channel",
    description:
      "Shallow banks, tidal creeks and deeper water shape the Exuma coastline.",
    detail: destinationContent.sections[2].body,
  },
  {
    icon: "ship",
    title: destinationContent.sections[3].title,
    highlight: "An Atlantic island nation",
    description: "Around 700 islands, southeast of Florida.",
    detail: destinationContent.sections[3].body,
  },
] as const;

export const metadata: Metadata = {
  title: "Destination — Exuma & The Bahamas",
  description:
    "Discover the Exuma Cays and The Bahamas — 365 islands, Elizabeth Harbour, George Town and the famous turquoise water surrounding Exuma Yacht Club.",
  alternates: { canonical: "/destination" },
  openGraph: {
    title: "Destination · Exuma Yacht Club",
    description: "365 islands and cays — welcome to Exuma, The Bahamas.",
    images: ["/images/destination-hero.jpg"],
  },
};

export default function DestinationPage() {
  return (
    <>
      <PageHero
        overline="The Destination"
        title="Exuma & The Bahamas"
        lede={destinationContent.heroLede}
        image="/images/destination-hero.jpg"
        imageAlt="Palm trees framing turquoise water and the marina on Elizabeth Harbour"
      />

      <section aria-label="About the destination" className="py-20 lg:py-24">
        <Container>
          <DifferenceCardGrid cards={destinationCards} />

          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                src: "/images/hero-marina-aerial.jpg",
                alt: "Turquoise water and sandbars from the air in Exuma",
              },
              {
                src: "/images/Marina/marina-docks.jpg",
                alt: "Yachts at rest in Elizabeth Harbour",
              },
              {
                src: "/images/dining.jpg",
                alt: "Evening light over the club's waterfront restaurant",
              },
              {
                src: "/images/stay-room.jpg",
                alt: "A harbour-view room at the club's boutique hotel",
              },
            ].map((img, i) => (
              <Reveal key={img.src} delay={i * 60}>
                <div
                  className={`hero-image-3d relative overflow-hidden rounded border border-sand-300 bg-white ${i % 2 === 1 ? "lg:mt-8" : ""} aspect-[4/5]`}
                >
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
