import type { PlanetKey } from "../astro/constants";
import type { BirthChart } from "../astro/types";
import {
  DUSTHANA_HOUSES,
  KENDRA_HOUSES,
  SIGN_LORDS,
  TRIKONA_HOUSES,
  dignityOf,
  elementOf,
  modalityOf,
  type Element,
  type Modality,
} from "../astro/dignity";

export function planetByKey(chart: BirthChart, key: PlanetKey) {
  const planet = chart.planets.find((p) => p.key === key);
  if (!planet) throw new Error(`Missing planet ${key}`);
  return planet;
}

/** A rough -4..+6 dignity-and-placement strength score for a planet. */
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
  return score;
}

export function houseSignIndex(chart: BirthChart, houseNumber: number): number {
  return (chart.ascendant.index + houseNumber - 1) % 12;
}

export function houseLord(chart: BirthChart, houseNumber: number): PlanetKey {
  return SIGN_LORDS[houseSignIndex(chart, houseNumber)];
}

/** 0..10 ease score for a house, driven by its lord's dignity and placement. */
export function houseEase(chart: BirthChart, houseNumber: number): number {
  const lord = houseLord(chart, houseNumber);
  const raw = strengthScore(chart, lord);
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
