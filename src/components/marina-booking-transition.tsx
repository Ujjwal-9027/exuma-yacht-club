"use client";

import { useEffect, useRef } from "react";
import { isPlaceholder } from "@/config/site";

const buttonClass =
  "inline-flex items-center justify-center border border-gold-500 bg-gold-500 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-950 transition-colors hover:border-gold-400 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-ivory-50";

export function MarinaBookingTransition({ dockwaUrl }: { dockwaUrl: string }) {
  const sourceRef = useRef<HTMLAnchorElement>(null);
  const floatingRef = useRef<HTMLAnchorElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const source = sourceRef.current;
    const floating = floatingRef.current;
    const target = targetRef.current;
    const hero = document.getElementById("marina-hero");
    const footer = document.getElementById(
      "marina-footer-booking",
    ) as HTMLAnchorElement | null;
    if (!source || !floating || !target || !hero || !footer) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const travelStart = window.innerHeight * 0.75;
      const travelEnd = 0;
      const heroProgress = reduceMotion
        ? heroRect.bottom <= travelStart
          ? 1
          : 0
        : Math.min(
            1,
            Math.max(
              0,
              (travelStart - heroRect.bottom) / (travelStart - travelEnd),
            ),
          );
      const heroEased = heroProgress * heroProgress * (3 - 2 * heroProgress);
      const sourceWidth = sourceRect.width || targetRect.width;
      const sourceHeight = sourceRect.height || targetRect.height;
      const floatingX = targetRect.left + (targetRect.width - sourceWidth) / 2;
      const floatingY = targetRect.top + (targetRect.height - sourceHeight) / 2;
      const footerStart =
        window.innerHeight - Math.max(24, footerRect.height * 0.25);
      const footerEnd = window.innerHeight * 0.58;
      const footerProgress = reduceMotion
        ? footerRect.top <= footerEnd
          ? 1
          : 0
        : Math.min(
            1,
            Math.max(
              0,
              (footerStart - footerRect.top) / (footerStart - footerEnd),
            ),
          );
      const footerEased =
        footerProgress * footerProgress * (3 - 2 * footerProgress);
      const width =
        sourceWidth + (footerRect.width - sourceWidth) * footerEased;
      const height =
        sourceHeight + (footerRect.height - sourceHeight) * footerEased;
      const footerX = footerRect.left;
      const footerY = footerRect.top;
      const x = footerEased
        ? floatingX + (footerX - floatingX) * footerEased
        : sourceRect.left + (floatingX - sourceRect.left) * heroEased;
      const y = footerEased
        ? floatingY + (footerY - floatingY) * footerEased
        : sourceRect.top + (floatingY - sourceRect.top) * heroEased;
      const floatingStage = footerEased ? 1 - footerEased : heroEased;
      const scale = 1 + floatingStage * 0.5;
      const floatingOpacity = footerEased
        ? (1 - footerEased) *
          Math.min(1, Math.max(0, (heroEased - 0.08) / 0.72))
        : Math.min(1, Math.max(0, (heroEased - 0.08) / 0.72));
      const footerVisible = footerProgress >= 0.92;
      const floatingInteractive =
        heroEased > 0.72 && floatingOpacity > 0.08 && !footerVisible;

      floating.style.width = `${width}px`;
      floating.style.height = `${height}px`;
      floating.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      floating.style.opacity = `${floatingOpacity}`;
      floating.tabIndex = floatingInteractive ? 0 : -1;
      floating.style.pointerEvents = floatingInteractive ? "auto" : "none";
      floating.setAttribute(
        "aria-hidden",
        floatingInteractive ? "false" : "true",
      );
      source.style.opacity = `${Math.min(1, Math.max(0, 1 - heroEased / 0.72))}`;
      source.tabIndex = heroEased > 0.72 ? -1 : 0;
      source.style.pointerEvents = heroEased > 0.72 ? "none" : "auto";
      source.setAttribute("aria-hidden", heroEased > 0.72 ? "true" : "false");
      footer.style.opacity = footerProgress > 0 ? `${footerEased}` : "";
      footer.style.pointerEvents =
        footerProgress > 0 && !footerVisible ? "none" : "";
      footer.tabIndex = footerProgress > 0 && !footerVisible ? -1 : 0;
      footer.setAttribute(
        "aria-hidden",
        footerProgress > 0 && !footerVisible ? "true" : "false",
      );
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
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
      <span
        ref={targetRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-[3.25rem] justify-center"
      />
      <a
        ref={floatingRef}
        href={dockwaUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Book marina dockage through Dockwa"
        className={`${buttonClass} fixed left-0 top-0 z-50 whitespace-nowrap shadow-lg shadow-navy-950/25`}
        style={{
          opacity: 0,
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      >
        Book Now
      </a>
    </>
  );
}
