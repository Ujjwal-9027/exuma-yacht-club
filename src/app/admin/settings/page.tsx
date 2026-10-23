import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { SettingsForm } from "./settings-form";
import { PasswordResetForm } from "./password-reset-form";
import { getManagedSiteSettings } from "@/lib/managed-site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Website settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const settings = await getManagedSiteSettings();
  const params = await searchParams;
  return (
    <AdminShell title="Website settings">
      <div className="mb-6 max-w-2xl">
        <p className="text-sm leading-relaxed text-ink-500">
          Manage the public booking links, contact channel, and basic metadata
          supported by the current website. Changes are stored in MongoDB and
          revalidated after saving.
        </p>
      </div>
      {params.saved === "1" && (
        <p
          role="status"
          className="mb-6 border border-green-700/30 bg-green-50 p-4 text-sm text-green-900"
        >
          Settings saved.
        </p>
      )}
      <SettingsForm values={settings} />
      <PasswordResetForm />
    </AdminShell>
  );
}
