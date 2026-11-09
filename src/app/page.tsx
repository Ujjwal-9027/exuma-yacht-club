import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Radio, ShoppingBag } from "lucide-react";
import { site } from "@/lib/site";
import { getActiveProducts } from "@/lib/products";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { AnchorMark } from "@/components/logo";
import { getHomepageMerchandise } from "@/lib/product-utils";
import { HomepageMerchandiseShowcase } from "@/components/homepage-merchandise-showcase";
import { DifferenceCardGrid } from "@/components/difference-card-grid";
import { EditorialGallery } from "@/components/editorial-gallery";
import { getPublicAssetPath } from "@/lib/public-assets";

export const dynamic = "force-dynamic";

const differenceCards = [
  {
    icon: "waves",
    title: "Stay on the Water",
    highlight: "Waterfront rooms at EYC",
    description:
      "Settle into a relaxed island base on the edge of Elizabeth Harbour.",
    detail:
      "Enjoy comfortable accommodation, a waterfront setting and the easy rhythm of life by the harbour.",
  },
  {
    icon: "location",
    title: "The Heart of George Town",
    highlight: "Everything close by",
    description:
      "Stay in the centre of island life, with town essentials just across the street.",
    detail:
      "EYC is located in the heart of George Town, putting shops, local flavours and harbour life within easy reach.",
  },
  {
    icon: "ship",
    title: "Stocking Island Beaches",
    highlight: "A five-minute boat taxi",
    description:
      "Go from the EYC dock to turquoise water, soft sand and island time.",
    detail:
      "Enjoy direct access to Stocking Island beaches from the EYC dock by boat taxi, around five minutes away.",
  },
  {
    icon: "dining",
    title: "An Easy Island Base",
    highlight: "Stay, explore, unwind",
    description:
      "Make the most of Great Exuma with a comfortable base between beach days and town adventures.",
    detail:
      "Return to the waterfront to slow down, recharge and plan your next Exuma experience.",
  },
] as const;

const exploreCards = [
  {
    overline: "Your Base in Exuma",
    title: "Stay at EYC",
    text: "Wake up beside Elizabeth Harbour and make Exuma Yacht Club your comfortable home base in George Town.",
    image: getPublicAssetPath("/images/stay-room.jpg"),
    imageAlt: "Boutique hotel room with sea view at Exuma Yacht Club",
    href: "/stay",
    cta: "Explore Your Stay",
  },
  {
    overline: "The Location",
    title: "George Town at Your Door",
    text: "Stay in the heart of George Town, with the harbour, shops and local island life all within easy reach.",
    image: getPublicAssetPath("/images/Marina/marina-docks.jpg"),
    imageAlt: "Sailboats and yachts moored along the docks at Exuma Yacht Club",
    href: "/stay",
    cta: "Discover the Location",
  },
  {
    overline: "The Island Beyond",
    title: "Stocking Island Beaches",
    text: "Take a five-minute boat taxi from the EYC dock and spend the day on Stocking Island's famous beaches.",
    image: getPublicAssetPath("/images/destination-hero.jpg"),
    imageAlt: "Turquoise water and a sandy beach in the Exuma islands",
    href: "/attractions",
    cta: "Explore Exuma",
  },
];

export default async function HomePage() {
  const products = await getActiveProducts();
  const merchandise = getHomepageMerchandise(products);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex h-[100vh] items-center overflow-hidden bg-navy-950">
        <Image
          src={getPublicAssetPath("/images/hero.jpg")}
          alt="Aerial view of yachts and sailboats moored on turquoise water at Exuma Yacht Club"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/test/hero.jpg"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/videos/EYC-Hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/5" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-navy-950/35 to-transparent"
          aria-hidden="true"
        />
        <Container className="relative w-full py-24 sm:py-32">
          <Reveal className="max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            <p className="overline-label !text-gold-400">
              GEORGE TOWN · GREAT EXUMA · THE BAHAMAS
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-2xl leading-[1.04] font-medium text-ivory-50 sm:text-4xl lg:text-6xl">
              Exuma Yacht Club — More Than Just a Marina.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory-100/90 sm:text-lg">
              Stay in the heart of George Town, with the waterfront at your
              door and Stocking Island beaches just a five-minute boat taxi
              away.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/stay" variant="gold">
                Plan Your Stay
              </ButtonLink>
              <ButtonLink href="/attractions" variant="outlineLight">
                Explore Exuma
              </ButtonLink>
            </div>
            <div className="mt-12 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory-100/75">
              <AnchorMark className="h-4 w-4 text-gold-400" />
              <span>ELIZABETH HARBOUR · EXUMA, BAHAMAS</span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── The EYC Difference ──────────────────────────────── */}
      <section
        aria-labelledby="difference-heading"
        className="border-y border-sand-200 bg-ivory-100 py-20 lg:py-24"
      >
        <Container>
          <div className="max-w-4xl">
            <p className="overline-label">The EYC Difference</p>
            <h2
              id="difference-heading"
              className="mt-3 font-display text-3xl leading-tight text-navy-900 sm:text-4xl lg:text-5xl"
            >
              A Waterfront Stay in the Heart of Exuma
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">
              Make EYC your home base for Great Exuma — close to town, steps
              from the harbour and perfectly placed for a day on Stocking
              Island.
            </p>
          </div>
          <DifferenceCardGrid cards={differenceCards} />
        </Container>
      </section>

      {/* ── Your Stay at EYC ────────────────────────────────── */}
      <section aria-labelledby="explore-heading" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              overline="Your Stay at EYC"
              title="A Better Base for Your Exuma Escape"
              lede="Stay waterfront in the heart of George Town, then step out into the harbour, the town and the beaches of Stocking Island."
            />
            <Reveal delay={120}>
              <ButtonLink
                href="/stay"
                variant="outline"
                className="shrink-0"
              >
                Book Your Stay
              </ButtonLink>
            </Reveal>
          </div>

          <h2 id="explore-heading" className="sr-only">
            Explore Exuma Yacht Club
          </h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exploreCards.map((card, i) => (
              <Reveal key={card.title} delay={(i % 3) * 80}>
                <article className="flex h-full flex-col border border-sand-300 bg-white transition-[box-shadow,border-color] duration-300 hover:border-gold-500 hover:shadow-lg">
                  <Link href={card.href} className="group block">
                    <div className="relative aspect-[4/3] border-b border-sand-200">
                      <Image
                        src={card.image}
                        alt={card.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-none"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                        {card.overline}
                      </p>
                      <h3 className="mt-2 font-display text-xl text-navy-900">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">
                        {card.text}
                      </p>
                    </div>
                  </Link>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 px-6 pb-6">
                    <Link
                      href={card.href}
                      className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900 transition-colors hover:text-gold-600"
                    >
                      {card.cta}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── The EYC Collection ──────────────────────────────── */}
      <section
        aria-labelledby="collection-heading"
        className="border-y border-navy-800 bg-navy-950 py-20 lg:py-28"
      >
        <Container>
          <div className="max-w-3xl">
            <p className="overline-label !text-gold-400">The EYC Collection</p>
            <h2
              id="collection-heading"
              className="mt-3 font-display text-3xl leading-tight text-ivory-50 sm:text-4xl lg:text-5xl"
            >
              A Little Piece of Exuma to Take With You
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory-100/70 sm:text-lg">
              Explore Exuma Yacht Club merchandise and island-inspired
              essentials, available through our online shop.
            </p>
          </div>
          <div className="mt-11">
            <div className="min-w-0">
              {merchandise.featured ? (
                <>
                  <HomepageMerchandiseShowcase
                    featured={merchandise.featured}
                    featuredReason={merchandise.featuredReason!}
                    supporting={merchandise.supporting}
                  />
                  <Reveal delay={160} className="mt-10 flex justify-center">
                    <ButtonLink href="/shop" variant="gold">
                      <ShoppingBag
                        className="h-4 w-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      Shop the Collection
                    </ButtonLink>
                  </Reveal>
                </>
              ) : (
                <div className="flex h-full flex-col justify-center border border-white/15 bg-white/5 p-8">
                  <p className="text-sm leading-relaxed text-ivory-100/70">
                    The collection is being prepared for the online shop. Visit
                    the store for current merchandise and availability.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Gallery strip ────────────────────────────────────── */}
      <section aria-labelledby="gallery-heading" className="py-20 lg:py-24">
        <Container>
          <h2 id="gallery-heading" className="sr-only">
            Gallery
          </h2>
          <EditorialGallery />
        </Container>
      </section>

      {/* ── Location & contact ───────────────────────────────── */}
      <section
        aria-labelledby="location-heading"
        className="border-t border-sand-200 bg-ivory-100 py-20 lg:py-28"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                overline="Location & Contact"
                title="Find us on Queen's Highway"
                lede="On the waterfront in George Town, Great Exuma — across from the grocery and liquor stores, minutes from the airport by taxi."
              />
              <h2 id="location-heading" className="sr-only">
                Location & Contact
              </h2>
              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: MapPin,
                    label: "Address",
                    value: `${site.address.street}, ${site.address.locality}, ${site.address.country}`,
                    href: null,
                  },
                  {
                    icon: Phone,
                    label: "Dock Office",
                    value: site.phone.label,
                    href: site.phone.href,
                  },
                  {
                    icon: Phone,
                    label: "WhatsApp",
                    value: site.whatsapp.label,
                    href: site.whatsapp.href,
                  },
                  {
                    icon: Radio,
                    label: "Channel",
                    value: site.vhf,
                    href: null,
                  },
                ].map((item) => (
                  <Reveal key={item.label}>
                    <div className="lift-card flex h-full items-start gap-4 rounded-xl border border-sand-300 bg-white p-5">
                      <item.icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="mt-1 block text-[15px] font-medium leading-snug text-navy-900 hover:text-gold-600"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-[15px] font-medium leading-snug text-navy-900">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={140} className="mt-8">
                <ButtonLink href="/contact" variant="primary">
                  Contact the Team
                </ButtonLink>
              </Reveal>
            </div>
            <Reveal delay={100}>
              <div className="h-full min-h-[380px] overflow-hidden border border-sand-300 bg-white">
                <iframe
                  title="Map showing Exuma Yacht Club on Queen's Highway, George Town, Great Exuma"
                  src={site.mapsEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[380px] w-full border-0"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Closing band ─────────────────────────────────────── */}
      <section
        aria-label="Google reviews"
        className="bg-navy-900 py-16 lg:py-20"
      >
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <AnchorMark className="h-9 w-9 text-gold-400" />
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-400">
              Google Reviews
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl leading-[1.15] font-medium text-ivory-50 sm:text-4xl">
              Hear from guests who have visited Exuma Yacht Club.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory-100/70">
              Read the latest guest feedback, ratings and visit details on our
              Google Maps listing.
            </p>
            <div className="mt-9 flex justify-center">
              <ButtonLink
                href={site.googleMapsReviewsUrl}
                variant="gold"
                external
              >
                Read reviews on Google Maps
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
