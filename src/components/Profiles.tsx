"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { DualText, ReadingLevel } from "@/types";
import { browserKeyValue } from "@/lib/storage";
import {
  createProfileStore,
  getProfile,
  PROFILES,
  type Profile,
  type ProfileId,
} from "@/lib/profiles";

interface ProfileCtx {
  /** The two children, in pick order. */
  profiles: Profile[];
  activeProfileId: ProfileId | null;
  activeProfile: Profile | null;
  /** Choose who's exploring; persists on-device immediately. */
  selectProfile: (id: ProfileId) => void;
  /** True once on-device state has been read (avoids a first-paint flash). */
  hydrated: boolean;
  /** No profile chosen yet → show the first-run picker. */
  needsProfile: boolean;

  // --- Reading level, scoped to the active profile ---
  level: ReadingLevel;
  setLevel: (l: ReadingLevel) => void;
  toggle: () => void;
  /** Pick the right string from a DualText for the active profile's level. */
  pick: (t: DualText) => string;
}

const ProfileContext = createContext<ProfileCtx | null>(null);

const defaultLevels = (): Record<ProfileId, ReadingLevel> => ({
  ava: getProfile("ava").defaultLevel,
  kai: getProfile("kai").defaultLevel,
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  // The storage seam (localStorage in the browser, memory on the server).
  const store = useMemo(() => createProfileStore(browserKeyValue()), []);

  const [hydrated, setHydrated] = useState(false);
  const [activeProfileId, setActiveId] = useState<ProfileId | null>(null);
  const [levels, setLevels] = useState<Record<ProfileId, ReadingLevel>>(defaultLevels);

  // Read persisted state after mount so server and first client paint agree.
  useEffect(() => {
    setActiveId(store.getActiveProfileId());
    setLevels({
      ava: store.getReadingLevel("ava"),
      kai: store.getReadingLevel("kai"),
    });
    setHydrated(true);
  }, [store]);

  const selectProfile = useCallback(
    (id: ProfileId) => {
      store.setActiveProfileId(id);
      setActiveId(id);
    },
    [store],
  );

  const level: ReadingLevel = activeProfileId ? levels[activeProfileId] : "kinder";

  const setLevel = useCallback(
    (l: ReadingLevel) => {
      if (!activeProfileId) return;
      store.setReadingLevel(activeProfileId, l);
      setLevels((prev) => ({ ...prev, [activeProfileId]: l }));
    },
    [store, activeProfileId],
  );

  const toggle = useCallback(
    () => setLevel(level === "kinder" ? "enriched" : "kinder"),
    [setLevel, level],
  );

  const pick = useCallback(
    (t: DualText) => (level === "kinder" ? t.kinder : t.enriched),
    [level],
  );

  const value = useMemo<ProfileCtx>(
    () => ({
      profiles: PROFILES,
      activeProfileId,
      activeProfile: activeProfileId ? getProfile(activeProfileId) : null,
      selectProfile,
      hydrated,
      needsProfile: hydrated && activeProfileId === null,
      level,
      setLevel,
      toggle,
      pick,
    }),
    [activeProfileId, selectProfile, hydrated, level, setLevel, toggle, pick],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileCtx {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

/**
 * Backward-compatible reading-level hook. Existing components keep importing
 * `useReadingLevel`; it now resolves to the active profile's level.
 */
export function useReadingLevel() {
  const { level, setLevel, toggle, pick } = useProfile();
  return { level, setLevel, toggle, pick };
}
