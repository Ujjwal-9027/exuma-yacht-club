/**
 * CONTENT PAGE COPY — EDIT HERE.
 * Text for /about, /destination, /attractions and /getting-here lives in
 * this single file so the client can edit wording without touching JSX.
 * Where the client still needs to confirm a fact, the copy says so instead
 * of inventing one.
 */

export const aboutContent = {
  heroLede:
    "A working marina, a boutique hotel, a waterfront restaurant and bar planned for December 2026, and a gift shop — on the water's edge in George Town, the capital of the Exumas.",
  sections: [
    {
      title: "On the George Town waterfront",
      body: "Exuma Yacht Club sits on Elizabeth Harbour in the heart of George Town — the main settlement of Great Exuma. The marina offers breakwater-protected dockage for vessels up to 120 ft, with shore power, fresh water and a fuel pier. The club also offers accommodation and a gift shop, with a newly renovated waterfront restaurant and bar expected to open in December 2026.",
    },
    {
      title: "Newly renovated",
      body: "Both the marina and the hotel have been newly renovated, adding modern comforts to a location that has welcomed cruising yachts to George Town for decades.",
    },
    {
      title: "Part of the cruising community",
      body: "George Town is one of the best-known cruising stops in the Bahamas, and the club has long been a gathering point for sailors working their way down the Exuma chain — steps from provisioning, fuel and the famous harbour life of Elizabeth Harbour.",
    },
    {
      title: "Our team",
      body: "PLACEHOLDER — the client will supply a short introduction to the team (dockmaster, hotel and restaurant staff) before launch.",
    },
  ],
} as const;

export const destinationContent = {
  heroLede:
    "365 islands and cays, water in a dozen shades of blue, and some of the most celebrated cruising grounds on earth — this is Exuma.",
  sections: [
    {
      title: "The Exuma Cays",
      body: "The Exumas are a chain of 365 islands and cays in the central Bahamas, stretching roughly 120 miles from Sail Rocks in the north to Little Exuma in the south. Great Exuma, where the club is located, is the largest island and home to the main settlement, George Town.",
    },
    {
      title: "George Town & Elizabeth Harbour",
      body: "George Town wraps around Elizabeth Harbour, a broad, protected natural harbour that has made it the cruising hub of the Exumas. Across the harbour lies Stocking Island, with its beaches, trails and beach bars a short boat ride away.",
    },
    {
      title: "The water",
      body: "Exuma is famous for the clarity and colour of its water — shallow sandbanks, tidal creeks and deeper channels in shifting shades of turquoise and blue. The Exuma Cays Land and Sea Park, at the northern end of the chain, is one of the oldest marine protected areas in the world.",
    },
    {
      title: "The Bahamas",
      body: "The Bahamas is an independent island nation of around 700 islands in the Atlantic, south-east of Florida. English is the official language, the Bahamian dollar is pegged one-to-one with the US dollar (both are accepted everywhere), and the climate is warm year-round with a busier, drier season from November to April.",
    },
  ],
} as const;

export type Attraction = {
  name: string;
  description: string;
  note?: string;
};

export const attractions: Attraction[] = [
  {
    name: "Swimming Pigs at Big Major Cay",
    description:
      "Exuma's most famous residents — a colony of swimming pigs that paddle out to greet boats at Big Major Cay in the central cays.",
    note: "Reached on organised boat tours; ask the team about local operators.",
  },
  {
    name: "Stocking Island",
    description:
      "The long barrier island directly across Elizabeth Harbour — beaches, walking trails and well-known beach bars, minutes away by boat.",
  },
  {
    name: "Chat 'N' Chill",
    description:
      "The legendary beach bar and grill on Stocking Island, famous for its conch bar and Sunday roasts.",
  },
  {
    name: "Thunderball Grotto",
    description:
      "A tidal cave near Staniel Cay where you can snorkel inside a hollow rock island — named for the James Bond film shot there.",
    note: "Usually visited on full-day boat tours.",
  },
  {
    name: "Exuma Cays Land and Sea Park",
    description:
      "A vast protected area at the northern end of the cays with pristine reefs, anchorages and trails — no fishing, all wonder.",
  },
  {
    name: "Tropic of Cancer Beach",
    description:
      "A celebrated beach on Little Exuma, crossed by the Tropic of Cancer itself — white sand and shallow clear water.",
  },
  {
    name: "George Town Harbour Life",
    description:
      "Regattas, the famous winter cruising community, and the straw market and shops of George Town — the social heart of the Exumas.",
  },
];

export const gettingHereContent = {
  heroLede:
    "Whether you arrive under sail, by air or by road, here's how to find us on Queen's Highway in George Town.",
  bySea: {
    title: "By sea",
    body: "Enter Elizabeth Harbour through one of its marked cuts and hail the dock office on VHF Channel 16 as you approach. The club sits on the George Town waterfront at approximately 23°30.2′ N, 75°46.0′ W — charts and cruising guides list Exuma Yacht Club as a well-known harbour landmark.",
  },
  byAir: {
    title: "By air",
    body: "Fly into Exuma International Airport (airport code GGT), the island's only airport. Regional and international connections operate via Nassau, Florida and other hubs — schedules vary by season, so check with your airline or travel agent for current routings.",
  },
  byRoad: {
    title: "Taxi from the airport",
    body: "Taxis meet arriving flights at the airport terminal. The drive to George Town and the club on Queen's Highway takes roughly 15–20 minutes. Ask for Exuma Yacht Club — every driver knows it.",
  },
} as const;
