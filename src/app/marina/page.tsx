import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, LifeBuoy, MapPin, Phone, Radio } from "lucide-react";
import { site } from "@/lib/site";
import { marinaRates } from "@/data/marinaRates";
import { marinaAmenities } from "@/data/marinaAmenities";
import { Container, SectionHeading } from "@/components/ui";
import { MarinaHero } from "@/components/marina-hero";
import { Reveal } from "@/components/reveal";
import { ConfiguredBookingLink } from "@/components/configured-link";
import { getManagedSiteSettings } from "@/lib/managed-site";

export const metadata: Metadata = {
  title: "Marina & Dockage",
  description:
    "Breakwater-protected dockage on Elizabeth Harbour for vessels up to 120 ft, with shore power, fresh water and a fuel pier in George Town.",
  alternates: { canonical: "/marina" },
  openGraph: {
    title: "Marina & Dockage · Exuma Yacht Club",
    description:
      "Protected dockage in the heart of George Town, Great Exuma — vessels up to 120 ft, power, water and fuel.",
    images: ["/images/marina-docks.jpg"],
  },
};

const facts = [
  { label: "Max vessel length", value: "Up to 120 ft LOA" },
  { label: "Depth alongside", value: "Approx. 7 ft at high water" },
  { label: "Dockage", value: "± 4,000 linear feet" },
  { label: "Protection", value: "Breakwater-sheltered harbour" },
  { label: "Shore services", value: "Power & fresh water" },
  { label: "Fuel pier", value: "Gas & diesel" },
  { label: "Dock office", value: "VHF Channel 16" },
  { label: "Position", value: site.coordinates.display },
];

export default async function MarinaPage() {
  const settings = await getManagedSiteSettings();
  return (
    <>
      <MarinaHero dockwaUrl={settings.dockwaUrl} />

      {/* Facts */}
      <section aria-labelledby="marina-facts" className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            overline="The Marina"
            title="At a glance"
            lede="Everything below reflects the marina's current published details. For anything specific to your vessel, contact the dock office."
          />
          <h2 id="marina-facts" className="sr-only">
            Marina facts
          </h2>
          <dl className="mt-12 grid gap-px overflow-hidden border border-sand-200 bg-sand-200 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact, i) => (
              <Reveal key={fact.label} delay={(i % 4) * 60}>
                <div className="flex h-full flex-col gap-2 bg-white p-6">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                    {fact.label}
                  </dt>
                  <dd className="font-display text-lg leading-snug text-navy-900">
                    {fact.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal className="mt-8">
            <div className="flex items-start gap-4 border border-sand-300 bg-ivory-100 p-6">
              <LifeBuoy
                className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-ink-700">
                {site.marina.townNote} Dockage rates depend on vessel size,
                length of stay and season — the dock office will confirm current
                rates when responding to your request.
              </p>
            </div>
          </Reveal>

          {/* Rates — rendered only when src/data/marinaRates.ts has entries */}
          {marinaRates.length > 0 && (
            <Reveal className="mt-12">
              <h2 className="font-display text-2xl text-navy-900">
                Marina rates
              </h2>
              <div className="mt-6 overflow-x-auto border border-sand-300 bg-white">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-sand-200 bg-ivory-100">
                      <th
                        scope="col"
                        className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-900"
                      >
                        Service
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-900"
                      >
                        Rate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-900"
                      >
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200">
                    {marinaRates.map((row) => (
                      <tr key={row.label}>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-navy-900"
                        >
                          {row.label}
                        </th>
                        <td className="px-6 py-4 text-ink-700">{row.rate}</td>
                        <td className="px-6 py-4 text-ink-400">
                          {row.note ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* Facilities */}
      <section
        aria-labelledby="facilities-heading"
        className="border-y border-sand-200 bg-ivory-100 py-20 lg:py-24"
      >
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-5">
            <div>
              <SectionHeading
                overline="Marina Facilities"
                title="Everything you need at the water's edge"
                lede="The marina sits in the heart of George Town on Elizabeth Harbour, with published dockage and shore services close to the town amenities you need during your stay."
              />
              <h2 id="facilities-heading" className="sr-only">
                Marina facilities
              </h2>
            </div>
            <div className="grid gap-px border border-sand-300 bg-sand-300 sm:grid-cols-2 lg:col-span-4">
              {[
                {
                  title: "Dockage & vessel accommodation",
                  text: "Dockage on Elizabeth Harbour for vessels up to 120 ft LOA, with approximately 4,000 linear feet of published dockage and breakwater protection.",
                  icon: LifeBuoy,
                },
                {
                  title: "Shore services",
                  text: "Power and fresh water are available as published shore services. Specific arrangements are confirmed directly by the dock office.",
                  icon: Radio,
                },
                {
                  title: "Fuel pier",
                  text: "Gas and diesel are available at the fuel pier. Contact the dock office for current availability before you arrive.",
                  icon: Phone,
                },
                {
                  title: "George Town access",
                  text: "The marina is on Queen's Highway in George Town, with grocery and liquor stores directly across the street according to the published site information.",
                  icon: MapPin,
                },
              ].map((facility, index) => {
                const Icon = facility.icon;
                return (
                  <Reveal key={facility.title} delay={index * 60}>
                    <article className="h-full bg-white p-7 lg:p-8">
                      <Icon
                        className="h-5 w-5 text-gold-600"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                      <h3 className="mt-6 font-display text-xl text-navy-900">
                        {facility.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-500">
                        {facility.text}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Native amenities */}
      <section aria-labelledby="amenities-heading" className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            overline="Marina Amenities"
            title="A quick reference for your stay"
            lede="Published amenity information for the marina and its surrounding George Town setting. Availability and access may vary, so contact the dock office with specific questions."
          />
          <h2 id="amenities-heading" className="sr-only">
            Marina amenities
          </h2>
          <dl className="mt-12 grid gap-px overflow-hidden border border-sand-300 bg-sand-300 sm:grid-cols-2">
            {marinaAmenities.map(([label, status], index) => (
              <Reveal key={label} delay={(index % 2) * 50}>
                <div className="flex min-h-16 items-center justify-between gap-5 bg-white px-5 py-4 sm:px-6">
                  <dt className="text-sm font-medium text-navy-900">{label}</dt>
                  <dd className="flex shrink-0 items-center gap-2 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-600">
                    <Check
                      className="h-4 w-4"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {status}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Photography */}
      <section
        aria-labelledby="marina-gallery-heading"
        className="border-y border-sand-200 bg-ivory-100 py-20 lg:py-24"
      >
        <Container>
          <SectionHeading
            overline="Marina Photography"
            title="Elizabeth Harbour from the dock"
            lede="Explore the harbour setting and the waters around Exuma Yacht Club through the marina's approved photography."
          />
          <h2 id="marina-gallery-heading" className="sr-only">
            Marina photography
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "/images/marina-1.jpg",
                "Yachts moored along the Exuma Yacht Club docks",
              ],
              [
                "/images/marina-2.jpg",
                "Marina waters and vessels at Exuma Yacht Club",
              ],
              [
                "/images/hero-marina-aerial.jpg",
                "Aerial view of Elizabeth Harbour and the Exuma Yacht Club docks",
              ],
            ].map(([src, alt], index) => (
              <Reveal key={src} delay={index * 70}>
                <div className="img-zoom relative aspect-[4/3] overflow-hidden border border-sand-300">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Booking */}
      <section
        aria-labelledby="arrival-heading"
        className="bg-navy-900 py-20 lg:py-24"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="overline-label !text-gold-400">Plan Your Arrival</p>
            <h2
              id="arrival-heading"
              className="mt-4 font-display text-3xl text-ivory-50 sm:text-4xl"
            >
              Plan Your Arrival
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ivory-100/70">
              Check marina booking options through Dockwa, or contact our dock
              office directly if you need assistance with your visit.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ConfiguredBookingLink
                url={settings.dockwaUrl}
                label="Book Now"
                fallbackHref="/contact"
                id="marina-footer-booking"
              />
              <a
                href={site.phone.href}
                className="inline-flex items-center gap-2 border border-ivory-50/60 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 hover:bg-ivory-50 hover:text-navy-900"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Contact the Dock Office
              </a>
            </div>
            <p className="mt-6 text-sm text-ivory-100/60">{site.vhf}</p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-ivory-100/15 pt-8 text-sm">
            <Link
              href="/stay"
              className="text-ivory-100/75 underline decoration-gold-400 underline-offset-4 hover:text-gold-400"
            >
              Accommodation
            </Link>
            <Link
              href="/dining"
              className="text-ivory-100/75 underline decoration-gold-400 underline-offset-4 hover:text-gold-400"
            >
              Restaurant & Dining
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
