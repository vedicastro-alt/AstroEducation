import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/magicLink";
import { findReportsByEmail, getReport } from "@/lib/reports/store";
import { buildSiblingCompatibility } from "@/lib/education/siblingCompatibility";
import { SproutIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Compare two readings — Little Stargazers",
  description: "See how two of your children's charts might move through the same home together.",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function CompareSiblingsPage({
  searchParams,
}: PageProps<"/my-readings/compare">) {
  const sp = await searchParams;
  const aId = typeof sp.a === "string" ? sp.a : undefined;
  const bId = typeof sp.b === "string" ? sp.b : undefined;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("stargazer_session")?.value;
  const email = sessionToken ? verifySessionToken(sessionToken) : null;

  if (!email) {
    return (
      <div className="mx-auto w-full max-w-md px-6 py-16 sm:py-24">
        <SproutIcon className="h-8 w-8 text-accent" />
        <h1 className="mt-4 font-serif text-3xl font-semibold text-primary-dark">
          Compare two readings
        </h1>
        <p className="mt-3 text-sm leading-6 text-foreground/80">
          Sign in to{" "}
          <Link href="/my-readings" className="font-medium text-primary-dark underline underline-offset-2">
            My Readings
          </Link>{" "}
          first — this compares two of your own children&apos;s readings,
          so we need to know which readings are actually yours.
        </p>
      </div>
    );
  }

  const reports = await findReportsByEmail(email);
  const paidReports = reports.filter((r) => r.tier);

  // Both charts must be paid, real readings tied to this exact email --
  // never trusted from the URL alone, since a signed-in visitor could
  // otherwise type any report id into `a`/`b` and see another family's
  // child's chart. Gating to *paid* reports (not just any free preview)
  // is a deliberate, current choice, not a technical limit -- see
  // HANDOFF §55 B1 on why this stays free-to-view for now rather than a
  // separately priced product.
  const ownedIds = new Set(paidReports.map((r) => r.id));
  const canCompare = aId && bId && aId !== bId && ownedIds.has(aId) && ownedIds.has(bId);

  let compareError: string | null = null;
  let compareContent: React.ReactNode = null;

  if (aId && bId && !canCompare) {
    compareError =
      aId === bId
        ? "Pick two different readings to compare."
        : "That reading isn't available to compare — only your own paid readings can be compared.";
  } else if (canCompare) {
    const [reportA, reportB] = await Promise.all([getReport(aId!), getReport(bId!)]);
    if (!reportA || !reportB) {
      compareError = "One of those readings couldn't be found — please try again.";
    } else {
      const result = buildSiblingCompatibility(
        reportA.chart,
        reportA.insights.childName,
        reportA.insights,
        reportB.chart,
        reportB.insights.childName,
        reportB.insights,
      );
      compareContent = (
        <div className="mt-8 space-y-5">
          <div className="rounded-xl border border-accent/25 bg-accent-soft px-5 py-4 text-sm leading-6 text-accent">
            This is a free bonus for families with two paid readings, not a
            separate purchase — see it as a thank-you, not a new product,
            for now.
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[result.childA, result.childB].map((c) => (
              <div key={c.name} className="rounded-xl border border-border-soft bg-surface-raised p-5">
                <h3 className="font-serif text-lg font-semibold text-primary-dark">{c.name}</h3>
                <p className="mt-1.5 text-sm text-foreground/75">{c.topStrengthTitle}</p>
                <p className="mt-2 text-xs text-muted">{c.moonCitation}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border-soft bg-surface p-5">
            <h3 className="font-serif text-base font-semibold text-primary-dark">
              How their temperaments meet
            </h3>
            <p className="mt-2 text-sm leading-6 text-foreground/80">{result.temperamentNote}</p>
          </div>

          <div className="rounded-xl border border-border-soft bg-surface p-5">
            <h3 className="font-serif text-base font-semibold text-primary-dark">
              How their pace compares
            </h3>
            <p className="mt-2 text-sm leading-6 text-foreground/80">{result.paceNote}</p>
          </div>

          <div className="rounded-xl border border-border-soft bg-surface p-5">
            <h3 className="font-serif text-base font-semibold text-primary-dark">
              A practical household note
            </h3>
            <p className="mt-2 text-sm leading-6 text-foreground/80">{result.householdTip}</p>
          </div>

          <p className="text-xs italic leading-5 text-muted">{result.reminder}</p>
        </div>
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <SproutIcon className="h-8 w-8 text-accent" />
      <h1 className="mt-4 font-serif text-3xl font-semibold text-primary-dark">
        Compare two readings
      </h1>
      <p className="mt-2 text-sm text-muted">Signed in as {email}</p>

      {paidReports.length < 2 ? (
        <p className="mt-8 rounded-xl border border-border-soft bg-surface px-5 py-4 text-sm leading-6 text-foreground/80">
          This compares two of your children&apos;s paid readings side by
          side — you&apos;ll need two before there&apos;s anything to
          compare. You currently have {paidReports.length} paid reading
          {paidReports.length === 1 ? "" : "s"} tied to this email.{" "}
          <Link href="/report" className="font-medium text-primary-dark underline underline-offset-2">
            Start another child&apos;s reading
          </Link>
          .
        </p>
      ) : (
        <form method="GET" className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="a" className="mb-1.5 block text-sm font-medium text-foreground">
                First child
              </label>
              <select
                id="a"
                name="a"
                defaultValue={aId ?? ""}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="" disabled>
                  Choose a reading
                </option>
                {paidReports.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.childName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="b" className="mb-1.5 block text-sm font-medium text-foreground">
                Second child
              </label>
              <select
                id="b"
                name="b"
                defaultValue={bId ?? ""}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="" disabled>
                  Choose a reading
                </option>
                {paidReports.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.childName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
          >
            Compare
          </button>
        </form>
      )}

      {compareError && (
        <p className="mt-6 rounded-xl border border-accent/25 bg-accent-soft px-5 py-4 text-sm text-accent">
          {compareError}
        </p>
      )}

      {compareContent}

      <div className="mt-10">
        <Link href="/my-readings" className="text-sm font-medium text-primary-dark underline underline-offset-2">
          ← Back to My Readings
        </Link>
      </div>
    </div>
  );
}
