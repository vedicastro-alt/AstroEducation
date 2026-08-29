"use server";

import { redirect } from "next/navigation";
import { getStripeClient } from "@/lib/stripe/server";
import { getReport } from "@/lib/reports/store";
import { PRICING_TIERS, UPGRADE_TO_PREMIUM_CENTS } from "@/lib/pricing";
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
  const unitAmount = isUpgrade ? UPGRADE_TO_PREMIUM_CENTS : tier.priceCents;
  const productName = isUpgrade ? "Add gentle remedies" : tier.name;
  const productDescription = isUpgrade
    ? "Upgrade The Guiding Stars Reading to include gentle, personalized remedies"
    : tier.tagline;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
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
    metadata: { reportId, tier: tierId },
  });

  if (!session.url) {
    throw new Error("Could not start checkout. Please try again.");
  }

  redirect(session.url);
}
