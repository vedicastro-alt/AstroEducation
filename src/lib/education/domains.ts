import type { BirthChart } from "../astro/types";
import type { FocusArea } from "./types";
import type { AgeBand } from "./age";
import {
  ascendantElement,
  ascendantModality,
  fifthHouseElement,
  houseEase,
  moonElement,
  moonModality,
  strengthScore,
} from "./scoring";

const SENIOR_BANDS: AgeBand[] = ["senior", "youngAdult"];

interface DomainDefinition {
  id: string;
  score: (chart: BirthChart) => number;
  title: string;
  body: (childName: string) => string;
  tip: string;
  /**
   * A conversion-test re-run found this free-tier content -- the very
   * first thing a parent reads, before deciding whether to pay -- was
   * never made age-aware at all, unlike the paid subjects/direction
   * chapters. A 17-year-old's parent nearly bounced on "a maths lesson
   * with blocks often lands better than one on paper" appearing in the
   * free preview. Senior/youngAdult overrides only, since that's where
   * the mismatch is sharpest; early/primary/middle keep the original tip.
   */
  seniorTip?: string;
}

const DOMAINS: DomainDefinition[] = [
  {
    id: "math-logic",
    score: (c) =>
      strengthScore(c, "Mercury") +
      strengthScore(c, "Saturn") * 0.5 +
      (["earth", "air"].includes(fifthHouseElement(c)) ? 1 : 0),
    title: "Mathematics & Logical Reasoning",
    body: (name) =>
      `${name}'s chart favours structured, step-by-step thinking. Numbers, patterns, and puzzles are a promising place to build early confidence.`,
    tip: "Try short daily number games rather than long worksheets — little and often beats marathon sessions.",
    seniorTip: "A short, targeted practice set aimed at the specific gap — not more worksheets overall — tends to move the needle fastest at this stage.",
  },
  {
    id: "language-communication",
    score: (c) =>
      strengthScore(c, "Mercury") +
      strengthScore(c, "Moon") * 0.5 +
      (houseEase(c, 2) - 5) * 0.4,
    title: "Reading, Language & Communication",
    body: (name) =>
      `With good support around speech and expression, ${name} is likely to enjoy stories, vocabulary, and putting thoughts into words.`,
    tip: "Read aloud together daily and let them retell the story in their own words — it builds both memory and confidence.",
    seniorTip: "Reading real articles and essays outside of set texts, then talking through the actual argument, tends to sharpen this further than any one set exercise.",
  },
  {
    id: "creative-arts",
    score: (c) =>
      strengthScore(c, "Venus") +
      (fifthHouseElement(c) === "water" ? 1 : 0) +
      (moonModality(c) === "mutable" ? 0.5 : 0),
    title: "Creative & Artistic Expression",
    body: (name) =>
      `There's a gentle aesthetic sensitivity in this chart. Art, music, or storytelling can give ${name} a joyful, low-pressure way into learning.`,
    tip: "Let creative work be open-ended sometimes — process over product keeps the joy alive.",
    seniorTip: "A genuine creative outlet is still worth protecting real time for at this age, even outside a formal art class — not just treated as a break from 'real' study.",
  },
  {
    id: "science-exploration",
    score: (c) =>
      strengthScore(c, "Jupiter") +
      strengthScore(c, "Mercury") * 0.5 +
      (ascendantModality(c) === "mutable" ? 1 : 0),
    title: "Science & Curious Exploration",
    body: (name) =>
      `A curious, growth-oriented streak stands out here. Hands-on experiments and "why does this happen" questions are likely to hold ${name}'s attention.`,
    tip: "Feed 'why' questions with simple home experiments rather than long explanations — discovery beats lecture.",
    seniorTip: "Following one genuine 'why' question all the way down — a real article, a documentary, an actual rabbit hole — tends to do more here than another set of practice questions.",
  },
  {
    id: "leadership-expression",
    score: (c) => strengthScore(c, "Sun") + strengthScore(c, "Mars") * 0.5,
    title: "Confident Speaking & Leadership",
    body: (name) =>
      `${name}'s chart shows a spark of natural confidence and initiative — group projects, show-and-tell, and small leadership roles can help this shine.`,
    tip: "Give small chances to lead — choosing a family activity or presenting something they made — to build confidence early.",
    seniorTip: "Real responsibility — leading a group project, a part-time role, an actual presentation — tends to build this further now than more practice for its own sake.",
  },
  {
    id: "structured-learning",
    score: (c) =>
      strengthScore(c, "Saturn") +
      (ascendantModality(c) === "fixed" || moonModality(c) === "fixed" ? 1 : 0),
    title: "Structured, Routine-Based Learning",
    body: (name) =>
      `${name} is likely to thrive with clear routines and steady expectations — this chart rewards consistency over intensity.`,
    tip: "A visible daily routine chart can turn structure into something reassuring rather than restrictive.",
    seniorTip: "Whatever routine already works is worth protecting as the workload increases, rather than rebuilding it from scratch just because the subjects have gotten harder.",
  },
  {
    id: "hands-on",
    score: (c) =>
      strengthScore(c, "Mars") + (ascendantElement(c) === "earth" ? 1 : 0),
    title: "Hands-On & Practical Skills",
    body: (name) =>
      `Movement and doing seem to serve ${name} better than sitting and listening. Building, sports, and practical projects are a great channel for focus.`,
    tip: "Let them learn by building or moving — a maths lesson with blocks often lands better than one on paper.",
    seniorTip: "Movement breaks during study sessions — a short walk, a real workout — tend to help focus rather than break it here, even under exam pressure.",
  },
  {
    id: "deep-focus",
    score: (c) => houseEase(c, 9) * 0.6 + strengthScore(c, "Jupiter") * 0.4,
    title: "Deep Focus & Independent Study",
    body: (name) =>
      `Once genuinely interested, ${name} may be capable of real, sustained depth in a chosen subject rather than skimming many topics.`,
    tip: "Let them go deep on one topic they love, even if it looks 'narrow' for a while — depth builds real mastery and confidence.",
    seniorTip: "Protecting real, uninterrupted blocks of time for one subject tends to matter more now than it did at a younger age, when short bursts were enough.",
  },
  {
    id: "social-collaborative",
    score: (c) =>
      strengthScore(c, "Venus") * 0.6 +
      strengthScore(c, "Moon") * 0.4 +
      (moonElement(c) === "air" ? 1 : 0),
    title: "Social & Collaborative Learning",
    body: (name) =>
      `${name} seems likely to learn well alongside others — paired reading, study groups, or teaching a sibling can reinforce what they know.`,
    tip: "Study buddies or family 'teach-back' sessions can make revision feel social rather than solitary.",
    seniorTip: "Study groups and explaining material to a friend stay genuinely useful at this age — not just a younger-kid technique to grow out of.",
  },
];

export function topFocusAreas(
  chart: BirthChart,
  childName: string,
  ageBand: AgeBand,
  count = 3,
): FocusArea[] {
  const isSenior = SENIOR_BANDS.includes(ageBand);
  return [...DOMAINS]
    .map((d) => ({ ...d, computed: d.score(chart) }))
    .sort((a, b) => b.computed - a.computed)
    .slice(0, count)
    .map((d) => ({
      id: d.id,
      title: d.title,
      body: d.body(childName),
      tip: isSenior && d.seniorTip ? d.seniorTip : d.tip,
    }));
}
