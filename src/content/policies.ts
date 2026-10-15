/**
 * POLICY TEXT — CLIENT TO SUPPLY.
 * ────────────────────────────────────────────────────────────────────────
 * Each policy below renders a clearly visible PLACEHOLDER until the client
 * provides approved legal text. Do NOT draft legal language here — when the
 * client supplies a policy, paste it into `body` (array of paragraphs).
 * The placeholder banner is removed automatically once `isPlaceholder`
 * is set to false.
 */
export type PolicyContent = {
  slug: string;
  overline: string;
  title: string;
  intro: string;
  isPlaceholder: boolean;
  body: string[];
};

export const policies: Record<string, PolicyContent> = {
  privacy: {
    slug: "privacy",
    overline: "Legal",
    title: "Privacy Policy",
    intro: "How Exuma Yacht Club collects, uses and protects the personal information you share through this website.",
    isPlaceholder: true,
    body: [
      "PLACEHOLDER — client to supply this policy. The final text should explain what personal information the website collects (inquiry forms, orders, cart data stored in the visitor's browser), how it is used, how it is stored, the visitor's rights (access, correction, deletion), and contact details for privacy requests.",
    ],
  },
  terms: {
    slug: "terms",
    overline: "Legal",
    title: "Terms & Conditions",
    intro: "The terms governing use of the Exuma Yacht Club website, including inquiries, orders and website content.",
    isPlaceholder: true,
    body: [
      "PLACEHOLDER — client to supply this policy. The final text should cover the informational nature of the website, that inquiries are not confirmed bookings until the team confirms them, gift shop order terms, acceptable use, intellectual property, liability and governing law.",
    ],
  },
  shipping: {
    slug: "shipping",
    overline: "Gift Shop",
    title: "Shipping & Returns",
    intro: "How Exuma Yacht Club gift shop orders are collected, shipped on request, and returned or exchanged.",
    isPlaceholder: true,
    body: [
      "PLACEHOLDER — client to supply this policy. The final text should state the pickup procedure and hold period for Collect at the dock orders, how shipping quotes are arranged, who pays shipping and duties, delivery time expectations, and the rules and timeframes for returns and exchanges with proof of purchase.",
    ],
  },
  "booking-cancellation": {
    slug: "booking-cancellation",
    overline: "Legal",
    title: "Booking & Cancellation Policy",
    intro: "The terms that apply to dockage reservations, accommodation bookings and restaurant reservations.",
    isPlaceholder: true,
    body: [
      "PLACEHOLDER — client to supply this policy. The final text should state deposit and confirmation requirements, how far in advance cancellations must be made for dockage, rooms and restaurant bookings, any fees for late cancellation or no-show, and how cancellations are requested.",
    ],
  },
};
