"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { BirthChart } from "@/lib/astro/types";
import { KundliChart } from "./KundliChart";

interface Props {
  /** True exactly once: the request where this report was just marked
   * paid, landing fresh from a Stripe redirect. Never true again on a
   * later visit to the same reading. */
  active: boolean;
  childName: string;
  chart: BirthChart;
  children: ReactNode;
}

/**
 * The moment a purchase completes should feel like something opening,
 * not like a page just re-rendered with more buttons unlocked -- a
 * founder-reported gap after the payment-race fix (§20 in HANDOFF)
 * already made the unlock itself instant. This sits on top of the real
 * reading (already mounted underneath) for a couple of seconds, casts
 * the child's actual chart once more as the "opening" moment, then
 * fades away to reveal the reading that was there the whole time.
 * Costs nothing on every other page load: `active` is only ever true
 * for the exact request that just wrote the unlock.
 */
export function UnlockReveal({ active, childName, chart, children }: Props) {
  const [revealing, setRevealing] = useState(active);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!active) return;
    const fadeTimer = setTimeout(() => setFading(true), 2600);
    const doneTimer = setTimeout(() => setRevealing(false), 3200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [active]);

  return (
    <>
      {children}
      {revealing && (
        <div
          className={`no-print fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-primary-dark px-6 text-center transition-opacity duration-500 ease-out ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          <KundliChart chart={chart} className="w-40 sm:w-48" castId="unlock" />
          <div>
            <p className="font-serif text-xl font-semibold text-white sm:text-2xl">
              Opening {childName}&apos;s full reading&hellip;
            </p>
            <p className="mt-2 text-sm text-white/55">
              Casting their chart, one placement at a time.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
