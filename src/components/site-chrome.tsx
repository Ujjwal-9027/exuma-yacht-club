"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { PublicContactSettings } from "@/lib/managed-site";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteChrome({
  children,
  contactSettings,
}: {
  children: ReactNode;
  contactSettings: PublicContactSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {!isAdmin && <SiteHeader />}
      <main id="main">{children}</main>
      {!isAdmin && <SiteFooter contactSettings={contactSettings} />}
    </>
  );
}
