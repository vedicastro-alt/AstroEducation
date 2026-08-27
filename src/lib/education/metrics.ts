import type { PlanetKey } from "../astro/constants";
import type { BirthChart } from "../astro/types";
import type { InsightItem } from "./types";
import { citeHouseLord, citePlacement, houseAspectNote, renderTieredInsight, tierFromScore, type Tier } from "./narrative";
import { houseAspectNudge, houseEase, houseLord, strengthScore } from "./scoring";

export interface Metric {
  id: string;
  score: (chart: BirthChart) => number;
  strength: (chart: BirthChart, childName: string) => InsightItem;
  growth: (chart: BirthChart, childName: string) => InsightItem;
}

const clampScore = (raw: number) => Math.min(10, Math.max(0, 5 + raw));

interface MetricDefinition {
  id: string;
  score: (chart: BirthChart) => number; // 0..10, 5 = neutral
  /** The single planet this metric is actually about, for dignity/conjunction-driven interpretation. */
  leadPlanet: (chart: BirthChart) => PlanetKey;
  citation: (chart: BirthChart) => string;
  seed: (chart: BirthChart) => number;
  title: Record<Tier, string>;
  variants: Record<Tier, ((name: string) => string)[]>;
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

function render(def: MetricDefinition, chart: BirthChart, name: string): InsightItem {
  const tier = tierFromScore(def.score(chart) - 5);
  return {
    id: def.id,
    title: def.title[tier],
    body: renderTieredInsight({
      chart,
      name,
      tier,
      leadPlanet: def.leadPlanet(chart),
      citation: def.citation(chart),
      seed: def.seed(chart),
      variants: def.variants,
    }),
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
          `Speech and memory work look fairly balanced for ${name} — neither a standout strength nor a struggle. With normal exposure (reading aloud, conversation, naming games) this area should develop at a comfortable, ordinary pace.`,
      ],
      growing: [
        (name) =>
          `Early speech and memorisation may take a little longer to click for ${name} than for some children — and that's completely alright. With patient, playful repetition (songs, read-alouds, naming games) this area tends to blossom beautifully; it just wants a gentler runway.`,
        (name) =>
          `${name} may need more repetition than average to build early vocabulary and hold onto new words and facts — this isn't a ceiling, just a different pace. Short, frequent, low-pressure practice tends to work far better than pushing for quick results.`,
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
          `${name}'s sense of security around learning looks fairly ordinary — some new situations may take a little adjusting to, others won't. A predictable-enough routine should be all that's needed here.`,
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
          `${name}'s intellectual spark looks present but not automatic — engagement is likely to depend a lot on whether a subject has actually captured their interest, more than on the subject's difficulty.`,
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
          `${name}'s relationship with abstract or philosophical ideas looks fairly typical — interest is likely to grow naturally with age and exposure, rather than showing up as an early, standout trait.`,
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
          `${name}'s reasoning and communication look like an ordinary, capable foundation — neither unusually fast nor unusually effortful. Standard teaching approaches should suit them well.`,
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
          `${name}'s general outlook toward learning and teachers looks fairly typical — positive experiences will likely build confidence over time, same as for most children.`,
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
          `${name}'s mood and focus look fairly typical in how much they're affected by their surroundings — a calm environment helps, as it does for most children, without this being an unusual sensitivity.`,
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
          `${name}'s capacity for sustained focus looks fairly typical for their age — it will likely develop steadily with practice, same as for most children, without needing unusual intervention.`,
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
  strength: (chart, childName) => render(def, chart, childName),
  growth: (chart, childName) => render(def, chart, childName),
}));
