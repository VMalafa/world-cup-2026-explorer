/**
 * Passport + Stamp (CONTEXT.md) — the persistent collection the journey rewards
 * into. A Passport is per-Profile: the set of Countries a child has explored,
 * each holding one Stamp earned when that Country's Match Day Journey finished.
 *
 * Pure data over the issue-#1 storage seam (ADR-0003) — on-device only, so no
 * progress about a child ever leaves the device. No UI here (that is #8).
 */
import type { ProfileId } from "./profiles";
import type { KeyValueStore } from "./storage";

/** The reward earned for one Country; the unit a Passport collects. */
export interface Stamp {
  /** The Country's code (e.g. "BRA"). */
  countryCode: string;
  /** When it was earned (epoch ms). */
  earnedAt: number;
}

export interface PassportStore {
  /**
   * Earn a Stamp for a Country. Idempotent: a Country lives in the Passport
   * once, so re-earning keeps the original Stamp (and its `earnedAt`).
   * Returns the Stamp now held for that Country.
   */
  earnStamp(profileId: ProfileId, countryCode: string, at?: number): Stamp;
  hasStamp(profileId: ProfileId, countryCode: string): boolean;
  stampCount(profileId: ProfileId): number;
  /** The Passport's Stamps, oldest-earned first. */
  listStamps(profileId: ProfileId): Stamp[];
}

const passportKey = (id: ProfileId) => `wc.passport.${id}`;

/** Stored shape: a map of countryCode → earnedAt, keeping the set dedup'd. */
type StoredPassport = Record<string, number>;

function read(kv: KeyValueStore, id: ProfileId): StoredPassport {
  const raw = kv.getItem(passportKey(id));
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as StoredPassport;
    }
  } catch {
    // corrupt blob — treat as an empty Passport
  }
  return {};
}

function write(kv: KeyValueStore, id: ProfileId, passport: StoredPassport): void {
  kv.setItem(passportKey(id), JSON.stringify(passport));
}

const toStamps = (passport: StoredPassport): Stamp[] =>
  Object.entries(passport)
    .map(([countryCode, earnedAt]) => ({ countryCode, earnedAt }))
    .sort((a, b) => a.earnedAt - b.earnedAt);

/** Build a PassportStore over any `KeyValueStore` (localStorage, memory, …). */
export function createPassportStore(kv: KeyValueStore): PassportStore {
  return {
    earnStamp(profileId, countryCode, at = Date.now()) {
      const passport = read(kv, profileId);
      if (!(countryCode in passport)) {
        passport[countryCode] = at;
        write(kv, profileId, passport);
      }
      return { countryCode, earnedAt: passport[countryCode] };
    },
    hasStamp(profileId, countryCode) {
      return countryCode in read(kv, profileId);
    },
    stampCount(profileId) {
      return Object.keys(read(kv, profileId)).length;
    },
    listStamps(profileId) {
      return toStamps(read(kv, profileId));
    },
  };
}
