import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  inkColor?: string;
  accentColor?: string;
  clayColor?: string;
  paperColor?: string;
}

/**
 * The landing hero's backdrop: concentric chart rings and axes that
 * quietly materialize and fade on a loop ("the chart casting itself"),
 * plus a small system of planets continuously orbiting -- one carrying a
 * tilted ring and its own moon, another a smaller moon -- at different,
 * independent speeds. Replaces the old ConstellationSky (removed after
 * founder feedback that named constellations felt redundant once this
 * orbit/ring system existed as the background motif). Fixed coordinates
 * throughout, same hydration-safety discipline ConstellationSky used --
 * no Math.random, server and client render identical markup.
 */
export function OrbitField({
  inkColor = "var(--primary)",
  accentColor = "var(--accent)",
  clayColor = "var(--muted-soft)",
  paperColor = "var(--surface)",
  ...props
}: Props) {
  const cx = 1000;
  const cy = 380;

  return (
    <svg viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" {...props}>
      <g fill={clayColor} opacity="0.5">
        <circle cx="90" cy="90" r="1.4" />
        <circle cx="220" cy="60" r="1.1" />
        <circle cx="1300" cy="140" r="1.4" />
        <circle cx="1180" cy="60" r="1.1" />
        <circle cx="60" cy="380" r="1.2" />
        <circle cx="1350" cy="500" r="1.3" />
        <circle cx="150" cy="600" r="1.1" />
      </g>

      <circle
        className="motion-ring-1"
        cx={cx}
        cy={cy}
        r="160"
        fill="none"
        stroke={inkColor}
        strokeWidth="0.75"
        opacity="0.18"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <circle
        className="motion-ring-2"
        cx={cx}
        cy={cy}
        r="100"
        fill="none"
        stroke={inkColor}
        strokeWidth="0.75"
        opacity="0.2"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <circle
        className="motion-ring-3"
        cx={cx}
        cy={cy}
        r="55"
        fill="none"
        stroke={accentColor}
        strokeWidth="0.6"
        opacity="0.16"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <line
        className="motion-axis-x"
        x1={cx - 160}
        y1={cy}
        x2={cx + 160}
        y2={cy}
        stroke={inkColor}
        strokeWidth="0.6"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <line
        className="motion-axis-y"
        x1={cx}
        y1={cy - 160}
        x2={cx}
        y2={cy + 160}
        stroke={inkColor}
        strokeWidth="0.6"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      <g className="motion-orbit-b" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx + 160} cy={cy} r="5.5" fill={clayColor} opacity="0.8" />
        <g className="motion-moon-b" style={{ transformOrigin: `${cx + 160}px ${cy}px` }}>
          <circle cx={cx + 167} cy={cy} r="1.4" fill={paperColor} />
        </g>
      </g>
      <g className="motion-orbit-a" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <ellipse
          cx={cx + 100}
          cy={cy}
          rx="11"
          ry="3.2"
          fill="none"
          stroke={clayColor}
          strokeWidth="0.7"
          opacity="0.7"
          transform={`rotate(-18 ${cx + 100} ${cy})`}
        />
        <circle cx={cx + 100} cy={cy} r="4.5" fill={accentColor} opacity="0.9" />
        <g className="motion-moon-a" style={{ transformOrigin: `${cx + 100}px ${cy}px` }}>
          <circle cx={cx + 109} cy={cy} r="1.3" fill={inkColor} opacity="0.75" />
        </g>
      </g>
      <g className="motion-orbit-c" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx + 55} cy={cy} r="2.6" fill={inkColor} opacity="0.55" />
      </g>
      <g className="motion-orbit-d" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx - 75} cy={cy} r="2.2" fill={accentColor} opacity="0.6" />
      </g>
    </svg>
  );
}
