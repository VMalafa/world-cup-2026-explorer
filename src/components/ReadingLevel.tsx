"use client";

/**
 * Compatibility shim. Reading level is now per-Profile (issue #1); the state
 * lives in `Profiles.tsx`. Existing components still import `useReadingLevel`
 * (and `ReadingLevelProvider`) from here, so they keep working unchanged.
 */
export {
  ProfileProvider as ReadingLevelProvider,
  useReadingLevel,
} from "./Profiles";
