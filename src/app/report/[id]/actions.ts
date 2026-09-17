"use server";

import { redirect } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { getStripeClient } from "@/lib/stripe/server";
import { getReport, hasOtherPaidReportForEmail, markReportTierFromPack } from "@/lib/reports/store";
import { PRICING_TIERS, UPGRADE_TO_PREMIUM_CENTS, siblingDiscountedPriceCents } from "@/lib/pricing";
import { consumePackCredit, findAvailablePackForEmail, getPackById } from "@/lib/creditPacks/store";
import { createMagicLinkToken, getVerifiedSessionEmail } from "@/lib/auth/magicLink";
import { sendEmailOwnershipVerificationEmail } from "@/lib/email/readingEmail";
import { siteOrigin } from "@/lib/site";

/**
 * A visitor has "verified" a report's email once a magic-link click has
 * set the session cookie for that exact address -- see
 * getVerifiedSessionEmail. Both money-adjacent paths below (a sibling
 * discount, a pack-credit redemption) require this now (HANDOFF §65):
 * before this, either could be claimed just by typing someone else's
 * email at intake, with no proof of ownership at all.
 */
async function isReportEmailVerified(email: string): Promise<boolean> {
  const sessionEmail = await getVerifiedSessionEmail();
  return !!sessionEmail && sessionEmail === email.trim().toLowerCase();
}

// Same best-effort, in-memory throttle as /my-readings' login email --
// resets on cold start, which is an accepted trade-off on this low-volume,
// serverless project, not a guarantee.
const lastVerificationSentAt = new Map<string, number>();
const VERIFICATION_THROTTLE_MS = 60_000;

function isVerificationThrottled(email: string): boolean {
  const now = Date.now();
  const last = lastVerificationSentAt.get(email);
  if (last !== undefined && now - last < VERIFICATION_THROTTLE_MS) return true;

  lastVerificationSentAt.set(email, now);
  if (lastVerificationSentAt.size > 500) {
    for (const [key, ts] of lastVerificationSentAt) {
      if (now - ts > VERIFICATION_THROTTLE_MS) lastVerificationSentAt.delete(key);
    }
  }
  return false;
}

/**
 * Sends the one-time email-ownership check (HANDOFF §65) for whichever
 * report the visitor is currently trying to claim a discount or credit
 * on. Lands back on this same report (`next`) once clicked -- see
 * /my-readings/verify/route.ts, which sets the same session cookie
 * regardless of which page sent the link.
 */
export async function sendEmailVerificationLinkAction(formData: FormData): Promise<void> {
  const reportId = formData.get("reportId")?.toString();
  if (!reportId) {
    throw new Error("Invalid request.");
  }

  const report = await getReport(reportId);
  if (!report) {
    throw new Error("That reading could not be found.");
  }
  if (!report.customerEmail) {
    throw new Error("Add your email to this reading first.");
  }

  const email = report.customerEmail.trim().toLowerCase();
  if (!isVerificationThrottled(email)) {
    try {
      const origin = await siteOrigin();
      const token = createMagicLinkToken(email);
      const verifyUrl = `${origin}/my-readings/verify?token=${encodeURIComponent(token)}&next=${encodeURIComponent(`/report/${reportId}`)}`;
      await sendEmailOwnershipVerificationEmail({ to: email, verifyUrl });
    } catch (err) {
      console.error("sendEmailVerificationLinkAction: failed to send verification email", err);
      Sentry.captureException(err);
    }
  }

  redirect(`/report/${reportId}?verifySent=1`);
}

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

/**
 * Unlocks a report using one credit from a pre-paid pack instead of a
 * fresh Stripe checkout. Every check here is re-verified server-side
 * against fresh reads -- never trusted from the form alone -- since this
 * bypasses Stripe entirely: it's the one purchase-adjacent path in this
 * app where a bug could unlock a reading for free rather than just
 * charge the wrong amount.
 */
export async function redeemPackCreditAction(formData: FormData): Promise<void> {
  const reportId = formData.get("reportId")?.toString();
  const packId = formData.get("packId")?.toString();
  if (!reportId || !packId) {
    throw new Error("Invalid redemption request.");
  }

  const report = await getReport(reportId);
  if (!report) {
    throw new Error("That reading could not be found.");
  }

  // Already unlocked -- nothing to redeem, just go back.
  if (report.tier) {
    redirect(`/report/${reportId}`);
  }

  if (!report.customerEmail) {
    throw new Error("Add your email to this reading first.");
  }

  const pack = await getPackById(packId);
  const isExpired = !!pack?.expiresAt && new Date(pack.expiresAt) <= new Date();
  if (
    !pack ||
    pack.status !== "paid" ||
    pack.creditsRemaining < 1 ||
    isExpired ||
    pack.buyerEmail !== report.customerEmail.trim().toLowerCase()
  ) {
    throw new Error(isExpired ? "That credit pack has expired." : "That pack credit isn't available for this reading.");
  }

  // Anti-fraud check (HANDOFF §65): proves this visitor actually controls
  // the email the credit is tied to, not just that they typed it into
  // this reading's intake form -- the only thing stopping anyone from
  // spending a stranger's pre-paid credits before this.
  if (!(await isReportEmailVerified(report.customerEmail))) {
    throw new Error("Please verify your email before using a credit.");
  }

  const consumed = await consumePackCredit(packId);
  if (!consumed) {
    throw new Error("That pack credit isn't available anymore.");
  }

  await markReportTierFromPack(reportId, pack.tier, packId);
  redirect(`/report/${reportId}`);
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
  // Suppressed while this email still has an unused pack credit --
  // founder feedback: a family that pre-paid for credits shouldn't be
  // charged a 15%-off price instead of spending the credit they already
  // own. The discount only becomes available again once every credit is
  // spent.
  // Also requires the email-ownership check (HANDOFF §65, same posture as
  // the pack-credit redemption above) -- without it, anyone could type a
  // stranger's email at intake and get 15% off on the strength of a
  // reading that isn't theirs.
  const availablePack = report.customerEmail ? await findAvailablePackForEmail(report.customerEmail) : null;
  const isSiblingDiscount =
    !isUpgrade &&
    !availablePack &&
    !!report.customerEmail &&
    (await isReportEmailVerified(report.customerEmail)) &&
    (await hasOtherPaidReportForEmail(report.customerEmail, reportId));

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
