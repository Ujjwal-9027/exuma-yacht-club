import type { Metadata } from "next";
import Link from "next/link";
import { Check, LifeBuoy, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { marinaRates } from "@/data/marinaRates";
import { marinaAmenities } from "@/data/marinaAmenities";
import { Container, SectionHeading } from "@/components/ui";
import { MarinaHero } from "@/components/marina-hero";
import { MarinaSlideshow } from "@/components/marina-slideshow";
import { Reveal } from "@/components/reveal";
import { DifferenceCardGrid } from "@/components/difference-card-grid";
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
    images: ["/images/Marina/marina-docks.jpg"],
  },
};

const facts = [
  {
    icon: "anchor",
    title: "Max vessel length",
    highlight: "Up to 120 ft LOA",
    description: "Vessels up to 120 ft LOA.",
    detail: "Contact the dock office for vessel-specific arrival arrangements.",
  },
  {
    icon: "ship",
    title: "Depth alongside",
    highlight: "Approx. 7 ft at high water",
    description: "Approx. 7 ft at high water.",
    detail:
      "Confirm conditions for your vessel with the dock office before arrival.",
  },
  {
    icon: "compass",
    title: "Dockage",
    highlight: "± 4,000 linear feet",
    description: "Approximately 4,000 linear feet of dockage.",
    detail: "Dockage depends on vessel size, length of stay and season.",
  },
  {
    icon: "waves",
    title: "Protection",
    highlight: "Breakwater-sheltered harbour",
    description: "Breakwater-sheltered harbour.",
    detail:
      "Contact the dock office for current harbour and arrival conditions.",
  },
  {
    icon: "anchor",
    title: "Shore services",
    highlight: "Power & fresh water",
    description: "Power and fresh water.",
    detail: "Availability and arrangements are confirmed by the dock office.",
  },
  {
    icon: "ship",
    title: "Fuel pier",
    highlight: "Gas & diesel",
    description: "Gas and diesel.",
    detail: "Contact the dock office to confirm current fuel availability.",
  },
  {
    icon: "compass",
    title: "Dock office",
    highlight: "VHF Channel 16",
    description: "VHF Channel 16.",
    detail: "Hail the dock office on VHF Channel 16 as you approach.",
  },
  {
    icon: "waves",
    title: "Position",
    highlight: site.coordinates.display,
    description: site.coordinates.display,
    detail: "The marina is on the George Town waterfront in Elizabeth Harbour.",
  },
] as const;

const facilityCards = [
  {
    icon: "anchor",
    title: "Dockage & vessel accommodation",
    highlight: "Dockage on Elizabeth Harbour",
    description:
      "Dockage on Elizabeth Harbour for vessels up to 120 ft LOA, with approximately 4,000 linear feet of published dockage and breakwater protection.",
    detail:
      "Vessel accommodation and dockage are confirmed by the marina team according to current availability.",
  },
  {
    icon: "ship",
    title: "Shore services",
    highlight: "Power & fresh water",
    description:
      "Power and fresh water are available as published shore services. Specific arrangements are confirmed directly by the dock office.",
    detail:
      "Contact the dock office to confirm service arrangements for your vessel.",
  },
  {
    icon: "waves",
    title: "Fuel pier",
    highlight: "Gas & diesel",
    description:
      "Gas and diesel are available at the fuel pier. Contact the dock office for current availability before you arrive.",
    detail:
      "Fuel availability should be confirmed with the dock office before arrival.",
  },
  {
    icon: "compass",
    title: "George Town access",
    highlight: "Queen's Highway waterfront",
    description:
      "The marina is on Queen's Highway in George Town, with grocery and liquor stores directly across the street according to the published site information.",
    detail:
      "The waterfront location keeps town amenities close during your stay.",
  },
] as const;

const amenityGroups = [
  { title: "On the water", items: marinaAmenities.slice(0, 5) },
  { title: "Ashore", items: marinaAmenities.slice(5, 13) },
  { title: "Island life", items: marinaAmenities.slice(13) },
] as const;

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
          <DifferenceCardGrid cards={facts} layout="grid" />

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
          <div>
            <SectionHeading
              overline="Marina Facilities"
              title="Everything you need at the water's edge"
              lede="The marina sits in the heart of George Town on Elizabeth Harbour, with published dockage and shore services close to the town amenities you need during your stay."
            />
            <h2 id="facilities-heading" className="sr-only">
              Marina facilities
            </h2>
            <DifferenceCardGrid cards={facilityCards} layout="grid" />
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
          <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-8">
            {amenityGroups.map((group, groupIndex) => (
              <Reveal key={group.title} delay={groupIndex * 80}>
                <div className="border-t-2 border-navy-900">
                  <div className="flex items-end justify-between gap-4 py-5">
                    <h3 className="font-display text-2xl text-navy-900">
                      {group.title}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                      {String(groupIndex + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <dl className="space-y-3">
                    {group.items.map(([label, status]) => (
                      <div
                        key={label}
                        className="amenity-tile flex min-h-[76px] items-center gap-3 rounded-lg border border-sand-300 bg-white px-3 py-3 text-sm text-navy-900 sm:px-4"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-gold-500/40 bg-ivory-100 text-gold-600">
                          <Check
                            className="h-4 w-4"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </span>
                        <dt className="min-w-0 flex-1 font-semibold text-navy-900">
                          {label}
                        </dt>
                        <dd className="flex shrink-0 items-center gap-1.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-600">
                          {status}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
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
          <div className="mt-12">
            <MarinaSlideshow />
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
