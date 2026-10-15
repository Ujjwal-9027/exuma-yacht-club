"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui";

const slides = [
  {
    src: "/images/shop-hero.webp",
    alt: "Exuma Yacht Club caps on a beach",
  },
  {
    src: "/images/shop-hero-3.jpg",
    alt: "Exuma Yacht Club merchandise collection",
  },
  {
    src: "/images/shop-hero-4.webp",
    alt: "Exuma Yacht Club merchandise collection",
  },
] as const;

export function ShopHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-navy-950 sm:min-h-[54vh]">
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={index === activeSlide ? slide.alt : ""}
          fill
          priority={index === 0}
          loading="eager"
          sizes="100vw"
          aria-hidden={index !== activeSlide}
          className={`object-cover object-center transition-opacity duration-1000 ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div
        className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-navy-950/15"
        aria-hidden="true"
      />
      <Container className="relative w-full pb-14 pt-32 sm:pb-20">
        <p className="overline-label !text-gold-400">
          Merchandise &amp; Gift Shop
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] font-medium text-ivory-50 sm:text-5xl lg:text-6xl">
          The club collection
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory-100/80 sm:text-lg">
          Club apparel and island essentials. Place your order online and
          collect it at the marina gift shop — payment is taken at pickup.
        </p>
      </Container>
    </section>
  );
}
