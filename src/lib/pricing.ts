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
    tagline: "Everything in The Guiding Stars Reading, plus gentle remedies",
    features: [
      "Everything in The Guiding Stars Reading",
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

export function formatPrice(tier: PricingTier): string {
  return formatCents(tier.priceCents, tier.currency);
}

export function formatCents(cents: number, currency: string = "usd"): string {
  const amount = (cents / 100).toFixed(2);
  const symbol = currency === "usd" ? "$" : currency.toUpperCase() + " ";
  return `${symbol}${amount}`;
}
