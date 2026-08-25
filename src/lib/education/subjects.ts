import type { BirthChart } from "../astro/types";
import type { PlanetKey } from "../astro/constants";
import {
  ascendantElement,
  ascendantModality,
  fifthHouseElement,
  houseEase,
  signPhrase,
  strengthScore,
} from "./scoring";
import type { SubjectResult } from "./types";

interface SubjectDefinition {
  id: string;
  name: string;
  score: (chart: BirthChart) => number;
  /** The single planet this subject's read is anchored to, for citation. */
  leadPlanet: PlanetKey;
  inclined: (name: string, sign: string) => { body: string; tip: string };
  support: (name: string, sign: string) => { body: string; tip: string };
}

const SUBJECTS: SubjectDefinition[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    score: (c) =>
      strengthScore(c, "Mercury") +
      strengthScore(c, "Saturn") * 0.5 +
      (["earth", "air"].includes(fifthHouseElement(c)) ? 1 : 0),
    leadPlanet: "Mercury",
    inclined: (name, sign) => ({
      body: `With Mercury in ${sign}, word problems, patterns, and step-by-step logic puzzles are likely to come more naturally to ${name} than you'd expect — the reasoning behind a method tends to interest them more than the method itself.`,
      tip: "Even when the reasoning is strong, rote drills (times tables, quick recall) may still need real repetition — that's a separate skill from the logic itself.",
    }),
    support: (name, sign) => ({
      body: `Mercury in ${sign} suggests straight arithmetic and memorised procedures — times tables, long division, formula recall — may take more repetition to stick for ${name}, even when their underlying reasoning is sound.`,
      tip: "Physical objects, drawings, or real-world stand-ins (splitting a pizza, counting change) tend to unlock understanding faster than a worksheet alone.",
    }),
  },
  {
    id: "reading-language",
    name: "Reading, Writing & Language Arts",
    score: (c) =>
      strengthScore(c, "Mercury") +
      strengthScore(c, "Moon") * 0.5 +
      (houseEase(c, 2) - 5) * 0.4,
    leadPlanet: "Mercury",
    inclined: (name, sign) => ({
      body: `Mercury, the planet of language, sits in ${sign} — ${name} is likely to enjoy reading beyond what's assigned, and to write with a natural, expressive voice once they're genuinely interested in the topic.`,
      tip: "Journaling or writing about something they already love (a hobby, a pet, a game) tends to produce their best, most fluent writing.",
    }),
    support: (name, sign) => ({
      body: `With Mercury in ${sign}, the mechanics of writing — spelling, grammar, getting an idea onto the page — may need more patience than the ideas themselves for ${name}, who may have plenty to say and find the writing-it-down part harder.`,
      tip: "Let them talk an idea through out loud first, even record it, before writing it down — it closes the gap between thought and page.",
    }),
  },
  {
    id: "science",
    name: "Science",
    score: (c) =>
      strengthScore(c, "Jupiter") +
      strengthScore(c, "Mercury") * 0.5 +
      (ascendantModality(c) === "mutable" ? 1 : 0),
    leadPlanet: "Jupiter",
    inclined: (name, sign) => ({
      body: `Jupiter in ${sign} tends to bring a hands-on curiosity — experiments, "why does this happen" questions, and nature-based exploration are likely to hold ${name}'s attention far longer than a textbook chapter.`,
      tip: "Biology and environmental science (living things, ecosystems) often land especially well before adolescence; physics and chemistry tend to click better once abstract thinking matures in the early teens.",
    }),
    support: (name, sign) => ({
      body: `With Jupiter in ${sign}, abstract scientific ideas — invisible forces, chemical formulas, atomic structure — may need to be made concrete before they click for ${name}.`,
      tip: "Models, videos, and real demonstrations do far more here than diagrams in a textbook; there's no rush, scientific thinking tends to run deep once it takes hold.",
    }),
  },
  {
    id: "history-social",
    name: "History & Social Studies",
    score: (c) =>
      strengthScore(c, "Jupiter") * 0.6 +
      strengthScore(c, "Moon") * 0.4 +
      (houseEase(c, 9) - 5) * 0.3,
    leadPlanet: "Jupiter",
    inclined: (name, sign) => ({
      body: `Jupiter in ${sign}, the chart's teacher and wisdom-seeker, points ${name} toward history and social studies through people and story rather than dates and facts — a natural curiosity about "why things are the way they are" often shows up here.`,
      tip: "Biographies, historical fiction, and 'what was it like to live then' framing tend to work better than a timeline of names and dates.",
    }),
    support: (name, sign) => ({
      body: `With Jupiter in ${sign}, memorising dates, names, and sequences of events in isolation may feel dry and hard to hold onto for ${name}.`,
      tip: "Anchor facts to a story, a documentary, or a family connection ('this is around when your grandparents were born') — it tends to stick far better than flashcards.",
    }),
  },
  {
    id: "computer-science",
    name: "Computer Science & Coding",
    score: (c) =>
      strengthScore(c, "Mercury") * 0.6 +
      strengthScore(c, "Saturn") * 0.4 +
      strengthScore(c, "Rahu") * 0.3,
    leadPlanet: "Mercury",
    inclined: (name, sign) => ({
      body: `With Mercury in ${sign}, there's a good chance ${name} takes to the step-by-step, trial-and-error logic of coding and building things digitally — it rewards exactly the patient problem-solving this placement tends to support.`,
      tip: "Simple visual, game-like coding tools (Scratch and similar) are a great low-pressure entry point at this age, well before text-based code.",
    }),
    support: (name, sign) => ({
      body: `Mercury in ${sign} suggests the abstract, symbolic side of programming — syntax, debugging an error you can't see — may be genuinely frustrating for ${name} without a lot of hands-on guidance at first.`,
      tip: "Start with visual, game-like tools rather than text-based code; early frustration fades quickly once the logic clicks through play.",
    }),
  },
  {
    id: "visual-arts",
    name: "Visual Arts & Design",
    score: (c) =>
      strengthScore(c, "Venus") + (fifthHouseElement(c) === "water" ? 1 : 0),
    leadPlanet: "Venus",
    inclined: (name, sign) => ({
      body: `Venus in ${sign} points toward art, design, and hands-on making as a genuine source of joy and confidence for ${name}, not just a break from "real" schoolwork.`,
      tip: "Open-ended projects (build something, design something) bring out their best work — resist the urge to grade or correct these too closely.",
    }),
    support: (name, sign) => ({
      body: `With Venus in ${sign}, art may not come as naturally or confidently to ${name} as other areas, and that's completely fine — it doesn't need to be a strength to be worthwhile.`,
      tip: "Frame it as play rather than performance — there's no 'right' way to do it — and it stays enjoyable even if it's never where their talent lies.",
    }),
  },
  {
    id: "music",
    name: "Music",
    score: (c) => strengthScore(c, "Venus") * 0.5 + strengthScore(c, "Moon") * 0.5,
    leadPlanet: "Venus",
    inclined: (name, sign) => ({
      body: `Venus in ${sign} suggests a natural feel for rhythm, melody, or emotional expression through sound.`,
      tip: "Even informal exposure — singing along, a simple instrument, clapping out rhythms — is likely to be picked up with real ease.",
    }),
    support: (name, sign) => ({
      body: `With Venus in ${sign}, formal music training — reading notation, structured practice — may need more patience from ${name} than a natural feel for music would suggest.`,
      tip: "Keep early music experiences playful and low-stakes; that does more good than starting formal lessons before they're ready.",
    }),
  },
  {
    id: "public-speaking",
    name: "Public Speaking, Drama & Leadership",
    score: (c) =>
      strengthScore(c, "Sun") + strengthScore(c, "Mars") * 0.5 + (houseEase(c, 2) - 5) * 0.3,
    leadPlanet: "Sun",
    inclined: (name, sign) => ({
      body: `The Sun in ${sign} tends to bring a wish to be heard — a class presentation or small stage moment can become a genuine source of pride rather than nerves for ${name}.`,
      tip: "Give low-stakes chances to lead — explaining a game's rules to a friend, presenting a school project — it builds this early.",
    }),
    support: (name, sign) => ({
      body: `With the Sun in ${sign}, speaking up in front of a group may not come easily to ${name} at first, and that's worth respecting rather than pushing past too quickly.`,
      tip: "Start with a small, familiar audience (family, one close friend) before a classroom of peers — it builds real confidence rather than anxiety.",
    }),
  },
  {
    id: "physical-education",
    name: "Physical Education & Sports",
    score: (c) =>
      strengthScore(c, "Mars") +
      (["earth", "fire"].includes(ascendantElement(c)) ? 1 : 0),
    leadPlanet: "Mars",
    inclined: (name, sign) => ({
      body: `Mars in ${sign} points to physical activity as a genuine strength and outlet for ${name}, not just recess — it can build real confidence that carries over into the classroom.`,
      tip: "Movement breaks during homework time will likely help focus, not hurt it — don't be afraid to let them fidget or pace while thinking.",
    }),
    support: (name, sign) => ({
      body: `With Mars in ${sign}, structured sport — rules, coordination, competition — may take more patience for ${name} to enjoy than free play does.`,
      tip: "Unstructured active play (biking, climbing, dancing around the living room) is just as valuable at this age, and keeps the door open for structured sport later.",
    }),
  },
];

export interface SubjectGuidance {
  inclined: SubjectResult[];
  support: SubjectResult[];
}

export function buildSubjectGuidance(
  chart: BirthChart,
  childName: string,
): SubjectGuidance {
  const ranked = SUBJECTS.map((s) => ({ subject: s, score: s.score(chart) })).sort(
    (a, b) => b.score - a.score,
  );

  const inclined = ranked.slice(0, 4).map(({ subject }) => {
    const sign = signPhrase(chart, subject.leadPlanet);
    const copy = subject.inclined(childName, sign);
    return { id: subject.id, name: subject.name, body: copy.body, tip: copy.tip };
  });

  const support = ranked
    .slice(-3)
    .reverse()
    .map(({ subject }) => {
      const sign = signPhrase(chart, subject.leadPlanet);
      const copy = subject.support(childName, sign);
      return { id: subject.id, name: subject.name, body: copy.body, tip: copy.tip };
    });

  return { inclined, support };
}

export { SUBJECTS };
