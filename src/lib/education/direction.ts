import type { BirthChart } from "../astro/types";
import type { PlanetKey } from "../astro/constants";
import { ascendantElement, ascendantModality, moonElement, strengthScore } from "./scoring";
import { citePlacement, renderTieredInsight, tierFromScore, type Tier } from "./narrative";
import type { DirectionStage, FutureDirection } from "./types";

interface StreamDefinition {
  id: string;
  title: string;
  essence: string;
  score: (chart: BirthChart) => number;
  /** The single planet this stream's read is anchored to, for citation. */
  leadPlanet: PlanetKey;
  variants: Record<Tier, ((name: string) => string)[]>;
  stages: (name: string) => DirectionStage[];
  fields: string[];
  /** Stream-specific description of the secondary pull, when this stream is the runner-up. */
  blendClose: (name: string) => string;
}

const STREAMS: StreamDefinition[] = [
  {
    id: "stem",
    title: "Analytical & STEM Directions",
    essence: "figuring out how things work, and solving problems logically",
    score: (c) =>
      strengthScore(c, "Mercury") +
      strengthScore(c, "Saturn") * 0.4 +
      strengthScore(c, "Jupiter") * 0.3 +
      (ascendantModality(c) === "mutable" ? 0.5 : 0),
    leadPlanet: "Mercury",
    variants: {
      flourishing: [
        (name) =>
          `${name} shows a real, dependable pull toward figuring out how things work and solving problems logically — the kind of thinking that tends to show up early and stay consistent.`,
        (name) =>
          `Logical, structured problem-solving looks like a genuine strength for ${name} — puzzles, systems, and "how does this work" questions are likely to hold real, lasting appeal.`,
      ],
      steady: [
        (name) =>
          `${name} shows an ordinary, workable interest in logical problem-solving — present, but not yet a standout pull compared to other directions.`,
      ],
      growing: [
        (name) =>
          `Structured, analytical problem-solving may take more deliberate encouragement to develop in ${name} than it does for some children — the interest can still grow, it's just not the most natural starting point.`,
        (name) =>
          `${name} may need real hands-on framing (building, tinkering) before purely logical or abstract problem-solving starts to genuinely interest them.`,
      ],
    },
    stages: (name) => [
      {
        label: "Primary years",
        body: `Keep it playful — puzzles, building sets, and "how does this work" questions are doing real groundwork for ${name}, even if it doesn't look like formal maths or science yet.`,
      },
      {
        label: "Secondary / teen years",
        body: `This is where a leaning toward maths, physics, or computer science often becomes clear. Electives in coding, robotics, or applied science are worth offering even before they ask.`,
      },
      {
        label: "Beyond school",
        body: `Fields that reward structured, logical problem-solving tend to fit well here — though which one is entirely ${name}'s to discover.`,
      },
    ],
    fields: ["Engineering", "Computer Science", "Medicine & Health Sciences", "Applied Sciences", "Architecture"],
    blendClose: (name) =>
      `${name} also shows a real pull toward logical, structured problem-solving,`,
  },
  {
    id: "humanities",
    title: "Humanities & Communication Directions",
    essence: "understanding people, ideas, and how to express them well",
    score: (c) =>
      strengthScore(c, "Mercury") * 0.5 +
      strengthScore(c, "Moon") * 0.5 +
      strengthScore(c, "Jupiter") * 0.3,
    leadPlanet: "Moon",
    variants: {
      flourishing: [
        (name) =>
          `${name} shows a real, dependable pull toward understanding people, ideas, and expressing them well — connection and communication are likely to be genuine strengths, not just skills.`,
        (name) =>
          `Understanding people and ideas looks like a natural gift for ${name} — conversation, story, and genuine curiosity about others are likely to come easily.`,
      ],
      steady: [
        (name) =>
          `${name} shows an ordinary, workable interest in people and communication — present, but not yet a standout pull compared to other directions.`,
      ],
      growing: [
        (name) =>
          `Expressing ideas and connecting with others through words may take more deliberate encouragement to develop in ${name} than it does for some children.`,
        (name) =>
          `${name} may need real one-on-one connection, rather than a group setting, before their genuine capacity for understanding people and ideas has room to show.`,
      ],
    },
    stages: (name) => [
      {
        label: "Primary years",
        body: `Stories, discussion, and simply being listened to matter a lot here. Reading together and letting ${name} explain their thinking out loud both feed this strength.`,
      },
      {
        label: "Secondary / teen years",
        body: `Subjects like literature, history, languages, psychology, or debate often become a genuine draw. Writing for an audience — even a school newsletter or a blog — can be a great outlet.`,
      },
      {
        label: "Beyond school",
        body: `Fields built on understanding people and communicating clearly tend to suit this profile well.`,
      },
    ],
    fields: ["Law", "Journalism & Media", "Education", "Psychology", "Public Policy"],
    blendClose: (name) =>
      `${name} also shows real strength in understanding people and expressing ideas,`,
  },
  {
    id: "arts",
    title: "Creative Arts & Design Directions",
    essence: "expressing ideas visually, musically, or through design",
    score: (c) => strengthScore(c, "Venus") + strengthScore(c, "Moon") * 0.3,
    leadPlanet: "Venus",
    variants: {
      flourishing: [
        (name) =>
          `${name} shows a real, dependable pull toward expressing ideas visually, musically, or through design — this is likely to be a genuine strength, not just an enjoyable hobby.`,
        (name) =>
          `Creative and aesthetic expression looks like a natural gift for ${name} — visual, musical, or design-minded thinking is likely to come with real ease.`,
      ],
      steady: [
        (name) =>
          `${name} shows an ordinary, workable interest in creative expression — present, but not yet a standout pull compared to other directions.`,
      ],
      growing: [
        (name) =>
          `Creative, aesthetic expression may take more deliberate encouragement to develop in ${name} than it does for some children — that's fine, it doesn't need to be a defining trait to be worthwhile.`,
        (name) =>
          `${name} may need low-pressure, playful creative outlets before any genuine aesthetic sensitivity has room to show.`,
      ],
    },
    stages: (name) => [
      {
        label: "Primary years",
        body: `Open-ended art, music, and imaginative play are more than enrichment here — they're where ${name} is likely to feel most confident and most themselves.`,
      },
      {
        label: "Secondary / teen years",
        body: `Art, design, music, or media electives are worth taking seriously rather than treating as "extra" — this is often where real skill and identity form.`,
      },
      {
        label: "Beyond school",
        body: `Fields that reward a strong aesthetic sense and original thinking tend to be a natural fit.`,
      },
    ],
    fields: ["Design (graphic, product, UX)", "Architecture", "Media & Film", "Music", "Creative Writing & Marketing"],
    blendClose: (name) =>
      `${name} also shows a genuine aesthetic and creative sensitivity,`,
  },
  {
    id: "practical",
    title: "Practical, Physical & Hands-On Directions",
    essence: "building, moving, and doing — learning by hand rather than by lecture",
    score: (c) =>
      strengthScore(c, "Mars") +
      (ascendantElement(c) === "earth" ? 1 : 0) +
      (moonElement(c) === "earth" ? 0.5 : 0),
    leadPlanet: "Mars",
    variants: {
      flourishing: [
        (name) =>
          `${name} shows a real, dependable pull toward building, moving, and doing — learning by hand is likely to be a genuine strength, not just a preference.`,
        (name) =>
          `Hands-on, physical learning looks like a natural strength for ${name} — building, moving, and doing are likely to come with real confidence.`,
      ],
      steady: [
        (name) =>
          `${name} shows an ordinary, workable interest in hands-on, physical learning — present, but not yet a standout pull compared to other directions.`,
      ],
      growing: [
        (name) =>
          `Hands-on, physical engagement may take more deliberate encouragement to develop in ${name} than it does for some children.`,
        (name) =>
          `${name} may need real, low-stakes physical play before genuine confidence in hands-on learning has room to show.`,
      ],
    },
    stages: (name) => [
      {
        label: "Primary years",
        body: `${name} likely learns best by doing — building, moving, taking things apart. Protect real time for this rather than treating it as a break from "real" learning.`,
      },
      {
        label: "Secondary / teen years",
        body: `Hands-on electives — sport, design & technology, culinary, or trades exposure — are worth offering seriously; they can build genuine confidence that classroom subjects sometimes don't.`,
      },
      {
        label: "Beyond school",
        body: `Fields built around hands-on skill, movement, or practical problem-solving can be just as rich a path as a purely academic one.`,
      },
    ],
    fields: ["Skilled Trades & Vocational Careers", "Sports, Coaching & Physical Therapy", "Culinary Arts", "Applied Engineering", "Hands-on Entrepreneurship"],
    blendClose: (name) =>
      `${name} also shows a genuine pull toward hands-on, physical ways of learning,`,
  },
];

const BLEND_SUFFIX: Record<Tier, string> = {
  flourishing:
    " and it's a genuinely strong showing too — worth keeping open alongside their primary direction, not choosing between them too early.",
  steady: " a solid secondary thread, worth keeping open alongside their primary direction.",
  growing:
    " a gentler secondary thread for now, but still worth keeping in view alongside their primary direction.",
};

function leadSeed(chart: BirthChart, key: PlanetKey): number {
  return chart.planets.find((p) => p.key === key)?.rashi.degreeInRashi ?? 0;
}

export function buildFutureDirection(chart: BirthChart, childName: string): FutureDirection {
  const ranked = STREAMS.map((s) => ({ stream: s, score: s.score(chart) })).sort(
    (a, b) => b.score - a.score,
  );
  const primary = ranked[0].stream;
  const primaryTier = tierFromScore(ranked[0].score);
  const runnerUp = ranked[1];

  const includeSecondary = runnerUp.score >= ranked[0].score - 1.5;

  const placementNote = renderTieredInsight({
    chart,
    name: childName,
    tier: primaryTier,
    leadPlanet: primary.leadPlanet,
    citation: citePlacement(chart, primary.leadPlanet),
    seed: leadSeed(chart, primary.leadPlanet),
    variants: primary.variants,
  });

  let secondary: FutureDirection["secondary"];
  if (includeSecondary) {
    const runnerTier = tierFromScore(runnerUp.score);
    const citation = citePlacement(chart, runnerUp.stream.leadPlanet);
    secondary = {
      title: runnerUp.stream.title,
      body: `${citation} ${runnerUp.stream.blendClose(childName)}${BLEND_SUFFIX[runnerTier]}`,
    };
  }

  return {
    id: primary.id,
    title: primary.title,
    essence: primary.essence,
    placementNote,
    stages: primary.stages(childName),
    fields: primary.fields,
    secondary,
  };
}
