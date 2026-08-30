import type { BirthChart } from "../astro/types";
import { tierFromScore, type Tier } from "./narrative";
import type { AgeBand } from "./age";
import { matchDecisionSubjects, type DecisionSubjectMatch } from "./decisionMatch";
import { SUBJECTS } from "./subjects";

/**
 * A dedicated, direct answer to the "what decision are you facing?"
 * field -- built after founder feedback that the earlier design (a
 * single hedged sentence buried in the Direction chapter) read as
 * refusing to answer at all: "we have not addressed the question apart
 * from replaying it and saying it isn't addressed here."
 *
 * The honesty constraint from HANDOFF §6 still applies and is not
 * negotiable: this product's core trust asset, independently praised by
 * every conversion-test persona, is that it never manufactures
 * confidence the chart doesn't support. So "direct" here means: as
 * decisive as the actual computed scores warrant, in plain language,
 * with no hedge-padding -- not a fabricated verdict when the chart
 * genuinely doesn't lean either way. A real "this chart doesn't favor
 * one over the other, so let interest decide" IS a direct, useful
 * answer; it just isn't always the answer a parent hoped for.
 */
const DECISION_AWARE_BANDS: AgeBand[] = ["middle", "senior", "youngAdult"];

const TIER_BLURB: Record<Tier, string> = {
  flourishing: "a genuine natural strength",
  steady: "a workable, ordinary fit — not a standout either way",
  growing: "likely to need more deliberate encouragement to feel natural",
};

function subjectRead(subjectId: string, chart: BirthChart) {
  const def = SUBJECTS.find((s) => s.id === subjectId);
  if (!def) return null;
  const score = def.score(chart);
  const tier = tierFromScore(score);
  return { def, score, tier };
}

function proxyNote(match: DecisionSubjectMatch, def: (typeof SUBJECTS)[number]): string {
  return match.isProxy
    ? ` (there's no dedicated "${match.matchedText}" subject in this chart, so ${def.name} — general language and communication aptitude — is the closest real signal available, not an exact match)`
    : "";
}

export interface DirectAnswer {
  body: string;
}

export function buildDirectAnswer(
  chart: BirthChart,
  childName: string,
  decisionFocus: string | undefined,
  ageBand: AgeBand,
): DirectAnswer | null {
  if (!decisionFocus || !DECISION_AWARE_BANDS.includes(ageBand)) return null;

  const matches = matchDecisionSubjects(decisionFocus);

  // Two or more named subjects: a genuine head-to-head, using the real
  // computed scores -- this is the "coding vs a second language" /
  // "Specialist Maths vs Methods" case, and the one most parents mean.
  if (matches.length >= 2) {
    const [matchA, matchB] = matches;
    const a = subjectRead(matchA.subjectId, chart);
    const b = subjectRead(matchB.subjectId, chart);
    if (a && b) {
      const gapIsMeaningful = a.tier !== b.tier || Math.abs(a.score - b.score) >= 1.5;
      const [stronger, weaker, strongerMatch, weakerMatch] =
        a.score >= b.score ? [a, b, matchA, matchB] : [b, a, matchB, matchA];

      if (!gapIsMeaningful) {
        return {
          body: `Between ${a.def.name} and ${b.def.name}: this chart doesn't clearly favour one over the other for ${childName} — both land in a similar, ${TIER_BLURB[a.tier]} range.${proxyNote(matchA, a.def)}${proxyNote(matchB, b.def)} That's a genuine answer, not a dodge: with no strong lean either way, ${childName}'s actual interest, and which one pairs better with everything else on the table, are more useful tie-breakers here than the chart is.`,
        };
      }
      return {
        body: `Between ${a.def.name} and ${b.def.name}: this chart leans toward ${stronger.def.name} for ${childName}. ${stronger.def.name} is the relatively stronger fit of the two (${TIER_BLURB[stronger.tier]}), while ${weaker.def.name} is the one more likely to need deliberate extra effort to feel as natural (${TIER_BLURB[weaker.tier]}).${proxyNote(strongerMatch, stronger.def)}${proxyNote(weakerMatch, weaker.def)} If you need to lead with one, this chart says lead with ${stronger.def.name} — that doesn't rule ${weaker.def.name} out, it's just the one likely to take more encouragement. (See the Subjects chapter for exactly which placement this reads from.)`,
      };
    }
  }

  // Exactly one named subject: a direct read on that one thing, still as
  // decisive as the chart's own data actually supports.
  if (matches.length === 1) {
    const match = matches[0];
    const result = subjectRead(match.subjectId, chart);
    if (result) {
      const { def, tier } = result;
      return {
        body: `On ${def.name} specifically: this is ${TIER_BLURB[tier]} for ${childName} (see the Subjects chapter for the exact placement this reads from).${proxyNote(match, def)} ${
          tier === "flourishing"
            ? `If this is genuinely on the table, this chart supports taking it seriously rather than defaulting to something safer.`
            : tier === "growing"
              ? `That doesn't rule it out, but it's honest to say it may take more deliberate effort than it would for some peers — worth knowing going in, not a reason to avoid it.`
              : `Nothing here argues strongly for or against it — genuine interest and how it pairs with everything else on the table matter more than this chart does.`
        }`,
      };
    }
  }

  // Nothing recognized: the honest limit of what a fixed set of tracked
  // subjects/directions can speak to. Still says something concrete --
  // the chart's own single strongest signal -- rather than only a
  // disclaimer.
  const ranked = [...SUBJECTS]
    .map((s) => ({ def: s, score: s.score(chart) }))
    .sort((x, y) => y.score - x.score);
  const top = ranked[0];
  return {
    body: `This chart doesn't have a direct signal for "${decisionFocus}" specifically — it tracks strength across ${SUBJECTS.length} subjects and four broader directions, not open-ended questions. The closest genuinely relevant thing in ${childName}'s chart is ${top.def.name}, ${TIER_BLURB[tierFromScore(top.score)]}. It isn't a direct answer to what you asked, but it's the real signal here, not an invented one.`,
  };
}
