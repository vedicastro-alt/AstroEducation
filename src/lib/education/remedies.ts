import type { BirthChart } from "../astro/types";
import type { PlanetKey } from "../astro/constants";
import type { PlanetPlacement } from "../astro/types";
import { planetByKey, strengthScore } from "./scoring";

/**
 * Deliberately simple, low-cost, optional traditions -- a supportive
 * color, a day of the week, one small object, and one small habit. No
 * gemstones, no expensive items, nothing prescriptive: these are framed
 * throughout as small things some families enjoy trying, not
 * requirements, in keeping with "simple and gentle."
 *
 * Each planet carries several variant bodies so that two children who
 * both need support with, say, Saturn don't receive identical text. The
 * variant is chosen deterministically from that planet's own exact chart
 * placement (its sign and lunar position), never at random -- the same
 * chart always produces the same reading, but different charts spread
 * across the variants.
 */
interface RemedyDefinition {
  theme: string;
  variants: ((name: string) => string)[];
}

/**
 * Rahu and Ketu were previously excluded from this remedy pool entirely
 * -- a conversion-test re-run (an astrology-literate reviewer) caught
 * this directly: her chart's most prominent, explicitly-flagged
 * affliction elsewhere in the same reading was a Jupiter-Rahu conjunction
 * and a Sun-Ketu conjunction, yet the remedies chapter defaulted to
 * generic Sun/Jupiter/Saturn advice that never engaged with either node.
 * Unlike the seven classical planets, Rahu and Ketu are shadow points
 * (the Moon's lunar nodes) without their own classical weekday the way
 * Sunday belongs to the Sun or Tuesday to Mars -- traditions differ on
 * whether to assign one at all, so these two are deliberately the only
 * entries below that skip a "traditional day" framing rather than assert
 * one that wouldn't hold up to someone who actually knows the subject.
 */
const REMEDIES: Record<PlanetKey, RemedyDefinition> = {
  Sun: {
    theme: "confidence and a settled sense of self",
    variants: [
      (name) =>
        `The Sun governs confidence and vitality. A touch of orange or gold — a folder, a pencil case, a hair tie — is a small, traditional way some families like to support it, especially on Sundays, the Sun's day. A few minutes of morning light before ${name} sits down to study, even just by an open window, is the gentler version of the same idea: a small, steady ritual that says the day has begun on their own terms.`,
      (name) =>
        `The Sun governs confidence and vitality. A saffron or amber accent on a bag or notebook is the traditional nod, best refreshed on a Sunday. Just as effective: a minute or two of standing tall and stretching toward the light before ${name} starts homework — a small, physical way of starting the day on their own terms, not rushed into it.`,
      (name) =>
        `The Sun governs confidence and vitality. A small sunflower, or anything yellow-gold on the desk, is the traditional gesture, particularly on Sundays. Day to day, the same spirit shows up in naming one thing ${name} feels proud of before sitting down to study — a tiny, steady confidence check-in that builds the same settled sense of self.`,
    ],
  },
  Moon: {
    theme: "emotional steadiness and comfort",
    variants: [
      (name) =>
        `The Moon governs mood and comfort. White or soft cream tones, and a small bowl of water or a fresh flower somewhere ${name} studies, are traditional nods to a settled Moon — worth trying on Mondays in particular. More practically: a calm, unhurried wind-down before bed does the same job in modern terms, giving the mind a clear stop to the day rather than carrying it into sleep.`,
      (name) =>
        `The Moon governs mood and comfort. A soft cream cushion or blanket in ${name}'s reading corner, refreshed on a Monday, is the traditional gesture. Just as settling: a warm drink and five quiet minutes together before study time, so the day feels held rather than rushed straight through.`,
      (name) =>
        `The Moon governs mood and comfort. Keeping a small vase of fresh water or flowers nearby, topped up weekly and especially on Mondays, is the traditional nod. The modern equivalent is a predictable bedtime rhythm — the same short story, the same quiet check-in — so ${name}'s day always has a gentle, expected close.`,
    ],
  },
  Mars: {
    theme: "energy and healthy drive",
    variants: [
      (name) =>
        `Mars governs energy and courage. A small red or coral object on the desk — a pen, a folder corner, a sticker — is the traditional gesture, best introduced on a Tuesday, Mars's day. The more useful version day to day: real physical movement (a run around the garden, a few minutes of stretching) before ${name} sits down to study tends to settle restless energy far better than asking for stillness first.`,
      (name) =>
        `Mars governs energy and courage. A red pencil case or notebook, chosen or refreshed on a Tuesday, is the traditional nod here. In practice, a short burst of energetic play — jumping jacks, a quick dance in the kitchen — right before homework spends that same restless energy first, so ${name} arrives at the desk with it already worked through rather than fighting to sit still.`,
      (name) =>
        `Mars governs energy and courage. A coral-colored sticky note or tracker for small daily wins, started on a Tuesday, is the traditional gesture. Just as effective: turning study into short, timed "sprints" with a movement break between them — a way of channeling ${name}'s natural drive instead of asking it to disappear.`,
    ],
  },
  Mercury: {
    theme: "clear thinking and communication",
    variants: [
      (name) =>
        `Mercury governs intellect and communication. A small green plant on ${name}'s study table is a gentle, living nod to Mercury, especially if placed or refreshed on a Wednesday. Reading a page aloud before writing about it is a lovely modern equivalent — it engages the same quick, verbal part of the mind Mercury is said to govern.`,
      (name) =>
        `Mercury governs intellect and communication. A pale green folder or highlighter for notes, picked out on a Wednesday, is the traditional touch. Just as useful: having ${name} talk a problem through out loud with a parent or sibling before writing the answer down — the same quick, verbal thinking Mercury is said to sharpen.`,
      (name) =>
        `Mercury governs intellect and communication. Fresh herbs or a small green plant kept near the desk, tended on a Wednesday, is the traditional gesture. Day to day, the same effect comes from asking ${name} to explain what they just learned back in their own words — a small habit that turns passive reading into real, clear thinking.`,
    ],
  },
  Jupiter: {
    theme: "wisdom, optimism, and guidance",
    variants: [
      (name) =>
        `Jupiter governs wisdom and growth. Yellow or gold touches — a notebook cover, a highlighter, a cushion in their reading corner — are traditional here, particularly on Thursdays. Just as fitting: a few minutes with a trusted mentor, teacher, or a favourite story before ${name} tackles a harder subject tends to bring the same expansive, encouraged feeling Jupiter is said to bring.`,
      (name) =>
        `Jupiter governs wisdom and growth. A gold-toned bookmark or notebook cover, chosen on a Thursday, is the traditional nod. A gentler daily habit does the same work: ending study time by having ${name} name one new thing they learned out loud — a small ritual that builds the same sense of steady growth.`,
      (name) =>
        `Jupiter governs wisdom and growth. A warm yellow cushion or reading nook, freshened up on a Thursday, is the traditional gesture. Just as meaningful: a weekly "big question" chat between ${name} and a trusted adult about something curious or big-picture — the same expansive, encouraged feeling Jupiter is said to support.`,
    ],
  },
  Venus: {
    theme: "creativity, harmony, and connection",
    variants: [
      (name) =>
        `Venus governs creativity and harmony. Soft pastels or white in ${name}'s space, especially refreshed on a Friday, are the traditional gesture. Just as meaningful: displaying something ${name} made or chose themselves nearby, and a little creative play before or after study time, both feed the same gentle, expressive part of a Venus-supported routine.`,
      (name) =>
        `Venus governs creativity and harmony. A pastel-colored folder or a favourite set of markers, chosen on a Friday, is the traditional touch. Just as fitting: a few minutes of drawing or music before ${name} tackles a harder subject — a small warm-up for the same creative, connected part of the mind Venus is said to favour.`,
      (name) =>
        `Venus governs creativity and harmony. Fresh flowers or a tidy, pretty corner of the desk, freshened on a Friday, are the traditional gesture. Day to day, the same spirit shows up in letting ${name} study alongside a sibling or friend now and then — connection tends to ease the subjects Venus is said to touch.`,
    ],
  },
  Saturn: {
    theme: "patience, structure, and follow-through",
    variants: [
      (name) =>
        `Saturn governs discipline and staying power. A simple, tidy, dedicated study spot — kept clear of clutter — is the traditional nod here, and Saturday is considered its day for small resets, like tidying that space together with ${name}. The daily version: a short, consistent routine, even just ten steady minutes, tends to build follow-through far better than long, irregular sessions.`,
      (name) =>
        `Saturn governs discipline and staying power. A simple checklist or timer kept on the desk, reset each Saturday, is the traditional-in-spirit nod here. In practice, breaking ${name}'s homework into small, clearly finished steps — rather than one long stretch — builds the same steady follow-through Saturn is said to reward.`,
      (name) =>
        `Saturn governs discipline and staying power. A dark or muted-toned folder set aside just for the hardest subject, freshened on a Saturday, is the traditional gesture. Just as effective: a consistent same-time-each-day study slot for ${name}, even a brief one, tends to build the patient, steady follow-through Saturn is said to favour.`,
    ],
  },
  Rahu: {
    theme: "channeling restless, unconventional curiosity",
    variants: [
      (name) =>
        `Rahu governs an intense, restless curiosity for the new and unconventional. Smoky grey or deep blue touches on a bag or folder are a gentle traditional nod — Rahu is a shadow point rather than a visible planet, so unlike the Sun or Mars it isn't tied to one classical weekday. The more useful version day to day: giving ${name} one genuine block of unstructured time to chase whatever's currently fascinating them, rather than letting that restlessness scatter across everything at once.`,
      (name) =>
        `Rahu governs an intense, restless curiosity for the new and unconventional. A grey or multi-tone accent — a pencil case, a sticker, a cover — is the gentle traditional gesture, without a fixed weekday attached to it. Just as fitting: letting ${name} go down one real rabbit hole a week, on a topic entirely of their own choosing, rather than treating that pull toward the unusual as a distraction from "real" study.`,
      (name) =>
        `Rahu governs an intense, restless curiosity for the new and unconventional. A smoky-blue or grey object kept on the desk is a quiet traditional nod, offered without a set day since Rahu doesn't carry one the way the visible planets do. Day to day, the same energy in ${name} is well served by novelty itself — a genuinely new topic, format, or approach introduced regularly, so the restlessness has somewhere real to go.`,
    ],
  },
  Ketu: {
    theme: "protecting quiet, self-directed focus",
    variants: [
      (name) =>
        `Ketu governs a quiet, self-directed inwardness — capable, but not always eager for an audience. Muted brown or ash-grey tones are a gentle traditional nod; like Rahu, Ketu is a shadow point without its own classical weekday. What tends to matter more day to day: protecting real, unsupervised time for ${name} to pursue something quietly, without needing to perform or explain it to anyone — the detachment Ketu is said to bring is a feature here, not something to correct.`,
      (name) =>
        `Ketu governs a quiet, self-directed inwardness — capable, but not always eager for an audience. A plain, muted-toned object kept nearby is the gentle traditional gesture, offered without a fixed day attached. Just as fitting: resisting the urge to praise or narrate everything ${name} does here — a little unremarked-upon space tends to suit this placement better than enthusiastic feedback would.`,
      (name) =>
        `Ketu governs a quiet, self-directed inwardness — capable, but not always eager for an audience. Muted, understated tones (grey, brown, faded colours) are the traditional nod, without a set weekday since Ketu doesn't carry one the way the visible planets do. Day to day, this is well served by simply trusting ${name} to work through something alone before offering to help — the instinct here often runs ahead of the need for guidance.`,
    ],
  },
};

export interface GentleRemedy {
  id: string;
  planet: string;
  theme: string;
  body: string;
}

const REMEDY_PLANETS: PlanetKey[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

function pickVariant<T>(variants: T[], placement: PlanetPlacement): T {
  const seed = placement.rashi.index * 4 + placement.nakshatra.index + placement.nakshatra.pada;
  return variants[seed % variants.length];
}

export function buildGentleRemedies(
  chart: BirthChart,
  childName: string,
  count = 3,
): GentleRemedy[] {
  const ranked = REMEDY_PLANETS.map((planet) => ({
    planet,
    score: strengthScore(chart, planet),
  })).sort((a, b) => a.score - b.score);

  return ranked.slice(0, count).map(({ planet }) => {
    const placement = planetByKey(chart, planet);
    const remedy = REMEDIES[planet];
    const variant = pickVariant(remedy.variants, placement);
    return {
      id: planet.toLowerCase(),
      planet,
      theme: remedy.theme,
      body: variant(childName),
    };
  });
}
