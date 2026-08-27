# Little Stargazers — Project Handoff & Launch Plan

**Written:** 2026-08-26 · **Repo:** `vedicastro-alt/AstroEducation` · **Branch:** `claude/vedic-horoscope-learning-site-fb6fta` · **Latest commit:** `c6cb582`

> ⚠️ `claude/vedic-horoscope-learning-site-fb6fta` is this repo's **only branch and its default/HEAD branch** — there's no separate `main`. Vercel deploys straight from it. Pushing here is shipping to production, immediately — there is no staging step.

This document exists so a new agent (or the founder) can pick this project up cold, with full context on what's built, why it's built that way, what's been tested, and exactly what's left before launch. It's a handoff, not marketing copy — it says where things are weak as plainly as where they're strong.

---

## 1. What this is

**Little Stargazers** generates a gentle, encouraging Vedic-astrology-based "learning pathway" reading for parents about their child's educational strengths and growth areas. Free preview, two paid one-time tiers. The founder's stated goal is a **genuine passive-income side business** — not a venture-scale play, not a labor-intensive consultation service.

Non-negotiable product stance, established early and held throughout: **warm and emotionally resonant marketing is fine; fabricated reviews, fake urgency/scarcity, and fear-based framing are not.** This isn't a vague ethics preference — it's grounded in Australian Consumer Law (misleading/deceptive conduct, s18; the new unfair-trading-practices regime targeting fake urgency cues specifically), since the business is Australian-owned and -hosted. See §7.

---

## 2. Current status

**The product is feature-complete as a prototype and has been through one real round of user-critique QA with fixes applied.** It has *not* been launched — no real traffic, no content/SEO presence, no email list. Payment (Stripe) was tested end-to-end by the founder and confirmed working before the QA round in this document; the QA round did not touch payment logic.

What exists today:
- Full birth-chart calculation engine (real ephemeris, Lahiri ayanamsa, whole-sign houses, Vimshottari dasha) — astronomically correct, verified against reference values earlier in development.
- Free preview + two-tier paid reading ($25 / $35, $15 upgrade path from $25→$35), Stripe Checkout wired and tested live.
- Book-style paginated reading UI with a real, data-driven chart diagram (not decorative).
- A public `/sample` page showing a full example reading with no signup.
- `/about` and `/faq` pages with honest methodology and no fabricated credentials.
- Gift-purchase framing, a 14-day refund policy surfaced at point of purchase, and a founder's-note trust section on the landing page.
- One full round of independent, simulated cold-visitor QA (three personas) with all findings addressed — see §8.

**Update (post-handoff):** the production domain is now settled as `littlestargazer.com` (singular — `littlestargazers.com`/`.org` were both already registered by others), registered via Cloudflare, with Cloudflare Email Routing forwarding `contact@littlestargazer.com` to the founder's personal inbox. Site copy, `NEXT_PUBLIC_SITE_URL`, and the Privacy/Terms pages below were all updated to match — the visible "Little Stargazers" brand name is unchanged, only the domain/email are singular.

**Update (post-handoff): reading-engine depth pass.** Founder feedback after launch-checklist work: readings read as too generic, with content that varied only by which sign a lead planet sat in regardless of how strong that placement actually was. Addressed in two phases (a third, the D24 divisional chart, was scoped but explicitly deferred by the founder as unnecessary):
- **Phase 1** (`src/lib/astro/aspects.ts`, `src/lib/education/narrative.ts`): added Parashari drishti (aspects) and conjunction detection, and rewrote `metrics.ts`/`subjects.ts`/`direction.ts` around graded tiers (flourishing/steady/growing) driven by real score rather than a binary top-N/bottom-N split, with citations that name house, dignity, conjunctions, and aspects, plus interpretation text (not just the citation) that changes with *why* a placement is strong — a placement's exaltation or a specific conjunction partner now changes the actual sentence, not just a technical prefix. After founder feedback that citations made the text too long, `citePlacement`/`citeHouseLord` were tightened to a compact clause ("Jupiter sits in Virgo, 2nd house, aspected by Moon.") instead of a full sentence.
- **Phase 2** (`src/lib/astro/yogas.ts`, `src/lib/education/yogas.ts`): detects four classical yogas (Gajakesari, Budha-Aditya, Saraswati, Neecha Bhanga) and surfaces them as a conditional "Special chart combination(s)" chapter in the report, only inserted when at least one is found. Important calibration: tested detection across ~50 sample charts before finalizing copy — Budha-Aditya fires in roughly half of all charts (a structural fact of Mercury's orbit, not rarity), while Saraswati/Neecha Bhanga are meaningfully rarer (~1 in 8); content is worded to match each yoga's actual frequency rather than uniformly claim scarcity.
- **Explicitly deferred, by the founder's own call:** Phase 3, a D24 (Siddhamsha) divisional-chart calculation. This would have been genuinely new astronomical calculation (not pattern-matching over already-computed data, unlike Phase 2) and would have warranted the same reference-value verification the original ascendant calculation got. Revisit only if the founder raises it again.

What does **not** exist yet:
- Any organic traffic channel (no blog/SEO content, no Pinterest, no backlinks).
- Email capture or nurture sequence.
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
| Routes | `src/app/page.tsx` (landing), `src/app/report/page.tsx` (intake), `src/app/report/[id]/page.tsx` (result), `src/app/sample/page.tsx`, `src/app/about/page.tsx`, `src/app/faq/page.tsx` |
| DB schema | `supabase/migrations/*.sql` |

### Environment variables (`.env.example`)
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```
All confirmed working in production by the founder before this document was written.

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
4. **Founder action (dashboard, not code):** audit the Stripe account's business profile/description for trigger words ("predict," "fortune," "psychic") — the site's own copy already avoids these, the Stripe account settings haven't been independently confirmed.
5. ✅ **Done.** Privacy-respecting analytics added (Vercel Analytics — cookie-free, no consent banner needed).
6. ✅ **Done.** `sitemap.xml` and `robots.txt` added (Next.js app-router conventions, `src/app/sitemap.ts` / `src/app/robots.ts`), private `/report/[id]` links excluded from both.

### Tier 2 — the actual growth engine (deferred by founder's own choice until the above + this QA round were done)
7. **Email capture** at intake, stored in the existing free-tier Supabase (no paid ESP needed yet) — pick a tool (free-tier Resend/Buttondown) and write real opt-in/unsubscribe copy (Australia's Spam Act applies).
8. **Content/SEO engine**: 4-8 cornerstone blog posts targeting real parent search intent (e.g. "what does my child's moon sign say about how they learn," subject-choice-season content, new-baby content), each linking to the free reading. Validate topics against actual search volume before committing (a keyword tool wasn't available in this session — spot-check with Google Trends or similar first).
9. **Pinterest presence** — the single highest-evidence channel for this exact audience per the market research. One pin per article, visuals matching the existing design system.
10. **A "gift a reading" flow refinement** — the gift *framing* already exists (checkbox on intake, adjusted copy); a dedicated purchase-as-gift flow with a gift note field would be a natural next iteration once traffic exists to justify it.

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

## 10. Next task for the incoming agent: magic-link email capture for paid readings

**Context (don't re-litigate this):** the founder asked about adding full accounts/login so parents could return to a saved reading. That was discussed and deliberately rejected in favor of something lighter — the product's "no accounts, ever" positioning is load-bearing (it's in the footer, `/privacy`, `/terms`, `/faq`, and was cited in the market research as a differentiator), and full accounts would mean rewriting all of that copy for a problem a much smaller mechanism solves just as well. The agreed direction: **capture the buyer's email at Stripe Checkout for paid reports only, and build a "resend my reading" lookup so a parent who lost their link can get it back by email.** This is the task. Free-tier (unpurchased) reports are out of scope — there's nothing to protect access to yet.

**Ground truth, verified this session so you don't have to re-discover it:**
- `src/app/report/[id]/actions.ts`'s `createCheckoutSessionAction` does not set `customer_email` and never reads it back. Stripe Checkout still asks the buyer for an email by default (it's a required field in `mode: "payment"`), so **the email already exists in the Stripe Checkout Session — it's just not being captured or stored by this app today.**
- `src/app/api/stripe/webhook/route.ts`'s `checkout.session.completed` handler only reads `session.metadata.reportId`/`tier` and calls `markReportTier`. It does not touch `session.customer_details`.
- `src/lib/reports/store.ts`'s `reports` table has no email column (`supabase/migrations/0001_create_reports.sql`, `0002_add_tiers_and_remedies.sql`).
- **There is no outbound transactional email provider anywhere in this codebase.** Cloudflare Email Routing (set up this session) is inbound-only — it forwards `contact@littlestargazer.com` to the founder's personal inbox and cannot send email on the app's behalf. A provider must be chosen and integrated. Resend (resend.com) is the natural pick — generous free tier, a plain HTTP API, no heavy SDK — but confirm current pricing/limits before committing, and check with the founder first since it's a new third-party service with access to customer email addresses.

**Proposed plan:**
1. New Supabase migration `0003_add_customer_email.sql`: nullable `customer_email text` column on `reports`.
2. In the webhook's `checkout.session.completed` handler, read `session.customer_details?.email` and persist it (extend `markReportTier` or add a small `setReportCustomerEmail(id, email)` in `store.ts`). The webhook is the trusted source of truth per its own doc comment — start there, not the best-effort redirect-verification path.
3. Wire in the chosen email provider (`RESEND_API_KEY` or equivalent in `.env.example`).
4. Build the resend flow: a small email-only form (natural homes: footer link "Lost your reading link?", and/or the `/report` intake page) → a server action that looks up reports where `customer_email` matches (case-insensitive) **and `tier` is not null** → emails the direct link(s) found.
5. **Security: always show the same generic response** ("If we have a paid reading for that email, we've sent the link") whether or not a match was found — never reveal whether an email exists in the system. Only actually send mail when there's a real match, so this can't be turned into a bulk-mailer against arbitrary addresses. Basic rate-limiting on the endpoint is still good hygiene.
6. **Update the Privacy Policy.** Storing a buyer's email is new data collection not currently disclosed — `/privacy`'s "What we collect" section needs a short addition covering it, scoped explicitly to "resending your reading link if you ask for it," not marketing.
7. **Don't conflate this with launch-checklist §8 item 7** (the Tier-2 "email capture + nurture sequence" for marketing, which needs real opt-in/unsubscribe copy under Australia's Spam Act). This magic-link feature is transactional (delivering something the customer already bought), a much lighter compliance bar — keep them as separate features, and don't let this one grow into a marketing list without building proper consent first.

**One more thing to check before starting:** Stripe's account was still under manual review as of this session (not yet activated for live payments) — confirm current status before assuming the webhook path is reachable end-to-end in production.
