import { NextResponse } from "next/server";
import { MATCHES_SNAPSHOT, SNAPSHOT_CAPTURED_AT } from "@/data/matchesSnapshot";
import { fetchFootballDataMatches } from "@/lib/providers/footballData";
import { fetchApiFootballMatches } from "@/lib/providers/apiFootball";
import type { Match } from "@/types";

/**
 * Match data endpoint.
 *
 * Live-first, never-fake (ADR-0005). Real fixtures/results come from the live
 * provider (football-data.org). When the live fetch is momentarily unavailable
 * (rate limit, timeout, transient error) the route falls back to a committed
 * REAL snapshot — last-good data that is stale at worst, never fabricated.
 *
 * It deliberately NEVER serves the old synthetic `buildSchedule()`, which
 * invented fixtures that looked real ("Brazil vs Tunisia") — the shared root
 * cause of issues #32 and #30.
 */

// Run on every request so the runtime env toggle is always respected.
export const dynamic = "force-dynamic";

/**
 * Return live matches from a trusted provider, or null if none is configured /
 * the fetch fails. Currently no provider is wired in (returns null), so the app
 * uses the bundled curated schedule.
 */
async function fetchLiveMatches(): Promise<Match[] | null> {
  // Try whichever trusted provider is configured (by env var), in order.
  // Each returns null when its key/token is absent or on any error, so the app
  // safely falls back to the bundled curated schedule.
  return (
    (await fetchFootballDataMatches()) ?? (await fetchApiFootballMatches())
  );
}

export async function GET() {
  const now = new Date();
  // Server-only runtime toggle (NOT NEXT_PUBLIC_), changeable without a rebuild.
  const useLive = process.env.USE_LIVE_DATA === "true";

  // Fall back to the committed REAL snapshot — never the synthetic generator.
  let matches: Match[] = MATCHES_SNAPSHOT;
  let source: "live" | "snapshot" = "snapshot";
  let note: string | undefined;

  if (useLive) {
    try {
      const live = await fetchLiveMatches();
      if (live && live.length) {
        matches = live;
        source = "live";
      } else {
        note =
          "Live mode is on, but the provider returned no data (missing/invalid token, plan/season restriction, or rate limit). Serving the last-good real snapshot.";
      }
    } catch (err) {
      note = `Live fetch failed: ${err instanceof Error ? err.message : String(err)}. Serving the last-good real snapshot.`;
      console.error("[api/matches] live fetch failed; using real snapshot", err);
    }
  } else {
    note = "Live mode is off. Serving the committed real snapshot.";
  }

  // The snapshot is real (stale at worst); the live feed already carries real
  // status & scores. Neither gets mock-score derivation — we never fabricate.
  return NextResponse.json({
    source,
    note,
    liveEnabled: useLive,
    // When serving the snapshot, expose its capture time so staleness is honest.
    snapshotCapturedAt: source === "snapshot" ? SNAPSHOT_CAPTURED_AT : undefined,
    generatedAt: now.toISOString(),
    count: matches.length,
    matches,
  });
}
