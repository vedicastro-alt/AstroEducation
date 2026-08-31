import type { PlanetKey } from "../astro/constants";
import type { BirthChart } from "../astro/types";
import type { Dignity } from "../astro/dignity";
import { aspectsOnPlanet, conjunctionsWith } from "../astro/aspects";
import { BENEFICS, MALEFICS, dignityTier, planetByKey } from "./scoring";

export type Tier = "flourishing" | "steady" | "growing";

/** Buckets a placement-strength score into a narrative tier. */
export function tierFromScore(score: number): Tier {
  if (score >= 2) return "flourishing";
  if (score <= -2) return "growing";
  return "steady";
}

/**
 * Deterministic index into a fixed-size list of phrasing variants, driven
 * by a chart-specific continuous value (e.g. a planet's exact degree
 * within its sign). The same chart always renders the same variant, but
 * charts spread naturally across the available options rather than every
 * chart in a tier reading identically.
 */
export function pickIndex(seed: number, optionCount: number): number {
  const scaled = Math.floor(Math.abs(seed) * 97);
  return scaled % optionCount;
}

/**
 * Per-chart, per-(leadPlanet, flavor-slot) round-robin counters, used to
 * pick a fresh phrasing variant each time the *same* planet's placement
 * gets cited as "extras" evidence within a single report -- e.g. a house
 * lord that coincidentally matches a different section's fixed lead
 * planet (the 2nd and 9th house lord both being Mars, for some
 * ascendants), or two subjects/directions that are both anchored to the
 * same planet by design (Mars for both Physical Education and the
 * Hands-On direction). Keyed by the `BirthChart` object itself (a
 * WeakMap, so entries are simply garbage-collected once a report's chart
 * is no longer referenced -- there's no cross-report state to leak)
 * rather than by chart data, because every section of one report is
 * built from the very same chart *object* passed down from
 * `computeBirthChart` (see engine.ts/pathway.ts), in a fixed call order --
 * this is exactly what makes a simple incrementing counter deterministic
 * per report rather than dependent on hidden global state.
 *
 * A hash of some per-call id was tried first and discarded: with as few
 * as 2-4 phrasing variants per planet and, in the worst case, five or
 * more sections anchored to the same planet in one report (three
 * subjects, one direction, and a metric can all be Mercury-led at once),
 * a hash of independent ids doesn't avoid collisions by construction --
 * pigeonhole means some pair must land on the same variant unless there
 * are at least as many variants as colliding sections. A round-robin
 * counter instead *guarantees* no repeat until the variant list itself is
 * exhausted, which is the strongest guarantee available without either
 * writing an impractical number of phrasings or threading a shared
 * dedup context across engine.ts and pathway.ts (a materially bigger,
 * riskier change for what is fundamentally a copy-variety fix).
 */
const flavorCounters = new WeakMap<BirthChart, Map<string, number>>();

function nextFlavorIndex(chart: BirthChart, counterKey: string, optionCount: number): number {
  let counters = flavorCounters.get(chart);
  if (!counters) {
    counters = new Map();
    flavorCounters.set(chart, counters);
  }
  const current = counters.get(counterKey) ?? 0;
  counters.set(counterKey, current + 1);
  return current % optionCount;
}

/** "A", "A and B", or "A, B and C" -- avoids the "A and B and C" repeated-and bug. */
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/** ", conjunct X, aspected by Y" -- the compact conjunction/aspect tail shared by every citation. */
function placementClauses(chart: BirthChart, key: PlanetKey): string {
  const conjunct = conjunctionsWith(chart, key);
  const aspectors = aspectsOnPlanet(chart, key).filter((a) => !conjunct.includes(a));
  const beneficAspectors = aspectors.filter((a) => BENEFICS.includes(a));
  const maleficAspectors = aspectors.filter((a) => MALEFICS.includes(a));

  const clauses: string[] = [];
  if (conjunct.length > 0) clauses.push(`conjunct ${joinList(conjunct)}`);
  if (beneficAspectors.length > 0) clauses.push(`aspected by ${joinList(beneficAspectors)}`);
  else if (maleficAspectors.length > 0) clauses.push(`pressured by ${joinList(maleficAspectors)}'s aspect`);

  return clauses.length > 0 ? `, ${clauses.join(", ")}` : "";
}

/**
 * Phrasing variants for the base citation clause, selected round-robin
 * (see `nextFlavorIndex`) per planet, per chart -- so when the SAME
 * underlying placement is genuinely the basis for more than one
 * metric/subject/direction (which happens often: only 7 classical
 * planets rule 12 signs, so two of the four houses metrics.ts tracks, or
 * two subjects that share a leadPlanet by design, routinely land on the
 * same lord/planet), the repeated fact reads as differently-phrased
 * texture rather than a byte-for-byte copy-pasted sentence used as
 * "evidence" for unrelated traits. This is a different, previously
 * unaddressed layer from the `extras`/conjunction-flavor variants above
 * -- those vary the *interpretation* sentence; this varies the citation
 * clause itself, which had no variants at all until now.
 */
const CITATION_TEMPLATES: Record<Dignity, ((house: string) => string)[]> = {
  exalted: [
    (house) => `is exalted in ${house}`,
    (house) => `sits at its point of greatest strength, exalted in ${house}`,
    (house) => `is in an exalted placement in ${house}`,
    (house) => `reaches its point of exaltation in ${house}`,
    (house) => `is at its strongest, exalted in ${house}`,
  ],
  own: [
    (house) => `is in its own sign, ${house}`,
    (house) => `sits comfortably at home in ${house}`,
    (house) => `occupies its own sign in ${house}`,
    (house) => `is on familiar ground, in its own sign in ${house}`,
    (house) => `rules the sign it sits in, ${house}`,
  ],
  debilitated: [
    (house) => `is debilitated in ${house}`,
    (house) => `sits in its sign of debilitation, ${house}`,
    (house) => `is in a debilitated placement in ${house}`,
    (house) => `is at its weakest, debilitated in ${house}`,
    (house) => `falls in its sign of debilitation, ${house}`,
  ],
  neutral: [
    (house) => `sits in ${house}`,
    (house) => `is placed in ${house}`,
    (house) => `has a placement in ${house}`,
    (house) => `falls in ${house}`,
    (house) => `is positioned in ${house}`,
  ],
};

/** Same templates, phrased as a continuation of "Ruled by {lord}, ..." -- no repeated subject, no leading verb. */
const HOUSE_LORD_TEMPLATES: Record<Dignity, ((house: string) => string)[]> = {
  exalted: [
    (house) => `exalted in ${house}`,
    (house) => `at its point of greatest strength, exalted in ${house}`,
    (house) => `in an exalted placement in ${house}`,
    (house) => `at its point of exaltation in ${house}`,
    (house) => `at its strongest, exalted in ${house}`,
  ],
  own: [
    (house) => `in its own sign, ${house}`,
    (house) => `sitting comfortably at home in ${house}`,
    (house) => `occupying its own sign in ${house}`,
    (house) => `on familiar ground, in its own sign in ${house}`,
    (house) => `ruling the sign it sits in, ${house}`,
  ],
  debilitated: [
    (house) => `debilitated in ${house}`,
    (house) => `in its sign of debilitation, ${house}`,
    (house) => `in a debilitated placement in ${house}`,
    (house) => `at its weakest, debilitated in ${house}`,
    (house) => `falling in its sign of debilitation, ${house}`,
  ],
  neutral: [
    (house) => `in ${house}`,
    (house) => `placed in ${house}`,
    (house) => `positioned in ${house}`,
    (house) => `falling in ${house}`,
    (house) => `sitting in ${house}`,
  ],
};

/**
 * A compact, chart-specific placement citation for a planet: sign,
 * dignity, house, and any conjunction/aspect worth naming, kept to a
 * short clause rather than a full sentence so it reads as texture, not a
 * data dump. This is the detail that makes two children who merely share
 * a lead planet's sign still read differently once house, dignity, and
 * drishti are accounted for.
 */
export function citePlacement(chart: BirthChart, key: PlanetKey): string {
  const planet = planetByKey(chart, key);
  const dignity = dignityTier(chart, key);
  const house = `${planet.rashi.english}, ${ordinal(planet.house)} house`;
  const clauses = placementClauses(chart, key);
  const dignityKey = dignity;

  const templates = CITATION_TEMPLATES[dignityKey];
  const idx = nextFlavorIndex(chart, `citation:${key}`, templates.length);
  return `${key} ${templates[idx](house)}${clauses}.`;
}

/**
 * The same compact citation, but as an appositive continuing "Ruled by
 * {lord}, ..." rather than restating the planet's name -- used for
 * house-based content where the lord was already just named. Shares the
 * same per-planet round-robin counter as `citePlacement` (both are
 * citing the same underlying fact when a house's lord is also directly
 * cited elsewhere), so calling either one advances the same sequence.
 */
export function citeHouseLord(chart: BirthChart, lord: PlanetKey): string {
  const planet = planetByKey(chart, lord);
  const dignity = dignityTier(chart, lord);
  const house = `${planet.rashi.english}, ${ordinal(planet.house)} house`;
  const clauses = placementClauses(chart, lord);
  const dignityKey = dignity;

  const templates = HOUSE_LORD_TEMPLATES[dignityKey];
  const idx = nextFlavorIndex(chart, `citation:${lord}`, templates.length);
  return `${templates[idx](house)}${clauses}`;
}

/** Short parenthetical about drishti landing on a house itself, independent of who occupies it. */
export function houseAspectNote(beneficHit: boolean, maleficHit: boolean): string {
  if (beneficHit) return " (the house itself is also supported)";
  if (maleficHit) return " (the house itself is also under pressure)";
  return "";
}

/**
 * Two or more phrasings of what a specific conjunct planet classically
 * adds to whatever it's paired with -- reusable across every
 * metric/subject/direction rather than one-off per section, so the
 * *interpretation*, not just the citation, changes with what's actually
 * conjunct in this chart. Kept as real variants (not a single fixed
 * sentence) because a house lord can coincidentally match a different
 * section's fixed lead planet (e.g. the 2nd and 9th house lord both being
 * Mars for some ascendants) -- without variants, unrelated sections would
 * render this sentence byte-for-byte identical.
 *
 * These render regardless of tier, and metrics.ts additionally reuses
 * them regardless of whether a metric landed in "strengths" or "areas to
 * nurture" -- so a variant must never stake a claim about developmental
 * stage ("not fully there yet" / "already a defining trait" / "needs
 * less teaching than expected"). A parent caught exactly this: a
 * "steady"-tier metric labelled a strength still read as a growth item
 * because its Saturn line said the quality "may take structure... to
 * fully mature." Describe the planet's real character, not how far along
 * the trait is.
 */
const CONJUNCTION_FLAVORS: Record<PlanetKey, ((name: string) => string)[]> = {
  Moon: [
    (name) =>
      `Being joined by the Moon here adds a real emotional, intuitive dimension for ${name} — this isn't purely intellectual, it's something they feel too.`,
    (name) =>
      `The Moon's company softens this with feeling — ${name} is likely to experience it as much as reason it out.`,
    (name) =>
      `The Moon's presence gives this an intuitive undercurrent for ${name} — mood and instinct are likely to play a real part alongside pure thinking.`,
    (name) =>
      `The Moon's involvement means ${name} is likely to remember this through how it felt, not just what happened.`,
    (name) =>
      `The Moon's presence means this is likely to feel personal to ${name}, not just functional — mood colours how it lands.`,
    (name) =>
      `With the Moon involved, ${name} is likely to return to this when they need comfort, not only when they're motivated.`,
  ],
  Mercury: [
    (name) =>
      `Mercury's presence sharpens this into something ${name} can also put into words clearly, not just sense internally.`,
    (name) =>
      `With Mercury involved, ${name} is likely to be able to explain this, not just show it — a natural, articulate edge.`,
    (name) =>
      `Mercury's presence adds real precision here — ${name} is likely to notice details in this that others might miss.`,
    (name) =>
      `Mercury's involvement means ${name} is likely to ask sharp, specific questions about this rather than take it at face value.`,
    (name) =>
      `Mercury's presence gives this a quick, analytical edge for ${name} — likely to be picked apart and understood, not just absorbed.`,
    (name) =>
      `With Mercury involved, ${name} is likely to want to compare notes and talk this through, not just experience it quietly.`,
  ],
  Jupiter: [
    (name) =>
      `Jupiter's presence brings real breadth to this for ${name} — likely to keep expanding rather than stay narrow.`,
    (name) =>
      `Jupiter's involvement gives this real generosity of scale — ${name} is likely to grow into it rather than plateau early.`,
    (name) =>
      `Jupiter's presence adds real optimism here — ${name} is likely to keep coming back to this even after a discouraging day.`,
    (name) =>
      `Jupiter's involvement means ${name} is likely to see this as genuinely meaningful, not just useful.`,
    (name) =>
      `Jupiter's presence broadens this for ${name} — likely to connect it to bigger ideas rather than treat it as a narrow, isolated skill.`,
    (name) =>
      `With Jupiter involved, ${name} is likely to find a mentor or role model who deepens this, given the chance.`,
  ],
  Venus: [
    (name) =>
      `Venus's presence brings a creative, aesthetic thread into this for ${name} — likely to be expressed through some artistic or design-minded lens.`,
    (name) =>
      `With Venus in the mix, ${name} is likely to bring a real sense of taste and enjoyment to this, not just competence.`,
    (name) =>
      `Venus's presence adds real warmth here — ${name} is likely to want to share this with people they like, not just do it alone.`,
    (name) =>
      `Venus's involvement means ${name} is likely to care how this looks and feels, not only how well it works.`,
    (name) =>
      `Venus's presence adds a genuine ease here for ${name} — likely to feel more like enjoyment than effort, even when it's real work.`,
    (name) =>
      `With Venus involved, ${name} is likely to notice and appreciate a good example of this in others, not just their own attempts.`,
  ],
  Sun: [
    (name) =>
      `The Sun's presence gives this a confident, visible quality in ${name} — unlikely to stay quiet, it tends to show.`,
    (name) =>
      `The Sun's involvement lends this a real sense of self for ${name} — it's likely to feel like part of their identity, not just a skill.`,
    (name) =>
      `The Sun's presence adds real pride here — ${name} is likely to want this noticed and acknowledged, not just privately enjoyed.`,
    (name) =>
      `The Sun's involvement means ${name} is likely to hold themselves to a real standard here, not just go through the motions.`,
    (name) =>
      `The Sun's presence gives this a natural sense of purpose for ${name} — likely to feel like something worth doing well, not just doing.`,
    (name) =>
      `With the Sun involved, ${name} is likely to want genuine credit for this, not just quiet competence.`,
  ],
  Mars: [
    (name) =>
      `Mars's presence adds real drive and energy — ${name} is likely to pursue this actively rather than wait for it to show up.`,
    (name) =>
      `Mars's involvement gives this real forward motion — ${name} is likely to want to act on it rather than sit with it.`,
    (name) =>
      `Mars's presence adds real competitiveness here — ${name} is likely to want to get better at this, not just do it casually.`,
    (name) =>
      `Mars's involvement means ${name} is likely to want to lead or take charge here, rather than follow someone else's pace.`,
    (name) =>
      `Mars's presence gives this real urgency for ${name} — likely to want results now, not eventually.`,
    (name) =>
      `With Mars involved, ${name} is likely to push through a setback here rather than quietly give up on it.`,
  ],
  Saturn: [
    (name) =>
      `Saturn's presence brings a patient, disciplined quality to this in ${name} — something built steadily through consistency rather than instinct.`,
    (name) =>
      `Saturn's involvement gives this staying power — slower to show at first in ${name}, but built to last once it does.`,
    (name) =>
      `Saturn's presence adds real seriousness here — ${name} is likely to take this genuinely seriously once they commit to it, rather than treating it lightly.`,
    (name) =>
      `Saturn's involvement means ${name} is likely to want to do this properly, step by step, rather than take shortcuts.`,
    (name) =>
      `Saturn's presence gives this real durability for ${name} — likely to hold up under pressure once the basics are solid.`,
    (name) =>
      `With Saturn involved, ${name} is likely to judge this by results over time, not by how it feels in the moment.`,
  ],
  Rahu: [
    (name) =>
      `Rahu's presence gives this an unconventional, intensely focused edge — ${name} may approach it in a way that doesn't follow the usual path.`,
    (name) =>
      `Rahu's involvement adds a restless, hungry edge — ${name} may push this further than a typical, well-trodden approach would.`,
    (name) =>
      `Rahu's presence adds real intensity here — ${name} may become unusually absorbed in this compared to their other interests.`,
    (name) =>
      `Rahu's involvement means ${name} may be drawn to an unconventional angle on this that others wouldn't think to try.`,
    (name) =>
      `Rahu's presence adds a restless appetite here — ${name} may want more of this than feels strictly necessary.`,
    (name) =>
      `With Rahu involved, ${name} may be pulled toward whatever's newest or least explored about this, rather than the tried-and-true approach.`,
  ],
  Ketu: [
    (name) =>
      `Ketu's presence brings a detached, instinctive quality — ${name} may access this more through quiet intuition than deliberate effort.`,
    (name) =>
      `Ketu's involvement gives this a quiet, instinctive quality — ${name} is likely to absorb it rather than have it consciously drilled in.`,
    (name) =>
      `Ketu's presence adds a low-key, unshowy quality here — ${name} may be quite capable at this without ever making a fuss about it.`,
    (name) =>
      `Ketu's involvement means ${name} may lose interest in the usual recognition around this, caring more about the thing itself.`,
    (name) =>
      `Ketu's presence adds a quiet detachment here — ${name} may do this well without needing much external motivation to keep going.`,
    (name) =>
      `With Ketu involved, ${name} may quietly let go of this once it stops feeling genuinely useful, rather than keep at it out of habit.`,
  ],
};

/**
 * A sentence describing what a specific conjunct planet classically adds
 * to whatever it's paired with. Which variant is picked round-robins per
 * (chart, partner) -- see `nextFlavorIndex` -- so repeated mentions of the
 * same partner planet across a report don't render identical filler.
 *
 * Deliberately keyed by `partner` alone, NOT `leadPlanet:partner`: the
 * CONJUNCTION_FLAVORS text is entirely about what the partner planet
 * brings ("Venus's presence brings...") and never mentions the lead
 * planet at all. A conversion-test re-run found this the hard way: two
 * unrelated metrics with *different* lead planets (say, house2's lord
 * Mercury and house4's lord Moon) that both happened to be conjunct
 * Venus each got their own independent per-leadPlanet counter, so both
 * started at index 0 and rendered the exact same "Venus's presence
 * brings a creative, aesthetic thread..." sentence -- a template seam a
 * skeptical parent spotted immediately. Sharing one counter per partner
 * planet, regardless of which section's lead planet triggered it, is
 * what actually varies the text a reader sees.
 */
export function conjunctionFlavor(
  chart: BirthChart,
  partner: PlanetKey,
  name: string,
): string {
  const options = CONJUNCTION_FLAVORS[partner];
  const idx = nextFlavorIndex(chart, `conjunct:${partner}`, options.length);
  return options[idx](name);
}

const EXALTATION_INTENSIFIERS = [
  (name: string) =>
    `Exaltation specifically tends to make a quality like this unusually pronounced in ${name} — worth watching for early, rather than assuming it develops only with age.`,
  (name: string) =>
    `This is about as strong as this particular placement can be, which usually means it shows up early and clearly in ${name}, not something that has to be coaxed out over years.`,
  (name: string) =>
    `An exalted placement like this rarely stays subtle in ${name} — it tends to be one of the more obviously recognisable traits people notice about them.`,
  (name: string) =>
    `A placement this strong tends not to need much encouragement in ${name} — it's more a matter of making room for it than drawing it out.`,
];

/**
 * An extra sentence acknowledging exaltation specifically, distinct from
 * a merely-own-sign placement, so the two don't read identically. Keyed
 * by a single shared counter (not per-leadPlanet) for the same reason as
 * `conjunctionFlavor` above: these sentences never name the specific
 * planet, so two different exalted placements in one report would
 * otherwise each reset to index 0 and render identically.
 */
export function dignityIntensifier(chart: BirthChart, dignity: Dignity, name: string): string {
  if (dignity !== "exalted") return "";
  const idx = nextFlavorIndex(chart, "exalted-intensifier", EXALTATION_INTENSIFIERS.length);
  return EXALTATION_INTENSIFIERS[idx](name);
}

/**
 * Composes a full tiered insight body: a chart-specific citation, a
 * tier-appropriate closer (picked deterministically from that tier's
 * phrasing variants), and any conjunction/exaltation-driven extra
 * sentences -- so the interpretation, not just the citation, tracks what
 * is actually conjunct or exalted in this chart. Shared by every content
 * module (metrics, subjects, direction) so the same reasoning is never
 * hand-duplicated per section.
 */
export function renderTieredInsight(params: {
  chart: BirthChart;
  name: string;
  tier: Tier;
  leadPlanet: PlanetKey;
  citation: string;
  seed: number;
  variants: Record<Tier, ((name: string) => string)[]>;
}): string {
  const options = params.variants[params.tier];
  const idx = pickIndex(params.seed, options.length);
  const closer = options[idx](params.name);

  const extras: string[] = [];
  for (const partner of conjunctionsWith(params.chart, params.leadPlanet)) {
    extras.push(conjunctionFlavor(params.chart, partner, params.name));
  }
  const intensifier = dignityIntensifier(
    params.chart,
    dignityTier(params.chart, params.leadPlanet),
    params.name,
  );
  if (intensifier) extras.push(intensifier);

  // Lead with the actionable insight -- a layman reading this shouldn't
  // have to parse "Mars sits in Scorpio, 6th house" before getting to the
  // point. The chart citation trails as supporting detail, not the opener.
  return [closer, ...extras, params.citation].join(" ");
}
