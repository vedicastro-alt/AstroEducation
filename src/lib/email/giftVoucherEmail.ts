import "server-only";
import { sendEmail } from "./resend";
import { PRICING_TIERS } from "@/lib/pricing";
import type { ReportTier } from "@/lib/reports/store";

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
          Little Stargazers · No account, no login needed.
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 28px;background:${BRAND_NAVY};color:#ffffff;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:15px;font-weight:600;">${label}</a>`;
}

function codeBlock(code: string): string {
  return `<p style="margin:16px 0 0;padding:14px 16px;background:${BODY_BG};border-radius:12px;text-align:center;font-family:'Courier New',monospace;font-size:22px;letter-spacing:0.15em;font-weight:bold;color:${BRAND_NAVY};">${code}</p>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface GiftVoucherEmailInput {
  code: string;
  tier: ReportTier;
  recipientEmail: string;
  recipientName: string | null;
  giftMessage: string | null;
  buyerEmail: string | null | undefined;
  redeemUrl: string;
}

/**
 * Sent once, on the webhook's `checkout.session.completed` confirmation
 * for a gift-voucher purchase (never before payment is confirmed) --
 * one email to the recipient with the redemption code and link, and (if
 * Stripe captured the buyer's email) a receipt copy to the buyer with
 * the same code, in case the recipient's address bounces or the buyer
 * wants to hand it over a different way.
 */
export async function sendGiftVoucherEmails(input: GiftVoucherEmailInput): Promise<void> {
  const tierName = PRICING_TIERS[input.tier].name;
  const greeting = input.recipientName ? `Hi ${escapeHtml(input.recipientName)},` : "Hi,";
  const noteHtml = input.giftMessage
    ? `<p style="margin:16px 0 0;padding:14px 16px;background:${BODY_BG};border-radius:12px;font-size:14px;line-height:1.6;font-style:italic;">"${escapeHtml(input.giftMessage)}"</p>`
    : "";

  const recipientHtml = emailShell(`
    <p style="margin:0 0 4px;font-size:13px;color:${BRAND_GOLD};text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;">A gift for you</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:${BRAND_NAVY};">Someone sent you a ${tierName}</h1>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">${greeting} a friend or family member has gifted you a Little Stargazers reading — a gentle, personalized look at how your child may learn best.</p>
    ${noteHtml}
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">Whenever you're ready, use this code to create the reading with your own child's birth details:</p>
    ${codeBlock(input.code)}
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">${ctaButton(input.redeemUrl, "Redeem your gift")}</p>
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6a6a6a;">This code is valid whenever you're ready — there's no expiry, and no account or login is needed.</p>
  `);
  const recipientText = `${greeting}\n\nSomeone sent you a ${tierName} from Little Stargazers.${input.giftMessage ? `\n\nTheir note: "${input.giftMessage}"` : ""}\n\nYour code: ${input.code}\n\nRedeem it here: ${input.redeemUrl}\n\nNo expiry, no account needed.`;

  await sendEmail({
    to: input.recipientEmail,
    subject: "You've been sent a Little Stargazers gift reading",
    html: recipientHtml,
    text: recipientText,
  });

  if (input.buyerEmail) {
    const buyerHtml = emailShell(`
      <p style="margin:0 0 4px;font-size:13px;color:${BRAND_GOLD};text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,sans-serif;">Gift sent</p>
      <h1 style="margin:0 0 16px;font-size:22px;color:${BRAND_NAVY};">Your gift ${tierName} is on its way</h1>
      <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">We've emailed ${escapeHtml(input.recipientEmail)} their redemption code. Keeping this copy in case it needs resending:</p>
      ${codeBlock(input.code)}
      <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#6a6a6a;">The code has no expiry and works whenever they're ready to enter their child's birth details.</p>
    `);
    const buyerText = `Your gift ${tierName} is on its way.\n\nWe've emailed ${input.recipientEmail} their redemption code: ${input.code}\n\nKeeping this copy in case it needs resending. No expiry.`;

    await sendEmail({
      to: input.buyerEmail,
      subject: "Your Little Stargazers gift has been sent",
      html: buyerHtml,
      text: buyerText,
    });
  }
}
