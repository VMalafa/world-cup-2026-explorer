"use client";

import type { ReactNode } from "react";

import { useProfile } from "./Profiles";
import { ProfilePicker } from "./ProfilePicker";

/**
 * Renders the app, with a one-time "Who's exploring?" gate over it on first run
 * (when no Profile has ever been chosen on this device). Returning families go
 * straight in. Removes no existing surface — the journey cutover comes later.
 */
export function ProfileGate({ children }: { children: ReactNode }) {
  const { hydrated, needsProfile, selectProfile } = useProfile();

  return (
    <>
      {children}
      {hydrated && needsProfile && (
        <ProfilePicker onSelect={selectProfile} dismissable={false} />
      )}
    </>
  );
}
