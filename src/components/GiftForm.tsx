"use client";

import { useActionState, useState } from "react";
import { createGiftVoucherCheckoutSessionAction, type GiftFormState } from "@/app/gift/actions";
import { PRICING_TIERS, formatPrice } from "@/lib/pricing";

const initialState: GiftFormState = { status: "idle" };

export function GiftForm() {
  const [state, formAction, isPending] = useActionState(createGiftVoucherCheckoutSessionAction, initialState);
  const [tier, setTier] = useState<"full" | "premium">("full");

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="mb-2 block text-sm font-medium text-foreground">Which reading?</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(["full", "premium"] as const).map((id) => {
            const t = PRICING_TIERS[id];
            const selected = tier === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTier(id)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  selected ? "border-primary bg-primary-tint" : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <span className="block text-sm font-semibold text-primary-dark">{t.name}</span>
                <span className="mt-1 block text-lg font-semibold text-primary-dark">{formatPrice(t)}</span>
                <span className="mt-1 block text-xs text-muted">{t.tagline}</span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="tier" value={tier} />
      </div>

      <div>
        <label htmlFor="recipientEmail" className="mb-1.5 block text-sm font-medium text-foreground">
          Recipient&apos;s email
        </label>
        <input
          id="recipientEmail"
          name="recipientEmail"
          type="email"
          required
          placeholder="e.g. sarah@example.com"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <div>
        <label htmlFor="recipientName" className="mb-1.5 block text-sm font-medium text-foreground">
          Their name <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="recipientName"
          name="recipientName"
          type="text"
          maxLength={60}
          placeholder="e.g. Sarah"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <div>
        <label htmlFor="giftMessage" className="mb-1.5 block text-sm font-medium text-foreground">
          A short note <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="giftMessage"
          name="giftMessage"
          maxLength={200}
          rows={3}
          placeholder="e.g. Thought you'd love this for Leo — enjoy!"
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
        {isPending ? "Starting checkout…" : `Send this gift — ${formatPrice(PRICING_TIERS[tier])}`}
      </button>
    </form>
  );
}
