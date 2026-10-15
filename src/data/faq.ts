/**
 * FAQ — EDIT HERE.
 * Answers only contain facts already published on this site. Anything the
 * client hasn't confirmed is answered with "contact the team" rather than
 * invented detail. This data also generates the FAQPage JSON-LD, so keep
 * answers plain-text truthful.
 */
export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "What size vessels can the marina accommodate?",
    answer:
      "The marina accommodates vessels up to 120 ft LOA, with approximately 7 ft of depth at high water and breakwater protection on Elizabeth Harbour.",
  },
  {
    question: "How do I reserve a slip?",
    answer:
      "Check the marina's Dockwa booking option when configured, or contact the dock office directly by phone or VHF Channel 16. Availability and rates are confirmed with the team.",
  },
  {
    question: "Is fuel available at the marina?",
    answer:
      "Yes — gas and diesel are available at the club's fuel pier, with fresh water alongside. Contact the dock office for current availability and hours before you set out.",
  },
  {
    question: "How do I book a room?",
    answer:
      "Use the inquiry form on the Stay page with your dates, or choose Book Now where a booking link is configured. An inquiry is not a confirmed reservation — the team confirms availability and rates directly with you.",
  },
  {
    question: "What are the restaurant's opening hours?",
    answer:
      "The restaurant is typically open Monday through Saturday and closed on Sundays, but hours change with the season. Please call ahead to confirm before your visit.",
  },
  {
    question: "Can I order gift shop items online?",
    answer:
      "Yes. Add items to your cart and check out — no online payment is taken. Choose Collect at the dock to pick up at the marina gift shop, or Ship to have the team quote shipping separately.",
  },
  {
    question: "Is the club close to town and provisioning?",
    answer:
      "Yes. The club is on Queen's Highway in the heart of George Town — grocery and liquor stores are directly across the street.",
  },
  {
    question: "How do I get to Exuma?",
    answer:
      "Fly into Exuma International Airport (GGT) and take a taxi to George Town, or arrive by boat into Elizabeth Harbour and hail the dock office on VHF Channel 16. See the Getting Here page for details.",
  },
];
