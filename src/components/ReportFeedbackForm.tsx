"use client";

import { useActionState, useState } from "react";
import { submitFeedbackAction, type FeedbackFormState } from "@/app/actions";
import type { ReportTier } from "@/lib/reports/store";
import { StarIcon } from "@/components/icons";

const initialState: FeedbackFormState = { status: "idle" };

interface Props {
  reportId: string;
  tier: ReportTier;
  childName: string;
}

/**
 * A real, entirely optional feedback prompt on the last page of a paid
 * reading -- the founder's own alternative to fabricated testimonials
 * (never do that; see HANDOFF.md §6). Nothing submitted here is ever
 * shown back to another visitor automatically; the founder reviews it
 * directly and, only with the customer's own consent (the "OK to
 * feature" checkbox), might use it later.
 */
export function ReportFeedbackForm({ reportId, tier, childName }: Props) {
  const [state, formAction, isPending] = useActionState(submitFeedbackAction, initialState);
  const [rating, setRating] = useState<number | null>(null);

  if (state.status === "success") {
    return (
      <p className="text-sm leading-6 text-white/75">
        Thank you — genuinely. That kind of note helps far more than you&apos;d think for a small, independent project like this.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4 text-left">
      <input type="hidden" name="reportId" value={reportId} />
      <input type="hidden" name="tier" value={tier} />
      <input type="hidden" name="rating" value={rating ?? ""} />

      <div className="flex items-center justify-center gap-1.5" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            aria-pressed={rating !== null && n <= rating}
            onClick={() => setRating(n)}
            className="p-0.5"
          >
            <StarIcon
              className={`h-6 w-6 transition-colors ${
                rating !== null && n <= rating ? "fill-accent-bright text-accent-bright" : "fill-transparent text-white/30"
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        name="message"
        rows={3}
        maxLength={2000}
        placeholder={`Anything about ${childName}'s reading that stood out, for better or worse? (optional)`}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-shadow placeholder:text-white/40 focus:border-white/30 focus:ring-4 focus:ring-white/10"
      />

      <label className="flex items-start gap-2 text-left text-xs text-white/60">
        <input type="checkbox" name="okToFeature" className="mt-0.5 h-3.5 w-3.5 rounded border-white/30 accent-accent-bright" />
        It&apos;s OK to feature this (with just a first name) on the site sometime
      </label>

      {state.status === "error" && <p className="text-sm text-accent-bright">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-sm bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
