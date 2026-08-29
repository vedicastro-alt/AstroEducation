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
  {
    slug: "middle-school-subject-selection-birth-chart",
    title: "Picking Middle School Electives: What a Birth Chart Can Add to the Decision",
    description:
      "Ages 11-14 often bring a family's first real subject-choice decision -- electives, streams, options forms. How the same chart signals from a full reading apply to that specific moment, without narrowing a child's options too early.",
    publishedAt: "2026-08-29",
    updatedAt: "2026-08-29",
    readTime: "5 min read",
    author: "Jaya",
  },
  {
    slug: "senior-year-subjects-university-direction-birth-chart",
    title: "Choosing Senior Subjects and a University Direction: Why This Isn't a Prediction",
    description:
      "For teens narrowing toward final subjects or a degree area, what a birth chart can honestly add to that decision -- and the firm limits on what it can't, stated plainly up front.",
    publishedAt: "2026-08-29",
    updatedAt: "2026-08-29",
    readTime: "6 min read",
    author: "Jaya",
  },
  {
    slug: "wired-differently-from-your-child",
    title: "Why You Might Feel \"Wired Differently\" From Your Child",
    description:
      "A common, quiet parenting feeling -- not understanding your child the way you expected to. What their own birth chart can add to that, without a joint or comparison reading, because there isn't one.",
    publishedAt: "2026-08-29",
    updatedAt: "2026-08-29",
    readTime: "5 min read",
    author: "Jaya",
  },
  {
    slug: "highly-sensitive-child-birth-chart",
    title: "The Highly Sensitive Child, Through a Birth Chart Lens",
    description:
      "Highly Sensitive Child is a real psychological framework, not an astrology term. How a chart's moon-sign signals can complement it, carefully, without ever claiming to diagnose or confirm it.",
    publishedAt: "2026-08-29",
    updatedAt: "2026-08-29",
    readTime: "6 min read",
    author: "Jaya",
  },
  {
    slug: "why-siblings-turn-out-different-birth-chart",
    title: "Why Siblings Raised the Same Way Turn Out So Different",
    description:
      "Same home, same rules, same parents -- and still two very different kids. What each child's own separate birth chart reading adds to a question every parent of more than one asks eventually.",
    publishedAt: "2026-08-29",
    updatedAt: "2026-08-29",
    readTime: "5 min read",
    author: "Jaya",
  },
  {
    slug: "mercury-placement-child-communication-style",
    title: "What Your Child's Mercury Placement Says About How They Take In Information",
    description:
      "Mercury governs analytical thinking, language, and communication in Vedic astrology -- a different domain from the moon sign's emotional temperament. A plain-language look at what it adds.",
    publishedAt: "2026-08-29",
    updatedAt: "2026-08-29",
    readTime: "6 min read",
    author: "Jaya",
  },
  {
    slug: "twins-birth-chart-different-personalities",
    title: "Twins With Near-Identical Charts, Very Different Kids",
    description:
      "Twins share almost the same birth chart and still turn out to be different people. What that says about the honest limits of a reading -- and what each twin's own separate reading is actually for.",
    publishedAt: "2026-08-29",
    updatedAt: "2026-08-29",
    readTime: "5 min read",
    author: "Jaya",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
