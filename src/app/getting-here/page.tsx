import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { gettingHereContent } from "@/data/pages";
import { config, isPlaceholder } from "@/config/site";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { DifferenceCardGrid } from "@/components/difference-card-grid";
import { getPublicAssetPath } from "@/lib/public-assets";

export const metadata: Metadata = {
  title: "Getting Here",
  description:
    "How to reach Exuma Yacht Club — by sea into Elizabeth Harbour (VHF 16), by air via Exuma International Airport (GGT), and by taxi to George Town.",
  alternates: { canonical: "/getting-here" },
  openGraph: {
    title: "Getting Here · Exuma Yacht Club",
    description: "By sea, by air, by taxi — three easy ways to reach the club.",
    images: [getPublicAssetPath("/images/getting-here-hero.jpg")],
  },
};

export default function GettingHerePage() {
  const modes = [
    {
      icon: "ship",
      title: gettingHereContent.bySea.title,
      highlight: "Enter Elizabeth Harbour",
      description: "Hail the dock office on VHF Channel 16 as you approach.",
      detail: gettingHereContent.bySea.body,
    },
    {
      icon: "compass",
      title: gettingHereContent.byAir.title,
      highlight: "Exuma International · GGT",
      description: "Regional and international connections vary by season.",
      detail: gettingHereContent.byAir.body,
    },
    {
      icon: "location",
      title: gettingHereContent.byRoad.title,
      highlight: "About 15–20 minutes",
      description: "Taxis meet arriving flights at the airport terminal.",
      detail: gettingHereContent.byRoad.body,
    },
  ] as const;

  return (
    <>
      <PageHero
        overline="Getting Here"
        title="Three ways to arrive"
        lede={gettingHereContent.heroLede}
        image={getPublicAssetPath("/images/getting-here-hero.jpg")}
        imageAlt="Exuma Yacht Club sign surrounded by palm trees"
      />

      <section aria-labelledby="routes-heading" className="py-20 lg:py-24">
        <Container>
          <h2 id="routes-heading" className="sr-only">
            Travel options
          </h2>
          <DifferenceCardGrid cards={modes} layout="compact" />
        </Container>
      </section>

      {/* Map + address */}
      <section
        aria-labelledby="map-heading"
        className="border-t border-sand-200 bg-ivory-100 py-20 lg:py-24"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                overline="Find Us"
                title="On Queen's Highway, George Town"
                lede={`${site.address.street}, ${site.address.locality}, ${site.address.country} · ${site.coordinates.display} on ${site.coordinates.bodyOfWater}.`}
              />
              <h2 id="map-heading" className="sr-only">
                Map and directions
              </h2>
              <Reveal
                delay={120}
                className="mt-8 flex flex-wrap items-center gap-5"
              >
                {isPlaceholder(config.googleMapsUrl) ? (
                  <span
                    aria-disabled="true"
                    title="Directions link not configured yet"
                    className="inline-flex cursor-not-allowed items-center gap-2 border border-sand-300 bg-sand-200/60 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-400"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Get Directions
                  </span>
                ) : (
                  <a
                    href={config.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-navy-900 bg-navy-900 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Get Directions
                  </a>
                )}
                <span className="text-xs text-ink-400">
                  The map below always shows our verified location.
                </span>
              </Reveal>
            </div>
            <Reveal delay={100}>
              <div className="h-full min-h-[340px] overflow-hidden border border-sand-300 bg-white">
                <iframe
                  title="Map showing Exuma Yacht Club on Queen's Highway, George Town, Great Exuma"
                  src={site.mapsEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[340px] w-full border-0"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
