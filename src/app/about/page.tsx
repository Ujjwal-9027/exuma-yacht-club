import type { Metadata } from "next";
import Image from "next/image";
import { aboutContent } from "@/data/pages";
import { ButtonLink, Container, PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Exuma Yacht Club & Marina — a newly renovated marina, boutique hotel, waterfront restaurant and gift shop on Elizabeth Harbour in George Town, Great Exuma.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · Exuma Yacht Club",
    description: "The club, the marina and the harbour town we call home.",
    images: ["/images/marina-docks.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        overline="About the Club"
        title="A club shaped by the harbour"
        lede={aboutContent.heroLede}
        image="/images/marina-docks.jpg"
        imageAlt="Boats moored along the docks at Exuma Yacht Club in golden light"
      />

      <section aria-label="About Exuma Yacht Club" className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="space-y-10">
                {aboutContent.sections.map((section, i) => (
                  <Reveal key={section.title} delay={i * 60}>
                    <article>
                      <h2 className="font-display text-2xl text-navy-900">
                        {section.title}
                      </h2>
                      <span className="gold-rule mt-3 block" aria-hidden="true" />
                      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-700">
                        {section.body}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={100}>
                <div className="img-zoom relative aspect-[4/5] border border-sand-200">
                  <Image
                    src="/images/hero-marina-aerial.jpg"
                    alt="Aerial view of Elizabeth Harbour and the Exuma Yacht Club marina"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-400">
                  Elizabeth Harbour · George Town · Great Exuma
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal className="mt-16 flex flex-col items-start gap-6 border border-sand-300 bg-ivory-100 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <h2 className="max-w-md font-display text-2xl text-navy-900">
              Come and see the club from the water.
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/marina" variant="primary">
                Explore the Marina
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
