import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SparkleIcon } from "@/components/icons";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Little Stargazers — Vedic Horoscope Learning Guide",
  description:
    "A gentle, encouraging look at your child's natural learning strengths, based on their Vedic birth chart.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <header className="no-print sticky top-0 z-40 border-b border-border-soft bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="group flex items-center gap-2.5">
              <SparkleIcon className="h-5 w-5 text-accent transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-serif text-[1.15rem] font-semibold tracking-tight text-primary-dark">
                Little Stargazers
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/report"
                className="whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-md hover:shadow-primary/25 sm:px-5"
              >
                <span className="sm:hidden">Get their reading</span>
                <span className="hidden sm:inline">Get your child&apos;s reading</span>
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="no-print border-t border-border-soft bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
            <div className="flex items-center gap-2 font-serif text-base font-semibold text-primary-dark">
              <SparkleIcon className="h-4 w-4 text-accent" />
              Little Stargazers
            </div>
            <p className="mt-3 max-w-xl leading-6">
              Little Stargazers offers gentle, educational guidance inspired by
              Vedic astrology. It is meant to encourage and inform — not to
              replace your own judgement, or your child&apos;s teachers and
              pediatric professionals.
            </p>
            <p className="mt-3 max-w-xl leading-6">
              Not the right fit? Email{" "}
              <a href="mailto:contact@littlestargazer.com" className="underline decoration-border-soft underline-offset-2 hover:text-primary-dark">
                contact@littlestargazer.com
              </a>{" "}
              within 14 days of purchase for a full refund, no questions asked.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <Link href="/about" className="text-muted-soft underline decoration-border-soft underline-offset-2 hover:text-primary-dark">
                About
              </Link>
              <Link href="/faq" className="text-muted-soft underline decoration-border-soft underline-offset-2 hover:text-primary-dark">
                FAQ
              </Link>
              <Link href="/sample" className="text-muted-soft underline decoration-border-soft underline-offset-2 hover:text-primary-dark">
                Sample reading
              </Link>
              <Link href="/resend-reading" className="text-muted-soft underline decoration-border-soft underline-offset-2 hover:text-primary-dark">
                Lost your reading link?
              </Link>
              <Link href="/privacy" className="text-muted-soft underline decoration-border-soft underline-offset-2 hover:text-primary-dark">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-soft underline decoration-border-soft underline-offset-2 hover:text-primary-dark">
                Terms of Service
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-soft">
              © {new Date().getFullYear()} Little Stargazers.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
