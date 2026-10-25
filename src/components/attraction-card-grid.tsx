"use client";

import {
  Anchor,
  Compass,
  Ship,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useState, type MouseEvent } from "react";
import { useEffect, useRef } from "react";
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

const attractionImages: Record<string, string> = {
  "Swimming Pigs at Big Major Cay":
    "/images/destinations/Swimming Pigs at Big Major Cay.jpg",
  "Stocking Island": "/images/destinations/stocking-island.jpg",
  "Chat 'N' Chill": "/images/destinations/chaat-n-chill.jpg",
  "Thunderball Grotto": "/images/destinations/Thunderball Grotto.jpg",
  "Exuma Cays Land and Sea Park":
    "/images/destinations/Exuma Cays Land and Sea Park.jpg",
  "Tropic of Cancer Beach": "/images/destinations/Tropic of Cancer Beach.jpg",
  "George Town Harbour Life":
    "/images/destinations/George Town Harbour Life.jpg",
};

export function AttractionCardGrid({
  attractions,
}: {
  attractions: readonly Attraction[];
}) {
  const [preview, setPreview] = useState<{
    name: string;
    src: string;
  } | null>(null);
  const previewRef = useRef<HTMLElement | null>(null);
  const targetPosition = useRef({ left: 12, top: 12 });

  useEffect(() => {
    if (!preview) return;

    const position = { ...targetPosition.current };
    let frame = 0;

    const followPointer = () => {
      const target = targetPosition.current;
      position.left += (target.left - position.left) * 0.2;
      position.top += (target.top - position.top) * 0.2;
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${position.left}px, ${position.top}px, 0)`;
      }
      frame = window.requestAnimationFrame(followPointer);
    };

    frame = window.requestAnimationFrame(followPointer);
    return () => window.cancelAnimationFrame(frame);
  }, [preview]);

  const updatePreview = (
    event: MouseEvent<HTMLElement>,
    name: string,
    src: string,
  ) => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    const width = Math.min(336, window.innerWidth - 24);
    const height = width * 0.75 + 64;
    const offset = 22;
    const left =
      event.clientX + width + offset <= window.innerWidth
        ? event.clientX + offset
        : event.clientX - width - offset;
    const top =
      event.clientY + height + offset <= window.innerHeight
        ? event.clientY + offset
        : event.clientY - height - offset;

    targetPosition.current = {
      left: Math.max(12, left),
      top: Math.max(12, top),
    };

    if (preview?.name !== name || preview.src !== src) {
      setPreview({ name, src });
    }
  };

  return (
    <>
      <div className="mt-14 grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {attractions.map((attraction, index) => {
          const Icon = icons[index % icons.length];
          const titleId = `attraction-title-${index}`;
          const imageSrc = attractionImages[attraction.name];

          return (
            <Reveal
              key={attraction.name}
              delay={(index % 3) * 70}
              className="h-full"
            >
              <article
                aria-labelledby={titleId}
                onMouseEnter={(event) =>
                  updatePreview(event, attraction.name, imageSrc)
                }
                onMouseMove={(event) =>
                  updatePreview(event, attraction.name, imageSrc)
                }
                onMouseLeave={() => setPreview(null)}
                className="attraction-card flex h-full flex-col rounded-lg border border-sand-300 bg-white p-6 sm:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-md border border-gold-500/50 bg-ivory-100 text-gold-600">
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-caps text-ink-400">
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

                <div className="mt-4 space-y-3 border-t border-sand-200 pt-4 text-sm leading-relaxed text-ink-700">
                  <p>{attraction.detail}</p>
                  {attraction.note && (
                    <p className="text-xs font-medium text-ink-500">
                      {attraction.note}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {preview && (
        <figure
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 w-[min(21rem,calc(100vw-1.5rem))] will-change-transform overflow-hidden rounded-lg border border-white/80 bg-navy-950 text-ivory-50 shadow-[0_24px_70px_rgba(3,20,30,0.38)]"
          style={{ transform: "translate3d(12px, 12px, 0)" }}
        >
          <div className="relative aspect-4/3">
            <Image
              src={preview.src}
              alt=""
              fill
              sizes="336px"
              className="object-cover"
            />
          </div>
          <figcaption className="border-t border-white/10 px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-caps text-gold-400">
              Exuma · Destination
            </p>
            <p className="mt-1 font-display text-base leading-tight">
              {preview.name}
            </p>
          </figcaption>
        </figure>
      )}
    </>
  );
}
