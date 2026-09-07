import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Passwordless "my readings" identity -- an email-only alternative to a
 * real accounts system (HANDOFF.md §41: chosen deliberately over full
 * Supabase Auth as the lightweight option). No passwords are ever
 * stored; possession of the inbox at a given email is the only proof of
 * identity, the same trust model `/resend-reading` already uses.
 *
 * Two distinct token kinds share this signing scheme, kept apart by a
 * `purpose` tag baked into the signed payload -- a magic-link token
 * emailed to someone must never be replayable as a long-lived session
 * cookie, and vice versa.
 */
type TokenPurpose = "magiclink" | "session";

const MAGIC_LINK_TTL_SECONDS = 30 * 60; // 30 minutes -- long enough to find the email, short enough to limit a leaked-link window.
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days.

function getSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret) {
    throw new Error("MAGIC_LINK_SECRET is not configured.");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual throws on mismatched lengths rather than returning
  // false -- an attacker-controlled token could otherwise use timing
  // differences on the length check itself, so length is checked
  // separately (still constant-time relative to guessing bytes, and
  // never leaks anything beyond "wrong length", which is already public).
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function encode(purpose: TokenPurpose, email: string, ttlSeconds: number): string {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${purpose}:${email}:${expires}`;
  const signature = sign(payload);
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

function decode(purpose: TokenPurpose, token: string): string | null {
  let raw: string;
  try {
    raw = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const parts = raw.split(":");
  if (parts.length !== 4) return null;
  const [tokenPurpose, email, expiresRaw, signature] = parts;
  if (tokenPurpose !== purpose) return null;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || Date.now() / 1000 > expires) return null;

  const payload = `${tokenPurpose}:${email}:${expiresRaw}`;
  if (!safeEqual(sign(payload), signature)) return null;

  return email;
}

/** A short-lived, single-use-in-spirit token to email as a "sign in" link. */
export function createMagicLinkToken(email: string): string {
  return encode("magiclink", email, MAGIC_LINK_TTL_SECONDS);
}

/** Verifies a magic-link token from a clicked email link. Returns the email, or null if invalid/expired. */
export function verifyMagicLinkToken(token: string): string | null {
  return decode("magiclink", token);
}

/** A longer-lived token to store in a cookie once a magic link has been verified. */
export function createSessionToken(email: string): string {
  return encode("session", email, SESSION_TTL_SECONDS);
}

export const SESSION_COOKIE_MAX_AGE = SESSION_TTL_SECONDS;

/** Verifies a session cookie's value. Returns the email, or null if invalid/expired/tampered. */
export function verifySessionToken(token: string): string | null {
  return decode("session", token);
}
