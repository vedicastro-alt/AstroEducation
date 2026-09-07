import "server-only";
import { sendEmail } from "./resend";
import { PRICING_TIERS } from "@/lib/pricing";
import type { ReportTier } from "@/lib/reports/store";

/**
 * Warm, on-brand HTML for the two moments a paid reading actually needs
 * to land in someone's inbox: the buyer's own receipt/copy, and (when a
 * gift-delivery recipient is named) a separate copy for them. Inline
 * styles throughout -- most email clients strip <style> blocks or ignore
 * class names, so this can't lean on the site's own Tailwind setup.
 *
 * Deliberately plain, warm prose rather than a marketing-template look
 * (big hero image, multiple CTAs) -- matches the site's own voice
 * (§6/§7: warm, honest, no fabricated urgency) rather than reading like
 * a receipt from an unrelated SaaS product.
 */
const BRAND_NAVY = "#2c2861";
const BRAND_GOLD = "#c9a44c";
const BODY_BG = "#faf6ef";
const CARD_BG = "#ffffff";

function emailShell(bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:${BODY_BG};font-family:Georgia,'Times New Roman',serif;color:#2a2a2a;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;">
      <tr>
        <td style="padding-bottom:24px;text-align:center;">
          <span style="font-size:20px;font-weight:bold;color:${BRAND_NAVY};letter-spacing:0.02em;">Little Stargazers</span>
        </td>
      </tr>
      <tr>
        <td style="background:${CARD_BG};border-radius:20px;padding:32px;box-shadow:0 8px 24px rgba(44,40,97,0.08);">
          ${bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding-top:20px;text-align:center;font-size:12px;color:#8a8a8a;font-family:Arial,sans-serif;">
          Little Stargazers · No account, no login needed — this link is yours to keep.
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 28px;background:${BRAND_NAVY};color:#ffffff;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:15px;font-weight:600;">${label}</a>`;
}

interface ReadingEmailInput {
  to: string;
  childName: string;
  reportUrl: string;
  tier: ReportTier;
}

/** The buyer's own copy — sent for every completed purchase. */
export async function sendReadingEmail(input: ReadingEmailInput): Promise<void> {
  const tierName = PRICING_TIERS[input.tier].name;
  const html = emailShell(`
    <p style="margin:0 0 4px;font-size:13px;color:${BRAND_GOLD};text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;">Your reading is ready</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:${BRAND_NAVY};">${input.childName}'s ${tierName}</h1>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">Thank you for your purchase — the full reading is unlocked and ready whenever you'd like to read it.</p>
    <p style="margin:0;font-size:15px;line-height:1.6;">${ctaButton(input.reportUrl, "Read it now")}</p>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6a6a6a;">This link needs no login or account — bookmark it or keep this email, and it's yours whenever you want to come back to it.</p>
  `);
  const text = `${input.childName}'s ${tierName} is ready.\n\nRead it here: ${input.reportUrl}\n\nThis link needs no login — keep this email or bookmark the link to come back to it any time.`;

  await sendEmail({
    to: input.to,
    subject: `${input.childName}'s reading is ready`,
    html,
    text,
  });
}

interface GiftReadingEmailInput {
  to: string;
  recipientName?: string;
  childName: string;
  reportUrl: string;
  tier: ReportTier;
  giftNote?: string;
}

/** The recipient's copy, when a purchase named someone else to send the finished reading to. */
export async function sendGiftReadingEmail(input: GiftReadingEmailInput): Promise<void> {
  const tierName = PRICING_TIERS[input.tier].name;
  const greeting = input.recipientName ? `Hi ${escapeHtml(input.recipientName)},` : "Hi,";
  const noteHtml = input.giftNote
    ? `<p style="margin:16px 0 0;padding:14px 16px;background:${BODY_BG};border-radius:12px;font-size:14px;line-height:1.6;font-style:italic;">"${escapeHtml(input.giftNote)}"</p>`
    : "";
  const html = emailShell(`
    <p style="margin:0 0 4px;font-size:13px;color:${BRAND_GOLD};text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;">A gift for you</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:${BRAND_NAVY};">Someone sent you ${input.childName}'s ${tierName}</h1>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">${greeting} a friend or family member has gifted a Little Stargazers reading for ${input.childName} — a gentle, personalized look at how ${input.childName} may learn best.</p>
    ${noteHtml}
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">${ctaButton(input.reportUrl, "Read the reading")}</p>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6a6a6a;">This link needs no login or account — it's yours to keep.</p>
  `);
  const noteText = input.giftNote ? `\n\nTheir note: "${input.giftNote}"` : "";
  const text = `Someone sent you ${input.childName}'s ${tierName}.${noteText}\n\nRead it here: ${input.reportUrl}\n\nThis link needs no login — it's yours to keep.`;

  await sendEmail({
    to: input.to,
    subject: `You've been sent ${input.childName}'s reading`,
    html,
    text,
  });
}

interface FreeGiftReadingEmailInput {
  to: string;
  recipientName?: string;
  childName: string;
  reportUrl: string;
  giftNote?: string;
}

/**
 * The recipient's copy for a *free* preview reading someone chose to
 * share at intake time (the "This is a gift" checkbox on `/report`,
 * before any purchase exists) -- distinct from `sendGiftReadingEmail`
 * above, which only ever fires after a paid checkout. Kept as its own
 * function rather than a `tier: ReportTier | null` branch on the paid
 * one, since the copy genuinely differs (no tier name to reference, and
 * a soft, non-pushy mention that a deeper paid reading exists) and the
 * two call sites' inputs shouldn't be forced to share an optional field.
 */
export async function sendFreeGiftReadingEmail(input: FreeGiftReadingEmailInput): Promise<void> {
  const childName = escapeHtml(input.childName);
  const greeting = input.recipientName ? `Hi ${escapeHtml(input.recipientName)},` : "Hi,";
  const noteHtml = input.giftNote
    ? `<p style="margin:16px 0 0;padding:14px 16px;background:${BODY_BG};border-radius:12px;font-size:14px;line-height:1.6;font-style:italic;">"${escapeHtml(input.giftNote)}"</p>`
    : "";
  const html = emailShell(`
    <p style="margin:0 0 4px;font-size:13px;color:${BRAND_GOLD};text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;">A gift for you</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:${BRAND_NAVY};">Someone shared ${childName}'s free learning reading with you</h1>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">${greeting} a friend or family member used Little Stargazers to put together a free, gentle look at how ${childName} may learn best, based on their Vedic birth chart — and wanted to share it with you.</p>
    ${noteHtml}
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">${ctaButton(input.reportUrl, "Read the free reading")}</p>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6a6a6a;">This link needs no login or account — it's yours to keep. A deeper paid reading is available from the same page too, entirely optional, if it's ever something you'd like to explore further.</p>
  `);
  const noteText = input.giftNote ? `\n\nTheir note: "${input.giftNote}"` : "";
  const text = `Someone shared ${input.childName}'s free learning reading with you.${noteText}\n\nRead it here: ${input.reportUrl}\n\nThis link needs no login — it's yours to keep.`;

  await sendEmail({
    to: input.to,
    subject: `You've been sent ${input.childName}'s free reading`,
    html,
    text,
  });
}

/**
 * The "sign in" link for /my-readings -- the whole of this project's
 * passwordless identity (see src/lib/auth/magicLink.ts): possession of
 * this inbox is the only proof required. Deliberately plain and
 * single-purpose, same voice as the rest of this file.
 */
export async function sendMyReadingsLoginEmail(input: { to: string; loginUrl: string }): Promise<void> {
  const html = emailShell(`
    <p style="margin:0 0 4px;font-size:13px;color:${BRAND_GOLD};text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;">Your readings</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:${BRAND_NAVY};">See all your children's readings</h1>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">Tap the button below to see every reading tied to this email address — no password needed.</p>
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">${ctaButton(input.loginUrl, "View my readings")}</p>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6a6a6a;">This link works once and expires in 30 minutes. Didn't request this? You can safely ignore this email.</p>
  `);
  const text = `See all your children's readings — no password needed.\n\nOpen this link: ${input.loginUrl}\n\nThis link expires in 30 minutes. Didn't request this? You can safely ignore this email.`;

  await sendEmail({
    to: input.to,
    subject: "View your Little Stargazers readings",
    html,
    text,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
