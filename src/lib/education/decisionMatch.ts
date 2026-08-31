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

/**
 * Career/field-level keywords -- distinct from the subject keywords
 * above, and checked separately. A question like "will she get into
 * medicine?" names no school subject at all, so subject matching finds
 * nothing; but "Medicine & Health Sciences" is a real field this engine
 * already lists under the STEM direction (see direction.ts's STREAMS),
 * so a career question can still get a genuinely useful, chart-grounded
 * answer about whether that *direction* fits -- never a prediction about
 * admission, exam results, or any other outcome the chart has no way to
 * know, which stays out of scope on purpose.
 *
 * `fieldName` must match a string verbatim in one of STREAMS' `fields`
 * arrays in direction.ts -- keep the two in sync if either changes.
 */
interface CareerKeyword {
  pattern: RegExp;
  fieldName: string;
  streamId: string;
  /** Set when fieldName is the closest tracked proxy, not an exact match (e.g. "astronaut" -> Applied Sciences). */
  isProxy?: boolean;
}

const CAREER_KEYWORDS: CareerKeyword[] = [
  { pattern: /\bmedicine\b|\bdoctor\b|\bphysician\b|\bnurs(e|ing)\b|\bsurgeon\b/i, fieldName: "Medicine & Health Sciences", streamId: "stem" },
  { pattern: /\bengineer/i, fieldName: "Engineering", streamId: "stem" },
  { pattern: /\barchitect/i, fieldName: "Architecture", streamId: "stem" },
  { pattern: /\bapplied science/i, fieldName: "Applied Sciences", streamId: "stem" },
  { pattern: /\bastronaut\b|\bspace\b|\baerospace\b/i, fieldName: "Applied Sciences", streamId: "stem", isProxy: true },
  { pattern: /\blaw\b|\blawyer\b|\battorney\b|\bsolicitor\b/i, fieldName: "Law", streamId: "humanities" },
  { pattern: /\bjournalis|\bmedia\b/i, fieldName: "Journalism & Media", streamId: "humanities" },
  { pattern: /\bteach|\beducation\b/i, fieldName: "Education", streamId: "humanities" },
  { pattern: /\bpsycholog/i, fieldName: "Psychology", streamId: "humanities" },
  { pattern: /\bpublic policy\b|\bpolitics\b/i, fieldName: "Public Policy", streamId: "humanities" },
  { pattern: /\b(graphic|product|ux) design\b|\bdesigner\b/i, fieldName: "Design (graphic, product, UX)", streamId: "arts" },
  { pattern: /\bfilm\b|\bfilmmak/i, fieldName: "Media & Film", streamId: "arts" },
  { pattern: /\bmusician\b/i, fieldName: "Music", streamId: "arts" },
  { pattern: /\bmarketing\b|\bcreative writing\b/i, fieldName: "Creative Writing & Marketing", streamId: "arts" },
  { pattern: /\btrade(s)?\b|\bvocation/i, fieldName: "Skilled Trades & Vocational Careers", streamId: "practical" },
  { pattern: /\bcoach(ing)?\b|\bphysical therap/i, fieldName: "Sports, Coaching & Physical Therapy", streamId: "practical" },
  { pattern: /\bculinary\b|\bchef\b/i, fieldName: "Culinary Arts", streamId: "practical" },
  { pattern: /\bentrepreneur/i, fieldName: "Hands-on Entrepreneurship", streamId: "practical" },
];

export interface DecisionCareerMatch {
  fieldName: string;
  streamId: string;
  matchedText: string;
  isProxy: boolean;
}

/**
 * All distinct fields a decision's text names, in order -- so "can she
 * be an astronaut or aerospace engineer?" surfaces both named careers
 * instead of silently answering only whichever one happened to match
 * first and dropping the other.
 */
export function matchDecisionCareers(decisionFocus: string | undefined): DecisionCareerMatch[] {
  if (!decisionFocus) return [];
  const seen = new Set<string>();
  const matches: DecisionCareerMatch[] = [];
  for (const keyword of CAREER_KEYWORDS) {
    const found = decisionFocus.match(keyword.pattern);
    if (!found || seen.has(keyword.fieldName)) continue;
    seen.add(keyword.fieldName);
    matches.push({ fieldName: keyword.fieldName, streamId: keyword.streamId, matchedText: found[0], isProxy: Boolean(keyword.isProxy) });
  }
  return matches;
}
