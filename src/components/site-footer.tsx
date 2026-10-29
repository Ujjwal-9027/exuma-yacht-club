import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone, Radio } from "lucide-react";
import { site } from "@/lib/site";
import type { PublicContactSettings } from "@/lib/managed-site";

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

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.75l.5-3H13.5V8.1c0-.87.29-1.6 1.64-1.6h1.76V3.82c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.38V10H7.25v3h2.85v8h3.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteFooter({
  contactSettings,
}: {
  contactSettings: PublicContactSettings;
}) {
  const whatsappHref = contactSettings.whatsappNumber
    ? `https://wa.me/${contactSettings.whatsappNumber}`
    : null;
  return (
    <footer className="bg-navy-950 text-ivory-100">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" aria-label="Exuma Yacht Club — home">
              <Image
                src="/logo/EYCflag.png"
                alt="Exuma Yacht Club — George Town, Bahamas"
                width={320}
                height={197}
                priority
                className="h-auto w-44 max-w-full rounded-xl border-2 border-white object-cover"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory-100/70">
              A marina and resort on Elizabeth Harbour in George Town, Great
              Exuma — dockage, island stays and a gift shop, with a waterfront
              restaurant and bar expected to open in December 2026.
            </p>
            <p className="mt-4 font-display text-sm tracking-[0.08em] text-gold-400">
              {site.coordinates.display}
            </p>
            {(contactSettings.socialFacebook ||
              contactSettings.socialInstagram) && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {contactSettings.socialFacebook && (
                  <li>
                    <a
                      href={contactSettings.socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="group grid h-8 w-8 place-items-center rounded-full border border-ivory-100/30 text-ivory-50 transition-[border-color,color,transform,box-shadow] duration-[400ms] ease-out hover:-translate-y-1 hover:border-[#1877F2] hover:text-[#1877F2] hover:shadow-[0_8px_16px_rgba(24,119,242,0.25)] hover:[transform:perspective(500px)_rotateX(12deg)_rotateY(-10deg)_scale(1.08)] motion-reduce:transition-none"
                    >
                      <FacebookIcon />
                    </a>
                  </li>
                )}
                {contactSettings.socialInstagram && (
                  <li>
                    <a
                      href={contactSettings.socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="group grid h-8 w-8 place-items-center rounded-full border border-ivory-100/30 text-ivory-50 transition-[border-color,color,transform,box-shadow] duration-[400ms] ease-out hover:-translate-y-1 hover:border-[#E4405F] hover:text-[#E4405F] hover:shadow-[0_8px_16px_rgba(228,64,95,0.25)] hover:[transform:perspective(500px)_rotateX(12deg)_rotateY(10deg)_scale(1.08)] motion-reduce:transition-none"
                    >
                      <InstagramIcon />
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">
              Explore
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
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
            <ul className="mt-4 space-y-2 text-sm">
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
          <div className="col-span-2 lg:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">
              Visit & Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span className="text-ivory-100/75">
                  {contactSettings.addressStreet},{" "}
                  {contactSettings.addressLocality}
                  <br />
                  {contactSettings.addressCountry}
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
                    href={`tel:${contactSettings.marinaPhone.replace(/[^0-9+]/g, "")}`}
                    className="text-ivory-100/75 transition-colors hover:text-gold-400"
                  >
                    {contactSettings.marinaPhone}
                  </a>
                  <span className="block text-xs text-ivory-100/50">
                    Hotel & marina
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
                    href={`mailto:${contactSettings.businessEmail}`}
                    className="text-ivory-100/75 transition-colors hover:text-gold-400"
                  >
                    {contactSettings.businessEmail}
                  </a>
                  <span className="block text-xs text-ivory-100/50">Email</span>
                </span>
              </li>
              <li className="flex gap-3">
                <MessageCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ivory-100/75 transition-colors hover:text-gold-400"
                    >
                      {contactSettings.whatsappLabel}
                    </a>
                  )}
                  <span className="block text-xs text-ivory-100/50">
                    Hotel & marina WhatsApp
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <Radio
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span className="text-ivory-100/75">
                  {contactSettings.vhfChannel}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ivory-100/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ivory-100/50">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-ivory-100/50">
            Designed &amp; developed by{" "}
            <a
              href="https://infycrestsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory-100/70 underline decoration-gold-400/70 underline-offset-4 transition-colors hover:text-gold-400"
            >
              Infycrest Solutions
            </a>
          </p>
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
