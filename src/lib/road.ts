/**
 * The Road (CONTEXT.md, #60/#63) — a Team's forward path through the knockout
 * stage. This module answers one question: given a knockout Match, which ≤2
 * Countries could its winner face next? The candidates are the two sides of
 * the *sibling* Match feeding the same next-Round slot, resolved through the
 * static authored bracket topology (ADR-0009, `src/data/bracket2026.ts`).
 *
 * Honest by construction: it reads fixture team lists only — never live
 * scores — and an undecided side is simply omitted, never invented
 * (#44/ADR-0008). It never touches Stamp/Passport state.
 */
import type { Match, Stage } from "@/types";
import { BRACKET_FEEDERS, NEXT_ROUND } from "@/data/bracket2026";
import { getTeam } from "@/data/teams";

/** A real (named) possible next opponent. */
export interface RoadCandidate {
  code: string;
  name: string;
}

export interface RoadStep {
  /** The Round the winner advances into. */
  nextStage: Stage;
  /** The sibling fixture whose winner meets ours — null if it can't be resolved. */
  sibling: Match | null;
  /** The 0–2 known candidate opponents; empty while both sides are TBD. */
  candidates: RoadCandidate[];
}

/** A fixture side that names a real team (curated or provider-named), not a TBD slot. */
function candidateFor(code: string, name?: string): RoadCandidate | null {
  const team = getTeam(code);
  if (team) return { code, name: team.name };
  if (code && code.toUpperCase() !== "TBD" && name && name.toUpperCase() !== "TBD") {
    return { code, name };
  }
  return null;
}

/** A Round's fixtures in kickoff order — the stable slot ordering (ADR-0009). */
export function stageInKickoffOrder(all: Match[], stage: Stage): Match[] {
  return all
    .filter((m) => m.stage === stage)
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

/**
 * The ≤2 candidate next-Round opponents for a knockout Match, or null when
 * there is no next Round (group stage, Final, third-place match) or the
 * bracket position can't be resolved from the data at hand.
 */
export function nextOpponents(match: Match, all: Match[]): RoadStep | null {
  const stage = match.stage;
  if (!stage) return null;
  const nextStage = NEXT_ROUND[stage];
  const feeders = nextStage && BRACKET_FEEDERS[nextStage];
  if (!nextStage || !feeders) return null;

  const roundMatches = stageInKickoffOrder(all, stage);
  const ordinal = roundMatches.findIndex((m) => m.id === match.id) + 1;
  if (ordinal === 0) return null;

  const slot = feeders.find((pair) => pair.includes(ordinal));
  if (!slot) return null;
  const siblingOrdinal = slot[0] === ordinal ? slot[1] : slot[0];
  const sibling = roundMatches[siblingOrdinal - 1] ?? null;

  const candidates = sibling
    ? [
        candidateFor(sibling.homeCode, sibling.homeName),
        candidateFor(sibling.awayCode, sibling.awayName),
      ].filter((c): c is RoadCandidate => c !== null)
    : [];

  return { nextStage, sibling, candidates };
}
