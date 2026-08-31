import type { BirthChart } from "../astro/types";
import { tierFromScore, type Tier } from "./narrative";
import type { AgeBand } from "./age";
import { matchDecisionCareers, matchDecisionSubjects, type DecisionCareerMatch, type DecisionSubjectMatch } from "./decisionMatch";
import { SUBJECTS } from "./subjects";
import { STREAMS } from "./direction";
import { fieldEssence, fieldScore } from "./careerSignals";

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

/**
 * A career field and the school subject that names the same real-world
 * concept, wherever one exists -- e.g. a parent asking about "Mathematics
 * & Statistics" as a career is asking about the same underlying thing the
 * Subjects chapter calls "Mathematics." The two chapters read it two
 * genuinely different ways on purpose (the career field blends in the
 * Dashamsha and its own distinct significators; the subject score is a
 * single, simpler natal formula), which the §22 content audit found
 * disagreeing on tier in 22-35% of a random 80-chart sample for these
 * exact pairs -- often enough that a parent reading both chapters would
 * reasonably read it as the site contradicting itself, not as two
 * different classical techniques. Deliberately not attempted for every
 * field: only pairs that genuinely name the same thing (a career field
 * that's really its own concept, like Law or Architecture, gets no entry
 * and no acknowledgment clause).
 */
const FIELD_TO_SUBJECT: Record<string, string> = {
  "Mathematics & Statistics": "mathematics",
  Microbiology: "science",
  Biotechnology: "science",
  Biochemistry: "science",
  "Design (graphic, product, UX)": "visual-arts",
};

/**
 * When a field's tier genuinely differs from its counterpart subject's
 * tier, say so briefly rather than leaving the two chapters looking like
 * they disagree -- turns a looks-like-a-contradiction into visible,
 * deliberate depth, per the §22 audit's recommended fix.
 */
function divergenceNote(chart: BirthChart, fieldName: string, fieldTier: Tier): string {
  const subjectId = FIELD_TO_SUBJECT[fieldName];
  if (!subjectId) return "";
  const subject = subjectRead(subjectId, chart);
  if (!subject || subject.tier === fieldTier) return "";
  return ` (Worth knowing: the Subjects chapter reads ${subject.def.name} on its own as ${TIER_BLURB[subject.tier]} — that's not a contradiction, just a narrower read. This career-specific answer draws on more than a school subject does: ${fieldName}'s own significators plus the Dashamsha, the divisional chart classically used for career, not the general subject placement alone.)`;
}

/** `divergenceNote` for each field in a multi-field comparison, concatenated. */
function allDivergenceNotes(chart: BirthChart, fields: { fieldName: string; tier: Tier }[]): string {
  return fields.map((f) => divergenceNote(chart, f.fieldName, f.tier)).join("");
}

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

/**
 * A specific career field's own read -- NOT the coarse parent-stream
 * score. Two fields sharing a stream (Medicine and Engineering both
 * sit under "STEM") can genuinely land in different tiers here, because
 * each reads its own distinct significators (see careerSignals.ts).
 * `isPrimaryStream` still checks the field's parent stream against the
 * chart's single strongest broad direction -- a real, if coarser, signal
 * worth surfacing separately from the field's own tier.
 */
function fieldRead(fieldName: string, streamId: string, chart: BirthChart) {
  const stream = STREAMS.find((s) => s.id === streamId);
  if (!stream) return null;
  const score = fieldScore(chart, fieldName, stream.score);
  const essence = fieldEssence(fieldName, stream.essence);
  const ranked = [...STREAMS]
    .map((s) => ({ id: s.id, score: s.score(chart) }))
    .sort((a, b) => b.score - a.score);
  return {
    fieldName,
    stream,
    score,
    essence,
    tier: tierFromScore(score),
    isPrimaryStream: ranked[0].id === streamId,
  };
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
    const fieldNames = [...new Set(careerMatches.map((m) => m.fieldName))];
    const reads = fieldNames
      .map((fieldName) => {
        const match = careerMatches.find((m) => m.fieldName === fieldName);
        return match ? fieldRead(fieldName, match.streamId, chart) : null;
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    // Exactly one distinct field named ("medicine", "doctor" and
    // "surgeon" all resolve to the same field) -- a direct read on that
    // field's own significators, not the coarser parent-stream score.
    if (reads.length === 1) {
      const r = reads[0];
      const proxyNotes = careerMatches.filter((m) => m.fieldName === r.fieldName).map(proxyCareerNote).join("");
      const otherFields = r.stream.fields.filter((f) => f !== r.fieldName);
      const primaryNote = r.isPrimaryStream
        ? ` This also sits within ${childName}'s single strongest overall direction in this chart, which is a genuinely encouraging sign.`
        : "";
      return {
        body: `Whether ${childName} is ultimately admitted to, or selected for, ${withArticle(r.fieldName)} path comes down to grades, exams, specific selection criteria, and years of effort — not something a birth chart can predict, and we'd rather say so plainly than pretend otherwise. What the chart can speak to honestly is whether this kind of work suits ${childName}'s natural direction — read here from the birth chart together with its Dashamsha, the divisional chart classically used specifically for career, rather than the birth chart alone. ${childName} shows ${DIRECTION_TIER_BLURB[r.tier]} toward ${r.essence}.${proxyNotes}${primaryNote}${otherFields.length > 0 ? ` ${joinList(otherFields.slice(0, 3))} draw on a related but genuinely distinct set of strengths, and are worth keeping in view too rather than assuming the same read applies to them.` : ""}${divergenceNote(chart, r.fieldName, r.tier)}`,
      };
    }

    // Two or more distinct fields named -- compared on each field's own
    // score, whether or not they share a broad stream (this is exactly
    // the case that used to collapse Medicine and Engineering into one
    // answer just because both sit under "STEM"). Same honesty rule as
    // the two-subject case: a real "doesn't favour one over the other"
    // answer when the gap isn't meaningful, never a manufactured verdict.
    if (reads.length >= 2) {
      const sorted = [...reads].sort((a, b) => b.score - a.score);
      const top = sorted[0];
      const weakest = sorted[sorted.length - 1];
      const gapIsMeaningful = top.tier !== weakest.tier || top.score - weakest.score >= 1.5;
      const allProxyNotes = careerMatches.map(proxyCareerNote).join("");

      if (!gapIsMeaningful) {
        return {
          body: `Between ${joinList(fieldNames)}: this chart doesn't clearly favour one over the others for ${childName} — each shows ${DIRECTION_TIER_BLURB[top.tier]}, reading the birth chart together with its Dashamsha (the divisional chart classically used for career) rather than the birth chart alone.${allProxyNotes} That's a genuine answer, not a dodge: with no strong lean either way, ${childName}'s actual interest is a more useful guide here than the chart is. Either way, none of this speaks to admission or selection outcomes — those come down to grades, exams, and effort, not a birth chart.${allDivergenceNotes(chart, sorted)}`,
        };
      }

      const restClause = sorted
        .slice(1)
        .map((r) => `${r.fieldName} shows ${DIRECTION_TIER_BLURB[r.tier]} toward ${r.essence} by comparison`)
        .join("; ");
      return {
        body: `Between ${joinList(fieldNames)}: this chart leans toward ${top.fieldName} for ${childName}, showing ${DIRECTION_TIER_BLURB[top.tier]} toward ${top.essence} — reading the birth chart together with its Dashamsha, the divisional chart classically used for career, rather than the birth chart alone. ${restClause}.${allProxyNotes} That's not a verdict on the others — they stay genuinely open, and none of this predicts admission or selection into any of them — but if you need a starting lean, this chart points toward ${top.fieldName} first.${allDivergenceNotes(chart, sorted)}`,
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
