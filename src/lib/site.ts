import "server-only";
import { headers } from "next/headers";

/**
 * Base site URL for building absolute URLs (sitemap, robots, canonical
 * links). Falls back to a placeholder domain -- update NEXT_PUBLIC_SITE_URL
 * once the real production domain is settled (see HANDOFF.md).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://littlestargazer.com";

/**
 * Origin derived from the incoming request, for absolute URLs built
 * inside a server action (Stripe Checkout success/cancel URLs, a resent
 * reading link) where SITE_URL's build-time env value would be wrong on
 * a preview deployment.
 */
export async function siteOrigin(): Promise<string> {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
