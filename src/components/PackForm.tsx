"use client";

import { useActionState, useState } from "react";
import { createPackCheckoutSessionAction, type PackFormState } from "@/app/packs/actions";
import { CREDIT_PACK_OPTIONS, formatCents, PRICING_TIERS, type CreditPackOption } from "@/lib/pricing";

const initialState: PackFormState = { status: "idle" };

const FULL_OPTIONS = CREDIT_PACK_OPTIONS.filter((o) => o.tier === "full");
const PREMIUM_OPTIONS = CREDIT_PACK_OPTIONS.filter((o) => o.tier === "premium");

function savingsLabel(option: CreditPackOption): string {
  const soloPrice = PRICING_TIERS[option.tier].priceCents * option.size;
  const savedCents = soloPrice - option.priceCents;
  const percent = Math.round((savedCents / soloPrice) * 100);
  return `Save ${percent}% (${formatCents(savedCents)} off ${option.size} bought separately)`;
}

export function PackForm() {
  const [state, formAction, isPending] = useActionState(createPackCheckoutSessionAction, initialState);
  const [optionId, setOptionId] = useState<string>(FULL_OPTIONS[1]?.id ?? FULL_OPTIONS[0].id);
  const selected = CREDIT_PACK_OPTIONS.find((p) => p.id === optionId) ?? FULL_OPTIONS[0];

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <p className="mb-1 block text-sm font-medium text-foreground">
          {PRICING_TIERS.full.name} packs
        </p>
        <p className="mb-2 text-xs text-muted">
          Each credit unlocks {PRICING_TIERS.full.name} — {PRICING_TIERS.full.tagline.toLowerCase()}.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FULL_OPTIONS.map((option) => {
            const isSelected = option.id === optionId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setOptionId(option.id)}
                className={`rounded-md border p-4 text-left transition-colors ${
                  isSelected ? "border-primary bg-primary-tint" : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <span className="block text-sm font-semibold text-primary-dark">{option.size} readings</span>
                <span className="mt-1 block text-lg font-semibold text-primary-dark">
                  {formatCents(option.priceCents)}
                </span>
                <span className="mt-1 block text-xs text-muted">{savingsLabel(option)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
          {PRICING_TIERS.premium.name} pack
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-accent">
            Premium
          </span>
        </p>
        <p className="mb-2 text-xs text-muted">
          Each credit unlocks the full {PRICING_TIERS.premium.name} — {PRICING_TIERS.premium.tagline.toLowerCase()}. No separate upgrade purchase needed.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PREMIUM_OPTIONS.map((option) => {
            const isSelected = option.id === optionId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setOptionId(option.id)}
                className={`rounded-md border p-4 text-left transition-colors ${
                  isSelected ? "border-accent bg-accent/10" : "border-border bg-white hover:border-accent/40"
                }`}
              >
                <span className="block text-sm font-semibold text-primary-dark">{option.size} readings</span>
                <span className="mt-1 block text-lg font-semibold text-primary-dark">
                  {formatCents(option.priceCents)}
                </span>
                <span className="mt-1 block text-xs text-muted">{savingsLabel(option)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <input type="hidden" name="optionId" value={optionId} />

      <div>
        <label htmlFor="buyerEmail" className="mb-1.5 block text-sm font-medium text-foreground">
          Your email
        </label>
        <input
          id="buyerEmail"
          name="buyerEmail"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
        <p className="mt-1.5 text-xs text-muted">
          Your {selected.size} {PRICING_TIERS[selected.tier].name} credits are
          tied to this email — add the same email to any reading&apos;s intake
          form later to redeem one, free, instead of paying again.
        </p>
      </div>

      {state.status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-sm bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {isPending
          ? "Starting checkout…"
          : `Buy ${selected.size} ${PRICING_TIERS[selected.tier].name} credits — ${formatCents(selected.priceCents)}`}
      </button>
    </form>
  );
}
