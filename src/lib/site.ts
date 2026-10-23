/**
 * Client-confirmed business information for Exuma Yacht Club Resort and Marina.
 */
export const site = {
  name: "Exuma Yacht Club Resort and Marina",
  shortName: "Exuma Yacht Club",
  tagline: "Marina · Stay · Waterfront dining · George Town, Exuma",
  description:
    "A marina and resort on Elizabeth Harbour in George Town, Great Exuma — dockage, island stays and waterfront dining.",
  url: "https://www.exumayachtclub.net",
  address: {
    street: "Queen's Highway",
    locality: "George Town, Great Exuma",
    country: "The Bahamas",
    poBox: "P.O. Box EX-29173, George Town, Great Exuma",
  },
  phone: {
    label: "+1 (242) 828-6973",
    href: "tel:+12428286973",
    note: "Hotel & marina",
  },
  whatsapp: {
    label: "+1 (242) 828-6973",
    href: "https://wa.me/12428286973",
  },
  email: {
    label: "info@exumayachtclub.net",
    href: "mailto:info@exumayachtclub.net",
  },
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
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Marina", href: "/marina" },
  { label: "Stay", href: "/stay" },
  { label: "Dining", href: "/dining" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
] as const;
