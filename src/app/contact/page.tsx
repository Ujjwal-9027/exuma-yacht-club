import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Radio } from "lucide-react";
import { site } from "@/lib/site";
import { getPublicContactSettings } from "@/lib/managed-site";
import { isPlaceholder } from "@/config/site";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "Contact & Location",
  description:
    "Contact Exuma Yacht Club Resort and Marina in George Town, Great Exuma — phone, email, WhatsApp, VHF 16, directions and inquiries for dockage, stays and fuel.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · Exuma Yacht Club",
    description:
      "Reach the marina by phone, WhatsApp or VHF Channel 16 — or send an inquiry.",
    images: ["/images/hero-marina-aerial.jpg"],
  },
};

export default async function ContactPage() {
  const contactSettings = await getPublicContactSettings();
  const phoneHref = (value: string) => `tel:${value.replace(/[^0-9+]/g, "")}`;
  const channels = [
    {
      icon: Phone,
      label: "Hotel & Marina",
      value: contactSettings.marinaPhone,
      href: phoneHref(contactSettings.marinaPhone),
      note: "Hotel, dockage, fuel & general inquiries",
      iconStyle: "bg-ivory-100 text-gold-700",
    },
    {
      icon: Mail,
      label: "Email",
      value: contactSettings.businessEmail,
      href: `mailto:${contactSettings.businessEmail}`,
      note: "General inquiries",
      iconStyle: "bg-[#edf3f2] text-[#315c57]",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: contactSettings.whatsappLabel,
      href: contactSettings.whatsappNumber
        ? `https://wa.me/${contactSettings.whatsappNumber}`
        : null,
      note: "Quick messages, any topic",
      iconStyle: "bg-[#eaf4ee] text-[#26734a]",
    },
    {
      icon: Radio,
      label: "On the Water",
      value: contactSettings.vhfChannel,
      href: null,
      note: "Hail the dock office on approach",
      iconStyle: "bg-[#eaf1f5] text-[#426b82]",
    },
  ];
  return (
    <>
      <PageHero
        overline="Contact & Location"
        title="Talk to the team"
        lede="Questions about dockage, stays, fuel or the gift shop — reach us by phone, email, WhatsApp, VHF or the form below."
        image="/images/contact-hero.jpg"
        imageAlt="Aerial view of Elizabeth Harbour and the marina at Exuma Yacht Club"
      />

      {/* Channels */}
      <section aria-labelledby="channels-heading" className="py-16 lg:py-20">
        <Container>
          <h2 id="channels-heading" className="sr-only">
            Contact channels
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel, i) => (
              <Reveal key={channel.label} delay={i * 60} className="h-full">
                <article className="group relative flex h-full min-h-56 flex-col overflow-hidden border border-sand-300 border-t-2 border-t-gold-500 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-navy-800 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid h-12 w-12 place-items-center transition-transform duration-300 group-hover:scale-105 ${channel.iconStyle}`}
                    >
                      <channel.icon
                        className="h-5 w-5"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="font-display text-sm text-sand-400">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-700">
                    {channel.label}
                  </h3>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      target={
                        channel.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        channel.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="mt-2 break-words font-display text-xl leading-snug text-navy-900 transition-colors hover:text-gold-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-600"
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <p className="mt-2 font-display text-xl leading-snug text-navy-900">
                      {channel.value}
                    </p>
                  )}
                  <p className="mt-auto border-t border-sand-200 pt-4 text-xs leading-relaxed text-ink-500">
                    {channel.note}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Form + map */}
      <section
        aria-labelledby="contact-form-heading"
        className="border-t border-sand-200 bg-ivory-100 py-16 lg:py-24"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <InquiryForm
                  kind="general"
                  id="contact-form"
                  heading="Send Us a Message"
                  subheading="We read every message personally and respond as soon as we can — typically within a day."
                />
              </Reveal>
              <h2 id="contact-form-heading" className="sr-only">
                Contact form
              </h2>
            </div>
            <div className="lg:col-span-5">
              <SectionHeading
                overline="Find Us"
                title="On Queen's Highway"
                lede={`${contactSettings.addressStreet}, ${contactSettings.addressLocality}, ${contactSettings.addressCountry}. ${contactSettings.addressPoBox}.`}
              />
              <Reveal delay={120} className="mt-8">
                <div className="flex items-start gap-3 text-sm leading-relaxed text-ink-700">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  <p>
                    On the George Town waterfront, directly across from the
                    grocery and liquor stores — approximately{" "}
                    {site.coordinates.display} on {site.coordinates.bodyOfWater}
                    .
                  </p>
                </div>
              </Reveal>
              {!isPlaceholder(contactSettings.googleMapsUrl) && (
                <Reveal delay={180} className="mt-6">
                  <a
                    href={contactSettings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-navy-900 bg-navy-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory-50 hover:bg-transparent hover:text-navy-900"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Get Directions
                  </a>
                </Reveal>
              )}
              <Reveal delay={160} className="mt-8">
                <div className="overflow-hidden border border-sand-300 bg-white">
                  <iframe
                    title="Map showing Exuma Yacht Club on Queen's Highway, George Town, Great Exuma"
                    src={site.mapsEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[320px] w-full border-0"
                    allowFullScreen
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
