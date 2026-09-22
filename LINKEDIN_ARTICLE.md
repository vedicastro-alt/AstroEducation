# LinkedIn Article — Final Draft (v3)

> Paste-ready. LinkedIn articles support headings, bold and bullets, so the formatting below carries over directly. Title options, a short post to share it, and notes for you are at the bottom.

---

# AI Wrote the Code. The Hard Part Was Everything Else — A Builder's Playbook for AI-First Startups

**The most valuable thing AI did for my startup wasn't writing code. It was playing my toughest customer, and telling me exactly why they wouldn't buy.**

I built and launched **Little Stargazers** ([littlestargazer.com](https://littlestargazer.com)) by directing AI agents as my engineering team. "AI built it" makes it sound effortless. Here's what it actually took:

- **4 days** from the first line of code to a live site taking real payments, then weeks of relentless refinement
- **Around 300 hours in six weeks**, all outside my day job and much of it at odd hours: nearly a third of all code changes landed between 10pm and 5am, fitted around work and family
- **185 commits across 20 working branches**, and **8+ reviewed production releases**, each one checked with a clean build, lint and type-check before it went live
- **6 rounds of simulated-customer testing** (19 in-character parent sessions), plus a **6,000-chart simulation** to prove the scoring was fair
- **A full UI redesign** through five rounds of design iteration, a mobile usability audit, and fixes from testing on real phones
- **SEO from day one:** 13 blog posts, structured data, a sitemap and Google Search Console
- **Branding battles:** littlestargazers.com and .org were both taken, so I settled on littlestargazer.com. When I found a similarly named children's book series, I ran a trademark search (it came back clean), kept the name, and redesigned the logo so the brand stands on its own.

The biggest lesson: AI doesn't replace judgement. It multiplies whatever judgement you bring.

This article is for two kinds of curious minds. **Tech-curious** readers get the stack and the bugs worth learning from. **Product-curious** readers get the market research, pricing and positioning. Hopefully there's something here for both.

---

## Why I built it

Astrology runs in my family, and I've practised it for years as a passionate hobby. With my own two children, I used it to reflect on their personalities, strengths and challenges, as one more lens for understanding how to support each of them better.

I wanted to offer that same kind of reflection to other parents. Little Stargazers calculates a child's real astronomical birth chart (not a template) and turns it into a warm, plain-language guide to how they might learn and grow. It's positioned as a starting point for conversations about a child, not as prediction. The site says so plainly: "Is this scientific? No, and we won't pretend otherwise."

It's also a deliberate business decision: a low-touch digital product designed as a **passive income stream**.

---

## Technical background: helpful, not required

AI genuinely lowers the barrier to entry. It walks you through each step, from setting up a database to wiring up payments to deploying, and it explains why along the way. Someone with no technical background can get a real product live today.

My own technical background still made a real difference. The product has a layered architecture: astronomical calculation, then an interpretation engine, then data and payments, then the reading experience. When something broke, knowing which layer to question turned hours into minutes. It also let me push back when an AI fix treated the symptom rather than the cause.

**AI opens the door for everyone. Judgement is what makes the product sound.**

---

## The playbook

**1. Give your AI a memory.** No AI session remembers the last one. I kept a running handoff document, now more than 60 sections long, recording every decision, bug and open question. Every new session starts by reading it.

**2. Set your constraints before you build.** I set rules on day one: no fake urgency, no fabricated testimonials, no fear-based messaging to parents. They're grounded in Australian Consumer Law, not just ethics. Instead of placeholder reviews, we built a real feedback feature where customers choose whether their words can ever be featured.

**3. Build your harshest critic first.** AI agents role-played skeptical parents of a 4-, 12- and 17-year-old, browsing the live site in character with no access to the code, and decided honestly whether to pay. In one round, all three independently found the same flaw: the age "personalisation" was cosmetic. That's months of customer feedback in an afternoon, and I re-run the test after every major change.

**4. Pause, don't delete, and keep checkpoints.** Throughout the build, every piece of work went on its own branch with a written checkpoint, and nothing reached production without my explicit go-ahead. When an idea wasn't ready, whether a pricing offer, an open question or a heavier calculation feature, we parked it behind a flag or on a branch, fully intact, so we could come back when the time was right. Nothing was lost and nothing was rushed.

**5. The uncomfortable result is the useful one.** A persona walking away, a biased score, a broken edge case: every hard finding made the product better. Build a process that surfaces them early.

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
- **Projection:** my market research put a realistic range at **$300–$2,000/month within 12–18 months** of consistent content effort. It's a solid passive income stream rather than a venture-scale bet, and that's exactly what it was designed to be.

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

> AI can write your code now. So what separates a real product from a demo?
>
> I built Little Stargazers (littlestargazer.com) by directing AI agents as my engineering team. The lessons that mattered most weren't about code: giving AI a memory, making it play my harshest customer, keeping checkpoints so nothing is lost, and chasing root causes instead of symptoms.
>
> Full playbook below, with sections for the tech-curious and the product-curious. 👇
>
> #AI #Startups #ProductManagement

---

## Notes for the founder

- **Astrology framing:** "Why I built it" keeps your real reasons (a family tradition, your two kids, supporting other parents, passive income). It presents astrology as a hobby and a lens for reflection, and quotes the site's own "Is this scientific? No" line. That candour tends to earn respect from a business audience. Your sentence "I believe stars do influence certain parts of our lives" is softened to "one more lens for understanding." Put it back if you'd rather state it directly.
- **The $300–$2,000/month figure is labelled as a research projection**, not current revenue, so it reads as planning discipline rather than a claim about results.
- **Bug examples** come from HANDOFF.md §7, §19, §20 and §50. The "checkpoints" point reflects the working branches with explicit merge approval, the parked items (§2 D24 calculation, §8 deferrals, §63) and the paused credit packs (§66).
- Length is down from about 1,700 words to about 1,000.
- **Opening numbers (v3), where each one comes from:**
  - **~300 hours in six weeks, outside your day job:** your own figure. "20 build days" was dropped: it only counted days with commits, which undersold the research, testing and design time.
  - **Commits, branches, build days, 4 days to live payments:** from the repo's git history (first commit 24 Aug 2026; Stripe live 27 Aug, HANDOFF.md §8).
  - **"Nearly a third between 10pm and 5am":** commit timestamps (54 of 185) converted to Sydney time. If you're in another timezone, tell me and I'll recalculate. These are the times work was committed from your AI sessions, which is a fair proxy for when you were working.
  - **8+ production releases:** the "merged into production" sections §25, §30, §34, §41, §44, §46, §51, §54.
  - **6 test rounds / 19 persona sessions:** §7, §18, §26, §32, §33 (four personas), §58.
  - **6,000-chart simulation:** §50. **Five design rounds:** §31. **SEO:** §13 and §17. **Branding and domain:** §2 and §14.
  - The earlier "over several months" wording was wrong, since the repo's history spans about four weeks, and has been removed. If the journey started before this repo, it's already counted in your 300-hour figure.
