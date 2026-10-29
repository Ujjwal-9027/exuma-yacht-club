"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 400);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
      }}
      className="group fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.5rem)] right-[max(1rem,env(safe-area-inset-right))] z-40 flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full border border-gold-400/50 bg-navy-950 text-ivory-50 shadow-[0_0_0_4px_rgba(201,168,106,0.16)] transition-[width,border-color,background-color,box-shadow] duration-300 ease-out hover:w-[140px] hover:border-gold-400 hover:bg-gold-400 hover:text-navy-950 hover:shadow-[0_0_0_4px_rgba(201,168,106,0.32)] focus-visible:w-[140px] focus-visible:border-gold-400 focus-visible:bg-gold-400 focus-visible:text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400 motion-reduce:transition-none"
    >
      <ArrowUp
        className="absolute h-5 w-5 transition-[transform,opacity] duration-300 group-hover:-translate-y-10 group-hover:opacity-0 group-focus-visible:-translate-y-10 group-focus-visible:opacity-0 motion-reduce:transition-none"
        aria-hidden="true"
      />
      <span className="absolute whitespace-nowrap text-xs font-semibold transition-[transform,opacity] duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
        Back to Top
      </span>
    </button>
  );
}
