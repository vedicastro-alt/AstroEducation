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
