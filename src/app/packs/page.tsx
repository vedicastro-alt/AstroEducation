import type { Metadata } from "next";
import Link from "next/link";
import { PackForm } from "@/components/PackForm";
import { RotatingPlanet } from "@/components/RotatingPlanet";

export const metadata: Metadata = {
  title: "Reading credit packs — Little Stargazers",
  description:
    "Buy several reading credits upfront at a discount, then redeem them one at a time whenever you're ready — for further children, or to share with family.",
};

export default function PacksPage() {
  return (
    <div className="relative mx-auto w-full max-w-lg px-6 py-16">
      <RotatingPlanet
        variant="ring"
        aria-hidden
        className="pointer-events-none absolute -right-1 top-2 hidden h-16 w-16 text-accent/25 sm:block"
      />
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">For a growing family</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
          Reading credit packs
        </h1>
        <p className="mt-3 text-muted">
          Buy several full readings upfront at a discount, then redeem them
          one at a time — whenever a reading is ready, not all at once.
          Valid for 3 years from purchase, no subscription, and no
          account needed beyond the email you use to redeem them.
        </p>
      </div>
      <div className="mt-8 rounded-2xl border border-border-soft bg-surface-raised p-7 shadow-[0_20px_50px_-25px_rgba(44,40,97,0.35)] sm:p-9">
        <PackForm />
      </div>
      <p className="mt-5 text-center text-xs text-muted">
        Just need one reading right now?{" "}
        <Link href="/report" className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary">
          Create it directly
        </Link>{" "}
        — no need for a pack.
      </p>
    </div>
  );
}
