import type { Metadata } from "next";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms for using the Exuma Yacht Club Resort and Marina website and its merchandise ordering features.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <PolicyPage policy={policies.terms} />;
}
