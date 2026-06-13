import type { Match } from "@/types";
import { MATCHES } from "@/data/matches";

/** Format a Date as a local YYYY-MM-DD string. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Small deterministic hash for stable mock scores. */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const MATCH_LENGTH_MS = 105 * 60 * 1000; // 90 mins + a little stoppage time

/**
 * Derive a live-feeling status and score for a match relative to `now`.
 * Before kickoff → scheduled. During the window → live with a building score.
 * After → finished with a stable final score. (Mock data; swap for a live API.)
 */
export function deriveLive(match: Match, now: Date): Match {
  const kickoff = new Date(match.kickoff).getTime();
  const t = now.getTime();
  const seed = hash(match.id);
  const finalHome = seed % 4; // 0–3
  const finalAway = (seed >> 3) % 4; // 0–3

  if (t < kickoff) {
    return { ...match, status: "scheduled" };
  }
  if (t < kickoff + MATCH_LENGTH_MS) {
    const progress = (t - kickoff) / MATCH_LENGTH_MS; // 0..1
    return {
      ...match,
      status: "live",
      homeScore: Math.round(finalHome * progress),
      awayScore: Math.round(finalAway * progress),
    };
  }
  return { ...match, status: "finished", homeScore: finalHome, awayScore: finalAway };
}

/** Minutes played (capped) for a live match, for a "45'" style badge. */
export function liveMinute(match: Match, now: Date): number {
  const kickoff = new Date(match.kickoff).getTime();
  const mins = Math.floor((now.getTime() - kickoff) / 60000);
  return Math.max(1, Math.min(90, mins));
}

export interface Featured {
  /** The date these matches are on (YYYY-MM-DD). */
  date: string;
  /** Whether this is literally today, or a fallback day. */
  isToday: boolean;
  /** "today" | "upcoming" | "recent" — drives the dashboard heading. */
  kind: "today" | "upcoming" | "recent";
  matches: Match[];
  /** Index of this date within the tournament, for fun-fact rotation. */
  dayIndex: number;
}

/**
 * Choose the match day to feature, from ANY list of matches:
 *   1. Matches on the real current date, else
 *   2. the next upcoming match day, else
 *   3. the most recent match day (tournament is over in the data).
 * This keeps the app delightful whenever Vee opens it, with live or bundled data.
 *
 * `applyDerive` controls whether clock-based mock scores are layered on. Pass
 * false for live data (which already carries real scores).
 */
export function getFeaturedFrom(
  source: Match[],
  now: Date = new Date(),
  applyDerive = true,
): Featured {
  const dates = Array.from(new Set(source.map((m) => m.date))).sort();
  const todayKey = toDateKey(now);

  const matchesOn = (date: string) => {
    const onDay = source.filter((m) => m.date === date);
    return applyDerive ? onDay.map((m) => deriveLive(m, now)) : onDay;
  };

  // Pick the date, then its kind, with graceful fallbacks.
  let date = dates.find((d) => d === todayKey);
  let kind: Featured["kind"] = "today";
  if (!date) {
    const upcoming = dates.find((d) => d > todayKey);
    if (upcoming) {
      date = upcoming;
      kind = "upcoming";
    } else {
      date = dates[dates.length - 1];
      kind = "recent";
    }
  }

  // Guard against an empty source.
  if (!date) {
    return { date: todayKey, isToday: true, kind: "today", matches: [], dayIndex: 0 };
  }

  return {
    date,
    isToday: kind === "today",
    kind,
    matches: matchesOn(date),
    dayIndex: dates.indexOf(date),
  };
}

/** Convenience wrapper over the bundled curated schedule. */
export function getFeatured(now: Date = new Date()): Featured {
  return getFeaturedFrom(MATCHES, now, true);
}

/** Friendly long date like "Saturday 13 June". */
export function prettyDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
