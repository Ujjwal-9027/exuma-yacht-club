"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

const marinaSlides = [
  {
    src: "/images/Marina/marina1.jpg",
    alt: "The Exuma Yacht Club waterfront building beside clear turquoise water.",
    caption: "The club on the water",
  },
  {
    src: "/images/Marina/marina2-web.jpg",
    alt: "A wooden pier leading toward sailboats moored in bright turquoise water.",
    caption: "Out along the pier",
  },
  {
    src: "/images/Marina/marina3.jpg",
    alt: "A long view across the yacht club waterfront and marina docks.",
    caption: "Along the waterfront",
  },
  {
    src: "/images/Marina/marina4.jpeg",
    alt: "A catamaran moored beside the marina dock.",
    caption: "Alongside at the dock",
  },
  {
    src: "/images/Marina/marina5.jpeg",
    alt: "The marina dock beneath a rainbow over the waterfront.",
    caption: "A rainbow over the marina",
  },
  {
    src: "/images/Marina/marina6.jpg",
    alt: "Aerial view of George Town and the marina basin on Elizabeth Harbour.",
    caption: "George Town from above",
  },
  {
    src: "/images/Marina/marina7.jpg",
    alt: "Aerial view of marina docks and turquoise water along the Exuma coast.",
    caption: "Harbour and coastline",
  },
  {
    src: "/images/Marina/marina8.jpg",
    alt: "Boats moored along marina piers viewed from above.",
    caption: "The marina from above",
  },
  {
    src: "/images/Marina/marina9.jpg",
    alt: "Elizabeth Harbour and the marina shoreline seen from the air.",
    caption: "The harbour shoreline",
  },
  {
    src: "/images/Marina/marina10.jpg",
    alt: "The Exuma Yacht Club docks extending into clear island water.",
    caption: "Docks in clear water",
  },
  {
    src: "/images/Marina/marina11.jpg",
    alt: "Aerial view across the marina basin and surrounding George Town waterfront.",
    caption: "The marina basin",
  },
  {
    src: "/images/Marina/marina12.jpg",
    alt: "Yachts and smaller boats berthed along the marina docks.",
    caption: "Vessels at the docks",
  },
  {
    src: "/images/Marina/marina13.jpg",
    alt: "A wide aerial view of Elizabeth Harbour and its turquoise shallows.",
    caption: "Elizabeth Harbour",
  },
  {
    src: "/images/Marina/marina14.jpg",
    alt: "The Exuma coastline and marina viewed from above.",
    caption: "The Exuma coastline",
  },
  {
    src: "/images/Marina/marina15.jpg",
    alt: "An aerial view of the marina, breakwater and boats on Elizabeth Harbour.",
    caption: "Inside the breakwater",
  },
] as const;

export function MarinaSlideshow() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isLightboxOpen = selectedIndex !== null;

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedIndex((index) =>
          index === null
            ? null
            : (index - 1 + marinaSlides.length) % marinaSlides.length,
        );
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((index) =>
          index === null ? null : (index + 1) % marinaSlides.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isLightboxOpen]);

  const showPrevious = () => {
    setSelectedIndex((index) =>
      index === null
        ? null
        : (index - 1 + marinaSlides.length) % marinaSlides.length,
    );
  };

  const showNext = () => {
    setSelectedIndex((index) =>
      index === null ? null : (index + 1) % marinaSlides.length,
    );
  };

  return (
    <div
      aria-label="Marina photo trail"
      aria-roledescription="carousel"
      className={`marina-image-trail${isLightboxOpen ? " is-lightbox-open" : ""}`}
      role="region"
      tabIndex={0}
    >
      <div className="marina-image-trail-track">
        {[false, true].map((isDuplicate) => (
          <div
            key={String(isDuplicate)}
            aria-hidden={isDuplicate}
            className="marina-image-trail-group"
          >
            {marinaSlides.map((slide, index) => (
              <figure
                key={`${slide.src}-${isDuplicate}`}
                className="marina-image-trail-slide overflow-hidden border border-sand-300 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  disabled={isDuplicate}
                  aria-label={`Open ${slide.caption}`}
                  tabIndex={isDuplicate ? -1 : undefined}
                  className="group relative block aspect-4/3 w-full cursor-zoom-in bg-navy-950 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold-500 disabled:cursor-default"
                >
                  <Image
                    src={slide.src}
                    alt={isDuplicate ? "" : slide.alt}
                    fill
                    sizes="(min-width: 1280px) 360px, (min-width: 640px) 40vw, 78vw"
                    className="object-cover"
                  />
                </button>
                <figcaption className="px-4 py-3 text-sm text-ink-700">
                  {slide.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-navy-950/95 p-4 text-ivory-50 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Marina photo viewer"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedIndex(null);
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close photo viewer"
            title="Close"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center border border-ivory-50/40 text-ivory-50 transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous marina photo"
            title="Previous photo"
            className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-ivory-50/40 text-ivory-50 transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:left-8"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next marina photo"
            title="Next photo"
            className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-ivory-50/40 text-ivory-50 transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:right-8"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex max-h-full w-full max-w-6xl flex-col items-center gap-5">
            <div className="relative h-[58vh] w-full sm:h-[70vh]">
              <Image
                src={marinaSlides[selectedIndex].src}
                alt={marinaSlides[selectedIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <p className="font-display text-xl sm:text-2xl">
                {marinaSlides[selectedIndex].caption}
              </p>
              <p className="mt-2 text-sm text-ivory-100/70">
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {marinaSlides.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
