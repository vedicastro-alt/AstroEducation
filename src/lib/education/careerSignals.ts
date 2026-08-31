import type { BirthChart } from "../astro/types";
import { ascendantModality, houseEase, strengthScore } from "./scoring";

/**
 * Field-level significators, distinct from the coarse four-way STEM /
 * humanities / arts / practical stream score used for the broad
 * "Direction" chapter. That chapter's grouping is fine for a general
 * "which of four wide directions" read, but a parent asking about a
 * specific career caught the real gap in reusing it for that: Medicine,
 * Engineering, and Architecture all sat under one shared Mercury-heavy
 * "STEM" score, so two very different careers landed the same verdict --
 * "medicine and mathematics is predicted for almost everyone."
 *
 * Classical Vedic astrology doesn't read these the same way either:
 * medicine leans on the 6th house (disease/healing/service) and Mars
 * (surgery, decisive action), engineering leans on Mercury and Saturn
 * (logic plus structural discipline), and so on. Each field below reads
 * its own weighted mix of planets/houses, so two careers that happen to
 * share a broad stream can still land in genuinely different tiers for
 * the same chart. Unlisted fields fall back to their parent stream's
 * score/essence -- a defensible default, just not a differentiated one.
 */
type FieldScoreFn = (chart: BirthChart) => number;

/** houseEase is 0..10 (5 = neutral); rescaled to the same roughly zero-centred scale strengthScore uses, so field scores built from a mix of the two stay comparable. */
function h(chart: BirthChart, houseNumber: number): number {
  return houseEase(chart, houseNumber) - 5;
}

const FIELD_SCORES: Record<string, FieldScoreFn> = {
  "Medicine & Health Sciences": (c) =>
    h(c, 6) * 0.7 + strengthScore(c, "Mars") * 0.4 + strengthScore(c, "Jupiter") * 0.4,
  Engineering: (c) =>
    strengthScore(c, "Mercury") * 0.5 + strengthScore(c, "Saturn") * 0.5 + strengthScore(c, "Mars") * 0.3,
  Architecture: (c) =>
    strengthScore(c, "Venus") * 0.55 + strengthScore(c, "Saturn") * 0.35 + strengthScore(c, "Mercury") * 0.3,
  "Applied Sciences": (c) =>
    strengthScore(c, "Mercury") * 0.4 +
    strengthScore(c, "Jupiter") * 0.35 +
    strengthScore(c, "Mars") * 0.35 +
    (ascendantModality(c) === "mutable" ? 0.5 : 0),
  Law: (c) => strengthScore(c, "Jupiter") * 0.5 + h(c, 9) * 0.4 + strengthScore(c, "Mercury") * 0.3,
  "Journalism & Media": (c) => strengthScore(c, "Mercury") * 0.6 + strengthScore(c, "Moon") * 0.4,
  Education: (c) => strengthScore(c, "Jupiter") * 0.6 + strengthScore(c, "Moon") * 0.4,
  Psychology: (c) => strengthScore(c, "Moon") * 0.6 + strengthScore(c, "Jupiter") * 0.35,
  "Public Policy": (c) =>
    strengthScore(c, "Jupiter") * 0.45 + strengthScore(c, "Sun") * 0.35 + strengthScore(c, "Mercury") * 0.3,
  "Design (graphic, product, UX)": (c) => strengthScore(c, "Venus") * 0.7 + strengthScore(c, "Mercury") * 0.25,
  "Media & Film": (c) =>
    strengthScore(c, "Venus") * 0.45 + strengthScore(c, "Moon") * 0.35 + strengthScore(c, "Sun") * 0.25,
  Music: (c) => strengthScore(c, "Venus") * 0.5 + strengthScore(c, "Moon") * 0.5,
  "Creative Writing & Marketing": (c) =>
    strengthScore(c, "Mercury") * 0.4 + strengthScore(c, "Venus") * 0.35 + strengthScore(c, "Moon") * 0.25,
  "Skilled Trades & Vocational Careers": (c) => strengthScore(c, "Mars") * 0.7 + strengthScore(c, "Saturn") * 0.3,
  "Sports, Coaching & Physical Therapy": (c) => strengthScore(c, "Mars") * 0.7 + strengthScore(c, "Sun") * 0.3,
  "Culinary Arts": (c) => strengthScore(c, "Venus") * 0.5 + strengthScore(c, "Mars") * 0.35,
  "Hands-on Entrepreneurship": (c) => strengthScore(c, "Sun") * 0.5 + strengthScore(c, "Mars") * 0.4,
};

const FIELD_ESSENCE: Record<string, string> = {
  "Medicine & Health Sciences":
    "healing and hands-on care of others — steady judgement under pressure and a genuine service instinct",
  Engineering: "building and fixing structured systems so they reliably hold up under real-world use",
  Architecture: "solving structure and aesthetics together — a workable design that also looks right",
  "Applied Sciences": "hands-on scientific exploration — testing an idea against the real world rather than just reasoning about it",
  Law: "argument, judgement, and a feel for fairness and process",
  "Journalism & Media": "finding out what's true and communicating it clearly and fast",
  Education: "patient mentorship — helping someone else's understanding click",
  Psychology: "reading what's beneath the surface of how people think and feel",
  "Public Policy": "weighing competing interests and making a public case for a decision",
  "Design (graphic, product, UX)": "a strong, practiced eye for how something should look and feel to use",
  "Media & Film": "visual storytelling with a real emotional pull",
  Music: "rhythm, melody, and emotional expression through sound",
  "Creative Writing & Marketing": "shaping language so it moves people, not just informs them",
  "Skilled Trades & Vocational Careers": "hands-on technical skill that solves a real, physical problem",
  "Sports, Coaching & Physical Therapy": "physical drive and discipline, and helping others build the same",
  "Culinary Arts": "hands-on craft with a real aesthetic and sensory sense",
  "Hands-on Entrepreneurship": "initiative and the drive to act on an idea directly, not just plan it",
};

export function fieldScore(chart: BirthChart, fieldName: string, fallback: (chart: BirthChart) => number): number {
  return FIELD_SCORES[fieldName]?.(chart) ?? fallback(chart);
}

export function fieldEssence(fieldName: string, fallback: string): string {
  return FIELD_ESSENCE[fieldName] ?? fallback;
}
