"use client";

import { useActionState } from "react";
import { resendReadingAction, type ResendReadingFormState } from "@/app/resend-reading/actions";

const initialState: ResendReadingFormState = { status: "idle" };

export function ResendReadingForm() {
  const [state, formAction, isPending] = useActionState(resendReadingAction, initialState);

  if (state.status === "done") {
    return (
      <p className="rounded-xl bg-primary-tint px-4 py-3 text-sm text-primary-dark">
        If we have a paid reading on file for that email, we&apos;ve sent the
        link(s) to your inbox.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email address used at checkout
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {state.status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {isPending ? "Sending…" : "Send me the link"}
      </button>
    </form>
  );
}
