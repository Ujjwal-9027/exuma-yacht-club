# Policy publication review

Internal checklist only. This file is not part of the public website. The policy pages are implemented, but these business and legal items need owner confirmation before they are treated as approved or final.

## Privacy and website operation

- Confirm the effective date and have the business review the privacy wording.
- Recheck the deployed site for analytics, advertising tags, embedded services and any cookie-consent obligations; the current source includes Google Maps embeds, cart local storage and an administrator authentication cookie, but no analytics or advertising tags were found.
- Confirm service-provider and data-retention descriptions against the production hosting, database and email configuration.
- Confirm whether any registered legal entity name should be added. None is stated in the public copy.

## Merchandise orders and shipping

- Confirm supported destinations. The checkout accepts a country field, but worldwide fulfilment is not established by that interface.
- Confirm shipping prices and eligibility. Current checkout code displays free delivery for qualifying Miami, Florida ZIP codes and $8 standard / $12 priority elsewhere; approve, correct or remove those public checkout figures before publication.
- Confirm order processing times, delivery estimates, carrier/dispatch process and whether tracking is available for each shipment.
- Confirm responsibility for customs duties, import taxes and other destination charges.
- Approve or replace the proposed seven-day return window; confirm return eligibility, exclusions, proof-of-purchase requirements and the process for damaged, defective or incorrect items.
- Confirm refund and exchange conditions, refund method/timing and who pays return shipping, subject to applicable consumer law.
- Confirm collection-at-the-dock arrangements, including any collection window or hold period.

## Payments, bookings and legal review

- Confirm the production payment setup. The default code provider is manual/pay-at-pickup; the visible PayPal/card interaction is explicitly a demo and does not take real payment. Do not describe the demo as live payment processing.
- Confirm that the ResNexus and Dockwa URLs remain correct for the live property/account. The currently configured URLs were checked in `src/config/site.ts`.
- Confirm who operates the restaurant and handles reservations; public copy deliberately does not state that Exuma Yacht Club manages them.
- Have qualified counsel review the terms, privacy and consumer-facing return language, including any applicable jurisdiction and non-waivable rights. No governing law or legal approval is claimed in the public copy.