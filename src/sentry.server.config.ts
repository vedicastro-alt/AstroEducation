import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  // No dashboard traffic to speak of yet; keep it cheap on the free tier.
  enabled: Boolean(process.env.SENTRY_DSN),
  // Temporary: logs DSN validity and every send attempt/result to the
  // Vercel function logs, to diagnose why events weren't arriving.
  // Remove once delivery is confirmed working.
  debug: true,
});
