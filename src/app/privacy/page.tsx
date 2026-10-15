import type { Metadata } from "next";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Exuma Yacht Club collects, uses and protects the personal information you share through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <PolicyPage policy={policies.privacy} />;
}
