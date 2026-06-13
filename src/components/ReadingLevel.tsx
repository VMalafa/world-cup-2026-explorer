"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { DualText, ReadingLevel } from "@/types";

interface Ctx {
  level: ReadingLevel;
  setLevel: (l: ReadingLevel) => void;
  toggle: () => void;
  /** Pick the right string from a DualText for the current level. */
  pick: (t: DualText) => string;
}

const ReadingLevelContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "wc-reading-level";

export function ReadingLevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<ReadingLevel>("kinder");

  // Remember the family's choice between visits.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "kinder" || saved === "enriched") setLevelState(saved);
  }, []);

  const setLevel = (l: ReadingLevel) => {
    setLevelState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  };

  const toggle = () => setLevel(level === "kinder" ? "enriched" : "kinder");
  const pick = (t: DualText) => (level === "kinder" ? t.kinder : t.enriched);

  return (
    <ReadingLevelContext.Provider value={{ level, setLevel, toggle, pick }}>
      {children}
    </ReadingLevelContext.Provider>
  );
}

export function useReadingLevel(): Ctx {
  const ctx = useContext(ReadingLevelContext);
  if (!ctx) {
    throw new Error("useReadingLevel must be used within ReadingLevelProvider");
  }
  return ctx;
}
