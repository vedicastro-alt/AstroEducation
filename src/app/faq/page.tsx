import type { Metadata } from "next";
import Link from "next/link";
import { SparkleIcon } from "@/components/icons";
import { RotatingPlanet } from "@/components/RotatingPlanet";
import { faqPageSchema, jsonLd } from "@/lib/seo/schema";

const LAST_REVIEWED = "2026-08-28";

export const metadata: Metadata = {
  title: "FAQ — Little Stargazers",
  description:
    "Honest answers about how Little Stargazers works, pricing, privacy, and refunds.",
};

const FAQS = [
  {
    q: "Is this scientific?",
    a: "No, and we won't pretend otherwise. Vedic astrology is a centuries-old traditional practice, not an empirically validated science. We offer it as a gentle lens for reflection — some families find real value in it, others enjoy it as a nice piece of writing about their child and leave it there. Either reaction is completely reasonable.",
  },
  {
    q: "Do you predict my child's future or career?",
    a: "No, deliberately not. The \"natural direction\" section names a few broad areas that tend to fit a given pattern, but it's explicitly framed as possibility, not prediction — what your child actually becomes is theirs to choose, shaped far more by their own curiosity, effort, and the people around them than by a chart.",
  },
  {
    q: "What if I don't believe in astrology at all?",
    a: "That's fine, genuinely. Read it the way you'd read a thoughtfully written personality reflection — take what resonates, ignore what doesn't. We've deliberately avoided fear-based or definitive language for exactly this reason.",
  },
  {
    q: "What do you do with my child's birth details?",
    a: "They're used only to calculate the chart for this reading. We don't sell or share this data, and there's no account or login required for the free reading.",
  },
  {
    q: "What's the difference between the two paid tiers?",
    a: "The Guiding Stars Reading ($25) is the complete personalized learning pathway — a direct answer to the real decision you're facing (if you tell us what it is on the intake form), subjects, natural direction, a life-chapter timeline, ideal learning environment, and a weekly rhythm. The Complete Constellation Reading ($35) includes all of that plus a ranked career deep-dive across every field the chart speaks to, and gentle, traditional remedies personalized to your child's chart (simple, low-cost ideas only — never gemstones, never prescriptive). Already bought the first and want the extras later? That upgrade is $15, not the full $35.",
  },
  {
    q: "Is this a subscription?",
    a: "No. Every purchase is a one-time payment for that child's reading. No account, no recurring charge, ever.",
  },
  {
    q: "I don't know my child's exact birth time — can I still get a reading?",
    a: "Yes. Check \"I'm not sure\" on the time field and we'll use a midday estimate. The broader picture (sign-level guidance) stays accurate; a handful of finer details can shift slightly without an exact time.",
  },
  {
    q: "Can I get a refund?",
    a: "If something's genuinely wrong — a technical issue, or the reading wasn't generated correctly — email contact@littlestargazer.com and we'll make it right. Because it's a digital reading you can view in full immediately after purchase, we don't offer refunds for change of mind. This doesn't affect any rights you have under the Australian Consumer Law.",
  },
  {
    q: "Can I buy this as a gift?",
    a: "Yes — check \"this is a gift\" on the intake form and the reading is written with that framing. Since there's no login, the reading link itself is yours to share with whoever it's for.",
  },
];

export default function FaqPage() {
  return (
    <div className="relative mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPageSchema(FAQS)) }}
      />
      <RotatingPlanet
        variant="band"
        reverse
        aria-hidden
        className="pointer-events-none absolute -right-2 top-14 hidden h-14 w-14 text-accent/30 sm:block"
      />
      <SparkleIcon className="h-8 w-8 text-accent" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        Questions
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-2 text-xs text-muted-soft">
        Last reviewed{" "}
        {new Date(LAST_REVIEWED).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="mt-10 space-y-8">
        {FAQS.map((item) => (
          <div key={item.q}>
            <h2 className="font-serif text-base font-semibold text-primary-dark">
              {item.q}
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-foreground/75">{item.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted">
        Anything else? Read more about the methodology on the{" "}
        <Link href="/about" className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary">
          about page
        </Link>
        , or email{" "}
        <a href="mailto:contact@littlestargazer.com" className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary">
          contact@littlestargazer.com
        </a>
        .
      </p>

      <div className="mt-10">
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
