import type { LearningPathway } from "@/lib/education/types";
import { SectionHeading } from "./SectionHeading";
import { BookIcon, CalendarIcon, CompassIcon, HomeIcon, OrbitIcon } from "./icons";

interface Props {
  pathway: LearningPathway;
  childName: string;
}

export function PathwayView({ pathway, childName }: Props) {
  return (
    <div className="mt-8 space-y-12 border-t border-border-soft pt-12">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          {childName}&apos;s full learning pathway
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-primary-dark sm:text-3xl">
          {pathway.ageBandTitle}
        </h2>
        <p className="mx-auto mt-2.5 max-w-xl text-sm leading-6 text-muted">
          {pathway.ageLabel}. {pathway.ageBandBody}
        </p>
      </div>

      <section>
        <SectionHeading icon={OrbitIcon}>This life chapter</SectionHeading>
        <div className="mt-4 rounded-2xl border border-border-soft bg-surface-raised p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {pathway.currentChapter.startLabel} – {pathway.currentChapter.endLabel} · {pathway.currentChapter.lord} Mahadasha
          </p>
          <h4 className="mt-1.5 font-serif text-base font-semibold text-primary-dark">
            {pathway.currentChapter.title}
          </h4>
          <p className="mt-1.5 text-sm leading-6 text-foreground/80">
            {pathway.currentChapter.body}
          </p>
        </div>
        {pathway.nextChapter && (
          <div className="mt-3 rounded-2xl border border-dashed border-border bg-transparent p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Looking ahead — from {pathway.nextChapter.startsInLabel} · {pathway.nextChapter.lord} Mahadasha
            </p>
            <h4 className="mt-1.5 font-serif text-base font-semibold text-primary-dark">
              {pathway.nextChapter.title}
            </h4>
            <p className="mt-1.5 text-sm leading-6 text-foreground/80">
              {pathway.nextChapter.body}
            </p>
          </div>
        )}
        <p className="mt-2.5 pl-[42px] text-xs text-muted">
          Based on the traditional Vimshottari dasha sequence — a classical
          Vedic timeline of life &quot;chapters&quot;, each ruled by a different
          planet.
        </p>
      </section>

      <section>
        <SectionHeading icon={BookIcon}>
          Subjects &amp; how they show up at school
        </SectionHeading>
        <p className="mt-1.5 pl-[42px] text-sm text-muted">
          Concrete, subject-by-subject guidance — not just broad themes.
        </p>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary-dark">
          Likely to come more naturally
        </p>
        <div className="mt-3 space-y-3">
          {pathway.subjectsInclined.map((item) => (
            <div key={item.id} className="rounded-2xl border border-success-border bg-success-soft p-5">
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

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary-dark">
          Likely to need extra support
        </p>
        <div className="mt-3 space-y-3">
          {pathway.subjectsSupport.map((item) => (
            <div key={item.id} className="rounded-2xl border border-growth-border bg-growth-soft p-5">
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
        <p className="mt-3 text-xs text-muted">
          &quot;Needs extra support&quot; means needs more patience and a
          different approach to click — not that {childName} can&apos;t do
          well here. Every child&apos;s chart shows some subjects that come
          more easily than others.
        </p>
      </section>

      <section>
        <SectionHeading icon={CompassIcon}>
          As they grow: their natural direction
        </SectionHeading>
        <p className="mt-1.5 pl-[42px] text-sm text-muted">
          A loose compass for the years ahead, not a fixed script.
        </p>
        <div className="mt-4 rounded-2xl border border-border-soft bg-surface-raised p-5">
          <h4 className="font-serif text-lg font-semibold text-primary-dark">
            {pathway.futureDirection.title}
          </h4>
          <p className="mt-1 text-sm italic text-muted">
            A natural pull toward {pathway.futureDirection.essence}.
          </p>
          <div className="mt-4 space-y-3">
            {pathway.futureDirection.stages.map((stage) => (
              <div key={stage.label} className="border-l-2 border-accent-soft pl-3.5">
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
        <p className="mt-2.5 pl-[42px] text-xs text-muted">
          Interests and aptitude often evolve well beyond what any chart can
          predict — treat this as a starting compass, not a destination.
        </p>
      </section>

      <section>
        <SectionHeading icon={HomeIcon}>Their ideal learning environment</SectionHeading>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {pathway.environment.map((tip) => (
            <div key={tip.id} className="rounded-2xl border border-growth-border bg-growth-soft p-5">
              <h4 className="font-serif text-sm font-semibold text-primary-dark">
                {tip.title}
              </h4>
              <p className="mt-1.5 text-sm leading-6 text-foreground/80">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border-soft bg-surface-raised p-6">
        <SectionHeading icon={CalendarIcon}>A gentle weekly rhythm</SectionHeading>
        <ul className="mt-4 space-y-2.5 pl-[42px] text-sm leading-6 text-foreground/80">
          {pathway.weeklyRhythm.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span aria-hidden className="text-accent">·</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-sm italic leading-6 text-muted">
        {pathway.closing}
      </p>
    </div>
  );
}
