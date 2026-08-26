import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only public, indexable pages -- individual /report/[id] pages are
 * private (unlisted, shareable-link-only) and intentionally excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/report", "/sample", "/about", "/faq", "/privacy", "/terms"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
