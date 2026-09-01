import type { PlanetKey } from "../astro/constants";
import type { BirthChart } from "../astro/types";
import type { InsightItem } from "./types";
import { citeHouseLord, citePlacement, houseAspectNote, nextFlavorIndex, renderTieredInsight, tierFromScore, type Tier } from "./narrative";
import { houseAspectNudge, houseEase, houseLord, strengthScore } from "./scoring";
import type { AgeBand } from "./age";

export interface Metric {
  id: string;
  score: (chart: BirthChart) => number;
  strength: (chart: BirthChart, childName: string, ageBand: AgeBand) => InsightItem;
  growth: (chart: BirthChart, childName: string, ageBand: AgeBand) => InsightItem;
}

const clampScore = (raw: number) => Math.min(10, Math.max(0, 5 + raw));

const SENIOR_BANDS: AgeBand[] = ["senior", "youngAdult"];

interface MetricDefinition {
  id: string;
  score: (chart: BirthChart) => number; // 0..10, 5 = neutral
  /** The single planet this metric is actually about, for dignity/conjunction-driven interpretation. */
  leadPlanet: (chart: BirthChart) => PlanetKey;
  citation: (chart: BirthChart) => string;
  seed: (chart: BirthChart) => number;
  title: Record<Tier, string>;
  variants: Record<Tier, ((name: string) => string)[]>;
  /**
   * A conversion-test re-run found this free-tier chapter (shown to
   * every visitor, before any tier is purchased) had zero age-band
   * awareness, unlike the paid subjects/direction chapters -- a 17-year-
   * old's "Natural strengths" read "a new word or rhyme might take two
   * or three repeats to stick," early-childhood language-acquisition
   * content, and nearly cost a persona who was otherwise engaged. Senior/
   * youngAdult overrides only, since that's where the mismatch is
   * sharpest; early/primary/middle keep the original variants.
   */
  seniorVariants?: Partial<Record<Tier, ((name: string) => string)[]>>;
}

function citeHouse(chart: BirthChart, houseNumber: number): string {
  const lord = houseLord(chart, houseNumber);
  const nudge = houseAspectNudge(chart, houseNumber);
  const note = houseAspectNote(nudge > 0, nudge < 0);
  return `Ruled by ${lord}, ${citeHouseLord(chart, lord)}${note}.`;
}

function citePlanet(chart: BirthChart, key: PlanetKey): string {
  return citePlacement(chart, key);
}

function houseSeed(chart: BirthChart, houseNumber: number): number {
  const lord = houseLord(chart, houseNumber);
  const planet = chart.planets.find((p) => p.key === lord);
  return planet ? planet.rashi.degreeInRashi : 0;
}

function planetSeed(chart: BirthChart, key: PlanetKey): number {
  const planet = chart.planets.find((p) => p.key === key);
  return planet ? planet.rashi.degreeInRashi : 0;
}

/**
 * With 8 metrics but only the top 4 shown as "strengths" and the bottom
 * 2 as "areas to nurture," the same "steady"/"ordinary" tier language can
 * land in either list -- a conversion-test parent flagged this directly:
 * the wording gave no way to tell whether a given "ordinary" placement
 * was meant as a plus or a minus. Since strength/growth is about a
 * metric's rank relative to the rest of THIS chart, not its literal tier
 * label, the clarifying clause below is keyed on which list it's being
 * shown in (a real, if coarser, signal) rather than trying to invent a
 * fifth tier.
 *
 * Each (role, tier) pair has real phrasing variants, picked round-robin
 * per chart (see `nextFlavorIndex`) -- the §22 content audit found the
 * original single fixed sentence per pair rendering as a byte-for-byte
 * duplicate in 96% of a random 80-chart sample, since 4 strengths (and 2
 * growth areas) routinely share a tier within one report. This is the
 * same fix already applied to citation/conjunction text; this pool had
 * simply been added afterward and never given the same treatment.
 * "strength" gets 4 variants, not 2 -- engine.ts shows up to 4 strengths
 * per report (`ranked.slice(0, 4)`), and round-robin only *guarantees* no
 * repeat once the variant count matches the largest number of same-tier
 * items that can collide (same pigeonhole reasoning narrative.ts's own
 * counter already documents). "growth" only ever shows 2 items
 * (`ranked.slice(-2)`), so 2 variants there is already sufficient.
 */
type Role = "strength" | "growth";

const ROLE_CLAUSE: Record<Role, Partial<Record<Tier, string[]>>> = {
  strength: {
    steady: [
      " Among everything covered in this reading, this is genuinely one of the sturdier, more dependable areas — not a standout, but one of the better-established ones.",
      " Set against everything else in this reading, this is one of the more reliable, steadier areas — not the flashiest, but genuinely one of the better-established ones.",
      " Relative to the rest of this reading, this is one of the more consistent, well-established areas — not the loudest strength here, but a genuinely solid one.",
      " Measured against everything else in this reading, this holds up as one of the steadier, more dependable areas — worth trusting, even without being the standout.",
    ],
    growing: [
      " Even so, this is relatively one of the stronger areas in this particular reading — it's worth knowing the other placements need more attention first, not this one.",
      " Even so, relative to everything else in this reading, this one holds up better than most — the other placements are the ones that could use more attention first, not this.",
      " Even so, this ranks among the stronger areas once the rest of this reading is factored in — genuinely not the one to prioritise first.",
      " Even so, set against everything else in this reading, this is comparatively one of the better-established areas — the others are the ones needing attention sooner.",
    ],
  },
  growth: {
    steady: [
      " Among everything covered in this reading, this is genuinely one of the areas with more room to grow — not a concern, just where a bit of extra encouragement is likely to do the most good.",
      " Set against everything else in this reading, this is one of the areas with a bit more room to grow — nothing to worry about, just where some extra encouragement is likely to help most.",
    ],
    flourishing: [
      " Even so, this is relatively one of the areas with the most room to grow in this particular reading — a real strength in its own right, just not as dominant here as some of the others.",
      " Even so, relative to everything else in this reading, this is one of the areas with the most room still to grow — a real strength in its own right, it just isn't the most dominant one here.",
    ],
  },
};

function roleClause(chart: BirthChart, role: Role, tier: Tier): string {
  const options = ROLE_CLAUSE[role][tier];
  if (!options) return "";
  const idx = nextFlavorIndex(chart, `role-clause:${role}:${tier}`, options.length);
  return options[idx];
}

function render(def: MetricDefinition, chart: BirthChart, name: string, ageBand: AgeBand, role: Role): InsightItem {
  const tier = tierFromScore(def.score(chart) - 5);
  const isSenior = SENIOR_BANDS.includes(ageBand);
  const seniorOverride = isSenior ? def.seniorVariants?.[tier] : undefined;
  const variants = seniorOverride ? { ...def.variants, [tier]: seniorOverride } : def.variants;
  const body = renderTieredInsight({
    chart,
    name,
    tier,
    leadPlanet: def.leadPlanet(chart),
    citation: def.citation(chart),
    seed: def.seed(chart),
    variants,
  });
  return {
    id: def.id,
    title: def.title[tier],
    body: body + roleClause(chart, role, tier),
  };
}

const DEFINITIONS: MetricDefinition[] = [
  {
    id: "house2",
    score: (c) => houseEase(c, 2),
    leadPlanet: (c) => houseLord(c, 2),
    citation: (c) => citeHouse(c, 2),
    seed: (c) => houseSeed(c, 2),
    title: {
      flourishing: "A natural, confident way with words",
      steady: "A workable foundation for speech and memory",
      growing: "Finding their voice, at their own pace",
    },
    variants: {
      flourishing: [
        (name) =>
          `This tends to show up as clear expression, a strong memory for facts and stories, and real ease building vocabulary for ${name} — a genuine head start for reading and language work.`,
        (name) =>
          `Early speech and memorisation are likely to come with real ease for ${name} — words, rhymes, and stories tend to stick almost effortlessly, giving language-heavy subjects a natural running start.`,
      ],
      steady: [
        (name) =>
          `${name}'s speech and memory look like a genuine middle-of-the-road placement — a new word or rhyme might take two or three repeats to stick rather than one, which is exactly typical. Where this tends to show up most is in retelling: expect a fair, not extraordinary, ability to recount a story or the day's events in the right order, and expect that to sharpen noticeably once independent reading takes hold.`,
        (name) =>
          `Vocabulary and recall look ordinary here for ${name} — not the kind of placement that produces an early reader out of nowhere, but not one that resists it either. Conversation, being read to, and naming games woven into everyday moments (the car ride, mealtime) do the real work for a placement like this, more than any dedicated drill would.`,
      ],
      growing: [
        (name) =>
          `Early speech and memorisation may take a little longer to click for ${name} than for some children — and that's completely alright. With patient, playful repetition (songs, read-alouds, naming games) this area tends to blossom beautifully; it just wants a gentler runway.`,
        (name) =>
          `${name} may need more repetition than average to build early vocabulary and hold onto new words and facts — this isn't a ceiling, just a different pace. Short, frequent, low-pressure practice tends to work far better than pushing for quick results.`,
      ],
    },
    seniorVariants: {
      flourishing: [
        (name) =>
          `This tends to show up as clear, confident expression and a genuine ease putting a complex idea into words on the spot — a real asset in discussion, debate, or writing under time pressure for ${name}.`,
        (name) =>
          `Verbal fluency and recall look like a genuine strength for ${name} — a new concept or argument is likely to be understood and explained back with real precision, not just repeated.`,
      ],
      steady: [
        (name) =>
          `${name}'s verbal fluency and recall look genuinely middle-of-the-road — able to hold their own in a normal conversation or class discussion without it being an obvious strength either way. Explaining an idea back in their own words, rather than just recognising it, tends to be the more reliable measure of real understanding at this age.`,
        (name) =>
          `${name}'s communication and memory for detail sit at an ordinary, workable baseline — enough to keep pace with coursework and discussion, without this being a standout talent. Practising explaining something out loud, not just reading it, tends to sharpen this further than more reading alone would.`,
      ],
      growing: [
        (name) =>
          `Putting a complex idea into words on the spot, or holding a lot of detail in mind at once, may take more deliberate practice for ${name} than it does for some peers — and that's a genuine, workable pattern, not a limit on how well they actually understand the material. Talking an argument through before writing it, or making brief notes to speak from, tends to help.`,
        (name) =>
          `${name} may do their best thinking with a bit more time than a fast-paced discussion allows — the understanding is there, it just doesn't always arrive at conversation speed. Written preparation, or a moment to gather thoughts before answering, tends to let their real grasp of the material show.`,
      ],
    },
  },
  {
    id: "house4",
    score: (c) => houseEase(c, 4),
    leadPlanet: (c) => houseLord(c, 4),
    citation: (c) => citeHouse(c, 4),
    seed: (c) => houseSeed(c, 4),
    title: {
      flourishing: "Learns best from a settled, secure base — and has one",
      steady: "A fairly steady emotional base for learning",
      growing: "Settling in may take some extra warmth",
    },
    variants: {
      flourishing: [
        (name) =>
          `${name} likely learns well in calm, familiar settings and forms warm bonds with teachers and caregivers who feel like home — that sense of security is a real asset heading into any new learning environment.`,
        (name) =>
          `Home and routine are likely to feel like genuine strengths for ${name} — a settled, familiar base that makes it easier to take emotional risks in learning, like asking questions or trying something new.`,
      ],
      steady: [
        (name) =>
          `${name}'s sense of security around learning looks genuinely middle-of-the-road — the first day of a new term or a substitute teacher might take a morning to settle into rather than being instant, and a familiar face or a short check-in at drop-off is usually all it takes to smooth that over. Nothing here suggests it needs managing as a recurring issue.`,
        (name) =>
          `Home and routine sit at an ordinary, unremarkable place for ${name} — genuine comfort, without leaning on it as heavily as a more security-driven child might. A new classroom or schedule is likely to feel like a normal adjustment, settled within a week or two rather than a single day, which is a reasonable range to expect.`,
      ],
      growing: [
        (name) =>
          `${name} may need a bit more time and reassurance to feel truly settled in a new classroom or routine before learning flows easily. A predictable morning routine and a warm goodbye ritual can turn this into a real source of steadiness rather than stress.`,
        (name) =>
          `New environments — a new school year, a new teacher, a new routine — may genuinely unsettle ${name} more than most children before they can focus on learning itself. Investing early in predictability pays off more here than it might for other kids.`,
      ],
    },
  },
  {
    id: "house5",
    score: (c) => houseEase(c, 5),
    leadPlanet: (c) => houseLord(c, 5),
    citation: (c) => citeHouse(c, 5),
    seed: (c) => houseSeed(c, 5),
    title: {
      flourishing: "Bright, genuinely creative intelligence",
      steady: "A workable spark, ready to be lit",
      growing: "Curiosity that needs the right spark",
    },
    variants: {
      flourishing: [
        (name) =>
          `This points to genuine intellectual spark: ${name} likely enjoys thinking things through, playing with ideas, and creating — the single most important house for education in Vedic astrology is doing real work here.`,
        (name) =>
          `${name}'s core intelligence and creative instinct look like a real, dependable strength — the kind that shows up as genuine enjoyment in figuring things out, not just compliance with schoolwork.`,
      ],
      steady: [
        (name) =>
          `${name}'s intellectual spark looks present but not automatic — genuinely engaged with a topic that's caught their interest, noticeably less so with one that hasn't, regardless of how hard or easy it actually is. The practical upshot: which subjects "click" is likely to shift a few times over the school years as their actual interests do, rather than settling into one lane early.`,
        (name) =>
          `${name}'s curiosity looks like an ordinary, non-standout placement — not the kind that turns every subject into a game, but real once something genuinely catches their attention. Watch for it sideways: a question asked well outside the current lesson, or a sudden, short-lived obsession with one topic, are both signs the spark is there even when day-to-day classroom engagement looks average.`,
      ],
      growing: [
        (name) =>
          `${name}'s chart suggests that motivation to engage with formal learning may ebb and flow rather than stay switched on by default. The gift here is that once something genuinely interests them, engagement can be strong — the key is helping them discover what lights them up.`,
        (name) =>
          `Formal, structured learning may not spark ${name}'s natural curiosity as reliably as it does for some children — but that curiosity is real, it's just more selective. Following their actual interests, even unconventional ones, tends to unlock far more engagement than a standard curriculum alone.`,
      ],
    },
  },
  {
    id: "house9",
    score: (c) => houseEase(c, 9),
    leadPlanet: (c) => houseLord(c, 9),
    citation: (c) => citeHouse(c, 9),
    seed: (c) => houseSeed(c, 9),
    title: {
      flourishing: "A real hunger for deeper understanding",
      steady: "An open, ordinary relationship with bigger ideas",
      growing: "Big ideas may need grounding first",
    },
    variants: {
      flourishing: [
        (name) =>
          `As ${name} grows, this often shows as a love of "why" questions, real openness to mentors and big ideas, and genuine fortune in the education journey.`,
        (name) =>
          `${name} is likely to develop a real taste for the "bigger picture" — well beyond what's typically expected at their age, especially once a trusted mentor or teacher is in the picture.`,
      ],
      steady: [
        (name) =>
          `${name}'s relationship with bigger, "why does the world work this way" questions looks fairly typical for now — present, but not yet the driving curiosity it might become. This is the kind of placement that tends to wake up later than others, often around the shift into more abstract subjects (algebra, ethics, history's "why" rather than just its "what") instead of showing up early.`,
        (name) =>
          `${name}'s interest in abstract or philosophical ideas sits at an ordinary starting point — no early standout signal either way. A single good mentor or teacher who takes their questions seriously tends to matter more here than it would for a child who already leans this way on their own; it's the kind of spark that responds to who's asking alongside them, not just to age.`,
      ],
      growing: [
        (name) =>
          `${name}'s chart suggests that higher-level, abstract learning may feel more natural once the basics are solidly in place — there's no rush here. Building confidence step by step, with a trusted mentor along the way, will make the leap into deeper study feel exciting rather than overwhelming.`,
        (name) =>
          `Big, abstract ideas may feel genuinely out of reach for ${name} until the concrete foundations underneath them are rock solid — this is sequencing, not a ceiling. A good mentor who's willing to build up slowly tends to matter more here than raw academic pace.`,
      ],
    },
  },
  {
    id: "mercury",
    score: (c) => clampScore(strengthScore(c, "Mercury")),
    leadPlanet: () => "Mercury",
    citation: (c) => citePlanet(c, "Mercury"),
    seed: (c) => planetSeed(c, "Mercury"),
    title: {
      flourishing: "Quick, precise, analytical thinking",
      steady: "Solid, ordinary reasoning to build on",
      growing: "Thinking that benefits from a slower unfold",
    },
    variants: {
      flourishing: [
        (name) =>
          `${name} likely picks up new concepts quickly and enjoys logic, puzzles, and precise, well-organised work.`,
        (name) =>
          `Fast, clear thinking looks like a genuine natural gift for ${name} — new ideas and logical connections are likely to click quickly, almost before they're fully explained.`,
      ],
      steady: [
        (name) =>
          `${name}'s reasoning and communication look like a genuinely capable, middle-of-the-road foundation — quick enough to keep up with a normal explanation without needing things slowed down, but not racing ahead of it either. In practice that tends to look like instructions landing on the first or second telling, and a new idea usually needing to be seen worked through once before it can be explained back.`,
        (name) =>
          `${name}'s thinking and communication sit at an ordinary pace — not the placement that makes a subject look effortless, but not one that fights against a normal classroom rhythm either. This tends to firm up noticeably once reading is fluent, since so much of "quick thinking" at school age is really quick reading — that milestone is worth watching more closely than this trait on its own.`,
      ],
      growing: [
        (name) =>
          `${name} may prefer to absorb new information slowly and thoroughly rather than in quick bursts — and that's a real strength in disguise. Breaking lessons into small, concrete steps usually helps this settle in comfortably.`,
        (name) =>
          `Quick verbal explanations may not land as easily for ${name} as a slower, more hands-on unfolding of an idea would. This isn't a limit on how deeply they can understand something — just on how fast they should be expected to get there.`,
      ],
    },
  },
  {
    id: "jupiter",
    score: (c) => clampScore(strengthScore(c, "Jupiter")),
    leadPlanet: () => "Jupiter",
    citation: (c) => citePlanet(c, "Jupiter"),
    seed: (c) => planetSeed(c, "Jupiter"),
    title: {
      flourishing: "An open, genuinely optimistic love of learning",
      steady: "A workable, ordinary relationship with learning",
      growing: "Confidence that grows with encouragement",
    },
    variants: {
      flourishing: [
        (name) =>
          `This usually brings ${name} a natural optimism about learning, good judgement, and a warm rapport with teachers and mentors.`,
        (name) =>
          `${name} is likely to carry a genuine, resilient optimism about learning — setbacks are less likely to discourage them for long, and a good mentor relationship tends to come naturally.`,
      ],
      steady: [
        (name) =>
          `${name}'s outlook toward learning and teachers looks genuinely ordinary — a good teacher and a run of small wins build real confidence, same as for most children, and a bad week doesn't need to be treated as a crisis. What tends to matter more than the placement itself is the actual run of experiences they get, since this isn't a placement that carries confidence on its own either way.`,
        (name) =>
          `${name}'s relationship with learning and mentors sits at a typical, unremarkable baseline — no built-in headwind, no built-in glow. A specific, well-timed word of encouragement from a teacher they respect is likely to do about as much for their confidence as it would for most children — a normal, workable amount to build on rather than a lot.`,
      ],
      growing: [
        (name) =>
          `${name}'s confidence in their own understanding may need consistent, gentle encouragement to fully bloom. Praise for effort, not just results, goes a long way here, and belief tends to catch up with ability faster than expected.`,
        (name) =>
          `${name} may be genuinely harder on themselves academically than the situation warrants, needing real, specific encouragement to trust their own understanding. This tends to resolve well with consistency — it rarely stays a lasting pattern.`,
      ],
    },
  },
  {
    id: "moon",
    score: (c) => clampScore(strengthScore(c, "Moon")),
    leadPlanet: () => "Moon",
    citation: (c) => citePlanet(c, "Moon"),
    seed: (c) => planetSeed(c, "Moon"),
    title: {
      flourishing: "Emotionally settled and genuinely receptive",
      steady: "An ordinary emotional rhythm around learning",
      growing: "A sensitive, feeling-first mind",
    },
    variants: {
      flourishing: [
        (name) =>
          `${name} is likely emotionally steady while learning, able to focus without being easily thrown off by a busy or noisy environment.`,
        (name) =>
          `${name}'s emotional steadiness looks like a genuine asset for learning — mood and focus are unlikely to swing much with a noisy classroom or an off day, which gives them real staying power.`,
      ],
      steady: [
        (name) =>
          `${name}'s mood and focus look genuinely ordinary in how much the environment moves the needle — a loud classroom or a rough morning might cost some focus that day, same as for most children, without it being a pattern that needs specifically managing. A calm, well-slept start to the day helps here exactly as much as you'd expect, no more.`,
        (name) =>
          `${name}'s emotional rhythm around learning sits at a typical, unremarkable place — resilient enough to shake off most ordinary disruptions (a noisy sibling, a change of plans) within the same day rather than needing a deliberate reset. Worth noting mainly as a baseline, useful for comparison if anything does shift noticeably around a bigger change, like a new school year.`,
      ],
      growing: [
        (name) =>
          `${name}'s mood and focus may be more sensitive to their surroundings than most — noise, tiredness, or tension at home can visibly affect concentration. This sensitivity is also often the seed of great empathy and intuition; a calm, predictable study space is the best gift here.`,
        (name) =>
          `${name} may need real emotional steadiness in place before learning can flow — this isn't fragility, it's a mind that's genuinely more attuned to its environment than most. Protecting that steadiness does more for their learning than any study technique.`,
      ],
    },
  },
  {
    id: "saturn",
    score: (c) => clampScore(strengthScore(c, "Saturn")),
    leadPlanet: () => "Saturn",
    citation: (c) => citePlanet(c, "Saturn"),
    seed: (c) => planetSeed(c, "Saturn"),
    title: {
      flourishing: "Patient, persistent focus, already in place",
      steady: "An ordinary, developing capacity for focus",
      growing: "Discipline that's still being built",
    },
    variants: {
      flourishing: [
        (name) =>
          `${name} is likely capable of real focus and follow-through once a routine is in place — a quiet strength that compounds beautifully over the school years.`,
        (name) =>
          `Staying power looks like a genuine, early strength for ${name} — sticking with something that isn't instantly fun or easy is likely to come more naturally to them than to most children their age.`,
      ],
      steady: [
        (name) =>
          `${name}'s capacity for sustained focus looks genuinely age-typical — able to stick with a task about as long as most children their age before needing a break, no more and no less. This is the kind of placement that tends to firm up on its own through the ordinary run of homework and chores, rather than needing a dedicated focus-building programme.`,
        (name) =>
          `${name}'s staying power with an unglamorous task sits at an ordinary baseline — a chore or a worksheet gets finished, but probably not without a reminder partway through, which is a completely typical amount of nudging for this age. Consistency (the same expectation, applied the same way, most days) tends to do more for this over time than any single technique.`,
      ],
      growing: [
        (name) =>
          `Sitting still with a task, or sticking with something that isn't instantly fun, may not come naturally to ${name} yet. This is simply a skill in progress — short, consistent practice sessions with plenty of encouragement build this muscle gently over time.`,
        (name) =>
          `${name} may find sustained, unglamorous effort — practice, repetition, routine — genuinely harder to sit with than most children do at this age. Building this gradually, in short bursts with real encouragement, tends to work far better than expecting long stretches of focus too soon.`,
      ],
    },
  },
];

export const METRICS: Metric[] = DEFINITIONS.map((def) => ({
  id: def.id,
  score: def.score,
  strength: (chart, childName, ageBand) => render(def, chart, childName, ageBand, "strength"),
  growth: (chart, childName, ageBand) => render(def, chart, childName, ageBand, "growth"),
}));
