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

/**
 * One curated kid-friendly highlight of a Country — a landmark, an animal, or a
 * food — revealed by tapping and read aloud during a Match Day Journey.
 */
export interface Wonder {
  /** Short name, e.g. "Eiffel Tower". */
  name: string;
  /** Emoji shown on the card. */
  emoji: string;
  /** The read-aloud line, written at both reading levels. */
  blurb: DualText;
}

/**
 * The small fixed set of Wonders shown for a Country: one landmark, one animal,
 * one food. Authored + Guardian-gated in issue #4; the shape lives here.
 */
export interface Wonders {
  landmark: Wonder;
  animal: Wonder;
  food: Wonder;
}

/**
 * A nation treated as the unit of *learning* — the place and culture a child
 * explores (CONTEXT.md: **Country**). This is the footballing **Team**'s
 * geography/culture facet, split out so the journey reads learning content
 * without footballing concerns (group, line-up, score). Built from `TEAMS` via
 * `toCountry` in `src/data/countries.ts`; the live app still uses `Team`.
 */
export interface Country {
  /** FIFA-style 3-letter code; the stable id shared with the Country's Team. */
  code: string;
  name: string;
  /** Emoji flag — instant, no network needed. */
  flag: string;
  /** ISO 3166-1 alpha-2 (lowercase) for flagcdn.com images. */
  iso2: string;
  capital: string;
  continent: Continent;
  /** Capital coordinates — the spine of all derived geography. */
  lat: number;
  lng: number;
  /** A friendly "hello" in the Country's main language, for read-aloud fun. */
  hello?: string;
  /** Headline fun facts, dual-level. */
  funFacts: DualText[];
  /** The three Wonders shown in a journey. Optional until authored (issue #4). */
  wonders?: Wonders;
  /** One-line meaning of the flag, dual-level. Optional until authored (issue #4). */
  flagMeaning?: DualText;
}

/**
 * A nation taking part in the tournament, plus learning metadata.
 *
 * NOTE: `Team` still carries both footballing facets (`group`) and the learning
 * facets that now also live on `Country`. The live app reads `Team`; new journey
 * code reads `Country` (see `src/data/countries.ts`). The two share `code`.
 */
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

/**
 * The tournament stage a Match belongs to, normalized from the live provider's
 * `stage` (football-data.org) or `round` (API-Football) strings. A knockout
 * Match's stage is its **Round** (CONTEXT.md) — the knockout counterpart of a
 * group-stage Match's **Group**. See ADR-0009 (#60/#62).
 */
export type Stage =
  | "GROUP_STAGE"
  | "LAST_32"
  | "LAST_16"
  | "QUARTER_FINALS"
  | "SEMI_FINALS"
  | "THIRD_PLACE"
  | "FINAL";

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
   * Real elapsed minute from a live provider (API-Football `elapsed`), when the
   * feed supplies it. Absent for sample data and providers without a live timer
   * (football-data free tier). Drives the displayed clock — see `matchClock`.
   */
  minute?: number;
  /**
   * The live provider reports the match is paused for the interval — halftime
   * (API-Football `HT`/`BT`, football-data `PAUSED`). Shown as "Halftime".
   */
  halftime?: boolean;
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
  /**
   * Tournament stage from the live provider. `GROUP_STAGE` for group matches
   * (which also carry `group`); a knockout value is the Match's **Round**.
   * Absent when the provider didn't say (kid-facing UI then shows no Round).
   */
  stage?: Stage;
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
