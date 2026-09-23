import type { Metadata } from "next";
import Link from "next/link";
import { RotatingPlanet } from "@/components/RotatingPlanet";

export const metadata: Metadata = {
  title: "Reading credit packs — Little Stargazers",
  description: "Reading credit packs are on hold for now — create a single reading instead.",
};

/**
 * Parked, not removed (HANDOFF §66): the pack purchase flow itself --
 * PackForm, createPackCheckoutSessionAction, the credit_packs table, the
 * redemption/anti-fraud logic on a report's paywall -- is left fully
 * intact underneath this, since a founder decision to resume packs later
 * (likely a single, differently-priced bundle, not this four-option
 * lineup) shouldn't mean rebuilding any of that. This page and every
 * link to it are what's paused; createPackCheckoutSessionAction itself
 * also refuses new purchases as a second layer, in case a stale cached
 * copy of the old page is ever submitted directly.
 */
export default function PacksPage() {
  return (
    <div className="relative mx-auto w-full max-w-lg px-6 py-16">
      <RotatingPlanet
        variant="ring"
        aria-hidden
        className="pointer-events-none absolute -right-1 top-2 hidden h-16 w-16 text-accent/25 sm:block"
      />
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Coming back later</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
          Reading credit packs are on hold
        </h1>
        <p className="mt-3 text-muted">
          We&apos;re re-thinking how credit packs work before offering them
          again. In the meantime, every reading is available one at a
          time below — and a returning family&apos;s next reading still
          gets 15% off automatically, no pack needed.
        </p>
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/report"
          className="inline-block rounded-sm bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg"
        >
          Create a reading
        </Link>
      </div>
    </div>
  );
}
