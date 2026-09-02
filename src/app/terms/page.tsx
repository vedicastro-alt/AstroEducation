import type { Metadata } from "next";
import Link from "next/link";
import { SparkleIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Terms of Service — Little Stargazers",
  description:
    "The plain-language terms for using Little Stargazers and purchasing a reading.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <SparkleIcon className="h-8 w-8 text-accent" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        Terms of Service
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
        The plain-language terms
      </h1>
      <p className="mt-4 text-sm text-muted">Last updated 27 August 2026.</p>

      <div className="mt-8 space-y-6 text-sm leading-7 text-foreground/80">
        <p>
          By using Little Stargazers, you&apos;re agreeing to the following.
          We&apos;ve written it in plain language on purpose — see our{" "}
          <Link
            href="/about"
            className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
          >
            about page
          </Link>{" "}
          for more on what this is and isn&apos;t.
        </p>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            What you&apos;re buying
          </h2>
          <p className="mt-2">
            A personalized, plain-language written reading based on your
            child&apos;s Vedic birth chart, delivered at a private link. It
            is a piece of traditional-astrology writing offered for
            reflection and entertainment — it is not a scientific
            assessment, a psychological evaluation, a medical or
            educational diagnosis, or a prediction of who your child will
            become. It does not replace the judgement of your child&apos;s
            teachers, doctors, or your own.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Purchases are one-time, not subscriptions
          </h2>
          <p className="mt-2">
            Every reading is a single, one-time payment for that child.
            There&apos;s no account, no recurring billing, and no
            auto-renewal, ever. Pricing is per report, not per family — a
            separate purchase is needed for each child.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Refunds
          </h2>
          <p className="mt-2">
            If there&apos;s a genuine issue with your reading — a technical
            fault, or it wasn&apos;t generated correctly — email{" "}
            <a
              href="mailto:contact@littlestargazer.com"
              className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
            >
              contact@littlestargazer.com
            </a>{" "}
            and we&apos;ll make it right, which may include a refund.
            Because each reading is a digital product delivered and
            viewable in full immediately upon purchase, we don&apos;t
            offer refunds simply for a change of mind. Nothing here
            limits any right you have under the Australian Consumer Law,
            including guarantees that can&apos;t be excluded by
            agreement.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Accuracy of birth details
          </h2>
          <p className="mt-2">
            The reading is only as accurate as the birth date, time, and
            place you provide. If you&apos;re not sure of the exact birth
            time, you can mark it as unknown and we&apos;ll use a
            reasonable estimate — the broader picture stays sound, though a
            handful of finer details may shift without an exact time.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Gift purchases
          </h2>
          <p className="mt-2">
            If you buy a reading as a gift and enter the child&apos;s birth
            details yourself, the link is yours to share with whoever
            it&apos;s for — there&apos;s no separate transfer process.
            You&apos;re responsible for making sure the birth details you
            enter are accurate.
          </p>
          <p className="mt-2">
            If you send a gift voucher instead, we email the recipient a
            single-use code with no expiry, which they redeem by entering
            their own child&apos;s birth details. The code has no cash
            value, can&apos;t be exchanged for a refund once redeemed, and
            our fault-based refund policy above still applies to the
            reading it unlocks.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Acceptable use
          </h2>
          <p className="mt-2">
            Readings are for personal, family use. Please don&apos;t
            republish, resell, or use the service to generate readings for
            people without a legitimate reason to have their birth details
            (for example, without a parent or guardian&apos;s knowledge for
            a child who isn&apos;t your own).
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Limitation of liability
          </h2>
          <p className="mt-2">
            Little Stargazers is provided for reflection and entertainment.
            We make no guarantee about outcomes, and we&apos;re not liable
            for decisions made on the basis of a reading. Nothing in these
            terms limits any right you have under consumer law that
            can&apos;t lawfully be excluded.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Changes to these terms
          </h2>
          <p className="mt-2">
            If these terms change in a meaningful way, we&apos;ll update
            the date at the top of this page.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Questions
          </h2>
          <p className="mt-2">
            See also our{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
            >
              Privacy Policy
            </Link>
            , or email{" "}
            <a
              href="mailto:contact@littlestargazer.com"
              className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
            >
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
