import type { Metadata } from "next";
import Link from "next/link";
import { SparkleIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Pack purchased — Little Stargazers",
  description: "Your reading credits are ready to redeem.",
};

export default function PackPurchasedPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-24 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
        <SparkleIcon className="h-6 w-6" />
      </span>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-primary-dark">Your credits are ready</h1>
      <p className="mt-3 text-muted">
        Whenever you&apos;re ready for a reading, add the same email you
        just used here to that child&apos;s reading, and a credit unlocks
        it automatically — no need to pay again. No expiry.
      </p>
      <Link
        href="/report"
        className="mt-8 inline-block rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
      >
        Start a reading now
      </Link>
    </div>
  );
}
