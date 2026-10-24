export type PolicyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "internal-link"; href: string; label: string }
  | { type: "external-link"; href: string; label: string }
  | { type: "booking-link"; provider: "resnexus" | "dockwa"; label: string };

export type PolicyContent = {
  overline: string;
  title: string;
  intro: string;
  effectiveDate?: string;
  sections: { title: string; blocks: PolicyBlock[] }[];
};

export const policies: Record<string, PolicyContent> = {
  privacy: {
    overline: "Legal",
    title: "Privacy Policy",
    intro:
      "This policy describes how Exuma Yacht Club Resort and Marina handles information submitted through this website and its online shop.",
    effectiveDate: "24 October 2026",
    sections: [
      {
        title: "Who we are",
        blocks: [
          {
            type: "paragraph",
            text: "Exuma Yacht Club Resort and Marina is located at Queen's Highway, George Town, Great Exuma, The Bahamas. For privacy questions or requests, email info@exumayachtclub.net.",
          },
        ],
      },
      {
        title: "Information we collect",
        blocks: [
          {
            type: "paragraph",
            text: "The information collected depends on how you use the site. Our enquiry forms may ask for your name, email address, phone number and message. Stay enquiries can include party size and estimated arrival and departure dates. Dockage enquiries can include vessel name and length, dates and service requirements.",
          },
          {
            type: "paragraph",
            text: "A merchandise order may include your name, email, phone number, order items and options, quantities, notes, fulfilment choice and, for delivery, the address you provide. The system also creates an order reference and records order and payment status. The cart contents are saved in your browser's local storage so they remain available while you shop.",
          },
          {
            type: "paragraph",
            text: "The site uses basic security measures, including request rate limits and a hidden anti-spam field. Routine technical information may be processed to operate and protect the site. We do not ask for payment card details through the order form.",
          },
        ],
      },
      {
        title: "How we use information",
        blocks: [
          {
            type: "list",
            items: [
              "Respond to enquiries and provide requested information.",
              "Create and manage merchandise orders, fulfilment and customer service.",
              "Send enquiry or order-related messages, including order status and confirmation emails.",
              "Operate, maintain and secure the website and its services.",
              "Meet applicable legal obligations and address legitimate business records or disputes.",
            ],
          },
          {
            type: "paragraph",
            text: "We do not currently offer a newsletter, and enquiry or order details are not used to claim that you have subscribed to marketing messages.",
          },
        ],
      },
      {
        title: "Payments",
        blocks: [
          {
            type: "paragraph",
            text: "A live online payment gateway is not configured in the current site code. Orders use the default pay-at-pickup flow; the checkout also displays a clearly labelled demo payment interaction that states no real payment is taken. The site does not receive or store card credentials through that demo. If a live payment provider is later selected and integrated, this policy will be updated to describe the relevant processing before that feature is offered.",
          },
        ],
      },
      {
        title: "Hotel and marina booking services",
        blocks: [
          {
            type: "paragraph",
            text: "Accommodation bookings may be handled by ResNexus or another platform shown for a listing. Marina bookings may be handled through Dockwa. When you submit information on one of those platforms, the provider handles it under its own privacy terms. Please review those terms before continuing.",
          },
        ],
      },
      {
        title: "Cookies, local storage and analytics",
        blocks: [
          {
            type: "paragraph",
            text: "A review of the website source found no analytics or advertising tags and no newsletter signup. The shopping cart uses browser local storage, rather than an analytics cookie. An essential, HTTP-only cookie is used for administrator sign-in.",
          },
          {
            type: "paragraph",
            text: "Some pages embed Google Maps. Loading an embedded map may send connection and device information to Google, and Google's own technologies may operate under its terms. We do not control those technologies. The site's production configuration should be reviewed if analytics or other tracking is added.",
          },
        ],
      },
      {
        title: "Sharing and retention",
        blocks: [
          {
            type: "paragraph",
            text: "Information is shared with service providers that support website operation, data storage and email delivery, and with the relevant booking platform when you choose to use it. We do not sell enquiry or order information. Information is kept for as long as reasonably needed to respond, manage orders, maintain business records, protect the site and meet applicable obligations; no fixed retention period is stated here.",
          },
        ],
      },
      {
        title: "Security and privacy requests",
        blocks: [
          {
            type: "paragraph",
            text: "We use reasonable safeguards suited to the information and services involved, but no website or transmission method can be guaranteed completely secure. To ask about your information or request access, correction or deletion, email info@exumayachtclub.net. Requests will be handled subject to applicable law and any records we are required to retain.",
          },
        ],
      },
      {
        title: "Changes to this policy",
        blocks: [
          {
            type: "paragraph",
            text: "We may update this policy as the website and its services change. The effective date above identifies the current version. Material changes will be reflected on this page.",
          },
        ],
      },
    ],
  },
  terms: {
    overline: "Legal",
    title: "Terms & Conditions",
    intro:
      "These terms apply to your use of the Exuma Yacht Club Resort and Marina website and its merchandise ordering features.",
    sections: [
      {
        title: "1. Introduction and website use",
        blocks: [
          {
            type: "paragraph",
            text: "This website provides information about Exuma Yacht Club Resort and Marina, its marina, accommodation, dining and merchandise. By using the site, you agree to use it lawfully and in accordance with these terms. If you do not agree, please do not use the site.",
          },
        ],
      },
      {
        title: "2. Website content, accuracy and availability",
        blocks: [
          {
            type: "paragraph",
            text: "We aim to keep site information useful and current, but descriptions, images, availability and other details may change or contain errors. Website content is general information and is not a guarantee that a service, room, berth or product is available. The site or parts of it may occasionally be unavailable or changed without notice.",
          },
        ],
      },
      {
        title: "3. Merchandise listings and prices",
        blocks: [
          {
            type: "paragraph",
            text: "Product descriptions, options, prices and stock are shown as available in the shop and may change. We take reasonable care with listings but cannot guarantee that every description or image is error-free. If a listing or price error affects an order, we will contact you to explain the available next steps.",
          },
        ],
      },
      {
        title: "4. Orders and order errors",
        blocks: [
          {
            type: "paragraph",
            text: "Submitting checkout sends an order request. If the request passes validation and stock can be reserved, the site records a pending order and provides an order reference; an order-related email may also be sent. The reference confirms receipt by the system, not shipment, completed fulfilment or payment. We may contact you if an item is unavailable or information needs correction. Please contact us promptly if your order details are wrong.",
          },
        ],
      },
      {
        title: "5. Payment status and methods",
        blocks: [
          {
            type: "paragraph",
            text: "There is no live online payment gateway configured in the current site code. The default order flow records payment as due at pickup. Checkout also offers a labelled demo payment interaction; it expressly does not take real payment and is not evidence that funds were received. The order record or confirmation will indicate its payment status. Any payment method added later will be described at checkout before use.",
          },
        ],
      },
      {
        title: "6. Shipping, returns and refunds",
        blocks: [
          {
            type: "paragraph",
            text: "Shipping availability, charges, delivery estimates and return arrangements are subject to the information confirmed for your order. Review any shipping charge shown before submitting checkout. Return eligibility and the handling of refunds or exchanges are reviewed individually, subject to applicable law; no unconfirmed return period or refund timing is promised here.",
          },
          { type: "internal-link", href: "/shipping", label: "Read Shipping & Returns" },
        ],
      },
      {
        title: "7. Hotel and marina bookings",
        blocks: [
          {
            type: "paragraph",
            text: "Accommodation and marina reservations may be completed through ResNexus, Dockwa or another provider identified for the listing. The reservation, including its availability, payment, amendment and cancellation terms, is governed by the conditions shown by the relevant provider. Review those conditions before booking. These website terms do not replace them.",
          },
          { type: "internal-link", href: "/booking-cancellation", label: "Read Booking & Cancellation information" },
        ],
      },
      {
        title: "8. Restaurant information",
        blocks: [
          {
            type: "paragraph",
            text: "Dining information on this site is provided for general reference. Restaurant operating and reservation arrangements may be handled by a separate operator. Please use the contact or reservation details shown by the restaurant; this site does not represent that Exuma Yacht Club manages restaurant reservations.",
          },
        ],
      },
      {
        title: "9. Intellectual property",
        blocks: [
          {
            type: "paragraph",
            text: "Unless otherwise stated, website text, photographs, branding and other materials belong to or are used with permission by their respective rights holders. You may view and use the site for personal, non-commercial purposes. Do not reproduce or commercially use site materials without the relevant permission, except where the law allows.",
          },
        ],
      },
      {
        title: "10. Acceptable website use",
        blocks: [
          {
            type: "list",
            items: [
              "Do not use the site for unlawful, fraudulent or harmful activity.",
              "Do not attempt to gain unauthorized access, disrupt the site or interfere with its security.",
              "Do not submit false information, malicious code or content that infringes another person's rights.",
            ],
          },
        ],
      },
      {
        title: "11. Third-party links and services",
        blocks: [
          {
            type: "paragraph",
            text: "Links and embedded services are provided for convenience. Third-party websites and services have their own terms, privacy practices and availability, which we do not control. Access them at your discretion and review their terms directly.",
          },
        ],
      },
      {
        title: "12. Disclaimers and liability",
        blocks: [
          {
            type: "paragraph",
            text: "To the extent permitted by applicable law, the site is provided as available, without a guarantee that it will be uninterrupted or error-free. Nothing in these terms excludes a right or liability that cannot lawfully be excluded. To the extent permitted by law, Exuma Yacht Club Resort and Marina is not responsible for indirect loss arising from use of the site or reliance on general website information. This section does not limit rights relating to a confirmed booking or order under its applicable terms or law.",
          },
        ],
      },
      {
        title: "13. Updates to these terms",
        blocks: [
          {
            type: "paragraph",
            text: "We may update these terms when the website or its services change. The version published on this page applies to use of the site from its publication, subject to applicable law.",
          },
        ],
      },
      {
        title: "14. Contact",
        blocks: [
          {
            type: "paragraph",
            text: "Questions about these terms may be sent to info@exumayachtclub.net or addressed to Exuma Yacht Club Resort and Marina, Queen's Highway, George Town, Great Exuma, The Bahamas.",
          },
        ],
      },
    ],
  },
  shipping: {
    overline: "Gift Shop",
    title: "Shipping & Returns",
    intro:
      "Information for merchandise orders from the Exuma Yacht Club online shop. Review the options and charges shown during checkout before submitting an order.",
    sections: [
      {
        title: "Shipping destinations",
        blocks: [
          {
            type: "paragraph",
            text: "Worldwide shipping is intended, but supported destinations have not been confirmed as universal. A shipping address accepted by the online form does not by itself confirm that an order can be delivered there. Contact us before ordering if you need destination confirmation.",
          },
        ],
      },
      {
        title: "Shipping fees",
        blocks: [
          {
            type: "paragraph",
            text: "Any shipping option or charge shown during checkout should be reviewed before you submit your order. The final availability and charges for your destination must be confirmed for the order; do not assume that shipping is free or included in the item price. Contact us if a displayed amount or option is unclear.",
          },
        ],
      },
      {
        title: "Order processing and delivery",
        blocks: [
          {
            type: "paragraph",
            text: "Processing times and delivery estimates vary and are not stated as guaranteed timeframes here. Any estimate will be shown or communicated through the ordering process once confirmed. Delivery may be affected by carrier operations, weather, customs or other circumstances outside the shop's control.",
          },
        ],
      },
      {
        title: "Customs and import charges",
        blocks: [
          {
            type: "paragraph",
            text: "International shipments may be subject to customs duties, import taxes or other destination charges. Responsibility for these charges depends on the destination and order arrangements and is not allocated by this page. Please contact us before ordering if you need clarification.",
          },
        ],
      },
      {
        title: "Dispatch and tracking",
        blocks: [
          {
            type: "paragraph",
            text: "We will communicate dispatch information available for your order. Tracking is not guaranteed for every shipment; where tracking is available, the relevant details will be shared with you.",
          },
        ],
      },
      {
        title: "Returns and the return window",
        blocks: [
          {
            type: "paragraph",
            text: "Contact info@exumayachtclub.net promptly if you would like to discuss a return or exchange, and do so before sending merchandise back. No universal return deadline is stated here. Any return window or arrangement will be considered under the terms confirmed for the order and applicable law; this page does not promise a seven-day return period.",
          },
        ],
      },
      {
        title: "Return eligibility",
        blocks: [
          {
            type: "paragraph",
            text: "When contacting us, include your order reference and a description of the merchandise and its condition. Proof of purchase and original packaging can help us review the request. Eligibility, including any exclusions for particular items, depends on the circumstances and applicable law; no blanket exclusion is created by this page.",
          },
        ],
      },
      {
        title: "Damaged, defective or incorrect items",
        blocks: [
          {
            type: "paragraph",
            text: "Email info@exumayachtclub.net with your order reference, a description of the issue and supporting photographs where possible. We will review the report. A replacement or refund may be offered depending on the review, the terms applicable to your order and applicable law.",
          },
        ],
      },
      {
        title: "Refunds and exchanges",
        blocks: [
          {
            type: "paragraph",
            text: "Refunds or exchanges may be considered after review; not every item or situation is guaranteed to qualify. If a refund is approved, we will confirm the arrangement with you. This page does not promise a particular refund method or processing time and does not limit mandatory consumer rights.",
          },
        ],
      },
      {
        title: "Return shipping costs",
        blocks: [
          {
            type: "paragraph",
            text: "Who pays return shipping has not been set out as a general rule here. Please contact us before arranging a return so the applicable arrangements can be confirmed.",
          },
        ],
      },
      {
        title: "Pickup and contact",
        blocks: [
          {
            type: "paragraph",
            text: "If you selected collection at the dock, use the order confirmation or contact us to discuss collection arrangements. For shipping or return questions, email info@exumayachtclub.net or write to Exuma Yacht Club Resort and Marina, Queen's Highway, George Town, Great Exuma, The Bahamas.",
          },
        ],
      },
    ],
  },
  "booking-cancellation": {
    overline: "Reservations",
    title: "Booking & Cancellation",
    intro:
      "Accommodation and marina reservations may be handled through external booking providers. The conditions shown for your specific reservation govern its changes and cancellation.",
    sections: [
      {
        title: "Hotel and accommodation reservations",
        blocks: [
          {
            type: "paragraph",
            text: "Accommodation reservations may be made through ResNexus or another third-party platform shown for the listing. Read the provider's conditions, including cancellation, deposit, payment and amendment terms, before completing a reservation. For an existing booking, use the platform or the contact details in your confirmation.",
          },
          {
            type: "booking-link",
            provider: "resnexus",
            label: "Book accommodation through ResNexus",
          },
        ],
      },
      {
        title: "Marina reservations",
        blocks: [
          {
            type: "paragraph",
            text: "Marina bookings may be handled through Dockwa. Review the terms displayed for your specific dockage reservation and use Dockwa or the contact details in your confirmation to manage it.",
          },
          {
            type: "booking-link",
            provider: "dockwa",
            label: "View marina bookings through Dockwa",
          },
        ],
      },
      {
        title: "Cancellations and amendments",
        blocks: [
          {
            type: "paragraph",
            text: "Cancellation deadlines, deposits, fees, refunds and amendment rules depend on the particular reservation and the conditions presented by its booking provider. There is no universal cancellation deadline or refund guarantee in this policy. Contact the provider shown on your confirmation to request a change or cancellation.",
          },
        ],
      },
      {
        title: "Booking confirmation",
        blocks: [
          {
            type: "paragraph",
            text: "Keep your booking confirmation and review all reservation details and conditions before completing a booking. If confirmation details appear incorrect, contact the provider using the information in the confirmation.",
          },
        ],
      },
      {
        title: "Merchandise orders",
        blocks: [
          {
            type: "paragraph",
            text: "Hotel and marina reservation cancellation terms do not apply to merchandise orders. Merchandise shipping, returns, exchanges and refunds are covered separately.",
          },
          { type: "internal-link", href: "/shipping", label: "Read Shipping & Returns" },
        ],
      },
      {
        title: "Restaurant reservations",
        blocks: [
          {
            type: "paragraph",
            text: "Restaurant reservation arrangements may be managed by the restaurant operator. Please follow the reservation details provided by the restaurant; this site does not represent that Exuma Yacht Club handles restaurant reservations.",
          },
        ],
      },
      {
        title: "Contact",
        blocks: [
          {
            type: "paragraph",
            text: "For general questions, email info@exumayachtclub.net. For changes to a confirmed reservation, first contact the booking provider identified in your confirmation.",
          },
        ],
      },
    ],
  },
};
