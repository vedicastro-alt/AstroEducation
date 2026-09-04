import type { SVGProps } from "react";

/**
 * The GrowthPathIcon brand mark, animated: stem grows first, then both
 * branches, then the star pops in, then it holds and fades for another
 * pass -- looping so it isn't a one-shot a visitor can miss. Same path
 * geometry as the static GrowthPathIcon in icons.tsx (not a new shape),
 * just rendered larger and staggered. Reused wherever the site wants a
 * "the mark growing" moment (hero, footer flourish) instead of a static
 * logo.
 */
export function GrowingMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g className="motion-grow-stem">
        <path d="M11 15.5V21" />
      </g>
      <g className="motion-grow-branch-l">
        <path d="M11 15.5c0-3.2-2.3-5.5-6.4-5.5 0 3.7 1.8 6.4 6.4 6.4Z" />
      </g>
      <g className="motion-grow-branch-r">
        <path d="M11 18c0-3.6 2.5-6.4 6.9-6.4 0 4.1-2 7.3-6.9 7.3" />
      </g>
      <path
        className="motion-grow-star"
        d="M18.5 3c.4 1.7 1 2.7 2.6 3.1-1.6.4-2.2 1.4-2.6 3.1-.4-1.7-1-2.7-2.6-3.1 1.6-.4 2.2-1.4 2.6-3.1Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
