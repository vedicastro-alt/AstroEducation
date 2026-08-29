/**
 * Single source of truth for age-band derivation, shared by every part of
 * the content engine that needs to vary by the child's actual age (the
 * conversion-test finding was that age-tailoring was cosmetic -- a header
 * swap -- rather than structural, precisely because subjects.ts/direction.ts
 * never received the child's age at all). Bands match the existing
 * display copy in pathway.ts's ageBandFor (Early Years / Primary Years /
 * Tween Years / Teen Years / Young Adult Years) so the cosmetic banner and
 * the underlying content stay in sync.
 */
export type AgeBand = "early" | "primary" | "middle" | "senior" | "youngAdult";

export function ageInYears(dob: string, asOf: Date = new Date()): number {
  const birth = new Date(dob + "T00:00:00Z");
  let age = asOf.getUTCFullYear() - birth.getUTCFullYear();
  const hasHadBirthdayThisYear =
    asOf.getUTCMonth() > birth.getUTCMonth() ||
    (asOf.getUTCMonth() === birth.getUTCMonth() && asOf.getUTCDate() >= birth.getUTCDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return Math.max(0, age);
}

export function ageBandFromAge(age: number): AgeBand {
  if (age <= 5) return "early";
  if (age <= 10) return "primary";
  if (age <= 13) return "middle";
  if (age <= 17) return "senior";
  return "youngAdult";
}
