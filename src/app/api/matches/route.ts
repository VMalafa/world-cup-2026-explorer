import { NextResponse } from "next/server";
import { MATCHES } from "@/data/matches";
import { deriveLive } from "@/lib/schedule";
import type { Match } from "@/types";

/**
 * Match data endpoint.
 *
 * By default this serves the bundled, curated 2026 schedule with a live-feeling
 * status/score derived from the current time — so the app works with zero setup
 * and zero API keys.
 *
 * To wire in a real provider later, set NEXT_PUBLIC_USE_LIVE_DATA=true and add
 * the relevant keys, then implement `fetchLiveMatches()` below. See the README,
 * section "How to update match data".
 */

// Re-derive live status at most every 30s (cheap caching, avoids rate limits).
export const revalidate = 30;

async function fetchLiveMatches(): Promise<Match[] | null> {
  const base = process.env.WORLD_CUP_API_BASE;
  const key = process.env.API_FOOTBALL_KEY;
  if (!base && !key) return null;

  // EXAMPLE shape — adapt to your chosen provider's response.
  // try {
  //   const res = await fetch(`${base}/matches/today`, {
  //     headers: key ? { "x-apisports-key": key } : undefined,
  //     next: { revalidate: 30 },
  //   });
  //   if (!res.ok) return null;
  //   return (await res.json()) as typeof MATCHES;
  // } catch {
  //   return null;
  // }
  return null;
}

export async function GET() {
  const now = new Date();
  const useLive = process.env.NEXT_PUBLIC_USE_LIVE_DATA === "true";

  let matches = MATCHES;
  let source: "live" | "sample" = "sample";

  if (useLive) {
    const live = await fetchLiveMatches();
    if (live && live.length) {
      matches = live;
      source = "live";
    }
  }

  const enriched = matches.map((m) => deriveLive(m, now));

  return NextResponse.json({
    source,
    generatedAt: now.toISOString(),
    count: enriched.length,
    matches: enriched,
  });
}
