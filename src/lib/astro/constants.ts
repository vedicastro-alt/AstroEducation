export const RASHIS = [
  { name: "Mesha", english: "Aries" },
  { name: "Vrishabha", english: "Taurus" },
  { name: "Mithuna", english: "Gemini" },
  { name: "Karka", english: "Cancer" },
  { name: "Simha", english: "Leo" },
  { name: "Kanya", english: "Virgo" },
  { name: "Tula", english: "Libra" },
  { name: "Vrishchika", english: "Scorpio" },
  { name: "Dhanu", english: "Sagittarius" },
  { name: "Makara", english: "Capricorn" },
  { name: "Kumbha", english: "Aquarius" },
  { name: "Meena", english: "Pisces" },
] as const;

export const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu" },
  { name: "Bharani", lord: "Venus" },
  { name: "Krittika", lord: "Sun" },
  { name: "Rohini", lord: "Moon" },
  { name: "Mrigashira", lord: "Mars" },
  { name: "Ardra", lord: "Rahu" },
  { name: "Punarvasu", lord: "Jupiter" },
  { name: "Pushya", lord: "Saturn" },
  { name: "Ashlesha", lord: "Mercury" },
  { name: "Magha", lord: "Ketu" },
  { name: "Purva Phalguni", lord: "Venus" },
  { name: "Uttara Phalguni", lord: "Sun" },
  { name: "Hasta", lord: "Moon" },
  { name: "Chitra", lord: "Mars" },
  { name: "Swati", lord: "Rahu" },
  { name: "Vishakha", lord: "Jupiter" },
  { name: "Anuradha", lord: "Saturn" },
  { name: "Jyeshtha", lord: "Mercury" },
  { name: "Mula", lord: "Ketu" },
  { name: "Purva Ashadha", lord: "Venus" },
  { name: "Uttara Ashadha", lord: "Sun" },
  { name: "Shravana", lord: "Moon" },
  { name: "Dhanishta", lord: "Mars" },
  { name: "Shatabhisha", lord: "Rahu" },
  { name: "Purva Bhadrapada", lord: "Jupiter" },
  { name: "Uttara Bhadrapada", lord: "Saturn" },
  { name: "Revati", lord: "Mercury" },
] as const;

export const PLANET_KEYS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
] as const;

export type PlanetKey = (typeof PLANET_KEYS)[number];

export const RASHI_COUNT = 12;
export const NAKSHATRA_COUNT = 27;
export const DEG_PER_RASHI = 360 / RASHI_COUNT;
export const DEG_PER_NAKSHATRA = 360 / NAKSHATRA_COUNT;
export const DEG_PER_PADA = DEG_PER_NAKSHATRA / 4;
