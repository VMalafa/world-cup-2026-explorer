/**
 * The static, hand-authored 2026 knockout bracket topology (ADR-0009, #63).
 *
 * The live provider sends knockout fixtures flat — nothing in the feed says
 * which Match's winner advances into which later slot — while the tree itself
 * is a fixed, published fact. So the edges live here, authored once, and The
 * Road is computed from `stage` + this map. This is intentional, not stale
 * data: read ADR-0009 before "fixing" it.
 *
 * Slot identity is stable, NOT provider ids (a snapshot refresh may renumber
 * fixtures): a slot is (Round, ordinal of the fixture's published kickoff
 * within that Round, 1-based). Kickoff times come with the schedule and never
 * collide inside a knockout Round — `road.test.ts` asserts that, and also
 * cross-checks every decided side of a later-round fixture against its mapped
 * feeders, so a wrong edge fails the suite as soon as the daily snapshot
 * refresh (ADR-0005) fills the teams in.
 */
import type { Stage } from "@/types";

/** The Round a knockout Match's winner advances into. */
export const NEXT_ROUND: Partial<Record<Stage, Stage>> = {
  LAST_32: "LAST_16",
  LAST_16: "QUARTER_FINALS",
  QUARTER_FINALS: "SEMI_FINALS",
  SEMI_FINALS: "FINAL",
  // FINAL and THIRD_PLACE have no next round — the trophy is the end (#65).
};

/**
 * For each Round, its slots in kickoff order; each entry is the pair of
 * previous-Round slot ordinals whose winners meet there.
 */
export const BRACKET_FEEDERS: Partial<Record<Stage, [number, number][]>> = {
  LAST_16: [
    [1, 4],
    [3, 6],
    [2, 5],
    [7, 8],
    [12, 11],
    [10, 9],
    [15, 14],
    [13, 16],
  ],
  QUARTER_FINALS: [
    [2, 1],
    [3, 4],
    [5, 6],
    [7, 8],
  ],
  SEMI_FINALS: [
    [1, 2],
    [3, 4],
  ],
  FINAL: [[1, 2]],
};
