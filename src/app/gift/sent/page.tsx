import type { Metadata } from "next";
import Link from "next/link";
import { SparkleIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Gift sent — Little Stargazers",
  description: "Your gift reading is on its way.",
};

export default function GiftSentPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-24 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
        <SparkleIcon className="h-6 w-6" />
      </span>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-primary-dark">Your gift is on its way</h1>
      <p className="mt-3 text-muted">
        We&apos;ve emailed the recipient their redemption code and a link to
        create their reading whenever they&apos;re ready — no expiry, no
        account needed. We&apos;ve sent you a copy of the code too, in case
        it needs resending.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
      >
        Back to home
      </Link>
    </div>
  );
}
