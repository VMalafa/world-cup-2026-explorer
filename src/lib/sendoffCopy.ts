/**
 * The Road's loss branch copy (#66) — the Send-off extended to the knockout
 * "what if they lose?" moment, with the framing agreed in triage (#60): never
 * "out" or "eliminated". Three moves, then the pivot:
 *   1. a proud farewell (they played their hearts out),
 *   2. normalize it (every team goes home eventually — that's the game),
 *   3. reassure (the Country stays in the child's Passport forever),
 * then pivot to the winner's joy and the new Countries ahead on their Road.
 *
 * Pure copy builder so the Content Guardian can gate every line in tests
 * (`reviewCopyLine`, ADR-0002) — the words are a first-class requirement here.
 */
import type { RoadCandidate } from "./road";

export interface LossBranchCopy {
  farewell: string;
  partOfTheGame: string;
  passportKeepsake: string;
  winnersJoy: string;
}

export function lossBranchCopy(
  pickedName: string,
  winnerName: string,
  candidates: RoadCandidate[],
): LossBranchCopy {
  const ahead = candidates.map((c) => c.name);
  const roadAhead =
    ahead.length === 2
      ? `${ahead[0]} or ${ahead[1]} would be waiting on their Road`
      : ahead.length === 1
        ? `${ahead[0]} would be waiting on their Road`
        : "a brand-new country would be waiting on their Road";

  return {
    farewell: `And if ${pickedName} loses? They can walk off with heads held high — they played their hearts out.`,
    partOfTheGame:
      "Every team goes home eventually, and only one can lift the trophy. That's the game!",
    passportKeepsake: `You'll always have ${pickedName} in your Passport 💛`,
    winnersJoy: `Then it would be ${winnerName}'s turn to jump for joy — and ${roadAhead}!`,
  };
}

/** The lines in speaking order, for rendering and for Guardian gating. */
export function lossBranchLines(copy: LossBranchCopy): string[] {
  return [copy.farewell, copy.partOfTheGame, copy.passportKeepsake, copy.winnersJoy];
}
