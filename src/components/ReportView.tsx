"use client";

import { useState } from "react";
import type { EducationInsights, LearningPathway } from "@/lib/education/types";
import type { ReportFormState } from "@/app/actions";
import { PathwayView } from "./PathwayView";

interface Props {
  insights: EducationInsights;
  pathway?: LearningPathway;
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

export function ReportView({ insights, pathway, meta }: Props) {
  const [pathwayRevealed, setPathwayRevealed] = useState(false);

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
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-medium text-primary-dark hover:bg-accent-soft"
        >
          🖨️ Save or print this reading
        </button>
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
        {pathway ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-5">
            {insights.focusAreas.map((item) => (
              <span
                key={item.id}
                className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
              >
                {item.title}
              </span>
            ))}
            <span className="ml-1 text-sm text-muted">
              — the full learning pathway below breaks this down subject by
              subject, plus where it may lead as {insights.childName} grows.
            </span>
          </div>
        ) : (
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
        )}
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

      {pathway && pathwayRevealed ? (
        <>
          <PathwayView pathway={pathway} childName={insights.childName} />
          <div className="no-print mt-8 rounded-2xl border border-dashed border-border bg-surface p-5 text-center text-sm text-muted">
            The top-tier reading will soon add gentle, simple remedies
            alongside this pathway — small, traditional practices some
            families like to pair with a reading like this. Nothing here
            depends on them; they&apos;ll simply be an optional extra when
            they arrive.
          </div>
        </>
      ) : (
        <section className="mt-10 rounded-2xl bg-primary p-6 text-center text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
            Free, for now
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold">
            A full personalized learning pathway
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/85">
            Go deeper — exactly which subjects are likely to come easily and
            which will need extra support, their natural direction as they
            grow (with example fields), a life-chapter timeline, their ideal
            learning environment, and a gentle weekly rhythm — all built from{" "}
            {insights.childName}&apos;s chart.
          </p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/65">
            This deeper pathway is included at no cost while we build it out.
            A paid, even more detailed version — including gentle remedies —
            is planned for later.
          </p>
          {pathway ? (
            <button
              type="button"
              onClick={() => setPathwayRevealed(true)}
              className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-soft"
            >
              Reveal the full learning pathway →
            </button>
          ) : (
            <p className="mt-5 text-sm text-white/70">
              The pathway couldn&apos;t be generated for this reading — please
              try creating the reading again.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
