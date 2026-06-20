"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { Country } from "@/types";
import { getTeam } from "@/data/teams";
import { browserKeyValue } from "@/lib/storage";
import { createPredictionStore } from "@/lib/prediction";
import { useProfile } from "./Profiles";
import { Flag } from "./Flag";
import { CountdownTimer } from "./CountdownTimer";
import { SpeakableText } from "./SpeakableText";
import { ConfirmBadge } from "./ConfirmBadge";

const DRAW = "draw";

/**
 * The Match moment — the two flags, the kickoff countdown, and a winner
 * Prediction (stored per Profile + Match). Predicting is pure fun: it NEVER
 * gates a Stamp, and the journey still finishes regardless. The post-match
 * "what happened?" reveal is a deferred fast-follow.
 */
export function MatchMoment({
  home,
  away,
  matchId,
  kickoff,
}: {
  home: Country;
  away: Country;
  matchId: string;
  kickoff?: string;
}) {
  const { activeProfileId } = useProfile();
  const reduce = useReducedMotion();
  const store = useMemo(() => createPredictionStore(browserKeyValue()), []);
  const [pick, setPick] = useState<string | null>(null);

  useEffect(() => {
    if (activeProfileId) setPick(store.get(activeProfileId, matchId));
  }, [activeProfileId, matchId, store]);

  function choose(code: string) {
    if (!activeProfileId) return;
    store.set(activeProfileId, matchId, code);
    setPick(code);
  }

  const options = [
    { code: home.code, label: home.name, country: home },
    { code: DRAW, label: "A tie", country: null },
    { code: away.code, label: away.name, country: away },
  ];

  const pickedLabel =
    pick === DRAW ? "a tie" : pick === home.code ? home.name : pick === away.code ? away.name : null;

  return (
    <div className="text-center">
      {/* The two flags */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <Flag team={getTeam(home.code)!} size={72} className="!h-[54px] !w-[72px]" />
        <span className="font-display text-2xl font-extrabold text-royal-200">vs</span>
        <Flag team={getTeam(away.code)!} size={72} className="!h-[54px] !w-[72px]" />
      </div>

      {kickoff && (
        <div className="mb-4 flex flex-col items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-wide text-muted">Kicks off in</span>
          <CountdownTimer target={kickoff} />
        </div>
      )}

      <SpeakableText
        autoRead
        text={`Who do you think will win, ${home.name} or ${away.name}?`}
        className="justify-center"
        textClassName="text-lg font-extrabold text-ink"
      />

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {options.map((o) => {
          const active = pick === o.code;
          return (
            <motion.button
              key={o.code}
              type="button"
              onClick={() => choose(o.code)}
              aria-pressed={active}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              className={`relative flex flex-col items-center gap-2 rounded-blob px-2 py-4 font-extrabold ring-1 transition-transform hover:-translate-y-0.5 ${
                active ? "bg-royal text-white ring-royal" : "bg-white text-ink ring-line"
              }`}
            >
              {/* The "you got it!" signal — a ✓ that springs onto the chosen card. */}
              <AnimatePresence>
                {active && (
                  <motion.span
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 18 }}
                    className="absolute -right-1.5 -top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold text-sm text-white shadow-card ring-2 ring-white"
                    aria-hidden
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
              {o.country ? (
                <Flag team={getTeam(o.country.code)!} size={56} className="!h-[33px] !w-[44px]" />
              ) : (
                <span className="text-3xl" aria-hidden>🤝</span>
              )}
              <span className="text-sm leading-tight">{o.label}</span>
            </motion.button>
          );
        })}
      </div>

      {pickedLabel && (
        <div className="mt-4 flex flex-col items-center gap-1.5">
          <ConfirmBadge label={`You picked ${pickedLabel}!`} tone="cedar" />
          <p className="text-sm font-semibold text-muted">
            We&rsquo;ll see what happens. 🎉
          </p>
        </div>
      )}
      <p className="mt-3 text-sm font-semibold text-muted">
        Guessing is just for fun — finishing the journey earns your stamps either way.
      </p>
    </div>
  );
}
