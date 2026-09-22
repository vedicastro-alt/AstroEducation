# LinkedIn Article — Final Draft

> Paste-ready. LinkedIn articles support headings, bold and bullets, so the formatting below carries over directly. Three alternative titles are at the bottom.

---

# AI Wrote the Code. The Hard Part Was Everything Else — A Builder's Playbook for AI-First Startups

**The most valuable thing AI did for my startup wasn't writing code. It was playing my toughest customer, and telling me exactly why they wouldn't buy.**

That moment changed how I think about building with AI. There are plenty of posts about shipping an app in a weekend. What I learned over months of building a real product, with AI agents as my engineering team, is that AI is best at making good judgement faster. It won't give you judgement you don't have.

The product is **Little Stargazers** ([littlestargazer.com](https://littlestargazer.com)). It calculates a child's real astronomical birth chart from ephemeris data (no templates) and turns it into a warm, plain-language guide for parents on how their child might learn and grow best. It's live, it takes real payments, and I built nearly all of it by directing AI coding agents instead of typing every line myself.

Here's what that actually looked like, and what I'd tell anyone starting down this path.

---

## Where passion meets AI

Little Stargazers exists because two things I care about finally met. The first is a lasting curiosity about how children learn: the idea that every child's strengths deserve to be noticed early and talked about kindly. The second is the moment AI became good enough to act as a real building partner rather than an autocomplete.

The two fed each other. Passion gave me the stamina to keep refining a product long after the "cool demo" stage. AI gave me a team's worth of speed: research, architecture, implementation, testing and copy review, all available at 11pm on a Tuesday. Neither would have been enough alone. Together, one person could build something that used to need a small team.

---

## Can you do this without a technical background?

The honest answer has two parts.

**Yes, the barrier really is lower now.** AI will walk you through each step: setting up a database, wiring up payments, deploying, reading an error message. It explains why as well as what. Someone with no technical background can get a working product live today, and that's a real shift.

**And my own technical background helped a great deal.** Little Stargazers has a layered architecture: an astronomical calculation layer, an interpretation engine on top of it, then persistence, payments and email, and finally the reading experience itself. When something broke, knowing which layer to question made the difference between a ten-minute fix and a lost afternoon. My background let me challenge the AI's assumptions, spot when a fix was treating a symptom, and see how a change in one layer would ripple into another.

So AI opens the door for everyone, and technical and product judgement is what turns a working prototype into a product that is sound, fair and trustworthy. If you don't have that background, borrow it: ask the AI to explain its own architecture back to you until you could defend it yourself.

---

## The playbook: what I'd tell anyone building a startup with AI

**1. Give your AI a memory, because it doesn't have one.**
No AI session remembers the one before it. I kept a running handoff document, now more than 60 sections long, recording every decision, bug, trade-off and open question. Every new agent session starts by reading it. It's the single most important habit behind the whole build, and it doubles as an honest record of how the product came to be.

**2. Set your constraints before you build.**
Before I wrote any marketing copy, I set rules that never bent: no fake urgency, no fabricated testimonials, no fear-based messaging to parents. These weren't only ethical choices. Australian Consumer Law treats misleading conduct seriously, and "no countdown timers" is a better rule to set on day one than to learn about from a regulator. When I wanted social proof, we built a real feedback feature instead: customers can rate their reading and choose whether their words may ever be featured.

**3. Build your harshest critic before your next feature.**
Before scaling anything, I had AI agents role-play realistic, skeptical parents: a curious parent of a 4-year-old, a pragmatic parent of a 12-year-old with an electives form due, and an anxious parent of a 17-year-old facing university choices. Each browsed the live site in character with no access to the code, and decided honestly whether they'd pay. In one round, all three independently found the same flaw: the age "personalisation" was cosmetic, because the header changed with the child's age but the substance didn't. That's the kind of insight that normally costs months of real customer churn. I got it in an afternoon, and I've re-run the method after every major change since.

**4. Make AI check fairness, not just correctness.**
Code can pass every test and still be quietly unfair. More on this below. It's a lesson that applies to any AI-built product that ranks, scores or recommends.

**5. Question your own pricing logic.**
Every discount and bundle interacts with every other one. I noticed that one of our bundle offers, measured against the returning-customer discount a customer would get anyway, saved them exactly $0. The "save X%" label was comparing against a scenario nobody actually faces. Check your pricing against the real alternative your customer has, not the marketing maths.

**6. Pause, don't delete, and decide quickly.**
Once that bundle didn't hold up, we paused it behind a single feature flag the same week, with every underlying mechanism left intact for a better-designed return later. We didn't agonise over sunk cost, and we didn't rebuild anything.

**7. The uncomfortable result is usually the useful one.**
Every hard finding in this build, whether a persona walking away, a biased score or a pricing flaw, made the product better. Build a process that surfaces them early, then thank it.

---

## For the tech-curious

For those who want to know what's under the hood, briefly:

- **Stack:** Next.js (App Router) with React and TypeScript, Tailwind CSS, Supabase (Postgres), Stripe Checkout, Resend for email, Sentry for error monitoring, deployed on Vercel.
- **Real astronomy, not templates:** chart calculation uses a real ephemeris library, with the traditional calculation layers (sidereal correction, house system, planetary periods) hand-built on top.
- **Layered architecture:** calculation → interpretation engine → persistence and payments → reading experience. Each layer can be tested on its own, which made it far easier to point an AI agent at exactly the right place.
- **Payments designed not to lose a sale:** purchases are confirmed two ways, verified immediately on redirect and confirmed by webhook as the source of truth. Tracking down a real database race condition in that flow was one of the more satisfying debugging sessions of the build.
- **A fairness bug, found and fixed:** subjects were scored with formulas on different scales and then compared directly. As a result, Computer Science won the "top subject" ranking in **zero** of thousands of simulated charts. The fix was z-score standardisation: compare each subject against its own typical range instead of raw totals. Afterwards, every subject had a real chance, winning between roughly 7% and 17% of simulated charts. It's a small equation with a real consequence for how a child's strengths are presented to their parent.
- **Low-risk operations:** feature flags to pause rather than delete, database migrations that only add and never remove, and passwordless "magic-link" access for returning families.

The pattern: AI implemented every one of these well once the decision was clear, and was very good at stress-testing a decision before I committed to it. Deciding what was true, fair and right to say to a parent stayed with me.

---

## For the product-curious

The market and product side got as much rigour as the code:

- **Competitive landscape:** I mapped the direct competitors in children's astrology and education reports. Each one fell short on at least one of five dimensions: authentic calculation, child-specific content, a global and jargon-free tone, modern UX, and honest positioning. Clearing all five became the actual positioning, rather than a vague "big market" claim.
- **Pricing:** two one-time tiers, $25 and $35, deliberately placed above commodity templated reports and below boutique human readings, priced in USD for a global audience. There's a free preview so parents can judge the quality before paying.
- **Channel strategy from evidence:** research showed paid social is a poor fit for this category (restricted targeting, and margins that don't survive typical cost-per-click at this price). The primary channels became organic content and SEO, plus Pinterest, where parenting content performs well.
- **Platform risk as a first-class concern:** payment processors have restricted-business rules, and some ban this category outright. That finding shaped the product's language from day one: education, parenting guidance and personality insight, never fortune-telling. Which processor you can use, and what you're legally allowed to claim, will shape your product more than most competitive analysis will.
- **Honest expectations:** I modelled a realistic range for a niche, content-led product like this rather than a hockey stick, because a plan built on honest numbers is one you can actually run.
- **Persona testing as product research:** the adversarial persona method above did more than find bugs. It showed where the value promise and the delivered experience drifted apart, which is the most important gap any product team can close.

---

## What this means if you're hiring, leading or adopting AI

For me, the lasting lesson is that **AI moves the bottleneck from implementation to judgement.** Anyone can now generate code. What still separates products is:

- the ability to break a messy business idea into clean, layered systems an AI can build reliably
- a testing mindset that uses AI to argue against your own assumptions
- the discipline to set ethical and legal constraints first and hold to them
- the product sense to know what to build, what to pause and what to cut

That's the work I love doing: turning an idea into a real, responsibly built AI product, from market research and architecture through to launch.

If you're building with AI, leading a team that is, or weighing how to bring it into your product, I'd love to compare notes. Connect with me or send me a message.

And if you're a parent curious what the stars might say about how your child learns best, take a look at **[littlestargazer.com](https://littlestargazer.com)**. Start with the free sample; there's no pressure.

---

*#AI #ArtificialIntelligence #Startups #ProductManagement #AIProductDevelopment #BuildInPublic #Entrepreneurship #GenerativeAI*

---
---

## Alternative titles (pick one)

1. **AI Wrote the Code. The Hard Part Was Everything Else — A Builder's Playbook for AI-First Startups** *(used above)*
2. **I Built a Startup With AI Agents as My Engineering Team. Here Are the 7 Lessons That Actually Mattered.**
3. **The Most Valuable Thing AI Did for My Startup Was Tell Me Why Customers Wouldn't Buy**

## Short LinkedIn post to share the article

> AI can write your code now. So what separates a real product from a demo?
>
> I built Little Stargazers (littlestargazer.com) by directing AI agents as my engineering team. The biggest lessons had nothing to do with code: giving AI a memory, having it play my harshest customer, catching a fairness bug that no test would have flagged, and questioning my own pricing maths.
>
> I wrote up the full playbook, with a section for the tech-curious and one for the product-curious. 👇
>
> #AI #Startups #ProductManagement

---

## Notes for the founder before publishing

- **"Where passion meets AI" is the one section written without your own words to draw on.** The handoff didn't include your personal story, so it's kept general. Swap in one or two real, specific sentences about why this matters to you (your background, a moment that sparked it). That's what will make it land.
- **The technical-background paragraph** is kept general for the same reason. If you want to name your field or years of experience, it slots into "And my own technical background helped a great deal."
- Every product and technical claim is checked against the project's `HANDOFF.md` (§3 stack, §5 market research, §6 constraints, §18 persona test, §20 payment race, §37 feedback feature, §50/§52 fairness fix, §66 pack pause). No sales figures, user counts or results appear in either direction.
- The "$300–$2,000/month" projection from the research was left out on purpose. It's a forecast, and printing it risks being read as a result. Add it back if you want it.
