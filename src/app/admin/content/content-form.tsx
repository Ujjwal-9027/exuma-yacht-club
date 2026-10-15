"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveContentAction, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { error: null };

export function ContentForm({
  values,
}: {
  values: { homeHeroTitle: string; homeHeroLede: string };
}) {
  const [state, formAction, pending] = useActionState(
    saveContentAction,
    initialState,
  );
  return (
    <form
      action={formAction}
      className="border border-sand-300 bg-white p-6 sm:p-8"
    >
      <p className="mb-6 text-sm leading-relaxed text-ink-500">
        These fields power the homepage hero. Existing images, verified business
        facts, and navigation remain unchanged until their supported content
        models are migrated.
      </p>
      <div className="space-y-5">
        <div>
          <label htmlFor="homeHeroTitle" className="field-label">
            Homepage heading
          </label>
          <input
            id="homeHeroTitle"
            name="homeHeroTitle"
            required
            maxLength={160}
            defaultValue={values.homeHeroTitle}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="homeHeroLede" className="field-label">
            Homepage description
          </label>
          <textarea
            id="homeHeroLede"
            name="homeHeroLede"
            required
            maxLength={320}
            rows={4}
            defaultValue={values.homeHeroLede}
            className="field resize-y"
          />
        </div>
      </div>
      {state.error && (
        <p
          role="alert"
          className="mt-5 border border-[#e3c2bb] bg-[#fbf1ef] p-3 text-sm text-[#8f3526]"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-7 inline-flex items-center gap-2 border border-navy-900 bg-navy-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory-50 hover:bg-transparent hover:text-navy-900 disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-4 w-4" aria-hidden="true" />
        )}
        {pending ? "Saving" : "Publish homepage copy"}
      </button>
    </form>
  );
}
