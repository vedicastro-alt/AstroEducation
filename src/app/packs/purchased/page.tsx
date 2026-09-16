import type { Metadata } from "next";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { SparkleIcon } from "@/components/icons";
import { verifyPackCheckoutSession } from "@/lib/stripe/server";
import { markPackPaid } from "@/lib/creditPacks/store";

export const metadata: Metadata = {
  title: "Pack purchased — Little Stargazers",
  description: "Your reading credits are ready to redeem.",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Immediate, best-effort confirmation on return from Stripe -- mirrors
 * report/[id]/page.tsx's own redirect-time verification. A real gap
 * found live (HANDOFF §63 follow-up): this page used to do nothing but
 * show a static "your credits are ready" message, trusting the Stripe
 * webhook alone to actually call markPackPaid. On an environment where
 * the webhook isn't configured for this exact URL (a preview deployment,
 * most often -- the same scenario verifyCheckoutSession's own comment
 * already flags for reports), a pack purchase charged the buyer
 * successfully but never granted a single credit. The webhook remains
 * the authoritative path if this is ever missed (e.g. the tab closes
 * before the redirect completes); this just closes the common case.
 */
export default async function PackPurchasedPage({
  searchParams,
}: PageProps<"/packs/purchased">) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : undefined;

  if (sessionId) {
    try {
      const verified = await verifyPackCheckoutSession(sessionId);
      if (verified) {
        await markPackPaid(verified.packId, sessionId);
      }
    } catch (err) {
      // Never block the confirmation page on this -- the webhook is
      // still there as a fallback, and a failure here shouldn't look
      // like the payment itself failed.
      Sentry.captureException(err);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-24 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
        <SparkleIcon className="h-6 w-6" />
      </span>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-primary-dark">Your credits are ready</h1>
      <p className="mt-3 text-muted">
        Whenever you&apos;re ready for a reading, add the same email you
        just used here to that child&apos;s reading, and a credit unlocks
        it automatically — no need to pay again. Valid for 3 years from
        today.
      </p>
      <Link
        href="/report"
        className="mt-8 inline-block rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
      >
        Start a reading now
      </Link>
    </div>
  );
}
