import type { Metadata } from "next";
import { TelescopeIcon } from "@/components/icons";
import { ResendReadingForm } from "@/components/ResendReadingForm";

export const metadata: Metadata = {
  title: "Lost your reading link? — Little Stargazers",
  description: "Get the link to a paid reading resent to your email.",
};

export default function ResendReadingPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-16 sm:py-24">
      <TelescopeIcon className="h-8 w-8 text-accent" />
      <h1 className="mt-4 font-serif text-3xl font-semibold text-primary-dark">
        Lost your reading link?
      </h1>
      <p className="mt-3 text-sm leading-6 text-foreground/80">
        There&apos;s no account or password to remember — just enter the
        email address you used at checkout, and we&apos;ll send the direct
        link(s) to any paid reading(s) on file for it.
      </p>

      <div className="mt-8">
        <ResendReadingForm />
      </div>
    </div>
  );
}
