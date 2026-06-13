/**
 * Resolve a live provider's team name (or 3-letter abbreviation) to our curated
 * FIFA code, so live fixtures link up with the app's learning content. Returns
 * null when there's no match — callers then fall back to the provider's own
 * name + flag for display.
 */
import { TEAMS, TEAM_BY_CODE } from "@/data/teams";

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

// Build from the curated set, then add known provider naming differences.
const NAME_TO_CODE: Record<string, string> = {};
for (const t of TEAMS) NAME_TO_CODE[norm(t.name)] = t.code;
Object.assign(NAME_TO_CODE, {
  [norm("USA")]: "USA",
  [norm("United States")]: "USA",
  [norm("Korea Republic")]: "KOR",
  [norm("South Korea")]: "KOR",
  [norm("IR Iran")]: "IRN",
  [norm("Iran")]: "IRN",
  [norm("Cote d'Ivoire")]: "CIV",
  [norm("Côte d'Ivoire")]: "CIV",
  [norm("Ivory Coast")]: "CIV",
  [norm("Saudi Arabia")]: "KSA",
  [norm("Czech Republic")]: "CZE",
  [norm("Czechia")]: "CZE",
});

/**
 * @param name  Full team name from the provider (e.g. "United States").
 * @param abbr  Optional 3-letter code from the provider (e.g. "USA", "tla").
 */
export function resolveCode(name: string, abbr?: string): string | null {
  const byName = NAME_TO_CODE[norm(name)];
  if (byName) return byName;
  // Some providers give a FIFA-ish abbreviation that may already be one of ours.
  if (abbr && TEAM_BY_CODE[abbr.toUpperCase()]) return abbr.toUpperCase();
  return null;
}
