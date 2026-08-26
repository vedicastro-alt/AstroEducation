import type { Metadata } from "next";
import Link from "next/link";
import { TelescopeIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Little Stargazers",
  description:
    "Who built Little Stargazers, how the readings are actually calculated, and what this is (and isn't).",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <TelescopeIcon className="h-8 w-8 text-accent" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        About
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
        Who&apos;s behind this, and how it actually works
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-7 text-foreground/80">
        <p>
          Little Stargazers is an independent, small project. We&apos;re not
          a large astrology company, and we don&apos;t have a network of
          astrologers on staff — this is a piece of software, built by a
          small team, that calculates a real Vedic birth chart and writes
          it up in plain language for parents. We&apos;d rather tell you
          that plainly than dress it up.
        </p>

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
          className="inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
        >
          Get your child&apos;s free reading
        </Link>
      </div>
    </div>
  );
}
