import type { PlanetKey } from "../astro/constants";
import type { BirthChart } from "../astro/types";
import type { Dignity } from "../astro/dignity";
import { aspectsOnPlanet, conjunctionsWith } from "../astro/aspects";
import { BENEFICS, MALEFICS, dignityTier, planetByKey } from "./scoring";

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

export function ordinal(n: number): string {
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

/** ", conjunct X, aspected by Y" -- the compact conjunction/aspect tail shared by every citation. */
function placementClauses(chart: BirthChart, key: PlanetKey): string {
  const conjunct = conjunctionsWith(chart, key);
  const aspectors = aspectsOnPlanet(chart, key).filter((a) => !conjunct.includes(a));
  const beneficAspectors = aspectors.filter((a) => BENEFICS.includes(a));
  const maleficAspectors = aspectors.filter((a) => MALEFICS.includes(a));

  const clauses: string[] = [];
  if (conjunct.length > 0) clauses.push(`conjunct ${joinList(conjunct)}`);
  if (beneficAspectors.length > 0) clauses.push(`aspected by ${joinList(beneficAspectors)}`);
  else if (maleficAspectors.length > 0) clauses.push(`pressured by ${joinList(maleficAspectors)}'s aspect`);

  return clauses.length > 0 ? `, ${clauses.join(", ")}` : "";
}

/**
 * A compact, chart-specific placement citation for a planet: sign,
 * dignity, house, and any conjunction/aspect worth naming, kept to a
 * short clause rather than a full sentence so it reads as texture, not a
 * data dump. This is the detail that makes two children who merely share
 * a lead planet's sign still read differently once house, dignity, and
 * drishti are accounted for.
 */
export function citePlacement(chart: BirthChart, key: PlanetKey): string {
  const planet = planetByKey(chart, key);
  const dignity = dignityTier(chart, key);
  const english = planet.rashi.english;
  const house = ordinal(planet.house);
  const clauses = placementClauses(chart, key);

  if (dignity === "exalted") return `${key} is exalted in ${english}, ${house} house${clauses}.`;
  if (dignity === "own") return `${key} is in its own sign, ${english}, ${house} house${clauses}.`;
  if (dignity === "debilitated") return `${key} is debilitated in ${english}, ${house} house${clauses}.`;
  return `${key} sits in ${english}, ${house} house${clauses}.`;
}

/**
 * The same compact citation, but as an appositive continuing "Ruled by
 * {lord}, ..." rather than restating the planet's name -- used for
 * house-based content where the lord was already just named.
 */
export function citeHouseLord(chart: BirthChart, lord: PlanetKey): string {
  const planet = planetByKey(chart, lord);
  const dignity = dignityTier(chart, lord);
  const english = planet.rashi.english;
  const house = ordinal(planet.house);
  const clauses = placementClauses(chart, lord);

  if (dignity === "exalted") return `exalted in ${english}, ${house} house${clauses}`;
  if (dignity === "own") return `in its own sign, ${english}, ${house} house${clauses}`;
  if (dignity === "debilitated") return `debilitated in ${english}, ${house} house${clauses}`;
  return `in ${english}, ${house} house${clauses}`;
}

/** Short parenthetical about drishti landing on a house itself, independent of who occupies it. */
export function houseAspectNote(beneficHit: boolean, maleficHit: boolean): string {
  if (beneficHit) return " (the house itself is also supported)";
  if (maleficHit) return " (the house itself is also under pressure)";
  return "";
}

/**
 * A sentence describing what a specific conjunct planet classically adds
 * to whatever it's paired with -- reusable across every metric/subject
 * rather than one-off per section, so the *interpretation*, not just the
 * citation, changes with what's actually conjunct in this chart.
 */
export function conjunctionFlavor(partner: PlanetKey, name: string): string {
  switch (partner) {
    case "Moon":
      return `Being joined by the Moon here adds a real emotional, intuitive dimension for ${name} — this isn't purely intellectual, it's something they feel too.`;
    case "Mercury":
      return `Mercury's presence sharpens this into something ${name} can also put into words clearly, not just sense internally.`;
    case "Jupiter":
      return `Jupiter's presence amplifies this considerably — when a placement gets Jupiter's expansive backing, it tends to become one of ${name}'s more defining traits.`;
    case "Venus":
      return `Venus's presence brings a creative, aesthetic thread into this for ${name} — likely to be expressed through some artistic or design-minded lens.`;
    case "Sun":
      return `The Sun's presence gives this a confident, visible quality in ${name} — unlikely to stay quiet, it tends to show.`;
    case "Mars":
      return `Mars's presence adds real drive and energy — ${name} is likely to pursue this actively rather than wait for it to show up.`;
    case "Saturn":
      return `Saturn's presence asks for patience here — this quality is real in ${name} but may take structure and consistency to fully mature.`;
    case "Rahu":
      return `Rahu's presence gives this an unconventional, intensely focused edge — ${name} may approach it in a way that doesn't follow the usual path.`;
    case "Ketu":
      return `Ketu's presence brings a detached, instinctive quality — ${name} may access this more through quiet intuition than deliberate effort.`;
  }
}

const EXALTATION_INTENSIFIERS = [
  (name: string) =>
    `Exaltation specifically tends to make a quality like this unusually pronounced in ${name} — worth watching for early, rather than assuming it develops only with age.`,
  (name: string) =>
    `This is about as strong as this particular placement can be, which usually means it shows up early and clearly in ${name}, not something that has to be coaxed out over years.`,
];

/** An extra sentence acknowledging exaltation specifically, distinct from a merely-own-sign placement, so the two don't read identically. */
export function dignityIntensifier(dignity: Dignity, seed: number, name: string): string {
  if (dignity !== "exalted") return "";
  return EXALTATION_INTENSIFIERS[pickIndex(seed, EXALTATION_INTENSIFIERS.length)](name);
}

/**
 * Composes a full tiered insight body: a chart-specific citation, a
 * tier-appropriate closer (picked deterministically from that tier's
 * phrasing variants), and any conjunction/exaltation-driven extra
 * sentences -- so the interpretation, not just the citation, tracks what
 * is actually conjunct or exalted in this chart. Shared by every content
 * module (metrics, subjects, direction) so the same reasoning is never
 * hand-duplicated per section.
 */
export function renderTieredInsight(params: {
  chart: BirthChart;
  name: string;
  tier: Tier;
  leadPlanet: PlanetKey;
  citation: string;
  seed: number;
  variants: Record<Tier, ((name: string) => string)[]>;
}): string {
  const options = params.variants[params.tier];
  const idx = pickIndex(params.seed, options.length);
  const closer = options[idx](params.name);

  const extras: string[] = [];
  for (const partner of conjunctionsWith(params.chart, params.leadPlanet)) {
    extras.push(conjunctionFlavor(partner, params.name));
  }
  const intensifier = dignityIntensifier(
    dignityTier(params.chart, params.leadPlanet),
    params.seed,
    params.name,
  );
  if (intensifier) extras.push(intensifier);

  return [params.citation, closer, ...extras].join(" ");
}
