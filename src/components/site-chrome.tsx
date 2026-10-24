"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { PublicContactSettings } from "@/lib/managed-site";
import { PageLoadingOverlay } from "@/components/page-loading-overlay";
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
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    let navigationTimer: number | null = null;
    let resetTimer: number | null = null;

    function handleNavigationClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self") ||
        anchor.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      if (navigationTimer) window.clearTimeout(navigationTimer);
      if (resetTimer) window.clearTimeout(resetTimer);
      navigationTimer = window.setTimeout(() => {
        setPendingPath(destination.pathname);
        resetTimer = window.setTimeout(() => {
          setPendingPath((currentPath) =>
            currentPath === destination.pathname ? null : currentPath,
          );
        }, 15_000);
      }, 120);
    }

    document.addEventListener("click", handleNavigationClick, true);
    return () => {
      document.removeEventListener("click", handleNavigationClick, true);
      if (navigationTimer) window.clearTimeout(navigationTimer);
      if (resetTimer) window.clearTimeout(resetTimer);
    };
  }, []);

  const showLoading = pendingPath !== null && pendingPath !== pathname;

  return (
    <>
      {showLoading && <PageLoadingOverlay />}
      {!isAdmin && <SiteHeader />}
      <main id="main">{children}</main>
      {!isAdmin && <SiteFooter contactSettings={contactSettings} />}
    </>
  );
}
