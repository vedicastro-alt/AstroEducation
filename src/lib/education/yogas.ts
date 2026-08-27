import type { BirthChart } from "../astro/types";
import type { PlanetKey } from "../astro/constants";
import { detectYogas, type YogaHit } from "../astro/yogas";
import { ordinal } from "./narrative";
import { planetByKey } from "./scoring";
import type { InsightItem } from "./types";

function houseAndSign(chart: BirthChart, key: PlanetKey): string {
  const p = planetByKey(chart, key);
  return `${p.rashi.english}, ${ordinal(p.house)} house`;
}

function renderGajakesari(chart: BirthChart, name: string): InsightItem {
  return {
    id: "gajakesari",
    title: "Gajakesari Yoga — a bright, resilient mind",
    body: `Jupiter (${houseAndSign(chart, "Jupiter")}) sits in a kendra relationship with the Moon (${houseAndSign(chart, "Moon")}) — a classical combination called Gajakesari Yoga. It's traditionally associated with a clear, quick mind and a kind of natural resilience: setbacks tend not to knock ${name} off course for long.`,
  };
}

function renderBudhaAditya(chart: BirthChart, name: string): InsightItem {
  return {
    id: "budhaAditya",
    title: "Budha-Aditya Yoga — sharp, focused intellect",
    body: `The Sun and Mercury sit together in ${houseAndSign(chart, "Mercury")} — a fairly common but genuinely useful combination called Budha-Aditya Yoga. It's classically linked to sharp, analytical thinking and a natural knack for organizing information clearly, which tends to show up early in how ${name} approaches problems.`,
  };
}

function renderSaraswati(chart: BirthChart, name: string): InsightItem {
  return {
    id: "saraswati",
    title: "Saraswati Yoga — a genuine gift for learning",
    body: `Mercury (${houseAndSign(chart, "Mercury")}), Jupiter (${houseAndSign(chart, "Jupiter")}) and Venus (${houseAndSign(chart, "Venus")}) are each well placed for ${name}, together forming what's classically called Saraswati Yoga, named for the goddess of learning and the arts. This specific combination of all three together is less common than any one alone, and traditionally points to real natural aptitude for learning, eloquent expression, and a genuine feel for the arts, all at once.`,
  };
}

function renderNeechaBhanga(chart: BirthChart, hit: YogaHit, name: string): InsightItem {
  const [debilitatedKey, lordKey] = hit.planets;
  return {
    id: `neechaBhanga-${debilitatedKey}`,
    title: `A softened placement — ${debilitatedKey}'s debilitation is classically cancelled`,
    body: `${debilitatedKey} is debilitated in ${houseAndSign(chart, debilitatedKey)} for ${name}, which on its own would need extra support to come through. But ${lordKey}, the lord of that sign, is placed in a kendra house from the ascendant — a classical condition called Neecha Bhanga, or "cancellation of debilitation." In practice, this usually means the challenge described elsewhere in this reading for ${debilitatedKey} is less limiting than a plain debilitation would suggest, and may even resolve into a real strength with time and support.`,
  };
}

/**
 * Additional classical combination call-outs, when present. Note these
 * are not uniformly rare -- Budha-Aditya in particular fires in roughly
 * half of all charts, since Mercury's orbit keeps it within about 28
 * degrees of the Sun, making a shared sign common rather than special.
 * Saraswati Yoga and Neecha Bhanga are meaningfully less common (roughly
 * one chart in eight, in an informal sample). Content for each is worded
 * to match its actual rarity rather than claim scarcity uniformly.
 */
export function buildSpecialCombinations(chart: BirthChart, childName: string): InsightItem[] {
  const hits = detectYogas(chart);
  return hits.map((hit) => {
    switch (hit.id) {
      case "gajakesari":
        return renderGajakesari(chart, childName);
      case "budhaAditya":
        return renderBudhaAditya(chart, childName);
      case "saraswati":
        return renderSaraswati(chart, childName);
      case "neechaBhanga":
        return renderNeechaBhanga(chart, hit, childName);
    }
  });
}
