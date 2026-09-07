import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/magicLink";
import { findReportsByEmail } from "@/lib/reports/store";
import { PRICING_TIERS } from "@/lib/pricing";
import { SproutIcon } from "@/components/icons";
import { MyReadingsLoginForm } from "@/components/MyReadingsLoginForm";
import { signOutOfMyReadingsAction } from "./actions";

export const metadata: Metadata = {
  title: "My Readings — Little Stargazers",
  description: "See every reading tied to your email, no password needed.",
};

// This page's content depends on a signed session cookie -- never cache
// or prerender a response meant for one specific visitor.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function MyReadingsPage({
  searchParams,
}: PageProps<"/my-readings">) {
  const sp = await searchParams;
  const expired = sp.expired === "1";

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("stargazer_session")?.value;
  const email = sessionToken ? verifySessionToken(sessionToken) : null;

  if (!email) {
    return (
      <div className="mx-auto w-full max-w-md px-6 py-16 sm:py-24">
        <SproutIcon className="h-8 w-8 text-accent" />
        <h1 className="mt-4 font-serif text-3xl font-semibold text-primary-dark">
          My Readings
        </h1>
        <p className="mt-3 text-sm leading-6 text-foreground/80">
          Add your email to any reading you create, and every one of your
          children&apos;s readings will show up here together — no
          password, just a secure link we email you.
        </p>
        {expired && (
          <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">
            That link expired or was already used — request a fresh one below.
          </p>
        )}
        <div className="mt-8">
          <MyReadingsLoginForm />
        </div>
      </div>
    );
  }

  const reports = await findReportsByEmail(email);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SproutIcon className="h-8 w-8 text-accent" />
          <h1 className="mt-4 font-serif text-3xl font-semibold text-primary-dark">
            My Readings
          </h1>
          <p className="mt-2 text-sm text-muted">Signed in as {email}</p>
        </div>
        <form action={signOutOfMyReadingsAction}>
          <button
            type="submit"
            className="whitespace-nowrap rounded-sm border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface"
          >
            Sign out
          </button>
        </form>
      </div>

      {reports.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border-soft bg-surface px-5 py-4 text-sm leading-6 text-foreground/80">
          No readings tied to this email yet. Create one and add this email
          address at intake, and it&apos;ll show up here.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 rounded-xl border border-border-soft bg-surface-raised p-4">
              <div>
                <p className="font-serif text-lg font-semibold text-primary-dark">{r.childName}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {r.tier ? PRICING_TIERS[r.tier].name : "Free preview"} · {formatDate(r.createdAt)}
                </p>
              </div>
              <Link
                href={`/report/${r.id}`}
                className="whitespace-nowrap rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link
          href="/report"
          className="inline-block rounded-sm border border-primary/30 px-6 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-primary-tint"
        >
          + Add another child&apos;s reading
        </Link>
      </div>
    </div>
  );
}
