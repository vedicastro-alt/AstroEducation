import type { SVGProps } from "react";

/**
 * Decorative motif: the skeleton of a traditional North Indian Vedic
 * birth chart (a square, its diagonals, and the diamond formed by
 * connecting its midpoints) with a ring of 12 house-markers -- immediately
 * legible to anyone familiar with Vedic astrology, and a more honest
 * brand mark for this site than a generic Western zodiac wheel. Purely
 * decorative: it carries no real data.
 */
export function ChartWheel(props: SVGProps<SVGSVGElement>) {
  // Rounded to a fixed precision so server and client render identical
  // markup -- raw Math.cos/sin output can differ in its last decimal
  // digit between JS engines and trip a hydration mismatch.
  const round = (n: number) => Math.round(n * 1000) / 1000;

  const houses = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const r = 47;
    return {
      x: round(50 + r * Math.cos(angle)),
      y: round(50 + r * Math.sin(angle)),
      key: i,
    };
  });

  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <circle cx="50" cy="50" r="48.5" stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.5" />
      <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />
      <path d="M10 10 L90 90 M90 10 L10 90" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />
      <path d="M50 10 L90 50 L50 90 L10 50 Z" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="3.5" fill="currentColor" fillOpacity="0.55" />
      {houses.map((h) => (
        <circle key={h.key} cx={h.x} cy={h.y} r="1.4" fill="currentColor" fillOpacity="0.75" />
      ))}
    </svg>
  );
}
