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

export interface CreditPackOption {
  id: string;
  tier: "full" | "premium";
  size: number;
  priceCents: number;
}

/**
 * Pre-paid reading credits, redeemable one at a time later against any
 * reading (further children, or a gift) -- founder-set pricing, an
 * escalating discount per pack size against the $25 full-tier price:
 * 3-pack ~10% off, 5-pack ~15% off, 7-pack ~20% off. A redeemed full-tier
 * credit unlocks the full tier specifically; the existing $15
 * remedies/career upgrade is still available per reading afterward, same
 * as any full-tier purchase.
 *
 * The single premium-5 option (founder feedback, HANDOFF §65) sits
 * alongside the $25-tier packs rather than replacing them -- same 15%
 * discount rate as the full-tier 5-pack, applied to the $35 premium
 * price instead ($175 -> $148.75), so a redeemed credit from it unlocks
 * the Complete Constellation Reading (remedies + career deep-dive
 * included) directly, with no separate upgrade purchase needed.
 */
export const CREDIT_PACK_OPTIONS: CreditPackOption[] = [
  { id: "full-3", tier: "full", size: 3, priceCents: 6750 },
  { id: "full-5", tier: "full", size: 5, priceCents: 10625 },
  { id: "full-7", tier: "full", size: 7, priceCents: 14000 },
  { id: "premium-5", tier: "premium", size: 5, priceCents: 14875 },
];

export function findCreditPackOption(id: string): CreditPackOption | undefined {
  return CREDIT_PACK_OPTIONS.find((p) => p.id === id);
}

/**
 * Validity period for a gift voucher or credit pack, from the moment it's
 * paid for. Set to 3 years, not 2 (a real request was made for 2): the
 * Australian Consumer Law's mandatory gift-card minimum (s99B, in force
 * since 1 November 2019) requires at least 3 years' validity on any gift
 * card/voucher sold to a consumer, with penalties of up to $30,000 for a
 * business that supplies one with a shorter expiry. Credit packs are
 * held to the same 3-year floor out of caution, since nothing in the law
 * clearly exempts a pre-paid, redeem-later credit.
 */
export const VOUCHER_AND_PACK_VALIDITY_YEARS = 3;

export function computeExpiryDate(from: Date = new Date()): Date {
  const expires = new Date(from);
  expires.setFullYear(expires.getFullYear() + VOUCHER_AND_PACK_VALIDITY_YEARS);
  return expires;
}

export function formatPrice(tier: PricingTier): string {
  return formatCents(tier.priceCents, tier.currency);
}

export function formatCents(cents: number, currency: string = "usd"): string {
  const amount = (cents / 100).toFixed(2);
  const symbol = currency === "usd" ? "$" : currency.toUpperCase() + " ";
  return `${symbol}${amount}`;
}
