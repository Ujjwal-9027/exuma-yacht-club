"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui";
import { ButtonLink } from "@/components/ui";
import { getPublicAssetPath } from "@/lib/public-assets";

const shopHeroSlides = [
  {
    src: getPublicAssetPath("/images/Shop/hero1.jpg"),
    alt: "Colorful Exuma Yacht Club caps arranged on a wooden table.",
  },
  {
    src: getPublicAssetPath("/images/Shop/hero2.png"),
    alt: "Exuma Yacht Club caps displayed on a sandy beach beside the sea.",
  },
  {
    src: getPublicAssetPath("/images/Shop/hero3.jpg"),
    alt: "A yellow Exuma Yacht Club cap resting on a wooden deck among dock lines.",
  },
  {
    src: getPublicAssetPath("/images/Shop/hero4.jpg"),
    alt: "A row of colorful Exuma Yacht Club caps displayed on a shelf.",
  },
  {
    src: getPublicAssetPath("/images/Shop/hero5.jpeg"),
    alt: "An Exuma Yacht Club cap pictured beside an airplane at an airport.",
  },
] as const;

export function ShopHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % shopHeroSlides.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      aria-labelledby="shop-hero-title"
      className="border-b border-sand-200 bg-ivory-100"
    >
      <Container className="grid items-center gap-7 py-7 sm:gap-10 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:py-14 xl:gap-16">
        <figure
          aria-label="Exuma Yacht Club merchandise photos"
          aria-roledescription="carousel"
          className="hero-image-3d order-1 relative aspect-3/2 overflow-hidden rounded-lg border border-sand-300 bg-sand-200 lg:order-2"
          role="region"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {shopHeroSlides.map((slide, index) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={index === activeSlide ? slide.alt : ""}
              aria-hidden={index !== activeSlide}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className={`object-cover transition-opacity duration-700 motion-reduce:transition-none ${index === activeSlide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </figure>
        <div className="order-2 max-w-xl py-2 lg:order-1 lg:py-4">
          <p className="overline-label">Merchandise · Exuma Yacht Club</p>
          <h1
            id="shop-hero-title"
            className="mt-4 font-display text-4xl leading-[1.08] font-medium text-navy-900 sm:text-5xl xl:text-6xl"
          >
            A little piece of Exuma
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-700 sm:text-lg">
            Club apparel and island essentials for days on and off the water.
            Order online, then choose shipping or collection at the marina gift
            shop.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <ButtonLink href="#products-heading" variant="gold">
              Shop the collection
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <p className="text-sm leading-relaxed text-ink-500">
              Choose marina collection or shipping at checkout.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
