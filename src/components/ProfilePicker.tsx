"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { PROFILES, type ProfileId } from "@/lib/profiles";

/**
 * "Who's exploring?" — the no-login picker. Tap a face to become that Profile.
 * Used as a first-run gate (not dismissable) and as a switcher from the header
 * chip (dismissable). Read-aloud-friendly: big faces, big names, big targets.
 */
export function ProfilePicker({
  onSelect,
  onClose,
  dismissable = false,
}: {
  onSelect: (id: ProfileId) => void;
  onClose?: () => void;
  dismissable?: boolean;
}) {
  const reduce = useReducedMotion();

  // Let families dismiss the switcher with Escape (never the first-run gate).
  useEffect(() => {
    if (!dismissable || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismissable, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="who-title"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-royal-700/95 px-6 py-10 backdrop-blur"
    >
      {dismissable && onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl font-extrabold text-white hover:bg-white/25"
        >
          <span aria-hidden>×</span>
        </button>
      )}

      <h2
        id="who-title"
        className="text-center text-[clamp(1.75rem,8vw,2.75rem)] font-extrabold text-white"
      >
        Who&rsquo;s exploring? <span aria-hidden>👋</span>
      </h2>

      <ul className="flex flex-wrap items-stretch justify-center gap-5">
        {PROFILES.map((p, i) => (
          <li key={p.id}>
            <motion.button
              onClick={() => onSelect(p.id)}
              aria-label={`${p.name} — start exploring`}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { delay: 0.08 * i, type: "spring", stiffness: 360, damping: 26 }}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              className="kid-card flex w-40 flex-col items-center gap-3 px-6 py-7 sm:w-48"
            >
              <span className="text-7xl sm:text-8xl" aria-hidden>
                {p.emoji}
              </span>
              <span className="text-2xl font-extrabold text-ink">{p.name}</span>
            </motion.button>
          </li>
        ))}
      </ul>

      <p className="max-w-xs text-center text-base font-bold text-white/85">
        Tap your face to start. We remember just on this device.
      </p>
    </div>
  );
}
