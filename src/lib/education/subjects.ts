import type { BirthChart } from "../astro/types";
import type { PlanetKey } from "../astro/constants";
import {
  ascendantModality,
  fifthHouseElement,
  strengthScore,
} from "./scoring";
import { citePlacement, renderTieredInsight, tierFromScore, type Tier } from "./narrative";
import type { SubjectResult } from "./types";

interface SubjectDefinition {
  id: string;
  name: string;
  score: (chart: BirthChart) => number;
  /** The single planet this subject's read is anchored to, for citation. */
  leadPlanet: PlanetKey;
  title: Record<Tier, string>;
  variants: Record<Tier, ((name: string) => string)[]>;
  tip: Record<Tier, string>;
}

const SUBJECTS: SubjectDefinition[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    score: (c) =>
      strengthScore(c, "Mercury") +
      strengthScore(c, "Saturn") * 0.5 +
      (["earth", "air"].includes(fifthHouseElement(c)) ? 1 : 0),
    leadPlanet: "Mercury",
    title: {
      flourishing: "A natural mathematical mind",
      steady: "A workable relationship with numbers",
      growing: "Maths that needs a hands-on runway",
    },
    variants: {
      flourishing: [
        (name) =>
          `Word problems, patterns, and step-by-step logic puzzles are likely to come more naturally to ${name} than you'd expect — the reasoning behind a method tends to interest them more than the method itself.`,
        (name) =>
          `${name} is likely to enjoy the puzzle-like side of maths specifically — spotting a pattern, finding a shortcut, seeing why a method works — more than most children their age.`,
      ],
      steady: [
        (name) =>
          `${name}'s relationship with maths looks fairly typical — some concepts will click quickly, others will need more practice, without either being the dominant pattern.`,
      ],
      growing: [
        (name) =>
          `Straight arithmetic and memorised procedures — times tables, long division, formula recall — may take more repetition to stick for ${name}, even when their underlying reasoning is sound.`,
        (name) =>
          `${name} may find the abstract symbols of maths genuinely harder to connect with than the real-world logic underneath them — the reasoning is there, the notation is the barrier.`,
      ],
    },
    tip: {
      flourishing: "Even when the reasoning is strong, rote drills (times tables, quick recall) may still need real repetition — that's a separate skill from the logic itself.",
      steady: "Regular, varied practice — not just one method — tends to work better here than either pure drilling or pure exploration.",
      growing: "Physical objects, drawings, or real-world stand-ins (splitting a pizza, counting change) tend to unlock understanding faster than a worksheet alone.",
    },
  },
  {
    id: "reading-language",
    name: "Reading, Writing & Language Arts",
    score: (c) => strengthScore(c, "Mercury") + strengthScore(c, "Moon") * 0.5,
    leadPlanet: "Mercury",
    title: {
      flourishing: "A real gift for words",
      steady: "A workable foundation in reading and writing",
      growing: "Writing that needs the ideas talked through first",
    },
    variants: {
      flourishing: [
        (name) =>
          `${name} is likely to enjoy reading beyond what's assigned, and to write with a natural, expressive voice once they're genuinely interested in the topic.`,
        (name) =>
          `Language is likely to feel like genuine play for ${name} — new words and stories are likely to stick and get reused, not just memorised.`,
      ],
      steady: [
        (name) =>
          `${name}'s reading and writing look like an ordinary, developing skill set — regular reading exposure should build fluency at a normal pace.`,
      ],
      growing: [
        (name) =>
          `The mechanics of writing — spelling, grammar, getting an idea onto the page — may need more patience than the ideas themselves for ${name}, who may have plenty to say and find the writing-it-down part harder.`,
        (name) =>
          `${name} may find the physical, mechanical side of writing a bigger hurdle than actually having something to say.`,
      ],
    },
    tip: {
      flourishing: "Journaling or writing about something they already love tends to produce their best, most fluent writing.",
      steady: "Reading aloud together, even past the age it feels \"necessary,\" keeps vocabulary and fluency growing steadily.",
      growing: "Let them talk an idea through out loud first, even record it, before writing it down — it closes the gap between thought and page.",
    },
  },
  {
    id: "science",
    name: "Science",
    score: (c) =>
      strengthScore(c, "Jupiter") +
      strengthScore(c, "Mercury") * 0.5 +
      (ascendantModality(c) === "mutable" ? 1 : 0),
    leadPlanet: "Jupiter",
    title: {
      flourishing: "A genuine, hands-on scientific curiosity",
      steady: "An ordinary curiosity, ready to be sparked",
      growing: "Science that needs to be made concrete first",
    },
    variants: {
      flourishing: [
        (name) =>
          `Experiments, "why does this happen" questions, and nature-based exploration are likely to hold ${name}'s attention far longer than a textbook chapter.`,
        (name) =>
          `${name} is likely to ask genuinely good "why" and "how" questions about the natural world — the kind worth answering seriously, not brushing off.`,
      ],
      steady: [
        (name) =>
          `${name}'s interest in science looks fairly typical — hands-on activities will likely engage them, same as most children, without an unusual pull toward the subject.`,
      ],
      growing: [
        (name) =>
          `Abstract scientific ideas — invisible forces, chemical formulas, atomic structure — may need to be made concrete before they click for ${name}.`,
        (name) =>
          `${name} may need to physically see or touch a scientific idea before it feels real, rather than taking it on faith from a diagram.`,
      ],
    },
    tip: {
      flourishing: "Biology and environmental science often land especially well before adolescence; physics and chemistry tend to click better once abstract thinking matures in the early teens.",
      steady: "A mix of hands-on experiments and simple explanations tends to keep interest steady without needing anything special.",
      growing: "Models, videos, and real demonstrations do far more here than diagrams in a textbook; there's no rush, scientific thinking tends to run deep once it takes hold.",
    },
  },
  {
    id: "history-social",
    name: "History & Social Studies",
    score: (c) => strengthScore(c, "Jupiter") * 0.6 + strengthScore(c, "Moon") * 0.4,
    leadPlanet: "Jupiter",
    title: {
      flourishing: "History and people, through story",
      steady: "An ordinary interest in the wider world",
      growing: "Facts that need a story to hang onto",
    },
    variants: {
      flourishing: [
        (name) =>
          `${name} is drawn toward history and social studies through people and story rather than dates and facts — a natural curiosity about "why things are the way they are" often shows up here.`,
        (name) =>
          `${name} is likely to connect with history through real human stories — a specific person's life, a family connection — more than abstract timelines.`,
      ],
      steady: [
        (name) =>
          `${name}'s interest in history and social studies looks fairly ordinary — engaging stories will hold their attention, same as for most children.`,
      ],
      growing: [
        (name) =>
          `Memorising dates, names, and sequences of events in isolation may feel dry and hard to hold onto for ${name}.`,
        (name) =>
          `${name} may struggle to see why a historical fact matters unless it's connected to something they already care about.`,
      ],
    },
    tip: {
      flourishing: "Biographies, historical fiction, and 'what was it like to live then' framing tend to work better than a timeline of names and dates.",
      steady: "A good story or documentary tends to do more here than a textbook chapter, regardless of natural inclination.",
      growing: "Anchor facts to a story, a documentary, or a family connection — it tends to stick far better than flashcards.",
    },
  },
  {
    id: "computer-science",
    name: "Computer Science & Coding",
    score: (c) => strengthScore(c, "Mercury") * 0.6 + strengthScore(c, "Saturn") * 0.4,
    leadPlanet: "Mercury",
    title: {
      flourishing: "A real feel for coding logic",
      steady: "A workable, ordinary entry point into coding",
      growing: "Coding that needs a playful, visual start",
    },
    variants: {
      flourishing: [
        (name) =>
          `There's a good chance ${name} takes to the step-by-step, trial-and-error logic of coding and building things digitally — it rewards exactly the patient problem-solving this placement tends to support.`,
        (name) =>
          `${name} is likely to enjoy the puzzle-solving, "why didn't this work" side of coding specifically, more than most children their age.`,
      ],
      steady: [
        (name) =>
          `${name}'s relationship with coding and computational thinking looks fairly typical — a gentle, playful introduction should work as well for them as for most children.`,
      ],
      growing: [
        (name) =>
          `The abstract, symbolic side of programming — syntax, debugging an error you can't see — may be genuinely frustrating for ${name} without a lot of hands-on guidance at first.`,
        (name) =>
          `${name} may find the invisible, exacting nature of code (one typo breaks everything) more frustrating than most children do at this age.`,
      ],
    },
    tip: {
      flourishing: "Simple visual, game-like coding tools (Scratch and similar) are a great low-pressure entry point at this age, well before text-based code.",
      steady: "Visual, game-like tools remain the best starting point regardless of natural inclination — text-based code can wait.",
      growing: "Start with visual, game-like tools rather than text-based code; early frustration fades quickly once the logic clicks through play.",
    },
  },
  {
    id: "visual-arts",
    name: "Visual Arts & Design",
    score: (c) => strengthScore(c, "Venus"),
    leadPlanet: "Venus",
    title: {
      flourishing: "A genuine joy in art and making",
      steady: "An ordinary, open relationship with art",
      growing: "Art as play, not performance",
    },
    variants: {
      flourishing: [
        (name) =>
          `Art, design, and hands-on making look like a genuine source of joy and confidence for ${name}, not just a break from "real" schoolwork.`,
        (name) =>
          `${name} is likely to reach for drawing, building, or making things as a natural way to process ideas and feelings, not just as a hobby.`,
      ],
      steady: [
        (name) =>
          `${name}'s relationship with art and design looks fairly ordinary — enjoyment is likely to depend on the specific activity, without an unusual pull either way.`,
      ],
      growing: [
        (name) =>
          `Art may not come as naturally or confidently to ${name} as other areas, and that's completely fine — it doesn't need to be a strength to be worthwhile.`,
        (name) =>
          `${name} may feel more self-conscious about art than about more "correct answer" subjects, since there's no clear right or wrong.`,
      ],
    },
    tip: {
      flourishing: "Open-ended projects bring out their best work — resist the urge to grade or correct these too closely.",
      steady: "Open-ended, low-pressure art time works well here regardless of natural talent — the point is the process, not the product.",
      growing: "Frame it as play rather than performance — there's no 'right' way to do it — and it stays enjoyable even if it's never where their talent lies.",
    },
  },
  {
    id: "music",
    name: "Music",
    score: (c) => strengthScore(c, "Venus") * 0.5 + strengthScore(c, "Moon") * 0.5,
    leadPlanet: "Venus",
    title: {
      flourishing: "A natural feel for music",
      steady: "An ordinary, open relationship with music",
      growing: "Music that wants to stay playful and low-stakes",
    },
    variants: {
      flourishing: [
        (name) => `${name} shows a natural feel for rhythm, melody, or emotional expression through sound.`,
        (name) => `${name} is likely to pick up rhythm and melody with real ease, often without formal teaching, just from exposure.`,
      ],
      steady: [
        (name) =>
          `${name}'s relationship with music looks fairly ordinary — enjoyment will likely depend on exposure and interest, without an unusual natural pull.`,
      ],
      growing: [
        (name) =>
          `Formal music training — reading notation, structured practice — may need more patience from ${name} than a natural feel for music would suggest.`,
        (name) =>
          `${name} may enjoy music more as a listener or mover (dancing, singing along) than as a formal performer at first.`,
      ],
    },
    tip: {
      flourishing: "Even informal exposure — singing along, a simple instrument, clapping out rhythms — is likely to be picked up with real ease.",
      steady: "Informal, playful exposure works well here regardless of natural inclination — singing, simple instruments, rhythm games.",
      growing: "Keep early music experiences playful and low-stakes; that does more good than starting formal lessons before they're ready.",
    },
  },
  {
    id: "public-speaking",
    name: "Public Speaking, Drama & Leadership",
    score: (c) => strengthScore(c, "Sun") + strengthScore(c, "Mars") * 0.5,
    leadPlanet: "Sun",
    title: {
      flourishing: "A genuine wish to be heard",
      steady: "An ordinary comfort with speaking up",
      growing: "Confidence that builds with a small, safe audience",
    },
    variants: {
      flourishing: [
        (name) =>
          `There's a real wish to be heard here — a class presentation or small stage moment can become a genuine source of pride rather than nerves for ${name}.`,
        (name) =>
          `${name} is likely to enjoy having an audience, even a small one — explaining, performing, or leading tends to feel natural rather than draining.`,
      ],
      steady: [
        (name) =>
          `${name}'s comfort with speaking in front of others looks fairly ordinary — confidence will likely build gradually with practice, same as for most children.`,
      ],
      growing: [
        (name) =>
          `Speaking up in front of a group may not come easily to ${name} at first, and that's worth respecting rather than pushing past too quickly.`,
        (name) =>
          `${name} may prefer to observe and process before speaking up, which can look like shyness but is often just a different pace.`,
      ],
    },
    tip: {
      flourishing: "Give low-stakes chances to lead — explaining a game's rules to a friend, presenting a school project — it builds this early.",
      steady: "Regular, low-pressure chances to speak up, at home and with friends, build this steadily over time.",
      growing: "Start with a small, familiar audience before a classroom of peers — it builds real confidence rather than anxiety.",
    },
  },
  {
    id: "physical-education",
    name: "Physical Education & Sports",
    score: (c) => strengthScore(c, "Mars"),
    leadPlanet: "Mars",
    title: {
      flourishing: "A genuine strength in movement and sport",
      steady: "An ordinary relationship with physical activity",
      growing: "Movement that's best kept unstructured, for now",
    },
    variants: {
      flourishing: [
        (name) =>
          `Physical activity looks like a genuine strength and outlet for ${name}, not just recess — it can build real confidence that carries over into the classroom.`,
        (name) =>
          `${name} is likely to have real physical confidence and drive — movement is likely to be an outlet, not just an obligation.`,
      ],
      steady: [
        (name) =>
          `${name}'s relationship with physical activity looks fairly typical — regular movement and play will serve them well, same as for most children.`,
      ],
      growing: [
        (name) =>
          `Structured sport — rules, coordination, competition — may take more patience for ${name} to enjoy than free play does.`,
        (name) =>
          `${name} may prefer solo or low-competition movement (biking, swimming, dancing) over team sports at first.`,
      ],
    },
    tip: {
      flourishing: "Movement breaks during homework time will likely help focus, not hurt it — don't be afraid to let them fidget or pace while thinking.",
      steady: "A healthy mix of structured and free physical play tends to work well here regardless of natural inclination.",
      growing: "Unstructured active play (biking, climbing, dancing around the living room) is just as valuable at this age, and keeps the door open for structured sport later.",
    },
  },
];

export interface SubjectGuidance {
  inclined: SubjectResult[];
  support: SubjectResult[];
}

function renderSubject(def: SubjectDefinition, chart: BirthChart, childName: string): SubjectResult {
  const tier = tierFromScore(def.score(chart));
  const body = renderTieredInsight({
    chart,
    name: childName,
    tier,
    leadPlanet: def.leadPlanet,
    citation: citePlacement(chart, def.leadPlanet),
    seed: chart.planets.find((p) => p.key === def.leadPlanet)?.rashi.degreeInRashi ?? 0,
    variants: def.variants,
  });
  return { id: def.id, name: def.name, body, tip: def.tip[tier] };
}

export function buildSubjectGuidance(
  chart: BirthChart,
  childName: string,
): SubjectGuidance {
  const ranked = SUBJECTS.map((s) => ({ subject: s, score: s.score(chart) })).sort(
    (a, b) => b.score - a.score,
  );

  const inclined = ranked.slice(0, 4).map(({ subject }) => renderSubject(subject, chart, childName));
  const support = ranked
    .slice(-3)
    .reverse()
    .map(({ subject }) => renderSubject(subject, chart, childName));

  return { inclined, support };
}

export { SUBJECTS };
