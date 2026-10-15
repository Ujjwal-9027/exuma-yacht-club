import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { getManagedSiteSettings } from "@/lib/managed-site";
import { ContentForm } from "./content-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Website content",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  const settings = await getManagedSiteSettings();
  return (
    <AdminShell title="Website content">
      <ContentForm values={settings} />
    </AdminShell>
  );
}
