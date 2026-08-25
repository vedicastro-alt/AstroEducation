import { notFound } from "next/navigation";
import Link from "next/link";
import { getReport, markReportTier, type ReportTier } from "@/lib/reports/store";
import { verifyCheckoutSession } from "@/lib/stripe/server";
import { ReportView } from "@/components/ReportView";

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
      await markReportTier(id, verified.tier, sessionId);
      justUnlockedTier = verified.tier;
    }
  }

  const report = await getReport(id);
  if (!report) notFound();

  const unlockedPathway = report.tier ? report.pathway : null;
  const unlockedRemedies = report.tier === "premium" ? report.remedies : null;

  // A parent returning fresh from checkout should land on the content
  // they just paid for, not back at the cover. An upgrade from full to
  // premium jumps straight to the new remedies chapter; any other fresh
  // purchase jumps to the start of the full pathway.
  const initialPageId = justUnlockedTier
    ? tierBeforeUnlock === "full" && justUnlockedTier === "premium"
      ? "remedies"
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
        tier={report.tier}
        meta={report.meta}
        initialPageId={initialPageId}
      />
      <div className="no-print mt-12 text-center">
        <Link
          href="/report"
          className="inline-block rounded-full border border-primary/30 px-6 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-primary-tint"
        >
          Create another reading
        </Link>
      </div>
    </div>
  );
}
