import type { SVGProps } from "react";

/**
 * A small set of hand-drawn, single-weight line icons in one consistent
 * style (round caps, 1.5-1.6 stroke, 24px grid) so the report reads as
 * one designed system instead of mixed emoji glyphs.
 */

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.5c.7 3.1 1.8 5 3.4 6.6 1.6 1.6 3.5 2.7 6.6 3.4-3.1.7-5 1.8-6.6 3.4-1.6 1.6-2.7 3.5-3.4 6.6-.7-3.1-1.8-5-3.4-6.6-1.6-1.6-3.5-2.7-6.6-3.4 3.1-.7 5-1.8 6.6-3.4 1.6-1.6 2.7-3.5 3.4-6.6Z" />
    </svg>
  );
}

export function SproutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21V11" />
      <path d="M12 11c0-3.5-2.5-6-7-6 0 4 2 7 7 7Z" />
      <path d="M12 14c0-4 2.8-7 7.5-7 0 4.5-2.2 8-7.5 8" />
    </svg>
  );
}

/**
 * Brand mark: a growth path (sprout) with a small rising star -- used for
 * the header/footer wordmark and standalone marketing assets (favicon,
 * social profile images). Distinct in shape from a plain sparkle/star so
 * it doesn't read as a generic "stargazer" icon.
 */
export function GrowthPathIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 15.5V21" />
      <path d="M11 15.5c0-3.2-2.3-5.5-6.4-5.5 0 3.7 1.8 6.4 6.4 6.4Z" />
      <path d="M11 18c0-3.6 2.5-6.4 6.9-6.4 0 4.1-2 7.3-6.9 7.3" />
      <path
        d="M18.5 3c.4 1.7 1 2.7 2.6 3.1-1.6.4-2.2 1.4-2.6 3.1-.4-1.7-1-2.7-2.6-3.1 1.6-.4 2.2-1.4 2.6-3.1Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function TargetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function OrbitIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3.25" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.4" transform="rotate(-14 12 12)" />
      <circle cx="21.2" cy="9.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4.75C5.2 4 7 3.75 12 5v14.25c-5-1.25-6.8-1-8 -.25Z" />
      <path d="M20 4.75c-1.2-.75-3-1-8 .25v14.25c5-1.25 6.8-1 8-.25Z" />
    </svg>
  );
}

export function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2 13 13l-3.8 1.8L11 11l3.8-1.8Z" />
    </svg>
  );
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.25h12V10" />
      <path d="M10 19.25v-5.5h4v5.5" />
    </svg>
  );
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 9.5h16" />
      <path d="M8 3.5v3.5M16 3.5v3.5" />
    </svg>
  );
}

export function TelescopeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.5 15.5 15 9l2.2 4-11.5 6.5Z" />
      <path d="M15 9 20.5 6l.8 4.3-4.6 2.7" />
      <path d="M8 17.5 6 21" />
      <circle cx="9.5" cy="6" r="1.5" />
    </svg>
  );
}

export function PrinterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 8.5V4h10v4.5" />
      <rect x="4" y="8.5" width="16" height="7.5" rx="1.5" />
      <path d="M7 14.5h10v5.5H7z" />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M11 2c.7 3.6 2.2 5.6 6 6.5-3.8.9-5.3 2.9-6 6.5-.7-3.6-2.2-5.6-6-6.5 3.8-.9 5.3-2.9 6-6.5Z" />
      <path d="M18 15c.4 1.9 1.1 2.9 3 3.4-1.9.5-2.6 1.5-3 3.4-.4-1.9-1.1-2.9-3-3.4 1.9-.5 2.6-1.5 3-3.4Z" />
    </svg>
  );
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a6.8 6.8 0 0 0 9.5 9.5Z" />
    </svg>
  );
}

export function CandleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2.5c1.2 1.4 1.8 2.5 1.8 3.4a1.8 1.8 0 1 1-3.6 0c0-.9.6-2 1.8-3.4Z" />
      <rect x="9" y="8.5" width="6" height="12.5" rx="1.2" />
      <path d="M9 13.5h6" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}
