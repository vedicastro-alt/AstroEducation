"use client";

import { useState } from "react";
import type { BirthChart } from "@/lib/astro/types";
import type { EducationInsights, LearningPathway } from "@/lib/education/types";
import type { GentleRemedy } from "@/lib/education/remedies";
import type { CareerDeepDiveItem } from "@/lib/education/careerDeepDive";
import type { ReportMeta, ReportTier } from "@/lib/reports/store";
import { ReportView } from "./ReportView";

export interface SampleChild {
  key: string;
  label: string;
  blurb: string;
  reportId: string;
  tier: ReportTier;
  chart: BirthChart;
  insights: EducationInsights;
  pathway: LearningPathway;
  remedies: GentleRemedy[];
  careerDeepDive: CareerDeepDiveItem[];
  meta: ReportMeta;
}

export function SampleReadingTabs({ readings }: { readings: SampleChild[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = readings[activeIndex];

  return (
    <div>
      <div role="tablist" aria-label="Choose a sample reading" className="no-print flex flex-wrap justify-center gap-2">
        {readings.map((child, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={child.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(index)}
              className={`rounded-md border px-4 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                  : "border-primary/20 bg-white text-primary-dark hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <span className="block font-semibold">{child.label}</span>
              <span className={`block text-xs ${isActive ? "text-white/80" : "text-primary-dark/60"}`}>
                {child.blurb} · {child.tier === "premium" ? "$35 tier" : "$25 tier"}
              </span>
            </button>
          );
        })}
      </div>
      <ReportView
        key={active.key}
        reportId={active.reportId}
        chart={active.chart}
        insights={active.insights}
        pathway={active.pathway}
        remedies={active.remedies}
        careerDeepDive={active.careerDeepDive}
        tier={active.tier}
        meta={active.meta}
      />
    </div>
  );
}
