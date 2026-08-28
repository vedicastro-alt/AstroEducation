import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SparkleIcon } from "@/components/icons";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog/posts";

const POST_CONTENT: Record<string, () => Promise<{ default: ComponentType }>> = {
  "vedic-astrology-parenting-guide": () =>
    import("@/content/blog/vedic-astrology-parenting-guide"),
  "moon-sign-child-learning-style": () =>
    import("@/content/blog/moon-sign-child-learning-style"),
  "ideal-learning-environment-birth-chart": () =>
    import("@/content/blog/ideal-learning-environment-birth-chart"),
  "vimshottari-dasha-life-chapters-kids": () =>
    import("@/content/blog/vimshottari-dasha-life-chapters-kids"),
  "choosing-subjects-vedic-astrology": () =>
    import("@/content/blog/choosing-subjects-vedic-astrology"),
  "new-baby-birth-chart-reading": () =>
    import("@/content/blog/new-baby-birth-chart-reading"),
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Little Stargazers`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const loadContent = POST_CONTENT[slug];
  if (!post || !loadContent) notFound();

  const { default: Content } = await loadContent();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
      <Link
        href="/blog"
        className="text-xs font-semibold uppercase tracking-[0.14em] text-accent hover:text-accent-bright"
      >
        &larr; Blog
      </Link>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-soft">
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}{" "}
        &middot; {post.readTime}
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-primary-dark sm:text-4xl">
        {post.title}
      </h1>

      <article className="mt-8 space-y-6 text-sm leading-7 text-foreground/80 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-primary-dark [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-foreground/75 [&_li]:list-disc">
        <Content />
      </article>

      <div className="mt-12 flex flex-wrap items-center gap-4 rounded-2xl border border-border-soft bg-surface p-6">
        <SparkleIcon className="h-6 w-6 shrink-0 text-accent" />
        <div className="flex-1 min-w-[200px]">
          <p className="font-serif text-base font-semibold text-primary-dark">
            Curious what this looks like for your own child?
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            See a full example reading, free, no signup required.
          </p>
        </div>
        <Link
          href="/sample"
          className="inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
        >
          View a sample reading
        </Link>
      </div>
    </div>
  );
}
