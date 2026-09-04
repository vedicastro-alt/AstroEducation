import type { Metadata } from "next";
import Link from "next/link";
import { TelescopeIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy Policy — Little Stargazers",
  description:
    "What we collect, why we collect it, and what we never do with your family's information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <TelescopeIcon className="h-8 w-8 text-accent" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        Privacy Policy
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
        What we collect, and why
      </h1>
      <p className="mt-4 text-sm text-muted">Last updated 26 August 2026.</p>

      <div className="mt-8 space-y-6 text-sm leading-7 text-foreground/80">
        <p>
          Little Stargazers is a small, independent project. We collect the
          minimum information needed to calculate and deliver a reading, we
          never sell or share it, and we&apos;d rather explain plainly what
          that means than bury it in dense legal language.
        </p>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            What we collect
          </h2>
          <ul className="mt-3 space-y-2 pl-5 text-foreground/75">
            <li className="list-disc">
              <strong className="text-foreground">Your child&apos;s name, date of birth, birth time (or an estimate, if unknown), and birth place.</strong>{" "}
              This is the only information a Vedic birth chart calculation
              actually needs.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">The resulting chart and reading.</strong>{" "}
              We store the calculated chart, insights, and pathway text so
              the reading&apos;s link keeps working if you come back to it.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Payment information, if you purchase a reading.</strong>{" "}
              Card details are handled entirely by Stripe, our payment
              processor — we never see or store your card number. We
              receive only confirmation that a payment succeeded, for
              which tier, and Stripe&apos;s own transaction reference.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Your email address, if you purchase a reading.</strong>{" "}
              Stripe Checkout asks for it as part of paying; we store it
              only so we can resend your reading&apos;s link back to you if
              you ever lose it (via the &quot;Lost your reading
              link?&quot; page). We don&apos;t use it for marketing and
              there&apos;s no mailing list — a free preview reading
              doesn&apos;t collect an email at all.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            No accounts, no login
          </h2>
          <p className="mt-2">
            There&apos;s no sign-up and no password. Each reading lives at
            its own private, shareable link. We don&apos;t track you across
            visits, and we don&apos;t build a profile of you or your child
            beyond the single reading you requested.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Who else sees this information
          </h2>
          <ul className="mt-3 space-y-2 pl-5 text-foreground/75">
            <li className="list-disc">
              <strong className="text-foreground">Supabase</strong> hosts the
              database where your reading is stored, on our behalf and
              under our instructions only.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Stripe</strong> processes
              payment if you purchase a reading, under their own privacy
              policy.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Resend</strong> sends the
              &quot;here&apos;s your reading link&quot; email if you ask us
              to resend it — nothing else.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Open-Meteo</strong>, a
              free geocoding service, resolves a typed birth place (e.g.
              &quot;Jaipur, India&quot;) into coordinates. Only the place
              name you type is sent to them — nothing about your child.
            </li>
          </ul>
          <p className="mt-3">
            We don&apos;t sell, rent, or share your information with anyone
            for marketing purposes — ever.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            How long we keep it
          </h2>
          <p className="mt-2">
            We keep your reading for as long as its link might reasonably
            still be useful to you. If you&apos;d like your child&apos;s
            reading and birth details permanently deleted, email us and
            we&apos;ll remove them.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Analytics
          </h2>
          <p className="mt-2">
            We use privacy-respecting, cookie-free analytics to understand
            which pages people visit — never anything tied to your
            child&apos;s name or birth details, and never sold onward.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Your rights
          </h2>
          <p className="mt-2">
            You can ask us what we hold about you or your child, ask us to
            correct it, or ask us to delete it, at any time, by emailing{" "}
            <a
              href="mailto:contact@littlestargazer.com"
              className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
            >
              contact@littlestargazer.com
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-primary-dark">
            Changes to this policy
          </h2>
          <p className="mt-2">
            If this policy changes in a meaningful way, we&apos;ll update
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
              href="/terms"
              className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
            >
              Terms of Service
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
          className="inline-block rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
        >
          Get your child&apos;s free reading
        </Link>
      </div>
    </div>
  );
}
