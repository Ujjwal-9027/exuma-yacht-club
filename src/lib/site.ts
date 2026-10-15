/**
 * Verified business information for Exuma Yacht Club & Marina.
 * Sources: official website (exumayachtclub.net), Waterway Guide,
 * public marina listings. Anything not yet confirmed by the client is
 * intentionally omitted (e.g. public business email, fuel prices).
 */
export const site = {
  name: "Exuma Yacht Club & Marina",
  shortName: "Exuma Yacht Club",
  tagline: "Marina · Stay · Dining · George Town, Exuma",
  description:
    "A boutique marina and hotel on Elizabeth Harbour in George Town, Great Exuma — dockage, fuel, island stays, waterfront dining and a gift shop.",
  url: "https://www.exumayachtclub.net",
  address: {
    street: "Queen's Highway",
    locality: "George Town, Great Exuma",
    country: "The Bahamas",
    poBox: "P.O. Box EX-29173, George Town, Great Exuma",
  },
  phone: {
    label: "+1 (242) 336-2578",
    href: "tel:+12423362578",
    note: "Marina & dock office",
  },
  restaurantPhone: {
    label: "+1 (242) 336-2579",
    href: "tel:+12423362579",
    note: "Restaurant & bar",
  },
  whatsapp: {
    label: "+1 (242) 825-6973",
    href: "https://wa.me/12428256973",
  },
  /** Public business email is pending client confirmation. */
  email: null as null | { label: string; href: string },
  vhf: "VHF Channel 16",
  coordinates: {
    lat: 23.5041,
    lng: -75.7681,
    display: "23°30.2′ N · 75°46.0′ W",
    bodyOfWater: "Elizabeth Harbour",
  },
  mapsEmbed:
    "https://www.google.com/maps?q=Exuma%20Yacht%20Club%2C%20Queen's%20Highway%2C%20George%20Town%2C%20Bahamas&output=embed",
  googleMapsReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=Exuma+Yacht+Club+%26+Marina%2C+George+Town%2C+Bahamas",
  marina: {
    maxLoa: "Vessels up to 120 ft",
    depth: "Approx. 7 ft at high water",
    dockage: "± 4,000 linear feet of dockage",
    protection: "Breakwater-protected harbour",
    services: ["Shore power", "Fresh water", "Fuel pier — gas & diesel", "VHF Channel 16"],
    townNote:
      "Set on the waterfront in the heart of George Town — grocery and liquor stores are directly across the street.",
  },
  restaurant: {
    name: "The Restaurant & Bar at Exuma Yacht Club",
    cuisine: "Caribbean cuisine with an international twist",
    hoursNote: "Typically open Monday–Saturday · Closed Sundays",
    hoursDisclaimer:
      "Hours change with the season — please call ahead to confirm before your visit.",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Marina", href: "/marina" },
  { label: "Stay", href: "/stay" },
  { label: "Dining", href: "/dining" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
] as const;
