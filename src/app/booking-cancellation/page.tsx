import type { Metadata } from "next";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";
import { getManagedSiteSettings } from "@/lib/managed-site";
import { config } from "@/config/site";

export const metadata: Metadata = {
  title: "Booking & Cancellation",
  description:
    "Information about accommodation and marina booking providers, reservation changes and cancellations at Exuma Yacht Club.",
  alternates: { canonical: "/booking-cancellation" },
};

export default async function BookingCancellationPage() {
  const settings = await getManagedSiteSettings();
  return (
    <PolicyPage
      policy={policies["booking-cancellation"]}
      bookingUrls={{
        resnexus: config.resnexusBookingUrl,
        dockwa: settings.dockwaUrl,
      }}
    />
  );
}
