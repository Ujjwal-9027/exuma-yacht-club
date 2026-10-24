import Link from "next/link";
import type { PolicyBlock, PolicyContent } from "@/content/policies";
import { PolicyLayout, PolicySection } from "@/components/policy-layout";

type BookingUrls = Partial<Record<"resnexus" | "dockwa", string>>;

const linkClassName =
  "font-semibold text-navy-900 underline decoration-gold-500 underline-offset-4 hover:text-gold-600";

function renderBlock(block: PolicyBlock, bookingUrls: BookingUrls) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-5 marker:text-gold-600">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "internal-link":
      return (
        <Link href={block.href} className={linkClassName}>
          {block.label}
        </Link>
      );
    case "external-link":
      return (
        <a
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {block.label}
        </a>
      );
    case "booking-link": {
      const url = bookingUrls[block.provider];
      return url && !url.includes("PLACEHOLDER") ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {block.label}
        </a>
      ) : (
        <p>
          For current booking information, email{" "}
          <a href="mailto:info@exumayachtclub.net" className={linkClassName}>
            info@exumayachtclub.net
          </a>
          .
        </p>
      );
    }
  }
}

export function PolicyPage({
  policy,
  bookingUrls = {},
}: {
  policy: PolicyContent;
  bookingUrls?: BookingUrls;
}) {
  return (
    <PolicyLayout
      overline={policy.overline}
      title={policy.title}
      intro={policy.intro}
    >
      {policy.effectiveDate && (
        <p className="text-xs text-ink-400">
          Effective date: {policy.effectiveDate}
        </p>
      )}
      {policy.sections.map((section) => (
        <PolicySection key={section.title} title={section.title}>
          {section.blocks.map((block, index) => (
            <div key={`${block.type}-${index}`}>
              {renderBlock(block, bookingUrls)}
            </div>
          ))}
        </PolicySection>
      ))}
      <PolicySection title="Related policies">
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {[
            ["Privacy Policy", "/privacy"],
            ["Terms & Conditions", "/terms"],
            ["Shipping & Returns", "/shipping"],
            ["Booking & Cancellation", "/booking-cancellation"],
          ].map(([label, href]) => (
            <li key={href}>
              <Link href={href} className={linkClassName}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </PolicySection>
    </PolicyLayout>
  );
}
