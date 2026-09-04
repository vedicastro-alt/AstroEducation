/**
 * A single ringed planet, faded into the corner of every page, drifting
 * and slowly rotating on its own axis continuously -- the "something is
 * always quietly moving" ambient layer the founder asked for after
 * seeing a reference of a soft, glowing ringed planet against a
 * twinkling starfield. Fixed position (not per-section), so it reads
 * as one persistent presence across the whole site rather than a
 * decoration that has to be scrolled to. Mounted once in the root
 * layout; pure CSS animation, no client JS.
 */
export function AmbientPlanet() {
  return (
    <div
      aria-hidden
      className="no-print pointer-events-none fixed -right-16 bottom-[-4rem] -z-10 h-72 w-72 opacity-[0.16] sm:-right-10 sm:bottom-[-3rem] sm:h-80 sm:w-80"
    >
      <div className="motion-drift h-full w-full">
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
