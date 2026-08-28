// Temporary route to verify Sentry delivery end-to-end. Remove once
// confirmed -- see HANDOFF.md.
export async function GET() {
  throw new Error("Sentry test error -- safe to ignore, this route is removed after confirming delivery.");
}
