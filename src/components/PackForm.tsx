"use client";

import { useActionState, useState } from "react";
import { createPackCheckoutSessionAction, type PackFormState } from "@/app/packs/actions";
import { CREDIT_PACK_OPTIONS, formatCents, PRICING_TIERS } from "@/lib/pricing";

const initialState: PackFormState = { status: "idle" };

function savingsLabel(size: number, priceCents: number): string {
  const fullPrice = PRICING_TIERS.full.priceCents * size;
  const savedCents = fullPrice - priceCents;
  const percent = Math.round((savedCents / fullPrice) * 100);
  return `Save ${percent}% (${formatCents(savedCents)} off ${size} readings bought separately)`;
}

export function PackForm() {
  const [state, formAction, isPending] = useActionState(createPackCheckoutSessionAction, initialState);
  const [size, setSize] = useState(CREDIT_PACK_OPTIONS[1]?.size ?? CREDIT_PACK_OPTIONS[0].size);
  const selected = CREDIT_PACK_OPTIONS.find((p) => p.size === size) ?? CREDIT_PACK_OPTIONS[0];

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="mb-2 block text-sm font-medium text-foreground">Pack size</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CREDIT_PACK_OPTIONS.map((option) => {
            const isSelected = option.size === size;
            return (
              <button
                key={option.size}
                type="button"
                onClick={() => setSize(option.size)}
                className={`rounded-md border p-4 text-left transition-colors ${
                  isSelected ? "border-primary bg-primary-tint" : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <span className="block text-sm font-semibold text-primary-dark">{option.size} readings</span>
                <span className="mt-1 block text-lg font-semibold text-primary-dark">
                  {formatCents(option.priceCents)}
                </span>
                <span className="mt-1 block text-xs text-muted">{savingsLabel(option.size, option.priceCents)}</span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="size" value={size} />
      </div>

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
          Your {size} credits are tied to this email — add the same email
          to any reading&apos;s intake form later to redeem one, free,
          instead of paying again.
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
        {isPending ? "Starting checkout…" : `Buy ${size} credits — ${formatCents(selected.priceCents)}`}
      </button>
    </form>
  );
}
