import type { Metadata } from "next";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Shipping, delivery, returns and exchange information for Exuma Yacht Club merchandise orders.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return <PolicyPage policy={policies.shipping} />;
}
