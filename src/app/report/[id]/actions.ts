"use server";

import { redirect } from "next/navigation";
import { getStripeClient } from "@/lib/stripe/server";
import { getReport, hasOtherPaidReportForEmail } from "@/lib/reports/store";
import { PRICING_TIERS, UPGRADE_TO_PREMIUM_CENTS, siblingDiscountedPriceCents } from "@/lib/pricing";
import { siteOrigin } from "@/lib/site";

/**
 * Polled by PaymentConfirming while a parent is waiting for their tier
 * to actually land after returning from Stripe Checkout -- see that
 * component for why this is needed (the redirect-time verification is
 * best-effort and can lose the race against Stripe's own confirmation,
 * and a webhook isn't guaranteed to be configured in every environment
 * this app runs in, e.g. a preview deployment pointed at a Stripe
 * sandbox with no webhook secret set).
 */
export async function checkReportUnlockedAction(reportId: string): Promise<boolean> {
  const report = await getReport(reportId);
  return report?.tier != null;
}

export async function createCheckoutSessionAction(formData: FormData): Promise<void> {
  const reportId = formData.get("reportId")?.toString();
  const tierId = formData.get("tier")?.toString();
  const recipientEmail = formData.get("recipientEmail")?.toString().trim();
  const recipientName = formData.get("recipientName")?.toString().trim();
  const giftNote = formData.get("giftNote")?.toString().trim();

  if (!reportId || (tierId !== "full" && tierId !== "premium")) {
    throw new Error("Invalid checkout request.");
  }

  const report = await getReport(reportId);
  if (!report) {
    throw new Error("That reading could not be found.");
  }

  // Already own this tier (or better) -- nothing to buy, just go back.
  if (report.tier === "premium" || report.tier === tierId) {
    redirect(`/report/${reportId}`);
  }

  const tier = PRICING_TIERS[tierId];
  const origin = await siteOrigin();
  const stripe = getStripeClient();

  // Already own the full reading and just adding remedies -- charge the
  // cheaper upgrade price, not the full premium-from-scratch price.
  const isUpgrade = report.tier === "full" && tierId === "premium";

  // A fresh purchase (never an upgrade -- that's a different report at a
  // different tier, not a second child) for an email that already has a
  // different, paid report on file -- the automatic sibling discount
  // (HANDOFF §43). Requires the parent to have added their email at
  // intake (ReportFlow.tsx's optional "Your email" field) for *this*
  // report already, since the discount has to be priced in before
  // Stripe Checkout is created, not discovered afterward. Recomputed
  // authoritatively here, server-side, regardless of anything shown to
  // the visitor on the paywall page -- never trust a client-side flag
  // for the actual charge amount.
  const isSiblingDiscount =
    !isUpgrade && !!report.customerEmail && (await hasOtherPaidReportForEmail(report.customerEmail, reportId));

  const unitAmount = isUpgrade
    ? UPGRADE_TO_PREMIUM_CENTS
    : isSiblingDiscount
      ? siblingDiscountedPriceCents(tier)
      : tier.priceCents;
  const productName = isUpgrade ? "Add gentle remedies" : tier.name;
  const productDescription = isUpgrade
    ? "Upgrade The Guiding Stars Reading to include gentle, personalized remedies"
    : isSiblingDiscount
      ? `${tier.tagline} — 15% sibling discount applied`
      : tier.tagline;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true,
    line_items: [
      {
        price_data: {
          currency: tier.currency,
          unit_amount: unitAmount,
          product_data: {
            name: productName,
            description: productDescription,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/report/${reportId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/report/${reportId}`,
    client_reference_id: reportId,
    metadata: {
      reportId,
      tier: tierId,
      // Only set when the buyer chose "send this as a gift" at checkout
      // -- the webhook uses recipientEmail's presence to decide whether
      // to send the gift-framed email (to the recipient) in addition to
      // the buyer's own receipt copy.
      ...(recipientEmail ? { recipientEmail } : {}),
      ...(recipientName ? { recipientName } : {}),
      ...(giftNote ? { giftNote } : {}),
    },
  });

  if (!session.url) {
    throw new Error("Could not start checkout. Please try again.");
  }

  redirect(session.url);
}
