import type { BirthChart } from "../astro/types";
import { ascendantElement, ascendantModality, moonElement, strengthScore } from "./scoring";
import type { DirectionStage, FutureDirection } from "./types";

interface StreamDefinition {
  id: string;
  title: string;
  essence: string;
  score: (chart: BirthChart) => number;
  stages: (name: string) => DirectionStage[];
  fields: string[];
  blendBody: (name: string) => string;
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
    blendBody: (name) =>
      `${name} also shows a real pull toward logical, structured problem-solving — worth keeping open alongside their creative or people-facing side, not choosing between them too early.`,
  },
  {
    id: "humanities",
    title: "Humanities & Communication Directions",
    essence: "understanding people, ideas, and how to express them well",
    score: (c) =>
      strengthScore(c, "Mercury") * 0.5 +
      strengthScore(c, "Moon") * 0.5 +
      strengthScore(c, "Jupiter") * 0.3,
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
    blendBody: (name) =>
      `${name} also shows real strength in understanding people and expressing ideas — a valuable complement to a more technical direction, not a competing one.`,
  },
  {
    id: "arts",
    title: "Creative Arts & Design Directions",
    essence: "expressing ideas visually, musically, or through design",
    score: (c) => strengthScore(c, "Venus") + strengthScore(c, "Moon") * 0.3,
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
    blendBody: (name) =>
      `${name} also shows a genuine aesthetic and creative sensitivity — worth protecting as a real strength, not just a hobby, even if their main direction lies elsewhere.`,
  },
  {
    id: "practical",
    title: "Practical, Physical & Hands-On Directions",
    essence: "building, moving, and doing — learning by hand rather than by lecture",
    score: (c) =>
      strengthScore(c, "Mars") +
      (ascendantElement(c) === "earth" ? 1 : 0) +
      (moonElement(c) === "earth" ? 0.5 : 0),
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
    blendBody: (name) =>
      `${name} also shows a genuine pull toward hands-on, physical ways of learning — worth building into any path, even an academic one, through movement and real-world projects.`,
  },
];

export function buildFutureDirection(chart: BirthChart, childName: string): FutureDirection {
  const ranked = STREAMS.map((s) => ({ stream: s, score: s.score(chart) })).sort(
    (a, b) => b.score - a.score,
  );
  const primary = ranked[0].stream;
  const runnerUp = ranked[1];

  const includeSecondary = runnerUp.score >= ranked[0].score - 1.5;

  return {
    id: primary.id,
    title: primary.title,
    essence: primary.essence,
    stages: primary.stages(childName),
    fields: primary.fields,
    secondary: includeSecondary
      ? { title: runnerUp.stream.title, body: runnerUp.stream.blendBody(childName) }
      : undefined,
  };
}
