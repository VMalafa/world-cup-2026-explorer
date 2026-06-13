import { NextResponse } from "next/server";
import { MATCHES } from "@/data/matches";
import { deriveLive } from "@/lib/schedule";
import {
  fetchWorldCup26Matches,
  probeWorldCup26,
} from "@/lib/providers/worldcup26";
import type { Match } from "@/types";

/**
 * Match data endpoint.
 *
 * By default this serves the bundled, curated 2026 schedule with a live-feeling
 * status/score derived from the current time — so the app works with zero setup
 * and zero API keys.
 *
 * Set NEXT_PUBLIC_USE_LIVE_DATA=true to fetch real fixtures & scores from the
 * worldcup26.ir provider. If that provider is unreachable or returns nothing,
 * the route transparently falls back to the bundled schedule, so the app is
 * never blank. See the README, section "How to update match data".
 */

// Run on every request so the runtime env toggle is always respected. The
// upstream provider call is still cached for 30s (see the fetch in the provider
// and useFeatured's 30s poll), so this stays cheap and rate-limit friendly.
export const dynamic = "force-dynamic";

async function fetchLiveMatches(): Promise<Match[] | null> {
  // The worldcup26.ir provider needs no key. A custom base/key combination can
  // still be supported by adding another provider module here.
  return fetchWorldCup26Matches();
}

export async function GET() {
  const now = new Date();
  // Server-only runtime toggle (NOT NEXT_PUBLIC_, so it can be changed on the
  // host without a rebuild). Back-compat: also honour the old public name.
  const useLive =
    process.env.USE_LIVE_DATA === "true" ||
    process.env.NEXT_PUBLIC_USE_LIVE_DATA === "true";

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
        // Find out *why* it was empty (unreachable host? non-200?).
        const probe = await probeWorldCup26();
        note = probe.ok
          ? "Provider reachable but returned no usable matches."
          : `Provider unreachable (${probe.status ?? probe.error ?? "unknown"}). Using bundled data.`;
        console.warn("[api/matches] live empty; using bundled data:", note);
      }
    } catch (err) {
      note = `Live fetch threw: ${err instanceof Error ? err.message : String(err)}`;
      console.error("[api/matches] live fetch failed; using bundled data", err);
    }
  } else {
    note = "Live data is off (set USE_LIVE_DATA=true to enable).";
  }

  // Sample data needs clock-derived scores; live data already carries real
  // status & scores from the provider, so leave it untouched.
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
