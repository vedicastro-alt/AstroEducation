import type { PlanetKey } from "./constants";

export const SIGN_LORDS: PlanetKey[] = [
  "Mars", // Mesha
  "Venus", // Vrishabha
  "Mercury", // Mithuna
  "Moon", // Karka
  "Sun", // Simha
  "Mercury", // Kanya
  "Venus", // Tula
  "Mars", // Vrishchika
  "Jupiter", // Dhanu
  "Saturn", // Makara
  "Saturn", // Kumbha
  "Jupiter", // Meena
];

export const EXALTATION_SIGN: Partial<Record<PlanetKey, number>> = {
  Sun: 0,
  Moon: 1,
  Mars: 9,
  Mercury: 5,
  Jupiter: 3,
  Venus: 11,
  Saturn: 6,
  Rahu: 2,
  Ketu: 8,
};

export const DEBILITATION_SIGN: Partial<Record<PlanetKey, number>> = {
  Sun: 6,
  Moon: 7,
  Mars: 3,
  Mercury: 11,
  Jupiter: 9,
  Venus: 5,
  Saturn: 0,
  Rahu: 8,
  Ketu: 2,
};

export const OWN_SIGNS: Partial<Record<PlanetKey, number[]>> = {
  Sun: [4],
  Moon: [3],
  Mars: [0, 7],
  Mercury: [2, 5],
  Jupiter: [8, 11],
  Venus: [1, 6],
  Saturn: [9, 10],
};

export type Dignity = "exalted" | "own" | "debilitated" | "neutral";

export function dignityOf(planet: PlanetKey, rashiIndex: number): Dignity {
  if (EXALTATION_SIGN[planet] === rashiIndex) return "exalted";
  if (DEBILITATION_SIGN[planet] === rashiIndex) return "debilitated";
  if (OWN_SIGNS[planet]?.includes(rashiIndex)) return "own";
  return "neutral";
}

export const KENDRA_HOUSES = [1, 4, 7, 10];
export const TRIKONA_HOUSES = [1, 5, 9];
export const DUSTHANA_HOUSES = [6, 8, 12];

export type Element = "fire" | "earth" | "air" | "water";
export type Modality = "cardinal" | "fixed" | "mutable";

const ELEMENTS: Element[] = [
  "fire",
  "earth",
  "air",
  "water",
  "fire",
  "earth",
  "air",
  "water",
  "fire",
  "earth",
  "air",
  "water",
];

const MODALITIES: Modality[] = [
  "cardinal",
  "fixed",
  "mutable",
  "cardinal",
  "fixed",
  "mutable",
  "cardinal",
  "fixed",
  "mutable",
  "cardinal",
  "fixed",
  "mutable",
];

export function elementOf(rashiIndex: number): Element {
  return ELEMENTS[rashiIndex];
}

export function modalityOf(rashiIndex: number): Modality {
  return MODALITIES[rashiIndex];
}
