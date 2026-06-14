/**
 * Profiles — "who's exploring?" (CONTEXT.md: **Profile**).
 *
 * Two on-device children, chosen by tapping a face (no login). Each Profile
 * owns its own reading level. All state flows through the `KeyValueStore` seam
 * (ADR-0003) so nothing about a child leaves the device, and Neon can replace
 * the backing later without changing callers.
 */
import type { ReadingLevel } from "@/types";

import type { KeyValueStore } from "./storage";

export type ProfileId = "ava" | "kai";

export interface Profile {
  id: ProfileId;
  name: string;
  /** Emoji face shown in the picker and header chip. */
  emoji: string;
  /** Reading level used until this child changes it (age-appropriate). */
  defaultLevel: ReadingLevel;
}

/** The two children, in pick order. Ava (6) reads bigger; Kai (4) littler. */
export const PROFILES: Profile[] = [
  { id: "ava", name: "Ava", emoji: "🦉", defaultLevel: "enriched" },
  { id: "kai", name: "Kai", emoji: "🐣", defaultLevel: "kinder" },
];

const PROFILE_BY_ID: Record<ProfileId, Profile> = {
  ava: PROFILES[0],
  kai: PROFILES[1],
};

export function getProfile(id: ProfileId): Profile {
  return PROFILE_BY_ID[id];
}

/** The persisted state about who's exploring and how each child reads. */
export interface ProfileStore {
  /** The currently chosen child, or null on first run. */
  getActiveProfileId(): ProfileId | null;
  setActiveProfileId(id: ProfileId): void;
  /** This child's reading level — their default until they change it. */
  getReadingLevel(id: ProfileId): ReadingLevel;
  setReadingLevel(id: ProfileId, level: ReadingLevel): void;
}

const ACTIVE_KEY = "wc.activeProfile";
const levelKey = (id: ProfileId) => `wc.readingLevel.${id}`;

const isProfileId = (v: string | null): v is ProfileId => v === "ava" || v === "kai";
const isLevel = (v: string | null): v is ReadingLevel =>
  v === "kinder" || v === "enriched";

/** Build a ProfileStore over any `KeyValueStore` (localStorage, memory, …). */
export function createProfileStore(kv: KeyValueStore): ProfileStore {
  return {
    getActiveProfileId() {
      const raw = kv.getItem(ACTIVE_KEY);
      return isProfileId(raw) ? raw : null;
    },
    setActiveProfileId(id) {
      kv.setItem(ACTIVE_KEY, id);
    },
    getReadingLevel(id) {
      const raw = kv.getItem(levelKey(id));
      return isLevel(raw) ? raw : getProfile(id).defaultLevel;
    },
    setReadingLevel(id, level) {
      kv.setItem(levelKey(id), level);
    },
  };
}
