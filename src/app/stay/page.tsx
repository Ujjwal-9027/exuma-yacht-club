import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Anchor,
  ArrowDown,
  Bath,
  MapPin,
  Refrigerator,
  Snowflake,
  Tv,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";
import { site } from "@/lib/site";
import { ButtonLink, Container } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { DifferenceCardGrid } from "@/components/difference-card-grid";
import { BookingTransitionLink } from "@/components/booking-transition-link";
import { getManagedSiteSettings } from "@/lib/managed-site";

const roomImage =
  "/uploads/rooms/EYC3/48633b62-9d49-4706-9521-fea2edf81809.jpg";
const terraceImage =
  "/uploads/rooms/EYC3/ec6ffba1-7ce6-438b-83ce-d44921d3c672.jpg";
const bedroomImage =
  "/uploads/rooms/EYC3/acbb4d79-0b86-47f3-b0b3-bfa6d9c4c82c.jpg";
export const metadata: Metadata = {
  title: "Stay in Great Exuma",
  description:
    "Discover a relaxed waterfront stay at Exuma Yacht Club in George Town, Great Exuma, with convenient marina access and island experiences nearby.",
  alternates: { canonical: "/stay" },
  openGraph: {
    title: "Stay · Exuma Yacht Club",
    description: "A relaxed waterfront base for discovering Great Exuma.",
    images: [roomImage],
  },
};

const highlights = [
  {
    icon: "waves",
    title: "Waterfront setting",
    highlight: "Elizabeth Harbour",
    description: "The marina and fuel pier are nearby.",
    detail: "On Elizabeth Harbour, with the marina and fuel pier nearby.",
  },
  {
    icon: "location",
    title: "A convenient location",
    highlight: "A George Town base",
    description: "Nearby shops and local island experiences.",
    detail: "A George Town base for nearby shops and local island experiences.",
  },
  {
    icon: "anchor",
    title: "Marina access",
    highlight: "For boat travellers",
    description: "A convenient base through the Exumas.",
    detail:
      "A convenient base for guests travelling through the Exumas by boat.",
  },
  {
    icon: "dining",
    title: "Dining nearby",
    highlight: "Expected December 2026",
    description: "A newly renovated waterfront restaurant and bar.",
    detail:
      "A newly renovated waterfront restaurant and bar is expected to open in December 2026.",
  },
] as const;

const amenities = [
  { icon: Snowflake, label: "Air conditioning" },
  { icon: Bath, label: "Private bathroom" },
  { icon: Refrigerator, label: "Mini-refrigerator" },
  { icon: Tv, label: "Television" },
  { icon: Wifi, label: "In-room Wi-Fi" },
];

const gallery = [
  {
    src: roomImage,
    alt: "Guest room with a king bed and sitting area at Exuma Yacht Club.",
    caption: "A guest room at Exuma Yacht Club",
  },
  {
    src: bedroomImage,
    alt: "Guest bedroom with a ceiling fan and a view toward the terrace.",
    caption: "A quiet place to settle in",
  },
  {
    src: "/images/marina-1.jpg",
    alt: "Marina docks and boats at sunset.",
    caption: "Evenings around the marina",
  },
];

const lodgingJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: `${site.shortName} — Boutique Hotel`,
  description:
    "A relaxed waterfront stay in George Town, Great Exuma, with convenient access to the marina and local island experiences.",
  telephone: site.phone.href.replace("tel:", ""),
  email: site.email.label,
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
  const bookingUrl = settings.resnexusBookingUrl;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }}
      />
      <section className="bg-ivory-100 py-8 sm:py-12 lg:py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal className="py-4">
            <p className="overline-label">
              Accommodation · George Town, Great Exuma
            </p>
            <h1 className="mt-5 max-w-xl font-display text-4xl leading-[1.08] font-medium text-navy-900 sm:text-5xl lg:text-6xl">
              Stay on the Water&apos;s Edge
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Discover a relaxed waterfront stay at Exuma Yacht Club in George
              Town, Great Exuma. Enjoy convenient access to the marina, island
              experiences, and the best of life on the water.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <BookingTransitionLink
                bookingUrl={bookingUrl}
                ariaLabel="Book accommodation through ResNexus"
                hideWhenVisibleId="stay-booking-button"
              />
              <ButtonLink
                href="#stay-intro"
                variant="outline"
                className="stay-explore-link group"
              >
                Explore Your Stay
                <ArrowDown
                  className="h-4 w-4 text-gold-600 transition-colors group-hover:text-gold-400"
                  aria-hidden="true"
                />
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <figure className="hero-image-3d relative aspect-[4/3] overflow-hidden rounded border border-sand-300 bg-white">
              <Image
                src={terraceImage}
                alt="Covered guest terrace with turquoise seating at Exuma Yacht Club."
                fill
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover"
              />
            </figure>
          </Reveal>
        </Container>
      </section>

      <section
        id="stay-intro"
        aria-labelledby="stay-intro-heading"
        className="py-16 sm:py-20 lg:py-24"
      >
        <Container className="grid gap-7 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          <Reveal>
            <p className="overline-label">A warm island welcome</p>
            <h2
              id="stay-intro-heading"
              className="mt-4 max-w-xl font-display text-3xl leading-tight font-medium text-navy-900 sm:text-4xl"
            >
              A Boutique Base for Your Exuma Days
            </h2>
          </Reveal>
          <Reveal delay={100} className="self-end">
            <p className="max-w-2xl text-base leading-relaxed text-ink-700">
              Whether you&apos;re arriving by boat or flying in for a stay,
              Exuma Yacht Club offers an easy home base for discovering Great
              Exuma. Enjoy the relaxed waterfront setting, convenient marina
              access, and the welcoming spirit of the Bahamas.
            </p>
          </Reveal>
        </Container>
      </section>

      <section
        aria-labelledby="stay-highlights-heading"
        className="border-y border-sand-200 bg-white py-16 sm:py-20"
      >
        <Container>
          <Reveal className="max-w-2xl">
            <p className="overline-label">The setting</p>
            <h2
              id="stay-highlights-heading"
              className="mt-3 font-display text-3xl leading-tight font-medium text-navy-900 sm:text-4xl"
            >
              Close to the water, rooted in George Town
            </h2>
          </Reveal>
          <DifferenceCardGrid cards={highlights} layout="featured" />
        </Container>
      </section>

      <section
        aria-labelledby="stay-comforts-heading"
        className="py-16 sm:py-20 lg:py-24"
      >
        <Container>
          <Reveal className="max-w-2xl">
            <p className="overline-label">Room details</p>
            <h2
              id="stay-comforts-heading"
              className="mt-3 font-display text-3xl leading-tight font-medium text-navy-900 sm:text-4xl"
            >
              Comforts &amp; Convenience
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
              Current room listings include these comforts. Amenities can vary
              by accommodation, so check the details for your selected room
              through ResNexus.
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {amenities.map((amenity) => (
              <li
                key={amenity.label}
                className="amenity-tile flex min-h-[76px] items-center gap-3 rounded-lg border border-sand-300 bg-white px-4 py-3 text-sm font-semibold text-navy-900"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-gold-500/40 bg-ivory-100 text-gold-600">
                  <amenity.icon
                    className="h-5 w-5"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
                <span>{amenity.label}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        id="stay-gallery"
        aria-labelledby="stay-gallery-heading"
        className="bg-ivory-100 py-16 sm:py-20"
      >
        <Container>
          <Reveal className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="overline-label">A look around</p>
              <h2
                id="stay-gallery-heading"
                className="mt-3 font-display text-3xl leading-tight font-medium text-navy-900 sm:text-4xl"
              >
                Life by the harbour
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink-500">
              A glimpse of the guest spaces and marina setting at Exuma Yacht
              Club.
            </p>
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            {gallery.map((image, index) => (
              <figure
                key={image.src}
                className={`img-zoom relative overflow-hidden rounded border border-sand-300 bg-white ${
                  index === 0
                    ? "aspect-[4/3] lg:row-span-2 lg:aspect-auto lg:min-h-[32rem]"
                    : "aspect-[16/10]"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 58vw, 100vw"
                      : "(min-width: 1024px) 34vw, 100vw"
                  }
                  className="object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent px-4 pb-4 pt-10 text-sm font-medium text-white sm:px-5 sm:pb-5">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="stay-booking"
        aria-labelledby="stay-booking-heading"
        className="bg-navy-900 py-16 text-ivory-50 sm:py-20 lg:py-24"
      >
        <Container className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
          <Reveal className="max-w-2xl">
            <p className="overline-label !text-gold-400">Plan your visit</p>
            <h2
              id="stay-booking-heading"
              className="mt-3 font-display text-3xl leading-tight font-medium sm:text-4xl"
            >
              Find Your Stay
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ivory-100/75 sm:text-base">
              Ready to plan your time in Great Exuma? Check current
              availability, rates, and reservation details through our secure
              booking system.
            </p>
          </Reveal>
          <Reveal delay={100} className="flex flex-col items-start gap-4">
            <div id="stay-booking-button">
              <ButtonLink href={bookingUrl} variant="gold" external>
                Book Now
              </ButtonLink>
            </div>
            <Link
              href="/contact"
              className="text-sm font-semibold text-ivory-50 underline decoration-gold-400 underline-offset-4 transition-colors hover:text-gold-400"
            >
              Have a Question? Contact Us
            </Link>
          </Reveal>
          <p className="border-t border-ivory-50/15 pt-5 text-xs leading-relaxed text-ivory-100/60 lg:col-span-2">
            Rates, availability, and applicable booking terms are provided
            through the booking platform.{" "}
            <Link
              href="/booking-cancellation"
              className="font-medium text-ivory-50 underline decoration-gold-400 underline-offset-4 hover:text-gold-400"
            >
              Review booking terms
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
