import Link from "next/link";
import Image from "next/image";
import { ChartWheel } from "@/components/ChartWheel";
import { OrbitField } from "@/components/OrbitField";
import { GrowingMark } from "@/components/GrowingMark";
import { RotatingPlanet } from "@/components/RotatingPlanet";
import { Reveal } from "@/components/Reveal";
import whyWeBuiltThisPhoto from "@/assets/why-we-built-this.jpg";
import {
  BookIcon,
  CompassIcon,
  SproutIcon,
  StarIcon,
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
  // Deliberately age-neutral: this is the one example shown to every
  // visitor before any birth details are entered, so it can't lean on
  // one age band's phrasing the way the full reading (which knows the
  // child's actual age) can. A conversion-test re-run flagged an earlier,
  // toddler-coded version of this line ("sitting still," "this muscle")
  // as the first concrete signal that made a parent of a teenager doubt
  // the product was ever built with an older child in mind.
  body: "Staying with a task once the initial interest fades, or pushing through when something isn't instantly rewarding, may not come as naturally as it does for some. This is simply a skill in progress — consistent, low-pressure practice tends to build real follow-through over time.",
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
      <section className="relative overflow-hidden bg-background px-6 py-28 sm:py-36">
        <OrbitField
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Vedic Birth Chart · For Parents
              </span>
            </div>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.12] text-primary-dark sm:text-6xl">
              Every child is written in the stars{" "}
              <span className="text-accent">differently</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-foreground/75">
              Little Stargazers reads your child&apos;s real Vedic birth chart
              — their exact Moon, Ascendant, and planetary placements — and
              turns it into warm, specific guidance: their natural strengths,
              the subjects most likely to click, and where to focus first.
            </p>
            <div className="mt-9">
              <Link
                href="/report"
                className="inline-block rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/15 transition-transform hover:scale-[1.01] hover:bg-primary-dark"
              >
                Discover their learning strengths
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted">
              Free initial reading · Full pathway from $25 · Takes about a minute
            </p>
            <p className="mt-2 text-sm text-muted-soft">
              For your own child, or as a gift.{" "}
              <Link href="/sample" className="underline decoration-border underline-offset-2 hover:text-primary-dark">
                See a full sample reading first
              </Link>
            </p>
          </Reveal>

          <GrowingMark
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-[calc(50%+40px)] hidden h-28 w-28 text-primary sm:block md:left-auto md:right-16"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden bg-primary-dark px-6 py-24 text-white">
        <div className="relative mx-auto w-full max-w-6xl">
          <Reveal className="flex items-baseline gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-bright">
              How it works
            </p>
            <span className="h-px flex-1 bg-white/10" />
          </Reveal>
          <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
            <span
              aria-hidden
              className="absolute top-5 left-0 right-0 hidden h-px bg-white/10 sm:block"
            />
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-primary-dark text-sm font-semibold text-accent-bright">
                  {i + 1}
                </div>
                <step.icon className="mt-5 h-6 w-6 text-accent-bright" />
                <h3 className="mt-4 font-serif text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-white/65">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sample tone */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="max-w-xl">
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
          <div className="mt-12 grid gap-px overflow-hidden rounded border border-border-soft bg-border-soft sm:grid-cols-2">
            <Reveal className="bg-success-soft p-7">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-success">
                <StarIcon className="h-4 w-4" />A natural strength
              </div>
              <h3 className="mt-3 font-serif text-xl font-semibold text-primary-dark">
                {SAMPLE_STRENGTH.title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-foreground/75">
                {SAMPLE_STRENGTH.body}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="bg-growth-soft p-7">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-growth">
                <SproutIcon className="h-4 w-4" />An area to nurture
              </div>
              <h3 className="mt-3 font-serif text-xl font-semibold text-primary-dark">
                {SAMPLE_GROWTH.title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-foreground/75">
                {SAMPLE_GROWTH.body}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="relative overflow-hidden bg-background py-24">
        <RotatingPlanet
          variant="craters"
          aria-hidden
          className="pointer-events-none absolute -right-6 top-10 hidden h-24 w-24 text-primary/20 sm:block"
        />
        <div className="relative mx-auto w-full max-w-6xl px-6">
          <Reveal className="max-w-xl">
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
          <div className="mt-12 grid gap-px overflow-hidden rounded border border-border-soft bg-border-soft sm:grid-cols-3">
            {CREDIBILITY.map((c) => (
              <div key={c.label} className="bg-surface-raised p-8 text-center">
                <p className="font-serif text-4xl font-semibold text-accent">
                  {c.stat}
                </p>
                <p className="mt-2 text-sm font-semibold text-primary-dark">
                  {c.label}
                </p>
                <p className="mt-1 text-xs text-muted">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why we built this */}
      <section className="bg-surface py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
          <Reveal className="relative overflow-hidden rounded">
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={whyWeBuiltThisPhoto}
                alt="A parent and child looking out together at sunset"
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
                style={{ filter: "sepia(0.28) saturate(1.15) hue-rotate(-8deg) contrast(1.05) brightness(0.97)" }}
              />
              <div className="pointer-events-none absolute inset-0 bg-primary/15 mix-blend-multiply" />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(20,32,26,0.12)]" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <TelescopeKicker />
            <h2 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
              Every child deserves to be seen for who they are
            </h2>
            <p className="mt-5 max-w-xl text-muted leading-7">
              We built Little Stargazers because most astrology online is
              either written for adults, or written to unsettle you. We
              wanted neither. So every reading is calculated properly — real
              planetary positions from your child&apos;s exact birth moment,
              using traditional Vedic methods — and then written the way
              we&apos;d want to read about our own child: plainly, warmly,
              and always aimed at what to encourage next, never at what to
              fear.
            </p>
            <p className="mt-4 max-w-xl text-muted leading-7">
              That&apos;s also why every reading ends with a clear focus, not
              a prediction. A birth chart can offer a gentle starting point
              for how your child learns — it&apos;s never a substitute for
              knowing them yourself.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block border-b border-primary/40 text-sm font-medium text-primary hover:text-primary-dark hover:border-primary-dark"
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
                className="inline-block rounded-sm bg-accent-bright px-8 py-3.5 text-base font-semibold text-primary-dark shadow-lg shadow-black/20 transition-transform hover:scale-[1.01] hover:bg-accent-bright/90"
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

function TelescopeKicker() {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
      Why we built this
    </p>
  );
}
