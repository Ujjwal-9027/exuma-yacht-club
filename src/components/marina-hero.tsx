"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";
import { MarinaBookingTransition } from "@/components/marina-booking-transition";

const images = [
  {
    src: "/images/marina-1.jpg",
    alt: "Sailboats and yachts moored along the docks at Exuma Yacht Club marina",
  },
  {
    src: "/images/marina-2.jpg",
    alt: "Yachts resting in the protected waters of Exuma Yacht Club marina",
  },
];

export function MarinaHero({ dockwaUrl }: { dockwaUrl: string }) {
  const [activeImage, setActiveImage] = useState(0);
  const [bottomBookingVisible, setBottomBookingVisible] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const bottomBooking = document.getElementById("marina-footer-booking");
    if (!bottomBooking) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBottomBookingVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(bottomBooking);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="marina-hero"
      className="relative flex min-h-[46vh] items-end overflow-hidden bg-navy-950 sm:min-h-[54vh]"
    >
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ${
            index === activeImage ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div
        className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-navy-950/15"
        aria-hidden="true"
      />
      <Container className="relative w-full pb-14 pt-32 sm:pb-20">
        <p className="overline-label !text-gold-400">
          EXUMA YACHT CLUB · GEORGE TOWN, BAHAMAS
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl leading-[1.08] font-medium text-ivory-50 sm:text-5xl lg:text-6xl">
          A Protected Berth on Elizabeth Harbour
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory-100/80 sm:text-lg">
          Discover marina facilities in the heart of George Town, with dockage,
          shore services and convenient access to the island.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!bottomBookingVisible && (
            <MarinaBookingTransition dockwaUrl={dockwaUrl} />
          )}
          <a
            href={site.phone.href}
            className="inline-flex items-center justify-center gap-2 border border-ivory-50/60 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 hover:bg-ivory-50 hover:text-navy-900"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call the Dock Office
          </a>
        </div>
        <Link
          href="/booking-cancellation"
          className="mt-4 inline-block text-sm font-medium text-ivory-50 underline decoration-gold-400 underline-offset-4 hover:text-gold-400"
        >
          Review external booking terms
        </Link>
      </Container>
    </section>
  );
}
