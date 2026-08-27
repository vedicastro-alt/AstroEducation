import type { PlanetKey } from "./constants";
import type { BirthChart } from "./types";
import { KENDRA_HOUSES, SIGN_LORDS, TRIKONA_HOUSES, dignityOf } from "./dignity";

export type YogaId = "gajakesari" | "budhaAditya" | "saraswati" | "neechaBhanga";

export interface YogaHit {
  id: YogaId;
  /** The planet(s) this yoga is anchored to, for citation. */
  planets: PlanetKey[];
}

function findPlanet(chart: BirthChart, key: PlanetKey) {
  return chart.planets.find((p) => p.key === key);
}

/** True if houseA and houseB are a kendra (1st/4th/7th/10th) apart from each other, counted either direction. */
function isKendraApart(houseA: number, houseB: number): boolean {
  const diff = ((houseB - houseA) % 12 + 12) % 12;
  return diff === 0 || diff === 3 || diff === 6 || diff === 9;
}

/**
 * Gajakesari Yoga: Jupiter in a kendra (including conjunction) from the
 * Moon. One of the best-known yogas for a bright, quick mind -- kept here
 * to its simplest, least-disputed form (kendra relationship, Jupiter not
 * debilitated), rather than the many additional strength conditions some
 * texts add.
 */
function detectGajakesari(chart: BirthChart): YogaHit | null {
  const moon = findPlanet(chart, "Moon");
  const jupiter = findPlanet(chart, "Jupiter");
  if (!moon || !jupiter) return null;
  if (dignityOf("Jupiter", jupiter.rashi.index) === "debilitated") return null;
  if (!isKendraApart(moon.house, jupiter.house)) return null;
  return { id: "gajakesari", planets: ["Moon", "Jupiter"] };
}

/**
 * Budha-Aditya Yoga: Sun and Mercury conjunct (same house). Classically
 * associated with sharp intellect and administrative ability -- a natural
 * fit for a learning-focused reading.
 */
function detectBudhaAditya(chart: BirthChart): YogaHit | null {
  const sun = findPlanet(chart, "Sun");
  const mercury = findPlanet(chart, "Mercury");
  if (!sun || !mercury) return null;
  if (sun.house !== mercury.house) return null;
  return { id: "budhaAditya", planets: ["Sun", "Mercury"] };
}

/**
 * Saraswati Yoga: Mercury, Jupiter and Venus each individually placed in a
 * kendra (1/4/7/10) or trikona (1/5/9) house from the ascendant. One of
 * several classical formulations of this yoga (some add further
 * conditions); this is the simplest, most commonly cited version --
 * associated with learning, eloquence, and the arts.
 */
function detectSaraswati(chart: BirthChart): YogaHit | null {
  const keys: PlanetKey[] = ["Mercury", "Jupiter", "Venus"];
  const goodHouses = new Set([...KENDRA_HOUSES, ...TRIKONA_HOUSES]);
  for (const key of keys) {
    const planet = findPlanet(chart, key);
    if (!planet || !goodHouses.has(planet.house)) return null;
  }
  return { id: "saraswati", planets: keys };
}

/**
 * Neecha Bhanga (debilitation cancellation): for a debilitated planet, if
 * the lord of the sign it's debilitated in is itself placed in a kendra
 * from the ascendant, the debilitation is classically considered
 * significantly softened. Several cancellation rules exist across texts;
 * this uses the single most commonly cited one rather than compounding
 * several disputed conditions.
 */
function detectNeechaBhanga(chart: BirthChart): YogaHit[] {
  const hits: YogaHit[] = [];
  for (const planet of chart.planets) {
    if (dignityOf(planet.key, planet.rashi.index) !== "debilitated") continue;
    const signLord = SIGN_LORDS[planet.rashi.index];
    const lordPlacement = findPlanet(chart, signLord);
    if (lordPlacement && KENDRA_HOUSES.includes(lordPlacement.house)) {
      hits.push({ id: "neechaBhanga", planets: [planet.key, signLord] });
    }
  }
  return hits;
}

/** Every yoga detected in this chart. Most charts will have none or one -- these are meant to be a rare, special find, not present in every reading. */
export function detectYogas(chart: BirthChart): YogaHit[] {
  const hits: YogaHit[] = [];
  const gajakesari = detectGajakesari(chart);
  if (gajakesari) hits.push(gajakesari);
  const budhaAditya = detectBudhaAditya(chart);
  if (budhaAditya) hits.push(budhaAditya);
  const saraswati = detectSaraswati(chart);
  if (saraswati) hits.push(saraswati);
  hits.push(...detectNeechaBhanga(chart));
  return hits;
}
