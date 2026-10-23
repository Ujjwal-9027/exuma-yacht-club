"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import {
  resetAdminPasswordAction,
  type ActionState,
} from "@/app/admin/actions";

const initialState: ActionState = { error: null };

type PasswordFieldProps = {
  id: string;
  label: string;
  autoComplete: string;
};

function PasswordField({ id, label, autoComplete }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          className="field pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          title={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-navy-900"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

export function PasswordResetForm() {
  const [state, formAction, pending] = useActionState(
    resetAdminPasswordAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-8 border border-sand-300 bg-white p-6 sm:p-8"
    >
      <div className="flex items-start gap-3">
        <KeyRound className="mt-1 h-5 w-5 text-gold-600" aria-hidden="true" />
        <div>
          <h2 className="font-display text-2xl text-navy-900">
            Reset admin password
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Set a new password for admin sign in. You will be signed out after
            saving.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <PasswordField
          id="currentPassword"
          label="Current password"
          autoComplete="current-password"
        />
        <PasswordField
          id="newPassword"
          label="New password"
          autoComplete="new-password"
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
        />
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
        className="mt-6 inline-flex items-center gap-2 border border-navy-900 bg-navy-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory-50 hover:bg-transparent hover:text-navy-900 disabled:opacity-60"
      >
        {pending && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {pending ? "Updating" : "Update password"}
      </button>
    </form>
  );
}
