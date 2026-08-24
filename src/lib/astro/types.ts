import type { PlanetKey } from "./constants";

export interface RashiPlacement {
  index: number; // 0-11
  name: string;
  english: string;
  degreeInRashi: number; // 0-30
}

export interface NakshatraPlacement {
  index: number; // 0-26
  name: string;
  lord: string;
  pada: number; // 1-4
}

export interface PlanetPlacement {
  key: PlanetKey;
  siderealLongitude: number; // 0-360
  rashi: RashiPlacement;
  nakshatra: NakshatraPlacement;
  house: number; // 1-12, whole-sign from ascendant
  retrograde: boolean;
}

export interface BirthChart {
  ascendant: RashiPlacement;
  planets: PlanetPlacement[];
  ayanamsa: number;
  julianDay: number;
  timeWasEstimated: boolean;
}

export interface BirthDetails {
  childName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm, 24h
  timeUnknown: boolean;
  placeLabel: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA
}
