/**
 * Lightweight keyword matching from a parent's free-text `decisionFocus`
 * (e.g. "coding vs a second language") to the one subject/stream this
 * engine can actually speak to. Deliberately conservative: an unmatched
 * decision (e.g. anything about a foreign language, which this product
 * has no subject for) returns undefined rather than guessing -- the
 * generic quote-back callout in pathwayPages.tsx still preserves the
 * parent's own words either way, this only controls whether a specific
 * subject/stream gets a targeted acknowledgment.
 */
interface DecisionKeyword {
  pattern: RegExp;
  subjectId: string;
  streamId: string;
}

const DECISION_KEYWORDS: DecisionKeyword[] = [
  { pattern: /\bcod(e|ing)\b|computer|software|programming/i, subjectId: "computer-science", streamId: "stem" },
  { pattern: /\bmath|specialist|methods|calculus|algebra\b/i, subjectId: "mathematics", streamId: "stem" },
  { pattern: /\bchem|\bbio(logy)?\b|\bphys(ics)?\b|\bscience\b/i, subjectId: "science", streamId: "stem" },
  { pattern: /\bart\b|\bdesign\b|\bvisual\b/i, subjectId: "visual-arts", streamId: "arts" },
  { pattern: /\bmusic\b|\binstrument\b/i, subjectId: "music", streamId: "arts" },
  { pattern: /\benglish\b|\bwriting\b|\bliterature\b|\bessay\b/i, subjectId: "reading-language", streamId: "humanities" },
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
