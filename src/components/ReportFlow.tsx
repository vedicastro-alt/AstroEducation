"use client";

import { useActionState, useState } from "react";
import { generateReportAction, type ReportFormState } from "@/app/actions";
import { PlaceAutocomplete } from "./PlaceAutocomplete";
import { ReportView } from "./ReportView";
import type { GeocodeResult } from "@/lib/geo/resolve";

const initialState: ReportFormState = { status: "idle" };

export function ReportFlow() {
  const [state, formAction, isPending] = useActionState(
    generateReportAction,
    initialState,
  );
  const [place, setPlace] = useState<GeocodeResult | null>(null);
  const [timeUnknown, setTimeUnknown] = useState(false);

  if (state.status === "success" && state.insights && state.meta) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <ReportView insights={state.insights} pathway={state.pathway} meta={state.meta} />
        <div className="no-print mt-10 text-center">
          <a
            href="/report"
            className="inline-block rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary-dark hover:bg-accent-soft"
          >
            Create another reading
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-12">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-primary-dark">
          Tell us about your child
        </h1>
        <p className="mt-2 text-muted">
          Just their birth details — we&apos;ll take care of the rest, gently.
        </p>
      </div>

      <form action={formAction} className="mt-8 space-y-5">
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
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                className="h-3.5 w-3.5 rounded border-border"
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
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-background disabled:text-muted"
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

        {state.status === "error" && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !place}
          className="w-full rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Reading the stars…" : "Reveal their learning strengths"}
        </button>
        <p className="text-center text-xs text-muted">
          Used only to calculate this reading — never sold or shared.
        </p>
      </form>
    </div>
  );
}
