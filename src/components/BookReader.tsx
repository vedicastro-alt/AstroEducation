"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

export interface BookPage {
  id: string;
  chapterLabel: string;
  background?: string;
  content: ReactNode;
}

interface BookReaderProps {
  pages: BookPage[];
  index: number;
  onIndexChange: (next: number) => void;
  headerRight?: ReactNode;
}

const SWIPE_THRESHOLD = 60;

export function BookReader({ pages, index, onIndexChange, headerRight }: BookReaderProps) {
  const clamped = Math.min(Math.max(index, 0), pages.length - 1);
  const page = pages[clamped];
  const touchStartX = useRef<number | null>(null);

  // Track direction of travel (for the slide transition) using React's
  // documented "adjust state during render" pattern rather than a ref
  // read, since refs aren't safe to read during render.
  const [prevIndex, setPrevIndex] = useState(clamped);
  const [direction, setDirection] = useState(1);
  if (clamped !== prevIndex) {
    setDirection(clamped > prevIndex ? 1 : -1);
    setPrevIndex(clamped);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "ArrowRight") onIndexChange(Math.min(clamped + 1, pages.length - 1));
      if (e.key === "ArrowLeft") onIndexChange(Math.max(clamped - 1, 0));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clamped, pages.length, onIndexChange]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) onIndexChange(Math.max(clamped - 1, 0));
    else if (delta < -SWIPE_THRESHOLD) onIndexChange(Math.min(clamped + 1, pages.length - 1));
    touchStartX.current = null;
  }

  return (
    <div>
      <div className="no-print">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Chapter {clamped + 1} of {pages.length}
            <span className="mx-2 text-border">·</span>
            {page.chapterLabel}
          </p>
          {headerRight}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Go to ${p.chapterLabel}`}
              aria-current={i === clamped}
              onClick={() => onIndexChange(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === clamped ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-accent/50"
              }`}
            />
          ))}
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`relative mt-5 min-h-[26rem] overflow-hidden rounded-[2rem] border border-border-soft shadow-[0_20px_50px_-25px_rgba(44,40,97,0.35)] sm:min-h-[30rem] ${page.background ?? "bg-surface-raised"}`}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={page.id}
              custom={direction}
              initial={{ opacity: 0, x: 36 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 * direction }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-7 sm:p-10"
            >
              {page.content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onIndexChange(Math.max(clamped - 1, 0))}
            disabled={clamped === 0}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-primary-tint disabled:cursor-not-allowed disabled:opacity-0"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => onIndexChange(Math.min(clamped + 1, pages.length - 1))}
            disabled={clamped === pages.length - 1}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-0"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Print gets every page flattened into one document, regardless of
          which chapter was open on screen. */}
      <div className="hidden print:block print:space-y-10">
        {pages.map((p) => (
          <div key={p.id} className="break-inside-avoid-page">
            {p.content}
          </div>
        ))}
      </div>
    </div>
  );
}
