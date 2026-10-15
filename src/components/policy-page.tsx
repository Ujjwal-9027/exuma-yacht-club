import { TriangleAlert } from "lucide-react";
import type { PolicyContent } from "@/content/policies";
import { PolicyLayout, PolicySection } from "@/components/policy-layout";

/**
 * Renders a policy from src/content/policies.ts. While `isPlaceholder` is
 * true the page shows a visible banner so nobody mistakes the text for an
 * approved policy.
 */
export function PolicyPage({ policy }: { policy: PolicyContent }) {
  return (
    <PolicyLayout overline={policy.overline} title={policy.title} intro={policy.intro}>
      {policy.isPlaceholder && (
        <div
          role="note"
          className="flex items-start gap-3 border border-gold-500/60 bg-ivory-100 p-5"
        >
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-ink-700">
            <span className="font-semibold text-navy-900">
              This policy is awaiting client-approved text.
            </span>{" "}
            The wording below is a placemark only and must be replaced in{" "}
            <code className="bg-sand-200 px-1.5 py-0.5 text-xs">
              src/content/policies.ts
            </code>{" "}
            before launch. For anything urgent, contact the team directly.
          </p>
        </div>
      )}
      {policy.body.map((paragraph, i) => (
        <PolicySection key={i} title={policy.isPlaceholder ? `Section ${i + 1} (to follow)` : `${i + 1}.`}>
          <p>{paragraph}</p>
        </PolicySection>
      ))}
    </PolicyLayout>
  );
}
