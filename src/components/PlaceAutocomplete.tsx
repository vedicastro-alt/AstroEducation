"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { searchPlacesAction } from "@/app/actions";
import type { GeocodeResult } from "@/lib/geo/resolve";

interface Props {
  defaultLabel?: string;
  onSelect: (place: GeocodeResult | null) => void;
}

export function PlaceAutocomplete({ defaultLabel = "", onSelect }: Props) {
  const [query, setQuery] = useState(defaultLabel);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(!!defaultLabel);
  const [blurred, setBlurred] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    onSelect(null);
    setConfirmed(false);
    setBlurred(false);
    setOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const found = await searchPlacesAction(value);
        setResults(found);
      });
    }, 300);
  }

  function handlePick(place: GeocodeResult) {
    setQuery(place.label);
    setResults([]);
    setOpen(false);
    setConfirmed(true);
    onSelect(place);
  }

  // A parent who types a fully valid, correctly formatted place name but
  // tabs or clicks away instead of picking the dropdown suggestion gets
  // silently blocked -- the only feedback previously lived in a generic
  // "Add a birth place above to continue" message near the submit button,
  // easy to miss. Two persona conversion tests independently hit this
  // exact failure mode (HANDOFF §55 E1). This surfaces the same "still
  // needs a selection" state right at the field itself, once the user has
  // actually left it -- not while they're still typing or the dropdown is
  // open, which would just be noise.
  const needsSelection = blurred && !open && query.trim().length > 0 && !confirmed;

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => {
          setOpen(false);
          setBlurred(true);
        }, 150)}
        placeholder="Start typing a city, e.g. Jaipur, India"
        autoComplete="off"
        aria-invalid={needsSelection}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-base outline-none transition-shadow focus:ring-4 ${
          needsSelection
            ? "border-amber-400 focus:border-amber-500 focus:ring-amber-400/10"
            : "border-border focus:border-primary focus:ring-primary/10"
        }`}
      />
      {needsSelection && (
        <p className="mt-1.5 text-xs text-amber-700">
          Pick a match from the list, or keep typing — a plain typed
          address on its own can&apos;t be used yet.
        </p>
      )}
      {isPending && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
          searching…
        </span>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-border-soft bg-white shadow-xl shadow-primary/5">
          {results.map((r, i) => (
            <li key={`${r.label}-${i}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePick(r)}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-accent-soft"
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
