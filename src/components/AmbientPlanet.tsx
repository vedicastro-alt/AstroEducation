"use client";

import { usePathname } from "next/navigation";

/**
 * The ambient "night sky" layer: a ringed planet drifting and slowly
 * rotating on its own axis, plus a handful of small stars scattered
 * around the viewport, gently twinkling. Fixed position (not
 * per-section), so it reads as one persistent presence across the whole
 * site rather than a decoration that has to be scrolled to. Mounted
 * once in the root layout; pure CSS animation, no other client JS.
 *
 * The planet sits on the left -- the header's own CTA button already
 * anchors the right side on every page, so this balances the page
 * instead of stacking more weight on top of it.
 *
 * Skipped on the homepage: the hero there already has its own dedicated
 * OrbitField planet/orbit system (with its own static dust stars) in
 * the same spirit, so this would just double up on it rather than
 * filling a gap.
 */
export function AmbientPlanet() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div
      aria-hidden
      className="no-print pointer-events-none fixed inset-0 z-10 hidden overflow-hidden sm:block"
    >
      <span className="motion-twinkle-a absolute left-[10%] top-[16%] h-1 w-1 rounded-full bg-accent/70" />
      <span className="motion-twinkle-b absolute left-[88%] top-[10%] h-[3px] w-[3px] rounded-full bg-muted-soft/70" style={{ animationDelay: "0.9s" }} />
      <span className="motion-twinkle-c absolute left-[93%] top-[52%] h-1 w-1 rounded-full bg-accent/60" style={{ animationDelay: "1.7s" }} />
      <span className="motion-twinkle-a absolute left-[80%] top-[76%] h-[3px] w-[3px] rounded-full bg-muted-soft/60" style={{ animationDelay: "2.4s" }} />
      <span className="motion-twinkle-b absolute left-[22%] top-[85%] h-1 w-1 rounded-full bg-accent/50" style={{ animationDelay: "1.3s" }} />
      <span className="motion-twinkle-c absolute left-[30%] top-[38%] h-[2px] w-[2px] rounded-full bg-muted-soft/60" style={{ animationDelay: "0.4s" }} />

      <div className="motion-drift absolute top-1/2 left-3 h-44 w-44 -translate-y-1/2 opacity-[0.24] sm:left-6 sm:h-52 sm:w-52">
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
    </div>
  );
}
