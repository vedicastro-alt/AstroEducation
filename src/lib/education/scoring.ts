import type { PlanetKey } from "../astro/constants";
import type { BirthChart } from "../astro/types";
import { aspectsOnHouse, aspectsOnPlanet, conjunctionsWith } from "../astro/aspects";
import {
  DUSTHANA_HOUSES,
  KENDRA_HOUSES,
  SIGN_LORDS,
  TRIKONA_HOUSES,
  dignityOf,
  elementOf,
  modalityOf,
  type Dignity,
  type Element,
  type Modality,
} from "../astro/dignity";

export function planetByKey(chart: BirthChart, key: PlanetKey) {
  const planet = chart.planets.find((p) => p.key === key);
  if (!planet) throw new Error(`Missing planet ${key}`);
  return planet;
}

/** "{rashi name} ({rashi english})" for a planet -- a real, chart-specific citation. */
export function signPhrase(chart: BirthChart, key: PlanetKey): string {
  const p = planetByKey(chart, key);
  return `${p.rashi.name} (${p.rashi.english})`;
}

export const BENEFICS: PlanetKey[] = ["Jupiter", "Venus", "Mercury", "Moon"];
export const MALEFICS: PlanetKey[] = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"];

export function dignityTier(chart: BirthChart, key: PlanetKey): Dignity {
  const planet = planetByKey(chart, key);
  return dignityOf(key, planet.rashi.index);
}

/** Net benefic/malefic pull of the planets aspecting (drishti on) this planet's house. */
export function aspectNudge(chart: BirthChart, key: PlanetKey): number {
  return aspectsOnPlanet(chart, key).reduce((sum, from) => {
    if (BENEFICS.includes(from)) return sum + 0.5;
    if (MALEFICS.includes(from)) return sum - 0.5;
    return sum;
  }, 0);
}

/** Net benefic/malefic pull of any planet(s) conjunct (sharing a house with) this planet. */
export function conjunctionNudge(chart: BirthChart, key: PlanetKey): number {
  return conjunctionsWith(chart, key).reduce((sum, partner) => {
    if (BENEFICS.includes(partner)) return sum + 0.5;
    if (MALEFICS.includes(partner)) return sum - 0.5;
    return sum;
  }, 0);
}

/** Net benefic/malefic pull of drishti landing directly on a house (regardless of who occupies it). */
export function houseAspectNudge(chart: BirthChart, houseNumber: number): number {
  return aspectsOnHouse(chart, houseNumber).reduce((sum, from) => {
    if (BENEFICS.includes(from)) return sum + 0.4;
    if (MALEFICS.includes(from)) return sum - 0.3;
    return sum;
  }, 0);
}

/**
 * A dignity, house, aspect and conjunction-aware placement-strength score
 * for a planet. Roughly -6..+8: dignity contributes the widest swing,
 * house placement (kendra/trikona vs. dusthana) and drishti/conjunction
 * from benefics or malefics nudge it further either way -- two planets in
 * the same sign and house can still score differently depending on what
 * aspects or sits with them.
 */
export function strengthScore(chart: BirthChart, key: PlanetKey): number {
  const planet = planetByKey(chart, key);
  const dignity = dignityOf(key, planet.rashi.index);
  let score = 0;
  if (dignity === "exalted") score += 3;
  else if (dignity === "own") score += 2;
  else if (dignity === "debilitated") score -= 3;

  if (KENDRA_HOUSES.includes(planet.house) || TRIKONA_HOUSES.includes(planet.house)) {
    score += 1;
  }
  if (DUSTHANA_HOUSES.includes(planet.house)) {
    score -= 1;
  }

  score += aspectNudge(chart, key);
  score += conjunctionNudge(chart, key);

  return score;
}

export function houseSignIndex(chart: BirthChart, houseNumber: number): number {
  return (chart.ascendant.index + houseNumber - 1) % 12;
}

export function houseLord(chart: BirthChart, houseNumber: number): PlanetKey {
  return SIGN_LORDS[houseSignIndex(chart, houseNumber)];
}

/**
 * 0..10 ease score for a house, driven by its lord's placement strength
 * plus any drishti (aspect) landing directly on the house itself, from
 * any planet -- a benefic gazing on a house is classically significant
 * even when it isn't that house's lord.
 */
export function houseEase(chart: BirthChart, houseNumber: number): number {
  const lord = houseLord(chart, houseNumber);
  const raw = strengthScore(chart, lord) + houseAspectNudge(chart, houseNumber);
  return Math.min(10, Math.max(0, 5 + raw));
}

export function planetsInHouse(chart: BirthChart, houseNumber: number): PlanetKey[] {
  return chart.planets
    .filter((p) => p.house === houseNumber)
    .map((p) => p.key);
}

export function ascendantElement(chart: BirthChart): Element {
  return elementOf(chart.ascendant.index);
}

export function ascendantModality(chart: BirthChart): Modality {
  return modalityOf(chart.ascendant.index);
}

export function moonElement(chart: BirthChart): Element {
  return elementOf(planetByKey(chart, "Moon").rashi.index);
}

export function moonModality(chart: BirthChart): Modality {
  return modalityOf(planetByKey(chart, "Moon").rashi.index);
}

export function fifthHouseElement(chart: BirthChart): Element {
  return elementOf(houseSignIndex(chart, 5));
}
