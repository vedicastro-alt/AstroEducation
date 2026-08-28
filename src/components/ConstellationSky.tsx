import type { SVGProps } from "react";

/**
 * Decorative night-sky backdrop for the hero: a scattered star field plus
 * two constellation line-clusters with accent-lit nodes. Coordinates are
 * fixed (not Math.random) so server and client render identical markup --
 * same hydration-safety reasoning as ChartWheel. Two-tone by design (dust
 * + accent gold) rather than currentColor, since it's only ever used on
 * the dark hero background.
 */
export function ConstellationSky(props: SVGProps<SVGSVGElement>) {
  const dust = Array.from({ length: 55 }, (_, i) => ({
    cx: (i * 53 + 21) % 1440,
    cy: (i * 71 + 15) % 700,
    r: 1 + ((i % 3) * 0.7),
    key: i,
  }));

  const clusterA = [
    [180, 120],
    [340, 200],
    [300, 340],
    [520, 160],
  ];
  const clusterB = [
    [1000, 500],
    [1150, 420],
    [1240, 520],
    [1120, 280],
  ];

  const path = (points: number[][]) =>
    points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");

  return (
    <svg viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" {...props}>
      <g stroke="#d4a24e" strokeWidth="1" strokeOpacity="0.35" fill="none">
        <path d={`${path([clusterA[0], clusterA[1], clusterA[2]])} M${clusterA[1][0]} ${clusterA[1][1]} L${clusterA[3][0]} ${clusterA[3][1]}`} />
        <path d={`${path([clusterB[0], clusterB[1], clusterB[2]])} M${clusterB[1][0]} ${clusterB[1][1]} L${clusterB[3][0]} ${clusterB[3][1]}`} />
      </g>
      <g fill="#ffffff" opacity="0.55">
        {dust.map((d) => (
          <circle key={d.key} cx={d.cx} cy={d.cy} r={d.r} />
        ))}
      </g>
      <g fill="#d4a24e">
        {[...clusterA, ...clusterB].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" />
        ))}
      </g>
    </svg>
  );
}
