import type { BirthChart } from "../astro/types";
import type { Element, Modality } from "../astro/dignity";
import { buildDashaTimeline, currentDasha, nextDasha } from "../astro/dasha";
import { DASHA_LEARNING_THEMES } from "./dasha-themes";
import { buildSubjectGuidance } from "./subjects";
import { buildFutureDirection } from "./direction";
import {
  ascendantElement,
  ascendantModality,
  moonElement,
  planetByKey,
} from "./scoring";
import type { LearningPathway } from "./types";

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function ageInYears(dob: string, asOf: Date): number {
  const birth = new Date(dob + "T00:00:00Z");
  let age = asOf.getUTCFullYear() - birth.getUTCFullYear();
  const hasHadBirthdayThisYear =
    asOf.getUTCMonth() > birth.getUTCMonth() ||
    (asOf.getUTCMonth() === birth.getUTCMonth() && asOf.getUTCDate() >= birth.getUTCDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return Math.max(0, age);
}

interface AgeBand {
  title: string;
  body: (name: string) => string;
}

function ageBandFor(age: number): AgeBand {
  if (age <= 5) {
    return {
      title: "Early Years — Foundational Play & Discovery",
      body: (name) =>
        `At this age, ${name}'s chart is best explored through play rather than formal lessons. Short, sensory, hands-on activities in the areas below will do far more good than worksheets.`,
    };
  }
  if (age <= 10) {
    return {
      title: "Primary Years — Building Core Skills",
      body: (name) =>
        `This is a wonderful window for ${name} to build core skills and habits in the areas below, while the joy of learning is still forming. Keep sessions short, frequent, and low-pressure.`,
    };
  }
  if (age <= 13) {
    return {
      title: "Tween Years — Deepening Interests",
      body: (name) =>
        `${name} is likely ready to go deeper into subjects that genuinely interest them now, with a bit more independence. This is a good age to start letting them choose, within the areas below.`,
    };
  }
  if (age <= 17) {
    return {
      title: "Teen Years — Focused Mastery & Direction",
      body: (name) =>
        `${name} is likely forming a stronger sense of direction now. This is a good time to connect the areas below to real goals, mentors, and a growing sense of ownership over their own learning.`,
    };
  }
  return {
    title: "Young Adult Years — Direction & Independence",
    body: (name) =>
      `${name} is likely charting their own course now. The areas below can still offer a useful lens on natural strengths as they choose a path of study or work.`,
  };
}

const STUDY_SPACE_TIP: Record<Element, string> = {
  earth: "A tidy, consistent desk or corner tends to work best — the same spot, the same supplies, every time.",
  water: "A cozy, calm nook away from noise and bustle helps concentration settle in comfortably.",
  fire: "A space with room to move — a standing option, floor cushions, or the freedom to pace — supports focus more than a rigid desk.",
  air: "A space where they can think out loud, sketch on a whiteboard, or chat through ideas tends to help understanding click.",
};

const ROUTINE_TIP: Record<Modality, string> = {
  cardinal: "Let them kick off new topics or projects — novelty and a fresh start genuinely energize learning here.",
  fixed: "A steady, predictable routine pays off — frequent changes to plans or schedule tend to cause friction.",
  mutable: "Keep some flexibility in the schedule — too rigid a routine can feel stifling, while variety keeps things fresh.",
};

const SOCIAL_TIP: Record<Element, string> = {
  earth: "Comfortable with steady one-on-one attention — a consistent tutor or parent-led session often works better than a large group.",
  water: "Sensitive to mood and atmosphere — small, gentle, familiar groups tend to work far better than big or loud ones.",
  fire: "Energized by a bit of friendly competition or a lively group — pair them with peers when motivation dips.",
  air: "Genuinely enjoys learning alongside others — discussion, debate, and group work tend to bring ideas to life.",
};

export function buildLearningPathway(
  chart: BirthChart,
  dob: string,
  childName: string,
  now: Date = new Date(),
): LearningPathway {
  const age = ageInYears(dob, now);
  const band = ageBandFor(age);

  const birthDate = new Date(dob + "T00:00:00Z");
  const moon = planetByKey(chart, "Moon");
  const timeline = buildDashaTimeline(birthDate, moon.siderealLongitude);
  const current = currentDasha(timeline, now);
  const next = nextDasha(timeline, current);

  const currentTheme = DASHA_LEARNING_THEMES[current.lord];
  const nextTheme = next ? DASHA_LEARNING_THEMES[next.lord] : null;

  const el = ascendantElement(chart);
  const mod = ascendantModality(chart);
  const moonEl = moonElement(chart);

  const { inclined: subjectsInclined, support: subjectsSupport } = buildSubjectGuidance(
    chart,
    childName,
  );
  const futureDirection = buildFutureDirection(chart, childName);
  const topSubject = subjectsInclined[0];
  const supportSubject = subjectsSupport[0];

  return {
    ageLabel: `${childName} is currently ${age} year${age === 1 ? "" : "s"} old`,
    ageBandTitle: band.title,
    ageBandBody: band.body(childName),
    currentChapter: {
      lord: current.lord,
      title: currentTheme.title,
      body: currentTheme.body(childName),
      startLabel: formatMonthYear(current.start),
      endLabel: formatMonthYear(current.end),
    },
    nextChapter: next && nextTheme
      ? {
          lord: next.lord,
          title: nextTheme.title,
          body: nextTheme.body(childName),
          startLabel: formatMonthYear(next.start),
          endLabel: formatMonthYear(next.end),
          startsInLabel: formatMonthYear(next.start),
        }
      : null,
    subjectsInclined,
    subjectsSupport,
    futureDirection,
    environment: [
      {
        id: "space",
        title: "Study space",
        body: `${chart.ascendant.name} rising: ${STUDY_SPACE_TIP[el]}`,
      },
      {
        id: "routine",
        title: "Routine & pacing",
        body: `${chart.ascendant.name} rising: ${ROUTINE_TIP[mod]}`,
      },
      {
        id: "social",
        title: "Social setting",
        body: `Moon in ${moon.rashi.name}: ${SOCIAL_TIP[moonEl]}`,
      },
    ],
    weeklyRhythm: [
      `Give "${topSubject.name}" a short, dedicated block most days — little and often builds real momentum here.`,
      `Keep "${supportSubject.name}" light, frequent, and low-pressure — enough exposure to stay confident, without expecting it to feel effortless.`,
      "Leave real unstructured downtime in the week — rest is part of how any child consolidates learning, not time lost from it.",
    ],
    closing: `Remember: this pathway is a gentle starting lens, not a fixed script. ${childName}'s own curiosity, effort, and the people around them will shape their journey far more than any chart.`,
  };
}
