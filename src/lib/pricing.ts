export interface PricingTier {
  id: "full" | "premium";
  name: string;
  priceCents: number;
  currency: string;
  tagline: string;
  features: string[];
}

/**
 * Single source of truth for what each tier costs and unlocks. Change
 * prices here only -- nothing else in the app hardcodes an amount.
 */
export const PRICING_TIERS: Record<"full" | "premium", PricingTier> = {
  full: {
    id: "full",
    name: "The Guiding Stars Reading",
    priceCents: 2500,
    currency: "usd",
    tagline: "The complete personalized learning pathway",
    features: [
      "A direct answer to the real decision you're facing, if you tell us what it is",
      "Which subjects come naturally, and which need extra support",
      "Their natural direction as they grow, with example fields",
      "A life-chapter timeline",
      "Their ideal learning environment",
      "A gentle weekly rhythm",
    ],
  },
  premium: {
    id: "premium",
    name: "The Complete Constellation Reading",
    priceCents: 3500,
    currency: "usd",
    tagline: "Everything in The Guiding Stars Reading, plus a career deep-dive and gentle remedies",
    features: [
      "Everything in The Guiding Stars Reading",
      "A ranked career deep-dive across every field this chart speaks to",
      "Gentle, traditional remedies personalized to their chart",
      "Simple, low-cost ideas only — no gemstones, nothing prescriptive",
    ],
  },
};

/**
 * Price to add gentle remedies onto an already-purchased full reading.
 * Deliberately cheaper than buying the premium tier fresh (which bundles
 * the full reading too) -- this is just the remedies chapter on its own.
 */
export const UPGRADE_TO_PREMIUM_CENTS = 1500;

/**
 * A modest, real, disclosed discount for a second (or further) child's
 * reading once a family has already bought one -- the fix for the "$25
 * one-off, no repeat-purchase reason" gap flagged in outside business
 * feedback (HANDOFF §43). Applied automatically at checkout when
 * eligibility is detected server-side (see report/[id]/actions.ts) --
 * never a code to remember, and never framed as urgency/scarcity, per
 * HANDOFF §6.
 */
export const SIBLING_DISCOUNT_RATE = 0.15;

export function siblingDiscountedPriceCents(tier: PricingTier): number {
  return Math.round(tier.priceCents * (1 - SIBLING_DISCOUNT_RATE));
}

export function formatPrice(tier: PricingTier): string {
  return formatCents(tier.priceCents, tier.currency);
}

export function formatCents(cents: number, currency: string = "usd"): string {
  const amount = (cents / 100).toFixed(2);
  const symbol = currency === "usd" ? "$" : currency.toUpperCase() + " ";
  return `${symbol}${amount}`;
}
