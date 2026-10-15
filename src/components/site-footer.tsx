import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Radio } from "lucide-react";
import { site } from "@/lib/site";
import { config, isPlaceholder } from "@/config/site";

const socialLinks = [
  { label: "Facebook", href: config.social.facebook },
  { label: "Instagram", href: config.social.instagram },
  { label: "Tripadvisor", href: config.social.tripadvisor },
];

const serviceLinks = [
  { label: "Marina & Dockage", href: "/marina" },
  { label: "Accommodation", href: "/stay" },
  { label: "Restaurant & Dining", href: "/dining" },
  { label: "Gift Shop", href: "/shop" },
];

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Destination", href: "/destination" },
  { label: "Attractions", href: "/attractions" },
  { label: "Getting Here", href: "/getting-here" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Booking & Cancellation", href: "/booking-cancellation" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-ivory-100">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Exuma Yacht Club — home">
              <Image
                src="/logo/EYCflag.png"
                alt="Exuma Yacht Club — George Town, Bahamas"
                width={320}
                height={197}
                priority
                unoptimized
                className="h-auto w-56 max-w-full rounded-2xl border-2 border-white object-cover"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory-100/70">
              A boutique marina and hotel on Elizabeth Harbour in George Town,
              Great Exuma — dockage, fuel, island stays, waterfront dining and a
              gift shop, all on the water&apos;s edge.
            </p>
            <p className="mt-6 font-display text-sm tracking-[0.08em] text-gold-400">
              {site.coordinates.display}
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">
              Explore
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ivory-100/75 transition-colors hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services" className="lg:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">
              Services
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ivory-100/75 transition-colors hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">
              Visit & Contact
            </h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span className="text-ivory-100/75">
                  {site.address.street}, {site.address.locality}
                  <br />
                  {site.address.country}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>
                  <a
                    href={site.phone.href}
                    className="text-ivory-100/75 transition-colors hover:text-gold-400"
                  >
                    {site.phone.label}
                  </a>
                  <span className="block text-xs text-ivory-100/50">
                    {site.phone.note}
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>
                  <a
                    href={site.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ivory-100/75 transition-colors hover:text-gold-400"
                  >
                    {site.whatsapp.label}
                  </a>
                  <span className="block text-xs text-ivory-100/50">
                    WhatsApp
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <Radio
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span className="text-ivory-100/75">{site.vhf}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ivory-100/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ivory-100/50">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          {/* Social links render only when configured in src/config/site.ts */}
          {socialLinks.some((s) => !isPlaceholder(s.href)) && (
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
              {socialLinks
                .filter((s) => !isPlaceholder(s.href))
                .map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ivory-100/70 transition-colors hover:text-gold-400"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
            </ul>
          )}
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {policyLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ivory-100/50 transition-colors hover:text-gold-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
