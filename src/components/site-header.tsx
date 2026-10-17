"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { nav } from "@/lib/site";
import { Logo } from "@/components/logo";
import { useCart } from "@/components/cart-provider";

const discoverLinks = [
  { label: "About", href: "/about" },
  { label: "Destination", href: "/destination" },
  { label: "Attractions", href: "/attractions" },
  { label: "Getting Here", href: "/getting-here" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const discoverRef = useRef<HTMLLIElement>(null);
  const mobileDiscoverRef = useRef<HTMLDivElement>(null);
  const { count } = useCart();
  const isHome = pathname === "/";
  const heroHeader = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus whenever the route changes
  useEffect(() => {
    setOpen(false);
    setDiscoverOpen(false);
  }, [pathname]);

  // Close the Discover dropdown on Escape or outside click
  useEffect(() => {
    if (!discoverOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDiscoverOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (
        !discoverRef.current?.contains(e.target as Node) &&
        !mobileDiscoverRef.current?.contains(e.target as Node)
      ) {
        setDiscoverOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [discoverOpen]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`site-header ${isHome ? "fixed w-full" : "sticky"} isolate top-0 z-50 border-b backdrop-blur-sm transition-all duration-300 ${
          heroHeader
            ? "border-white/30 bg-ivory-50/5"
            : "border-sand-300 bg-white shadow-[0_1px_0_rgba(12,39,51,0.06)]"
        }`}
      >
        <div className="mx-auto flex h-[108px] max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8">
          <Link
            href="/"
            aria-label="Exuma Yacht Club — home"
            className="shrink-0"
          >
            <Logo compact variant={heroHeader ? "light" : "dark"} />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {nav.slice(0, -1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`header-nav-link ${isActive(item.href) ? "is-active" : ""} relative py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      heroHeader
                        ? "text-ivory-50 hover:text-white"
                        : "hover:text-navy-900"
                    } ${
                      isActive(item.href)
                        ? heroHeader
                          ? "text-white"
                          : "text-navy-900"
                        : heroHeader
                          ? "text-ivory-50/85"
                          : "text-ink-500"
                    }`}
                  >
                    {item.label}
                    <span className="header-nav-underline absolute inset-x-0 -bottom-[2px] h-px bg-gold-500" />
                  </Link>
                </li>
              ))}

              {/* Discover dropdown */}
              <li ref={discoverRef} className="relative">
                <button
                  type="button"
                  aria-expanded={discoverOpen}
                  aria-haspopup="true"
                  onClick={() => setDiscoverOpen((v) => !v)}
                  className={`header-plain header-nav-link ${discoverLinks.some((l) => isActive(l.href)) ? "is-active" : ""} relative inline-flex items-center gap-1 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    heroHeader
                      ? "text-ivory-50 hover:text-white"
                      : "hover:text-navy-900"
                  } ${
                    discoverLinks.some((l) => isActive(l.href))
                      ? heroHeader
                        ? "text-white"
                        : "text-navy-900"
                      : heroHeader
                        ? "text-ivory-50/85"
                        : "text-ink-500"
                  }`}
                >
                  Discover
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${discoverOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                  <span className="header-nav-underline absolute inset-x-0 -bottom-[2px] h-px bg-gold-500" />
                </button>
                <ul
                  className={`absolute right-0 top-full z-[70] mt-3 w-52 border border-sand-300 bg-white py-2 shadow-[0_18px_40px_rgba(12,39,51,0.12)] transition-all duration-200 ${
                    discoverOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  {discoverLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={`block px-5 py-2.5 text-[13px] transition-colors hover:bg-ivory-100 hover:text-navy-900 ${
                          isActive(item.href)
                            ? "font-semibold text-navy-900"
                            : "text-ink-500"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <Link
                  href="/contact"
                  aria-current={isActive("/contact") ? "page" : undefined}
                  className={`header-nav-link ${isActive("/contact") ? "is-active" : ""} relative py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    heroHeader
                      ? "text-ivory-50 hover:text-white"
                      : "hover:text-navy-900"
                  } ${
                    isActive("/contact")
                      ? heroHeader
                        ? "text-white"
                        : "text-navy-900"
                      : heroHeader
                        ? "text-ivory-50/85"
                        : "text-ink-500"
                  }`}
                >
                  Contact
                  <span className="header-nav-underline absolute inset-x-0 -bottom-[2px] h-px bg-gold-500" />
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/cart"
              aria-label={`Shopping cart, ${count} item${count === 1 ? "" : "s"}`}
              className={`relative grid h-10 w-10 place-items-center transition-colors ${
                heroHeader
                  ? "text-ivory-50 hover:text-white"
                  : "text-navy-900 hover:text-gold-600"
              }`}
            >
              <ShoppingBag className="h-[20px] w-[20px]" strokeWidth={1.6} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <Link
              href="/contact"
              className="hidden border border-navy-900 bg-navy-900 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900 lg:inline-block"
            >
              Plan Your Visit
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`grid h-10 w-10 place-items-center border border-navy-900/20 text-navy-900 transition-colors lg:hidden ${
                open ? "bg-white shadow-sm" : "bg-transparent"
              }`}
            >
              {open ? (
                <X className="h-6 w-6" strokeWidth={1.6} />
              ) : (
                <Menu className="h-6 w-6" strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[108px] z-[60] max-h-[calc(100dvh-108px)] overflow-y-auto overscroll-contain border-t border-sand-300 bg-white shadow-[0_18px_40px_rgba(12,39,51,0.16)] transition-[transform,opacity] duration-300 ease-out lg:hidden ${
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        }`}
        style={{ maxHeight: "calc(100dvh - 108px)", zIndex: 60 }}
      >
        <nav aria-label="Mobile" className="min-h-full px-6 pb-10 pt-6">
          <ul className="divide-y divide-sand-200">
            {nav.map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: `${i * 30}ms` }}
                className={`transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center justify-between py-4 font-display text-2xl ${
                    isActive(item.href) ? "text-gold-600" : "text-navy-900"
                  }`}
                >
                  {item.label}
                  <span aria-hidden="true" className="text-sm text-gold-500">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            ref={mobileDiscoverRef}
            className="mt-8 border-y border-sand-200"
          >
            <button
              type="button"
              aria-expanded={discoverOpen}
              aria-controls="mobile-discover-links"
              onClick={() => setDiscoverOpen((value) => !value)}
              className="flex w-full items-center justify-between py-4 text-left font-display text-2xl text-navy-900"
            >
              Discover
              <ChevronDown
                className={`h-5 w-5 text-gold-600 transition-transform duration-300 ${discoverOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            <ul
              id="mobile-discover-links"
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${discoverOpen ? "max-h-96 pb-2 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {discoverLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex items-center justify-between border-t border-sand-200 py-3.5 pl-3 text-lg ${
                      isActive(item.href) ? "text-gold-600" : "text-navy-900"
                    }`}
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-sm text-gold-500">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-8 block border border-navy-900 bg-navy-900 px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-ivory-50"
          >
            Plan Your Visit
          </Link>
        </nav>
      </div>
    </>
  );
}
