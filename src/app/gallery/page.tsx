import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Marina life, island views, waterfront dining and quiet rooms, gathered in the rhythm of a day on the harbour.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery · Exuma Yacht Club",
    description:
      "Marina life, island views, waterfront dining and quiet rooms on Elizabeth Harbour.",
    images: ["/images/EYC%20About/EYC_main8.jpg"],
  },
};

const gallery = [
  {
    src: "/images/EYC%20About/EYC_main2.jpg",
    alt: "Sunlit wooden deck and palms overlooking the yacht club docks and harbour.",
    caption: "A deck above the harbour",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/EYC%20About/EYC_main3.jpg",
    alt: "Exuma Yacht Club lettering and colorful Bahamian crafts on a blue wall.",
    caption: "A little colour from the islands",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/EYC%20About/EYC_main4.jpg",
    alt: "A rope swing beneath a palm tree above a sandy beach and clear water.",
    caption: "A pause beneath the palms",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/EYC%20About/EYC_main5.jpg",
    alt: "White stairs and veranda beside a hand-painted Exuma Yacht Club sign.",
    caption: "The club, up close",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/EYC%20About/EYC_main6.jpg",
    alt: "A covered waterfront veranda framed by palms with a view over the water.",
    caption: "Room to slow down",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/EYC%20About/EYC_main7.jpg",
    alt: "Waterfront verandas framed by palms, with boats moored along the harbour at sunset.",
    caption: "Harbour light from the veranda",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/EYC%20About/EYC_main8.jpg",
    alt: "Sailboats and yachts moored along Elizabeth Harbour at sunset.",
    caption: "The marina at golden hour",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/EYC%20About/EYC_main10.jpg",
    alt: "A wooden dock extending into turquoise water toward anchored sailboats.",
    caption: "Out across the water",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/EYC%20About/EYC_main11.jpg",
    alt: "Exuma Yacht Club's white waterfront building among palms.",
    caption: "Evenings at the club",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/EYC%20About/EYC_main12.jpg",
    alt: "A quiet veranda at the club overlooking Elizabeth Harbour.",
    caption: "A quieter side of the harbour",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/Marina/marina1.jpg",
    alt: "The Exuma Yacht Club waterfront building beside clear turquoise water.",
    caption: "The club on the water",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/Marina/marina2-web.jpg",
    alt: "A wooden pier leading toward sailboats moored in bright turquoise water.",
    caption: "Out along the pier",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/Marina/marina3.jpg",
    alt: "A long view across the yacht club waterfront and marina docks.",
    caption: "Along the waterfront",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/Marina/marina4.jpeg",
    alt: "A catamaran moored beside the marina dock.",
    caption: "Alongside at the dock",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/Marina/marina5.jpeg",
    alt: "A rainbow appearing over the marina dock and waterfront.",
    caption: "A rainbow over the marina",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/destinations/Swimming Pigs at Big Major Cay.jpg",
    alt: "Several swimming pigs wading in clear shallow water beside a white sand beach.",
    caption: "A swim with the pigs",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/destinations/stocking-island.jpg",
    alt: "A broad white sand beach with turquoise water and a green island shoreline.",
    caption: "Stocking Island's quiet shore",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/destinations/chaat-n-chill.jpg",
    alt: "The rustic open-air Chat 'N' Chill restaurant among palms on Stocking Island.",
    caption: "A table at Chat 'N' Chill",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/destinations/Thunderball Grotto.jpg",
    alt: "Visitors swimming inside a cavernous sea grotto in clear turquoise water.",
    caption: "Inside Thunderball Grotto",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/destinations/Exuma Cays Land and Sea Park.jpg",
    alt: "A large bleached skeleton displayed on a sandy beach near island vegetation.",
    caption: "Along the park's wild shoreline",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/destinations/Tropic of Cancer Beach.jpg",
    alt: "White sand curving beside brilliant turquoise water at Tropic of Cancer Beach.",
    caption: "Tropic of Cancer Beach",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/destinations/George Town Harbour Life.jpg",
    alt: "Colorful waterfront buildings lining the harbor in George Town.",
    caption: "A colourful harbour town",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/dining.jpg",
    alt: "A plated dinner and wine glasses at a candlelit restaurant table.",
    caption: "An evening at the table",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/stay-room.jpg",
    alt: "A bright guest room with a white bed, wood ceiling and sitting area.",
    caption: "A calm place to land",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/Marina/marina-docks.jpg",
    alt: "Boats moored along the marina docks beside colorful waterfront buildings.",
    caption: "Life along the docks",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        overline="Gallery"
        title="Moments on Elizabeth Harbour"
        lede="Marina life, island views, waterfront dining and quiet rooms, gathered in the rhythm of a day on the harbour."
        image="/images/EYC%20About/EYC_main8.jpg"
        imageAlt="Sailboats and yachts moored along Elizabeth Harbour at sunset"
      />

      <section aria-label="Photo gallery" className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, i) => (
              <Reveal
                key={item.src}
                delay={(i % 3) * 70}
                className={
                  item.cls.includes("col-span")
                    ? "sm:col-span-2 lg:col-span-2"
                    : ""
                }
              >
                <figure className="group overflow-hidden border border-sand-200 bg-white">
                  <div
                    className={`img-zoom relative ${item.cls.replace("sm:col-span-2 ", "")}`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm text-ink-700">{item.caption}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                      Exuma
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 flex flex-col items-center border border-sand-300 bg-ivory-100 px-6 py-14 text-center">
            <h2 className="font-display text-2xl text-navy-900 sm:text-3xl">
              The best views are the ones you sail in on.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
              Plan your visit and see Elizabeth Harbour from your own deck.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/marina#request-dockage" variant="primary">
                Request Dockage
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Contact the Team
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
