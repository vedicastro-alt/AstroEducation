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

/** A real, data-driven rendering of this child's actual chart -- not decoration. */
export function KundliChart({ chart, className }: Props) {
  const planetsBySign = new Map<number, string[]>();
  for (const p of chart.planets) {
    const list = planetsBySign.get(p.rashi.index) ?? [];
    list.push(PLANET_SHORT[p.key] ?? p.key.slice(0, 2));
    planetsBySign.set(p.rashi.index, list);
  }

  return (
    <div className={className}>
      <div className="grid aspect-square w-full grid-cols-4 grid-rows-4 gap-[3px] overflow-hidden rounded-2xl border border-border-soft bg-border-soft">
        {GRID.flatMap((row, r) =>
          row.map((signIndex, c) => {
            if (signIndex === null) {
              if (r === 1 && c === 1) {
                return (
                  <div
                    key="center"
                    className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-primary-tint px-2 text-center"
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
            return (
              <div
                key={`${r}-${c}`}
                className={`relative flex flex-col items-center justify-center bg-white p-1 ${
                  isAscendant ? "ring-2 ring-inset ring-accent" : ""
                }`}
              >
                <span className="absolute left-1 top-1 text-[0.55rem] font-medium text-muted">
                  {RASHIS[signIndex].english.slice(0, 3)}
                </span>
                {isAscendant && (
                  <span className="absolute right-1 top-1 rounded-full bg-accent px-1 py-px text-[0.5rem] font-bold text-white">
                    ASC
                  </span>
                )}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 px-1">
                  {planets.map((code) => (
                    <span
                      key={code}
                      className="text-[0.68rem] font-semibold text-primary-dark sm:text-xs"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
