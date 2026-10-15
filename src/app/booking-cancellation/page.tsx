import type { Metadata } from "next";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Booking & Cancellation Policy",
  description:
    "The terms that apply to dockage reservations, accommodation bookings and restaurant reservations at Exuma Yacht Club.",
  alternates: { canonical: "/booking-cancellation" },
};

export default function BookingCancellationPage() {
  return <PolicyPage policy={policies["booking-cancellation"]} />;
}
