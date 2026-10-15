/**
 * RESTAURANT MENU — EDIT HERE.
 * All items below are PLACEHOLDER entries demonstrating the menu layout.
 * The restaurant must supply the real menu before launch. Set
 * `menuIsPlaceholder` to false once the real menu is entered (this removes
 * the on-page "sample menu" banner). Prices are optional — omit `price`
 * for items priced at market or on request.
 */
export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
};

export type MenuCategory = {
  name: string;
  note?: string;
  items: MenuItem[];
};

/** True while the menu below is sample content. */
export const menuIsPlaceholder = true;

export const menuCategories: MenuCategory[] = [
  {
    name: "Starters",
    note: "PLACEHOLDER category",
    items: [
      {
        name: "PLACEHOLDER starter — replace with real dish",
        description: "Short description of the dish appears here.",
      },
      {
        name: "PLACEHOLDER starter — replace with real dish",
        description: "Short description of the dish appears here.",
      },
    ],
  },
  {
    name: "Mains",
    note: "PLACEHOLDER category",
    items: [
      {
        name: "PLACEHOLDER main — replace with real dish",
        description: "Short description of the dish appears here.",
      },
      {
        name: "PLACEHOLDER main — replace with real dish",
        description: "Short description of the dish appears here.",
      },
    ],
  },
  {
    name: "Desserts & Drinks",
    note: "PLACEHOLDER category",
    items: [
      {
        name: "PLACEHOLDER item — replace with real offering",
        description: "Short description appears here.",
      },
    ],
  },
];
