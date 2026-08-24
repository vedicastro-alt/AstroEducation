import type { SVGProps } from "react";

type IconComponent = (props: SVGProps<SVGSVGElement>) => React.ReactNode;

// Fixed (not random) scatter layout so server and client render identical
// markup -- Math.random() here would trip the same class of hydration
// mismatch the ChartWheel coordinates did earlier.
const LAYOUT = [
  { top: "6%", left: "8%", size: 34, rotate: -12, opacity: 0.16 },
  { top: "14%", left: "82%", size: 46, rotate: 18, opacity: 0.12 },
  { top: "72%", left: "4%", size: 40, rotate: 8, opacity: 0.14 },
  { top: "84%", left: "76%", size: 30, rotate: -20, opacity: 0.18 },
  { top: "38%", left: "92%", size: 26, rotate: 30, opacity: 0.15 },
  { top: "58%", left: "50%", size: 90, rotate: -6, opacity: 0.07 },
  { top: "4%", left: "45%", size: 24, rotate: 12, opacity: 0.13 },
  { top: "90%", left: "30%", size: 28, rotate: -25, opacity: 0.15 },
];

export function IconPattern({ icon: Icon }: { icon: IconComponent }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {LAYOUT.map((item, i) => (
        <Icon
          key={i}
          style={{
            position: "absolute",
            top: item.top,
            left: item.left,
            width: item.size,
            height: item.size,
            opacity: item.opacity,
            transform: `rotate(${item.rotate}deg)`,
          }}
          className="text-current"
        />
      ))}
    </div>
  );
}
