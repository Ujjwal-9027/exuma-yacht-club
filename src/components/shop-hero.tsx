"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/ui";
import { ButtonLink } from "@/components/ui";

export function ShopHero() {
  return (
    <section
      aria-labelledby="shop-hero-title"
      className="border-b border-sand-200 bg-ivory-100"
    >
      <Container className="grid items-center gap-7 py-7 sm:gap-10 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:py-14 xl:gap-16">
        <figure className="hero-image-3d order-1 relative aspect-[3/2] overflow-hidden rounded-lg border border-sand-300 bg-sand-200 lg:order-2">
          <Image
            src="/images/shop-hero.webp"
            alt="Exuma Yacht Club caps in bright island colors arranged on a sandy beach."
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
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
