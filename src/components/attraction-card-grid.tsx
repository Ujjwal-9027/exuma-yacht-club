"use client";

import {
  Anchor,
  Compass,
  Ship,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { Attraction } from "@/data/pages";
import { Reveal } from "@/components/reveal";

const icons: LucideIcon[] = [
  Waves,
  Anchor,
  UtensilsCrossed,
  Waves,
  Compass,
  Waves,
  Ship,
];

export function AttractionCardGrid({
  attractions,
}: {
  attractions: readonly Attraction[];
}) {
  return (
    <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {attractions.map((attraction, index) => {
        const Icon = icons[index % icons.length];
        const detailId = `attraction-detail-${index}`;
        const titleId = `attraction-title-${index}`;

        return (
          <Reveal key={attraction.name} delay={(index % 3) * 70}>
            <article
              tabIndex={0}
              aria-labelledby={titleId}
              className="attraction-card flex flex-col rounded-lg border border-sand-300 bg-white p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-md border border-gold-500/50 bg-ivory-100 text-gold-600">
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(attractions.length).padStart(2, "0")}
                </span>
              </div>
              <h3
                id={titleId}
                className="mt-5 font-display text-xl leading-snug text-navy-900"
              >
                {attraction.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                {attraction.description}
              </p>

              <div
                id={detailId}
                className="attraction-card-detail grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out motion-reduce:transition-none"
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-3 border-t border-sand-200 pt-4 text-sm leading-relaxed text-ink-700">
                    <p>{attraction.detail}</p>
                    {attraction.note && (
                      <p className="text-xs font-medium text-ink-500">
                        {attraction.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
