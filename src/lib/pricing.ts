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

export function formatPrice(tier: PricingTier): string {
  const amount = (tier.priceCents / 100).toFixed(2);
  const symbol = tier.currency === "usd" ? "$" : tier.currency.toUpperCase() + " ";
  return `${symbol}${amount}`;
}
