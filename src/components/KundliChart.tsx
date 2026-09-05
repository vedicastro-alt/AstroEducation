"use client";

import { useEffect, useRef, useState } from "react";
import type { BirthChart } from "@/lib/astro/types";
import { RASHIS } from "@/lib/astro/constants";

// Tracks which charts have already cast themselves once during this
// browser session (module-level, so it survives BookReader's page-turn
// remounts but resets on a real page reload -- a fresh load is a
// legitimate "cast it again" moment, flipping back and forth between
// chapters is not). Without this, AnimatePresence unmounting/remounting
// this component on every "Next"/"Previous" replayed the full house-drop
// -> planet-pop sequence every single time a reader revisited this
// chapter, which real-user testing found read as broken/looping rather
// than a one-time reveal.
const alreadyCast = new Set<string>();

const PLANET_SHORT: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
};

/**
 * South Indian style chart: signs sit in fixed grid positions (Aries is
 * always here, Taurus always there, ...) regardless of the child's
 * ascendant -- planets are placed by which sign they actually occupy.
 * The center 2x2 block is unused by convention and carries the label.
 * Index is the rashi index (0 = Aries ... 11 = Pisces); null = center.
 */
const GRID: (number | null)[][] = [
  [11, 0, 1, 2],
  [10, null, null, 3],
  [9, null, null, 4],
  [8, 7, 6, 5],
];

interface Props {
  chart: BirthChart;
  className?: string;
  /** Unique per rendering context (e.g. `chapter-${reportId}` vs
   * `unlock-${reportId}`) so the chapter view and the post-payment
   * unlock moment each get their own "have I cast this already" memory
   * instead of sharing one. */
  castId: string;
}

/**
 * A real, data-driven rendering of this child's actual chart -- not
 * decoration. Animates in once per `castId` per browser session, in the
 * order the calculation conceptually happens: the grid of houses drops
 * into place first, then each real planet placement pops in on top -- so
 * the chart reads as being cast live rather than appearing as a static
 * image. Pure CSS (see .motion-house-drop / .motion-planet-pop in
 * globals.css). Re-showing the same `castId` again (e.g. flipping back
 * to this chapter) renders already-settled, no replay.
 */
export function KundliChart({ chart, className, castId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Read-only in the initializer (must stay pure -- React's Strict Mode
  // double-invokes it in development) -- the actual "mark as seen" write
  // happens in the effect below, after mount, which is safe to run twice.
  const [wasAlreadyCast] = useState(() => alreadyCast.has(castId));
  useEffect(() => {
    // BookReader also mounts every chapter permanently (just CSS-hidden)
    // in its print-only flattened view, so the chart chapter has a
    // second, invisible KundliChart instance sharing this same castId,
    // mounting on every page load regardless of which chapter is open on
    // screen. If that hidden copy were allowed to mark castId as seen,
    // a real first-time reader would never get to watch it animate at
    // all. `offsetParent === null` is how a display:none ancestor (the
    // print wrapper) shows up here -- only a genuinely on-screen mount
    // gets to claim it.
    if (containerRef.current?.offsetParent === null) return;
    alreadyCast.add(castId);
  }, [castId]);
  const planetsBySign = new Map<number, string[]>();
  const planetDelay = new Map<string, number>();
  chart.planets.forEach((p, i) => {
    const code = PLANET_SHORT[p.key] ?? p.key.slice(0, 2);
    const list = planetsBySign.get(p.rashi.index) ?? [];
    list.push(code);
    planetsBySign.set(p.rashi.index, list);
    planetDelay.set(`${p.rashi.index}-${code}-${list.length}`, i);
  });
  // Houses finish dropping in by roughly this point; planets start after.
  // Deliberately unhurried -- slow enough that a parent actually watches
  // the chart get cast, rather than blinking and missing it.
  const HOUSE_STAGGER = 0.09;
  const HOUSE_SETTLE = 1.3;
  const PLANET_STAGGER = 0.22;

  // Precomputed once, outside the JSX-producing map, so no counter is
  // mutated during render itself.
  const houseOrder = new Map<string, number>();
  GRID.flatMap((row, r) => row.map((signIndex, c) => ({ r, c, signIndex })))
    .filter((cell) => cell.signIndex !== null)
    .forEach((cell, i) => houseOrder.set(`${cell.r}-${cell.c}`, i));

  return (
    <div className={className} ref={containerRef}>
      <div
        className={`grid aspect-square w-full grid-cols-4 grid-rows-4 gap-[3px] overflow-hidden rounded-md border border-border-soft bg-border-soft ${
          wasAlreadyCast ? "chart-settled" : ""
        }`}
      >
        {GRID.flatMap((row, r) =>
          row.map((signIndex, c) => {
            if (signIndex === null) {
              if (r === 1 && c === 1) {
                return (
                  <div
                    key="center"
                    className="motion-house-drop col-span-2 row-span-2 flex flex-col items-center justify-center bg-primary-tint px-2 text-center"
                    style={{ animationDelay: "0s" }}
                  >
                    <span className="font-serif text-xs font-semibold text-primary-dark sm:text-sm">
                      Rashi Chart
                    </span>
                    <span className="mt-1 text-[0.6rem] text-muted">
                      Ascendant: {chart.ascendant.name}
                    </span>
                  </div>
                );
              }
              return null;
            }
            const isAscendant = signIndex === chart.ascendant.index;
            const planets = planetsBySign.get(signIndex) ?? [];
            const houseDelay = (houseOrder.get(`${r}-${c}`) ?? 0) * HOUSE_STAGGER;
            return (
              <div
                key={`${r}-${c}`}
                className={`motion-house-drop relative flex flex-col items-center justify-center bg-white p-1 ${
                  isAscendant ? "ring-2 ring-inset ring-accent" : ""
                }`}
                style={{ animationDelay: `${houseDelay}s` }}
              >
                <span className="absolute left-1 top-1 text-[0.55rem] font-medium text-muted">
                  {RASHIS[signIndex].english.slice(0, 3)}
                </span>
                {isAscendant && (
                  <span
                    className="motion-planet-pop absolute right-1 top-1 rounded-sm bg-accent px-1 py-px text-[0.5rem] font-bold text-white"
                    style={{ animationDelay: `${HOUSE_SETTLE}s` }}
                  >
                    ASC
                  </span>
                )}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 px-1">
                  {planets.map((code, i) => {
                    const key = `${signIndex}-${code}-${i + 1}`;
                    const order = planetDelay.get(key) ?? 0;
                    return (
                      <span
                        key={code + i}
                        className="motion-planet-pop text-[0.68rem] font-semibold text-primary-dark sm:text-xs"
                        style={{ animationDelay: `${HOUSE_SETTLE + order * PLANET_STAGGER}s` }}
                      >
                        {code}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
