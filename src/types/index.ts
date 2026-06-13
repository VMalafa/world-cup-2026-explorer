/**
 * Shared domain types for the World Cup 2026 Learning Explorer.
 */

/** The two reading levels the whole app can switch between. */
export type ReadingLevel = "kinder" | "enriched";

/** A piece of text written at both reading levels. */
export interface DualText {
  /** ~5–8 words per sentence, simple words. */
  kinder: string;
  /** ~10–15 words per sentence, richer vocabulary. */
  enriched: string;
}

export type Continent =
  | "africa"
  | "asia"
  | "europe"
  | "namerica"
  | "samerica"
  | "oceania";

/** A nation taking part in the tournament, plus learning metadata. */
export interface Team {
  /** FIFA-style 3-letter code, also used as the stable id. */
  code: string;
  name: string;
  /** Emoji flag — instant, no network needed. */
  flag: string;
  /** ISO 3166-1 alpha-2 (lowercase) for flagcdn.com images. */
  iso2: string;
  capital: string;
  continent: Continent;
  /** Capital coordinates, used to place the map marker. */
  lat: number;
  lng: number;
  /** Group letter (A–L). */
  group: string;
  /** Headline fun facts, dual-level, for the carousel & compare view. */
  funFacts: DualText[];
  /** A friendly "hello" in the country's main language, for read-aloud fun. */
  hello?: string;
}

export type MatchStatus = "scheduled" | "live" | "finished";

export interface Match {
  id: string;
  /** ISO date (YYYY-MM-DD) the match is played, host local calendar. */
  date: string;
  /** ISO timestamp (UTC) of kickoff — drives the countdown. */
  kickoff: string;
  homeCode: string;
  awayCode: string;
  stadium: string;
  city: string;
  group: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  /**
   * Optional display fallbacks used by LIVE data, so matches featuring a team
   * that isn't in the curated learning set still render a name and flag.
   */
  homeName?: string;
  awayName?: string;
  /** Flag image URLs (e.g. flagcdn.com) from the live provider. */
  homeFlag?: string;
  awayFlag?: string;
  /** Matchday number from the live provider, if known. */
  matchday?: string;
}

export interface PlayerStory {
  id: string;
  name: string;
  /** Team code this player belongs to. */
  teamCode: string;
  position: string;
  /** Emoji used as the card avatar. */
  emoji: string;
  /** Short hook shown on the card front. */
  hook: DualText;
  /** The full inspiring story, revealed on interaction. */
  story: DualText;
  /** One-line "why it's amazing" takeaway. */
  lesson: DualText;
}

export interface FunFact {
  id: string;
  /** "geo" = geography, "football" = football culture/trivia. */
  kind: "geo" | "football";
  /** Team code this fact relates to, if any (for theming). */
  teamCode?: string;
  text: DualText;
  emoji: string;
}
