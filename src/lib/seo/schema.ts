import "server-only";
import { SITE_URL } from "@/lib/site";
import type { BlogPost } from "@/lib/blog/posts";

/**
 * Structured-data builders for JSON-LD. Kept as plain object literals
 * (no schema-dts dependency) -- Google only cares that the emitted
 * <script type="application/ld+json"> matches schema.org's shape.
 */

const SITE_NAME = "Little Stargazers";
const SITE_LOGO_URL = `${SITE_URL}/icon`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO_URL,
  };
}

export function blogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO_URL,
      },
    },
  };
}

export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * Renders a JSON-LD payload as a script tag's inner HTML. `</` is escaped
 * so a string containing a closing tag can't break out of the <script>
 * element (JSON.stringify alone doesn't guard against that).
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
