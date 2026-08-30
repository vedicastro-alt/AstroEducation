import type { BirthChart } from "../astro/types";
import { NAKSHATRA_THEMES } from "../astro/nakshatra-themes";
import type { Element, Modality } from "../astro/dignity";
import { METRICS } from "./metrics";
import { topFocusAreas } from "./domains";
import { ascendantElement, ascendantModality, moonElement, moonModality, planetByKey } from "./scoring";
import { buildSpecialCombinations } from "./yogas";
import type { AgeBand } from "./age";
import type { EducationInsights } from "./types";

const ELEMENT_PHRASE: Record<Element, string> = {
  fire: "an energetic, enthusiastic spark — they tend to dive in headfirst",
  earth: "a grounded, practical style — they like to see and touch what they're learning",
  air: "a curious, conversational style — they think out loud and love exchanging ideas",
  water: "a feeling, intuitive style — they pick up on the emotional tone of a room as much as the content",
};

const MODALITY_PHRASE: Record<Modality, string> = {
  cardinal: "they're often the one to jump in and start something new",
  fixed: "they settle in and stay with things once they've committed",
  mutable: "they adapt easily and enjoy variety and change",
};

function ascendantSummary(chart: BirthChart, name: string): string {
  const el = ascendantElement(chart);
  const mod = ascendantModality(chart);
  return `${name}'s rising sign is ${chart.ascendant.name} (${chart.ascendant.english}), which colours how they meet the world day to day. This often brings ${ELEMENT_PHRASE[el]}, and ${MODALITY_PHRASE[mod]}.`;
}

function moonSummary(chart: BirthChart, name: string): string {
  const moon = planetByKey(chart, "Moon");
  const el = moonElement(chart);
  const mod = moonModality(chart);
  const theme = NAKSHATRA_THEMES[moon.nakshatra.index];
  return `${name}'s Moon — the planet of mind and emotion — sits in ${moon.rashi.name} (${moon.rashi.english}). This often brings ${theme}. Emotionally, this leans toward ${ELEMENT_PHRASE[el]}, and ${MODALITY_PHRASE[mod]}, which shapes the environment they'll learn best in.`;
}

export function buildEducationInsights(
  chart: BirthChart,
  childNameRaw: string,
  ageBand: AgeBand,
): EducationInsights {
  const childName = childNameRaw.trim() || "Your child";

  const ranked = METRICS.map((m) => ({ metric: m, score: m.score(chart) })).sort(
    (a, b) => b.score - a.score,
  );

  const strengths = ranked.slice(0, 4).map((r) => r.metric.strength(chart, childName, ageBand));
  const growthAreas = ranked
    .slice(-2)
    .reverse()
    .map((r) => r.metric.growth(chart, childName, ageBand));

  const focusAreas = topFocusAreas(chart, childName, ageBand, 3);
  const specialCombinations = buildSpecialCombinations(chart, childName);

  // The sibling/classmate comparison reminder reads worse the older the
  // child is -- a conversion-test persona playing a 17-year-old's parent
  // flagged it by name as tone-deaf next to genuine university/exam-season
  // comparison pressure. Vary it by age band rather than repeat it verbatim
  // regardless of age.
  const comparisonTip =
    ageBand === "senior" || ageBand === "youngAdult"
      ? "Every chart shows a unique mix of strengths and growing edges — worth remembering when it's tempting to measure this against a friend's exam results or university offer."
      : "Every child's chart shows a unique mix of strengths and growing edges; try not to compare this report to a sibling's or classmate's.";

  const learningTips = [
    "Celebrate effort and curiosity out loud, not just results — it's what keeps motivation alive long-term.",
    comparisonTip,
    "Treat 'growth areas' as simply the parts of the journey that need a little more patience and support, not something to worry about.",
  ];

  const headline = `${childName} carries a bright, individual mix of strengths — here is what ${childName}'s birth chart gently suggests about how ${childName === "Your child" ? "they" : childName} may learn best.`;

  return {
    childName,
    headline,
    ascendantSummary: ascendantSummary(chart, childName),
    moonSummary: moonSummary(chart, childName),
    strengths,
    growthAreas,
    focusAreas,
    specialCombinations,
    learningTips,
    timeWasEstimated: chart.timeWasEstimated,
  };
}
