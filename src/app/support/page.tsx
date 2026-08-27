import type { Metadata } from "next";
import { TelescopeIcon } from "@/components/icons";
import { SupportForm } from "@/components/SupportForm";

export const metadata: Metadata = {
  title: "Support — Little Stargazers",
  description: "Get in touch with a question or an issue with your reading.",
};

export default function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-16 sm:py-24">
      <TelescopeIcon className="h-8 w-8 text-accent" />
      <h1 className="mt-4 font-serif text-3xl font-semibold text-primary-dark">
        Get in touch
      </h1>
      <p className="mt-3 text-sm leading-6 text-foreground/80">
        A question, or something not right with a reading? Send us a
        message and we&apos;ll reply to your email directly — or write to{" "}
        <a
          href="mailto:contact@littlestargazer.com"
          className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
        >
          contact@littlestargazer.com
        </a>{" "}
        yourself.
      </p>

      <div className="mt-8">
        <SupportForm />
      </div>
    </div>
  );
}
