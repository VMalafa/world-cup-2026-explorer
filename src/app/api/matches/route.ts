import { NextResponse } from "next/server";
import { MATCHES } from "@/data/matches";
import { deriveLive } from "@/lib/schedule";
import { fetchApiFootballMatches } from "@/lib/providers/apiFootball";
import type { Match } from "@/types";

/**
 * Match data endpoint.
 *
 * Serves the bundled, curated 2026 schedule with a live-feeling status/score
 * derived from the current time — so the app works with zero setup and zero
 * API keys, and depends on NO external server.
 *
 * LIVE DATA SEAM:
 * There is intentionally no live provider wired in. To add one, implement
 * `fetchLiveMatches()` below so it returns our `Match[]` shape from a source
 * YOU trust, and set USE_LIVE_DATA=true. If the provider is unreachable or
 * returns nothing, the route transparently falls back to the bundled schedule,
 * so the app is never blank. See the README, section "Using live data".
 */

// Run on every request so the runtime env toggle is always respected.
export const dynamic = "force-dynamic";

/**
 * Return live matches from a trusted provider, or null if none is configured /
 * the fetch fails. Currently no provider is wired in (returns null), so the app
 * uses the bundled curated schedule.
 */
async function fetchLiveMatches(): Promise<Match[] | null> {
  // API-Football provider. Returns null when no API_FOOTBALL_KEY is set, or on
  // any error, so the app safely uses the bundled curated schedule.
  return fetchApiFootballMatches();
}

export async function GET() {
  const now = new Date();
  // Server-only runtime toggle (NOT NEXT_PUBLIC_), changeable without a rebuild.
  const useLive = process.env.USE_LIVE_DATA === "true";

  let matches: Match[] = MATCHES;
  let source: "live" | "sample" = "sample";
  let note: string | undefined;

  if (useLive) {
    try {
      const live = await fetchLiveMatches();
      if (live && live.length) {
        matches = live;
        source = "live";
      } else {
        note =
          "Live mode is on, but the provider returned no data (missing/invalid API_FOOTBALL_KEY, plan/season restriction, or rate limit). Using bundled data.";
      }
    } catch (err) {
      note = `Live fetch failed: ${err instanceof Error ? err.message : String(err)}`;
      console.error("[api/matches] live fetch failed; using bundled data", err);
    }
  } else {
    note = "Using the built-in curated schedule.";
  }

  // Sample data needs clock-derived scores; live data (if ever wired in) already
  // carries real status & scores, so it is left untouched.
  const result =
    source === "sample" ? matches.map((m) => deriveLive(m, now)) : matches;

  return NextResponse.json({
    source,
    note,
    liveEnabled: useLive,
    generatedAt: now.toISOString(),
    count: result.length,
    matches: result,
  });
}
