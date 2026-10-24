import type { Metadata } from "next";
import { attractions } from "@/data/pages";
import {
  ButtonLink,
  Container,
  PageHero,
  SectionHeading,
} from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { AttractionCardGrid } from "@/components/attraction-card-grid";

export const metadata: Metadata = {
  title: "Attractions & Activities",
  description:
    "Local attractions around Exuma Yacht Club — swimming pigs, Stocking Island, Chat 'N' Chill, Thunderball Grotto, the Land and Sea Park and more.",
  alternates: { canonical: "/attractions" },
  openGraph: {
    title: "Attractions & Activities · Exuma Yacht Club",
    description:
      "The best of Exuma, from the club's doorstep on Elizabeth Harbour.",
    images: ["/images/attraction-hero.jpg"],
  },
};

export default function AttractionsPage() {
  return (
    <>
      <PageHero
        overline="Attractions & Activities"
        title="Exuma, from our doorstep"
        lede="From swimming pigs to hidden grottos, the Exumas are made for days on the water. The team can point you to trusted local operators — nothing here needs to be planned alone."
        image="/images/attraction-hero.jpg"
        imageAlt="Boat travelling through turquoise water beside a green island in Exuma"
      />

      <section aria-labelledby="attractions-heading" className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            overline="Explore"
            title="Things to do around the club"
            lede="A starting list of Exuma favourites. Distances vary — most cays are reached by boat, and tours can be arranged locally."
          />
          <h2 id="attractions-heading" className="sr-only">
            Local attractions
          </h2>
          <AttractionCardGrid attractions={attractions} />

          <Reveal className="mt-16 flex flex-col items-start gap-6 border border-sand-300 bg-ivory-100 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <h2 className="max-w-md font-display text-2xl text-navy-900">
              Arriving by boat? Ask the dock office for pointers.
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" variant="primary">
                Ask the Team
              </ButtonLink>
              <ButtonLink href="/stay" variant="outline">
                Plan Your Stay
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
