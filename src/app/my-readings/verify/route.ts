import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  verifyMagicLinkToken,
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/magicLink";
import { siteOrigin } from "@/lib/site";

/**
 * Where a clicked magic-link email lands. Verifies the short-lived token,
 * and if valid, exchanges it for a longer-lived session cookie -- cookies
 * can only be set from a Route Handler or Server Function (not during a
 * page's render), which is why this is a route rather than a page.
 *
 * Shared by two callers now (HANDOFF §65): the original My Readings
 * sign-in, and the report paywall's email-ownership check before a
 * sibling discount or pack credit is honored. `next` says where to land
 * afterward -- validated as a same-site relative path only (never an
 * absolute or protocol-relative URL) so this can't be turned into an
 * open redirect.
 */
export async function GET(request: Request): Promise<Response> {
  const origin = await siteOrigin();
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const nextParam = url.searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/my-readings";

  const email = token ? verifyMagicLinkToken(token) : null;
  if (!email) {
    const separator = next.includes("?") ? "&" : "?";
    return NextResponse.redirect(`${origin}${next}${separator}expired=1`);
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return NextResponse.redirect(`${origin}${next}`);
}
