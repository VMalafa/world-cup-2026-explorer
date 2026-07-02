/**
 * Round derivation — a knockout Match's **Round** (CONTEXT.md), normalized from
 * whatever the live providers call the tournament stage (#62, ADR-0009).
 *
 * Defensive like the providers themselves: an unrecognized stage string maps to
 * `undefined` (the UI simply shows no Round) rather than guessing.
 */
import type { Stage } from "@/types";

/** football-data.org `stage` values we recognize, passed through verbatim. */
const FD_STAGES: ReadonlySet<Stage> = new Set<Stage>([
  "GROUP_STAGE",
  "LAST_32",
  "LAST_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "THIRD_PLACE",
  "FINAL",
]);

/** Normalize a football-data.org `stage` string. Unknown/absent → undefined. */
export function toStage(raw: string | null | undefined): Stage | undefined {
  if (!raw) return undefined;
  const s = raw.toUpperCase() as Stage;
  return FD_STAGES.has(s) ? s : undefined;
}

/**
 * Normalize an API-Football `league.round` label (e.g. "Group Stage - 2",
 * "Round of 16", "Quarter-finals", "3rd Place Final", "Final").
 * Order matters: "Quarter-finals" and "3rd Place Final" both contain "final".
 */
export function stageFromRoundLabel(round: string | null | undefined): Stage | undefined {
  if (!round) return undefined;
  const r = round.toLowerCase();
  if (r.includes("group")) return "GROUP_STAGE";
  if (/round of 32|last 32/.test(r)) return "LAST_32";
  if (/round of 16|last 16/.test(r)) return "LAST_16";
  if (r.includes("quarter")) return "QUARTER_FINALS";
  if (r.includes("semi")) return "SEMI_FINALS";
  if (/3rd|third/.test(r)) return "THIRD_PLACE";
  if (r.includes("final")) return "FINAL";
  return undefined;
}

/**
 * The kid-facing name of a knockout Round, e.g. "Round of 16". Empty string
 * for the group stage or an unknown stage — callers render nothing, exactly
 * like a knockout Match renders no Group.
 */
export function roundName(stage: Stage | undefined): string {
  switch (stage) {
    case "LAST_32":
      return "Round of 32";
    case "LAST_16":
      return "Round of 16";
    case "QUARTER_FINALS":
      return "Quarter-final";
    case "SEMI_FINALS":
      return "Semi-final";
    case "THIRD_PLACE":
      return "Third-place match";
    case "FINAL":
      return "Final";
    default:
      return "";
  }
}
