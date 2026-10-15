import type { ReactNode } from "react";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export function PolicyLayout({
  overline,
  title,
  intro,
  children,
}: {
  overline: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section className="py-14 lg:py-20">
      <Container className="max-w-3xl">
        <Reveal>
          <p className="overline-label">{overline}</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] font-medium text-navy-900 sm:text-5xl">
            {title}
          </h1>
          <span className="gold-rule mt-6 block" aria-hidden="true" />
          <p className="mt-6 text-base leading-relaxed text-ink-500">{intro}</p>
        </Reveal>
        <div className="policy-body mt-12 space-y-10">{children}</div>
      </Container>
    </section>
  );
}

export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section>
        <h2 className="font-display text-2xl text-navy-900">{title}</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-700">
          {children}
        </div>
      </section>
    </Reveal>
  );
}
