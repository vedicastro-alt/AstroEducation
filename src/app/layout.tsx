import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
        <header className="border-b border-border bg-surface/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span aria-hidden className="text-xl">✨</span>
              <span className="font-serif text-lg font-semibold text-primary-dark">
                Little Stargazers
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/report"
                className="rounded-full bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark"
              >
                Get your child&apos;s reading
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-border bg-surface">
          <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-muted">
            <p>
              Little Stargazers offers gentle, educational guidance inspired by
              Vedic astrology. It is meant to encourage and inform — not to
              replace your own judgement, or your child&apos;s teachers and
              pediatric professionals.
            </p>
            <p className="mt-3">© {new Date().getFullYear()} Little Stargazers.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
