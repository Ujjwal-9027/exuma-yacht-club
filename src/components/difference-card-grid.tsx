"use client";

import { Compass, Ship, Waves, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { AnchorMark } from "@/components/logo";

const icons = {
  anchor: AnchorMark,
  ship: Ship,
  compass: Compass,
  waves: Waves,
} satisfies Record<string, LucideIcon | typeof AnchorMark>;

type DifferenceCard = {
  icon: keyof typeof icons;
  title: string;
  highlight: string;
  description: string;
  detail: string;
};

export function DifferenceCardGrid({
  cards,
}: {
  cards: readonly DifferenceCard[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div
      className="mt-12 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:flex lg:h-[380px] lg:gap-3"
      onMouseLeave={() => setActiveIndex(null)}
    >
      {cards.map((card, index) => {
        const Icon = icons[card.icon];
        const isActive = activeIndex === index;

        return (
          <Reveal
            key={card.title}
            delay={index * 60}
            className={`h-full transition-[flex] duration-500 ease-out motion-reduce:transition-none lg:min-w-0 ${
              isActive ? "lg:flex-[2]" : "lg:flex-1"
            }`}
          >
            <article
              tabIndex={0}
              onMouseEnter={() => {
                if (window.matchMedia("(min-width: 1024px)").matches) {
                  setActiveIndex(index);
                }
              }}
              onFocus={() => setActiveIndex(index)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setActiveIndex(null);
                }
              }}
              className={`group flex h-[380px] flex-col overflow-hidden rounded-lg bg-white p-4 transition-[background-color,box-shadow] duration-500 hover:bg-ivory-50 focus:bg-ivory-50 focus:outline-none focus:ring-2 focus:ring-gold-500/60 motion-reduce:transition-none sm:h-[340px] sm:p-7 lg:h-full lg:p-8 ${
                isActive ? "lg:shadow-[0_16px_34px_rgba(12,39,51,0.14)]" : ""
              }`}
            >
              <span
                className={`grid h-11 w-11 place-items-center border border-gold-500/60 text-gold-600 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-navy-950 group-focus:bg-gold-500 group-focus:text-navy-950 motion-reduce:transition-none ${
                  isActive
                    ? "lg:rotate-6 lg:scale-110 lg:bg-gold-500 lg:text-navy-950"
                    : ""
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
                {card.title}
              </h3>
              <p className="mt-3 font-display text-xl leading-tight text-navy-900 sm:text-2xl">
                {card.highlight}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-500">
                {card.description}
              </p>
              <div
                aria-hidden={!isActive}
                className={`hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-out motion-reduce:transition-none lg:grid ${
                  isActive
                    ? "mt-5 grid-rows-[1fr] border-t border-sand-200 pt-4 opacity-100"
                    : "mt-0 grid-rows-[0fr] pt-0 opacity-0"
                }`}
              >
                <p className="min-h-0 overflow-hidden text-xs leading-relaxed text-ink-500">
                  {card.detail}
                </p>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
