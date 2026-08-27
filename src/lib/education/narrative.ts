import type { PlanetKey } from "../astro/constants";
import type { BirthChart } from "../astro/types";
import type { Dignity } from "../astro/dignity";
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
