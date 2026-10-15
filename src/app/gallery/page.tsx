import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Views of Exuma Yacht Club & Marina — the docks, Elizabeth Harbour, the boutique hotel and the waterfront restaurant in George Town, Great Exuma.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery · Exuma Yacht Club",
    description: "Scenes from the marina, hotel and restaurant on Elizabeth Harbour.",
    images: ["/images/hero-marina-aerial.jpg"],
  },
};

/**
 * Note: current imagery is placeholder photography standing in for
 * client-supplied photos of the property. See pre-launch checklist.
 */
const gallery = [
  {
    src: "/images/hero-marina-aerial.jpg",
    alt: "Aerial view over the marina with yachts anchored on turquoise water",
    caption: "Elizabeth Harbour from above",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
  {
    src: "/images/marina-docks.jpg",
    alt: "Sailboats moored along the wooden docks in golden light",
    caption: "Alongside at golden hour",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/stay-room.jpg",
    alt: "Boutique hotel room with white linens and a harbour view",
    caption: "A room with a harbour view",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/dining.jpg",
    alt: "Restaurant deck set for the evening overlooking the marina",
    caption: "Dinner over the water",
    cls: "aspect-[4/5]",
  },
  {
    src: "/images/fuel-dock.jpg",
    alt: "A boat tied up at the club's fuel pier",
    caption: "The fuel pier",
    cls: "sm:col-span-2 aspect-[16/9]",
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        overline="Gallery"
        title="Scenes from the club"
        lede="The marina, the harbour, the rooms and the table — a look at life on the George Town waterfront."
        image="/images/marina-docks.jpg"
        imageAlt="Golden light over the docks at Exuma Yacht Club"
      />

      <section aria-label="Photo gallery" className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, i) => (
              <Reveal key={item.src} delay={(i % 3) * 70} className={item.cls.includes("col-span") ? "sm:col-span-2 lg:col-span-2" : ""}>
                <figure className="group overflow-hidden border border-sand-200 bg-white">
                  <div className={`img-zoom relative ${item.cls.replace("sm:col-span-2 ", "")}`}>
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
