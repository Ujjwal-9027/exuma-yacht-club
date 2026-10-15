import type { Metadata } from "next";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "How Exuma Yacht Club gift shop orders are collected, shipped on request, and returned or exchanged.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return <PolicyPage policy={policies.shipping} />;
}
