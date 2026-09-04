import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  /** Which of the small preset "textures" to draw so rotation reads as
   * real spin rather than a flat static dot -- varies which sitewide
   * instances look identical. */
  variant?: "band" | "craters" | "ring";
  reverse?: boolean;
}

/**
 * A tiny standalone decorative planet, spinning slowly on its own axis.
 * Deliberately NOT orbiting anything (that's OrbitField, used only in the
 * landing hero) -- this is the sitewide motion accent, sprinkled in
 * margins/corners across other pages for a consistent motion language
 * without repeating the hero's busier orbit system.
 */
export function RotatingPlanet({ variant = "band", reverse, className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={`${reverse ? "motion-rotate-slow-rev" : "motion-rotate-slow"} ${className ?? ""}`}
      style={{ transformOrigin: "20px 20px" }}
      {...props}
    >
      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      {variant === "band" && (
        <>
          <path d="M5 20a15 15 0 0 0 30 0" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="27" cy="14" r="1.6" fill="currentColor" opacity="0.55" />
        </>
      )}
      {variant === "craters" && (
        <>
          <circle cx="15" cy="16" r="2" fill="currentColor" opacity="0.25" />
          <circle cx="25" cy="24" r="1.4" fill="currentColor" opacity="0.3" />
          <circle cx="22" cy="14" r="1" fill="currentColor" opacity="0.4" />
        </>
      )}
      {variant === "ring" && (
        <ellipse
          cx="20"
          cy="20"
          rx="19"
          ry="5"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
          transform="rotate(-16 20 20)"
        />
      )}
    </svg>
  );
}
