import type { FunFact } from "@/types";
import { TEAMS } from "./teams";

/**
 * Standalone tournament facts — a mix of geography and football culture.
 * Team-specific facts are pulled in automatically from teams.ts below.
 */
const BASE_FACTS: FunFact[] = [
  {
    id: "ff-hosts",
    kind: "geo",
    emoji: "🌎",
    text: {
      kinder: "Three countries share the World Cup this time.",
      enriched: "For the first time, three countries host together: the USA, Canada, and Mexico.",
    },
  },
  {
    id: "ff-48",
    kind: "football",
    emoji: "🏆",
    text: {
      kinder: "More teams than ever are playing — 48!",
      enriched: "This is the biggest World Cup ever, with 48 teams from all over the world.",
    },
  },
  {
    id: "ff-continents",
    kind: "geo",
    emoji: "🧭",
    text: {
      kinder: "Teams come from six big parts of the world.",
      enriched: "Teams travel from six continents, bringing flags and fans of every colour.",
    },
  },
  {
    id: "ff-ball",
    kind: "football",
    emoji: "⚽",
    text: {
      kinder: "A football has black and white shapes.",
      enriched: "A classic football has black pentagons and white hexagons stitched together.",
    },
  },
  {
    id: "ff-goal",
    kind: "football",
    emoji: "🥅",
    text: {
      kinder: "A goal is taller than a grown-up!",
      enriched: "A football goal stands about as tall as a giraffe is from head to shoulders.",
    },
  },
  {
    id: "ff-trophy",
    kind: "football",
    emoji: "🏅",
    text: {
      kinder: "The winners lift a shiny gold cup.",
      enriched: "The champions lift a golden trophy showing two people holding up the Earth.",
    },
  },
  {
    id: "ff-equator",
    kind: "geo",
    emoji: "🌐",
    text: {
      kinder: "An invisible line wraps around Earth's middle.",
      enriched: "The equator is an imaginary line around the middle of our planet.",
    },
  },
  {
    id: "ff-fans",
    kind: "football",
    emoji: "📣",
    text: {
      kinder: "Fans sing and cheer all match long.",
      enriched: "Fans paint their faces and sing songs to cheer their country to victory.",
    },
  },
  {
    id: "ff-time",
    kind: "geo",
    emoji: "🕐",
    text: {
      kinder: "When it is day here, it is night far away.",
      enriched: "The world has different time zones, so it can be morning in one country and night in another.",
    },
  },
  {
    id: "ff-grass",
    kind: "football",
    emoji: "🌱",
    text: {
      kinder: "Players run on soft green grass.",
      enriched: "Groundskeepers care for the pitch so the grass is smooth and perfectly green.",
    },
  },
];

/**
 * One geography-style fact built from each team's first fun fact, so the
 * carousel teaches kids about the actual countries playing.
 */
const TEAM_FACTS: FunFact[] = TEAMS.map((t) => ({
  id: `ff-team-${t.code}`,
  kind: "geo" as const,
  teamCode: t.code,
  emoji: t.flag,
  text: t.funFacts[0],
}));

export const FUN_FACTS: FunFact[] = [...BASE_FACTS, ...TEAM_FACTS];

/**
 * Pick a rotating set of facts for a given match day.
 * The same day always shows the same facts (deterministic, no Date calls),
 * but different days reveal a fresh, overlapping mix.
 */
export function factsForDay(dayIndex: number, count = 8): FunFact[] {
  const facts = FUN_FACTS;
  const start = ((dayIndex % facts.length) + facts.length) % facts.length;
  const out: FunFact[] = [];
  // Step by a number coprime-ish with the length for a pleasant spread.
  const step = 3;
  for (let i = 0; i < Math.min(count, facts.length); i++) {
    out.push(facts[(start + i * step) % facts.length]);
  }
  return out;
}
