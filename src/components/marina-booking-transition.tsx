"use client";

import { useEffect, useRef, useState } from "react";
import { isPlaceholder } from "@/config/site";

const buttonClass =
  "inline-flex items-center justify-center border border-gold-500 bg-gold-500 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-950 transition-colors hover:border-gold-400 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-ivory-50";

export function MarinaBookingTransition({ dockwaUrl }: { dockwaUrl: string }) {
  const sourceRef = useRef<HTMLAnchorElement>(null);
  const [floatingVisible, setFloatingVisible] = useState(false);

  useEffect(() => {
    const source = sourceRef.current;
    if (!source) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFloatingVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(source);
    return () => observer.disconnect();
  }, []);

  if (isPlaceholder(dockwaUrl)) {
    return (
      <span
        aria-disabled="true"
        title="Dockwa booking URL not configured yet"
        className={`${buttonClass} cursor-not-allowed border-white/35 bg-white/15 text-ivory-100/60`}
      >
        Book Now
      </span>
    );
  }

  return (
    <>
      <a
        ref={sourceRef}
        href={dockwaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Book marina dockage through Dockwa"
      >
        Book Now
      </a>
      <a
        href={dockwaUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={floatingVisible ? 0 : -1}
        aria-hidden={!floatingVisible}
        aria-label="Book marina dockage through Dockwa"
        className={`${buttonClass} fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap shadow-lg shadow-navy-950/25 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${floatingVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        Book Now
      </a>
    </>
  );
}
