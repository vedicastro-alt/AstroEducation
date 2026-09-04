import { notFound } from "next/navigation";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { getReport, markReportTier, type ReportTier } from "@/lib/reports/store";
import { verifyCheckoutSession } from "@/lib/stripe/server";
import { ReportView } from "@/components/ReportView";
import { PaymentConfirming } from "./PaymentConfirming";

// Force fully dynamic, uncached rendering. This page's content depends
// on whether a payment has just landed, and a parent returning from
// Stripe Checkout must always see the current state -- never a cached
// response. (The actual unlock-race bug turned out to be a database
// read-after-write gap, not caching -- see effectiveTier below -- but
// this is still the correct caching posture for a page whose content
// depends on payment state.)
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function SavedReportPage({
  params,
  searchParams,
}: PageProps<"/report/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : undefined;

  // Immediate unlock on return from Stripe Checkout -- best-effort UX
  // path. The session is re-verified with Stripe directly (never trusted
  // from the query string alone); the webhook remains the source of
  // truth if this is ever missed.
  let justUnlockedTier: ReportTier | null = null;
  let tierBeforeUnlock: ReportTier | null = null;
  if (sessionId) {
    tierBeforeUnlock = (await getReport(id))?.tier ?? null;
    const verified = await verifyCheckoutSession(sessionId);
    if (verified && verified.reportId === id) {
      try {
        await markReportTier(id, verified.tier, sessionId);
        justUnlockedTier = verified.tier;
      } catch (err) {
        // A transient write failure here shouldn't crash the page for a
        // parent who did genuinely pay -- the webhook is the source of
        // truth and will mark the tier shortly regardless. Surface it so
        // it's not silently lost, but degrade to the pre-unlock view.
        Sentry.captureException(err);
      }
    }
  }

  const report = await getReport(id);
  if (!report) notFound();

  // The tier we just wrote in markReportTier above is known-good --
  // trust it over a fresh read, which found in practice can still come
  // back stale (tier: null) a moment after a same-request write reports
  // success. This isn't a browser caching issue: it's read-after-write
  // consistency on the database side, and re-fetching doesn't help
  // avoid it, so don't rely on the second read for this one field.
  const effectiveTier: ReportTier | null = justUnlockedTier ?? report.tier;

  // Landed here fresh from a successful Stripe redirect, but neither the
  // immediate verification above nor an already-processed webhook has
  // marked this report as paid yet -- rather than show the paywall again
  // (which reads as "the payment didn't work"), show a quiet confirming
  // state and let the client poll until it lands.
  if (sessionId && !effectiveTier) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <PaymentConfirming reportId={report.id} />
      </div>
    );
  }

  const unlockedPathway = effectiveTier ? report.pathway : null;
  const unlockedRemedies = effectiveTier === "premium" ? report.remedies : null;
  const unlockedCareerDeepDive = effectiveTier === "premium" ? report.careerDeepDive : null;

  // A parent returning fresh from checkout should land on the content
  // they just paid for, not back at the cover. An upgrade from full to
  // premium jumps straight to the first of the two newly-unlocked
  // chapters (career-deep-dive comes before remedies in page order, so
  // landing there means both are reachable by paging forward); any other
  // fresh purchase jumps to the start of the full pathway.
  const initialPageId = justUnlockedTier
    ? tierBeforeUnlock === "full" && justUnlockedTier === "premium"
      ? "career-deep-dive"
      : "part-two"
    : undefined;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <ReportView
        reportId={report.id}
        chart={report.chart}
        insights={report.insights}
        pathway={unlockedPathway}
        remedies={unlockedRemedies}
        careerDeepDive={unlockedCareerDeepDive}
        tier={effectiveTier}
        meta={report.meta}
        initialPageId={initialPageId}
      />
      <div className="no-print mt-12 text-center">
        <Link
          href="/report"
          className="inline-block rounded-sm border border-primary/30 px-6 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-primary-tint"
        >
          Create another reading
        </Link>
      </div>
    </div>
  );
}
