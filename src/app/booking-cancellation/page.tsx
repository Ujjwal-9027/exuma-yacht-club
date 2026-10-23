import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { getManagedSiteSettings } from "@/lib/managed-site";
import { isPlaceholder } from "@/config/site";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "External Booking Terms",
  description:
    "Review booking, payment and cancellation terms on the external platform used for your Exuma Yacht Club reservation.",
  alternates: { canonical: "/booking-cancellation" },
};

export default async function BookingCancellationPage() {
  const settings = await getManagedSiteSettings();
  const bookingPlatforms = [
    {
      label: "Hotel reservations — ResNexus",
      url: settings.resnexusBookingUrl,
    },
    { label: "Marina dockage — Dockwa", url: settings.dockwaUrl },
  ].filter((platform) => !isPlaceholder(platform.url));

  return (
    <>
      <PageHero
        overline="Booking Information"
        title="External booking terms"
        lede="Booking, payment and cancellation terms are set by the external platform used to make your reservation."
        image="/images/hero-marina-aerial.jpg"
        imageAlt="Aerial view of the marina at Exuma Yacht Club"
      />
      <section className="py-14 lg:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="border border-sand-300 bg-white p-7 sm:p-10">
              <h2 className="font-display text-2xl text-navy-900">
                Before you book
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                Review the provider&apos;s booking, payment and cancellation
                terms before confirming. Exuma Yacht Club does not publish
                separate hotel or marina cancellation rules. For an existing
                reservation, use the platform where you made the booking.
              </p>
              {bookingPlatforms.length > 0 && (
                <ul className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {bookingPlatforms.map((platform) => (
                    <li key={platform.label}>
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-navy-900 bg-navy-900 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900"
                      >
                        {platform.label}
                        <ExternalLink
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
