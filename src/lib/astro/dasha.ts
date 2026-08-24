import type { PlanetKey } from "./constants";
import { DEG_PER_NAKSHATRA, NAKSHATRAS } from "./constants";

/** Fixed Vimshottari order and each lord's period length in years (totals 120). */
export const DASHA_ORDER: PlanetKey[] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

export const DASHA_YEARS: Record<PlanetKey, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const DAYS_PER_YEAR = 365.2425;

function addYears(date: Date, years: number): Date {
  return new Date(date.getTime() + years * DAYS_PER_YEAR * 86400000);
}

export interface DashaPeriod {
  lord: PlanetKey;
  start: Date;
  end: Date;
}

/**
 * Builds the Vimshottari Mahadasha sequence starting from birth, for
 * `totalYears` (default covers the full 120-year cycle once).
 */
export function buildDashaTimeline(
  birthDate: Date,
  moonSiderealLongitude: number,
  totalYears = 120,
): DashaPeriod[] {
  const nakshatraIndex = Math.floor(moonSiderealLongitude / DEG_PER_NAKSHATRA) % 27;
  const degreeInNakshatra = moonSiderealLongitude - nakshatraIndex * DEG_PER_NAKSHATRA;
  const fractionElapsed = degreeInNakshatra / DEG_PER_NAKSHATRA;

  const startLord = NAKSHATRAS[nakshatraIndex].lord as PlanetKey;
  const startIndex = DASHA_ORDER.indexOf(startLord);
  const balanceYears = (1 - fractionElapsed) * DASHA_YEARS[startLord];

  const periods: DashaPeriod[] = [];
  let cursor = birthDate;
  let yearsUsed = 0;

  let lordIndex = startIndex;
  let yearsForThisLord = balanceYears;

  while (yearsUsed < totalYears) {
    const lord = DASHA_ORDER[lordIndex % DASHA_ORDER.length];
    const end = addYears(cursor, yearsForThisLord);
    periods.push({ lord, start: cursor, end });
    cursor = end;
    yearsUsed += yearsForThisLord;

    lordIndex += 1;
    yearsForThisLord = DASHA_YEARS[DASHA_ORDER[lordIndex % DASHA_ORDER.length]];
  }

  return periods;
}

export function currentDasha(periods: DashaPeriod[], asOf: Date): DashaPeriod {
  const found = periods.find((p) => asOf >= p.start && asOf < p.end);
  return found ?? periods[periods.length - 1];
}

export function nextDasha(periods: DashaPeriod[], current: DashaPeriod): DashaPeriod | null {
  const idx = periods.indexOf(current);
  return idx >= 0 && idx + 1 < periods.length ? periods[idx + 1] : null;
}
