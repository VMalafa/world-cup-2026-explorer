/**
 * Match Day Journey shell (CONTEXT.md) — the ordered, finishable sequence of
 * Stations that teaches the two Countries of the Match of the Day, with the
 * Globe as the spine. Pure structure here; the Stations render in Journey.tsx
 * and become interactive in #7.
 */
import type { Country } from "@/types";

import { getCountry } from "@/data/countries";

/** The three Station kinds of the v1 journey, in the order they're visited. */
export type StationKind = "locate" | "hello" | "wonders";

export const STATION_KINDS: StationKind[] = ["locate", "hello", "wonders"];

export interface Station {
  /** Stable, unique id, e.g. "JPN-locate". */
  id: string;
  kind: StationKind;
  countryCode: string;
}

export interface Journey {
  /** The two Countries being taught, home first. */
  countries: Country[];
  /** The ordered Stations: each kind for the home Country, then the away. */
  stations: Station[];
}

/**
 * Build the journey for a Match of the Day. Returns null if either Country is
 * not in the curated set (the caller falls back gracefully). Works for any
 * pairing — geography and greeting exist for all 48; richer Wonders for the
 * featured set, with a gentle fallback otherwise.
 */
export function buildJourney(homeCode: string, awayCode: string): Journey | null {
  const home = getCountry(homeCode);
  const away = getCountry(awayCode);
  if (!home || !away) return null;

  const countries = [home, away];
  const stations: Station[] = [];
  for (const country of countries) {
    for (const kind of STATION_KINDS) {
      stations.push({ id: `${country.code}-${kind}`, kind, countryCode: country.code });
    }
  }
  return { countries, stations };
}
