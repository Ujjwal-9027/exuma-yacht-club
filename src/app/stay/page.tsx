import type { Metadata } from "next";
import Image from "next/image";
import { BedDouble, MapPin, UtensilsCrossed, Waves } from "lucide-react";
import { site } from "@/lib/site";
import {
  ButtonLink,
  Container,
  PageHero,
  SectionHeading,
} from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { getManagedSiteSettings } from "@/lib/managed-site";

export const metadata: Metadata = {
  title: "Stay — Boutique Hotel",
  description:
    "Comfortable accommodation at Exuma Yacht Club in George Town, Great Exuma, with suites and rooms near the marina and waterfront dining.",
  alternates: { canonical: "/stay" },
  openGraph: {
    title: "Stay · Exuma Yacht Club",
    description:
      "Comfortable accommodation at Exuma Yacht Club in George Town, Great Exuma.",
    images: ["/images/stay-room.jpg"],
  },
};

const highlights = [
  {
    icon: Waves,
    title: "On the water",
    text: "Set directly on Elizabeth Harbour, with the marina and fuel pier at your doorstep.",
  },
  {
    icon: BedDouble,
    title: "A convenient base",
    text: "Stay close to marina services, waterfront dining and the places you want to explore in the Exumas.",
  },
  {
    icon: UtensilsCrossed,
    title: "Dine at the club",
    text: "The on-site restaurant & bar serves Caribbean cuisine with an international twist, overlooking the harbour.",
  },
  {
    icon: MapPin,
    title: "Heart of George Town",
    text: "Grocery and liquor stores sit directly across the street, and Stocking Island is a short boat ride away.",
  },
];

const lodgingJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: `${site.shortName} — Boutique Hotel`,
  description:
    "Comfortable accommodation at Exuma Yacht Club in George Town, Great Exuma, near marina services and waterfront dining.",
  telephone: "+1-242-336-2578",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: "George Town",
    addressRegion: "Exuma",
    addressCountry: "BS",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.coordinates.lat,
    longitude: site.coordinates.lng,
  },
};

export default async function StayPage() {
  const settings = await getManagedSiteSettings();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }}
      />
      <PageHero
        overline="Accommodation"
        title="Stay on the Water's Edge"
        lede="Discover comfortable accommodation at Exuma Yacht Club in George Town, Great Exuma. Choose from our suites and rooms, with select accommodations offering views of the water, marina or garden. Enjoy a convenient base for exploring the Exumas, with marina services and waterfront dining nearby."
        image="/images/stay-room.jpg"
        imageAlt="Temporary accommodation image — room-specific photography pending approval"
      />

      {/* Intro + highlights */}
      <section aria-labelledby="stay-highlights" className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                overline="The Hotel"
                title="A boutique base for your Exuma days"
                lede="Whether you're cruising through the Exumas or flying in for a week on the water, the club is an easy home base — unhurried, waterside, and genuinely Bahamian."
              />
              <h2 id="stay-highlights" className="sr-only">
                Stay highlights
              </h2>
              <Reveal
                delay={140}
                className="mt-8 border border-sand-300 bg-ivory-100 p-6"
              >
                <p className="text-sm leading-relaxed text-ink-700">
                  <span className="font-semibold text-navy-900">
                    Rates & availability:
                  </span>{" "}
                  Rates vary by season and room — check the secure booking
                  system or contact our team for current availability and
                  pricing.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <div className="grid gap-6 sm:grid-cols-2">
                {highlights.map((item, i) => (
                  <Reveal key={item.title} delay={(i % 2) * 80}>
                    <div className="flex h-full flex-col border border-sand-300 bg-white p-6">
                      <item.icon
                        className="h-6 w-6 text-gold-600"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h3 className="mt-4 font-display text-xl text-navy-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Image band */}
      <section
        aria-label="Hotel views"
        className="grid grid-cols-1 gap-px border-y border-sand-200 bg-sand-200 sm:grid-cols-3"
      >
        {[
          {
            src: "/images/stay-room.jpg",
            alt: "Boutique hotel room with crisp white linens and a sea view",
          },
          {
            src: "/images/marina-docks.jpg",
            alt: "The marina at golden hour, steps from the hotel",
          },
          {
            src: "/images/dining.jpg",
            alt: "The waterfront restaurant and bar at the club",
          },
        ].map((img) => (
          <div
            key={img.src}
            className="img-zoom relative aspect-[4/3] bg-white"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </section>

      {/* Booking guidance */}
      <section aria-labelledby="stay-form-heading" className="py-20 lg:py-24">
        <Container>
          <div className="max-w-2xl">
            <SectionHeading
              overline="Accommodation"
              title="Find Your Stay"
              lede="Choose your dates and explore available rooms and rates through our secure booking system."
            />
            <h2 id="stay-form-heading" className="sr-only">
              Stay booking options
            </h2>
            <Reveal delay={120} className="mt-8">
              <div className="flex flex-col items-start gap-3 sm:flex-row">
                <ButtonLink
                  href={settings.resnexusBookingUrl}
                  variant="gold"
                  external
                >
                  Check Availability &amp; Book
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Have a Question? Contact Us
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section aria-label="Explore the marina" className="bg-navy-900 py-14">
        <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal>
            <h2 className="font-display text-2xl text-ivory-50 sm:text-3xl">
              Arriving by boat? Combine your stay with dockage.
            </h2>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/marina#request-dockage" variant="gold">
              Request Dockage
            </ButtonLink>
            <ButtonLink href="/marina" variant="outlineLight">
              Explore the Marina
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
