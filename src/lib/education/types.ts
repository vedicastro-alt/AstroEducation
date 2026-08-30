export interface InsightItem {
  id: string;
  title: string;
  body: string;
}

export interface FocusArea {
  id: string;
  title: string;
  body: string;
  tip: string;
}

export interface DashaChapter {
  lord: string;
  title: string;
  body: string;
  startLabel: string;
  endLabel: string;
}

export interface EnvironmentTip {
  id: string;
  title: string;
  body: string;
}

export interface SubjectResult {
  id: string;
  name: string;
  body: string;
  tip: string;
}

export interface DirectionStage {
  label: string;
  body: string;
}

export interface FutureDirection {
  id: string;
  title: string;
  essence: string;
  placementNote: string;
  stages: DirectionStage[];
  fields: string[];
  secondary?: {
    title: string;
    body: string;
  };
}

export interface LearningPathway {
  ageLabel: string;
  ageBandTitle: string;
  ageBandBody: string;
  /** The real-world decision a parent said they're facing (e.g. "coding vs Spanish elective"), quoted back verbatim near the relevant chapters. Undefined when the parent left it blank. */
  decisionFocus?: string;
  /** A dedicated, as-direct-as-the-chart-data-supports answer to decisionFocus -- a real head-to-head comparison when it names two tracked subjects, a direct read when it names one, and an honest "no direct signal" (paired with the chart's own strongest relevant signal) otherwise. Null when decisionFocus is unset or the child's age band isn't decision-aware. */
  directAnswer: { body: string } | null;
  currentChapter: DashaChapter;
  nextChapter: (DashaChapter & { startsInLabel: string }) | null;
  subjectsInclined: SubjectResult[];
  subjectsSupport: SubjectResult[];
  futureDirection: FutureDirection;
  environment: EnvironmentTip[];
  weeklyRhythm: string[];
  closing: string;
}

export interface EducationInsights {
  childName: string;
  headline: string;
  ascendantSummary: string;
  moonSummary: string;
  strengths: InsightItem[];
  growthAreas: InsightItem[];
  focusAreas: FocusArea[];
  /** Rare classical yoga/combination call-outs -- empty for most charts, a bonus discovery for the ones that have one. */
  specialCombinations: InsightItem[];
  learningTips: string[];
  timeWasEstimated: boolean;
}
