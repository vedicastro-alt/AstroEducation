import type { LearningPathway } from "@/lib/education/types";
import type { GentleRemedy } from "@/lib/education/remedies";
import type { BookPage } from "./BookReader";
import { ChartWheel } from "./ChartWheel";
import { IconPattern } from "./IconPattern";
import { SectionHeading } from "./SectionHeading";
import {
  BookIcon,
  CalendarIcon,
  CandleIcon,
  CompassIcon,
  HomeIcon,
  OrbitIcon,
  SparkleIcon,
} from "./icons";

/**
 * `remedies` is passed only when the report's purchased tier includes
 * them (Tier 2, "The Complete Constellation Reading") -- gating happens
 * at the caller, this just adds the chapter when given something to show.
 */
export function buildPathwayPages(
  pathway: LearningPathway,
  childName: string,
  remedies: GentleRemedy[] | null = null,
): BookPage[] {
  const remedyPage: BookPage[] = remedies && remedies.length > 0
    ? [
        {
          id: "remedies",
          chapterLabel: "Gentle remedies",
          background: "bg-accent-soft",
          content: (
            <div className="relative">
              <div className="text-accent">
                <IconPattern icon={CandleIcon} />
              </div>
              <div className="relative">
                <SectionHeading icon={CandleIcon}>Gentle remedies</SectionHeading>
                <p className="mt-1.5 pl-[42px] text-sm text-foreground/70">
                  Small, traditional, optional practices some families
                  enjoy pairing with a reading like this — never
                  requirements, and nothing here costs more than a plant
                  or a pen.
                </p>
                <div className="mt-5 space-y-3">
                  {remedies.map((remedy) => (
                    <div key={remedy.id} className="rounded-2xl border border-white/80 bg-white/70 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                        {remedy.planet} · {remedy.theme}
                      </p>
                      <p className="mt-1.5 text-sm leading-6 text-foreground/80">{remedy.body}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-foreground/60">
                  These are gentle nods to tradition, offered in the same
                  spirit as the rest of this reading — take what feels
                  useful for {childName}, and leave the rest.
                </p>
              </div>
            </div>
          ),
        },
      ]
    : [];

  return [
    {
      id: "part-two",
      chapterLabel: "Part Two",
      background: "bg-primary text-white",
      content: (
        <div className="relative flex min-h-[22rem] flex-col items-center justify-center text-center sm:min-h-[26rem]">
          <ChartWheel className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-white/10" />
          <ChartWheel className="pointer-events-none absolute -left-16 -bottom-10 h-56 w-56 text-white/5" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">
            Part Two
          </p>
          <h2 className="relative mt-3 font-serif text-3xl font-semibold sm:text-4xl">
            {childName}&apos;s Full Learning Pathway
          </h2>
          <p className="relative mt-2 font-serif text-lg italic text-white/80">
            {pathway.ageBandTitle}
          </p>
          <p className="relative mt-4 max-w-md text-sm leading-6 text-white/65">
            {pathway.ageLabel}. {pathway.ageBandBody}
          </p>
        </div>
      ),
    },
    {
      id: "life-chapter",
      chapterLabel: "This life chapter",
      content: (
        <div className="relative">
          <div className="text-primary">
            <IconPattern icon={OrbitIcon} />
          </div>
          <div className="relative">
            <SectionHeading icon={OrbitIcon}>This life chapter</SectionHeading>
            <div className="mt-5 rounded-2xl border border-border-soft bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {pathway.currentChapter.startLabel} – {pathway.currentChapter.endLabel} · {pathway.currentChapter.lord}&apos;s period
              </p>
              <h4 className="mt-1.5 font-serif text-base font-semibold text-primary-dark">
                {pathway.currentChapter.title}
              </h4>
              <p className="mt-1.5 text-sm leading-6 text-foreground/80">
                {pathway.currentChapter.body}
              </p>
            </div>
            {pathway.nextChapter && (
              <div className="mt-3 rounded-2xl border border-dashed border-border p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Looking ahead — from {pathway.nextChapter.startsInLabel} · {pathway.nextChapter.lord}&apos;s period
                </p>
                <h4 className="mt-1.5 font-serif text-base font-semibold text-primary-dark">
                  {pathway.nextChapter.title}
                </h4>
                <p className="mt-1.5 text-sm leading-6 text-foreground/80">
                  {pathway.nextChapter.body}
                </p>
              </div>
            )}
            <p className="mt-3 pl-[42px] text-xs text-muted">
              Based on a traditional Vedic timeline of life
              &quot;chapters&quot;, each guided by a different planet.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "subjects-inclined",
      chapterLabel: "Subjects that come naturally",
      background: "bg-success-soft",
      content: (
        <div className="relative">
          <div className="text-success">
            <IconPattern icon={BookIcon} />
          </div>
          <div className="relative">
            <SectionHeading icon={BookIcon}>
              Subjects likely to come naturally
            </SectionHeading>
            <p className="mt-1.5 pl-[42px] text-sm text-foreground/70">
              Concrete, subject-by-subject guidance — not just broad themes.
            </p>
            <div className="mt-5 space-y-3">
              {pathway.subjectsInclined.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/80 bg-white/70 p-5">
                  <h4 className="font-serif text-base font-semibold text-primary-dark">
                    {item.name}
                  </h4>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
                  <p className="mt-2.5 rounded-lg bg-white/70 px-3 py-2 text-xs text-muted">
                    {item.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "subjects-support",
      chapterLabel: "Subjects that need support",
      background: "bg-growth-soft",
      content: (
        <div className="relative">
          <div className="text-growth">
            <IconPattern icon={BookIcon} />
          </div>
          <div className="relative">
            <SectionHeading icon={BookIcon}>
              Subjects likely to need extra support
            </SectionHeading>
            <p className="mt-1.5 pl-[42px] text-sm text-foreground/70">
              Needs more patience and a different approach to click — not
              that {childName} can&apos;t do well here.
            </p>
            <div className="mt-5 space-y-3">
              {pathway.subjectsSupport.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/80 bg-white/70 p-5">
                  <h4 className="font-serif text-base font-semibold text-primary-dark">
                    {item.name}
                  </h4>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
                  <p className="mt-2.5 rounded-lg bg-white/70 px-3 py-2 text-xs text-muted">
                    {item.tip}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-foreground/60">
              Every child&apos;s chart shows some subjects that come more
              easily than others — this is simply a map of where to bring a
              little extra patience.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "direction",
      chapterLabel: "Their natural direction",
      background: "bg-accent-soft",
      content: (
        <div className="relative">
          <div className="text-accent">
            <IconPattern icon={CompassIcon} />
          </div>
          <div className="relative">
            <SectionHeading icon={CompassIcon}>
              As they grow: their natural direction
            </SectionHeading>
            <p className="mt-1.5 pl-[42px] text-sm text-foreground/70">
              A loose compass for the years ahead, not a fixed script.
            </p>
            <div className="mt-5 rounded-2xl border border-white/80 bg-white/70 p-5">
              <h4 className="font-serif text-lg font-semibold text-primary-dark">
                {pathway.futureDirection.title}
              </h4>
              <p className="mt-1 text-sm italic text-muted">
                A natural pull toward {pathway.futureDirection.essence}.
              </p>
              <div className="mt-4 space-y-3">
                {pathway.futureDirection.stages.map((stage) => (
                  <div key={stage.label} className="border-l-2 border-accent pl-3.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {stage.label}
                    </p>
                    <p className="mt-0.5 text-sm leading-6 text-foreground/80">{stage.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Fields that often suit this profile
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pathway.futureDirection.fields.map((field) => (
                    <span
                      key={field}
                      className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              {pathway.futureDirection.secondary && (
                <p className="mt-4 rounded-lg bg-background px-3 py-2.5 text-xs leading-5 text-muted">
                  <span className="font-semibold text-primary-dark">
                    {pathway.futureDirection.secondary.title}:
                  </span>{" "}
                  {pathway.futureDirection.secondary.body}
                </p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "environment",
      chapterLabel: "Their ideal environment",
      background: "bg-primary-tint",
      content: (
        <div className="relative">
          <div className="text-primary">
            <IconPattern icon={HomeIcon} />
          </div>
          <div className="relative">
            <SectionHeading icon={HomeIcon}>Their ideal learning environment</SectionHeading>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {pathway.environment.map((tip) => (
                <div key={tip.id} className="rounded-2xl border border-white/80 bg-white/70 p-5">
                  <h4 className="font-serif text-sm font-semibold text-primary-dark">
                    {tip.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/80">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    ...remedyPage,
    {
      id: "closing",
      chapterLabel: "A gentle weekly rhythm",
      background: "bg-primary-dark text-white",
      content: (
        <div className="relative">
          <ChartWheel className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 text-white/5" />
          <div className="relative flex items-center gap-2.5">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/10 text-accent-bright">
              <CalendarIcon className="h-4 w-4" />
            </span>
            <h2 className="font-serif text-xl font-semibold sm:text-2xl">
              A gentle weekly rhythm
            </h2>
          </div>
          <ul className="relative mt-4 space-y-2.5 pl-[42px] text-sm leading-6 text-white/75">
            {pathway.weeklyRhythm.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span aria-hidden className="text-accent-bright">·</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <p className="relative mt-8 text-center text-sm italic leading-6 text-white/60">
            {pathway.closing}
          </p>
          <div className="relative mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
            <SparkleIcon className="h-3.5 w-3.5" />
            End of {childName}&apos;s reading
            <SparkleIcon className="h-3.5 w-3.5" />
          </div>
        </div>
      ),
    },
  ];
}
