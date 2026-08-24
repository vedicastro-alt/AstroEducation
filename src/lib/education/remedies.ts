import type { BirthChart } from "../astro/types";
import type { PlanetKey } from "../astro/constants";
import { strengthScore } from "./scoring";

/**
 * Deliberately simple, low-cost, optional traditions -- a supportive
 * color, a day of the week, one small object, and one small habit. No
 * gemstones, no expensive items, nothing prescriptive: these are framed
 * throughout as small things some families enjoy trying, not
 * requirements, in keeping with "simple and gentle."
 */
interface RemedyDefinition {
  theme: string;
  body: (name: string) => string;
}

const REMEDIES: Record<Exclude<PlanetKey, "Rahu" | "Ketu">, RemedyDefinition> = {
  Sun: {
    theme: "confidence and a settled sense of self",
    body: (name) =>
      `The Sun governs confidence and vitality. A touch of orange or gold — a folder, a pencil case, a hair tie — is a small, traditional way some families like to support it, especially on Sundays, the Sun's day. A few minutes of morning light before ${name} sits down to study, even just by an open window, is the gentler version of the same idea: a small, steady ritual that says the day has begun on their own terms.`,
  },
  Moon: {
    theme: "emotional steadiness and comfort",
    body: (name) =>
      `The Moon governs mood and comfort. White or soft cream tones, and a small bowl of water or a fresh flower somewhere ${name} studies, are traditional nods to a settled Moon — worth trying on Mondays in particular. More practically: a calm, unhurried wind-down before bed does the same job in modern terms, giving the mind a clear stop to the day rather than carrying it into sleep.`,
  },
  Mars: {
    theme: "energy and healthy drive",
    body: (name) =>
      `Mars governs energy and courage. A small red or coral object on the desk — a pen, a folder corner, a sticker — is the traditional gesture, best introduced on a Tuesday, Mars's day. The more useful version day to day: real physical movement (a run around the garden, a few minutes of stretching) before ${name} sits down to study tends to settle restless energy far better than asking for stillness first.`,
  },
  Mercury: {
    theme: "clear thinking and communication",
    body: (name) =>
      `Mercury governs intellect and communication. A small green plant on ${name}'s study table is a gentle, living nod to Mercury, especially if placed or refreshed on a Wednesday. Reading a page aloud before writing about it is a lovely modern equivalent — it engages the same quick, verbal part of the mind Mercury is said to govern.`,
  },
  Jupiter: {
    theme: "wisdom, optimism, and guidance",
    body: (name) =>
      `Jupiter governs wisdom and growth. Yellow or gold touches — a notebook cover, a highlighter, a cushion in their reading corner — are traditional here, particularly on Thursdays. Just as fitting: a few minutes with a trusted mentor, teacher, or a favourite story before ${name} tackles a harder subject tends to bring the same expansive, encouraged feeling Jupiter is said to bring.`,
  },
  Venus: {
    theme: "creativity, harmony, and connection",
    body: (name) =>
      `Venus governs creativity and harmony. Soft pastels or white in ${name}'s space, especially refreshed on a Friday, are the traditional gesture. Just as meaningful: displaying something they made or chose themselves nearby, and a little creative play before or after study time, both feed the same gentle, expressive part of a Venus-supported routine.`,
  },
  Saturn: {
    theme: "patience, structure, and follow-through",
    body: (name) =>
      `Saturn governs discipline and staying power. A simple, tidy, dedicated study spot — kept clear of clutter — is the traditional nod here, and Saturday is considered its day for small resets, like tidying that space together with ${name}. The daily version: a short, consistent routine, even just ten steady minutes, tends to build follow-through far better than long, irregular sessions.`,
  },
};

export interface GentleRemedy {
  id: string;
  planet: string;
  theme: string;
  body: string;
}

const CLASSICAL_PLANETS: Exclude<PlanetKey, "Rahu" | "Ketu">[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

export function buildGentleRemedies(
  chart: BirthChart,
  childName: string,
  count = 3,
): GentleRemedy[] {
  const ranked = CLASSICAL_PLANETS.map((planet) => ({
    planet,
    score: strengthScore(chart, planet),
  })).sort((a, b) => a.score - b.score);

  return ranked.slice(0, count).map(({ planet }) => {
    const remedy = REMEDIES[planet];
    return {
      id: planet.toLowerCase(),
      planet,
      theme: remedy.theme,
      body: remedy.body(childName),
    };
  });
}
