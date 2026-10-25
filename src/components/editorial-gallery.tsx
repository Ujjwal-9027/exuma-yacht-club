"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Reveal } from "@/components/reveal";

const galleryItems = [
  {
    src: "/images/EYC%20About/EYC_main2.jpg",
    alt: "View from the waterfront deck across palm-lined grounds toward the harbour docks",
    title: "A View Across the Harbour",
    category: "Island Views",
    description:
      "A sunlit look across the club's waterfront deck and the docks beyond.",
    position: "object-center",
  },
  {
    src: "/images/EYC%20About/EYC_main8.jpg",
    alt: "Yachts and sailboats moored at the docks beneath a golden sunset",
    title: "Golden Hour at the Docks",
    category: "Marina Life",
    description:
      "Boats settle in for the evening as the sun sets over Elizabeth Harbour.",
    position: "object-center",
  },
  {
    src: "/images/EYC%20About/EYC_main11.jpg",
    alt: "Guests seated on a shaded terrace beside the club's white building and palms",
    title: "A Table Beneath the Palms",
    category: "Dining",
    description: "A relaxed open-air setting at the club, surrounded by palms.",
    position: "object-center",
  },
  {
    src: "/images/EYC%20About/EYC_main6.jpg",
    alt: "A covered waterfront veranda framed by palms in the evening light",
    title: "A Quiet Harbour Veranda",
    category: "Stay",
    description:
      "A peaceful place to unwind with the water just beyond the palms.",
    position: "object-center",
  },
] as const;

export function EditorialGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const closeLightbox = () => setSelectedIndex(null);
  const showPrevious = () =>
    setSelectedIndex((current) =>
      current === null
        ? null
        : (current - 1 + galleryItems.length) % galleryItems.length,
    );
  const showNext = () =>
    setSelectedIndex((current) =>
      current === null ? null : (current + 1) % galleryItems.length,
    );

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Reveal className="max-w-3xl">
          <p className="overline-label">Gallery</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-navy-900 sm:text-4xl lg:text-5xl">
            Moments on Elizabeth Harbour
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">
            Marina life, island views, waterfront dining and quiet rooms,
            gathered in the rhythm of a day on the harbour.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <button
            type="button"
            onClick={() => setSelectedIndex(0)}
            className="group inline-flex shrink-0 items-center gap-3 border border-navy-900/35 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-900 transition-colors duration-300 hover:border-navy-900 hover:bg-navy-900 hover:text-ivory-50 focus:outline-none focus:ring-2 focus:ring-gold-500/60 motion-reduce:transition-none"
          >
            Explore the Gallery
            <ArrowRight
              className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
        <GalleryTile
          item={galleryItems[0]}
          index={0}
          featured
          onOpen={setSelectedIndex}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {galleryItems.slice(1).map((item, index) => (
            <GalleryTile
              key={item.src}
              item={item}
              index={index + 1}
              onOpen={setSelectedIndex}
              wide={index === 2}
            />
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const startX = touchStartX.current;
            const endX = event.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (startX === null || endX === undefined) return;
            if (startX - endX > 50) showNext();
            if (endX - startX > 50) showPrevious();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center border border-ivory-50/30 text-ivory-50 transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous gallery image"
            className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-ivory-50/30 text-ivory-50 transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:left-8"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next gallery image"
            className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-ivory-50/30 text-ivory-50 transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:right-8"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex max-h-full w-full max-w-6xl flex-col items-center gap-5">
            <div className="relative h-[58vh] w-full sm:h-[70vh]">
              <Image
                src={galleryItems[selectedIndex].src}
                alt={galleryItems[selectedIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="max-w-2xl text-center text-ivory-50">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                {galleryItems[selectedIndex].category}
              </p>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl">
                {galleryItems[selectedIndex].title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory-100/70">
                {galleryItems[selectedIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryTile({
  item,
  index,
  onOpen,
  featured = false,
  wide = false,
}: {
  item: (typeof galleryItems)[number];
  index: number;
  onOpen: (index: number) => void;
  featured?: boolean;
  wide?: boolean;
}) {
  return (
    <Reveal delay={180 + index * 80} className={wide ? "sm:col-span-2" : ""}>
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Open ${item.title}`}
        className={`group relative block w-full overflow-hidden rounded-xl bg-navy-950 text-left focus:outline-none focus:ring-2 focus:ring-gold-500/70 ${featured ? "aspect-[4/5] md:aspect-auto md:h-full md:min-h-[440px] lg:min-h-[560px]" : wide ? "aspect-[2/1]" : "aspect-[4/3]"}`}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 58vw, 100vw"
              : "(min-width: 1024px) 22vw, 50vw"
          }
          className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${item.position}`}
        />
        <span
          className="absolute inset-0 bg-navy-950/0 transition-colors duration-500 group-hover:bg-navy-950/45 motion-reduce:transition-none"
          aria-hidden="true"
        />
        <span className="absolute inset-x-0 bottom-0 flex translate-y-3 flex-col p-5 opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none sm:p-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
            {item.category}
          </span>
          <span className="mt-2 flex items-center justify-between gap-4 font-display text-xl text-ivory-50 sm:text-2xl">
            {item.title}
            <ArrowRight
              className="h-5 w-5 shrink-0 text-gold-400"
              aria-hidden="true"
            />
          </span>
        </span>
      </button>
    </Reveal>
  );
}
