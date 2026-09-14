/**
 * Icon medallions + a "certificate" archetype title for each of the 9
 * tracked subjects (`lib/education/subjects.ts`'s `SUBJECTS`), used only
 * by the share-image graphic (`report/[id]/share-image`). Deliberately
 * hand-drawn line icons rather than an AI-generated image: this codebase
 * has no image-generation API configured, and generating imagery tied to
 * a specific real child's name is its own product/privacy decision this
 * feature shouldn't make quietly (see HANDOFF §47). The archetype titles
 * are a creative, bolder framing of the real subject name -- not a new
 * claim about the chart -- the honest, chart-grounded sentence still
 * comes from that subject's own `title[tier]` text.
 */
import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function iconBase(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M12 3v3M9 20h6M12 6l6 14H6l6-14Z" />
      <circle cx="12" cy="3" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function QuillIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M20 4c-6 0-11 4-13 10l-3 6 6-3C16 15 20 10 20 4Z" />
      <path d="M9 15 4 20" />
    </svg>
  );
}

export function AtomIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>
  );
}

export function CircuitIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    </svg>
  );
}

export function PaletteIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2s-.6-1.6-.6-2.4c0-1.1 1-2 2.1-2H17a4 4 0 0 0 4-4c0-4.4-4-7.6-9-7.6Z" />
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MusicNoteIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <circle cx="7" cy="18" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="2.2" fill="currentColor" stroke="none" />
      <path d="M9.2 18V5.5L18.2 4v11.5" />
    </svg>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M4 18h16l-1-8-4 3-3-6-3 6-4-3-1 8Z" />
      <path d="M4 18h16v2H4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4a3 3 0 0 0 3 5" />
      <path d="M17 5h3a3 3 0 0 1-3 5" />
      <path d="M12 12v4" />
      <path d="M9 20h6" />
      <path d="M10 16h4l1 4H9l1-4Z" />
    </svg>
  );
}

export interface SubjectArchetype {
  /** The bold, "certificate" framing of this subject -- e.g. "The Born Leader" for Public Speaking, Drama & Leadership. */
  title: string;
  Icon: (props: IconProps) => ReactElement;
}

/** Keyed by `SUBJECTS[].id` in `lib/education/subjects.ts` -- one entry per tracked subject. */
export const SUBJECT_ARCHETYPES: Record<string, SubjectArchetype> = {
  mathematics: { title: "The Math Prodigy", Icon: CompassIcon },
  "reading-language": { title: "The Wordsmith", Icon: QuillIcon },
  science: { title: "The Young Scientist", Icon: AtomIcon },
  "history-social": { title: "The Historian", Icon: GlobeIcon },
  "computer-science": { title: "The Code Wizard", Icon: CircuitIcon },
  "visual-arts": { title: "The Creative Visionary", Icon: PaletteIcon },
  music: { title: "The Maestro", Icon: MusicNoteIcon },
  "public-speaking": { title: "The Born Leader", Icon: CrownIcon },
  "physical-education": { title: "The Champion", Icon: TrophyIcon },
};
