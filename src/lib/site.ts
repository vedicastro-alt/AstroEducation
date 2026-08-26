/**
 * Base site URL for building absolute URLs (sitemap, robots, canonical
 * links). Falls back to a placeholder domain -- update NEXT_PUBLIC_SITE_URL
 * once the real production domain is settled (see HANDOFF.md).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://littlestargazer.com";
