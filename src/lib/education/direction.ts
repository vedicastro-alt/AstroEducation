import type { BirthChart } from "../astro/types";
import type { PlanetKey } from "../astro/constants";
import { ascendantElement, ascendantModality, moonElement, strengthScore } from "./scoring";
import { citePlacement, renderTieredInsight, tierFromScore, type Tier } from "./narrative";
import type { AgeBand } from "./age";
import { matchDecisionStreamId } from "./decisionMatch";
import type { DirectionStage, FutureDirection } from "./types";

/** "A", "A and B", or "A, B and C" -- same convention as narrative.ts's private joinList, kept local since this file can't import a non-exported helper. */
function joinFields(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Per-stream stage copy, keyed by what a child of that age band actually
 * needs from this chapter -- not just a tier-varied version of the same
 * fixed three stages. "Primary years" is dropped entirely for
 * senior/youngAdult (it's the one stage that's flatly irrelevant to a
 * 17-year-old), "Secondary / teen years" gets a genuinely sharper,
 * decision-facing version for middle and senior bands instead of the
 * same aspirational copy used for a 4-year-old, and "Beyond school" gets
 * real, field-referencing content for senior/youngAdult instead of the
 * generic "though which one is entirely {name}'s to discover" line that
 * repeats regardless of the child's actual age.
 */
interface StageCopy {
  primaryYears: (name: string) => string;
  /** Aspirational, forward-looking framing -- used for early/primary bands, where secondary school is still years away. */
  secondaryYears: Record<Tier, (name: string) => string>;
  /** Sharpened toward a genuine, near-term elective-choice decision -- the 12-year-old persona's exact ask. */
  secondaryYearsMiddle: Record<Tier, (name: string) => string>;
  /** Immediate, present-tense framing for a child actually in or just past this stage. */
  secondaryYearsSenior: Record<Tier, (name: string) => string>;
  /** Generic fallback -- used for early/primary/middle, where "beyond school" is still a distant, abstract stage. */
  beyondSchool: (name: string) => string;
  /** Concrete, field-referencing content for senior/youngAdult, where this is a near-term, real decision. */
  beyondSchoolSenior: Record<Tier, (name: string, fields: string[]) => string>;
}

function buildStages(
  name: string,
  tier: Tier,
  ageBand: AgeBand,
  fields: string[],
  copy: StageCopy,
): DirectionStage[] {
  const isSenior = ageBand === "senior" || ageBand === "youngAdult";
  const stages: DirectionStage[] = [];

  if (!isSenior) {
    stages.push({ label: "Primary years", body: copy.primaryYears(name) });
  }

  const secondaryBody =
    ageBand === "middle"
      ? copy.secondaryYearsMiddle[tier](name)
      : isSenior
        ? copy.secondaryYearsSenior[tier](name)
        : copy.secondaryYears[tier](name);
  stages.push({ label: "Secondary / teen years", body: secondaryBody });

  stages.push({
    label: "Beyond school",
    body: isSenior ? copy.beyondSchoolSenior[tier](name, fields) : copy.beyondSchool(name),
  });

  return stages;
}

interface StreamDefinition {
  id: string;
  title: string;
  essence: string;
  score: (chart: BirthChart) => number;
  /** The single planet this stream's read is anchored to, for citation. */
  leadPlanet: PlanetKey;
  variants: Record<Tier, ((name: string) => string)[]>;
  stageCopy: StageCopy;
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
    stageCopy: {
      primaryYears: (name) =>
        `Keep it playful — puzzles, building sets, and "how does this work" questions are doing real groundwork for ${name}, even if it doesn't look like formal maths or science yet.`,
      secondaryYears: {
        flourishing: (name) =>
          `This is where a leaning toward maths, physics, or computer science often becomes clear. Electives in coding, robotics, or applied science are worth offering even before ${name} asks.`,
        steady: (name) =>
          `Maths, physics, or computer science may or may not stand out as a favourite for ${name} by now, and that's fine either way. Offering electives in coding, robotics, or applied science as one option among several, with no pressure either way, is enough to see what catches.`,
        growing: (name) =>
          `Formal STEM subjects may take more effort to click for ${name} than they do for some children — that doesn't rule them out. A gentle, low-stakes elective (coding, robotics) is worth trying, but there's no need to push it if it doesn't take yet.`,
      },
      secondaryYearsMiddle: {
        flourishing: (name) =>
          `This is often the age where real elective choices start appearing on forms — coding, robotics, or an applied-science option are worth ranking seriously among ${name}'s choices, not just offered as one option to try.`,
        steady: (name) =>
          `As real elective decisions start coming up, coding, robotics, or an applied-science option are worth including on the list of choices to weigh — this chart doesn't argue for ranking it above the other things ${name} is considering, just for keeping it in the mix.`,
        growing: (name) =>
          `If a STEM elective like coding or robotics is one of this year's choices for ${name}, there's no need to rank it at the top based on this chart — it's a reasonable option to include, just not an obvious standout one yet.`,
      },
      secondaryYearsSenior: {
        flourishing: (name) =>
          `With senior subject and university decisions close now, a leaning toward maths, physics, or computer science is worth taking seriously as a real option for ${name} — not the only one, but a strong-fit one worth weighing on its own merits.`,
        steady: (name) =>
          `Maths, physics, or computer science may or may not be the obvious pick among ${name}'s senior subject options right now — this pattern doesn't argue strongly for or against any of them, so genuine interest and how a subject pairs with the others being considered matter more than this chart does.`,
        growing: (name) =>
          `If the more demanding, formal STEM subjects feel like a stretch among ${name}'s current options, that's a reasonable thing to factor into real decisions right now — an applied or more hands-on option in this space is a completely valid choice, not a lesser one.`,
      },
      beyondSchool: (name) =>
        `Fields that reward structured, logical problem-solving tend to fit well here — though which one is entirely ${name}'s to discover.`,
      beyondSchoolSenior: {
        flourishing: (name, fields) =>
          `Fields that reward structured, logical problem-solving — think ${joinFields(fields.slice(0, 3))} — tend to be a strong fit for this pattern specifically, worth weighing seriously among real degree or training options. Which one, though, is entirely ${name}'s call.`,
        steady: (name, fields) =>
          `Fields like ${joinFields(fields.slice(0, 3))} sit reasonably within reach of this pattern, without this chart pointing decisively toward any one of them over a humanities- or arts-leaning path instead. Worth keeping on the list, not the whole list.`,
        growing: (name, fields) =>
          `If a more structured, logic-driven field like ${joinFields(fields.slice(0, 2))} is genuinely of interest to ${name}, this pattern doesn't rule it out — it just suggests it may take more deliberate effort to feel natural than it does for some peers, which is a reason to go in informed, not a reason to avoid it.`,
      },
    },
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
    stageCopy: {
      primaryYears: (name) =>
        `Stories, discussion, and simply being listened to matter a lot here. Reading together and letting ${name} explain their thinking out loud both feed this strength.`,
      secondaryYears: {
        flourishing: (name) =>
          `Subjects like literature, history, languages, psychology, or debate often become a genuine draw for ${name}. Writing for an audience — even a school newsletter or a blog — can be a great outlet.`,
        steady: (name) =>
          `Literature, history, languages, psychology, or debate may or may not stand out as a favourite for ${name} yet — worth offering alongside other subjects rather than assuming it's the natural fit. A low-pressure writing outlet, kept just for them, does no harm either way.`,
        growing: (name) =>
          `Literature, history, and debate may take more encouragement to land for ${name} than for some children. A private outlet for their ideas — a journal, talking it through before writing — can matter more here than an audience does.`,
      },
      secondaryYearsMiddle: {
        flourishing: (name) =>
          `As real elective decisions start coming up — a language, debate, journalism, or a humanities-focused option — this pattern suggests ${name} ranking one of them seriously rather than treating it as the "easy" or default choice.`,
        steady: (name) =>
          `A language, debate, journalism, or humanities elective is worth including among the real choices on the table right now — this chart doesn't argue for ranking it above the other options ${name} is weighing, just for keeping it in view.`,
        growing: (name) =>
          `If a language or humanities elective is one of the real choices in front of ${name}, this pattern doesn't argue against it — it just suggests it may take more deliberate interest-building than some of the other options to feel like a natural fit.`,
      },
      secondaryYearsSenior: {
        flourishing: (name) =>
          `With real subject and university decisions here now, literature, languages, psychology, history, or debate are worth ${name} treating as genuine contenders rather than a fallback from more technical subjects — this pattern suggests real staying power in that direction.`,
        steady: (name) =>
          `Literature, languages, psychology, history, or debate may or may not be where ${name}'s clearest interest sits among current options — this chart doesn't point decisively either way, so it's worth weighing against genuine interest and what pairs well with everything else being considered.`,
        growing: (name) =>
          `If the essay- and discussion-heavy humanities subjects feel like harder work for ${name} right now, that's worth naming honestly rather than pushing through on pattern alone — a subject with a more structured or applied bent might be a better real-world fit, without ruling humanities out for later.`,
      },
      beyondSchool: (name) =>
        `Fields built on understanding people and communicating clearly tend to suit this profile well — though which one is entirely ${name}'s to discover.`,
      beyondSchoolSenior: {
        flourishing: (name, fields) =>
          `Fields built on understanding people and communicating clearly — ${joinFields(fields.slice(0, 3))} among them — tend to suit this pattern well and are worth weighing seriously among real options. Which one, though, is entirely ${name}'s call.`,
        steady: (name, fields) =>
          `Fields like ${joinFields(fields.slice(0, 3))} sit reasonably within reach here, without this chart pointing decisively toward any one of them over a more technical or hands-on path instead.`,
        growing: (name, fields) =>
          `If a communication- or people-focused field like ${joinFields(fields.slice(0, 2))} is genuinely of interest to ${name}, this pattern doesn't rule it out — it may just take more deliberate effort to build confidence in it than it does for some peers.`,
      },
    },
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
    stageCopy: {
      primaryYears: (name) =>
        `Open-ended art, music, and imaginative play are more than enrichment here — they're where ${name} is likely to feel most confident and most themselves.`,
      secondaryYears: {
        flourishing: (name) =>
          `Art, design, music, or media electives are worth taking seriously for ${name} rather than treating as "extra" — this is often where real skill and identity form.`,
        steady: (name) =>
          `Art, design, music, or media electives are worth offering as genuine options for ${name}, without expecting them to be the obvious standout talent — that's simply not yet clear from their chart alone.`,
        growing: (name) =>
          `Art may not be an obvious pull for ${name} yet, and that's completely fine — occasional, low-pressure exposure keeps the door open without needing to be a priority.`,
      },
      secondaryYearsMiddle: {
        flourishing: (name) =>
          `As real elective choices start appearing on forms, an art, design, music, or media option is worth ${name} ranking seriously among them — this is often where genuine skill starts to show, not just where interest is easiest.`,
        steady: (name) =>
          `An art, design, music, or media elective is worth keeping on the list of real choices ${name} is weighing right now — this chart doesn't argue for ranking it above the other options, just for not dismissing it either.`,
        growing: (name) =>
          `If a creative elective is one of the real choices on the table for ${name}, there's no pressure to rank it highly based on this chart — it's a fine option to include, just not the one this pattern points to first.`,
      },
      secondaryYearsSenior: {
        flourishing: (name) =>
          `Art, design, music, or media subjects are worth ${name} treating as a genuine, viable direction now — not a hobby to set aside for something more "practical" — real skill and a real portfolio can both be built from here.`,
        steady: (name) =>
          `Art, design, music, or media subjects may or may not be the standout choice among ${name}'s current options — worth keeping open as one genuine possibility among several rather than assuming it's either the obvious pick or an obvious pass.`,
        growing: (name) =>
          `If the creative subjects don't feel like the natural pick for ${name} right now, that's a reasonable read to trust — occasional creative outlets are still worth keeping around, without needing to build a whole academic direction on them.`,
      },
      beyondSchool: (name) =>
        `Fields that reward a strong aesthetic sense and original thinking tend to be a natural fit — though which one is entirely ${name}'s to discover.`,
      beyondSchoolSenior: {
        flourishing: (name, fields) =>
          `Fields that reward a strong aesthetic sense and original thinking — ${joinFields(fields.slice(0, 3))} among them — tend to be a genuinely strong fit, worth weighing seriously among real degree or portfolio-based options. Which one, though, is entirely ${name}'s call.`,
        steady: (name, fields) =>
          `Fields like ${joinFields(fields.slice(0, 3))} sit reasonably within reach here, without this chart pointing decisively toward a creative path over a more analytical or people-focused one instead.`,
        growing: (name, fields) =>
          `If a creative field like ${joinFields(fields.slice(0, 2))} is genuinely of interest to ${name}, this pattern doesn't rule it out — it may take more deliberate building of a portfolio or confidence than it does for some peers.`,
      },
    },
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
    stageCopy: {
      primaryYears: (name) =>
        `${name} likely learns best by doing — building, moving, taking things apart. Protect real time for this rather than treating it as a break from "real" learning.`,
      secondaryYears: {
        flourishing: (name) =>
          `Hands-on electives — sport, design & technology, culinary, or trades exposure — are worth offering seriously for ${name}; they can build genuine confidence that classroom subjects sometimes don't.`,
        steady: (name) =>
          `Hands-on electives — sport, design & technology, culinary, or trades exposure — are worth offering as one option among several for ${name}, without needing to be singled out as the natural fit.`,
        growing: (name) =>
          `Hands-on subjects may not be an obvious pull for ${name} yet, and that's alright — occasional, low-pressure exposure (a trades taster, a cooking class) keeps the door open without needing to push it.`,
      },
      secondaryYearsMiddle: {
        flourishing: (name) =>
          `As real elective choices start appearing on forms, a hands-on option for ${name} — design & technology, a trade taster, culinary, sport-science-adjacent — is worth ranking seriously, not treated as the "fallback" choice.`,
        steady: (name) =>
          `A hands-on or trade-adjacent elective is worth including among the real choices ${name} is weighing right now — this chart doesn't argue for ranking it above the other options, just for keeping it genuinely in the mix.`,
        growing: (name) =>
          `If a hands-on elective is one of the real choices on the table for ${name}, there's no need to rank it at the top based on this chart — it's a reasonable option to include, particularly if a more classroom-based choice feels like the bigger stretch right now.`,
      },
      secondaryYearsSenior: {
        flourishing: (name) =>
          `Hands-on subjects and pathways — trade-linked electives, design & technology, sport science, culinary training — are worth ${name} treating as a genuine, respected direction now, not a fallback from a purely academic track.`,
        steady: (name) =>
          `Hands-on, trade-linked, or vocational options may or may not stand out among ${name}'s current choices — worth weighing as one genuine, valid option among several rather than the default for a "non-academic" student or an afterthought next to university-track subjects.`,
        growing: (name) =>
          `If hands-on or vocational subjects aren't the obvious pull for ${name} right now, that's worth trusting — a more academic or classroom-based path may simply suit better at this stage, without either track being the "better" one in general.`,
      },
      beyondSchool: (name) =>
        `Fields built around hands-on skill, movement, or practical problem-solving can be just as rich a path as a purely academic one — though which one is entirely ${name}'s to discover.`,
      beyondSchoolSenior: {
        flourishing: (name, fields) =>
          `Fields built around hands-on skill and practical problem-solving — ${joinFields(fields.slice(0, 3))} among them — tend to be a genuinely strong, viable path here, every bit as legitimate as a university-track option. Which one, though, is entirely ${name}'s call.`,
        steady: (name, fields) =>
          `Fields like ${joinFields(fields.slice(0, 3))} sit reasonably within reach here, without this chart pointing decisively toward a hands-on path over a more classroom-based one instead.`,
        growing: (name, fields) =>
          `If a hands-on field like ${joinFields(fields.slice(0, 2))} is genuinely of interest to ${name}, this pattern doesn't rule it out — it may take more deliberate exposure and practice to feel confident in it than it does for some peers.`,
      },
    },
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

/** senior/youngAdult and middle bands where a parent's stated real-world decision is worth a brief, honest acknowledgment -- see HANDOFF §18's middle-school persona. */
const DECISION_AWARE_BANDS: AgeBand[] = ["middle", "senior", "youngAdult"];

/**
 * A short, honestly-scoped acknowledgment of the parent's stated decision.
 * Quotes the decision back verbatim and connects it only in general terms
 * to the stream's essence -- never a verdict on the specific choice,
 * since this is a deterministic astrology engine, not something that has
 * read or understood the parent's form.
 *
 * Two registers, controlled by `matched`:
 * - `matched: true` (the decision text hit a specific stream keyword,
 *   e.g. "coding" -> stem): a direct, confident tie-in.
 * - `matched: false` (the decision was stated but didn't name anything
 *   this engine recognizes -- the common case for open-ended input like
 *   "worried about their future" or "not sure about university," which
 *   is most of what parents actually type): still connects to the
 *   child's primary direction, but says plainly that this reading
 *   doesn't speak to the specific question, rather than staying silent.
 *   Before this, an unmatched decision got zero engagement here at all
 *   -- only a single disclaimed quote-back elsewhere in the reading --
 *   which a real reviewer found meant the field's whole premise ("we'll
 *   keep it in view") was never actually kept for most real answers.
 */
function decisionAcknowledgment(
  decisionFocus: string | undefined,
  ageBand: AgeBand,
  childName: string,
  essence: string,
  matched: boolean,
): string {
  if (!decisionFocus || !DECISION_AWARE_BANDS.includes(ageBand)) return "";
  if (matched) {
    return ` You mentioned ${childName} is weighing "${decisionFocus}" right now — this pattern leans toward ${essence}, which is worth factoring in as one input alongside it, not a verdict on which way to go.`;
  }
  return ` You mentioned ${childName} is weighing "${decisionFocus}" right now — this reading isn't built to speak to that specific question, but ${childName}'s clearest natural pull right now is toward ${essence}, which is worth having in view as the two of you think it through.`;
}

export function buildFutureDirection(
  chart: BirthChart,
  childName: string,
  ageBand: AgeBand,
  decisionFocus?: string,
): FutureDirection {
  const ranked = STREAMS.map((s) => ({ stream: s, score: s.score(chart) })).sort(
    (a, b) => b.score - a.score,
  );
  const primary = ranked[0].stream;
  const primaryTier = tierFromScore(ranked[0].score);
  const runnerUp = ranked[1];

  const includeSecondary = runnerUp.score >= ranked[0].score - 1.5;
  const matchedStreamId = matchDecisionStreamId(decisionFocus);
  const matchesPrimary = matchedStreamId === primary.id;
  const matchesSecondary = includeSecondary && matchedStreamId === runnerUp.stream.id;
  // A decision that didn't match anything still gets engaged with here,
  // on the primary stream (always shown, unlike secondary) -- see
  // decisionAcknowledgment's `matched: false` register. Only skipped when
  // the match landed on secondary instead, to avoid acknowledging the
  // same stated decision twice in one chapter.
  const primaryGetsFallback = Boolean(decisionFocus) && !matchesPrimary && !matchesSecondary;

  const placementNote =
    renderTieredInsight({
      chart,
      name: childName,
      tier: primaryTier,
      leadPlanet: primary.leadPlanet,
      citation: citePlacement(chart, primary.leadPlanet),
      seed: leadSeed(chart, primary.leadPlanet),
      variants: primary.variants,
    }) +
    (matchesPrimary || primaryGetsFallback
      ? decisionAcknowledgment(decisionFocus, ageBand, childName, primary.essence, matchesPrimary)
      : "");

  let secondary: FutureDirection["secondary"];
  if (includeSecondary) {
    const runnerTier = tierFromScore(runnerUp.score);
    const citation = citePlacement(chart, runnerUp.stream.leadPlanet);
    const runnerAcknowledgment = matchesSecondary
      ? decisionAcknowledgment(decisionFocus, ageBand, childName, runnerUp.stream.essence, true)
      : "";
    secondary = {
      title: runnerUp.stream.title,
      body: `${citation} ${runnerUp.stream.blendClose(childName)}${BLEND_SUFFIX[runnerTier]}${runnerAcknowledgment}`,
    };
  }

  return {
    id: primary.id,
    title: primary.title,
    essence: primary.essence,
    placementNote,
    stages: buildStages(childName, primaryTier, ageBand, primary.fields, primary.stageCopy),
    fields: primary.fields,
    secondary,
  };
}
