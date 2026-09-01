"use client";

import { useActionState, useState } from "react";
import { redeemGiftVoucherAction, type RedeemFormState } from "@/app/redeem/[code]/actions";
import { PlaceAutocomplete } from "./PlaceAutocomplete";
import type { GeocodeResult } from "@/lib/geo/resolve";

const initialState: RedeemFormState = { status: "idle" };

interface Props {
  code: string;
}

/**
 * The redemption counterpart to ReportFlow -- same birth-detail fields
 * (name/dob/time/place), same controlled-input pattern (so a failed
 * submission doesn't wipe what was typed), but no isGift checkbox (this
 * report is a gift by definition) and no pricing copy (already paid for).
 */
export function RedeemForm({ code }: Props) {
  const boundAction = redeemGiftVoucherAction.bind(null, code);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);
  const [place, setPlace] = useState<GeocodeResult | null>(null);
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [childName, setChildName] = useState("");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");

  return (
    <form action={formAction} className="mt-2 space-y-5">
      <div>
        <label htmlFor="childName" className="mb-1.5 block text-sm font-medium text-foreground">
          Child&apos;s first name <span className="font-normal text-muted">(optional)</span>
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

      {state.status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending || !place}
        className="w-full rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {isPending ? "Reading the stars…" : "Reveal their full reading"}
      </button>
      <p className="text-center text-xs text-muted">
        Used only to calculate this reading — never sold or shared.
      </p>
    </form>
  );
}
