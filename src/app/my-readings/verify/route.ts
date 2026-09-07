import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionToken, verifyMagicLinkToken, SESSION_COOKIE_MAX_AGE } from "@/lib/auth/magicLink";
import { siteOrigin } from "@/lib/site";

/**
 * Where a clicked magic-link email lands. Verifies the short-lived token,
 * and if valid, exchanges it for a longer-lived session cookie -- cookies
 * can only be set from a Route Handler or Server Function (not during a
 * page's render), which is why this is a route rather than a page.
 */
export async function GET(request: Request): Promise<Response> {
  const origin = await siteOrigin();
  const token = new URL(request.url).searchParams.get("token");

  const email = token ? verifyMagicLinkToken(token) : null;
  if (!email) {
    return NextResponse.redirect(`${origin}/my-readings?expired=1`);
  }

  const cookieStore = await cookies();
  cookieStore.set("stargazer_session", createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return NextResponse.redirect(`${origin}/my-readings`);
}
