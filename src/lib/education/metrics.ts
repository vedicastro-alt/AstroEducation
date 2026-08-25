import type { BirthChart } from "../astro/types";
import type { InsightItem } from "./types";
import {
  houseEase,
  houseLord,
  signPhrase,
  strengthScore,
} from "./scoring";

export interface Metric {
  id: string;
  score: (chart: BirthChart) => number; // roughly 0..10, higher = easier
  strength: (chart: BirthChart, childName: string) => InsightItem;
  growth: (chart: BirthChart, childName: string) => InsightItem;
}

const clampScore = (raw: number) => Math.min(10, Math.max(0, 5 + raw));

export const METRICS: Metric[] = [
  {
    id: "house2",
    score: (c) => houseEase(c, 2),
    strength: (c, name) => ({
      id: "house2",
      title: "A natural way with words",
      body: `${name}'s 2nd house of speech and early learning is supported by ${houseLord(c, 2)}, well placed in the chart. This often shows up as clear expression, a good memory for facts and stories, and comfort building vocabulary — a lovely foundation for reading and language work.`,
    }),
    growth: (c, name) => ({
      id: "house2",
      title: "Finding their voice, at their own pace",
      body: `${name}'s chart suggests early speech and memorisation may take a little longer to click than for some children — and that's completely alright. With patient, playful repetition (songs, read-alouds, naming games) this area tends to blossom beautifully; it just wants a gentler runway.`,
    }),
  },
  {
    id: "house4",
    score: (c) => houseEase(c, 4),
    strength: (c, name) => ({
      id: "house4",
      title: "Learns best from a settled, secure base",
      body: `The 4th house — home, comfort and the emotional base for schooling — is in good shape, ruled by a well-placed ${houseLord(c, 4)}. ${name} likely learns well in calm, familiar settings and forms warm bonds with teachers and caregivers who feel like home.`,
    }),
    growth: (c, name) => ({
      id: "house4",
      title: "Settling in may take some extra warmth",
      body: `${name} may need a bit more time and reassurance to feel truly settled in a new classroom or routine before learning flows easily. A predictable morning routine and a warm goodbye ritual can turn this into a real source of steadiness rather than stress.`,
    }),
  },
  {
    id: "house5",
    score: (c) => houseEase(c, 5),
    strength: (c, name) => ({
      id: "house5",
      title: "Bright, creative intelligence",
      body: `The 5th house of intelligence and creativity — the single most important house for education in Vedic astrology — is strong, with ${houseLord(c, 5)} well placed. This points to genuine intellectual spark: ${name} likely enjoys thinking things through, playing with ideas, and creating.`,
    }),
    growth: (c, name) => ({
      id: "house5",
      title: "Curiosity that needs the right spark",
      body: `${name}'s 5th house suggests that motivation to engage with formal learning may ebb and flow rather than stay switched on by default. The gift here is that once something genuinely interests them, engagement can be strong — the key is helping them discover what lights them up, rather than pushing harder on what doesn't.`,
    }),
  },
  {
    id: "house9",
    score: (c) => houseEase(c, 9),
    strength: (c, name) => ({
      id: "house9",
      title: "A hunger for deeper understanding",
      body: `The 9th house of higher learning and wisdom is well supported, ruled by a strong ${houseLord(c, 9)}. As ${name} grows, this often shows as a love of "why" questions, an openness to mentors and big ideas, and real fortune in the education journey.`,
    }),
    growth: (c, name) => ({
      id: "house9",
      title: "Big ideas may need grounding first",
      body: `${name}'s chart suggests that higher-level, abstract learning may feel more natural once the basics are solidly in place — there's no rush here. Building confidence step by step, with a trusted mentor or teacher along the way, will make the leap into deeper study feel exciting rather than overwhelming.`,
    }),
  },
  {
    id: "mercury",
    score: (c) => clampScore(strengthScore(c, "Mercury")),
    strength: (c, name) => ({
      id: "mercury",
      title: "Quick, analytical thinking",
      body: `Mercury, the planet of intellect and communication, is in a favourable position in ${signPhrase(c, "Mercury")}. ${name} likely picks up new concepts quickly and enjoys logic, puzzles, and precise, well-organised work.`,
    }),
    growth: (c, name) => ({
      id: "mercury",
      title: "Thinking that benefits from a slower unfold",
      body: `With Mercury in ${signPhrase(c, "Mercury")}, ${name} may prefer to absorb new information slowly and thoroughly rather than in quick bursts — and that's a real strength in disguise. Breaking lessons into small, concrete steps (rather than long explanations) usually helps this settle in comfortably.`,
    }),
  },
  {
    id: "jupiter",
    score: (c) => clampScore(strengthScore(c, "Jupiter")),
    strength: (c, name) => ({
      id: "jupiter",
      title: "Open, optimistic love of learning",
      body: `Jupiter, the great teacher of the chart, sits well in ${signPhrase(c, "Jupiter")}. This usually brings ${name} a natural optimism about learning, good judgement, and a warm rapport with teachers and mentors.`,
    }),
    growth: (c, name) => ({
      id: "jupiter",
      title: "Confidence that grows with encouragement",
      body: `Jupiter in ${signPhrase(c, "Jupiter")} suggests ${name}'s confidence in their own understanding may need consistent, gentle encouragement to fully bloom. Praise for effort (not just results) goes a long way here, and belief tends to catch up with ability faster than expected.`,
    }),
  },
  {
    id: "moon",
    score: (c) => clampScore(strengthScore(c, "Moon")),
    strength: (c, name) => ({
      id: "moon",
      title: "Emotionally settled and receptive",
      body: `The Moon, which governs the mind, is comfortably placed in ${signPhrase(c, "Moon")}. ${name} is likely emotionally steady while learning, able to focus without being easily thrown off by a busy or noisy environment.`,
    }),
    growth: (c, name) => ({
      id: "moon",
      title: "A sensitive, feeling-first mind",
      body: `With the Moon in ${signPhrase(c, "Moon")}, ${name}'s mood and focus may be more sensitive to their surroundings than most — noise, tiredness, or tension at home can visibly affect concentration. This sensitivity is also often the seed of great empathy and intuition; a calm, predictable study space is the best gift here.`,
    }),
  },
  {
    id: "saturn",
    score: (c) => clampScore(strengthScore(c, "Saturn")),
    strength: (c, name) => ({
      id: "saturn",
      title: "Patient, persistent focus",
      body: `Saturn, which governs discipline and staying power, is well placed in ${signPhrase(c, "Saturn")}. ${name} is likely capable of real focus and follow-through once a routine is in place — a quiet strength that compounds beautifully over the school years.`,
    }),
    growth: (c, name) => ({
      id: "saturn",
      title: "Discipline that's still being built",
      body: `Saturn in ${signPhrase(c, "Saturn")} suggests that sitting still with a task, or sticking with something that isn't instantly fun, may not come naturally to ${name} yet. This is simply a skill in progress — short, consistent practice sessions with plenty of encouragement build this muscle gently over time, and it often becomes a real source of pride later.`,
    }),
  },
];
