"use client";

import { useState } from "react";

import { useProfile } from "./Profiles";
import { ProfilePicker } from "./ProfilePicker";

/**
 * The header chip showing who's exploring. Tap to re-open the picker and switch
 * child — which also switches the reading level, since level is per-Profile.
 */
export function ProfileChip() {
  const { activeProfile, selectProfile, hydrated } = useProfile();
  const [open, setOpen] = useState(false);

  // Nothing to show until a profile exists (the first-run gate handles that).
  if (!hydrated || !activeProfile) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Exploring as ${activeProfile.name}. Tap to switch.`}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-extrabold text-ink shadow-card ring-1 ring-line hover:text-royal"
      >
        <span className="text-xl" aria-hidden>
          {activeProfile.emoji}
        </span>
        <span>{activeProfile.name}</span>
        <span className="text-sm text-muted" aria-hidden>
          ⌄
        </span>
      </button>

      {open && (
        <ProfilePicker
          dismissable
          onClose={() => setOpen(false)}
          onSelect={(id) => {
            selectProfile(id);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
