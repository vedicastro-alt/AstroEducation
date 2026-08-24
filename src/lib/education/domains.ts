import type { BirthChart } from "../astro/types";
import type { FocusArea } from "./types";
import {
  ascendantElement,
  ascendantModality,
  fifthHouseElement,
  houseEase,
  moonElement,
  moonModality,
  strengthScore,
} from "./scoring";

interface DomainDefinition {
  id: string;
  score: (chart: BirthChart) => number;
  title: string;
  body: (childName: string) => string;
  tip: string;
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
  },
  {
    id: "leadership-expression",
    score: (c) => strengthScore(c, "Sun") + strengthScore(c, "Mars") * 0.5,
    title: "Confident Speaking & Leadership",
    body: (name) =>
      `${name}'s chart shows a spark of natural confidence and initiative — group projects, show-and-tell, and small leadership roles can help this shine.`,
    tip: "Give small chances to lead — choosing a family activity or presenting something they made — to build confidence early.",
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
  },
  {
    id: "hands-on",
    score: (c) =>
      strengthScore(c, "Mars") + (ascendantElement(c) === "earth" ? 1 : 0),
    title: "Hands-On & Practical Skills",
    body: (name) =>
      `Movement and doing seem to serve ${name} better than sitting and listening. Building, sports, and practical projects are a great channel for focus.`,
    tip: "Let them learn by building or moving — a maths lesson with blocks often lands better than one on paper.",
  },
  {
    id: "deep-focus",
    score: (c) => houseEase(c, 9) * 0.6 + strengthScore(c, "Jupiter") * 0.4,
    title: "Deep Focus & Independent Study",
    body: (name) =>
      `Once genuinely interested, ${name} may be capable of real, sustained depth in a chosen subject rather than skimming many topics.`,
    tip: "Let them go deep on one topic they love, even if it looks 'narrow' for a while — depth builds real mastery and confidence.",
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
  },
];

export function topFocusAreas(chart: BirthChart, childName: string, count = 3): FocusArea[] {
  return [...DOMAINS]
    .map((d) => ({ ...d, computed: d.score(chart) }))
    .sort((a, b) => b.computed - a.computed)
    .slice(0, count)
    .map((d) => ({
      id: d.id,
      title: d.title,
      body: d.body(childName),
      tip: d.tip,
    }));
}
