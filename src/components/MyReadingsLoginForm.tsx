"use client";

import { useActionState } from "react";
import { requestMyReadingsLoginAction, type MyReadingsLoginFormState } from "@/app/my-readings/actions";

const initialState: MyReadingsLoginFormState = { status: "idle" };

export function MyReadingsLoginForm() {
  const [state, formAction, isPending] = useActionState(requestMyReadingsLoginAction, initialState);

  if (state.status === "done") {
    return (
      <p className="rounded-xl bg-primary-tint px-4 py-3 text-sm text-primary-dark">
        Check your inbox — if that email has readings, or has used this
        before, we&apos;ve sent a link to view them. No password needed.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
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
        className="w-full rounded-sm bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {isPending ? "Sending…" : "Email me a link"}
      </button>
    </form>
  );
}
