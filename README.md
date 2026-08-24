# Little Stargazers

A gentle, parent-friendly website that turns a child's Vedic (sidereal)
birth chart into warm, encouraging guidance about how they naturally
learn best — their strengths, the areas that may need extra patience,
and a few recommended focus areas to explore first.

## How it works

1. A parent enters their child's date, time, and place of birth.
2. The server computes a real sidereal birth chart (Lahiri ayanamsa)
   using astronomical ephemeris calculations — no third-party astrology
   API involved.
3. A rules engine (`src/lib/education`) maps the classical education
   significators (houses 2/4/5/9, Mercury, Jupiter, Moon, Saturn, and a
   set of learning-style "focus area" profiles) to plain-language,
   always-encouraging copy.
4. The reading is shown immediately — nothing is stored or sent to a
   database; this first phase is intentionally frontend/stateless.
   Payments and a deeper, personalized learning pathway are a later
   phase (see the "Coming soon" section on the report page).

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind v4), React 19
- [`astronomy-engine`](https://github.com/cosinekitty/astronomy) for
  planetary ephemeris calculations (no native dependencies)
- `tz-lookup` + `luxon` to resolve the correct historical UTC offset
  for the birth place and date
- Open-Meteo's free geocoding API for place lookup, with a small
  bundled fallback city list if that's unreachable

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page
explains the product; `/report` has the birth-details form and reading.

```bash
npm run build   # production build + typecheck
npm run lint    # eslint
```

## Project layout

- `src/lib/astro` — chart math: ephemeris lookups, ayanamsa, rashi
  (sign) / nakshatra / house placement, dignity tables
- `src/lib/education` — the scoring + copy layer that turns a chart
  into strengths / growth areas / focus-area recommendations
- `src/lib/geo` — geocoding and timezone resolution
- `src/app/actions.ts` — server actions used by the birth-details form
- `src/components` — the form, place autocomplete, and report view

## Notes on accuracy

Planetary and ascendant positions use real astronomical calculations,
and the Lahiri ayanamsa is a linear approximation accurate to a few
arcminutes — precise enough for sign, house, and nakshatra placement in
the vast majority of cases, though placements very close to a sign or
house boundary could occasionally differ from a professional Jyotish
software package. This is an educational, encouraging tool, not a
substitute for a qualified astrologer, teacher, or pediatric
professional.
