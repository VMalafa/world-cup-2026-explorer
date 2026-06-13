/**
 * Live data provider: worldcup26.ir (the open-source rezarahiminia/worldcup2026
 * API). Free, no API key. We fetch games + teams + stadiums, join them, and
 * normalize into our own `Match` shape.
 *
 * Everything here runs ONLY on the server (inside the /api/matches route) and
 * is defensive: any network error or unexpected shape returns null so the
 * caller can fall back to the bundled curated schedule.
 */
import type { Match, MatchStatus } from "@/types";
import { offsetForStadium, parseLocalDate } from "@/lib/timezone";

const BASE = "https://worldcup26.ir";

// The provider's raw shapes (everything arrives as strings).
interface RawGame {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  group: string;
  matchday: string;
  local_date: string;
  stadium_id: string;
  finished: string;
  time_elapsed: string;
  type: string;
  home_team_name_en?: string;
  away_team_name_en?: string;
}
interface RawTeam {
  name_en: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  id: string;
}
interface RawStadium {
  id: string;
  name_en: string;
  city_en: string;
  country_en: string;
  region: string;
}

async function getJson<T>(path: string, signal: AbortSignal): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      signal,
      // Cache at the edge for 30s to respect the community server's limits.
      next: { revalidate: 30 },
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function toScore(raw: string): number | undefined {
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

function toStatus(g: RawGame): MatchStatus {
  const finished =
    g.finished?.toUpperCase() === "TRUE" ||
    g.time_elapsed?.toLowerCase() === "finished";
  if (finished) return "finished";
  const te = g.time_elapsed?.toLowerCase() ?? "";
  const notLive = te === "" || te === "0" || te === "notstarted" || te === "scheduled";
  return notLive ? "scheduled" : "live";
}

/**
 * Fetch and normalize today/all matches. Returns null on any failure so the
 * route can serve bundled data instead.
 */
export async function fetchWorldCup26Matches(): Promise<Match[] | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const [games, teams, stadiums] = await Promise.all([
      getJson<{ games: RawGame[] }>("/get/games", controller.signal),
      getJson<{ teams: RawTeam[] }>("/get/teams", controller.signal),
      getJson<{ stadiums: RawStadium[] }>("/get/stadiums", controller.signal),
    ]);

    if (!games?.games?.length) return null;

    const teamById = new Map<string, RawTeam>();
    for (const t of teams?.teams ?? []) teamById.set(t.id, t);

    const stadiumById = new Map<string, RawStadium>();
    for (const s of stadiums?.stadiums ?? []) stadiumById.set(s.id, s);

    const matches: Match[] = [];
    for (const g of games.games) {
      const home = teamById.get(g.home_team_id);
      const away = teamById.get(g.away_team_id);
      const stadium = stadiumById.get(g.stadium_id);

      const offset = offsetForStadium(stadium?.region, stadium?.country_en);
      const parsed = parseLocalDate(g.local_date, offset);
      if (!parsed) continue; // skip rows we can't place in time

      const status = toStatus(g);
      const homeCode = home?.fifa_code || g.home_team_name_en || g.home_team_id;
      const awayCode = away?.fifa_code || g.away_team_name_en || g.away_team_id;

      matches.push({
        id: `wc-${g.id}`,
        date: parsed.date,
        kickoff: parsed.iso,
        homeCode,
        awayCode,
        stadium: stadium?.name_en ?? "Stadium",
        city: stadium?.city_en ?? "",
        group: g.group || "",
        status,
        homeScore: status === "scheduled" ? undefined : toScore(g.home_score),
        awayScore: status === "scheduled" ? undefined : toScore(g.away_score),
        // Display fallbacks for teams missing from the curated learning set.
        homeName: home?.name_en ?? g.home_team_name_en,
        awayName: away?.name_en ?? g.away_team_name_en,
        homeFlag: home?.flag,
        awayFlag: away?.flag,
        matchday: g.matchday,
      });
    }

    if (!matches.length) return null;
    matches.sort((a, b) => a.kickoff.localeCompare(b.kickoff));
    return matches;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
