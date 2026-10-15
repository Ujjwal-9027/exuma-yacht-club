import type { Metadata } from "next";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing use of the Exuma Yacht Club website, including inquiries, orders and website content.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <PolicyPage policy={policies.terms} />;
}
