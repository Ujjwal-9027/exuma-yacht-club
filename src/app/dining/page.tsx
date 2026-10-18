import type { Metadata } from "next";
import Image from "next/image";
import {
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  UtensilsCrossed,
} from "lucide-react";
import { site } from "@/lib/site";
import { menuCategories, menuIsPlaceholder } from "@/data/menu";
import { restaurantInfo } from "@/data/restaurant";
import { config, isPlaceholder, waLink } from "@/config/site";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Restaurant & Dining",
  description:
    "The waterfront restaurant & bar at Exuma Yacht Club in George Town — Caribbean cuisine with an international twist, overlooking Elizabeth Harbour.",
  alternates: { canonical: "/dining" },
  openGraph: {
    title: "Restaurant & Dining · Exuma Yacht Club",
    description:
      "Caribbean cuisine with an international twist, served overlooking the harbour in George Town, Exuma.",
    images: ["/images/dining.jpg"],
  },
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: site.restaurant.name,
  telephone: "+1-242-336-2579",
  servesCuisine: ["Caribbean", "International"],
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

export default function DiningPage() {
  const whatsappHref = waLink(
    "Hello Exuma Yacht Club — I'd like to ask about a restaurant reservation.",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      <PageHero
        overline="Restaurant & Dining"
        title="Waterfront dining, island flavour"
        lede="Caribbean cuisine with an international twist, served overlooking the marina — with an open-air bar made for harbour evenings."
        image="/images/dining.jpg"
        imageAlt="The open-air restaurant and bar at Exuma Yacht Club overlooking the marina at sunset"
      />

      {/* About + hours/location */}
      <section aria-labelledby="about-dining" className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeading
                overline="The Table"
                title="The Restaurant & Bar at the club"
                lede="Watch the boats come and go over lunch, settle in at the bar for the evening, or linger over dinner as the harbour lights come on. The kitchen leans on Bahamian flavour with an international touch."
              />
              <h2 id="about-dining" className="sr-only">
                About the restaurant
              </h2>
              <Reveal delay={120} className="mt-10">
                <div className="img-zoom relative aspect-[16/9]">
                  <Image
                    src="/images/dining.jpg"
                    alt="Tables set on the restaurant deck overlooking the marina"
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={100}>
                <div className="border border-sand-300 bg-white p-7">
                  <div className="flex items-center gap-3">
                    <Clock
                      className="h-5 w-5 text-gold-600"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-xl text-navy-900">
                      Hours
                    </h3>
                  </div>
                  <dl className="mt-4 space-y-2.5">
                    {restaurantInfo.hoursLines.map((line) => (
                      <div
                        key={line.days}
                        className="flex items-baseline justify-between gap-4 text-sm"
                      >
                        <dt className="font-medium text-navy-900">
                          {line.days}
                        </dt>
                        <dd className="text-right text-ink-500">
                          {line.hours}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-xs leading-relaxed text-ink-400">
                    {restaurantInfo.hoursDisclaimer}
                  </p>
                  <div className="mt-5 flex items-start gap-2.5 border-t border-sand-200 pt-5 text-sm text-ink-500">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                      aria-hidden="true"
                    />
                    <p>{restaurantInfo.locationNote}</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={160}>
                <div className="mt-6 border border-sand-300 bg-white p-7">
                  <div className="flex items-center gap-3">
                    <Phone
                      className="h-5 w-5 text-gold-600"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-xl text-navy-900">
                      Reservations & questions
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-500">
                    For reservations, private gatherings or menu questions,
                    contact the restaurant directly:
                  </p>
                  <a
                    href={site.restaurantPhone.href}
                    className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-navy-900 underline decoration-gold-500 underline-offset-6 hover:text-gold-600"
                  >
                    <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
                    {site.restaurantPhone.label}
                  </a>
                  {!isPlaceholder(config.whatsappNumber) ? (
                    <div className="mt-4">
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-navy-900 bg-navy-900 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900"
                      >
                        <MessageCircle
                          className="h-4 w-4"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        WhatsApp the Restaurant
                      </a>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-ink-400">
                      WhatsApp ordering opens soon — please use the form below.
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Menu — data file driven */}
      <section
        aria-labelledby="menu-heading"
        className="border-t border-sand-200 py-20 lg:py-24"
      >
        <Container>
          <SectionHeading
            overline="The Menu"
            title="From the kitchen"
            lede="Menus change with the season and the catch — current menus are always available at the restaurant."
          />
          <h2 id="menu-heading" className="sr-only">
            Menu
          </h2>
          {menuIsPlaceholder && (
            <Reveal className="mt-8">
              <p className="inline-block border border-gold-500/50 bg-ivory-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
                Sample menu layout — final menu supplied by the restaurant
                before launch
              </p>
            </Reveal>
          )}
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {menuCategories.map((category, i) => (
              <Reveal key={category.name} delay={i * 80}>
                <div className="h-full border border-sand-300 bg-white p-7">
                  <h3 className="font-display text-xl text-navy-900">
                    {category.name}
                  </h3>
                  {category.note && (
                    <p className="mt-1 text-xs text-ink-400">{category.note}</p>
                  )}
                  <ul className="mt-5 space-y-5">
                    {category.items.map((item, itemIndex) => (
                      <li key={`${category.name}-${item.name}-${itemIndex}`}>
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="text-[15px] font-medium text-navy-900">
                            {item.name}
                          </p>
                          {item.price && (
                            <p className="shrink-0 text-sm font-semibold text-navy-900">
                              {item.price}
                            </p>
                          )}
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm leading-relaxed text-ink-500">
                            {item.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Reservation inquiry */}
      <section
        aria-labelledby="dining-form-heading"
        className="border-t border-sand-200 bg-ivory-100 py-20 lg:py-24"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              overline="Reservations"
              title="Request a table by WhatsApp"
              lede={restaurantInfo.confirmationNote}
              align="center"
            />
            <h2 id="dining-form-heading" className="sr-only">
              WhatsApp restaurant reservations
            </h2>
            <Reveal delay={100} className="mt-8">
              {isPlaceholder(config.whatsappNumber) ? (
                <p className="text-sm text-ink-500">
                  Please call the restaurant directly for reservations.
                </p>
              ) : (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-navy-900 bg-navy-900 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp the Restaurant
                </a>
              )}
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
