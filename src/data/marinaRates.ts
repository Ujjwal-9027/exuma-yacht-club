/**
 * MARINA RATES — EDIT HERE.
 * Leave the array EMPTY until the dock office supplies current rates.
 * The rates section on /marina is hidden automatically while this is empty,
 * so no unverified pricing is ever published.
 *
 * Example shape (uncomment and edit once rates are approved):
 * export const marinaRates: MarinaRate[] = [
 *   { label: "Dockage — daily", rate: "$X.XX / ft / night", note: "Power & water extra" },
 *   { label: "Dockage — weekly", rate: "$X.XX / ft / night" },
 *   { label: "Fresh water", rate: "$X.XX / gallon" },
 * ];
 */
export type MarinaRate = {
  label: string;
  rate: string;
  note?: string;
};

export const marinaRates: MarinaRate[] = [];
