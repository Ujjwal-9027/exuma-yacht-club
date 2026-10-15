import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="bg-ivory-50 py-24 lg:py-36">
      <Container className="flex flex-col items-center text-center">
        <Compass className="h-10 w-10 text-gold-600" strokeWidth={1.3} aria-hidden="true" />
        <p className="overline-label mt-6">Error 404</p>
        <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.1] font-medium text-navy-900 sm:text-5xl">
          This page has drifted off the chart.
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-500">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back to safe water.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="primary">
            Back to Home
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Contact the Team
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
