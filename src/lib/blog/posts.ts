export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  /**
   * ISO date this post's content was last substantively changed. Equal
   * to publishedAt until a post is actually revised -- this is a
   * freshness signal for readers and search engines, so bumping it
   * without a real content change would be a fake trust signal, the
   * same category of thing this project deliberately avoids elsewhere
   * (see HANDOFF.md §6).
   */
  updatedAt: string;
  readTime: string;
  /** Real first name only -- see HANDOFF.md §6/§7 on why this is a name, not a fabricated credential. */
  author: string;
};

/**
 * Metadata only -- each post's body lives in a matching file under
 * src/content/blog/<slug>.tsx (dynamically imported by slug in
 * src/app/blog/[slug]/page.tsx). Keeping metadata separate lets the
 * listing page render without importing every post's content.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "vedic-astrology-parenting-guide",
    title: "Vedic Astrology for Parents: A Gentle, No-Jargon Guide",
    description:
      "What Vedic astrology actually is, how it differs from the horoscope column in a newspaper, and why some parents find it a useful lens for understanding their child.",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-29",
    readTime: "7 min read",
    author: "Jaya",
  },
  {
    slug: "moon-sign-child-learning-style",
    title: "What Your Child's Moon Sign Says About How They Learn",
    description:
      "The moon sign describes emotional temperament more than the sun sign does -- and temperament shapes how a child takes in new information. A plain-language walkthrough.",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    readTime: "5 min read",
    author: "Jaya",
  },
  {
    slug: "ideal-learning-environment-birth-chart",
    title: "Finding Your Child's Ideal Learning Environment, From Their Birth Chart",
    description:
      "Some kids focus best in a quiet corner alone; others need movement, company, or noise. What a birth chart can add to that observation, and what it can't.",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    readTime: "5 min read",
    author: "Jaya",
  },
  {
    slug: "vimshottari-dasha-life-chapters-kids",
    title: "What Is Vimshottari Dasha? A Parent's Guide to Your Child's Life-Chapter Timeline",
    description:
      "Vedic astrology maps a person's life into planetary \"chapters,\" not a fixed script. Here's what that actually means, in plain terms, for a child's chart.",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    readTime: "7 min read",
    author: "Jaya",
  },
  {
    slug: "choosing-subjects-vedic-astrology",
    title: "Choosing School Subjects: What Vedic Astrology Can (and Can't) Tell You",
    description:
      "A chart can point at natural inclinations -- it can't and shouldn't decide a child's future for them. How to use that distinction well.",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    readTime: "5 min read",
    author: "Jaya",
  },
  {
    slug: "new-baby-birth-chart-reading",
    title: "Just Had a Baby? Here's What a Birth Chart Reading Actually Shows",
    description:
      "For a newborn, a birth chart reading isn't a prediction -- it's a starting sketch of temperament that fills in as your baby grows. What's real about it, and what to expect.",
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    readTime: "5 min read",
    author: "Jaya",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
