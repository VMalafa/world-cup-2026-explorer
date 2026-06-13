/**
 * Live data provider: football-data.org (v4).
 *
 * Its FREE tier includes the FIFA World Cup competition (code "WC"), is
 * reachable from Vercel, and returns real fixtures, results and standings.
 * Rate limit: 10 requests/minute (free). Live scores are slightly delayed on
 * the free tier — fine for a kids' "five-minute briefing".
 *
 * Server-only, defensive: any error or unexpected shape returns null so the
 * caller falls back to the bundled curated schedule.
 *
 * Auth: header `X-Auth-Token: <FOOTBALL_DATA_TOKEN>`.
 */
import type { Match, MatchStatus } from "@/types";
import { resolveCode } from "./resolveTeam";

const BASE = "https://api.football-data.org/v4";
const COMPETITION = "WC"; // FIFA World Cup
const SEASON = process.env.FOOTBALL_DATA_SEASON ?? "2026";
// 5 min cache: ~288/day, trivially under 10/min, keeps scores reasonably fresh.
const REVALIDATE = Number(process.env.FOOTBALL_DATA_REVALIDATE ?? "300");

// football-data.org status → our three states.
const LIVE = new Set(["IN_PLAY", "PAUSED", "SUSPENDED"]);
const FINISHED = new Set(["FINISHED", "AWARDED"]);

interface FDTeam {
  name: string | null;
  tla: string | null; // 3-letter abbreviation
  crest: string | null; // badge/flag URL
}
interface FDMatch {
  id: number;
  utcDate: string; // ISO UTC, e.g. 2026-06-11T16:00:00Z
  status: string;
  matchday: number | null;
  stage: string | null;
  group: string | null; // e.g. "GROUP_A"
  venue: string | null;
  homeTeam: FDTeam;
  awayTeam: FDTeam;
  score: { fullTime: { home: number | null; away: number | null } };
}
interface FDResponse {
  message?: string; // present on errors
  errorCode?: number;
  matches?: FDMatch[];
}

function statusFor(s: string): MatchStatus {
  if (FINISHED.has(s)) return "finished";
  if (LIVE.has(s)) return "live";
  return "scheduled";
}

function groupLetter(group: string | null): string {
  const m = /([A-L])\s*$/i.exec(group ?? "");
  return m ? m[1].toUpperCase() : "";
}

export async function fetchFootballDataMatches(): Promise<Match[] | null> {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) return null;

  try {
    const url = `${BASE}/competitions/${COMPETITION}/matches?season=${SEASON}`;
    const res = await fetch(url, {
      headers: { "X-Auth-Token": token },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) {
      console.error(`[football-data] HTTP ${res.status} ${res.statusText}`);
      return null;
    }
    const json = (await res.json()) as FDResponse;
    if (json.errorCode || !json.matches) {
      console.error("[football-data] api error:", json.message ?? "unknown");
      return null;
    }
    if (!json.matches.length) return null;

    const matches: Match[] = json.matches.map((m) => {
      const status = statusFor(m.status);
      const homeCode =
        resolveCode(m.homeTeam.name ?? "", m.homeTeam.tla ?? undefined) ??
        m.homeTeam.tla ??
        m.homeTeam.name ??
        "TBD";
      const awayCode =
        resolveCode(m.awayTeam.name ?? "", m.awayTeam.tla ?? undefined) ??
        m.awayTeam.tla ??
        m.awayTeam.name ??
        "TBD";
      return {
        id: `fd-${m.id}`,
        date: m.utcDate.slice(0, 10),
        kickoff: m.utcDate,
        homeCode,
        awayCode,
        stadium: m.venue ?? "", // free tier omits venue; dashboard hides empty
        city: "",
        group: groupLetter(m.group),
        status,
        homeScore: status === "scheduled" ? undefined : m.score.fullTime.home ?? 0,
        awayScore: status === "scheduled" ? undefined : m.score.fullTime.away ?? 0,
        homeName: m.homeTeam.name ?? undefined,
        awayName: m.awayTeam.name ?? undefined,
        homeFlag: m.homeTeam.crest ?? undefined,
        awayFlag: m.awayTeam.crest ?? undefined,
        matchday: m.matchday != null ? String(m.matchday) : undefined,
      };
    });

    matches.sort((a, b) => a.kickoff.localeCompare(b.kickoff));
    return matches;
  } catch (err) {
    console.error("[football-data] fetch failed", err);
    return null;
  }
}
