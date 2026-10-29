"use client";

import { useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";
import { isPlaceholder } from "@/config/site";

const buttonClass =
  "inline-flex items-center justify-center border border-gold-500 bg-gold-500 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy-950 transition-colors hover:border-gold-400 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300 focus:ring-offset-2 focus:ring-offset-ivory-50";

const subscribeToPortalTarget = () => () => {};
const getPortalTargetSnapshot = () => document.body;
const getPortalTargetServerSnapshot = () => null;

export function BookingTransitionLink({
  bookingUrl,
  ariaLabel,
  hideWhenVisibleId,
  floatingVariant = "standard",
}: {
  bookingUrl: string;
  ariaLabel: string;
  hideWhenVisibleId?: string;
  floatingVariant?: "standard" | "angled";
}) {
  const sourceRef = useRef<HTMLAnchorElement>(null);
  const [sourceVisible, setSourceVisible] = useState(true);
  const [hideTargetVisible, setHideTargetVisible] = useState(false);
  const portalTarget = useSyncExternalStore(
    subscribeToPortalTarget,
    getPortalTargetSnapshot,
    getPortalTargetServerSnapshot,
  );

  useEffect(() => {
    const source = sourceRef.current;
    if (!source) return;

    const hideTarget = hideWhenVisibleId
      ? document.getElementById(hideWhenVisibleId)
      : null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === source) {
            setSourceVisible(entry.isIntersecting);
          } else if (entry.target === hideTarget) {
            setHideTargetVisible(entry.isIntersecting);
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(source);
    if (hideTarget) observer.observe(hideTarget);
    return () => observer.disconnect();
  }, [hideWhenVisibleId]);

  if (isPlaceholder(bookingUrl)) {
    return (
      <span
        aria-disabled="true"
        title="Booking link not configured yet"
        className={`${buttonClass} cursor-not-allowed border-sand-300 bg-sand-200/60 text-ink-400`}
      >
        Book Now
      </span>
    );
  }

  const floatingVisible = !sourceVisible && !hideTargetVisible;
  const floatingButton = (
    <div
      aria-hidden={!floatingVisible}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-max -translate-x-1/2 whitespace-nowrap transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${floatingVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={floatingVisible ? 0 : -1}
        aria-label={ariaLabel}
        className={
          floatingVariant === "angled"
            ? "group inline-flex items-center justify-center border border-gold-400 bg-navy-950 px-6 py-3.5 font-body text-[11px] font-semibold not-italic uppercase tracking-[0.16em] text-ivory-50 shadow-[6px_6px_0_var(--color-gold-400)] transition-[transform,box-shadow,color] duration-300 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_var(--color-gold-400)] hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400 motion-reduce:transition-none motion-reduce:hover:transform-none"
            : `${buttonClass} shadow-lg shadow-navy-950/25`
        }
      >
        {floatingVariant === "angled" ? (
          <span className="inline-flex items-center gap-3">
            Book Now
            <ArrowRight
              className="h-8 w-8 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
              aria-hidden="true"
            />
          </span>
        ) : (
          "Book Now"
        )}
      </a>
    </div>
  );

  return (
    <>
      <a
        ref={sourceRef}
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label={ariaLabel}
      >
        Book Now
      </a>
      {portalTarget ? createPortal(floatingButton, portalTarget) : null}
    </>
  );
}
