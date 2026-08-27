import "server-only";

const RESEND_API_URL = "https://api.resend.com/emails";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/**
 * Thin wrapper over Resend's HTTP API -- a single transactional send
 * doesn't need the full SDK. The sending domain (RESEND_FROM_EMAIL) must
 * be verified in the Resend dashboard first, or sends will fail.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Resend is not configured: set RESEND_API_KEY.");
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Little Stargazers <contact@littlestargazer.com>";

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend request failed (${response.status}): ${body}`);
  }
}
