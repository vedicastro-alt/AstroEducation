import type { Metadata } from "next";
import Link from "next/link";
import { GiftForm } from "@/components/GiftForm";
import { RotatingPlanet } from "@/components/RotatingPlanet";

export const metadata: Metadata = {
  title: "Send a gift reading — Little Stargazers",
  description:
    "Send someone a Little Stargazers reading, even if you don't have their child's birth details yet — they redeem it themselves whenever they're ready.",
};

export default function GiftPage() {
  return (
    <div className="relative mx-auto w-full max-w-lg px-6 py-16">
      <RotatingPlanet
        variant="ring"
        aria-hidden
        className="pointer-events-none absolute -right-1 top-2 hidden h-16 w-16 text-accent/25 sm:block"
      />
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">A gift, made simple</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
          Send a gift reading
        </h1>
        <p className="mt-3 text-muted">
          Don&apos;t have their child&apos;s birth details on hand? Send a
          voucher instead — they enter their own child&apos;s details and
          redeem it whenever they&apos;re ready. No expiry, no account
          needed.
        </p>
      </div>
      <div className="mt-8 rounded-2xl border border-border-soft bg-surface-raised p-7 shadow-[0_20px_50px_-25px_rgba(44,40,97,0.35)] sm:p-9">
        <GiftForm />
      </div>
      <p className="mt-5 text-center text-xs text-muted">
        Already have their birth details? You can{" "}
        <Link href="/report" className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary">
          create their reading directly
        </Link>{" "}
        and send it to them at checkout instead.
      </p>
    </div>
  );
}
