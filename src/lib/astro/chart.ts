import * as Astronomy from "astronomy-engine";
import {
  DEG_PER_NAKSHATRA,
  DEG_PER_PADA,
  DEG_PER_RASHI,
  NAKSHATRAS,
  PLANET_KEYS,
  RASHIS,
  type PlanetKey,
} from "./constants";
import { lahiriAyanamsa } from "./ayanamsa";
import type {
  BirthChart,
  NakshatraPlacement,
  PlanetPlacement,
  RashiPlacement,
} from "./types";

function normalizeDegrees(deg: number): number {
  const wrapped = deg % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

function toRashi(siderealLongitude: number): RashiPlacement {
  const index = Math.floor(siderealLongitude / DEG_PER_RASHI) % 12;
  const rashi = RASHIS[index];
  return {
    index,
    name: rashi.name,
    english: rashi.english,
    degreeInRashi: siderealLongitude - index * DEG_PER_RASHI,
  };
}

function toNakshatra(siderealLongitude: number): NakshatraPlacement {
  const index = Math.floor(siderealLongitude / DEG_PER_NAKSHATRA) % 27;
  const withinNakshatra = siderealLongitude - index * DEG_PER_NAKSHATRA;
  const pada = Math.floor(withinNakshatra / DEG_PER_PADA) + 1;
  const nakshatra = NAKSHATRAS[index];
  return { index, name: nakshatra.name, lord: nakshatra.lord, pada };
}

/** Mean lunar node longitude (Meeus, ch. 47), tropical. */
function meanNodeLongitude(julianDay: number): number {
  const T = (julianDay - 2451545.0) / 36525;
  const omega =
    125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000;
  return normalizeDegrees(omega);
}

function geocentricEclipticLongitudeOfDate(
  body: Astronomy.Body,
  time: Astronomy.AstroTime,
): number {
  const vector = Astronomy.GeoVector(body, time, true);
  const ecliptic = Astronomy.Ecliptic(vector);
  return normalizeDegrees(ecliptic.elon);
}

function isRetrograde(
  body: Astronomy.Body,
  time: Astronomy.AstroTime,
): boolean {
  const before = geocentricEclipticLongitudeOfDate(
    body,
    time.AddDays(-0.5),
  );
  const after = geocentricEclipticLongitudeOfDate(body, time.AddDays(0.5));
  let delta = after - before;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

/**
 * Ascendant = the point of the ecliptic-of-date currently sitting on the
 * eastern horizon (azimuth 0-180). Found by rotating sample points around
 * the ecliptic into horizontal coordinates (via astronomy-engine's own,
 * tested rotation matrices) and bisecting for the eastern horizon crossing,
 * rather than trusting a hand-derived trig formula: an earlier version of
 * this used the textbook RAMC/obliquity tangent formula, but its quadrant
 * resolution was wrong and it silently returned the Descendant (180° off)
 * for every chart. This approach was verified against that formula's
 * failure across many latitudes/times before replacing it.
 */
function ascendantTropicalLongitude(
  time: Astronomy.AstroTime,
  latitude: number,
  longitude: number,
): number {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const rotEclToEqd = Astronomy.Rotation_ECT_EQD(time);
  const rotEqdToHor = Astronomy.Rotation_EQD_HOR(time, observer);

  function horizontalAt(eclipticLonDeg: number) {
    const lonRad = (eclipticLonDeg * Math.PI) / 180;
    const eclVec = new Astronomy.Vector(Math.cos(lonRad), Math.sin(lonRad), 0, time);
    const eqd = Astronomy.RotateVector(rotEclToEqd, eclVec);
    const hor = Astronomy.RotateVector(rotEqdToHor, eqd);
    return Astronomy.HorizonFromVector(hor, "normal");
  }

  const sampleCount = 360;
  let prevLon = 0;
  let prevAltitude = horizontalAt(0).lat;

  for (let i = 1; i <= sampleCount; i++) {
    const lon = (360 * i) / sampleCount;
    const sample = horizontalAt(lon);
    if ((prevAltitude < 0) !== (sample.lat < 0)) {
      let lo = prevLon;
      let hi = lon;
      let altAtLo = prevAltitude;
      for (let iter = 0; iter < 24; iter++) {
        const mid = (lo + hi) / 2;
        const altAtMid = horizontalAt(mid).lat;
        if (altAtLo < 0 === altAtMid < 0) {
          lo = mid;
          altAtLo = altAtMid;
        } else {
          hi = mid;
        }
      }
      const crossing = (lo + hi) / 2;
      const azimuth = horizontalAt(crossing).lon;
      if (azimuth >= 0 && azimuth <= 180) {
        return normalizeDegrees(crossing);
      }
    }
    prevLon = lon;
    prevAltitude = sample.lat;
  }

  throw new Error("Could not locate the ascendant for this time and location.");
}

export interface ComputeChartInput {
  utcDate: Date;
  latitude: number;
  longitude: number;
  timeWasEstimated: boolean;
}

export function computeBirthChart(input: ComputeChartInput): BirthChart {
  const time = Astronomy.MakeTime(input.utcDate);
  const julianDay = input.utcDate.getTime() / 86400000 + 2440587.5;
  const ayanamsa = lahiriAyanamsa(julianDay);

  const bodyByKey: Partial<Record<PlanetKey, Astronomy.Body>> = {
    Sun: Astronomy.Body.Sun,
    Mars: Astronomy.Body.Mars,
    Mercury: Astronomy.Body.Mercury,
    Jupiter: Astronomy.Body.Jupiter,
    Venus: Astronomy.Body.Venus,
    Saturn: Astronomy.Body.Saturn,
  };

  const ascendantTropical = ascendantTropicalLongitude(
    time,
    input.latitude,
    input.longitude,
  );
  const ascendantSidereal = normalizeDegrees(ascendantTropical - ayanamsa);
  const ascendant = toRashi(ascendantSidereal);

  const rahuTropical = meanNodeLongitude(julianDay);

  const planets: PlanetPlacement[] = PLANET_KEYS.map((key) => {
    let tropicalLongitude: number;
    let retrograde = false;

    if (key === "Moon") {
      tropicalLongitude = normalizeDegrees(
        Astronomy.EclipticGeoMoon(time).lon,
      );
    } else if (key === "Rahu") {
      tropicalLongitude = rahuTropical;
      retrograde = true;
    } else if (key === "Ketu") {
      tropicalLongitude = normalizeDegrees(rahuTropical + 180);
      retrograde = true;
    } else {
      const body = bodyByKey[key]!;
      tropicalLongitude = geocentricEclipticLongitudeOfDate(body, time);
      if (key !== "Sun") {
        retrograde = isRetrograde(body, time);
      }
    }

    const siderealLongitude = normalizeDegrees(tropicalLongitude - ayanamsa);
    const rashi = toRashi(siderealLongitude);
    const nakshatra = toNakshatra(siderealLongitude);
    const house = ((rashi.index - ascendant.index + 12) % 12) + 1;

    return { key, siderealLongitude, rashi, nakshatra, house, retrograde };
  });

  return {
    ascendant,
    planets,
    ayanamsa,
    julianDay,
    timeWasEstimated: input.timeWasEstimated,
  };
}
