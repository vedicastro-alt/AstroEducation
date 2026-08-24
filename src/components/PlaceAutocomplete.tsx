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
    onSelect(place);
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Start typing a city, e.g. Jaipur, India"
        autoComplete="off"
        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
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
