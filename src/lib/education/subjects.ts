import type { BirthChart } from "../astro/types";
import type { PlanetKey } from "../astro/constants";
import {
  ascendantModality,
  fifthHouseElement,
  strengthScore,
} from "./scoring";
import { citePlacement, renderTieredInsight, tierFromScore, type Tier } from "./narrative";
import type { AgeBand } from "./age";
import { matchDecisionSubjectId } from "./decisionMatch";
import type { SubjectResult } from "./types";

/**
 * Age is a second, orthogonal axis on top of the existing flourishing/
 * steady/growing strength tier -- not a replacement for it. A missing
 * entry for a given age band simply falls back to the base tier text
 * below, so most subjects only need an override where the base copy
 * would otherwise read as age-inappropriate (see HANDOFF §18: a 17-year-
 * old's reading recommending "reading aloud together" and "a visible
 * daily routine chart" was the exact complaint that made a paying parent
 * trust the reading LESS).
 */
interface AgeOverride {
  variants?: Partial<Record<Tier, ((name: string) => string)[]>>;
  tip?: Partial<Record<Tier, string>>;
}

/** senior and youngAdult share the same "real elective / real course choice" register, so most overrides apply to both at once. */
const SENIOR_BANDS: AgeBand[] = ["senior", "youngAdult"];

function forSeniorBands(override: AgeOverride): Partial<Record<AgeBand, AgeOverride>> {
  return Object.fromEntries(SENIOR_BANDS.map((band) => [band, override])) as Partial<
    Record<AgeBand, AgeOverride>
  >;
}

interface SubjectDefinition {
  id: string;
  name: string;
  score: (chart: BirthChart) => number;
  /** The single planet this subject's read is anchored to, for citation. */
  leadPlanet: PlanetKey;
  title: Record<Tier, string>;
  variants: Record<Tier, ((name: string) => string)[]>;
  tip: Record<Tier, string>;
  ageOverrides?: Partial<Record<AgeBand, AgeOverride>>;
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
    ageOverrides: {
      middle: {
        tip: {
          flourishing: "This is a good age to notice whether the pull is toward the how (applying a method) or the why (understanding it) — that instinct is worth watching as more demanding maths options start appearing on elective forms in a couple of years.",
        },
      },
      ...forSeniorBands({
        variants: {
          flourishing: [
            (name) =>
              `${name}'s pattern favours the more demanding, abstract end of senior maths — built around proof and formal reasoning rather than everyday application — and tends to hold up well under that pace.`,
          ],
          steady: [
            (name) =>
              `${name}'s maths pattern doesn't point clearly toward the more abstract, proof-heavy senior track over the more applied, general one — either could genuinely suit, and interest and teacher fit are likely to matter more than this chart does.`,
          ],
          growing: [
            (name) =>
              `The more applied or general senior maths track — built around real-world use rather than abstract proof and formal notation — is likely to suit ${name} better than the heavier theory-first option, without closing off anything permanently.`,
          ],
        },
        tip: {
          flourishing: "If a more demanding, abstract senior maths option is on the table, this pattern suggests it's worth taking seriously rather than defaulting to the easier track out of caution.",
          steady: "Worth sitting down with an actual course outline together — the choice between the more abstract and the more applied senior maths track usually comes down to what it needs to pair with, not this chart alone.",
          growing: "An applied or general maths option, built around real-world use rather than abstract proof, is a completely valid choice here — it doesn't close off any career path that isn't itself maths-heavy.",
        },
      }),
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
    // The base tip above ("Let them talk... even record it") is
    // parent-coached, early-years phrasing -- fine for that age, but a
    // parent flagged it reading as too young once it showed up for an
    // 11-13-year-old, since (unlike mathematics/science/computer-science)
    // this subject previously had a senior-band override but nothing for
    // "middle" specifically, so a tween fell straight back to that
    // early-years tip with no age-appropriate stop in between.
    ageOverrides: {
      middle: {
        tip: {
          flourishing: "A blog, a school newsletter, or writing to share with friends tends to bring out real fluency at this age — a genuine audience matters more now than it used to.",
          steady: "Reading things they've picked themselves, not just assigned texts, tends to keep vocabulary and fluency building at this age more than reading aloud together the way it worked when they were younger.",
          growing: "Talking an idea through out loud first, or trying a quick voice note before typing, still closes the gap between having something to say and getting it onto the page — worth trying now, not just something for younger kids.",
        },
      },
      ...forSeniorBands({
        tip: {
          flourishing: "Writing for a real audience — a blog, a school paper, even a personal essay for university applications — tends to bring out their most fluent, motivated writing at this age.",
          steady: "Reading widely outside of set texts — real articles, essays, genuinely good nonfiction — keeps vocabulary and fluency growing at this age, more than any single structured exercise would.",
          growing: "Talking an idea through out loud first, or using voice-to-text, then editing it into shape, still closes the gap between having something to say and getting it onto the page — a genuinely useful approach at any age, including now.",
        },
      }),
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
    ageOverrides: {
      middle: {
        tip: {
          flourishing: "The next couple of years tend to be when 'science' splits into separate subjects — for now, protecting the hands-on curiosity matters more than which specific electives come later.",
        },
      },
      ...forSeniorBands({
        variants: {
          flourishing: [
            (name) =>
              `${name}'s pattern suggests real staying power across the separate science electives — Chemistry, Biology, and Physics each ask for a different kind of thinking, and this placement doesn't point toward struggling with any one of them over the others.`,
          ],
          steady: [
            (name) =>
              `${name}'s pattern doesn't point clearly toward one separate science elective over another — Chemistry, Biology, and Physics each lean on a slightly different kind of thinking, and which one clicks is likely to come down to the teacher and the specific topics covered, not this chart.`,
          ],
          growing: [
            (name) =>
              `Of the separate science electives, the more concrete, observable ones — Biology in particular — are likely to feel more accessible to ${name} than the more abstract, formula-heavy end of Physics or Chemistry, at least at first.`,
          ],
        },
        tip: {
          flourishing: "If there's room to take more than one separate science elective, this pattern doesn't argue against it — the abstract-thinking maturity that Physics and Chemistry lean on tends to already be there.",
          steady: "Sitting in on a taster class, or asking older students what each separate science elective is actually like day-to-day, is likely to tell you more than this chart can about which one to pick.",
          growing: "If only one separate science elective is required, Biology's more concrete, observable subject matter is a reasonable lower-friction starting point — nothing here rules out Chemistry or Physics later.",
        },
      }),
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
    ageOverrides: forSeniorBands({
      tip: {
        flourishing: "If History or a related humanities elective is on the table, the same pull toward story over pure fact-recall tends to carry through — worth weighing seriously rather than treating it as the 'soft' option.",
        steady: "A good documentary or narrative account still tends to help more than a dense textbook chapter at this age — that instinct doesn't really change with age, it's just as true picking a senior elective as it was earlier.",
        growing: "If History ends up a required subject rather than a preferred one, anchoring facts to a real account or documentary still helps more than flashcards — the same trick just keeps working.",
      },
    }),
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
    ageOverrides: {
      middle: {
        variants: {
          flourishing: [
            (name) =>
              `Coding is a genuinely reasonable elective for ${name} to rank highly if it's one of the real choices on offer — the step-by-step, trial-and-error logic it rewards is one of this chart's more dependable patterns.`,
          ],
          steady: [
            (name) =>
              `${name}'s pattern doesn't clearly favour a coding elective over other real options on offer right now — it's a reasonable choice to include, without this chart arguing for ranking it above whatever else is being weighed.`,
          ],
          growing: [
            (name) =>
              `If coding is one of the real elective choices in front of ${name}, this pattern doesn't argue against it — it just suggests a more visual, project-based version of it is likely to land better than a syntax-first one.`,
          ],
        },
        tip: {
          flourishing: "As real elective choices start appearing on forms, this is one worth ranking seriously — not just offering as one option to try.",
          steady: "As real elective choices start appearing on forms, treat this pattern as one input among several, not the deciding one — genuine interest and what pairs well with the other choices matter just as much.",
          growing: "If coding is a required option rather than a preferred one, project- or game-design-flavoured courses tend to land better than a pure syntax-first one for this pattern.",
        },
      },
      ...forSeniorBands({
        variants: {
          flourishing: [
            (name) =>
              `Computer Science is a genuinely strong elective option for ${name} to weigh against other choices — the systematic, trial-and-error thinking it rewards is one of this chart's more dependable patterns.`,
          ],
          steady: [
            (name) =>
              `Computer Science doesn't stand out clearly over other elective options for ${name}, but it doesn't argue against it either — worth weighing on genuine interest and what it needs to pair with, not on this pattern alone.`,
          ],
          growing: [
            (name) =>
              `Computer Science as a full elective may ask more patience of ${name} than some other options would, at least at first — a reasonable thing to factor in among the choices on offer, not a reason to rule it out.`,
          ],
        },
        tip: {
          flourishing: "Worth ranking seriously alongside the other options on the electives list, rather than defaulting to it just because it's the flagged strength here.",
          steady: "A single semester or a short course, if the system allows it, is a low-risk way to test real interest before committing to a full-year Computer Science elective.",
          growing: "If Computer Science is required rather than optional, project-based or game-design-flavoured courses tend to land better than a pure syntax-first one for this pattern.",
        },
      }),
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
    ageOverrides: forSeniorBands({
      tip: {
        flourishing: "If a Visual Arts or Design elective is genuinely on the table, an open-ended, portfolio-style brief tends to bring out stronger work than a rigid, tightly graded one.",
        steady: "Open-ended, low-pressure creative time still works well at this age — the point remains the process, not producing a polished portfolio piece, unless that's genuinely the goal.",
        growing: "It doesn't need to be a strength to be worth keeping as an outlet — even without pursuing it as a formal elective, unstructured creative time still has real value at this age.",
      },
    }),
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
    ageOverrides: forSeniorBands({
      tip: {
        flourishing: "This kind of natural ease with rhythm and melody tends to transfer well to picking up a new instrument or style even now — it's rarely too late to start something new here.",
        steady: "Interest in music at this age tends to track exposure and opportunity more than any particular natural pull — a low-pressure elective or informal playing time both remain reasonable options.",
        growing: "Music doesn't need to become a formal pursuit to stay worthwhile — even occasional, low-stakes listening or playing keeps the door open without requiring a performance mindset.",
      },
    }),
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
    ageOverrides: forSeniorBands({
      tip: {
        flourishing: "Real chances to lead or present — a club, a part-time role, a group project, an interview — tend to matter more at this age than more practice for its own sake; this pattern suggests they're likely to rise to it when given the chance.",
        growing: "A small, familiar audience — a study group, a part-time job, a handful of trusted people — remains a better place to build real confidence than being pushed straight into a large or high-stakes setting.",
      },
    }),
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
    ageOverrides: forSeniorBands({
      tip: {
        flourishing: "Movement breaks during study sessions — a short walk, a real workout, anything that gets them up — tend to help focus rather than break it, even under exam pressure.",
        steady: "Whatever mix of structured and unstructured physical activity already works tends to keep working here — no need to force a change just because the workload increases.",
        growing: "Individual or low-competition physical activity — running, swimming, the gym, cycling — remains a completely valid way to stay active without needing to take up a team sport at this stage.",
      },
    }),
  },
];

export interface SubjectGuidance {
  inclined: SubjectResult[];
  support: SubjectResult[];
}

/**
 * The subject a parent's decisionFocus is actually about, when it can be
 * reasonably matched -- used to force that subject into the rendered
 * list below even if its raw score would otherwise land it in the
 * silently-dropped middle (neither top-4 "comes naturally" nor bottom-3
 * "needs support"), so a parent who named a real subject always sees it
 * discussed here. The substantive answer to their stated decision itself
 * lives in the dedicated "Your question, directly" chapter
 * (directAnswer.ts) -- this file only needs to make sure the subject in
 * question is actually visible for that chapter's answer to make sense
 * in context.
 */

function resolveVariants(
  def: SubjectDefinition,
  ageBand: AgeBand,
  tier: Tier,
): Record<Tier, ((name: string) => string)[]> {
  const overrideForTier = def.ageOverrides?.[ageBand]?.variants?.[tier];
  if (!overrideForTier) return def.variants;
  return { ...def.variants, [tier]: overrideForTier };
}

function resolveTip(def: SubjectDefinition, ageBand: AgeBand, tier: Tier): string {
  return def.ageOverrides?.[ageBand]?.tip?.[tier] ?? def.tip[tier];
}

function renderSubject(
  def: SubjectDefinition,
  chart: BirthChart,
  childName: string,
  ageBand: AgeBand,
): SubjectResult {
  const tier = tierFromScore(def.score(chart));
  const body = renderTieredInsight({
    chart,
    name: childName,
    tier,
    leadPlanet: def.leadPlanet,
    citation: citePlacement(chart, def.leadPlanet),
    seed: chart.planets.find((p) => p.key === def.leadPlanet)?.rashi.degreeInRashi ?? 0,
    variants: resolveVariants(def, ageBand, tier),
  });

  const tip = resolveTip(def, ageBand, tier);

  return { id: def.id, name: def.name, body, tip };
}

export function buildSubjectGuidance(
  chart: BirthChart,
  childName: string,
  ageBand: AgeBand,
  decisionFocus?: string,
): SubjectGuidance {
  const ranked = SUBJECTS.map((s) => ({ subject: s, score: s.score(chart) })).sort(
    (a, b) => b.score - a.score,
  );

  let inclinedRanked = ranked.slice(0, 4);
  let supportRanked = ranked.slice(-3).reverse();

  // If the parent named a real decision and it matches a subject that
  // fell in the silently-dropped middle (neither top-4 "comes naturally"
  // nor bottom-3 "needs support"), surface it anyway -- a parent who told
  // us what they're actually deciding between should never see the
  // reading go silent on that exact subject. Slotted onto whichever list
  // its own score is closer to, so it isn't misrepresented as a bigger
  // strength or weakness than the chart actually shows.
  const matchedId = matchDecisionSubjectId(decisionFocus);
  if (matchedId) {
    const alreadyShown =
      inclinedRanked.some((r) => r.subject.id === matchedId) ||
      supportRanked.some((r) => r.subject.id === matchedId);
    if (!alreadyShown) {
      const idx = ranked.findIndex((r) => r.subject.id === matchedId);
      if (idx !== -1) {
        const matchedEntry = ranked[idx];
        if (idx < ranked.length / 2) {
          inclinedRanked = [...inclinedRanked, matchedEntry];
        } else {
          supportRanked = [...supportRanked, matchedEntry];
        }
      }
    }
  }

  const inclined = inclinedRanked.map(({ subject }) => renderSubject(subject, chart, childName, ageBand));
  const support = supportRanked.map(({ subject }) => renderSubject(subject, chart, childName, ageBand));

  return { inclined, support };
}

export { SUBJECTS };
