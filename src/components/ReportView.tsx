import type { EducationInsights } from "@/lib/education/types";
import type { ReportFormState } from "@/app/actions";

interface Props {
  insights: EducationInsights;
  meta: NonNullable<ReportFormState["meta"]>;
}

function formatDob(dob: string) {
  const d = new Date(dob + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ReportView({ insights, meta }: Props) {
  return (
    <div>
      <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-accent">
          {insights.childName}&apos;s learning reading
        </p>
        <p className="mt-1 text-sm text-muted">
          Born {formatDob(meta.dob)} in {meta.placeLabel}
        </p>
        <h1 className="mt-4 font-serif text-2xl font-semibold leading-snug text-primary-dark sm:text-3xl">
          {insights.headline}
        </h1>
        {meta.timeUnknown && (
          <p className="mx-auto mt-4 max-w-md rounded-xl bg-accent-soft px-4 py-2.5 text-xs text-primary-dark">
            Birth time wasn&apos;t provided, so this reading uses a midday
            estimate. Everything below is still meaningful, though a couple of
            fine details may shift slightly with an exact time.
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Rising Sign · {meta.ascendant}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/80">
            {insights.ascendantSummary}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Moon · {meta.moonSign} · {meta.moonNakshatra}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/80">
            {insights.moonSummary}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-primary-dark">
          🌟 Natural strengths
        </h2>
        <div className="mt-4 space-y-3">
          {insights.strengths.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-success-soft bg-success-soft p-5"
            >
              <h3 className="font-serif text-base font-semibold text-primary-dark">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-foreground/80">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-primary-dark">
          🌱 Areas to nurture
        </h2>
        <p className="mt-1 text-sm text-muted">
          Every child has some — these simply need a little more patience,
          not worry.
        </p>
        <div className="mt-4 space-y-3">
          {insights.growthAreas.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-growth-border bg-growth-soft p-5"
            >
              <h3 className="font-serif text-base font-semibold text-primary-dark">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-foreground/80">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-primary-dark">
          🎯 Recommended focus areas
        </h2>
        <p className="mt-1 text-sm text-muted">
          Based on this chart, these are promising places to focus early
          learning energy.
        </p>
        <div className="mt-4 space-y-3">
          {insights.focusAreas.map((item, i) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <p className="text-xs font-semibold text-accent">
                Focus {i + 1}
              </p>
              <h3 className="mt-1 font-serif text-base font-semibold text-primary-dark">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-foreground/80">
                {item.body}
              </p>
              <p className="mt-2.5 rounded-lg bg-background px-3 py-2 text-xs text-muted">
                💡 {item.tip}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-serif text-xl font-semibold text-primary-dark">
          A few gentle reminders
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground/80">
          {insights.learningTips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl bg-primary p-6 text-center text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
          Coming soon
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold">
          A full personalized learning pathway
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/85">
          We&apos;re building a deeper report — specific subjects, a week-by-week
          focus plan, and curriculum recommendations tailored to{" "}
          {insights.childName}&apos;s chart. It will be available soon as a
          one-time purchase, building on this free reading.
        </p>
        <button
          type="button"
          disabled
          className="mt-5 cursor-not-allowed rounded-full bg-white/20 px-6 py-3 text-sm font-semibold text-white opacity-80"
        >
          Full pathway — coming soon
        </button>
      </section>
    </div>
  );
}
