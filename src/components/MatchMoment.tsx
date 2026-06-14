"use client";

import { useEffect, useMemo, useState } from "react";

import type { Country } from "@/types";
import { getTeam } from "@/data/teams";
import { browserKeyValue } from "@/lib/storage";
import { createPredictionStore } from "@/lib/prediction";
import { useProfile } from "./Profiles";
import { Flag } from "./Flag";
import { CountdownTimer } from "./CountdownTimer";
import { SpeakableText } from "./SpeakableText";

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
            <button
              key={o.code}
              type="button"
              onClick={() => choose(o.code)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-2 rounded-blob px-2 py-4 font-extrabold ring-1 transition-transform hover:-translate-y-0.5 ${
                active ? "bg-royal text-white ring-royal" : "bg-white text-ink ring-line"
              }`}
            >
              {o.country ? (
                <Flag team={getTeam(o.country.code)!} size={56} className="!h-[33px] !w-[44px]" />
              ) : (
                <span className="text-3xl" aria-hidden>🤝</span>
              )}
              <span className="text-sm leading-tight">{o.label}</span>
            </button>
          );
        })}
      </div>

      {pickedLabel && (
        <p className="mt-4 rounded-full bg-cedar-100 px-4 py-2 font-extrabold text-cedar-700">
          You picked {pickedLabel}! We&rsquo;ll see what happens. 🎉
        </p>
      )}
      <p className="mt-3 text-sm font-semibold text-muted">
        Guessing is just for fun — finishing the journey earns your stamps either way.
      </p>
    </div>
  );
}
