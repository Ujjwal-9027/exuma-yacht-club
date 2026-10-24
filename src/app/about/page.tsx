import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover Exuma Yacht Club Resort and Marina on Elizabeth Harbour in George Town, Great Exuma, with dockage, accommodation, a gift shop and waterfront dining planned for December 2026.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · Exuma Yacht Club",
    description: "The club, the marina and the harbour town we call home.",
    images: ["/images/about-hero.jpg"],
  },
};

const aboutSections = [
  {
    title: "On the George Town waterfront",
    paragraphs: [
      "Located on Elizabeth Harbour in George Town, Great Exuma, Exuma Yacht Club is part of the harbour life that makes this corner of the Bahamas special. The marina offers breakwater-protected dockage for vessels up to 120 feet, with shore power, fresh water and a fuel pier.",
      "Whether you're arriving by boat or staying on shore, the club provides a convenient base for enjoying George Town and exploring the surrounding Exumas. Accommodation and a gift shop add to the experience, with a newly renovated waterfront restaurant and bar expected to open in December 2026.",
    ],
  },
  {
    title: "A refreshed place to stay and dock",
    paragraphs: [
      "The marina and hotel have both been newly renovated, bringing updated surroundings and modern comforts to a waterfront location with a long connection to George Town's cruising community.",
      "From arriving at the docks to settling into your stay, our aim is to offer a welcoming place to pause, recharge and enjoy the harbour at your own pace.",
    ],
  },
  {
    title: "Part of the cruising community",
    paragraphs: [
      "Elizabeth Harbour is a familiar destination for cruising sailors exploring the Exuma island chain. George Town offers access to local provisioning, fuel and the everyday activity of a busy island harbour.",
      "At Exuma Yacht Club, you're close to the waterfront and well placed to experience the character of Great Exuma, whether you're stopping in for a marina visit or staying a little longer.",
    ],
  },
  {
    title: "A warm welcome on the water",
    paragraphs: [
      "Every visit to the Exumas has its own pace. You might be arriving after a day under sail, spending time exploring Great Exuma or simply enjoying the view across Elizabeth Harbour.",
      "Exuma Yacht Club Resort and Marina offers a welcoming waterfront base from which to make the most of your time in George Town.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        overline="About the Club"
        title="A club shaped by the harbour"
        lede="Set along the waterfront in George Town, Exuma Yacht Club Resort and Marina brings together a working marina, comfortable accommodation, a gift shop, and a waterfront restaurant and bar planned to open in December 2026. It's a place to arrive by water, settle in and experience life on Elizabeth Harbour."
        image="/images/about-hero.jpg"
        imageAlt="Covered waterfront terrace at Exuma Yacht Club overlooking Elizabeth Harbour at sunset"
      />

      <section aria-label="About Exuma Yacht Club" className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="space-y-10">
                {aboutSections.map((section, i) => (
                  <Reveal key={section.title} delay={i * 60}>
                    <article>
                      <h2 className="font-display text-2xl text-navy-900">
                        {section.title}
                      </h2>
                      <span
                        className="gold-rule mt-3 block"
                        aria-hidden="true"
                      />
                      <div className="mt-4 max-w-xl space-y-4 text-[15px] leading-relaxed text-ink-700">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={100}>
                <div className="hero-image-3d relative aspect-[4/5] overflow-hidden rounded border border-sand-200 bg-white">
                  <Image
                    src="/images/marina-1.jpg"
                    alt="Sunset over Elizabeth Harbour with sailboats and docks at Exuma Yacht Club"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-400">
                  <span className="font-semibold text-navy-900">
                    Elizabeth Harbour · George Town · Great Exuma · The Bahamas
                  </span>
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal className="mt-16 flex flex-col items-start gap-6 border border-sand-300 bg-ivory-100 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <h2 className="font-display text-2xl text-navy-900">
                Come and see the club from the water.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                Discover the marina, find a place to stay or get in touch with
                our team to plan your visit.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/marina" variant="primary">
                Explore the Marina
              </ButtonLink>
              <ButtonLink href="/stay" variant="outline">
                Plan Your Stay
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Contact Us
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
