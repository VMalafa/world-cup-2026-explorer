/**
 * Live data provider: API-Football (api-football.com / API-Sports).
 *
 * Reputable commercial API with a free tier (100 requests/day). Reachable from
 * Vercel. Provides real fixtures, scores, venues and statuses for the FIFA
 * World Cup (league id 1).
 *
 * Runs ONLY on the server (inside /api/matches) and is defensive: any network
 * error, plan error, or unexpected shape returns null so the caller falls back
 * to the bundled curated schedule.
 *
 * REQUEST BUDGET: the free tier allows 100 requests/day. We cache the upstream
 * call for API_FOOTBALL_REVALIDATE seconds (default 1800 = 30 min ≈ 48/day) so
 * we never get firewall-blocked. Lower it for fresher scores if your plan allows.
 */
import type { Match, MatchStatus } from "@/types";
import { TEAMS } from "@/data/teams";

const BASE = "https://v3.football.api-sports.io";
const WORLD_CUP_LEAGUE_ID = 1;
const SEASON = Number(process.env.API_FOOTBALL_SEASON ?? "2026");
const REVALIDATE = Number(process.env.API_FOOTBALL_REVALIDATE ?? "1800");

// API-Football status short codes → our three states.
const LIVE = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT", "SUSP"]);
const FINISHED = new Set(["FT", "AET", "PEN", "WO"]);

// --- Team name → curated FIFA code resolver ---------------------------------
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

// Build from the curated set, then add known API-Football naming differences.
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

function resolveCode(apiName: string): string | null {
  return NAME_TO_CODE[norm(apiName)] ?? null;
}

// --- API-Football response shapes (only the fields we use) ------------------
interface AFFixture {
  fixture: {
    id: number;
    date: string; // ISO with timezone
    status: { short: string; elapsed: number | null };
    venue: { name: string | null; city: string | null };
  };
  league: { round: string };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}
interface AFResponse {
  errors?: unknown;
  results?: number;
  response?: AFFixture[];
}

function statusFor(short: string): MatchStatus {
  if (FINISHED.has(short)) return "finished";
  if (LIVE.has(short)) return "live";
  return "scheduled";
}

function groupFromRound(round: string): string {
  const m = /group\s+([A-L])/i.exec(round ?? "");
  return m ? m[1].toUpperCase() : "";
}

/** True if API-Football returned a non-empty `errors` payload. */
function hasErrors(json: AFResponse): boolean {
  const e = json.errors;
  if (!e) return false;
  if (Array.isArray(e)) return e.length > 0;
  if (typeof e === "object") return Object.keys(e as object).length > 0;
  return Boolean(e);
}

/**
 * Fetch & normalize World Cup fixtures. Returns null on any failure (caller
 * falls back to bundled data).
 */
export async function fetchApiFootballMatches(): Promise<Match[] | null> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return null;

  try {
    const url = `${BASE}/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${SEASON}`;
    const res = await fetch(url, {
      headers: { "x-apisports-key": key },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) {
      console.error(`[api-football] HTTP ${res.status}`);
      return null;
    }
    const json = (await res.json()) as AFResponse;
    if (hasErrors(json)) {
      // Most often a plan/season restriction or rate limit — surface it.
      console.error("[api-football] api errors:", JSON.stringify(json.errors));
      return null;
    }
    const fixtures = json.response ?? [];
    if (!fixtures.length) return null;

    const matches: Match[] = fixtures.map((f) => {
      const status = statusFor(f.fixture.status.short);
      const homeCode = resolveCode(f.teams.home.name) ?? f.teams.home.name;
      const awayCode = resolveCode(f.teams.away.name) ?? f.teams.away.name;
      return {
        id: `af-${f.fixture.id}`,
        date: f.fixture.date.slice(0, 10),
        kickoff: f.fixture.date,
        homeCode,
        awayCode,
        stadium: f.fixture.venue.name ?? "Stadium",
        city: f.fixture.venue.city ?? "",
        group: groupFromRound(f.league.round),
        status,
        homeScore: status === "scheduled" ? undefined : f.goals.home ?? 0,
        awayScore: status === "scheduled" ? undefined : f.goals.away ?? 0,
        homeName: f.teams.home.name,
        awayName: f.teams.away.name,
        homeFlag: f.teams.home.logo,
        awayFlag: f.teams.away.logo,
      };
    });

    matches.sort((a, b) => a.kickoff.localeCompare(b.kickoff));
    return matches;
  } catch (err) {
    console.error("[api-football] fetch failed", err);
    return null;
  }
}
