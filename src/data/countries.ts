import type { Country, Team } from "@/types";

import { TEAMS } from "./teams";
import { COUNTRY_CONTENT } from "./countryContent";

/**
 * Project a footballing **Team** onto its learning **Country** facet.
 *
 * This is the Country/Team split (CONTEXT.md): we keep the learning fields and
 * drop the footballing-only ones (`group`). `wonders` and `flagMeaning` start
 * absent — they are authored and Guardian-gated in issue #4. The live app keeps
 * reading `Team`; new journey code reads `Country`, so production never moves.
 */
export function toCountry(team: Team): Country {
  // Destructure away the footballing facets; keep the learning ones.
  const { group: _group, ...learning } = team;
  // Merge in Guardian-approved Wonders + flag meaning, if any exist yet (#4).
  const content = COUNTRY_CONTENT[team.code];
  return content
    ? { ...learning, wonders: content.wonders, flagMeaning: content.flagMeaning }
    : learning;
}

/** The 48 tournament nations as learning Countries (geography spine intact). */
export const COUNTRIES: Country[] = TEAMS.map(toCountry);

/** Fast lookup of a Country by its code. */
export const COUNTRY_BY_CODE: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
);

export function getCountry(code: string): Country | undefined {
  return COUNTRY_BY_CODE[code];
}
