"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      action={formAction}
      className="mt-8 w-full max-w-sm border border-sand-300 bg-white p-7"
    >
      <label htmlFor="password" className="field-label">
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          className="field pr-11"
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-navy-900"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="mt-3 text-xs text-[#b3402e]">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-navy-900 bg-navy-900 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory-50 transition-colors hover:bg-transparent hover:text-navy-900 disabled:opacity-60"
      >
        {pending && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
