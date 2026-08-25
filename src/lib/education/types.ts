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
  learningTips: string[];
  timeWasEstimated: boolean;
}
