/**
 * RESTAURANT INFO — EDIT HERE.
 * Hours change with the season: keep `hoursDisclaimer` visible so guests
 * are always advised to call ahead. Confirm with the restaurant before
 * publishing specific times.
 */
export const restaurantInfo = {
  /** One line per row in the hours block. */
  hoursLines: [
    { days: "Monday – Saturday", hours: "Typically open — call to confirm times" },
    { days: "Sunday", hours: "Closed" },
  ],
  hoursDisclaimer:
    "Hours change with the season — please call ahead to confirm before your visit.",
  confirmationNote:
    "Reservations sent through this form are requests only — your table is confirmed once the restaurant replies to you directly.",
  locationNote:
    "On the upper level of Exuma Yacht Club, Queen's Highway, George Town — overlooking the marina and Elizabeth Harbour.",
} as const;
