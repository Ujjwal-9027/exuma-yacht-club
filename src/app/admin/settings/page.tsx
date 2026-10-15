import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { SettingsForm } from "./settings-form";
import { getManagedSiteSettings } from "@/lib/managed-site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Website settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getManagedSiteSettings();
  return (
    <AdminShell title="Website settings">
      <div className="mb-6 max-w-2xl">
        <p className="text-sm leading-relaxed text-ink-500">
          Manage the public booking links, contact channel, and basic metadata
          supported by the current website. Changes are stored in MongoDB and
          revalidated after saving.
        </p>
      </div>
      <SettingsForm values={settings} />
    </AdminShell>
  );
}
