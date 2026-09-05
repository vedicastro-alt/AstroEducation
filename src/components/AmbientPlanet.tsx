"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const SPARKLE_PATH =
  "M11 2c.7 3.6 2.2 5.6 6 6.5-3.8.9-5.3 2.9-6 6.5-.7-3.6-2.2-5.6-6-6.5 3.8-.9 5.3-2.9 6-6.5Z";

// Every star lives in the top ~22% of the viewport, just below the
// sticky header -- deliberately, not by half-measure. This is a fixed,
// whole-viewport layer, so a star scattered across the *full* height
// (as earlier versions did) will eventually sit on top of whatever real
// content -- paragraph text, or worse, a form field -- happens to
// occupy that same band on some page at some width. A form's actual
// inputs never start this close to the header on any page in this
// site (checked: /report, /gift, /redeem all have at least this much
// padding/heading before their first field), so confining every star to
// this band is a structural guarantee against a repeat of the
// name-field overlap saga, not a per-page breakpoint guess.
const STARS: Array<{
  left: string;
  top: string;
  size: number;
  color: "text-accent" | "text-muted-soft";
  motion: "motion-twinkle-a" | "motion-twinkle-b" | "motion-twinkle-c";
  delay: string;
}> = [
  { left: "8%", top: "9%", size: 18, color: "text-accent", motion: "motion-twinkle-a", delay: "0s" },
  { left: "47%", top: "6%", size: 15, color: "text-muted-soft", motion: "motion-twinkle-b", delay: "0.9s" },
  { left: "88%", top: "12%", size: 20, color: "text-accent", motion: "motion-twinkle-c", delay: "1.7s" },
  { left: "72%", top: "19%", size: 16, color: "text-muted-soft", motion: "motion-twinkle-a", delay: "2.4s" },
  { left: "28%", top: "16%", size: 18, color: "text-accent", motion: "motion-twinkle-b", delay: "1.3s" },
  { left: "18%", top: "20%", size: 13, color: "text-muted-soft", motion: "motion-twinkle-c", delay: "0.4s" },
];

/**
 * The ambient "night sky" layer: a ringed planet drifting and slowly
 * rotating on its own axis, plus a handful of real sparkle-shaped stars,
 * glowing up bright and big before fading back down small and dim -- not
 * a subtle dot-opacity flicker, an actual glinting star. Fixed position
 * (not per-section), so it reads as one persistent presence across the
 * whole site. Mounted once in the root layout; pure CSS animation, no
 * other client JS.
 *
 * Shown on every screen size, including real narrow mobile -- there is
 * no breakpoint gate here at all. That's only safe because everything
 * in this layer is confined to the top band (see STARS' comment above
 * and the planet's own `top-16` position below); a version of this
 * component once scattered decorations across the *entire* viewport
 * height and had to be hidden below various breakpoints per-page to
 * avoid landing on real content (see this file's git history) --
 * constraining the vertical range instead of gating by screen width
 * is what makes "visible everywhere" actually safe.
 */
export function AmbientPlanet() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      aria-hidden
      className="no-print pointer-events-none fixed inset-0 z-10 overflow-hidden"
    >
      {STARS.map((star, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${star.motion} ${star.color} absolute`}
          style={
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              transformOrigin: "center",
              animationDelay: star.delay,
            } as CSSProperties
          }
        >
          <path d={SPARKLE_PATH} />
        </svg>
      ))}

      {!isHome && (
        <div className="motion-drift absolute top-16 left-3 h-20 w-20 opacity-[0.38] sm:top-20 sm:left-6 sm:h-28 sm:w-28">
          <svg viewBox="0 0 200 200" className="h-full w-full motion-rotate-slow" style={{ transformOrigin: "100px 100px" }}>
            <g className="text-accent">
              <ellipse cx="100" cy="100" rx="46" ry="46" fill="currentColor" opacity="0.9" />
              <path d="M100 54a46 46 0 0 1 0 92" fill="#000" opacity="0.08" />
            </g>
            <g stroke="currentColor" className="text-primary" strokeWidth="1.4" fill="none" opacity="0.7">
              <ellipse cx="100" cy="100" rx="88" ry="24" transform="rotate(-14 100 100)" />
              <ellipse cx="100" cy="100" rx="72" ry="19" transform="rotate(-14 100 100)" />
            </g>
            <g fill="currentColor" className="text-muted-soft">
              <circle cx="24" cy="30" r="1.6" />
              <circle cx="170" cy="20" r="1.2" />
              <circle cx="182" cy="160" r="1.6" />
              <circle cx="14" cy="150" r="1.2" />
              <circle cx="60" cy="10" r="1" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
