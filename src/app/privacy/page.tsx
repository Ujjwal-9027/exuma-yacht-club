import type { Metadata } from "next";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Exuma Yacht Club Resort and Marina uses information submitted through its website, enquiries and merchandise orders.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <PolicyPage policy={policies.privacy} />;
}
