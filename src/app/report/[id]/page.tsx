import { notFound } from "next/navigation";
import Link from "next/link";
import { getReport, markReportTier } from "@/lib/reports/store";
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
  if (sessionId) {
    const verified = await verifyCheckoutSession(sessionId);
    if (verified && verified.reportId === id) {
      await markReportTier(id, verified.tier, sessionId);
    }
  }

  const report = await getReport(id);
  if (!report) notFound();

  const unlockedPathway = report.tier ? report.pathway : null;
  const unlockedRemedies = report.tier === "premium" ? report.remedies : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <ReportView
        reportId={report.id}
        insights={report.insights}
        pathway={unlockedPathway}
        remedies={unlockedRemedies}
        tier={report.tier}
        meta={report.meta}
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
