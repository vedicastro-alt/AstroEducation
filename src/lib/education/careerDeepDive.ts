import type { BirthChart } from "../astro/types";
import { fieldEssence, fieldScore } from "./careerSignals";
import { STREAMS } from "./direction";
import { tierFromScore, type Tier } from "./narrative";

/**
 * A ranked view across every career field careerSignals.ts actually
 * scores (25+ fields across all four streams), not just the single
 * strongest broad stream direction.ts surfaces. Premium-tier exclusive
 * -- built entirely from data the engine already computes for
 * directAnswer.ts's career-question path, just presented as its own
 * chapter instead of only being reachable when a parent happens to name
 * a matching field in their decision-focus question.
 */
const TIER_PHRASE: Record<Tier, string> = {
  flourishing: "a genuine natural strength",
  steady: "a solid, workable fit",
  growing: "likely to need more deliberate encouragement to feel natural",
};

export interface CareerDeepDiveItem {
  fieldName: string;
  essence: string;
  tier: Tier;
  body: string;
}

export function buildCareerDeepDive(chart: BirthChart, childName: string, count = 6): CareerDeepDiveItem[] {
  // A few fields (e.g. "Architecture") are deliberately listed under more
  // than one stream in direction.ts (it's a genuine STEM/arts crossover),
  // but fieldScore/fieldEssence read the same FIELD_SCORES/FIELD_ESSENCE
  // entry regardless of which stream asked -- scoring it once per stream
  // would rank the identical field twice with byte-identical text. Keep
  // the first stream's essence framing and score each field only once.
  const seen = new Set<string>();
  const scored: { fieldName: string; essence: string; score: number }[] = [];
  for (const stream of STREAMS) {
    for (const fieldName of stream.fields) {
      if (seen.has(fieldName)) continue;
      seen.add(fieldName);
      scored.push({
        fieldName,
        essence: fieldEssence(fieldName, stream.essence),
        score: fieldScore(chart, fieldName, stream.score),
      });
    }
  }

  return [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ fieldName, essence, score }) => {
      const tier = tierFromScore(score);
      return {
        fieldName,
        essence,
        tier,
        body: `${childName} shows ${TIER_PHRASE[tier]} toward ${essence}.`,
      };
    });
}
