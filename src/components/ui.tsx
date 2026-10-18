import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  overline,
  title,
  lede,
  align = "left",
  dark = false,
}: {
  overline: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  const alignCls =
    align === "center" ? "items-center text-center" : "items-start";
  return (
    <Reveal className={`flex flex-col gap-4 ${alignCls}`}>
      <p className="overline-label">{overline}</p>
      <h2
        className={`max-w-2xl font-display text-3xl leading-[1.12] font-medium sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-ivory-50" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      <span className="gold-rule" aria-hidden="true" />
      {lede && (
        <p
          className={`max-w-xl text-[15px] leading-relaxed sm:text-base ${
            dark ? "text-ivory-100/70" : "text-ink-500"
          }`}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}

type ButtonVariant = "primary" | "outline" | "outlineLight" | "gold";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-navy-900 bg-navy-900 text-ivory-50 hover:bg-transparent hover:text-navy-900",
  outline:
    "border border-navy-900/35 bg-transparent text-navy-900 hover:bg-navy-900 hover:text-ivory-50",
  outlineLight:
    "border border-ivory-50/60 bg-transparent text-ivory-50 hover:bg-ivory-50 hover:text-navy-900",
  gold: "border border-gold-500 bg-gold-500 text-navy-950 hover:bg-gold-400 hover:border-gold-400",
};

const baseButton =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
}) {
  const cls = `${baseButton} ${buttonStyles[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function PageHero({
  overline,
  title,
  lede,
  image,
  imageAlt,
}: {
  overline: string;
  title: string;
  lede?: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-navy-950 sm:min-h-[54vh]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-navy-950/15"
        aria-hidden="true"
      />
      <Container className="relative w-full pb-14 pt-32 sm:pb-20">
        <p className="overline-label !text-gold-400">{overline}</p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl leading-[1.08] font-medium text-ivory-50 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lede && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory-100/80 sm:text-lg">
            {lede}
          </p>
        )}
      </Container>
    </section>
  );
}
