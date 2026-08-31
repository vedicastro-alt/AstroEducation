import type { BirthChart, PlanetPlacement, RashiPlacement } from "./types";
import { RASHIS } from "./constants";

/**
 * Dashamsha (D10) sign for a given natal sign + degree -- the classical
 * divisional chart read specifically for career and profession, used
 * alongside the natal (D1) chart rather than instead of it. Rule: odd
 * signs (1st, 3rd, 5th... from Aries) count their 10 three-degree
 * divisions forward from themselves; even signs count forward from the
 * 9th sign from themselves. Several divisional-chart schools exist for
 * D10; this is the single most commonly cited method -- same stance as
 * astro/yogas.ts takes on other disputed classical rules: the
 * least-controversial version, not a compounded or embellished one.
 */
function d10SignIndex(rashiIndex: number, degreeInRashi: number): number {
  const part = Math.min(9, Math.floor(degreeInRashi / 3));
  const isOddSign = rashiIndex % 2 === 0; // 0-based: Aries(0), Gemini(2)... are the 1st, 3rd, 5th... signs
  const start = isOddSign ? rashiIndex : (rashiIndex + 8) % 12;
  return (start + part) % 12;
}

function d10Rashi(rashiIndex: number, degreeInRashi: number): RashiPlacement {
  const index = d10SignIndex(rashiIndex, degreeInRashi);
  const rashi = RASHIS[index];
  // Re-spread the 3-degree division back out to a 0..30 range, so
  // downstream "pick a phrasing variant from this degree" logic still
  // has a genuine, chart-specific value to seed from rather than every
  // D10 placement landing on one of only 3 raw degree values.
  const positionInPart = degreeInRashi % 3;
  return { index, name: rashi.name, english: rashi.english, degreeInRashi: (positionInPart / 3) * 30 };
}

/**
 * A structural Dashamsha (career) chart, re-expressing the natal D1
 * planets under D10 sign/house rules. Vedic divisional charts are always
 * derived arithmetically from the D1 positions, not a separate
 * astronomical event, so nakshatra and retrograde (meaningless at
 * divisional resolution) are simply carried over unchanged from the D1
 * placement -- only rashi and house genuinely change. Building it as a
 * real BirthChart-shaped object lets the existing dignity/house/aspect
 * machinery in scoring.ts and aspects.ts run against it completely
 * unmodified -- a D10 chart is examined with the same tools as a D1
 * chart, just fed different sign/house positions.
 */
export function computeD10Chart(chart: BirthChart): BirthChart {
  const ascendant = d10Rashi(chart.ascendant.index, chart.ascendant.degreeInRashi);
  const planets: PlanetPlacement[] = chart.planets.map((p) => {
    const rashi = d10Rashi(p.rashi.index, p.rashi.degreeInRashi);
    const house = ((rashi.index - ascendant.index + 12) % 12) + 1;
    return { ...p, rashi, house };
  });
  return { ...chart, ascendant, planets };
}
