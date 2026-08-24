import Link from "next/link";

const STEPS = [
  {
    title: "Share their birth details",
    body: "Just your child's date, time, and place of birth — the same details used for any traditional Vedic horoscope.",
    icon: "🕊️",
  },
  {
    title: "We read their chart, gently",
    body: "We calculate a real Vedic birth chart, then translate the parts that speak to learning and intelligence into warm, plain-language guidance.",
    icon: "🔭",
  },
  {
    title: "Discover how they learn best",
    body: "See their natural strengths, the areas that may need extra patience, and the subjects and learning styles most likely to help them thrive.",
    icon: "🌱",
  },
];

const SAMPLE_STRENGTH = {
  title: "Bright, creative intelligence",
  body: "The 5th house of intelligence and creativity is strong in this chart. This points to genuine intellectual spark — a child who enjoys thinking things through, playing with ideas, and creating.",
};

const SAMPLE_GROWTH = {
  title: "Discipline that's still being built",
  body: "Sitting still with a task, or sticking with something that isn't instantly fun, may not come naturally yet. This is simply a skill in progress — short, consistent practice sessions with plenty of encouragement build this muscle gently over time.",
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-5xl px-5 pt-14 pb-16 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1 text-sm font-medium text-accent">
            For parents, with love
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-primary-dark sm:text-5xl">
            Every child learns differently. The stars offer a gentle place to start.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Little Stargazers reads your child&apos;s Vedic birth chart and turns
            it into warm, encouraging guidance about how they naturally learn
            best — their strengths, the areas that need a little extra
            patience, and where to focus first.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/report"
              className="rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Discover their learning strengths
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full px-7 py-3.5 text-base font-medium text-primary-dark hover:underline"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">
            Free initial reading · Takes about a minute · No account needed
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto w-full max-w-5xl px-5 py-14"
      >
        <h2 className="text-center font-serif text-3xl font-semibold text-primary-dark">
          How it works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <div className="text-3xl">{step.icon}</div>
              <p className="mt-3 text-sm font-semibold text-accent">
                Step {i + 1}
              </p>
              <h3 className="mt-1 font-serif text-lg font-semibold text-primary-dark">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center font-serif text-3xl font-semibold text-primary-dark">
            Always gentle, always encouraging
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">
            Here&apos;s a taste of how we phrase things — real insight, delivered
            with warmth.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-success-soft bg-success-soft p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
                A natural strength
              </p>
              <h3 className="mt-2 font-serif text-lg font-semibold text-primary-dark">
                {SAMPLE_STRENGTH.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-foreground/80">
                {SAMPLE_STRENGTH.body}
              </p>
            </div>
            <div className="rounded-2xl border border-growth-border bg-growth-soft p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
                An area to nurture
              </p>
              <h3 className="mt-2 font-serif text-lg font-semibold text-primary-dark">
                {SAMPLE_GROWTH.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-foreground/80">
                {SAMPLE_GROWTH.body}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-5 py-16 text-center">
        <h2 className="font-serif text-2xl font-semibold text-primary-dark">
          Your family&apos;s privacy, respected
        </h2>
        <p className="mt-3 text-muted">
          Your child&apos;s birth details are used only to calculate their
          chart for this reading. We don&apos;t sell data, and this first
          reading requires no account or payment.
        </p>
        <div className="mt-8">
          <Link
            href="/report"
            className="inline-block rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Get your child&apos;s free reading
          </Link>
        </div>
      </section>
    </div>
  );
}
