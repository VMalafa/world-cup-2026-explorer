"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/types";
import { getFeatured, getFeaturedFrom, type Featured } from "./schedule";

export interface FeaturedState {
  featured: Featured | null;
  /** "live" | "snapshot" — where the data came from this fetch. */
  source: "live" | "snapshot" | null;
  loading: boolean;
}

/**
 * Fetches /api/matches, recomputes the featured match day, and re-polls so
 * scores stay fresh. If the request fails, it falls back to the committed REAL
 * snapshot (never the synthetic generator), so the app is never blank and never
 * shows fabricated fixtures. See ADR-0005.
 *
 * The countdown ticks independently (in CountdownTimer), so a 30s poll is
 * plenty for score/status updates.
 */
export function useFeatured(pollMs = 30000): FeaturedState {
  const [state, setState] = useState<FeaturedState>({
    featured: null,
    source: null,
    loading: true,
  });

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/matches", { cache: "no-store" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as {
          source: "live" | "snapshot";
          matches: Match[];
        };
        if (!alive) return;
        // Both live and snapshot carry real scores — never layer mock scores on.
        const featured = getFeaturedFrom(data.matches, new Date(), false);
        setState({ featured, source: data.source, loading: false });
      } catch {
        if (!alive) return;
        // Network/API failure → the committed REAL snapshot, never fabricated.
        setState({ featured: getFeatured(new Date()), source: "snapshot", loading: false });
      }
    }

    load();
    const id = setInterval(load, pollMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return state;
}
