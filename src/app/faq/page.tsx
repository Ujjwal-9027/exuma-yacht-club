import type { Metadata } from "next";
import { faqItems } from "@/data/faq";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { FaqAccordion } from "@/components/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Exuma Yacht Club — dockage, vessel sizes, fuel, rooms, dining plans, gift shop orders and getting to Exuma.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ · Exuma Yacht Club",
    description: "Answers about dockage, stays, dining, fuel and the gift shop.",
    images: ["/images/hero-marina-aerial.jpg"],
  },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        overline="Good to Know"
        title="Frequently asked questions"
        lede="The answers guests and cruisers ask us most. Can't find yours? The team is a call, WhatsApp or VHF hail away."
        image="/images/marina-docks.jpg"
        imageAlt="Golden light over the docks at Exuma Yacht Club"
      />

      <section aria-labelledby="faq-heading" className="py-20 lg:py-24">
        <Container className="max-w-4xl">
          <SectionHeading overline="Answers" title="Before you arrive" />
          <h2 id="faq-heading" className="sr-only">
            Frequently asked questions
          </h2>
          <Reveal delay={100} className="mt-12">
            <FaqAccordion items={faqItems} />
          </Reveal>
          <Reveal delay={160} className="mt-12 flex flex-col items-start gap-6 border border-sand-300 bg-ivory-100 p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-sm leading-relaxed text-ink-700">
              Still curious? Send us a message and a real person will answer.
            </p>
            <ButtonLink href="/contact" variant="primary">
              Contact the Team
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
