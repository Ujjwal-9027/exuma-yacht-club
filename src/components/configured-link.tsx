import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { isPlaceholder } from "@/config/site";

/**
 * Renders an external booking button when the URL is configured in
 * src/config/site.ts. While the URL is still a PLACEHOLDER, the button
 * renders disabled with a note and a fallback link to the inquiry flow —
 * so nothing ever links to a broken page.
 */
export function ConfiguredBookingLink({
  url,
  label,
  fallbackHref = "/contact",
  className = "",
  id,
}: {
  url: string;
  label: string;
  fallbackHref?: string;
  className?: string;
  id?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 border px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors";

  if (isPlaceholder(url)) {
    return (
      <span className={className}>
        <span
          id={id}
          aria-disabled="true"
          title="Booking link not configured yet"
          className={`${base} cursor-not-allowed border-sand-300 bg-sand-200/60 text-ink-400`}
        >
          {label}
        </span>
        <span className="mt-2 block text-xs text-ink-400">
          Direct booking opens soon —{" "}
          <Link
            href={fallbackHref}
            className="font-semibold text-navy-900 underline decoration-gold-500 underline-offset-4 hover:text-gold-600"
          >
            make an inquiry
          </Link>{" "}
          for now.
        </span>
      </span>
    );
  }

  return (
    <a
      id={id}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} border-gold-500 bg-gold-500 text-navy-950 hover:border-gold-400 hover:bg-gold-400 ${className}`}
    >
      {label}
      <ExternalLink className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}
