import tzlookup from "tz-lookup";
import { DateTime } from "luxon";
import { searchFallbackCities } from "./fallback-cities";

export interface GeocodeResult {
  label: string;
  latitude: number;
  longitude: number;
  countryCode?: string;
}

interface OpenMeteoResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
}

/**
 * Free, keyless geocoding via Open-Meteo. Only a place name is sent —
 * never the child's name or birth date/time.
 */
export async function geocodePlace(
  query: string,
): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("geocoding provider error");
    const data = (await response.json()) as { results?: OpenMeteoResult[] };
    const results = (data.results ?? []).map((r) => ({
      label: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
      latitude: r.latitude,
      longitude: r.longitude,
      countryCode: r.country_code,
    }));
    return results.length > 0 ? results : searchFallbackCities(trimmed);
  } catch {
    // Live lookup unavailable (offline, blocked, or provider down) —
    // fall back to a small bundled list of major cities so the form
    // never leaves a parent stuck.
    return searchFallbackCities(trimmed);
  }
}

/**
 * Resolves the IANA timezone for a location and converts a local
 * birth date/time in that zone to a precise UTC instant, correctly
 * handling the historical DST/offset rules in effect on that date.
 */
export function resolveBirthInstant(
  latitude: number,
  longitude: number,
  date: string,
  time: string,
): { utcDate: Date; timezone: string } {
  const timezone = tzlookup(latitude, longitude);
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const local = DateTime.fromObject(
    { year, month, day, hour, minute },
    { zone: timezone },
  );

  if (!local.isValid) {
    throw new Error("That birth date and time could not be understood.");
  }

  return { utcDate: local.toUTC().toJSDate(), timezone };
}
