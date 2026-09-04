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
  const bookRef = useRef<HTMLDivElement | null>(null);

  // Track direction of travel (for the slide transition) using React's
  // documented "adjust state during render" pattern rather than a ref
  // read, since refs aren't safe to read during render.
  const [prevIndex, setPrevIndex] = useState(clamped);
  const [direction, setDirection] = useState(1);
  if (clamped !== prevIndex) {
    setDirection(clamped > prevIndex ? 1 : -1);
    setPrevIndex(clamped);
  }

  // Every chapter should be met from the top, not wherever the reader
  // happened to be scrolled to on the previous page -- otherwise a page
  // turn can land a visitor mid-scroll on the next chapter (e.g. straight
  // onto the second pricing card, skipping the first one and the intro).
  // Skipped on first mount so loading the reader doesn't itself cause a
  // jump -- only actual page-to-page navigation should scroll.
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    bookRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [clamped]);

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
          ref={bookRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ perspective: "1800px" }}
          className={`relative mt-5 min-h-[26rem] overflow-hidden rounded-2xl border border-border-soft shadow-[0_20px_50px_-25px_rgba(44,40,97,0.35)] sm:min-h-[30rem] ${page.background ?? "bg-surface-raised"}`}
        >
          {/* A literal page-turn: the incoming/outgoing page rotates
              around the book's spine (left edge) rather than just
              sliding, so navigating feels like turning a physical page. */}
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={page.id}
              custom={direction}
              initial={{ opacity: 0, rotateY: 110 * direction }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -110 * direction }}
              transition={{
                rotateY: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 },
              }}
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
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
            className="rounded-sm border border-border px-5 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-primary-tint disabled:cursor-not-allowed disabled:opacity-0"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => onIndexChange(Math.min(clamped + 1, pages.length - 1))}
            disabled={clamped === pages.length - 1}
            className="rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-0"
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
