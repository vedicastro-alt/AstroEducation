/**
 * Lightweight keyword matching from a parent's free-text `decisionFocus`
 * (e.g. "coding vs a second language") to the subject(s)/stream this
 * engine can actually speak to. Deliberately conservative: an unmatched
 * term returns nothing rather than guessing.
 *
 * `subjectId: null` marks a keyword with no exact corresponding subject
 * in this engine (there is no dedicated "foreign language" subject) --
 * `reading-language` (general verbal/language aptitude) is the closest
 * real signal available, but callers that build a direct comparison must
 * disclose that it's a proxy, not the same thing, rather than silently
 * treating "a second language" and "English" as identical.
 */
interface DecisionKeyword {
  pattern: RegExp;
  subjectId: string;
  streamId: string;
  /** Set when subjectId is a proxy, not an exact match (see above). */
  isProxy?: boolean;
}

const DECISION_KEYWORDS: DecisionKeyword[] = [
  { pattern: /\bcod(e|ing)\b|computer|software|programming/i, subjectId: "computer-science", streamId: "stem" },
  { pattern: /\bmath|specialist|methods|calculus|algebra\b/i, subjectId: "mathematics", streamId: "stem" },
  { pattern: /\bchem|\bbio(logy)?\b|\bphys(ics)?\b|\bscience\b/i, subjectId: "science", streamId: "stem" },
  { pattern: /\bart\b|\bdesign\b|\bvisual\b/i, subjectId: "visual-arts", streamId: "arts" },
  { pattern: /\bmusic\b|\binstrument\b/i, subjectId: "music", streamId: "arts" },
  { pattern: /\benglish\b|\bwriting\b|\bliterature\b|\bessay\b/i, subjectId: "reading-language", streamId: "humanities" },
  {
    pattern: /\b(a |second |foreign |new )?language(s)?\b/i,
    subjectId: "reading-language",
    streamId: "humanities",
    isProxy: true,
  },
  { pattern: /\bhistory\b|\bhumanit(y|ies)\b|\blegal\b|\beconom/i, subjectId: "history-social", streamId: "humanities" },
  { pattern: /\bspeak|\bdebate\b|\bdrama\b|\bleadership\b/i, subjectId: "public-speaking", streamId: "humanities" },
  { pattern: /\bsport|\bpe\b|\bphysical\b|\btrade\b|\bvocation/i, subjectId: "physical-education", streamId: "practical" },
];

export function matchDecisionSubjectId(decisionFocus: string | undefined): string | undefined {
  if (!decisionFocus) return undefined;
  return DECISION_KEYWORDS.find((k) => k.pattern.test(decisionFocus))?.subjectId;
}

export function matchDecisionStreamId(decisionFocus: string | undefined): string | undefined {
  if (!decisionFocus) return undefined;
  return DECISION_KEYWORDS.find((k) => k.pattern.test(decisionFocus))?.streamId;
}

export interface DecisionSubjectMatch {
  subjectId: string;
  isProxy: boolean;
  /** The literal text that triggered this match, for an honest "you said X" callback. */
  matchedText: string;
}

/**
 * All distinct subjects a decision's text names, in the order they
 * appear -- used to build a genuine head-to-head comparison ("coding vs
 * a second language" -> [computer-science, reading-language]) rather
 * than only ever surfacing the single first match.
 */
export function matchDecisionSubjects(decisionFocus: string | undefined): DecisionSubjectMatch[] {
  if (!decisionFocus) return [];
  const seen = new Set<string>();
  const matches: DecisionSubjectMatch[] = [];
  for (const keyword of DECISION_KEYWORDS) {
    const found = decisionFocus.match(keyword.pattern);
    if (!found || seen.has(keyword.subjectId)) continue;
    seen.add(keyword.subjectId);
    matches.push({ subjectId: keyword.subjectId, isProxy: Boolean(keyword.isProxy), matchedText: found[0] });
  }
  return matches;
}
