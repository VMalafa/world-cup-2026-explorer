/**
 * Done (CONTEXT.md, #56) — the per-Match marker set the moment a Profile
 * finishes that Match's Match Day Journey, so Today can show which fixtures are
 * already done. Distinct from a Stamp: a Stamp is per-Country and lives in the
 * Passport; Done is per-Match and never derived from Stamp state (a Country
 * stamped via one fixture can still have an un-Done Match).
 *
 * Pure data over the storage seam (ADR-0003) — per-Profile, on-device only,
 * keyed on the Match's stable id, never reset. It reads as "done for today"
 * naturally because each day lists different fixtures.
 */
import type { ProfileId } from "./profiles";
import type { KeyValueStore } from "./storage";

export interface DoneMatchesStore {
  /**
   * Mark a Match Done for a Profile — called on journey finish, the same
   * moment Stamps are earned. Idempotent: re-finishing keeps the original
   * `doneAt`.
   */
  markDone(profileId: ProfileId, matchId: string, at?: number): void;
  isDone(profileId: ProfileId, matchId: string): boolean;
  /** Every Match this Profile has finished, for building a lookup set. */
  listDone(profileId: ProfileId): string[];
}

const doneKey = (id: ProfileId) => `wc.done.${id}`;

/** Stored shape: a map of matchId → doneAt, keeping the set dedup'd. */
type StoredDone = Record<string, number>;

function read(kv: KeyValueStore, id: ProfileId): StoredDone {
  const raw = kv.getItem(doneKey(id));
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as StoredDone;
    }
  } catch {
    // corrupt blob — treat as nothing done
  }
  return {};
}

/** Build a DoneMatchesStore over any `KeyValueStore` (localStorage, memory, …). */
export function createDoneMatchesStore(kv: KeyValueStore): DoneMatchesStore {
  return {
    markDone(profileId, matchId, at = Date.now()) {
      const done = read(kv, profileId);
      if (!(matchId in done)) {
        done[matchId] = at;
        kv.setItem(doneKey(profileId), JSON.stringify(done));
      }
    },
    isDone(profileId, matchId) {
      return matchId in read(kv, profileId);
    },
    listDone(profileId) {
      return Object.keys(read(kv, profileId));
    },
  };
}
