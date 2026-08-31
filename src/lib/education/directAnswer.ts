import type { BirthChart } from "../astro/types";
import { tierFromScore, type Tier } from "./narrative";
import type { AgeBand } from "./age";
import { matchDecisionCareers, matchDecisionSubjects, type DecisionCareerMatch, type DecisionSubjectMatch } from "./decisionMatch";
import { SUBJECTS } from "./subjects";
import { STREAMS } from "./direction";

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

const DIRECTION_TIER_BLURB: Record<Tier, string> = {
  flourishing: "a genuinely strong, natural pull",
  steady: "a solid, workable fit — not the single standout pull in this chart, but a real one",
  growing: "not the most natural starting point on its own, though that's a starting point, not a ceiling",
};

/** "A", "A and B", or "A, B and C". */
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function subjectRead(subjectId: string, chart: BirthChart) {
  const def = SUBJECTS.find((s) => s.id === subjectId);
  if (!def) return null;
  const score = def.score(chart);
  const tier = tierFromScore(score);
  return { def, score, tier };
}

function streamRead(streamId: string, chart: BirthChart) {
  const stream = STREAMS.find((s) => s.id === streamId);
  if (!stream) return null;
  const ranked = [...STREAMS]
    .map((s) => ({ id: s.id, score: s.score(chart) }))
    .sort((a, b) => b.score - a.score);
  return { stream, tier: tierFromScore(stream.score(chart)), isPrimary: ranked[0].id === streamId };
}

function proxyNote(match: DecisionSubjectMatch, def: (typeof SUBJECTS)[number]): string {
  return match.isProxy
    ? ` (there's no dedicated "${match.matchedText}" subject in this chart, so ${def.name} — general language and communication aptitude — is the closest real signal available, not an exact match)`
    : "";
}

function proxyCareerNote(match: DecisionCareerMatch): string {
  return match.isProxy
    ? ` (there's no dedicated "${match.matchedText}" field tracked here, so ${match.fieldName} — the closest real signal — stands in for it)`
    : "";
}

function withArticle(word: string): string {
  return `${/^[aeiou]/i.test(word) ? "an" : "a"} ${word}`;
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
          body: `Between ${a.def.name} and ${b.def.name}: this chart doesn't clearly favour one over the other for ${childName} — both land in a similar place: ${TIER_BLURB[a.tier]}.${proxyNote(matchA, a.def)}${proxyNote(matchB, b.def)} That's a genuine answer, not a dodge: with no strong lean either way, ${childName}'s actual interest, and which one pairs better with everything else on the table, are more useful tie-breakers here than the chart is.`,
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

  // A career or field, named directly ("will she get into medicine?",
  // "can she be an astronaut or aerospace engineer?"): no subject matched
  // (there's no "Medicine" or "Astronaut" subject), but the direction
  // streams already list real fields ("Medicine & Health Sciences",
  // "Engineering") -- so this can still get a genuinely useful answer
  // about whether that *direction* fits, without ever pretending to
  // predict the one thing that's actually unpredictable here: admission,
  // selection, exam results, or any other real-world outcome. Handles
  // more than one named career (a real gap found in testing: the first
  // version silently answered only whichever career happened to match
  // first and dropped the other entirely).
  const careerMatches = matchDecisionCareers(decisionFocus);
  if (careerMatches.length > 0) {
    const streamIds = [...new Set(careerMatches.map((m) => m.streamId))];

    // All named careers point the same direction (astronaut + aerospace
    // engineer both land in STEM) -- one answer, naming every field.
    if (streamIds.length === 1) {
      const result = streamRead(streamIds[0], chart);
      if (result) {
        const { stream, tier, isPrimary } = result;
        const namedFields = [...new Set(careerMatches.map((m) => m.fieldName))];
        const otherFields = stream.fields.filter((f) => !namedFields.includes(f));
        const proxyNotes = careerMatches.map(proxyCareerNote).join("");
        const primaryNote = isPrimary
          ? ` This also happens to be ${childName}'s single strongest natural direction overall, which is a genuinely encouraging sign.`
          : "";
        const pathWord = careerMatches.length > 1 ? "either path" : `${withArticle(namedFields[0])} path`;
        const fieldsAre = namedFields.length > 1 ? `${joinList(namedFields)} are` : `${namedFields[0]} is`;
        return {
          body: `Whether ${childName} is ultimately admitted to, or selected for, ${pathWord} comes down to grades, exams, specific selection criteria, and years of effort — not something a birth chart can predict, and we'd rather say so plainly than pretend otherwise. What the chart can speak to honestly is whether this kind of work suits ${childName}'s natural direction. ${childName} shows ${DIRECTION_TIER_BLURB[tier]} toward ${stream.essence}.${proxyNotes} ${fieldsAre} the closest concrete field${namedFields.length > 1 ? "s" : ""} this chart tracks in that direction.${primaryNote}${otherFields.length > 0 ? ` ${joinList(otherFields)} also draw on this same underlying strength and are worth keeping in view.` : ""}`,
        };
      }
    }

    // Named careers span more than one direction -- a genuine
    // cross-direction lean, same honesty rules as the two-subject case:
    // a real "doesn't favour one over the other" answer when the gap
    // isn't meaningful, never a manufactured verdict.
    const streamResults = streamIds
      .map((id) => {
        const result = streamRead(id, chart);
        return result ? { ...result, fields: [...new Set(careerMatches.filter((m) => m.streamId === id).map((m) => m.fieldName))] } : null;
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.stream.score(chart) - a.stream.score(chart));

    if (streamResults.length >= 2) {
      const [stronger, weaker] = streamResults;
      const gapIsMeaningful =
        stronger.tier !== weaker.tier || Math.abs(stronger.stream.score(chart) - weaker.stream.score(chart)) >= 1.5;

      if (!gapIsMeaningful) {
        return {
          body: `Between ${joinList(stronger.fields)} and ${joinList(weaker.fields)}: this chart doesn't clearly favour one direction over the other for ${childName} — both land in a similar place: ${DIRECTION_TIER_BLURB[stronger.tier]}. That's a genuine answer, not a dodge: with no strong lean either way, ${childName}'s actual interest is a more useful guide here than the chart is. Either way, none of this speaks to admission or selection outcomes — those come down to grades, exams, and effort, not a birth chart.`,
        };
      }
      return {
        body: `Between ${joinList(stronger.fields)} and ${joinList(weaker.fields)}: this chart leans toward ${joinList(stronger.fields)} for ${childName}, showing ${DIRECTION_TIER_BLURB[stronger.tier]} toward ${stronger.stream.essence}. ${joinList(weaker.fields)} sits in a direction that's ${DIRECTION_TIER_BLURB[weaker.tier]} by comparison. That's not a verdict on either path — both stay genuinely open, and neither is something a chart can predict admission or selection into — but if you need a starting lean, this chart points toward ${joinList(stronger.fields)} first.`,
      };
    }
  }

  // Nothing recognized at all: the honest limit of what a fixed set of
  // tracked subjects/directions can speak to. Still says something
  // concrete -- the chart's own strongest signal -- rather than only a
  // disclaimer, and frames the limit warmly rather than bluntly.
  const ranked = [...SUBJECTS]
    .map((s) => ({ def: s, score: s.score(chart) }))
    .sort((x, y) => y.score - x.score);
  const top = ranked[0];
  return {
    body: `"${decisionFocus}" isn't something this chart can answer directly — it's built to read strength across ${SUBJECTS.length} subjects and four broader directions, not open-ended questions like this one, and we'd rather tell you that plainly than stretch for an answer that isn't really there. What genuinely is in ${childName}'s chart, and worth having in view regardless: ${top.def.name} stands out as ${TIER_BLURB[tierFromScore(top.score)]}. It's not a direct answer to what you asked, but it's real, not invented for the occasion.`,
  };
}
