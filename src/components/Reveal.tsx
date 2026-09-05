"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      // Positive margin expands the trigger zone *beyond* the real
      // viewport, so a section starts (and often finishes) fading in
      // while it's still below the fold -- by the time a normal scroll
      // actually brings it into view it already reads as settled. A
      // negative margin here (waiting until well inside the viewport)
      // left a real blank-section gap on scroll, which real-visitor
      // testing flagged as looking broken rather than intentional.
      viewport={{ once: true, margin: "150px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
