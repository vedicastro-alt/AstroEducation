import type { PlanetKey } from "./constants";
import type { BirthChart } from "./types";

const SPECIAL_ASPECT_OFFSETS: Partial<Record<PlanetKey, number[]>> = {
  Mars: [4, 7, 8],
  Jupiter: [5, 7, 9],
  Saturn: [3, 7, 10],
};

/**
 * Houses a planet casts a drishti (aspect) on, counted from its own house
 * as "1". Every graha casts a full aspect on the 7th house from itself
 * (Parashari drishti); Mars, Jupiter and Saturn additionally cast special
 * aspects. Rahu/Ketu are kept to the universal 7th-house aspect only --
 * traditions disagree on whether they also carry Saturn-like special
 * aspects, so this uses the least controversial, most widely agreed
 * baseline rather than overclaim precision.
 */
function aspectOffsets(planet: PlanetKey): number[] {
  return SPECIAL_ASPECT_OFFSETS[planet] ?? [7];
}

export interface AspectHit {
  from: PlanetKey;
  fromHouse: number;
  toHouse: number;
}

/** Every drishti (aspect) cast in this chart, from-planet to to-house. */
export function allAspects(chart: BirthChart): AspectHit[] {
  const hits: AspectHit[] = [];
  for (const planet of chart.planets) {
    for (const offset of aspectOffsets(planet.key)) {
      const toHouse = ((planet.house - 1 + (offset - 1)) % 12) + 1;
      hits.push({ from: planet.key, fromHouse: planet.house, toHouse });
    }
  }
  return hits;
}

/** Which planets aspect a given house. */
export function aspectsOnHouse(chart: BirthChart, houseNumber: number): PlanetKey[] {
  return allAspects(chart)
    .filter((a) => a.toHouse === houseNumber)
    .map((a) => a.from);
}

/** Which planets aspect a given planet (by aspecting the house it sits in), excluding itself. */
export function aspectsOnPlanet(chart: BirthChart, key: PlanetKey): PlanetKey[] {
  const planet = chart.planets.find((p) => p.key === key);
  if (!planet) return [];
  return aspectsOnHouse(chart, planet.house).filter((p) => p !== key);
}

export interface Conjunction {
  house: number;
  planets: PlanetKey[];
}

/** Groups of 2+ planets sharing a house. */
export function allConjunctions(chart: BirthChart): Conjunction[] {
  const byHouse = new Map<number, PlanetKey[]>();
  for (const p of chart.planets) {
    const list = byHouse.get(p.house) ?? [];
    list.push(p.key);
    byHouse.set(p.house, list);
  }
  return Array.from(byHouse.entries())
    .filter(([, planets]) => planets.length >= 2)
    .map(([house, planets]) => ({ house, planets }));
}

/** The other planet(s), if any, conjunct a given planet (sharing its house). */
export function conjunctionsWith(chart: BirthChart, key: PlanetKey): PlanetKey[] {
  const planet = chart.planets.find((p) => p.key === key);
  if (!planet) return [];
  return chart.planets
    .filter((p) => p.house === planet.house && p.key !== key)
    .map((p) => p.key);
}
