"use client";

import { useMemo, useState } from "react";
import type { EducationInsights, LearningPathway } from "@/lib/education/types";
import type { ReportMeta } from "@/lib/reports/store";
import { BookReader, type BookPage } from "./BookReader";
import { buildPathwayPages } from "./pathwayPages";
import { ChartWheel } from "./ChartWheel";
import { IconPattern } from "./IconPattern";
import { SectionHeading } from "./SectionHeading";
import { MoonIcon, OrbitIcon, PrinterIcon, StarIcon, SproutIcon, TargetIcon } from "./icons";

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
  const [pageIndex, setPageIndex] = useState(0);

  const freePages: BookPage[] = useMemo(
    () => [
      {
        id: "cover",
        chapterLabel: "Cover",
        background: "bg-primary text-white",
        content: (
          <div className="relative flex min-h-[22rem] flex-col items-center justify-center text-center sm:min-h-[26rem]">
            <ChartWheel className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-white/10" />
            <ChartWheel className="pointer-events-none absolute -left-16 -bottom-10 h-56 w-56 text-white/5" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">
              {insights.childName}&apos;s learning reading
            </p>
            <p className="relative mt-2 text-sm text-white/60">
              Born {formatDob(meta.dob)} in {meta.placeLabel}
            </p>
            <h1 className="relative mx-auto mt-5 max-w-xl font-serif text-2xl font-semibold leading-snug sm:text-3xl">
              {insights.headline}
            </h1>
            {meta.timeUnknown && (
              <p className="relative mx-auto mt-5 max-w-md rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white/75">
                Birth time wasn&apos;t provided, so this reading uses a
                midday estimate. Everything ahead is still meaningful,
                though a couple of fine details may shift slightly with an
                exact time.
              </p>
            )}
          </div>
        ),
      },
      {
        id: "chart-glance",
        chapterLabel: "Their chart at a glance",
        content: (
          <div className="relative">
            <div className="text-primary">
              <IconPattern icon={OrbitIcon} />
            </div>
            <div className="relative">
              <h2 className="font-serif text-xl font-semibold text-primary-dark sm:text-2xl">
                Their chart, at a glance
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-1">
                <div className="rounded-2xl border border-border-soft bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Rising Sign · {meta.ascendant}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground/80">
                    {insights.ascendantSummary}
                  </p>
                </div>
                <div className="rounded-2xl border border-border-soft bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Moon · {meta.moonSign} · {meta.moonNakshatra}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground/80">
                    {insights.moonSummary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "strengths",
        chapterLabel: "Natural strengths",
        background: "bg-success-soft",
        content: (
          <div className="relative">
            <div className="text-success">
              <IconPattern icon={StarIcon} />
            </div>
            <div className="relative">
              <SectionHeading icon={StarIcon}>Natural strengths</SectionHeading>
              <div className="mt-5 space-y-3">
                {insights.strengths.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/80 bg-white/70 p-5">
                    <h3 className="font-serif text-base font-semibold text-primary-dark">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "nurture",
        chapterLabel: "Areas to nurture",
        background: "bg-growth-soft",
        content: (
          <div className="relative">
            <div className="text-growth">
              <IconPattern icon={SproutIcon} />
            </div>
            <div className="relative">
              <SectionHeading icon={SproutIcon}>Areas to nurture</SectionHeading>
              <p className="mt-1.5 pl-[42px] text-sm text-foreground/70">
                Every child has some — these simply need a little more
                patience, not worry.
              </p>
              <div className="mt-5 space-y-3">
                {insights.growthAreas.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/80 bg-white/70 p-5">
                    <h3 className="font-serif text-base font-semibold text-primary-dark">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "focus-areas",
        chapterLabel: "Recommended focus areas",
        content: (
          <div className="relative">
            <div className="text-accent">
              <IconPattern icon={TargetIcon} />
            </div>
            <div className="relative">
              <SectionHeading icon={TargetIcon}>Recommended focus areas</SectionHeading>
              <p className="mt-1.5 pl-[42px] text-sm text-muted">
                Based on this chart, these are promising places to focus early
                learning energy.
              </p>
              {pathway ? (
                <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-border-soft bg-white/70 p-5">
                  {insights.focusAreas.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
                    >
                      {item.title}
                    </span>
                  ))}
                  <span className="ml-1 text-sm text-muted">
                    — the full learning pathway ahead breaks this down subject
                    by subject, plus where it may lead as {insights.childName}{" "}
                    grows.
                  </span>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {insights.focusAreas.map((item, i) => (
                    <div key={item.id} className="rounded-2xl border border-border-soft bg-white/70 p-5">
                      <p className="text-xs font-semibold text-accent">Focus {i + 1}</p>
                      <h3 className="mt-1 font-serif text-base font-semibold text-primary-dark">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
                      <p className="mt-2.5 rounded-lg bg-surface-raised px-3 py-2 text-xs text-muted">
                        {item.tip}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "reminders",
        chapterLabel: "A few gentle reminders",
        background: "bg-primary-tint",
        content: (
          <div className="relative">
            <div className="text-primary">
              <IconPattern icon={MoonIcon} />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2.5">
                <MoonIcon className="h-4 w-4 text-accent" />
                <h2 className="font-serif text-lg font-semibold text-primary-dark">
                  A few gentle reminders
                </h2>
              </div>
              <ul className="mt-4 space-y-2 pl-[42px] text-sm leading-6 text-foreground/80">
                {insights.learningTips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span aria-hidden className="text-accent">·</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "cta",
        chapterLabel: "The full pathway",
        background: "bg-primary-dark text-white",
        content: (
          <div className="relative flex min-h-[20rem] flex-col items-center justify-center text-center sm:min-h-[24rem]">
            <ChartWheel className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 text-white/5" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">
                Free, for now
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl">
                A full personalized learning pathway
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/70">
                Go deeper — exactly which subjects are likely to come easily
                and which will need extra support, their natural direction
                as they grow (with example fields), a life-chapter timeline,
                their ideal learning environment, and a gentle weekly
                rhythm — all built from {insights.childName}&apos;s chart.
              </p>
              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/50">
                This deeper pathway is included at no cost while we build it
                out. A paid, even more detailed version — including gentle
                remedies — is planned for later.
              </p>
              {pathway ? (
                <button
                  type="button"
                  onClick={() => {
                    setPathwayRevealed(true);
                    setPageIndex(6);
                  }}
                  className="mt-6 rounded-full bg-accent-bright px-7 py-3 text-sm font-semibold text-primary-dark shadow-lg shadow-black/20 transition-transform hover:scale-[1.02] hover:bg-accent-bright/90"
                >
                  Turn the page →
                </button>
              ) : (
                <p className="mt-6 text-sm text-white/60">
                  The pathway couldn&apos;t be generated for this reading —
                  please try creating the reading again.
                </p>
              )}
            </div>
          </div>
        ),
      },
    ],
    [insights, meta, pathway],
  );

  const pages: BookPage[] = useMemo(() => {
    if (pathwayRevealed && pathway) {
      return [...freePages.slice(0, -1), ...buildPathwayPages(pathway, insights.childName)];
    }
    return freePages;
  }, [freePages, pathwayRevealed, pathway, insights.childName]);

  return (
    <BookReader
      pages={pages}
      index={pageIndex}
      onIndexChange={setPageIndex}
      headerRight={
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-primary-dark transition-colors hover:bg-primary-tint"
        >
          <PrinterIcon className="h-3.5 w-3.5" />
          Save / print
        </button>
      }
    />
  );
}
