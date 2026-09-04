import type { Metadata } from "next";
import Link from "next/link";
import { getVoucherByCode } from "@/lib/giftVouchers/store";
import { PRICING_TIERS } from "@/lib/pricing";
import { RedeemForm } from "@/components/RedeemForm";
import { SparkleIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Redeem your gift — Little Stargazers",
  description: "Enter your child's birth details to create the reading someone gifted you.",
};

export default async function RedeemPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const voucher = await getVoucherByCode(code);

  const isUsable = voucher && voucher.status === "paid";

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-16">
      <div className="rounded-2xl border border-border-soft bg-surface-raised p-7 shadow-[0_20px_50px_-25px_rgba(44,40,97,0.35)] sm:p-9">
        {!voucher || voucher.status !== "paid" ? (
          <div className="text-center">
            <h1 className="font-serif text-2xl font-semibold text-primary-dark">
              {voucher?.status === "redeemed" ? "This gift has already been used" : "We couldn't find that gift code"}
            </h1>
            <p className="mt-3 text-sm text-muted">
              {voucher?.status === "redeemed"
                ? "This code has already been redeemed for a reading. If that wasn't you, please get in touch."
                : "Double-check the code from your email, or reach out and we'll help sort it out."}
            </p>
            <Link
              href="/support"
              className="mt-6 inline-block rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
            >
              Contact support
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-tint text-primary">
                <SparkleIcon className="h-5 w-5" />
              </span>
              <h1 className="mt-3 font-serif text-2xl font-semibold text-primary-dark">
                You&apos;ve been sent a {PRICING_TIERS[voucher.tier].name}
              </h1>
              {voucher.giftMessage && (
                <p className="mt-3 rounded-xl bg-accent-soft px-4 py-3 text-sm italic text-foreground/80">
                  &ldquo;{voucher.giftMessage}&rdquo;
                </p>
              )}
              <p className="mt-3 text-sm text-muted">
                Just their birth details, and the full reading is yours — already paid for.
              </p>
            </div>
            {isUsable && <RedeemForm code={code} />}
          </>
        )}
      </div>
    </div>
  );
}
