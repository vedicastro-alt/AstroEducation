import type { LearningPathway } from "@/lib/education/types";

interface Props {
  pathway: LearningPathway;
  childName: string;
}

export function PathwayView({ pathway, childName }: Props) {
  return (
    <div className="mt-6 space-y-10 border-t border-border pt-10">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          {childName}&apos;s full learning pathway
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-primary-dark">
          {pathway.ageBandTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
          {pathway.ageLabel}. {pathway.ageBandBody}
        </p>
      </div>

      <section>
        <h3 className="font-serif text-xl font-semibold text-primary-dark">
          🪐 This life chapter
        </h3>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
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
          <div className="mt-3 rounded-2xl border border-dashed border-border bg-background p-5">
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
        <p className="mt-2 text-xs text-muted">
          Based on the traditional Vimshottari dasha sequence — a classical
          Vedic timeline of life &quot;chapters&quot;, each ruled by a different
          planet.
        </p>
      </section>

      <section>
        <h3 className="font-serif text-xl font-semibold text-primary-dark">
          📚 Subjects &amp; how they show up at school
        </h3>
        <p className="mt-1 text-sm text-muted">
          Concrete, subject-by-subject guidance — not just broad themes.
        </p>

        <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-primary-dark">
          Likely to come more naturally
        </p>
        <div className="mt-3 space-y-3">
          {pathway.subjectsInclined.map((item) => (
            <div key={item.id} className="rounded-2xl border border-success-soft bg-success-soft p-5">
              <h4 className="font-serif text-base font-semibold text-primary-dark">
                {item.name}
              </h4>
              <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
              <p className="mt-2.5 rounded-lg bg-white/60 px-3 py-2 text-xs text-muted">
                💡 {item.tip}
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
              <p className="mt-2.5 rounded-lg bg-white/60 px-3 py-2 text-xs text-muted">
                💡 {item.tip}
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
        <h3 className="font-serif text-xl font-semibold text-primary-dark">
          🧭 As they grow: their natural direction
        </h3>
        <p className="mt-1 text-sm text-muted">
          A loose compass for the years ahead, not a fixed script.
        </p>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
          <h4 className="font-serif text-lg font-semibold text-primary-dark">
            {pathway.futureDirection.title}
          </h4>
          <p className="mt-1 text-sm italic text-muted">
            A natural pull toward {pathway.futureDirection.essence}.
          </p>
          <div className="mt-4 space-y-3">
            {pathway.futureDirection.stages.map((stage) => (
              <div key={stage.label} className="border-l-2 border-accent-soft pl-3">
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
        <p className="mt-2 text-xs text-muted">
          Interests and aptitude often evolve well beyond what any chart can
          predict — treat this as a starting compass, not a destination.
        </p>
      </section>

      <section>
        <h3 className="font-serif text-xl font-semibold text-primary-dark">
          🏡 Their ideal learning environment
        </h3>
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

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-serif text-xl font-semibold text-primary-dark">
          🗓️ A gentle weekly rhythm
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground/80">
          {pathway.weeklyRhythm.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span aria-hidden>•</span>
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
