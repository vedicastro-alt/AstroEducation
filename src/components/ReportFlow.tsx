"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { generateReportAction, type ReportFormState } from "@/app/actions";
import { PlaceAutocomplete } from "./PlaceAutocomplete";
import { ChartWheel } from "./ChartWheel";
import { MoonIcon, SparkleIcon, StarIcon } from "./icons";
import type { GeocodeResult } from "@/lib/geo/resolve";
import { ageBandFromAge, ageInYears } from "@/lib/education/age";

const initialState: ReportFormState = { status: "idle" };

const REASSURANCES = [
  { icon: StarIcon, text: "Calculated from real planetary positions at their exact birth moment" },
  { icon: MoonIcon, text: "Gentle, encouraging language throughout — no fear, no fatalism" },
  { icon: SparkleIcon, text: "Free initial reading, ready in under a minute" },
];

export function ReportFlow() {
  const [state, formAction, isPending] = useActionState(
    generateReportAction,
    initialState,
  );
  const [place, setPlace] = useState<GeocodeResult | null>(null);
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [isGift, setIsGift] = useState(false);
  // Controlled, rather than left to the DOM, so a failed submission
  // doesn't wipe what a parent already typed -- React resets uncontrolled
  // fields on a <form action> submit regardless of outcome, which would
  // otherwise force a full re-entry after any error.
  const [childName, setChildName] = useState("");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [decisionFocus, setDecisionFocus] = useState("");

  // Only worth asking once a real, near-term decision is plausible --
  // for a toddler there's nothing concrete to name here. Guard against an
  // empty/invalid dob rather than letting ageInYears throw on partial input.
  let showDecisionFocus = false;
  if (dob) {
    const parsedAge = ageInYears(dob);
    if (!Number.isNaN(parsedAge)) {
      const band = ageBandFromAge(parsedAge);
      showDecisionFocus = band === "middle" || band === "senior" || band === "youngAdult";
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
      <div className="hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Their reading, in a minute
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-primary-dark">
          Tell us about your child
        </h1>
        <p className="mt-4 max-w-md text-muted">
          Just their birth details — we&apos;ll take care of the rest,
          gently. What you get back is written for a parent, not an
          astrologer.
        </p>
        <ul className="mt-8 space-y-4">
          {REASSURANCES.map((r) => (
            <li key={r.text} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary-tint text-primary">
                <r.icon className="h-4 w-4" />
              </span>
              <span className="text-sm leading-6 text-foreground/80">{r.text}</span>
            </li>
          ))}
        </ul>
        <ChartWheel className="mt-12 h-40 w-40 text-primary/15" />
      </div>

      <div className="relative">
        <div className="rounded-2xl border border-border-soft bg-surface-raised p-7 shadow-[0_20px_50px_-25px_rgba(44,40,97,0.35)] sm:p-9">
          <div className="text-center lg:hidden">
            <h1 className="font-serif text-3xl font-semibold text-primary-dark">
              Tell us about your child
            </h1>
            <p className="mt-2 text-muted">
              Just their birth details — we&apos;ll take care of the rest,
              gently.
            </p>
          </div>

          <form action={formAction} className="mt-2 space-y-5 lg:mt-0">
            <div>
              <label htmlFor="childName" className="mb-1.5 block text-sm font-medium text-foreground">
                Child&apos;s first name{" "}
                <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="childName"
                name="childName"
                type="text"
                maxLength={60}
                placeholder="e.g. Aanya"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div>
              <label htmlFor="dob" className="mb-1.5 block text-sm font-medium text-foreground">
                Date of birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                max={new Date().toISOString().slice(0, 10)}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="birthTime" className="mb-1.5 block text-sm font-medium text-foreground">
                  Time of birth
                </label>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs text-muted">
                  <input
                    type="checkbox"
                    name="timeUnknown"
                    checked={timeUnknown}
                    onChange={(e) => setTimeUnknown(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border accent-primary"
                  />
                  I&apos;m not sure
                </label>
              </div>
              <input
                id="birthTime"
                name="birthTime"
                type="time"
                required={!timeUnknown}
                disabled={timeUnknown}
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:bg-background disabled:text-muted"
              />
              {timeUnknown && (
                <p className="mt-1.5 text-xs text-muted">
                  No worries — we&apos;ll use a midday estimate. Sign-level guidance
                  stays accurate; a few finer details are approximate without an
                  exact time.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="place" className="mb-1.5 block text-sm font-medium text-foreground">
                Place of birth
              </label>
              <PlaceAutocomplete onSelect={setPlace} />
              <input type="hidden" name="placeLabel" value={place?.label ?? ""} />
              <input type="hidden" name="placeLat" value={place?.latitude ?? ""} />
              <input type="hidden" name="placeLon" value={place?.longitude ?? ""} />
            </div>

            {showDecisionFocus && (
              <div>
                <label htmlFor="decisionFocus" className="mb-1.5 block text-sm font-medium text-foreground">
                  What decision are you facing?{" "}
                  <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id="decisionFocus"
                  name="decisionFocus"
                  type="text"
                  maxLength={300}
                  placeholder="e.g. choosing between a coding elective and a second language"
                  value={decisionFocus}
                  onChange={(e) => setDecisionFocus(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <p className="mt-1.5 text-xs text-muted">
                  If there&apos;s a real choice on your plate right now — an
                  elective, a subject stream, a course — tell us and
                  we&apos;ll keep it in view alongside the reading.
                </p>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                name="isGift"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border accent-primary"
              />
              This is a gift — for a grandchild, niece, nephew, or a friend&apos;s child
            </label>
            <p className="text-xs text-muted">
              Don&apos;t have their birth details yet?{" "}
              <Link href="/gift" className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary">
                Send a gift voucher instead
              </Link>
              {" "}— they enter their own child&apos;s details whenever they&apos;re ready.
            </p>

            {state.status === "error" && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || !place}
              className="w-full rounded-sm bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {isPending ? "Reading the stars…" : "Reveal their learning strengths"}
            </button>
            {!isPending && !place && (
              <p className="text-center text-xs text-accent">
                Add a birth place above to continue.
              </p>
            )}
            <p className="text-center text-xs text-muted">
              This first reading is free. The full pathway starts at $25 if
              you want to go deeper — no pressure either way.
            </p>
            <p className="text-center text-xs text-muted">
              Used only to calculate this reading — never sold or shared.
            </p>
          </form>
          <p className="mt-5 text-center text-xs text-muted">
            Already bought a reading?{" "}
            <Link href="/resend-reading" className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary">
              Get your link resent
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
