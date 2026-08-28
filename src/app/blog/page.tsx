import type { Metadata } from "next";
import Link from "next/link";
import { BookIcon } from "@/components/icons";
import { BLOG_POSTS } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog — Little Stargazers",
  description:
    "Gentle, honest reading on Vedic astrology, child temperament, and learning -- written for parents, no jargon required.",
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <BookIcon className="h-8 w-8 text-accent" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        Blog
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
        Reading on children, temperament, and learning
      </h1>
      <p className="mt-4 text-sm leading-7 text-foreground/75">
        Short, plain-language pieces on what Vedic astrology can (and
        can&apos;t) tell a parent about their child -- written with the
        same honesty as the rest of this site.
      </p>

      <div className="mt-10 space-y-8">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-border-soft bg-surface p-6 shadow-sm shadow-primary/5 transition-all hover:border-accent/40 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-soft">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              &middot; {post.readTime}
            </p>
            <h2 className="mt-2 font-serif text-lg font-semibold text-primary-dark group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              {post.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/report"
          className="inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
        >
          Get your child&apos;s free reading
        </Link>
      </div>
    </div>
  );
}
