import { config } from "@/config/site";

export type Room = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  amenities: string[];
  images: { src: string; alt: string }[];
  resnexusUrl?: string;
};

const temporaryImage = {
  src: "/images/stay-room.jpg",
  alt: "Temporary accommodation image — room-specific photography pending approval",
};

const sharedBookingUrl = config.resnexusBookingUrl;

const suiteAmenities = [
  "Individually controlled air conditioning",
  "Private bathroom",
  "Ceiling fan",
  "Mini-refrigerator",
  "Ocean view",
  "Shower only",
  "TV",
  "Closets in room",
  "Balcony/Lanai/Terrace",
  "Instant hot water",
  "Color television",
  "Complimentary high speed internet in room",
  "Outdoor space",
  "Cups/glassware",
  "Fire alarm",
  "High ceilings",
  "High Definition (HD) Flat Panel Television - 32 inches or greater",
  "High speed wireless",
  "Lamp",
  "Non-smoking",
  "Remote control television",
  "Sitting area",
  "Storage space",
];

const roomAmenities = [
  "Individually controlled air conditioning",
  "Private bathroom",
  "Mini-refrigerator",
  "Ceiling fan",
  "Shower only",
  "Balcony/Lanai/Terrace",
  "TV",
  "Closets in room",
  "Instant hot water",
  "Color television",
  "Complimentary high speed internet in room",
  "Outdoor space",
  "Fire alarm",
  "High ceilings",
  "High Definition (HD) Flat Panel Television - 32 inches or greater",
  "High speed wireless",
  "Lamp",
  "Non-smoking",
  "Remote control television",
  "Storage space",
];

export const rooms: Room[] = [
  {
    slug: "presidential-suite",
    name: "Presidential Suite",
    shortDescription:
      "Review the Presidential Suite's current details, availability and rates through ResNexus.",
    longDescription:
      "Please use the official ResNexus listing for the Presidential Suite's current description, capacity, amenities, availability and rates.",
    amenities: [],
    images: [temporaryImage],
    resnexusUrl: sharedBookingUrl,
  },
  {
    slug: "eyc-3",
    name: "EYC 3",
    shortDescription:
      "Spacious one King Bedroom Suite, facing north with water and garden views and a guest-only deck.",
    longDescription:
      "EYC 3 is a spacious and largest King Bedroom Suite, facing north with water and garden views. It includes an in-room microwave and mini-fridge, with access to a guest-only deck.",
    amenities: [
      ...suiteAmenities,
      "King bed",
      "Microwave",
      "Guest-only deck",
    ],
    images: [temporaryImage],
    resnexusUrl: sharedBookingUrl,
  },
  {
    slug: "eyc-4",
    name: "EYC 4",
    shortDescription:
      "One Queen Bedroom Suite facing north with water and garden views, a guest-only deck, and in-room microwave and mini-fridge.",
    longDescription:
      "EYC 4 is a one Queen Bedroom Suite. It faces north with water and garden views and is the second-largest suite, with a Queen bed, in-room microwave, mini-fridge and guest-only deck.",
    amenities: [
      "Queen bed",
      "Ocean view",
      "Private bathroom",
      "Individually controlled air conditioning",
      "Mini-refrigerator",
      "Ceiling fan",
      "Shower only",
      "TV",
      "Closets in room",
      "Balcony/Lanai/Terrace",
      "Microwave",
      "Coffee/Tea maker",
      "Instant hot water",
      "Color television",
      "Complimentary high speed internet in room",
      "Outdoor space",
      "Cups/glassware",
      "Fire alarm",
      "High ceilings",
      "High Definition (HD) Flat Panel Television - 32 inches or greater",
      "High speed wireless",
      "Lamp",
      "Non-smoking",
      "Remote control television",
      "Sitting area",
      "Storage space",
      "Water and garden views",
      "Guest-only deck",
      "Pet-friendly",
    ],
    images: [temporaryImage],
    resnexusUrl: sharedBookingUrl,
  },
  {
    slug: "eyc-5",
    name: "EYC 5",
    shortDescription:
      "One Queen Bedroom Suite with east-facing water and marina views and a large deck overlooking the marina.",
    longDescription:
      "EYC 5 is a one Queen Bedroom Suite with water and marina views facing east. It opens to a large deck overlooking the marina and includes an in-room mini-fridge.",
    amenities: [
      ...suiteAmenities,
      "Queen bed",
      "Large marina-facing deck",
    ],
    images: [temporaryImage],
    resnexusUrl: sharedBookingUrl,
  },
  ...[6, 7, 8, 9].map((number) => ({
    slug: `eyc-${number}`,
    name: `EYC ${number}`,
    shortDescription:
      "One Queen Bedroom with Private Bathroom, south-facing with deck access and a partial water view.",
    longDescription:
      `EYC ${number} is a Queen Bedroom with Private Bathroom. This cozy room is south-facing with a partial water view and deck access, and includes complimentary toiletries and a mini-fridge.`,
    amenities: [
      ...roomAmenities,
      "Queen bed",
      "Deck access",
      "Complimentary toiletries",
      "Partial water view",
    ],
    images: [temporaryImage],
    resnexusUrl: sharedBookingUrl,
  })),
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((room) => room.slug === slug);
}
