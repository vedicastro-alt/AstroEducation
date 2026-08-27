import type { PlanetKey } from "../astro/constants";
import type { BirthChart } from "../astro/types";
import { aspectsOnPlanet, conjunctionsWith } from "../astro/aspects";
import { BENEFICS, MALEFICS, dignityTier, planetByKey, signPhrase } from "./scoring";

export type Tier = "flourishing" | "steady" | "growing";

/** Buckets a placement-strength score into a narrative tier. */
export function tierFromScore(score: number): Tier {
  if (score >= 2) return "flourishing";
  if (score <= -2) return "growing";
  return "steady";
}

/**
 * Deterministic index into a fixed-size list of phrasing variants, driven
 * by a chart-specific continuous value (e.g. a planet's exact degree
 * within its sign). The same chart always renders the same variant, but
 * charts spread naturally across the available options rather than every
 * chart in a tier reading identically.
 */
export function pickIndex(seed: number, optionCount: number): number {
  const scaled = Math.floor(Math.abs(seed) * 97);
  return scaled % optionCount;
}

/** "A", "A and B", or "A, B and C" -- avoids the "A and B and C" repeated-and bug. */
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/**
 * A rich, chart-specific placement citation for a planet: sign, dignity,
 * house, and any conjunction/aspect worth naming. This is the detail that
 * makes two children who merely share a lead planet's sign still read
 * differently once house, dignity, and drishti are accounted for.
 */
export function citePlacement(chart: BirthChart, key: PlanetKey): string {
  const planet = planetByKey(chart, key);
  const dignity = dignityTier(chart, key);
  const sign = signPhrase(chart, key);

  let dignityClause = "";
  if (dignity === "exalted") {
    dignityClause = " — exalted here, about as strong a placement as this planet gets";
  } else if (dignity === "own") {
    dignityClause = " — in its own sign, a comfortable and stable placement";
  } else if (dignity === "debilitated") {
    dignityClause = " — a debilitated placement, its natural qualities needing more support to come through";
  }

  let sentence = `${key} sits in ${sign} in the ${ordinal(planet.house)} house${dignityClause}`;

  const conjunct = conjunctionsWith(chart, key);
  if (conjunct.length > 0) {
    sentence += `, conjunct ${joinList(conjunct)}`;
  }

  const aspectors = aspectsOnPlanet(chart, key).filter((a) => !conjunct.includes(a));
  const beneficAspectors = aspectors.filter((a) => BENEFICS.includes(a));
  const maleficAspectors = aspectors.filter((a) => MALEFICS.includes(a));
  if (beneficAspectors.length > 0) {
    sentence += `, and receives a steadying aspect from ${joinList(beneficAspectors)}`;
  } else if (maleficAspectors.length > 0) {
    sentence += `, under some pressure from ${joinList(maleficAspectors)}'s aspect`;
  }

  return sentence + ".";
}

/** Short note about drishti landing on a house itself, independent of who occupies it. */
export function houseAspectNote(beneficHit: boolean, maleficHit: boolean): string {
  if (beneficHit) return " The house itself also receives a supportive aspect.";
  if (maleficHit) return " The house itself is also under some pressure from a challenging aspect.";
  return "";
}
