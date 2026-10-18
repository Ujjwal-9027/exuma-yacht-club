"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";

type OrderStep = {
  step: string;
  title: string;
  summary: string;
  label: string;
  detail: string;
  note: string;
};

const steps: readonly OrderStep[] = [
  {
    step: "01",
    title: "Place Your Order",
    summary:
      "Browse the shop, add your favorite items to the cart, and place your order online.",
    label: "BROWSE · SELECT · ORDER",
    detail:
      "Explore available merchandise, choose quantities or sizes where applicable, and add your favorite items to the cart. Review your selection before submitting your order.",
    note: "Payment is required to confirm your order.",
  },
  {
    step: "02",
    title: "We Prepare Your Order",
    summary:
      "We'll pack your items carefully and prepare them for delivery or store pickup.",
    label: "CHECKED · PACKED · READY",
    detail:
      "Our team reviews your order, checks the selected items, and carefully packs everything for delivery or collection at the gift shop. We'll confirm the next steps with you.",
    note: "Choose the option that works best for you.",
  },
  {
    step: "03",
    title: "Delivery or Store Pickup",
    summary:
      "Have your order delivered to your preferred address, or visit the gift shop on Queen's Highway to shop in person or collect your order.",
    label: "DELIVER · COLLECT · VISIT",
    detail:
      "Choose delivery to your preferred address, subject to availability, or collect your online order from the gift shop on Queen's Highway. You can also visit the shop in person to browse available products.",
    note: "Follow the payment instructions provided for delivery.",
  },
];

export function OrderProcessCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div
      className="mt-12 grid items-stretch gap-4 sm:grid-cols-3 lg:flex lg:h-[280px] lg:gap-3 lg:overflow-hidden"
      onMouseLeave={() => setActiveIndex(null)}
    >
      {steps.map((step, index) => {
        const isActive = activeIndex === index;
        return (
          <Reveal
            key={step.step}
            delay={index * 70}
            className={`h-full min-w-0 transition-[flex] duration-[400ms] ease-in-out motion-reduce:transition-none lg:min-w-0 ${
              isActive ? "lg:flex-[2.2]" : "lg:flex-[0.9]"
            }`}
          >
            <article
              tabIndex={0}
              onMouseEnter={() => {
                if (window.matchMedia("(min-width: 1024px)").matches) {
                  setActiveIndex(index);
                }
              }}
              onClick={() => {
                if (!window.matchMedia("(min-width: 1024px)").matches) {
                  setActiveIndex((current) =>
                    current === index ? null : index,
                  );
                }
              }}
              onFocus={() => setActiveIndex(index)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setActiveIndex(null);
                }
              }}
              className={`group grid h-full min-w-0 grid-cols-1 overflow-hidden border border-sand-300 bg-white p-7 outline-none transition-[background-color,box-shadow,border-color,grid-template-columns] duration-[400ms] ease-in-out hover:border-gold-500 hover:bg-ivory-50 hover:shadow-[0_18px_32px_rgba(12,39,51,0.14)] focus:border-gold-500 focus:bg-ivory-50 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:shadow-[0_18px_32px_rgba(12,39,51,0.14)] motion-reduce:transition-none ${
                isActive
                  ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-6"
                  : ""
              } ${
                index === 0
                  ? "rounded-tl-[2rem] rounded-br-[0.5rem]"
                  : index === 1
                    ? "rounded-[0.75rem]"
                    : "rounded-tr-[2rem] rounded-bl-[0.5rem]"
              }`}
            >
              <div className="min-w-0">
                <span className="font-display text-sm text-gold-600 transition-transform duration-500 group-hover:translate-x-1">
                  {step.step}
                </span>
                <h2 className="mt-3 font-display text-xl text-navy-900">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {step.summary}
                </p>
                <span
                  className="mt-5 block h-px w-8 bg-gold-500 transition-[width] duration-300 group-hover:w-14"
                  aria-hidden="true"
                />
              </div>
              <div
                aria-hidden={!isActive}
                className={`min-w-0 transition-[opacity,margin,padding,border-color] duration-[400ms] ease-in-out motion-reduce:transition-none ${
                  isActive
                    ? "mt-5 border-t border-sand-200 pt-4 opacity-100 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-1"
                    : "hidden"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                  {step.label}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">
                  {step.detail}
                </p>
                <p className="mt-3 text-xs font-semibold leading-relaxed text-navy-900">
                  {step.note}
                </p>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
