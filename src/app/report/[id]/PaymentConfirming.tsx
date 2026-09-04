"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checkReportUnlockedAction } from "./actions";

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 20; // ~50s of polling before giving up and pointing elsewhere

/**
 * Shown in place of the locked reading when a parent has just returned
 * from Stripe Checkout but the tier hasn't landed yet -- the redirect-time
 * verification in report/[id]/page.tsx is best-effort and can lose the
 * race against Stripe's own confirmation, and the webhook that would
 * otherwise catch this isn't guaranteed to be configured in every
 * environment (e.g. a preview deployment on a Stripe sandbox with no
 * webhook secret set). Rather than silently showing the paywall again --
 * which reads as "the payment didn't work" -- this polls quietly until
 * the tier actually lands, then refreshes the page.
 */
export function PaymentConfirming({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [pollCount, setPollCount] = useState(0);
  const timedOut = pollCount >= MAX_POLLS;

  useEffect(() => {
    if (timedOut) return;

    let cancelled = false;
    const interval = setInterval(async () => {
      const unlocked = await checkReportUnlockedAction(reportId);
      if (cancelled) return;
      if (unlocked) {
        router.refresh();
        return;
      }
      setPollCount((count) => count + 1);
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [reportId, router, timedOut]);

  return (
    <div className="no-print rounded-md border border-border-soft bg-surface p-8 text-center">
      {!timedOut ? (
        <>
          <p className="font-serif text-lg font-semibold text-primary-dark">
            Payment received — unlocking your reading&hellip;
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            This usually takes just a few seconds. No need to refresh.
          </p>
        </>
      ) : (
        <>
          <p className="font-serif text-lg font-semibold text-primary-dark">
            Still confirming your payment
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            This is taking longer than it should. Try refreshing this page in
            a moment, or use{" "}
            <Link
              href="/resend-reading"
              className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
            >
              Lost your reading link?
            </Link>{" "}
            to get it emailed to you once it&apos;s ready. Nothing was
            charged twice by waiting here.
          </p>
        </>
      )}
    </div>
  );
}
