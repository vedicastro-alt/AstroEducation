"use client";

import { useState } from "react";
import type { EducationInsights, LearningPathway } from "@/lib/education/types";
import type { ReportMeta } from "@/lib/reports/store";
import { PathwayView } from "./PathwayView";
import { ChartWheel } from "./ChartWheel";
import { SectionHeading } from "./SectionHeading";
import { MoonIcon, PrinterIcon, StarIcon, SproutIcon, TargetIcon } from "./icons";

interface Props {
  insights: EducationInsights;
  pathway?: LearningPathway | null;
  meta: ReportMeta;
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
      <div className="relative overflow-hidden rounded-[2rem] border border-border-soft bg-primary p-8 text-center shadow-[0_20px_50px_-25px_rgba(44,40,97,0.45)] sm:p-10">
        <ChartWheel className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 text-white/10" />
        <ChartWheel className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 text-white/5" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">
            {insights.childName}&apos;s learning reading
          </p>
          <p className="mt-2 text-sm text-white/60">
            Born {formatDob(meta.dob)} in {meta.placeLabel}
          </p>
          <h1 className="mx-auto mt-5 max-w-xl font-serif text-2xl font-semibold leading-snug text-white sm:text-3xl">
            {insights.headline}
          </h1>
          {meta.timeUnknown && (
            <p className="mx-auto mt-5 max-w-md rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white/75">
              Birth time wasn&apos;t provided, so this reading uses a midday
              estimate. Everything below is still meaningful, though a couple
              of fine details may shift slightly with an exact time.
            </p>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10"
          >
            <PrinterIcon className="h-3.5 w-3.5" />
            Save or print this reading
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border-soft bg-surface-raised p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Rising Sign · {meta.ascendant}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/80">
            {insights.ascendantSummary}
          </p>
        </div>
        <div className="rounded-2xl border border-border-soft bg-surface-raised p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Moon · {meta.moonSign} · {meta.moonNakshatra}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/80">
            {insights.moonSummary}
          </p>
        </div>
      </div>

      <section className="mt-12">
        <SectionHeading icon={StarIcon}>Natural strengths</SectionHeading>
        <div className="mt-4 space-y-3">
          {insights.strengths.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-success-border bg-success-soft p-5"
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

      <section className="mt-12">
        <SectionHeading icon={SproutIcon}>Areas to nurture</SectionHeading>
        <p className="mt-1.5 pl-[42px] text-sm text-muted">
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

      <section className="mt-12">
        <SectionHeading icon={TargetIcon}>Recommended focus areas</SectionHeading>
        <p className="mt-1.5 pl-[42px] text-sm text-muted">
          Based on this chart, these are promising places to focus early
          learning energy.
        </p>
        {pathway ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border-soft bg-surface-raised p-5">
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
                className="rounded-2xl border border-border-soft bg-surface-raised p-5"
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
                  {item.tip}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 rounded-2xl border border-border-soft bg-surface-raised p-6">
        <div className="flex items-center gap-2.5">
          <MoonIcon className="h-4 w-4 text-accent" />
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            A few gentle reminders
          </h2>
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground/80">
          {insights.learningTips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span aria-hidden className="text-accent">·</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {pathway && pathwayRevealed ? (
        <>
          <PathwayView pathway={pathway} childName={insights.childName} />
          <div className="no-print mt-8 rounded-2xl border border-dashed border-border bg-surface-raised p-5 text-center text-sm text-muted">
            The top-tier reading will soon add gentle, simple remedies
            alongside this pathway — small, traditional practices some
            families like to pair with a reading like this. Nothing here
            depends on them; they&apos;ll simply be an optional extra when
            they arrive.
          </div>
        </>
      ) : (
        <section className="relative mt-12 overflow-hidden rounded-[2rem] bg-primary-dark p-8 text-center text-white sm:p-10">
          <ChartWheel className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 text-white/5" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">
              Free, for now
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl">
              A full personalized learning pathway
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/70">
              Go deeper — exactly which subjects are likely to come easily and
              which will need extra support, their natural direction as they
              grow (with example fields), a life-chapter timeline, their ideal
              learning environment, and a gentle weekly rhythm — all built from{" "}
              {insights.childName}&apos;s chart.
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/50">
              This deeper pathway is included at no cost while we build it out.
              A paid, even more detailed version — including gentle remedies —
              is planned for later.
            </p>
            {pathway ? (
              <button
                type="button"
                onClick={() => setPathwayRevealed(true)}
                className="mt-6 rounded-full bg-accent-bright px-7 py-3 text-sm font-semibold text-primary-dark shadow-lg shadow-black/20 transition-transform hover:scale-[1.02] hover:bg-accent-bright/90"
              >
                Reveal the full learning pathway →
              </button>
            ) : (
              <p className="mt-6 text-sm text-white/60">
                The pathway couldn&apos;t be generated for this reading — please
                try creating the reading again.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
