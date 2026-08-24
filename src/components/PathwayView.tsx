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
          📚 Curriculum &amp; focus areas
        </h3>
        <p className="mt-1 text-sm text-muted">
          The five areas most worth prioritising, in order.
        </p>
        <div className="mt-4 space-y-3">
          {pathway.focusAreas.map((item, i) => (
            <div key={item.id} className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold text-accent">Priority {i + 1}</p>
              <h4 className="mt-1 font-serif text-base font-semibold text-primary-dark">
                {item.title}
              </h4>
              <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
              <p className="mt-2.5 rounded-lg bg-background px-3 py-2 text-xs text-muted">
                💡 {item.tip}
              </p>
            </div>
          ))}
        </div>
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
