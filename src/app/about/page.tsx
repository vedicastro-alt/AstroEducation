import type { Metadata } from "next";
import Link from "next/link";
import { TelescopeIcon } from "@/components/icons";
import { RotatingPlanet } from "@/components/RotatingPlanet";

export const metadata: Metadata = {
  title: "About Little Stargazers",
  description:
    "Who built Little Stargazers, how the readings are actually calculated, and what this is (and isn't).",
};

const LAST_REVIEWED = "2026-08-28";

export default function AboutPage() {
  return (
    <div className="relative mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <RotatingPlanet
        variant="craters"
        aria-hidden
        className="pointer-events-none absolute -right-2 top-14 hidden h-14 w-14 text-primary/25 sm:block"
      />
      <TelescopeIcon className="h-8 w-8 text-accent" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        About
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
        Who&apos;s behind this, and how it actually works
      </h1>
      <p className="mt-2 text-xs text-muted-soft">
        Last reviewed{" "}
        {new Date(LAST_REVIEWED).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-7 text-foreground/80">
        <p>
          Little Stargazers is an independent, small project, built and
          written by Jaya. We&apos;re not a large astrology company, and we
          don&apos;t have a network of astrologers on staff — this is a
          piece of software that calculates a real Vedic birth chart and
          writes it up in plain language for parents. We&apos;d rather tell
          you that plainly than dress it up.
        </p>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Why I built this
          </h2>
          <p className="mt-2">
            Astrology runs in my family — my lineage includes astrologers
            going back generations, and reading charts has been a genuine
            passion of mine since childhood. When I had kids of my own, I
            started using their charts the way I&apos;d always wanted a tool
            like this to work: not to predict who they&apos;d become, but to
            notice what came naturally to them, and where they needed a bit
            more patience and support to grow into their own strengths.
          </p>
          <p className="mt-3">
            It changed how I parent — a little more attuned to each of my
            kids&apos; actual temperament, rather than a one-size-fits-all
            approach. I built Little Stargazers because I wanted other
            parents to have access to that same kind of guide: something
            grounded in a real chart, not a generic personality quiz, that
            helps you meet your child where they naturally are.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            What &quot;real&quot; actually means here
          </h2>
          <p className="mt-2">
            Every reading starts from your child&apos;s exact birth date,
            time, and place. From that, we calculate genuine planetary
            positions for that precise moment — not a template swapped in
            by star sign. Specifically:
          </p>
          <ul className="mt-3 space-y-2 pl-5 text-foreground/75">
            <li className="list-disc">
              Planetary positions come from a real astronomical ephemeris
              (the same kind of calculation used in professional
              astronomy software), not a lookup table.
            </li>
            <li className="list-disc">
              We use the sidereal zodiac with the Lahiri ayanamsa — the
              standard reference point most traditional Vedic astrology is
              built on — rather than the tropical (Western) zodiac.
            </li>
            <li className="list-disc">
              Houses are calculated using the whole-sign method, and the
              life-chapter timeline in the full reading follows the
              traditional Vimshottari sequence.
            </li>
          </ul>
          <p className="mt-3">
            None of that needs to mean anything to you as a parent — it&apos;s
            just here for anyone who wants to know the reading isn&apos;t
            guesswork dressed up nicely.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            What actually changes, chart to chart
          </h2>
          <p className="mt-2">
            A fair question, and one we&apos;d ask too: is this just a
            template with your child&apos;s name swapped in? No — each
            placement below genuinely changes what gets written, not just
            which name appears in it. Here&apos;s the plain version of what
            we actually read, and why:
          </p>
          <ul className="mt-3 space-y-2 pl-5 text-foreground/75">
            <li className="list-disc">
              <span className="font-medium text-foreground/90">
                Ascendant (rising sign)
              </span>{" "}
              — day-to-day temperament: how your child tends to meet new
              situations, people, and changes in routine.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">
                Moon sign &amp; nakshatra
              </span>{" "}
              — emotional and learning temperament: how they process
              feelings, and the kind of environment that actually helps
              them focus.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Mercury</span>{" "}
              — communication style, and a lead influence on subjects like
              mathematics, reading &amp; writing, and computer science.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Venus</span>{" "}
              — creative and aesthetic inclination, a lead influence on
              visual arts and music.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Mars</span>{" "}
              — physical energy and drive, a lead influence on physical
              education and sport.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Jupiter</span>{" "}
              — growth, curiosity, and big-picture thinking, a lead
              influence on science and history &amp; social studies.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Sun</span> —
              confidence and self-expression, a lead influence on public
              speaking, drama, and leadership.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Saturn</span>{" "}
              — discipline, patience, and pacing: roughly how much
              structure and time a child may need to build a given skill.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">
                The Vimshottari dasha sequence
              </span>{" "}
              — which of the above is most &quot;in focus&quot; at this
              particular age, which is part of why the same chart reads
              differently for a 4-year-old than for a 15-year-old.
            </li>
          </ul>
          <p className="mt-3">
            The simplified version above is honest, not exhaustive — most
            chapters actually blend two or three placements rather than
            reading just one in isolation, and the exact weighting varies
            by subject or topic. But the direction is real: change the
            birth details, and these are the placements doing the actual
            work, not just the words around them.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            What this is
          </h2>
          <p className="mt-2">
            A gentle, occasionally useful lens — a way of noticing things
            about how your child might learn and where they might need a
            little more patience. Some parents find real value in that.
            Others find it a nice piece of reflection and nothing more.
            Both are a completely reasonable response.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            What this isn&apos;t
          </h2>
          <p className="mt-2">
            It isn&apos;t a scientifically validated assessment, a
            prediction of who your child will become, or a substitute for
            their teachers, a paediatrician, or your own judgement of who
            they are. We say this plainly in every reading, and we mean
            it — not as a legal disclaimer, but because it&apos;s true.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Questions
          </h2>
          <p className="mt-2">
            More practical questions — refunds, privacy, pricing — are
            answered on the{" "}
            <Link href="/faq" className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary">
              FAQ page
            </Link>
            . You can also reach us directly at{" "}
            <a href="mailto:contact@littlestargazer.com" className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary">
              contact@littlestargazer.com
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mt-12">
        <Link
          href="/report"
          className="inline-block rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
        >
          Get your child&apos;s free reading
        </Link>
      </div>
    </div>
  );
}
