# Little Stargazers — Project Handoff & Launch Plan

**Written:** 2026-08-26 · **Last updated:** 2026-08-29 · **Repo:** `vedicastro-alt/AstroEducation` · **Branch:** `claude/vedic-horoscope-learning-site-fb6fta` · **Latest commit:** `027551d`

> **New agent starting now: read §18 first.** It's the current top-priority task — a conversion test just found that 0 of 3 realistic parent personas would have paid, with the findings converging on one root cause. Everything else in this document is settled/background; §18 is what the founder wants worked next.

> ⚠️ `claude/vedic-horoscope-learning-site-fb6fta` is this repo's **only branch and its default/HEAD branch** — there's no separate `main`. Vercel deploys straight from it. Pushing here is shipping to production, immediately — there is no staging step.

This document exists so a new agent (or the founder) can pick this project up cold, with full context on what's built, why it's built that way, what's been tested, and exactly what's left before launch. It's a handoff, not marketing copy — it says where things are weak as plainly as where they're strong.

---

## 1. What this is

**Little Stargazers** generates a gentle, encouraging Vedic-astrology-based "learning pathway" reading for parents about their child's educational strengths and growth areas. Free preview, two paid one-time tiers. The founder's stated goal is a **genuine passive-income side business** — not a venture-scale play, not a labor-intensive consultation service.

Non-negotiable product stance, established early and held throughout: **warm and emotionally resonant marketing is fine; fabricated reviews, fake urgency/scarcity, and fear-based framing are not.** This isn't a vague ethics preference — it's grounded in Australian Consumer Law (misleading/deceptive conduct, s18; the new unfair-trading-practices regime targeting fake urgency cues specifically), since the business is Australian-owned and -hosted. See §7.

---

## 2. Current status

**The product is feature-complete as a prototype and has been through one real round of user-critique QA with fixes applied.** It has *not* been launched — no real traffic, no content/SEO presence, no email list. Payment (Stripe) was tested end-to-end by the founder and confirmed working before the QA round in this document; the QA round did not touch payment logic. **Update 27 Aug 2026: Stripe is now fully live.** The account cleared manual review, the founder switched `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` in Vercel to live values, registered a live webhook endpoint, and verified the whole path with a real purchase (report unlocked correctly, webhook delivery showed `200`). No hold on traffic-driving work anymore.

What exists today:
- Full birth-chart calculation engine (real ephemeris, Lahiri ayanamsa, whole-sign houses, Vimshottari dasha) — astronomically correct, verified against reference values earlier in development.
- Free preview + two-tier paid reading ($25 / $35, $15 upgrade path from $25→$35), Stripe Checkout wired and tested live.
- Book-style paginated reading UI with a real, data-driven chart diagram (not decorative).
- A public `/sample` page showing a full example reading with no signup.
- `/about` and `/faq` pages with honest methodology and no fabricated credentials.
- Gift-purchase framing, a fault-based refund policy (narrowed from an earlier unconditional 14-day guarantee — see §11) surfaced at point of purchase, and a founder's-note trust section on the landing page.
- One full round of independent, simulated cold-visitor QA (three personas) with all findings addressed — see §8.

**Update (post-handoff):** the production domain is now settled as `littlestargazer.com` (singular — `littlestargazers.com`/`.org` were both already registered by others), registered via Cloudflare, with Cloudflare Email Routing forwarding `contact@littlestargazer.com` to the founder's personal inbox. Site copy, `NEXT_PUBLIC_SITE_URL`, and the Privacy/Terms pages below were all updated to match — the visible "Little Stargazers" brand name is unchanged, only the domain/email are singular.

**Update (post-handoff): reading-engine depth pass.** Founder feedback after launch-checklist work: readings read as too generic, with content that varied only by which sign a lead planet sat in regardless of how strong that placement actually was. Addressed in two phases (a third, the D24 divisional chart, was scoped but explicitly deferred by the founder as unnecessary):
- **Phase 1** (`src/lib/astro/aspects.ts`, `src/lib/education/narrative.ts`): added Parashari drishti (aspects) and conjunction detection, and rewrote `metrics.ts`/`subjects.ts`/`direction.ts` around graded tiers (flourishing/steady/growing) driven by real score rather than a binary top-N/bottom-N split, with citations that name house, dignity, conjunctions, and aspects, plus interpretation text (not just the citation) that changes with *why* a placement is strong — a placement's exaltation or a specific conjunction partner now changes the actual sentence, not just a technical prefix. After founder feedback that citations made the text too long, `citePlacement`/`citeHouseLord` were tightened to a compact clause ("Jupiter sits in Virgo, 2nd house, aspected by Moon.") instead of a full sentence.
- **Phase 2** (`src/lib/astro/yogas.ts`, `src/lib/education/yogas.ts`): detects four classical yogas (Gajakesari, Budha-Aditya, Saraswati, Neecha Bhanga) and surfaces them as a conditional "Special chart combination(s)" chapter in the report, only inserted when at least one is found. Important calibration: tested detection across ~50 sample charts before finalizing copy — Budha-Aditya fires in roughly half of all charts (a structural fact of Mercury's orbit, not rarity), while Saraswati/Neecha Bhanga are meaningfully rarer (~1 in 8); content is worded to match each yoga's actual frequency rather than uniformly claim scarcity.
- **Explicitly deferred, by the founder's own call:** Phase 3, a D24 (Siddhamsha) divisional-chart calculation. This would have been genuinely new astronomical calculation (not pattern-matching over already-computed data, unlike Phase 2) and would have warranted the same reference-value verification the original ascendant calculation got. Revisit only if the founder raises it again.

**Update (post-handoff): magic-link email capture shipped and verified live.** See §10 for full detail. Buyer emails are now captured from Stripe Checkout, and a parent can recover a paid reading's link at `/resend-reading` (footer: "Lost your reading link?"). Resend is wired in and confirmed working via a real production purchase + resend test. One rollout incident worth knowing about if a future migration goes out: shipping the new `customer_email` column briefly broke all report pages, because the Supabase migration file was pushed but never actually run against the live database — see §10's callout for the exact failure mode and fix.

**Update (28 Aug 2026): pre-launch housekeeping batch, and Stripe went fully live.** See §11 for full detail. Stripe cleared manual review and is now processing real payments (§8 item 4 done). Separately, a founder-requested batch shipped: the refund policy was narrowed (no longer an unconditional 14-day guarantee), the resend-reading link was made more visible, a `/support` contact form was added, Dependabot was turned on, and Sentry error alerting is wired in and confirmed working live (with a real rollout bug along the way — `instrumentation.ts` needed to live in `src/`, not the project root — see §11's callout).

**Update (28 Aug 2026): blog/SEO shipped, Google Search Console live, brand mark changed, two founder's-brother UX fixes shipped.** See §13, §14, §15 for full detail — condensed here:
- Content/SEO (§8 item 8) is **done**: 6 cornerstone blog posts live at `/blog`, wired into the sitemap. Google Search Console is verified (DNS TXT via Cloudflare) and the sitemap is submitted — see §13.
- **Brand name collision investigated and resolved, logo changed.** A near-identical-named children's astrology brand (`littlestargazers.org`, a picture-book series, no social presence, pre-launch) was found. An IP Australia trademark search came back clean. Decision: keep the "Little Stargazers" name, but change the visual mark (the sparkle icon looked too similar to the other site's) to a distinct "Growth Path" icon (sprout + rising star) — see §14 for the full rationale and what changed.
- **Two pieces of real user feedback (the founder's brother) diagnosed and fixed**, both shipped to production: (1) every reading insight led with technical chart-citation jargon before the actual point — reordered in one shared function; (2) the landing page hero read as a generic AI-generated SaaS template — rebuilt as a full-bleed constellation/night-sky design. See §15.
- **Pinterest (§8 item 9) is in progress, not done** — all creative assets are ready (pins, profile logo, copy) but the actual Pinterest Business account, site verification, and board/pin uploads are founder-only actions still pending. See §16 for where this stands — **paused, not the current priority; see §18.**

**Update (29 Aug 2026): SEO Phase 0-2 shipped (13 blog posts total), two content-engine bugs found and fixed, a real Stripe unlock bug found and fixed, and a conversion-quality test came back at 0/3 — this is the current priority.** Full detail in the new sections below:
- §17 — SEO structured data/byline/internal-linking, real proprietary yoga-frequency data folded into the pillar post, and 7 new blog posts (13 total). Done, shipped.
- §18 — **read this first.** A 3-persona conversion test (age-4, age-12, age-17 parents) found 0/3 would pay, converging on one structural finding: age-tailoring in the reading is cosmetic (a header/label), not real. Full verbatim findings preserved so nothing gets lost — this is the next task.
- §19 — two content-engine bugs the persona test surfaced (duplicate citation text; a Subjects/Direction chapter contradiction). Both fixed already, kept here as a record and for the architectural lesson.
- §20 — a real, non-obvious Stripe checkout bug (a database read-after-write race, not a caching or config issue as it first appeared) found and fixed during a separate live-testing session with the founder. Fixed, shipped, verified.

What does **not** exist yet:
- A live Pinterest presence (assets are ready — see §16 — but no account/boards/pins are live yet).
- Guest-post backlinks, Reddit/Facebook-group organic mentions, or directory submissions (copy/drafts are ready — see §16 — none posted yet).
- Marketing email capture or a nurture sequence (the transactional "resend my reading" magic-link flow has since been added post-handoff — see §10 — but that's deliberately not a mailing list).
- Analytics (privacy-respecting analytics via Vercel Analytics has since been added post-handoff — see update above).
- Privacy Policy / Terms of Service pages (added post-handoff — see update above).
- A confirmed-complete Stripe business-profile/description audit (flagged as a to-do; only the founder can do this, it requires dashboard access).

---

## 3. Tech stack & architecture

- **Framework:** Next.js 16.3.2 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4.
- **Astro calculation:** `astronomy-engine` npm package (real ephemeris) + hand-built Lahiri ayanamsa / whole-sign house / Vimshottari dasha logic in `src/lib/astro/`.
- **Persistence:** Supabase (Postgres), service-role key, server-only access — no client-side Supabase, no user accounts/login. A report is a row with a shareable UUID link.
- **Payments:** Stripe Checkout, inline `price_data` (no pre-configured Stripe Price objects), dual-path confirmation (immediate verify-on-redirect + webhook as source of truth).
- **Geocoding:** Open-Meteo (free, keyless) with a small bundled offline fallback city list (`src/lib/geo/fallback-cities.ts`) if the live API is unreachable.
- **Everything currently runs on free tiers** (Vercel, Supabase, Stripe test/low-volume). No paid infrastructure yet.

### Key files
| Area | Path |
|---|---|
| Chart calculation | `src/lib/astro/` (`chart.ts`, `ayanamsa.ts`, `dasha.ts`, `dignity.ts`, `aspects.ts` (drishti/conjunctions), `yogas.ts` (classical combinations), `constants.ts`, `types.ts`) |
| Education/content engine | `src/lib/education/` (`engine.ts`, `pathway.ts`, `subjects.ts`, `direction.ts`, `metrics.ts`, `scoring.ts`, `narrative.ts` (shared citation/tier/composition helpers), `yogas.ts` (special-combination content), `remedies.ts`) |
| Pricing | `src/lib/pricing.ts` |
| Supabase persistence | `src/lib/reports/store.ts`, `src/lib/supabase/` |
| Stripe | `src/lib/stripe/server.ts`, `src/app/api/stripe/webhook/route.ts`, `src/app/report/[id]/actions.ts` |
| Report intake | `src/app/actions.ts`, `src/components/ReportFlow.tsx`, `src/components/PlaceAutocomplete.tsx` |
| Reading UI | `src/components/ReportView.tsx`, `BookReader.tsx`, `pathwayPages.tsx`, `KundliChart.tsx` |
| Routes | `src/app/page.tsx` (landing), `src/app/report/page.tsx` (intake), `src/app/report/[id]/page.tsx` (result), `src/app/sample/page.tsx`, `src/app/about/page.tsx`, `src/app/faq/page.tsx`, `src/app/resend-reading/`, `src/app/support/`, `src/app/blog/page.tsx` + `src/app/blog/[slug]/page.tsx` (§13) |
| Blog content | `src/lib/blog/posts.ts` (metadata registry), `src/content/blog/*.tsx` (one file per post body, plain JSX prose matching `/about`/`/faq` style — no MDX dependency in this repo) |
| DB schema | `supabase/migrations/*.sql` |
| Email (Resend) | `src/lib/email/resend.ts`; used by `src/app/resend-reading/actions.ts` and `src/app/support/actions.ts` |
| Error alerting / ops | `src/instrumentation.ts`, `src/instrumentation-client.ts`, `src/sentry.server.config.ts`, `src/sentry.edge.config.ts` (all must live under `src/`, not the project root — see §11's rollout-bug callout), `.github/dependabot.yml` |
| Brand mark / icons | `src/components/icons.tsx` (`GrowthPathIcon` is the current logo mark — see §14; `SparkleIcon`/`SproutIcon` etc. remain for decorative use elsewhere, not the logo), `src/app/icon.tsx` + `src/app/apple-icon.tsx` (code-generated via `next/og`'s `ImageResponse`, this Next version's convention — see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md` before touching) |
| Landing page hero | `src/app/page.tsx` (hero section only was redesigned — §15), `src/components/ConstellationSky.tsx` (decorative night-sky SVG, hardcoded coordinates for hydration-safety, same convention as `ChartWheel.tsx`) |
| Reading insight composition | `src/lib/education/narrative.ts`'s `renderTieredInsight` — shared by `subjects.ts`, `metrics.ts`, `direction.ts`; composes every subject/strength/growth/direction sentence. Order matters here — see §15. |

### Environment variables (`.env.example`)
Grown since this document was first written — `.env.example` is the source of truth, kept in sync with comments explaining where each value comes from. As of this update: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (all live-mode as of §8 item 4), `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (§10), `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, optionally `SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN` (§11), and `NEXT_PUBLIC_SITE_URL`. All confirmed working in production.

### A sandbox quirk worth knowing
This project has been developed inside a sandboxed environment whose network egress blocks Supabase and Vercel preview/custom domains directly. This is **not a production issue** — it only affects testing from inside that specific sandbox. The established workaround, used repeatedly during development, is a temporary `src/app/dev-preview/page.tsx` route that renders the same components with locally-computed sample data (no DB write), screenshotted via Playwright, **always deleted before committing**. If a future agent hits `EGRESS_BLOCKED` or a Supabase "host not in allowlist" error while testing locally, this is why — it doesn't mean anything is broken in production.

---

## 4. Business model & pricing

- **Tier 1 — "The Guiding Stars Reading" — $25**: full personalized learning pathway (subjects, natural direction, life-chapter timeline, ideal learning environment, weekly rhythm).
- **Tier 2 — "The Complete Constellation Reading" — $35**: everything in Tier 1 plus gentle, traditional remedies personalized to the child's chart (explicitly "no gemstones, nothing prescriptive").
- **Upgrade path**: a parent who already bought Tier 1 can add remedies for **$15** (not the full $35) — this required a deliberate branch in the Stripe Checkout logic (`src/app/report/[id]/actions.ts`) to detect "already owns full, upgrading" vs. "fresh purchase."
- **Pricing is per report/child, not per account** — there are no accounts. A parent with three kids pays three times.
- Positioning: priced above commodity astrology reports ($6.95-class templated products) and below the boutique/human-design category ($47-125), deliberately in USD (not ₹) to support the "appeals to any parent, not just Indian" goal.

---

## 5. Market research summary

Two rounds of research were done and are worth reading in full before making channel/positioning decisions:

1. **Full market assessment** (competitive landscape, market sizing, financial scenarios, risk register) — published as an artifact: **https://claude.ai/code/artifact/38336085-9165-41c9-86b7-eeca96b86bdc**

Headline findings, condensed:
- The niche (Vedic astrology × child-specific × global/non-jargon tone × modern UX) is real but narrow — every direct competitor found (AstroKids.ai, Astro Mentor Kids, Cafe Astrology Kid Zone, STAR/CHILD, India's "Education Report" vertical) fails at least one of those dimensions. Little Stargazers, as built, is the only product that clears all five — that's the actual competitive gap, not a vague "big market" claim.
- Realistic passive-income range: **$300–$2,000/month within 12–18 months** of consistent content effort. Not instant, not venture-scale.
- **Paid ads are a poor channel fit** — Meta treats astrology as a sensitive category with restricted targeting; margins at a $25–35 price point don't survive typical CPCs at a 1–3% conversion rate. **Organic content + Pinterest is the identified primary channel** (case studies in the research show outsized performance for parenting/spiritual content specifically).
- **Payment processor risk**: Stripe's restricted-business rules name "psychic services"/"occult material." The mitigation already built in is that site copy avoids prediction/fortune-telling framing throughout (favors "education," "parenting guidance," "personality insight"). Paddle explicitly bans horoscopes outright — ruled out as an alternative. Lemon Squeezy is untested/ambiguous. **Recommendation: stay on Stripe**, audit the Stripe dashboard business description for trigger words (manual, founder-only action), and revisit specialty processors only if real volume ever triggers a flag.

---

## 6. Product/ethical constraints (read before writing any marketing copy)

Established explicitly and held throughout development — a new agent should not relax these without the founder raising it again:

- **No fabricated reviews or testimonials.**
- **No fake urgency or scarcity** (countdown timers, "X spots left," fake buyer counts).
- **No fear-based framing** ("your child will struggle without this").
- Legitimate, bolder persuasion (specificity, emotional warmth, confident CTAs) is explicitly encouraged and has already been applied to the landing page and pricing copy.
- Rationale is legal, not just moral: Australian Consumer Law bans the first two outright for an AU-based business, with penalties up to $50M or 30% of turnover for a company; the third is also the exact profile of complaint that drives chargebacks, which threatens the Stripe relationship directly.
- The `/about` and `/faq` pages deliberately contain **no invented founder bio or fake credentials** — "small independent team" is stated plainly rather than fabricated authority. Keep it that way unless a real name/credential is provided by the founder.

---

## 7. QA history: three-persona critique (do this again before major changes)

A cheap, high-value technique used once already, worth repeating before future major launches: spin up 2-3 agents with genuinely different mindsets, each browsing the live site cold, in character, deciding for themselves whether to continue or bounce, instructed to be harsh rather than polite.

**Personas used:** a skeptical non-believer (scam-radar primed), an experienced/discerning astrology believer (compares against real paid readings), and an impatient mobile parent with a 4-minute window. All three were run via Playwright against a local dev server (their own worktrees, no source-code reading allowed, screenshots saved).

**Result: 1 of 3 would have bought** (the believer, $35 tier) — driven by the two chapters that actually impressed her (the dasha timeline, the remedies) turning out to be exactly what's paywalled, not padding around it. The other two had specific, fixable reasons, not "the idea doesn't work."

**Bugs found and fixed (commit `c6cb582`):**
1. Chapter navigation didn't reset scroll position — a visitor could land on the paywall chapter mid-scroll, past the cheaper tier, straight onto the pricier upsell card. Fixed in `BookReader.tsx` (scroll-into-view on page change).
2. A failed form submission silently wiped Name/DOB/Time (React's automatic form-reset behavior on uncontrolled fields). Fixed by making those fields controlled state in `ReportFlow.tsx`.
3. A save failure showed the raw exception message (including internal infra detail) to the parent. Fixed by splitting chart-computation and save into separate try/catch blocks in `src/app/actions.ts`, with a generic friendly message on save failure.

**Content gaps found and fixed (same commit):**
4. Chart-citation specificity faded in the back-half chapters (subjects support, direction, environment) — fixed by weaving real placement citations into `subjects.ts`, `direction.ts`, `pathway.ts`.
5. The "natural direction" chapter named specific career fields in a way that read as prediction rather than possibility — reframed with explicit "not a prediction" language.
6. No chart visual existed anywhere (all decorative) — built `KundliChart.tsx`, a real South-Indian-style chart diagram driven by the child's actual placements.
7. No credibility page existed — added `/about` and `/faq`.
8. Price wasn't visible until chapter 6 of the reading — surfaced on the landing page hero and above the intake form submit button.

All fixes were re-verified against a live reproduction of the original failures (not just read in code) before committing.

---

## 8. Launch checklist — do these next, in order

### Before any traffic-driving work (cheap, mostly founder-only actions)
1. ✅ **Done.** Real, monitored inbox set up: `contact@littlestargazer.com` (Cloudflare Email Routing, forwarding to the founder's personal inbox). All site copy updated to match (footer, `/about`, `/faq`, `/privacy`, `/terms`).
2. ✅ **Done.** Production domain settled: `littlestargazer.com` (singular — both `littlestargazers.com` and `littlestargazers.org` were already registered by others). `NEXT_PUBLIC_SITE_URL` set accordingly.
3. ✅ **Done.** Privacy Policy (`/privacy`) and Terms of Service (`/terms`) pages added, linked in the footer.
4. ✅ **Done (27 Aug 2026).** Stripe cleared manual review and is now live: `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` in Vercel are live-mode values, a live webhook endpoint is registered (Stripe Dashboard → Workbench → Webhooks, subscribed to `checkout.session.completed`), and the founder verified the full path with a real purchase — report unlocked, webhook delivery confirmed `200`. The business-profile/trigger-word audit from the original checklist item wasn't separately itemized, but nothing in the verified flow surfaced an issue.
5. ✅ **Done.** Privacy-respecting analytics added (Vercel Analytics — cookie-free, no consent banner needed).
6. ✅ **Done.** `sitemap.xml` and `robots.txt` added (Next.js app-router conventions, `src/app/sitemap.ts` / `src/app/robots.ts`), private `/report/[id]` links excluded from both.

### Tier 2 — the actual growth engine (deferred by founder's own choice until the above + this QA round were done)
7. **Email capture** at intake, stored in the existing free-tier Supabase (no paid ESP needed yet) — pick a tool (free-tier Resend/Buttondown) and write real opt-in/unsubscribe copy (Australia's Spam Act applies). Not started.
8. ✅ **Done (28 Aug 2026).** Content/SEO engine: 6 cornerstone blog posts shipped at `/blog`, each linking to `/sample`. See §13.
9. **Pinterest presence — in progress, see §16.** Assets (6 pins, profile logo, copy) are ready; the actual account/verification/upload is a founder-only action not yet done.
10. **A "gift a reading" flow refinement** — the gift *framing* already exists (checkbox on intake, adjusted copy); a dedicated purchase-as-gift flow with a gift note field would be a natural next iteration once traffic exists to justify it. Not started.

### Explicitly deferred (correctly, by the founder's own earlier call)
- Physical product upsells (learning toys, "planet-supporting" items) — revisit only once the digital funnel is proven.
- Specialty/high-risk payment processors — only if Stripe ever actually flags the account or volume justifies the higher fees.
- Any live-astrologer/consultation feature — deliberately excluded; it's the labor-heavy model this project is explicitly trying to avoid in favor of a low-touch, content-fed, passive-income shape.

---

## 9. Working conventions established this session (for whoever picks this up)

- **Screenshot every new UI before shipping.** The pattern: temporary `dev-preview` route with locally-computed sample data → Playwright (`npm install -D playwright`, then `npm uninstall playwright` before committing) → visually verify → delete the temp route → commit.
- **Never commit the temp QA route or scratch scripts.** Check `git status` clean before every commit in this project.
- **Build + lint clean before every commit**: `npm run build && npm run lint`.
- **Push after every commit** to `claude/vedic-horoscope-learning-site-fb6fta` (`git push -u origin claude/vedic-horoscope-learning-site-fb6fta`).
- **`claude/vedic-horoscope-learning-site-fb6fta` is this repo's only branch and its default/HEAD branch** — there is no separate `main`. Everything pushed here is what Vercel deploys. No merge/PR step is needed; committing and pushing to this branch *is* shipping to production.

---

## 10. Magic-link email capture for paid readings — done, verified live end-to-end

**Status: fully shipped and confirmed working in production** (commits `a3fd690`, `d56b326`, `f2bda45`). The founder confirmed Resend as the email provider before any API key was wired in (a new third-party service with access to customer email addresses). Domain verification, API key, and env vars are all in place; the founder ran a real production test — an actual purchase, then a resend request against that same email — and the email arrived. Nothing further to do on this feature.

What shipped:
- `supabase/migrations/0003_add_customer_email.sql`: nullable `customer_email` column on `reports`.
- The Stripe webhook (`checkout.session.completed`) now reads `session.customer_details?.email` and persists it via `setReportCustomerEmail` (`src/lib/reports/store.ts`), stored lowercased. The best-effort redirect-verification path (`report/[id]/page.tsx`) is untouched — the webhook is the trusted source, as it already was for `tier`.
- `src/lib/email/resend.ts`: a thin wrapper over Resend's HTTP API (no SDK).
- `/resend-reading` page + `resendReadingAction` (`src/app/resend-reading/`): a parent enters their checkout email, the action looks up paid reports (`findPaidReportsByEmail`, tier-not-null only) and emails the direct link(s) found. Linked from the footer as "Lost your reading link?".
- **Security, as specced:** the response is the same generic message ("If we have a paid reading on file for that email, we've sent the link(s) to your inbox.") whether or not a match was found, mail is only ever actually sent on a real match, and there's a best-effort in-memory per-email throttle (documented in-file as hygiene, not a hard guarantee, given serverless cold starts). Verified locally: a Supabase lookup failure still degrades to the same generic success message rather than leaking an error.
- `/privacy` updated with a short, narrowly-scoped disclosure (resend-only, explicitly not marketing, no mailing list) and Resend added to the "who else sees this" list.
- Screenshotted locally via the dev-preview + Playwright pattern per §9 before shipping; build + lint clean; pushed.

**⚠️ Production incident during rollout, and the lesson for future agents:** shipping commit `a3fd690` broke the site briefly — every report (new and existing) started 404ing with "We couldn't find that reading." Root cause: `supabase/migrations/0003_add_customer_email.sql` was committed and pushed, but **migration files in this repo don't auto-apply to the live Supabase database** — nothing in the deploy pipeline runs them. `getReport()` was updated to `select` the new `customer_email` column before that column existed in production, so every read failed. Fixed by the founder running the migration's SQL directly in the Supabase SQL Editor (no redeploy needed, since Next.js/Vercel doesn't rebuild for a DB-only fix). **Takeaway: any future migration must be flagged as a manual, out-of-band step the founder has to run *before* (or atomically with) a deploy that reads/writes the new column — call it out explicitly, don't assume it's applied just because the SQL file is in the repo and merged.**

---

## 11. Pre-launch housekeeping batch (27 Aug 2026) — refund policy, support, monitoring

Founder-requested batch, done before starting on SEO/Pinterest (§8, Tier 2). Commits `34aa742`, `3fb6cf0`, `bf01962`.

**Refund policy narrowed.** The founder's concern: the old "full refund within 14 days, no questions asked" was easy to abuse on a digital product that's viewable in full immediately after purchase. Replaced across the footer, the paywall CTA (`ReportView.tsx`), `/faq`, and `/terms` with a narrower policy: genuine faults (technical issues, a reading that wasn't generated correctly) get made right, but change-of-mind isn't covered. Deliberately **not** worded as "no refunds, all sales final" — `/terms` explicitly preserves Australian Consumer Law guarantees, which can't be excluded by a stated policy anyway; claiming otherwise would itself risk being a misleading statement about consumer rights, the same ACL sensitivity this project has been careful about throughout (see §6).

**Resend-link visibility.** The `/resend-reading` "Lost your reading link?" link already existed in the footer (§10) but the founder hadn't noticed it there. Added a second, more prominent copy directly on the `/report` intake page ("Already bought a reading? Get your link resent") — the more natural landing spot for someone who thinks they've already purchased. Footer link kept as-is.

**New `/support` page** (`src/app/support/`, `SupportForm.tsx`): a simple contact form, no new third party — reuses the existing Resend integration to email `contact@littlestargazer.com` with `reply_to` set to the visitor's address (so replying in the founder's inbox goes straight back to them), plus a honeypot field and the same best-effort per-email throttle pattern as `/resend-reading`. Linked from the footer.

**Live chat / WhatsApp — explicitly decided against, for now.** The founder considered WhatsApp for support but didn't want to expose a personal number (it's their personal account, not a business line). Options discussed: personal WhatsApp (exposes personal number, rejected), a separate WhatsApp Business number (viable later if support volume justifies the setup), a live-chat widget like Tawk.to (new third party, visitor chat content). **Decision: support form only, for now.** Revisit only if support volume or founder preference changes — don't add WhatsApp/live-chat on your own initiative.

**Dependabot added** (`.github/dependabot.yml`): weekly npm dependency checks, minor/patch bumps grouped into one PR to keep noise down. Major version bumps (e.g. a future Next.js major) will surface as their own PR — review those deliberately against `node_modules/next/dist/docs/` for the target version before merging, per `AGENTS.md`'s warning that this project pins a Next.js version with real behavioral differences from stock docs/training data.

**Sentry wired in for error alerting — done, verified live end-to-end.** Founder confirmed this third party before it was added (same diligence as Resend). `@sentry/nextjs` with server/edge/client init (`src/sentry.server.config.ts`, `src/sentry.edge.config.ts`, `src/instrumentation-client.ts`, `src/instrumentation.ts`), plus explicit `Sentry.captureException` calls added to the error paths that are deliberately caught-and-swallowed before they'd ever reach Next's automatic `onRequestError` hook: chart computation and report-saving in `src/app/actions.ts`, and the catch blocks in `/resend-reading` and `/support`'s actions. The founder created a Sentry project, set `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` in Vercel, and confirmed real delivery with a deliberately-thrown test error — Sentry both recorded the issue and sent an email alert.

**⚠️ Rollout bug and the lesson for future agents:** the first version of this had a real bug, not just a missing env var. `instrumentation.ts` and `instrumentation-client.ts` were placed at the **project root**, but this codebase puts everything under `src/` (`src/app`, `src/lib`, `src/components`) — and Next.js only loads those two special files from wherever `src/app` lives, i.e. **`src/instrumentation.ts`**, not the root. With them in the wrong place, Next.js silently never loaded them: `Sentry.init()` never ran, with zero errors or warnings anywhere (build succeeded, lint passed, the app worked fine) — the only symptom was the Sentry dashboard staying permanently empty. Diagnosed by temporarily adding `debug: true` to `sentry.server.config.ts` and a throwaway `/api/sentry-test` route that deliberately threw: even with debug logging on, *nothing* Sentry-related appeared in the Vercel function logs, which was the tell that `register()` was never being called at all (a real init failure, even with a bad DSN, still logs plenty). Fixed by moving all four files into `src/` together (their relative imports to each other still resolve, since they moved as a group). **Takeaway: any Next.js special file (`instrumentation.ts`, `middleware.ts`, etc.) must go inside `src/` in this project, matching where `src/app` lives — check this specifically whenever adding one, since Next.js fails silently rather than erroring when the file is in the wrong place.**

**Uptime monitoring — recommended, not implemented (dashboard-only, no code needed):** sign up for UptimeRobot's free tier, add monitors for `https://littlestargazer.com` and `https://littlestargazer.com/report`, set an email alert contact. Sentry catches *application* errors (a chart failed to generate); this catches the site being unreachable at all — the two are complementary, not redundant.

**Pricing — recommendation given, no change made.** Founder asked whether $25/$35 is competitive or should go cheaper. Recommendation: hold current pricing — it's deliberately positioned between commodity template reports (~$6.95) and boutique readings ($47–125) per the market research (§5), and cutting price now, before any real traffic exists to show whether price is actually the objection, trades away that positioning on a guess. If a lever is wanted for the first wave of buyers, a genuine, disclosed, time-boxed launch discount (e.g. "$19 for the first 2 weeks") is a better tool than a permanent cut, and doesn't conflict with the site's no-fake-urgency stance (§6) as long as it's real and honestly stated. Revisit with actual checkout-abandonment data once there's traffic (Vercel Analytics is already running).

**Context this was built against (kept for reference):** the founder had asked about full accounts/login so parents could return to a saved reading. That was discussed and deliberately rejected in favor of something lighter — the product's "no accounts, ever" positioning is load-bearing (it's in the footer, `/privacy`, `/terms`, `/faq`, and was cited in the market research as a differentiator), and full accounts would mean rewriting all of that copy for a problem a much smaller mechanism solves just as well. Free-tier (unpurchased) reports were deliberately left out of scope — there's nothing to protect access to on those.

**Don't conflate this with launch-checklist §8 item 7** (the Tier-2 "email capture + nurture sequence" for marketing, which needs real opt-in/unsubscribe copy under Australia's Spam Act). This magic-link feature is transactional (delivering something the customer already bought), a much lighter compliance bar — keep them as separate features, and don't let this one grow into a marketing list without building proper consent first.

**Confirmed 27 Aug 2026:** Stripe is now live (see §8, item 4). The webhook path and email capture were first verified against test-mode Checkout, then re-verified against a real live purchase after the switch — report unlocked, webhook delivery `200`. Nothing left to re-check here.

---

## 12. (superseded — see §13 onward for what shipped and §16 for the current next task)

The content/SEO + Pinterest brief that used to live in this section is done or in progress — see §13 (blog/SEO + Search Console) and §16 (Pinterest + outreach, the actual next task).

---

## 13. Content/SEO engine + Google Search Console — done

**Status: shipped and live.** Commits: blog section (`Add cornerstone blog section for SEO/content marketing`), Search Console setup was founder-driven (dashboard-only, no code).

**What shipped:**
- `/blog` (listing) + `/blog/[slug]` (post template) — see the Key Files table above for exact paths. No MDX dependency: each post is a plain `.tsx` file under `src/content/blog/` exporting a `Post()` component with JSX prose, matching the existing `/about`/`/faq` style. The `[slug]/page.tsx` route holds an explicit `POST_CONTENT` registry mapping slug → dynamic `import()` — deliberate, not a fully-dynamic `import(`...${slug}`)`, since that pattern breaks static analysis/bundling.
- 6 posts, each tied to one real chapter of the actual product (moon sign/temperament, ideal learning environment, Vimshottari dasha, subject choice, new-baby readings) plus one pillar/overview post — topics were spot-checked against real search demand via web search before committing (moon-sign/zodiac-parenting content is an actively published, populated niche) rather than guessed.
- Wired into `src/app/sitemap.ts` (each post gets its own sitemap entry) and the footer nav (`src/app/layout.tsx`).
- All copy follows §6's constraints (no fake urgency, no fear-framing) and deliberately avoids "psychic/fortune-telling" framing (Stripe's restricted-category sensitivity, §5) — same discipline as the rest of the site.

**Google Search Console — done by the founder, dashboard-only:**
- Verified `littlestargazer.com` as a **Domain property** via DNS TXT record added directly in Cloudflare (the domain's existing registrar/DNS provider, per §2's domain update).
- Sitemap (`https://littlestargazer.com/sitemap.xml`) submitted.
- Priority URLs (`/`, `/blog`, `/sample`, a couple of blog posts) manually queued via "Request Indexing."
- **Why this was necessary, for context**: the site had zero indexed pages anywhere (confirmed via web search) despite no technical blocker (`robots.ts` correctly allows crawling, no stray `noindex`) — purely because the domain is new, had zero backlinks, and nothing had told Google it existed yet. Expect indexing to take roughly 1-4 weeks from here, not immediately, even now that this is done.

---

## 14. Brand name collision investigated, name kept, logo mark changed

**Status: resolved.** Commit: `Replace sparkle logo mark with Growth Path icon`.

**What happened:** the founder's own manual browsing turned up `littlestargazers.org` — a **different business** (an illustrated children's picture-book series about the planets, "A Children's Astrology Adventure," pre-order/pre-launch stage) using the **exact same brand name**, "Little Stargazers," plus a visually similar identity (sparkle icon, navy/gold night-sky palette). Worth knowing this repo already recorded that `littlestargazers.org` (and `.com`, plural) were "already registered by others" back when the domain was chosen (§2) — this session is the first time anyone actually looked at what was live on that domain.

**Investigation done, in order:**
1. Confirmed via web search that the *.org* site is real, live, and uses the identical brand name and a similar sparkle/navy/gold visual identity.
2. Checked for a registered trademark: the founder ran an **IP Australia trademark search** for "Little Stargazers" directly (the authoritative source — general web search can't see trademark databases) and it came back **clean, no registration found**.
3. Checked for social-media presence under the name for the other business (a proxy for how much real public goodwill/reputation exists to actually collide with) — the founder checked directly (this session's own attempts were blocked; this environment's network policy blocks direct fetches to Instagram/Facebook/TikTok/the target domain itself, a hard tool limitation, not inconclusive evidence) and found **none** — only unrelated "Star Gazer"-named accounts.

**Decision and rationale:** given a clean trademark search and no established social/public presence on the other side, the practical confusion/legal risk is low. **Decision: keep the "Little Stargazers" name** (a full rebrand — new domain, Stripe re-verification, SEO reset — would be a much larger cost than the risk justifies), but **change the visual mark** since the sparkle-icon-on-navy-and-gold look was the most strikingly similar element and is cheap to change on its own.

**What changed:** a new `GrowthPathIcon` (sprout + small rising star, in `src/components/icons.tsx`) replaces the sparkle as the actual **logo** — header + footer wordmark (`src/app/layout.tsx`), the browser tab icon and iOS home-screen icon (`src/app/icon.tsx` / `src/app/apple-icon.tsx`, using this Next version's `next/og` `ImageResponse` convention — read that doc file before touching icon files again), and all outward-facing marketing assets (Pinterest pins, profile-photo logo mark). **Deliberately scoped narrowly**: the original sparkle motif (`SparkleIcon`) is used extensively as a *decorative* accent throughout the actual reading content and other pages (report chapters, `/about`/`/faq` kickers) — none of that was touched, since it isn't the brand mark itself and changing it wasn't part of what was asked or needed.

**If a future agent or the founder reconsiders this:** the six alternative icon directions that were sketched and rejected (Compass, Chart Wheel, Telescope, Crescent & Orbit, Nakshatra Dot, plus Growth Path which was chosen) are not saved anywhere in the repo — they were ephemeral scratch renders. If a different mark is wanted later, regenerate from scratch rather than looking for old files.

---

## 15. Founder's-brother UX feedback — two fixes, both shipped

Real, specific feedback from a family member testing the product cold. Both diagnosed against actual code (not guessed at) before fixing. Commits: `Lead reading insights with the actionable point, not the chart citation`, `Redesign landing page hero with editorial night-sky look`.

**Fix 1 — reading order (jargon before insight).** The feedback: *"When showing a reading display the actionable points first... hard for a layman to know what sits in which house."* Root cause found in `src/lib/education/narrative.ts`'s `renderTieredInsight` — the single shared function that composes **every** subject, strength/growth-metric, and natural-direction sentence across the whole reading. It was building each sentence as `[citation, insight, extras].join(" ")` — e.g. *"Mars sits in Scorpio, 6th house, aspected by Saturn. Physical activity looks like a genuine strength..."* — so the technical citation was grammatically always the first thing read. **Fix**: reordered to `[insight, extras, citation].join(" ")` — one line, one shared function, fixes every chapter that uses it (`subjects.ts`, `metrics.ts`, `direction.ts`) at once. Verified against `/sample` (real chart-rendering, no Supabase needed) before shipping, not just read in code.

**Fix 2 — landing page "looks like a generic AI-generated site."** Diagnosed by actually reading `src/app/page.tsx`: the hero was a textbook dark-hero/pill-badge/two-button/icon-in-a-circle-cards template pattern, structurally identical to thousands of Framer/v0-generated SaaS sites, despite having custom copy and colors. **Three redesign directions were mocked up first** (as standalone rendered PNGs, not live code) and shown to the founder before touching real code: (A) real chart-wheel as hero visual with annotated callouts, (B) hero leads with an actual sample insight card instead of marketing copy, (C) full-bleed editorial night-sky illustration, no pill badge, single CTA. **Founder picked (C).** Shipped as: `src/components/ConstellationSky.tsx` (new decorative SVG, hardcoded star/constellation coordinates — same hydration-safety convention as `ChartWheel.tsx`, i.e. no `Math.random()`) + a rewritten hero section in `src/app/page.tsx`. Only the hero section changed — the rest of the landing page (how-it-works cards, stat grid, mission section) still has the same generic-template texture and hasn't been touched; flag this to the founder as unfinished if they don't raise it themselves.

**One judgment call made without being asked, worth knowing about:** the approved mockup for (C) dropped the "See a full sample reading first" link entirely for a cleaner look. It was **kept** anyway (just de-emphasized, small text under the stat line) because §7's own three-persona QA history found that exact link was the deciding factor in the one persona who actually converted. Don't remove it without the founder explicitly asking, even if a future visual refresh suggests it again.

---

## 16. Next task for the incoming agent: execute the Pinterest + outreach plan

**Status: assets are 100% ready; execution has not started.** This is a founder-execution task more than a coding task — most of the remaining work needs the founder's own hands (creating accounts, posting, sending emails), not code changes. The agent's role here is mostly: walk the founder through each step, handle any code-side pieces (see below), and keep the assets/copy organized.

**What already exists, ready to use (all built this session, all using the current `GrowthPathIcon` branding):**
- 6 Pinterest pin images (1000×1500, night-sky style with constellation art, one per blog post) + matching pin titles/descriptions — sent to the founder as files during this session, **not saved anywhere in the repo** (they were scratch-rendered PNGs, not committed). If they're needed again and the founder doesn't still have them, they'll need to be regenerated — the generation approach (a local Node+Playwright script rendering styled HTML to PNG, `npm install -D playwright` → render → `npm uninstall playwright` before any commit, per §9's convention) is described here so it doesn't need to be reinvented, but the actual script content is not preserved.
- A profile-photo logo mark (dark + light versions, 800×800, the `GrowthPathIcon` sparkle-and-sprout mark).
- A full **promotion kit** (also sent as a file, not committed to the repo): Pinterest pin copy, a guest-post pitch email template, Reddit-safe and Facebook-group-safe post drafts, and a directory-submission target list. Same caveat — not in the repo, only delivered to the founder directly.

**What the founder needs to do (in this order, per the priority already agreed with them):**
1. **Pinterest** (highest priority — per §5's market research, the single best-evidence channel for this audience):
   - Create a Pinterest Business account.
   - Claim the website (`littlestargazer.com`) via Settings → Claim → Websites, using the **HTML tag** method.
   - **When the founder gets the verification code from Pinterest, that's this agent's cue to act**: add it to `src/app/layout.tsx`'s metadata (Next's `verification` field pattern, same idea as how Google Search Console could have been done in-code but was actually done via DNS instead) and push, so the founder can click "Verify."
   - Create 4-6 boards, upload the 6 pins with the prewritten copy, join 2-3 relevant group boards.
2. **Reddit + Facebook groups**: start genuine, non-promotional participation now (per the promotion kit's guidance — comment for 1-2 weeks before ever posting a link, to avoid read as spam/getting banned).
3. **Directory submissions**: low-effort, can be done anytime from the list in the promotion kit.
4. **Guest-post outreach**: send 2-3 personalized pitches a week once there's at least a little momentum elsewhere, using the template in the promotion kit.

**Constraints that still apply (same as always):**
- §6 — no fabricated reviews/testimonials, no fake urgency, no fear-framing — applies to every piece of outreach copy, forum post, and pin description.
- §5 — don't relitigate paid ads as a channel without new evidence; Meta's restricted-category rules and this price point's margins were already assessed as a poor fit.
- Any actual code change (the Pinterest verification tag being the main likely one) still needs build+lint clean and a screenshot before shipping, per §9 — this branch has no staging step.

**Not this task's job** (already deferred, separate items — don't fold in without the founder asking): §8 item 7 (marketing email capture/nurture sequence) and item 10 (dedicated gift-purchase flow).

**Status as of this update: paused, not abandoned.** With the conversion-test findings in §18 landing, the founder wants those addressed first — Pinterest execution is still the right next growth move once §18's product-side work is done, but don't start it before §18 without the founder redirecting.

---

## 17. SEO Phase 0-2: structured data, real proprietary data, 13 blog posts total — done

An SEO strategy was drafted as an artifact (**https://claude.ai/code/artifact/141c452b-bd53-4647-930b-f2d4d7ef49ba**) built around one core reframe: Google's 2026 "scaled content abuse" policy targets *purpose* (pages made to manipulate rankings), not *method* (AI-assisted writing isn't penalized on its own). The plan's explicit anti-pattern, worth repeating for any future agent tempted by it: **never generate blog content by sweeping every combination the chart engine can produce** (a post per sign, per house, etc.) — that's the exact shape of the penalty.

**Phase 0 — foundation (commit `2281c4a`):**
- JSON-LD structured data: `Organization` sitewide, `BlogPosting` per post, `FAQPage` on `/faq` (`src/lib/seo/schema.ts`).
- A real named byline ("Jaya," the founder's real first name — see HANDOFF §6's no-fabricated-credentials rule, which this respects: a real name is not a fabricated credential) replacing the anonymous "small team" attribution on blog posts.
- Freshness signals: `updatedAt` field on posts (only bumped on genuine content changes, never cosmetically — see the type comment in `src/lib/blog/posts.ts`), "Last reviewed" dates on `/about` and `/faq`.
- Internal-linking fix: none of the original 6 spoke posts linked back to the pillar post (`vedic-astrology-parenting-guide`) — now a proper hub-and-spoke, pillar links out to every spoke in "Where to go from here," every spoke links back.
- **"Why I built this" section added to `/about`** (commit `7e5850b`) — a real, founder-supplied story (family astrology lineage, using it with her own kids), not an invented backstory. A founder photo was considered and explicitly declined after the one supplied turned out to be AI-generated (watermarked) — see the conversation this session for why that specific line was held firm: a fake photo next to a true personal story would have undercut the entire trust-building point.

**Phase 1 — real proprietary data (commit `1f089de`):** the pillar post's "What's actually being calculated" section now cites the actual yoga-frequency audit from earlier development (Budha-Aditya ~50% of charts, Saraswati/Neecha Bhanga ~1-in-8) as genuine, unique data no competitor site can publish — this is the single highest-leverage move in the whole plan, since it's real information gain rather than another generic explainer.

**Phase 2 — topical expansion, validated not guessed:** a research pass (real web searches, not assumptions) validated demand for 5 additional topics beyond the original 6, explicitly ranked, with one (a hobbies/activities post) deliberately held back because nearly all existing competitor content in that space is the exact sign-by-sign template pattern this plan exists to avoid. Shipped, 13 posts total now live:
1. Original 6 (pillar + moon-sign, environment, dasha, subjects, new-baby) — pre-existing.
2. **Age-banded, requested directly by the founder after parent feedback** that content felt generic past the toddler years (commit `ff21d05`): `middle-school-subject-selection-birth-chart` (ages 11-14 elective decisions) and `senior-year-subjects-university-direction-birth-chart` (teens narrowing toward degree areas — leads with "this isn't a prediction" in its first sentence, the highest-risk post on the site for sliding into fortune-telling framing, per §6).
3. **5 more, from the validated research list** (commit `58a09c0`): `wired-differently-from-your-child`, `highly-sensitive-child-birth-chart`, `why-siblings-turn-out-different-birth-chart`, `mercury-placement-child-communication-style`, `twins-birth-chart-different-personalities`. Two are worth knowing the framing decisions on if touched again: `wired-differently-from-your-child` was deliberately reframed away from its original "parent-child chart comparison" brief because **the product has no parent-chart input and no joint-reading feature** — writing it as if that existed would have been a real overclaim; it's framed entirely around the child's own chart instead. `highly-sensitive-child-birth-chart` is careful to credit "Highly Sensitive Child" as Elaine Aron's real psychological term, never implying the chart diagnoses or detects it.

All 13 posts pass build+lint, were screenshot-verified before shipping, and follow §6's constraints throughout (no fake urgency, no fabricated credentials, never framing anything as predicting a child's future/career as fact).

---

## 18. Conversion-quality test: 0 of 3 realistic parents would pay — READ THIS FIRST, this is the next task

**Why this test happened:** after the age-banded blog posts shipped (§17), the founder asked a direct question — would this actually convert real parents, across different ages, with different mindsets? Rather than guess, three agents each played a specific, realistic parent persona (different child age, different emotional state) and genuinely decided whether to pay, then reviewed the actual paid content to give harsh, specific feedback.

**Methodology (repeatable — use this again after any fix below ships):** since this sandbox's network blocks Supabase and Stripe directly (see §3's sandbox-quirk note), a temporary route was built at `src/app/dev-preview/persona/[personaId]/page.tsx` (never committed — same disposable-route convention as §9) rendering `ReportView` with `tier=null` (locked/free) or `tier="premium"` (fully unlocked) for three fixed, realistic children, using the exact same production code path as `/sample` does. Each persona-agent browsed the real landing page, the relevant blog post, `/about`, `/faq`, and `/report`'s real intake form in character (no source-code reading allowed, to keep it a genuine black-box test), then reached the actual free preview and pricing chapter, decided for themselves whether to click "Unlock" (without actually clicking it, to avoid any live Stripe interaction), then reviewed the `tier=premium` version of the *same* child to give informed, harsh, honest feedback as if they'd just spent their own money. This is a stronger version of the original §7 three-persona QA — same spirit, now testing conversion intent specifically, with real product content on both sides of the paywall.

### Headline: 0 of 3 would have paid

That's worse than the original §7 QA round (which had 1 of 3 buy) — but far more useful, because all three converged independently on the same root cause rather than three unrelated complaints.

### Persona 1 — early years (a 4-year-old, "Ivy"), curious-but-skeptical, no urgency, price-sensitive for "just for fun"

**Verdict: no, neither tier.** Deciding factor was a since-fixed bug (§19, Bug 1) — the exact same citation sentence reused verbatim as "evidence" for four unrelated headline traits, directly contradicting the site's own "not a template" claim.

Other findings, in the persona's own words:
- What worked: "the tone is genuinely disarming for a skeptic" — the About/FAQ candor ("We're not a large astrology company... we don't have a network of astrologers on staff," "Is this scientific? No, and we won't pretend otherwise") "bought real goodwill I wasn't expecting."
- What worked: real age-awareness in one chapter — "Ivy is currently 4 years old. At this age, Ivy's chart is best explored through play rather than formal lessons" is specific, not boilerplate.
- What didn't: "Areas to nurture" — the section that should carry the most weight — gave two items, both hedged to "fairly typical," "neither unusually fast nor unusually effortful," "standard teaching approaches should suit them well." Direct quote: *"'she's about average' twice in a row is a letdown"* for a section pitched as insight into where a child needs support.
- What didn't: the subject-by-subject chapter (the $25 tier's headline sell) resolved 5 of 7 subjects to "fairly ordinary"/"fairly typical" — honest, but undercuts the pitch of concrete subject-by-subject guidance.
- What felt off: the pricing page's hook line ("You already see how bright they are. Go deeper") assumes the free preview already impressed — it didn't, so the emotional beat didn't land.

**Age-fit verdict, in the persona's words:** *"It feels like one age-neutral personality engine with an age-aware wrapper bolted on top, rather than a reading built around a 4-year-old specifically."*

### Persona 2 — middle school (a 12-year-old, "Noah"), pragmatic, facing a real near-term decision (an actual electives form due)

**Verdict: no, not even Tier 1.** Deciding factor: the `middle-school-subject-selection-birth-chart` post that drew this parent in explicitly promises help "rank a coding elective against a second language" — the actual reading never mentions a second/foreign language at all, and rates Computer Science/Coding as "fairly typical... a gentle, playful introduction should work as well for them as for most children" (no clear signal either way).

Full findings, numbered as the persona gave them:
1. *"Bait-and-switch on the one thing that got me here."* The blog title names the exact use case; the actual reading has no elective-choice mechanism — "the same generic natural-strengths/subjects report you'd get for a 6-year-old, just relabeled with a 'Tween Years' header."
2. Internal contradiction — since fixed, §19 Bug 2: chapter 9 rated Computer Science/Coding "fairly typical," while chapter 11 ("Natural Direction") said "Electives in coding, robotics, or applied science are worth offering even before they ask," for the same chart. *"For $25 I want one clear answer, not two chapters disagreeing with each other."*
3. What genuinely worked: the trust/tone layer — "unusually honest for this category," no fear-mongering or fake credentials found, "the only reason I read past the homepage."
4. **The intake form doesn't capture the actual decision.** `/report` only asks for name/DOB/time/place — nowhere to say "the choice is coding vs. Spanish vs. extra art." *"So the product can't actually be personalized to my real-world form even if it wanted to; it's structurally generic by design."* This is a distinct, concrete, buildable idea — see action items below.
5. The one confident recommendation in the whole reading (Science, pushed hardest in chapters 6/14) isn't even an option on a typical electives form — "the one confident recommendation in the whole reading is for a subject I can't act on in two weeks."

**Age-fit verdict:** correctly states the child's age, has a "Tween Years" chapter, ties the dasha timeline to real calendar dates — but *"strip the 'Tween Years' header and this could be handed to a parent of a 7-year-old with zero edits to the substance."* Notes the blog post itself is honest that "the reading doesn't use different logic for a fourteen-year-old than a toddler" — accurate, but confirms the age-specific framing is cosmetic, not structural.

### Persona 3 — senior secondary (a 17-year-old, "Zara"), anxious, real stakes (university/subject decisions looming)

**Verdict: no, neither tier.** Deciding factor: the `senior-year-subjects-university-direction-birth-chart` post is specifically, thoughtfully about senior-year subject and university decisions — the actual reading, even the paid/premium version, is not. A generic child-development report with one "Zara is 17 now" paragraph inserted.

Findings:
- **A genuinely rare piece of honesty, called out by name as the best line on the site:** *"Be especially wary of any reading — ours or anyone else's — that speaks about a teenager's future in confident, specific, career-naming terms. That confidence is a red flag, not a feature."* The persona had braced for a "$40 destiny report" grift and found the opposite.
- The product doesn't match that promise: the Subjects chapters (9-10 of the premium reading) list Visual Arts, Mathematics, Music, Public Speaking, Reading/Writing, History, Science — *"a primary-school curriculum"* — nothing about actual senior electives (Methods vs. Specialist Maths, Chemistry vs. Biology, Economics, Legal Studies) or how a chart pattern maps to degree areas.
- Age-inappropriate advice, even after paying: *"Reading aloud together, even past the age it feels 'necessary'"* and *"a visible daily routine chart can turn structure into something reassuring"* — given about a 17-year-old. *"It made me trust the whole reading less... it signals the 'personalization' is a template with a name swapped in."*
- Sidebar reminders never change: every chapter, free or paid, repeats "try not to compare this report to a sibling's or classmate's" — irrelevant, tone-deaf framing for a senior applying to university.
- Genuinely good, when it shows up: Chapter 11 "Natural Direction" names concrete fields (Design, Architecture, Media & Film, Music, Marketing) and closes with *"Not a prediction, and not a shortlist — just a sense of the kind of work that tends to fit this pattern. What Zara actually chooses is entirely theirs."* Exactly the right register — but it's one chapter out of fourteen, buried behind the paywall, surrounded by content that undercuts it.

**Anxiety-handling verdict (the specific thing this persona was designed to test):** passed the "don't exploit fear" test cleanly — no predictions, no career mandates, real honesty throughout. Failed the "don't be uselessly generic" test: *"Being honest about limits is only reassuring if the thing underneath the honesty is actually about my problem. Here, the humility is real but it's wrapped around a report that's mostly generic child-development filler."*

**Age-fit verdict:** fails, mostly — the brand, nav CTA ("Get your child's reading"), intake form, and sidebar reminders never once adjust for a near-adult. Only one transition chapter acknowledges the child is 17 at all. "Natural Direction" is the sole chapter proving *"the team can write age-appropriately when they choose to — they just didn't do it consistently enough to justify the price for my actual situation."*

### Cross-cutting findings — what all three independently converged on

1. **Age-tailoring in the report is cosmetic, not structural.** Every persona, unprompted, described the same thing in different words: a chapter header or one inserted sentence changes ("Tween Years," "Zara is 17 now"), but the underlying subject/direction content is the same engine output regardless of the child's actual age. Confirmed directly in code before this test even ran (see the conversation history around this date): `src/lib/education/subjects.ts` and `direction.ts` have zero age-band branching.
2. **The new age-banded blog content (§17) now promises something the product doesn't structurally deliver.** This is a real, active expectation gap — a parent who clicks through from an age-specific post is set up to be let down in exactly the way all three personas describe.
3. **"Steady"/"typical"-tier content reads as anticlimactic for something paid.** An honest "about average" result is correct, but multiple personas independently found it a letdown when it's the majority of what a $25-35 purchase delivers.
4. **Static boilerplate that never varies (e.g. the sibling/classmate-comparison reminder) reads worse the older the child is.**
5. **The intake form has no way to capture the actual real-world decision a parent is facing** (which specific electives, which degree areas) — flagged concretely by the middle-school persona as the structural reason the product can't speak to a real choice even in principle.
6. **The trust/honesty layer is working exactly as intended and was praised by every persona** — the About/FAQ candor, the explicit "not a prediction" framing, the complete absence of fear-based or fake-urgency language. This is Phase 0's work (and the founder's original ethical stance, §6) paying off. **Do not touch this while fixing the above** — it's the reason any persona read past the homepage at all.

### Recommended next steps (not yet started — this is the actual task)

1. **Decide with the founder whether to invest in genuine age-band-aware report generation**, not just header/label changes. This is a real scope increase into the paid product's core engine (`subjects.ts`, `direction.ts`, `pathway.ts`), flagged as a decision point *before* the Phase 2 blog content shipped (see this session's conversation) — the persona tests now make the cost of not doing it concrete and specific rather than hypothetical.
2. **Consider an optional "what decision are you facing?" input** on the intake flow for older children (e.g. a free-text or short-list field: "what electives/subjects are you choosing between?") so subject/direction content can speak to the parent's actual real-world choice instead of staying abstract. This was the middle-school persona's single most concrete, buildable suggestion.
3. **Revisit "steady"/"typical"-tier copy** in `subjects.ts`/`metrics.ts` to see if it can carry more genuine substance without overstating a placement's strength — flagged independently by two personas as an anticlimax for paid content.
4. **Reconsider static boilerplate reminders** (e.g. the sibling/classmate-comparison line) for whether they should vary or be omitted for older age bands.
5. **Resolve the expectation gap** the age-banded blog posts (§17) now create — either build the product features to match what those posts promise, or soften the posts' promises to match current reality. Don't leave the mismatch as-is; it's actively costing trust once a real parent clicks through, per all three personas.
6. **Re-run this exact 3-persona conversion test after any of the above ships**, using the methodology above, before assuming a fix worked.

---

## 19. Two content-engine bugs found via the conversion test — both fixed

**Bug 1 — duplicate/reused citation text (commit `2940db2`).** The early-years persona (§18) found the identical citation sentence — citing the same Venus/Saturn/Mars placement — reused verbatim as "evidence" for four unrelated headline traits across different chapters. **Root cause:** in `src/lib/education/narrative.ts`, `renderTieredInsight`'s "extras" sentences (conjunction/dignity flavor text) had zero phrasing variants — one fixed sentence per planet, selected by a seed derived only from that planet's own chart data. Whenever two unrelated sections legitimately shared a lead planet (some by design, e.g. PE and Hands-On Direction both anchor to Mars; some by chart coincidence), their entire "extras" block rendered byte-identical. **Fix:** added real phrasing variants per planet, and replaced the seed-only lookup with a per-chart, per-`(leadPlanet, slot)` round-robin counter guaranteeing no repeat until variants are exhausted (a hash-based dedup approach was tried and discarded first — pigeonhole makes collisions mathematically unavoidable when 5+ sections can share one lead planet, e.g. Mercury across 3 subjects + 1 direction). Scoped to `narrative.ts` only — `scoring.ts` and the shared strength functions every other chapter depends on are untouched.

**Bug 2 — Subjects/Direction chapter contradiction (commit `2940db2`, same commit).** The middle-school persona (§18) found the Subjects chapter rate a child's Computer Science/Coding aptitude as "fairly typical" while the separate Natural Direction chapter, for the *same chart*, said "Electives in coding, robotics, or applied science are worth offering even before they ask." **Root cause:** the two chapters' underlying *scores* actually agreed (both "steady"/ordinary) — the contradiction came from `direction.ts`'s `stages` field being a single fixed string per stream, unlike every other tier-aware copy in this engine, so a "steady" or even "growing" stream still got confident, singled-out elective language. **Fix:** threaded the stream's strength tier into `stages` and tier-varied the "secondary/teen years" text for all four streams, so a "steady" rating now reads as "worth offering as one option among several" rather than a confident standalone recommendation.

**Architectural lesson, worth remembering for future work in this engine:** both bugs came from the same underlying pattern — content that's supposed to vary with a computed score/tier, but had a fixed, unvaried string somewhere in the pipeline. When adding any new chapter or insight type to `src/lib/education/`, check that every user-facing sentence actually threads through the tier/score, not just the citation.

---

## 20. Stripe preview checkout bug — a real database race, not what it first looked like (fixed)

**Status: root-caused and fixed, confirmed working end-to-end with a real test payment on preview.** Worth documenting the full chase, not just the fix — several plausible-looking causes turned out to be red herrings, and the actual bug is a genuine architectural gotcha that could recur elsewhere in this codebase.

**Symptom, as the founder tested it directly:** after a real (sandbox test-mode) payment on the preview branch, the redirect back from Stripe would land on the locked/free view again — as if payment hadn't worked. Clicking "Unlock" a second time skipped Stripe entirely (the existing `report.tier === tierId` short-circuit in `createCheckoutSessionAction` correctly detected the report was already paid) and landed straight on the genuinely unlocked reading.

**Red herrings ruled out, in the order they were investigated — useful if this class of bug ever resurfaces:**
1. *Stale Vercel deployment* — real issue encountered along the way (a "Redeploy" on an old deployment entry rebuilds that same old commit with new env vars, it does not pull the branch's latest commit), but not the root cause once ruled out via commit-hash checks in the Deployments tab.
2. *Missing `session_id` in the redirect URL* — checked directly, confirmed present every time.
3. *Stripe webhook signature mismatch on preview's Stripe Sandbox* — this one was real and is now fixed on the founder's side (Preview's `STRIPE_WEBHOOK_SECRET` in Vercel didn't match the Sandbox webhook endpoint's actual signing secret, confirmed via the exact "No signatures found matching the expected signature for payload" error in Stripe's own webhook event log). Worth knowing: a Stripe **Sandbox** is a fully separate environment from Live mode and needs its own webhook endpoint + secret registered independently — it does not share production's webhook config. This was a real, separate bug, fixed by the founder re-copying the correct signing secret and redeploying — but fixing it alone did not fix the reported symptom, which is what pointed at something deeper.
4. *Browser back-forward-cache (bfcache) restoring a stale pre-payment snapshot* — a reasonable-looking hypothesis given the symptom pattern (correct-looking server logs, wrong-looking rendered page), addressed defensively by forcing `Cache-Control: no-store` (`export const dynamic = "force-dynamic"` in `report/[id]/page.tsx`, kept in the final fix since it's still the right caching posture for a payment-state-dependent page) — but retesting after this shipped showed the identical symptom, ruling this out as the actual cause too.

**Actual root cause, confirmed via temporary diagnostic `console.log` statements (added, used, then removed — see commits `deb868a`/`027551d`) directly in Vercel's Function/Runtime Logs:** `markReportTier` would report success, but the very next `getReport(id)` call — in the same request, milliseconds later — could still return the pre-write tier (`null`). A genuine **read-after-write consistency gap on the Supabase/database side**, not a caching issue at any layer. The log evidence that nailed it: `justUnlockedTier: "full"` (from the successful write) alongside `reportTier: null` (from the very next read) in the same request's final state.

**The fix (commit `80a6ae5`):** `src/app/report/[id]/page.tsx` now computes `const effectiveTier = justUnlockedTier ?? report.tier;` and uses `effectiveTier` — not `report.tier` — everywhere the page decides what to render (whether to show the `PaymentConfirming` state, `unlockedPathway`/`unlockedRemedies`, and the `tier` prop passed to `ReportView`). The tier a request just wrote is known-good regardless of whether an immediate re-read reflects it yet.

**Other genuine improvements shipped in the same investigation (kept, not just diagnostic scaffolding):**
- `src/lib/stripe/server.ts`: `verifyCheckoutSession` retries the Stripe lookup a few times with a short delay before giving up (closes a separate, smaller timing window — Stripe can redirect a moment before a session's `payment_status` itself flips to "paid"), and reports a genuine API/config failure to Sentry instead of silently returning `null`.
- `src/app/report/[id]/PaymentConfirming.tsx` (new): when a parent returns from Stripe and neither the redirect-time check nor an existing tier confirms the unlock yet, this shows a quiet "Payment received — unlocking your reading..." state that polls `checkReportUnlockedAction` (new, in `report/[id]/actions.ts`) every 2.5s and refreshes once it lands, instead of showing the paywall again (which reads as "the payment didn't work"). After ~50s it points to the existing `/resend-reading` recovery flow.
- `src/app/api/stripe/webhook/route.ts`: a signature-verification failure is now reported to Sentry, not just returned in the HTTP response — this exact class of failure (§20 point 3 above) was previously invisible outside of manually checking Stripe's own dashboard.

**Confirmed by the founder:** a fresh test payment on preview landed directly on the unlocked reading with no second click needed. Interestingly, the `PaymentConfirming` message didn't even need to show — because the actual bug was fixed, the unlock now resolves within the same request, so the polling fallback simply wasn't needed. That's the correct outcome, not a miss.

**Note on production:** production's Stripe flow was independently re-verified working with a real purchase during this investigation, on the code *before* any of these commits existed there — the underlying race was never confirmed live on production. All of these commits have since been fast-forwarded to production regardless, since they're a genuine robustness improvement (the same race could in principle happen there too) and the fix carries no behavioral downside.

**Architectural lesson for future work anywhere in this codebase:** after writing to Supabase, don't assume an immediate subsequent read in the same request reflects that write. If a value is already known from the write itself, keep it in memory rather than re-fetching and trusting the re-fetch.
