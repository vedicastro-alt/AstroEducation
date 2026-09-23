# LinkedIn Article — Final Draft (v5)

> Paste-ready. LinkedIn articles support headings, bold and bullets, so the formatting below carries over directly. Title options, a short post to share it, and notes for you are at the bottom.

---

# AI Wrote the Code. The Hard Part Was Everything Else — A Builder's Playbook for AI-First Startups

**The most valuable thing AI did for my startup wasn't writing code. It was playing my toughest customer, and telling me exactly why they wouldn't buy.**

I built and launched **Little Stargazers** ([littlestargazer.com](https://littlestargazer.com)) by directing AI agents as my engineering team. "AI built it" makes it sound effortless. Here's what it actually took:

- **4 days** from the first line of code to a live site taking real payments, then weeks of relentless refinement
- **Around 300 hours in six weeks**, entirely outside my day job
- **6 rounds of adversarial testing** — AI agents role-playing skeptical parents, with no access to the code, deciding honestly whether they'd pay
- **A full UI redesign, 13 SEO posts, and a domain and trademark question** worked through properly rather than skipped

None of those numbers are the point on their own. What they add up to is this: every one of them came from a real decision I made, not a default the AI picked for me.

The biggest lesson: AI doesn't replace judgement. It multiplies whatever judgement you bring.

This article is for two kinds of curious minds. **Tech-curious** readers get the stack and the bugs worth learning from. **Product-curious** readers get the market research, pricing and positioning. Hopefully there's something here for both.

---

## Why I built it

Astrology runs in my family, and I've practised it for years as a passionate hobby. With my own two children, I used it to reflect on their personalities, strengths and challenges, as one more lens for understanding how to support each of them better.

I wanted to offer that same kind of reflection to other parents. Little Stargazers calculates a child's real astronomical birth chart (not a template) and turns it into a warm, plain-language guide to how they might learn and grow. It's positioned as a starting point for conversations about a child, not as prediction. The site says so plainly: "Is this scientific? No, and we won't pretend otherwise."

It's also a deliberate business decision: a low-overhead, content-driven income stream, not a passive one — it takes ongoing SEO and marketing work to grow, and I keep at that deliberately.

---

## Technical background: helpful, not required

AI genuinely lowers the barrier to entry. It walks you through each step, from setting up a database to wiring up payments to deploying, and it explains why along the way. Someone with no technical background can get a real product live today.

My own technical background still made a real difference. The product has a layered architecture: astronomical calculation, then an interpretation engine, then data and payments, then the reading experience. When something broke, knowing which layer to question turned hours into minutes. It also let me push back when an AI fix treated the symptom rather than the cause.

**AI opens the door for everyone. Judgement is what makes the product sound.**

---

## The playbook

None of these are complicated alone. What made them work was doing them in this order, every time, not picking one when it felt convenient:

**1. Give your AI a memory.** No AI session remembers the last one. I kept a running handoff document, now more than 60 sections long, recording every decision, bug and open question. Every new session starts by reading it.

**2. Set your constraints before you build.** I set rules on day one: no fake urgency, no fabricated testimonials, no fear-based messaging to parents. They're grounded in Australian Consumer Law, not just ethics. Instead of placeholder reviews, we built a real feedback feature where customers choose whether their words can ever be featured.

**3. Build your harshest critic first.** AI agents role-played skeptical parents of a 4-, 12- and 17-year-old, browsing the live site in character with no access to the code, and decided honestly whether to pay. In one round, all three independently found the same flaw: the age "personalisation" was cosmetic. It's not a substitute for real customer feedback — it's a way to catch obvious blind spots before a real parent has to. I still ask real parents directly, and their feedback has caught things the simulated rounds missed. Together, that's a fast first pass and a real check, not one instead of the other.

**4. Pause, don't delete, and keep checkpoints.** Throughout the build, every piece of work went on its own branch with a written checkpoint, and nothing reached production without my explicit go-ahead. When an idea wasn't ready, whether a pricing offer, an open question or a heavier calculation feature, we parked it behind a flag or on a branch, fully intact, so we could come back when the time was right. Nothing was lost and nothing was rushed.

**5. The uncomfortable result is the useful one.** A persona walking away, a biased score, a broken edge case: every hard finding made the product better. Build a process that surfaces them early.

Run that loop on every feature — constraint first, critic before scale, an uncomfortable finding treated as data rather than a setback — and it doesn't matter whether what you're building is a kids' astrology reading or an internal tool for a 500-person company. The domain changes. The discipline doesn't.

---

## For the tech-curious

- **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase (Postgres), Stripe Checkout, Resend, Sentry, Vercel.
- **Real astronomy:** a real ephemeris library, with the traditional calculation layers hand-built on top.
- **Payments:** confirmed two ways, verified on redirect and by webhook as the source of truth.
- **A few bugs we caught and fixed along the way:**
  - *Paid customers occasionally saw the paywall again.* It was a read-after-write gap in the database, fixed by trusting the value just written instead of re-reading it.
  - *Computer Science could never rank as a child's top subject.* Scores were on different scales, and z-score standardisation gave every subject a fair chance.
  - *The same "evidence" sentence was reused for four unrelated traits.* Every sentence is now tied to the underlying score.
  - *A failed form submission silently wiped what parents had typed.* Switching to controlled form state fixed it.

AI implemented each fix quickly once the root cause was clear. Finding the real root cause, and not settling for the first plausible one, was the human part.

---

## For the product-curious

- **Competitive gap:** every direct competitor fell short on at least one of five things: authentic calculation, child-specific content, a global and jargon-free tone, modern UX, and honest positioning. Clearing all five is the positioning.
- **Pricing:** a free preview, then one-time readings at $25 and $35. That sits above templated reports and below boutique human readings.
- **Channels:** paid social suits this category poorly because of restricted targeting and thin margins, so organic content, SEO and Pinterest lead.
- **Platform risk:** payment processors restrict this category, so the product's language was framed from day one around education and parenting, never fortune-telling.
- **Projection:** my market research put a realistic range at **$300–$2,000/month within 12–18 months** of consistent content effort — a research-based estimate, not a result I'm claiming yet, though real sales, including repeat customers, are already coming in early. It's built for a modest, sustained income, not a venture-scale outcome, and growing it is a matter of steady SEO and marketing work, not a one-time launch.

---

## The real shift: from writing code to exercising judgement

AI has made building cheap. What's still scarce is the judgement around it:

- breaking a messy idea into clean systems an AI can build reliably
- using AI to argue against your own assumptions
- setting ethical and legal guardrails first
- knowing what to ship, what to park and what to fix properly

That's the work I love, and it's the work I'd bring to any AI product team. If you're building with AI, or deciding how to, I'd love to compare notes.

And if you're a parent who is curious, start with the free sample at **[littlestargazer.com](https://littlestargazer.com)**.

---

*#AI #ArtificialIntelligence #Startups #ProductManagement #AIProductDevelopment #BuildInPublic #Entrepreneurship*

---
---

## Alternative titles

1. **AI Wrote the Code. The Hard Part Was Everything Else — A Builder's Playbook for AI-First Startups** *(used above)*
2. **I Built a Startup With AI Agents as My Engineering Team. Here's What Actually Mattered.**
3. **The Most Valuable Thing AI Did for My Startup Was Tell Me Why Customers Wouldn't Buy**

## Short LinkedIn post to share the article

> "AI built it" makes it sound effortless. It wasn't.
>
> 300 hours. Six weeks. Outside my day job. And the hardest part was never the code.
>
> I had AI agents pretend to be skeptical parents and tell me, in character, whether they'd actually pay for what I'd built. What they found wasn't a bug I expected.
>
> I also found a bias sitting quietly inside my own scoring logic — the kind no one would have noticed until a customer did.
>
> Neither of those got fixed by writing better prompts.
>
> I wrote up what six weeks of building Little Stargazers (littlestargazer.com) with AI as my engineering team actually taught me — about where AI genuinely replaces you, and the one thing it never will.
>
> Full story 👇
>
> #AI #Startups #ProductManagement #BuildInPublic
---

## Notes for the founder

- **Astrology framing:** "Why I built it" keeps your real reasons (a family tradition, your two kids, supporting other parents, passive income). It presents astrology as a hobby and a lens for reflection, and quotes the site's own "Is this scientific? No" line. That candour tends to earn respect from a business audience. Your sentence "I believe stars do influence certain parts of our lives" is softened to "one more lens for understanding." Put it back if you'd rather state it directly.
- **The $300–$2,000/month figure is labelled as a research projection**, not current revenue, so it reads as planning discipline rather than a claim about results.
- **Bug examples** come from HANDOFF.md §7, §19, §20 and §50. The "checkpoints" point reflects the working branches with explicit merge approval, the parked items (§2 D24 calculation, §8 deferrals, §63) and the paused credit packs (§66).
- Length is down from about 1,700 words to about 1,000.
- **Opening numbers (v3), where each one comes from:**
  - **~300 hours in six weeks, outside your day job:** your own figure. "20 build days" was dropped: it only counted days with commits, which undersold the research, testing and design time.
  - **~15,000 lines of production code:** a count of the non-blank lines in the 128 TypeScript/TSX, CSS and SQL files on the production branch (`claude/vedic-horoscope-learning-site-fb6fta`, as of 15 Sep). It excludes config, lockfiles and dependencies. The later unmerged work (§62–§66) isn't counted.
  - **Commits, branches, build days, 4 days to live payments:** from the repo's git history (first commit 24 Aug 2026; Stripe live 27 Aug, HANDOFF.md §8).
  - **"Nearly a third between 10pm and 5am":** commit timestamps (54 of 185) converted to Sydney time. If you're in another timezone, tell me and I'll recalculate. These are the times work was committed from your AI sessions, which is a fair proxy for when you were working.
  - **8+ production releases:** the "merged into production" sections §25, §30, §34, §41, §44, §46, §51, §54.
  - **6 test rounds / 19 persona sessions:** §7, §18, §26, §32, §33 (four personas), §58.
  - **6,000-chart simulation:** §50. **Five design rounds:** §31. **SEO:** §13 and §17. **Branding and domain:** §2 and §14.
  - The earlier "over several months" wording was wrong, since the repo's history spans about four weeks, and has been removed. If the journey started before this repo, it's already counted in your 300-hour figure.
- **v4 changes, from a 3-persona readership test (an aspiring founder, an AI leader evaluating you for hire, and a panel of skeptical LinkedIn peers):**
  - **Trimmed the opening stat list.** All three testers independently flagged the line-of-code count, commit/branch counts, and the "10pm–5am" detail as reading like padded effort metrics or a hustle humble-brag rather than a credibility signal — cut. The full stack, bug and testing detail is still there lower down, for readers who want it.
  - **Softened the revenue-projection line.** Two testers called "a solid passive income stream" an overclaim with no real traction shown yet. It now says plainly this is a research estimate, not a result.
  - **Gave the playbook a connecting frame** (an intro line and a closing line) so it reads as one repeatable process instead of five separate anecdotes — the aspiring-founder persona's main complaint.
  - **Added one line bridging the astrology-hobby product to the AI-consulting pitch directly**, since the peer panel's single biggest flagged risk was that pitch sitting unaddressed next to a kids' astrology product.
  - Not fixed, and worth knowing: two testers wanted real business numbers (revenue, conversions, retention) to fully believe the projection and the "hire me" pitch — that's not fixable without disclosing figures you've asked to keep private, so it's a known, accepted trade-off, not an oversight.
- **v5, after re-running the same 3 personas against v4:** scores held (6/10, 5/10, same core gap for the peer panel), but the specific complaints they raised in v3 (vanity stats, disjointed playbook, unaddressed astrology/consulting tension) did not recur — confirming those fixes worked. All three converged on one remaining gap: no real evidence behind the persona-testing method or the revenue projection. You then told me two things not previously in this file: you also get direct feedback from real parents (which is what led to earlier content-layer fixes), and you're seeing early real sales, roughly 1-2/week, some repeat, expected to grow with continued SEO/marketing. Changes made:
  - **"Passive income" reworded** to "low-overhead, content-driven income" in "Why I built it," since a tester correctly pointed out something needing 12-18 months of "consistent content effort" isn't passive. Added a line that growing it takes ongoing SEO/marketing work, per what you told me.
  - **Added that you also validate with real parents**, not just AI personas, in the playbook's testing point — a true, disclosed fact that directly answers the "no ground truth" critique, not an invented one.
  - **Added a vaguer version of the sales fact** to the product-curious projection line ("real sales, including repeat customers, are already coming in early") rather than the specific weekly number, per your choice when I asked. No number is quantified, so it can't be checked against an exact figure and prove wrong later, but it does say sales are real and include repeat buyers.
