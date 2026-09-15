import type { BirthChart } from "../astro/types";
import type { Element, Modality } from "../astro/dignity";
import type { EducationInsights } from "./types";
import { ascendantElement, ascendantModality } from "./scoring";
import { citePlacement } from "./narrative";

/**
 * A comparison reading for two children in the same family (HANDOFF §55
 * B1 / §43 item 1) -- built once a family already has two real, saved
 * readings, reusing exactly the charts already computed for each. This
 * is deliberately NOT a "compatibility score": per HANDOFF §6, nothing
 * here ranks one child against the other, and the existing single-child
 * reading already tells parents not to compare siblings' reports. The
 * point of this one is the opposite framing -- not "who scores higher,"
 * but "here's how two genuinely different (or genuinely similar) charts
 * might actually move through the same house together," in the same
 * practical, non-deterministic voice as everything else on this site.
 */
export interface SiblingChildSummary {
  name: string;
  element: Element;
  modality: Modality;
  moonCitation: string;
  topStrengthTitle: string;
}

export interface SiblingCompatibility {
  childA: SiblingChildSummary;
  childB: SiblingChildSummary;
  temperamentNote: string;
  paceNote: string;
  householdTip: string;
  reminder: string;
}

function summarize(chart: BirthChart, name: string, insights: EducationInsights): SiblingChildSummary {
  return {
    name,
    element: ascendantElement(chart),
    modality: ascendantModality(chart),
    moonCitation: citePlacement(chart, "Moon"),
    topStrengthTitle: insights.strengths[0]?.title ?? "a genuine, individual mix of strengths",
  };
}

const ELEMENT_LABEL: Record<Element, string> = {
  fire: "fire",
  earth: "earth",
  air: "air",
  water: "water",
};

/**
 * One template per unordered pair of elements (4 same-element pairs + 6
 * cross-element pairs = 10 total) -- keyed by the two elements joined in
 * a fixed canonical order (alphabetical) so a lookup never has to guess
 * which order the two charts happened to come in. Each cross-element
 * template takes (nameOfFirstElementChild, nameOfSecondElementChild) in
 * that same canonical order, resolved to the real children by
 * `orderByElement` below.
 */
const ELEMENT_PAIR_NOTE: Record<string, (a: string, b: string) => string> = {
  "air-air": (a, b) =>
    `${a} and ${b} share an airy, conversational temperament — expect a lot of talking, negotiating, and idea-swapping between the two of them, for better and for worse.`,
  "earth-earth": (a, b) =>
    `${a} and ${b} share a grounded, practical temperament — they're likely to bond over doing and building things together more than talking things through.`,
  "fire-fire": (a, b) =>
    `${a} and ${b} both run on fire energy — enthusiasm, quick starts, and a real need to move. Expect them to spark each other up fast, in both directions.`,
  "water-water": (a, b) =>
    `${a} and ${b} share a water-element sensitivity — they tend to pick up on each other's moods quickly, which can mean real closeness and real friction, sometimes in the same afternoon.`,
  "air-earth": (a, b) =>
    `${a}'s idea-driven, conversational style and ${b}'s hands-on, practical style don't naturally reach for the same activities — worth deliberately building in time for both kinds of play.`,
  "air-fire": (a, b) =>
    `${a}'s drive to talk things through and ${b}'s drive to act on them can be a genuinely good match — ${a} often works out the plan ${b} is eager to actually run with.`,
  "air-water": (a, b) =>
    `${a} tends to process out loud by talking; ${b} often needs quiet space to feel things through first — patience with the two different processing styles helps both of them.`,
  "earth-fire": (a, b) =>
    `${b} tends to move fast and want results now; ${a} tends to want to build things carefully and steadily. That's a difference in pace, not a mismatch — ${b} can bring the energy, ${a} can bring the follow-through.`,
  "earth-water": (a, b) =>
    `${a}'s practical steadiness can be genuinely grounding for ${b}'s more feeling-driven style — a naturally complementary pairing, more often than not.`,
  "fire-water": (a, b) =>
    `${a}'s high energy can occasionally feel like a lot for ${b}'s more sensitive, feeling-first style — neither style is the problem, they just tend to run at different volumes.`,
};

function orderByElement(
  a: SiblingChildSummary,
  b: SiblingChildSummary,
): [string, string, string] {
  const order: Element[] = ["air", "earth", "fire", "water"];
  const [first, second] =
    order.indexOf(a.element) <= order.indexOf(b.element) ? [a, b] : [b, a];
  const key =
    first.element === second.element
      ? `${first.element}-${first.element}`
      : `${ELEMENT_LABEL[first.element]}-${ELEMENT_LABEL[second.element]}`;
  return [key, first.name, second.name];
}

/** Same structure as the element table above, for the 3 same-modality + 3 cross-modality pairs. */
const MODALITY_PAIR_NOTE: Record<string, (a: string, b: string) => string> = {
  "cardinal-cardinal": (a, b) =>
    `${a} and ${b} both like being the one who starts things — expect some genuine, good-natured competition over who gets to lead a shared activity.`,
  "fixed-fixed": (a, b) =>
    `${a} and ${b} both settle in and commit hard once they've decided something — when the two of them disagree, neither tends to budge easily, so a neutral third option often works better than picking a side.`,
  "mutable-mutable": (a, b) =>
    `${a} and ${b} both adapt easily and enjoy variety — plans can shift for either of them without much fuss, which makes this an easier pairing to keep flexible.`,
  "cardinal-fixed": (a, b) =>
    `${a} likes to jump in and start things; ${b} likes to stick with what's already working. Letting ${b} finish before ${a} starts the next thing tends to keep the peace.`,
  "cardinal-mutable": (a, b) =>
    `${a} likes to initiate; ${b} tends to go with the flow — a naturally easy pairing, since ${b} rarely resists ${a}'s lead.`,
  "fixed-mutable": (a, b) =>
    `${a} likes routine and commitment; ${b} likes change and variety. Building a little planned flexibility into ${a}'s routine gives ${b}'s need for change somewhere to go without derailing it.`,
};

function orderByModality(
  a: SiblingChildSummary,
  b: SiblingChildSummary,
): [string, string, string] {
  const order: Modality[] = ["cardinal", "fixed", "mutable"];
  const [first, second] =
    order.indexOf(a.modality) <= order.indexOf(b.modality) ? [a, b] : [b, a];
  const key =
    first.modality === second.modality
      ? `${first.modality}-${first.modality}`
      : `${first.modality}-${second.modality}`;
  return [key, first.name, second.name];
}

export function buildSiblingCompatibility(
  chartA: BirthChart,
  nameA: string,
  insightsA: EducationInsights,
  chartB: BirthChart,
  nameB: string,
  insightsB: EducationInsights,
): SiblingCompatibility {
  const childA = summarize(chartA, nameA, insightsA);
  const childB = summarize(chartB, nameB, insightsB);

  const [elementKey, elFirstName, elSecondName] = orderByElement(childA, childB);
  const temperamentNote = ELEMENT_PAIR_NOTE[elementKey](elFirstName, elSecondName);

  const [modalityKey, modFirstName, modSecondName] = orderByModality(childA, childB);
  const paceNote = MODALITY_PAIR_NOTE[modalityKey](modFirstName, modSecondName);

  const householdTip =
    childA.modality === childB.modality
      ? `Since ${childA.name} and ${childB.name} tend to move at a similar pace day-to-day, a single shared routine (homework time, wind-down time) is more likely to genuinely suit them both than two separate systems.`
      : `Since ${childA.name} and ${childB.name} tend to move at genuinely different paces, a single rigid shared routine may quietly suit one of them better than the other — worth checking in with each of them separately about what's actually working, rather than assuming a routine that works for one works the same way for the other.`;

  const reminder = `This is about how ${childA.name} and ${childB.name} might move through the same home differently — never a measure of one against the other. Both charts are equally real and equally worth honoring on their own terms; the goal here is understanding two individual children a little better, not ranking them.`;

  return { childA, childB, temperamentNote, paceNote, householdTip, reminder };
}
