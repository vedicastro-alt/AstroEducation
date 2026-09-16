import "server-only";
import { sendEmail } from "./resend";
import { siteOrigin } from "@/lib/site";

export interface CreditPackEmailInput {
  to: string;
  packSize: number;
}

/**
 * Confirms a credit-pack purchase -- deliberately simple (no redemption
 * code to show, unlike a gift voucher): a pack redeems automatically by
 * email match at intake (see PlaceAutocomplete/ReportFlow's reward
 * banner), so there's nothing here for the buyer to copy or remember.
 */
export async function sendCreditPackPurchaseEmail(input: CreditPackEmailInput): Promise<void> {
  const origin = await siteOrigin();
  const reportUrl = `${origin}/report`;

  await sendEmail({
    to: input.to,
    subject: `Your ${input.packSize}-reading credit pack is ready`,
    html: `<p>Your ${input.packSize} reading credits are ready to use.</p>
<p>Whenever you're ready for a reading — your own further children, or anyone else's — just add <strong>${escapeHtml(input.to)}</strong> as the email on that reading's intake form, and a credit unlocks it automatically. No code to enter, no expiry.</p>
<p><a href="${reportUrl}">Start a reading now</a></p>
<p>Little Stargazers</p>`,
    text: `Your ${input.packSize} reading credits are ready to use.\n\nWhenever you're ready for a reading, add ${input.to} as the email on that reading's intake form, and a credit unlocks it automatically. No code to enter, no expiry.\n\nStart a reading: ${reportUrl}\n\nLittle Stargazers`,
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
