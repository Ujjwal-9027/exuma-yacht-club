/**
 * ────────────────────────────────────────────────────────────────────────
 *  INTEGRATION CONFIG — THE ONE FILE FOR EXTERNAL LINKS & KEYS
 * ────────────────────────────────────────────────────────────────────────
 *  Paste the real values the client supplies here. Anything containing
 *  "PLACEHOLDER" is treated as NOT CONFIGURED: buttons render disabled
 *  and forms fall back to the inquiry flow, so nothing links to a broken
 *  page. Public (non-secret) values only — secrets belong in .env.local
 *  (see .env.example).
 */

export const config = {
  /** Verified ResNexus property booking URL. */
  resnexusBookingUrl:
    "https://resnexus.com/resnexus/reservations/book/A717C5EC-9A2E-43AD-9368-1C5B6A10C9AD/?NewSearch=1",

  /** Verified Dockwa marina destination. */
  dockwaUrl:
    "https://dockwa.com/explore/destination/4qcvwr-exuma-yacht-club?form=transient",

  /** WhatsApp click-to-chat number, digits only, with country code. */
  whatsappNumber: "12428256973",

  /** Default pre-filled WhatsApp message (URL-encoded automatically). */
  whatsappDefaultMessage:
    "Hello Exuma Yacht Club — I have a question about my visit.",

  /** Public Google Maps share/directions URL (NOT the embed — the embed is set in src/lib/site.ts). */
  googleMapsUrl: "https://PLACEHOLDER-maps-link",

  /** Social profile URLs (leave as PLACEHOLDER until verified). */
  social: {
    facebook: "PLACEHOLDER",
    instagram: "PLACEHOLDER",
    tripadvisor: "PLACEHOLDER",
  },
} as const;

/** True when a value is missing or still a placeholder. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || value.includes("PLACEHOLDER");
}

/** Builds a WhatsApp click-to-chat URL with a pre-filled message. */
export function waLink(message: string = config.whatsappDefaultMessage): string {
  if (isPlaceholder(config.whatsappNumber)) return "";
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
