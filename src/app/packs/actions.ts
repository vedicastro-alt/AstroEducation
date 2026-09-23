"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { getStripeClient } from "@/lib/stripe/server";
import { createPendingPack } from "@/lib/creditPacks/store";
import { CREDIT_PACKS_ON_SALE, findCreditPackOption, PRICING_TIERS } from "@/lib/pricing";
import { siteOrigin } from "@/lib/site";

const formSchema = z.object({
  optionId: z.string().min(1),
  buyerEmail: z.string().trim().toLowerCase().email("Please enter a valid email address."),
});

export interface PackFormState {
  status: "idle" | "error";
  error?: string;
}

/**
 * Starts a credit-pack purchase -- a pending `credit_packs` row is
 * created before Checkout starts (mirrors `createPendingVoucher`), and
 * the webhook grants the actual credits once Stripe confirms payment.
 * Requires an email up front (unlike a normal reading purchase, where
 * it's optional): a pack has nothing to attach to yet -- no report, no
 * child -- so the buyer's email is the only thing that can later match
 * it to whichever reading redeems a credit.
 */
export async function createPackCheckoutSessionAction(
  _prevState: PackFormState,
  formData: FormData,
): Promise<PackFormState> {
  // Parked (HANDOFF §66), not removed -- see CREDIT_PACKS_ON_SALE. A
  // second layer behind the page itself no longer offering the form, in
  // case a stale cached copy of the old /packs page is ever submitted.
  if (!CREDIT_PACKS_ON_SALE) {
    return { status: "error", error: "Reading credit packs aren't available for purchase right now." };
  }

  const parsed = formSchema.safeParse({
    optionId: formData.get("optionId")?.toString(),
    buyerEmail: formData.get("buyerEmail")?.toString(),
  });

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const option = findCreditPackOption(parsed.data.optionId);
  if (!option) {
    return { status: "error", error: "That pack option isn't available." };
  }

  let packId: string;
  try {
    const created = await createPendingPack(parsed.data.buyerEmail, option.size, option.priceCents, option.tier);
    packId = created.packId;
  } catch (err) {
    // Surface the real cause (most likely: migration 0007_add_credit_packs.sql
    // hasn't been run against this environment's Supabase project yet, so
    // the credit_packs table doesn't exist -- same "confirmed run" step
    // every prior migration in this project has needed) rather than only
    // ever showing the generic message to the buyer.
    console.error("createPackCheckoutSessionAction: failed to create pending pack", err);
    Sentry.captureException(err);
    return {
      status: "error",
      error: "We couldn't start this pack purchase just now — please try again in a moment.",
    };
  }

  const origin = await siteOrigin();
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    allow_promotion_codes: true,
    customer_email: parsed.data.buyerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: option.priceCents,
          product_data: {
            name: `${option.size}-Reading Credit Pack — ${PRICING_TIERS[option.tier].name}`,
            description: `${option.size} ${PRICING_TIERS[option.tier].name} credits, redeemable one at a time against any child's reading`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/packs/purchased?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/packs`,
    metadata: {
      kind: "creditPack",
      packId,
      buyerEmail: parsed.data.buyerEmail,
      packSize: String(option.size),
      packTier: option.tier,
    },
  });

  if (!session.url) {
    return { status: "error", error: "Could not start checkout. Please try again." };
  }

  redirect(session.url);
}
