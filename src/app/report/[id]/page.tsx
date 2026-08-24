import { notFound } from "next/navigation";
import Link from "next/link";
import { getReport } from "@/lib/reports/store";
import { ReportView } from "@/components/ReportView";

export default async function SavedReportPage({ params }: PageProps<"/report/[id]">) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <ReportView
        insights={report.insights}
        pathway={report.pathway}
        meta={report.meta}
      />
      <div className="no-print mt-10 text-center">
        <Link
          href="/report"
          className="inline-block rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary-dark hover:bg-accent-soft"
        >
          Create another reading
        </Link>
      </div>
    </div>
  );
}
