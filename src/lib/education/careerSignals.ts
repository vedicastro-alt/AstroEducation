import type { BirthChart } from "../astro/types";
import { computeD10Chart } from "../astro/divisional";
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
 * Classical Vedic astrology doesn't read these the same way either.
 * These weightings were originally reasoned from general principles;
 * several are now revised against "Planets and Education Vol. I" (Naval
 * Singh, ed. K.N. Rao) -- a case-study-based reference specifically on
 * this subject. Its core, repeatedly-stated framework: Sun, Mars, Saturn,
 * Rahu and Ketu behave as "technical" significators (plus any debilitated
 * or retrograde planet, regardless of its usual nature), while Jupiter,
 * Mercury, Venus and Moon are "non-technical" when unafflicted -- with
 * Moon specifically read as chemistry's significator ("dhatu"/mineral,
 * alongside Saturn, Mars, Rahu), Jupiter and Mercury as biology's
 * ("jeeva"/living being), and Sun as mathematics/physics's. Concretely
 * cited combinations used below: medicine wants a 6th/8th/12th house
 * connection plus Ketu ("significator for medical practitioner") and a
 * technically-coloured Jupiter; mathematics is repeatedly tied to the Sun
 * specifically (with Mercury for "mathematical ability" and, per Jaimini
 * Sutras 103-110, Ketu for "a mathematician" specifically); the
 * engineering sub-disciplines split along Mars+Saturn (mechanical),
 * Mars+Saturn+Mercury (civil, "measurement"), Sun+Mars+Saturn
 * (electrical), and Moon+Mars+Saturn (chemical, "watery signs"); the
 * biological sciences split along Jupiter ("Jeeva") with technical
 * planets for microbiology/biotechnology, versus Moon/watery signs for
 * biochemistry. Each field below reads its own weighted mix, so two
 * careers that happen to share a broad stream can still land in
 * genuinely different tiers for the same chart. Unlisted fields fall back
 * to their parent stream's score/essence -- a defensible default, just
 * not a differentiated one.
 *
 * A second source, "Encyclopedia of Vedic Astrology: Your Profession"
 * (Shankar Adawal), contributed three further, more targeted corrections
 * rather than a wholesale rework -- deliberately not folding in every
 * citation it offers (Sun and Saturn recur constantly through its
 * medicine combinations too, but those are already the shared "technical"
 * backbone of the engineering fields above; piling them onto medicine as
 * well would quietly re-collapse the very distinction this file exists
 * to draw). Kept: Rahu is explicitly named alongside Mercury as
 * "associated with medical profession"; Rahu is named specifically for
 * "engineers, profession connected with electricity"; and classical
 * commentary assigns the legal *profession* itself to Mercury, reserving
 * Jupiter for the judge's bench specifically -- the reverse emphasis from
 * what was here before.
 */
type FieldScoreFn = (chart: BirthChart) => number;

/** houseEase is 0..10 (5 = neutral); rescaled to the same roughly zero-centred scale strengthScore uses, so field scores built from a mix of the two stay comparable. */
function h(chart: BirthChart, houseNumber: number): number {
  return houseEase(chart, houseNumber) - 5;
}

const FIELD_SCORES: Record<string, FieldScoreFn> = {
  // 6th/8th/12th house connection (disease/crisis/hospital), Mars
  // (surgery), Jupiter ("Jeev vigyan" -- the science of living beings,
  // when technically coloured), Ketu (repeatedly named across multiple
  // classical sources as "the significator for medical profession"), and
  // a light Rahu term ("Budha and Rahu are also associated with medical
  // profession").
  "Medicine & Health Sciences": (c) =>
    h(c, 6) * 0.35 +
    h(c, 8) * 0.25 +
    h(c, 12) * 0.2 +
    strengthScore(c, "Mars") * 0.35 +
    strengthScore(c, "Jupiter") * 0.35 +
    strengthScore(c, "Ketu") * 0.35 +
    strengthScore(c, "Rahu") * 0.15,
  // A named engineering discipline (mechanical/civil/electrical/chemical)
  // routes to its own entry below; this generic "engineer" reading uses
  // the cross-cutting technical trio (Sun, Mars, Saturn) plus Mercury and
  // the 10th (work) house, which the book notes matters more than the
  // 5th for engineers specifically.
  Engineering: (c) =>
    strengthScore(c, "Sun") * 0.35 +
    strengthScore(c, "Mars") * 0.35 +
    strengthScore(c, "Saturn") * 0.35 +
    strengthScore(c, "Mercury") * 0.25 +
    h(c, 10) * 0.3,
  // Mars (land), Saturn (construction material), Mercury (measurement).
  "Civil Engineering": (c) =>
    strengthScore(c, "Mars") * 0.45 + strengthScore(c, "Saturn") * 0.45 + strengthScore(c, "Mercury") * 0.35 + h(c, 4) * 0.3,
  // Mars and Saturn, plus Sun for the underlying physics.
  "Mechanical Engineering": (c) =>
    strengthScore(c, "Mars") * 0.5 + strengthScore(c, "Saturn") * 0.4 + strengthScore(c, "Sun") * 0.4,
  // Sun, Mars, Saturn for electrical; Mercury for the electronics/signal
  // side specifically; Rahu named explicitly and specifically for
  // "engineers, profession connected with electricity" -- the one
  // engineering sub-discipline that citation points at directly.
  "Electrical & Electronics Engineering": (c) =>
    strengthScore(c, "Sun") * 0.4 +
    strengthScore(c, "Mars") * 0.3 +
    strengthScore(c, "Saturn") * 0.3 +
    strengthScore(c, "Mercury") * 0.3 +
    strengthScore(c, "Rahu") * 0.25,
  // Moon (the book's chemistry significator) leads, Mars and Saturn
  // ("watery signs", the technical/converting-materials side) support.
  "Chemical Engineering": (c) =>
    strengthScore(c, "Moon") * 0.5 + strengthScore(c, "Mars") * 0.35 + strengthScore(c, "Saturn") * 0.35,
  Architecture: (c) =>
    strengthScore(c, "Venus") * 0.55 + strengthScore(c, "Saturn") * 0.35 + strengthScore(c, "Mercury") * 0.3,
  // Jupiter ("Jeeva", living organisms) plus technical planets and
  // Moon/Rahu for the microscopic/chemical-analysis side.
  Microbiology: (c) =>
    strengthScore(c, "Jupiter") * 0.45 +
    strengthScore(c, "Mars") * 0.3 +
    strengthScore(c, "Saturn") * 0.3 +
    strengthScore(c, "Moon") * 0.25 +
    strengthScore(c, "Rahu") * 0.2,
  // Strong Jupiter leads, Saturn/Mars for the applied-technique side,
  // Moon for the chemical-process component.
  Biotechnology: (c) =>
    strengthScore(c, "Jupiter") * 0.5 + strengthScore(c, "Saturn") * 0.35 + strengthScore(c, "Mars") * 0.35 + strengthScore(c, "Moon") * 0.2,
  // Moon leads (the chemistry side), Jupiter secondary (the biology side)
  // -- biochemistry sitting where the two significators meet.
  Biochemistry: (c) => strengthScore(c, "Moon") * 0.5 + strengthScore(c, "Jupiter") * 0.35 + strengthScore(c, "Mars") * 0.2,
  // Sun is the book's repeatedly-cited significator of mathematics
  // specifically (distinct from Mercury's general "mathematical
  // ability"); Ketu per Jaimini Sutras 103-110 ("Ketu... makes one a
  // Mathematician").
  "Mathematics & Statistics": (c) => strengthScore(c, "Sun") * 0.5 + strengthScore(c, "Mercury") * 0.4 + strengthScore(c, "Ketu") * 0.3,
  "Applied Sciences": (c) =>
    strengthScore(c, "Mercury") * 0.4 +
    strengthScore(c, "Jupiter") * 0.35 +
    strengthScore(c, "Mars") * 0.35 +
    (ascendantModality(c) === "mutable" ? 0.5 : 0),
  // Venus is the book's named main significator; 4th/10th house
  // involvement per its cited "PAC link of 2nd/4th/10th houses and
  // Venus" condition.
  "Hotel Management": (c) => strengthScore(c, "Venus") * 0.6 + h(c, 10) * 0.3 + h(c, 4) * 0.2,
  // Classical commentary assigns the legal profession itself to Mercury,
  // reserving Jupiter specifically for the judge's bench -- Mercury leads
  // here accordingly, with Jupiter (and 9th/10th house involvement) as
  // the secondary "how far this could rise" signal rather than the
  // primary one.
  Law: (c) => strengthScore(c, "Mercury") * 0.5 + strengthScore(c, "Jupiter") * 0.35 + h(c, 9) * 0.25 + h(c, 10) * 0.2,
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
  "Civil Engineering": "planning and building the structures and infrastructure people actually live and move through",
  "Mechanical Engineering": "hands-on mechanical problem-solving — building and moving physical systems with real, measurable force behind them",
  "Electrical & Electronics Engineering": "working with the unseen forces — electricity and signal — that make modern systems run",
  "Chemical Engineering": "transforming raw materials into something more useful, at a scale well beyond a lab bench",
  Architecture: "solving structure and aesthetics together — a workable design that also looks right",
  Microbiology: "investigating living systems too small to see, with real scientific rigor",
  Biotechnology: "applying biology and technology together — using living systems as tools to solve real problems",
  Biochemistry: "the chemistry underneath biology — how living things actually work at a molecular level",
  "Mathematics & Statistics": "abstract, structured reasoning for its own sake — patterns, proof, and precision",
  "Applied Sciences": "hands-on scientific exploration — testing an idea against the real world rather than just reasoning about it",
  "Hotel Management": "warm, detail-oriented hospitality — making someone else's experience feel effortless",
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

/**
 * The D10 (Dashamsha) chart per natal BirthChart, computed once and
 * reused -- a single report can ask about several career fields, and
 * every one of them reads the same D10 chart, just different
 * significators within it.
 */
const d10Cache = new WeakMap<BirthChart, BirthChart>();

function d10For(chart: BirthChart): BirthChart {
  let d10 = d10Cache.get(chart);
  if (!d10) {
    d10 = computeD10Chart(chart);
    d10Cache.set(chart, d10);
  }
  return d10;
}

/**
 * A career question is classically read from the natal (D1) chart
 * *and* the Dashamsha (D10) -- the divisional chart specifically for
 * profession -- not from D1 alone. D1 stays primary (0.6) since it's
 * the chart every other chapter in this report is grounded in and its
 * weighting here is already tuned; D10 (0.4) is real additional
 * evidence, not a tie-breaking footnote, so it can and does shift a
 * field's tier when the two disagree.
 */
const D10_WEIGHT = 0.4;

export function fieldScore(chart: BirthChart, fieldName: string, fallback: (chart: BirthChart) => number): number {
  const fn = FIELD_SCORES[fieldName] ?? fallback;
  return fn(chart) * (1 - D10_WEIGHT) + fn(d10For(chart)) * D10_WEIGHT;
}

export function fieldEssence(fieldName: string, fallback: string): string {
  return FIELD_ESSENCE[fieldName] ?? fallback;
}
