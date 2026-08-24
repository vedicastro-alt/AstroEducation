/**
 * Lahiri (Chitrapaksha) ayanamsa, linearised around J2000.0.
 * Reference value and precession rate follow the IAU 2006 general
 * precession constant; this is accurate to a few arcminutes, which is
 * sufficient for sign/nakshatra placement but not for exact cusp work.
 */
const AYANAMSA_AT_J2000_DEG = 23.85328;
const PRECESSION_ARCSEC_PER_YEAR = 50.2388475;

export function lahiriAyanamsa(julianDay: number): number {
  const yearsSinceJ2000 = (julianDay - 2451545.0) / 365.25;
  const drift = (yearsSinceJ2000 * PRECESSION_ARCSEC_PER_YEAR) / 3600;
  return AYANAMSA_AT_J2000_DEG + drift;
}
