import { notFound } from "next/navigation";
import Link from "next/link";
import { getReport } from "@/lib/reports/store";
import { ReportView } from "@/components/ReportView";

export default async function SavedReportPage({ params }: PageProps<"/report/[id]">) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <ReportView
        insights={report.insights}
        pathway={report.pathway}
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
