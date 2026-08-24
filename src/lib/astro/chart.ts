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

function ascendantTropicalLongitude(
  time: Astronomy.AstroTime,
  latitude: number,
  longitude: number,
): number {
  const gastHours = Astronomy.SiderealTime(time);
  const localSiderealDeg = normalizeDegrees(gastHours * 15 + longitude);
  const obliquityDeg = Astronomy.e_tilt(time).tobl;

  const ramcRad = (localSiderealDeg * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;
  const oblRad = (obliquityDeg * Math.PI) / 180;

  const y = -Math.cos(ramcRad);
  const x = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(ramcRad);
  const ascRad = Math.atan2(y, x);
  return normalizeDegrees((ascRad * 180) / Math.PI);
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
