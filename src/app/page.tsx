import Link from "next/link";
import { ChartWheel } from "@/components/ChartWheel";
import { ConstellationSky } from "@/components/ConstellationSky";
import { Reveal } from "@/components/Reveal";
import {
  BookIcon,
  CompassIcon,
  SproutIcon,
  StarIcon,
  TelescopeIcon,
} from "@/components/icons";

const STEPS = [
  {
    title: "Share their birth details",
    body: "Just your child's date, time, and place of birth — the same details used for any traditional Vedic horoscope.",
    icon: StarIcon,
  },
  {
    title: "We read their chart, gently",
    body: "We calculate a real Vedic birth chart, then translate the parts that speak to learning and intelligence into warm, plain-language guidance.",
    icon: CompassIcon,
  },
  {
    title: "Discover how they learn best",
    body: "See their natural strengths, the areas that may need extra patience, and the subjects and learning styles most likely to help them thrive.",
    icon: SproutIcon,
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

const CREDIBILITY = [
  { stat: "9", label: "Planets calculated", detail: "The full classical set — Sun through Ketu" },
  { stat: "27", label: "Star positions mapped", detail: "Precise placement to the degree, not a rough guess" },
  { stat: "1", label: "Real ephemeris", detail: "Genuine astronomical positions, not a template reading" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(200deg,#35306e_0%,#1a1740_55%,#14122f_100%)] px-6 py-32 text-center sm:py-40">
        <ConstellationSky className="pointer-events-none absolute inset-0 h-full w-full" />
        <Reveal className="relative mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-semibold leading-[1.15] text-white sm:text-6xl">
            Every child is written in the stars{" "}
            <span className="italic text-accent-bright">differently</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">
            Little Stargazers reads your child&apos;s real Vedic birth chart
            — their exact Moon, Ascendant, and planetary placements — and
            turns it into warm, specific guidance: their natural strengths,
            the subjects most likely to click, and where to focus first.
          </p>
          <div className="mt-9">
            <Link
              href="/report"
              className="inline-block rounded-full bg-accent-bright px-8 py-4 text-base font-semibold text-primary-dark shadow-lg shadow-black/20 transition-transform hover:scale-[1.02] hover:bg-accent-bright/90"
            >
              Discover their learning strengths
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/45">
            Free initial reading · Full pathway from $25 · Takes about a minute
          </p>
          <p className="mt-2 text-sm text-white/35">
            For your own child, or as a gift.{" "}
            <Link href="/sample" className="underline decoration-white/30 underline-offset-2 hover:text-white/60">
              See a full sample reading first
            </Link>
          </p>
        </Reveal>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            How it works
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
            From birth details to real guidance
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="h-full rounded-3xl border border-border-soft bg-surface-raised p-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="mt-5 font-serif text-sm font-semibold text-accent">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 font-serif text-lg font-semibold text-primary-dark">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sample tone */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Our tone
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
              Always gentle, always encouraging
            </h2>
            <p className="mt-3 text-muted">
              Here&apos;s a taste of how we phrase things — real insight,
              delivered with warmth.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-success-border bg-success-soft p-7">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-success">
                  <StarIcon className="h-4 w-4" />A natural strength
                </div>
                <h3 className="mt-3 font-serif text-xl font-semibold text-primary-dark">
                  {SAMPLE_STRENGTH.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-foreground/75">
                  {SAMPLE_STRENGTH.body}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-3xl border border-growth-border bg-growth-soft p-7">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-growth">
                  <SproutIcon className="h-4 w-4" />An area to nurture
                </div>
                <h3 className="mt-3 font-serif text-xl font-semibold text-primary-dark">
                  {SAMPLE_GROWTH.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-foreground/75">
                  {SAMPLE_GROWTH.body}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Built with real astronomy
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
            Not a template. A genuine chart.
          </h2>
          <p className="mt-3 text-muted">
            Every reading is calculated from your child&apos;s exact birth
            details — real planetary positions using traditional Vedic
            methods, not a generic sun-sign horoscope.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border-soft bg-border-soft sm:grid-cols-3">
          {CREDIBILITY.map((c) => (
            <div key={c.label} className="bg-surface-raised p-8 text-center">
              <p className="font-serif text-4xl font-semibold text-primary">
                {c.stat}
              </p>
              <p className="mt-2 text-sm font-semibold text-primary-dark">
                {c.label}
              </p>
              <p className="mt-1 text-xs text-muted">{c.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why we built this */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <TelescopeIcon className="mx-auto h-8 w-8 text-accent" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Why we built this
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
              Every child deserves to be seen for who they are
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted leading-7">
              We built Little Stargazers because most astrology online is
              either written for adults, or written to unsettle you. We
              wanted neither. So every reading is calculated properly — real
              planetary positions from your child&apos;s exact birth moment,
              using traditional Vedic methods — and then written the way
              we&apos;d want to read about our own child: plainly, warmly,
              and always aimed at what to encourage next, never at what to
              fear.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-muted leading-7">
              That&apos;s also why every reading ends with a clear focus, not
              a prediction. A birth chart can offer a gentle starting point
              for how your child learns — it&apos;s never a substitute for
              knowing them yourself.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block text-sm font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:text-primary-dark"
            >
              More on how it&apos;s actually calculated →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-primary-dark">
        <ChartWheel className="pointer-events-none absolute -left-32 -bottom-32 h-96 w-96 text-white/5" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <Reveal>
            <BookIcon className="mx-auto h-8 w-8 text-accent-bright" />
            <h2 className="mt-5 font-serif text-3xl font-semibold text-white sm:text-4xl">
              Your family&apos;s privacy, respected
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/65">
              Your child&apos;s birth details are used only to calculate their
              chart for this reading. We don&apos;t sell data, and this first
              reading requires no account or payment.
            </p>
            <div className="mt-9">
              <Link
                href="/report"
                className="inline-block rounded-full bg-accent-bright px-8 py-3.5 text-base font-semibold text-primary-dark shadow-lg shadow-black/20 transition-transform hover:scale-[1.02] hover:bg-accent-bright/90"
              >
                Get your child&apos;s free reading
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
