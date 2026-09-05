"use client";

import type { BirthChart } from "@/lib/astro/types";
import { RASHIS } from "@/lib/astro/constants";

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
}

/**
 * A real, data-driven rendering of this child's actual chart -- not
 * decoration. Animates in on every mount, in the order the calculation
 * conceptually happens: each house's sign label drops into place first,
 * then each real planet placement pops in on top -- so the chart reads
 * as being cast live rather than appearing as a static image. Pure CSS
 * (see .motion-house-drop / .motion-planet-pop in globals.css).
 * Deliberately replays every time this chapter is opened (including
 * flipping back to it mid-session) -- the founder's own call, since
 * watching the chart get cast again is part of the delight of revisiting
 * this page, not something to suppress.
 *
 * Only the label/text inside each cell animates -- the cell's own white
 * background, border and ascendant ring render immediately. Animating
 * the whole cell (frame included) left a mid-animation moment where
 * not-yet-revealed cells were fully transparent, showing the shared grid
 * background straight through and reading as a chunk of the chart
 * missing/broken rather than "still loading" -- the full 4x4 grid
 * structure now exists from the first frame, and only the sign names
 * visibly populate into it.
 */
export function KundliChart({ chart, className }: Props) {
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
    <div className={className}>
      <div className="grid aspect-square w-full grid-cols-4 grid-rows-4 gap-[3px] overflow-hidden rounded-md border border-border-soft bg-border-soft">
        {GRID.flatMap((row, r) =>
          row.map((signIndex, c) => {
            if (signIndex === null) {
              if (r === 1 && c === 1) {
                return (
                  <div
                    key="center"
                    className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-primary-tint px-2 text-center"
                  >
                    <span
                      className="motion-house-drop font-serif text-xs font-semibold text-primary-dark sm:text-sm"
                      style={{ animationDelay: "0s" }}
                    >
                      Rashi Chart
                    </span>
                    <span
                      className="motion-house-drop mt-1 text-[0.6rem] text-muted"
                      style={{ animationDelay: "0s" }}
                    >
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
                className={`relative flex flex-col items-center justify-center bg-white p-1 ${
                  isAscendant ? "ring-2 ring-inset ring-accent" : ""
                }`}
              >
                <span
                  className="motion-house-drop absolute left-1 top-1 text-[0.55rem] font-medium text-muted"
                  style={{ animationDelay: `${houseDelay}s` }}
                >
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
