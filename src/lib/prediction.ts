/**
 * Prediction (CONTEXT.md) — a child's pre-kickoff guess of the Match of the Day
 * winner. Stored per Profile + Match through the seam (ADR-0003), on-device.
 *
 * A Prediction NEVER gates a Stamp — learning earns stamps, watching does not.
 * It's pure fun, paid off later by the deferred "what happened?" reveal.
 */
import type { ProfileId } from "./profiles";
import type { KeyValueStore } from "./storage";

/** A winning Country code (e.g. "JPN"), or "draw". */
export type Prediction = string;

export interface PredictionStore {
  get(profileId: ProfileId, matchId: string): Prediction | null;
  set(profileId: ProfileId, matchId: string, pick: Prediction): void;
}

const key = (profileId: ProfileId, matchId: string) =>
  `wc.prediction.${profileId}.${matchId}`;

export function createPredictionStore(kv: KeyValueStore): PredictionStore {
  return {
    get(profileId, matchId) {
      return kv.getItem(key(profileId, matchId));
    },
    set(profileId, matchId, pick) {
      kv.setItem(key(profileId, matchId), pick);
    },
  };
}
