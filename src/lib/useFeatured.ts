"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/types";
import { getFeatured, getFeaturedFrom, type Featured } from "./schedule";

export interface FeaturedState {
  featured: Featured | null;
  /** "live" | "sample" — where the data came from this fetch. */
  source: "live" | "sample" | null;
  loading: boolean;
}

/**
 * Fetches /api/matches, recomputes the featured match day, and re-polls so
 * scores stay fresh. If the request fails, it falls back to the bundled
 * curated schedule so the app is never blank.
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
          source: "live" | "sample";
          matches: Match[];
        };
        if (!alive) return;
        // Live data already has real scores; don't layer mock scores on it.
        const featured = getFeaturedFrom(
          data.matches,
          new Date(),
          data.source !== "live",
        );
        setState({ featured, source: data.source, loading: false });
      } catch {
        if (!alive) return;
        // Network/API failure → bundled curated data.
        setState({ featured: getFeatured(new Date()), source: "sample", loading: false });
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
