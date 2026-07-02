"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { Country, Stage } from "@/types";
import { getCountry } from "@/data/countries";
import { getTeam } from "@/data/teams";
import { langFor } from "@/data/languages";
import { ROUND_LADDER, roundName } from "@/lib/round";
import type { RoadCandidate, RoadStep } from "@/lib/road";
import { useProfile } from "./Profiles";
import { Flag } from "./Flag";
import { SpeakableText } from "./SpeakableText";

/**
 * The Road beat (#63) — inside a knockout Match's journey, extend the child's
 * Prediction forward: "if your pick wins, they'd next meet X or Y." Pre-match
 * conditional only: fixture team lists, never live scores, and it never
 * touches Stamp/Passport state. Undecided rivals get the friendly
 * to-be-decided treatment (#44/ADR-0008), never an invented name.
 *
 * Each candidate is a light in-place teaser (#64): tapping reveals the
 * Country's flag, its hello (read aloud in-language), and one fun fact —
 * reusing the curated Country content. No navigation away, no Stamp earned;
 * that stays the Match Day Journey's job.
 */
export function RoadBeat({
  road,
  pick,
  home,
  away,
}: {
  road: RoadStep | null;
  /** The child's current Prediction (a team code, "draw", or null). */
  pick: string | null;
  home: Country;
  away: Country;
}) {
  const reduce = useReducedMotion();
  const [openCode, setOpenCode] = useState<string | null>(null);
  if (!road) return null;

  const round = roundName(road.nextStage);
  const picked = pick === home.code ? home : pick === away.code ? away : null;
  const subject = picked ? picked.name : "the winner";
  const names = road.candidates.map((c) => c.name);

  const line =
    names.length === 2
      ? `If ${subject} wins, they'd meet ${names[0]} or ${names[1]} in the ${round} — a new country either way!`
      : names.length === 1
        ? `If ${subject} wins, they'd meet ${names[0]} in the ${round}!`
        : `If ${subject} wins, they'll play in the ${round} — their next rival isn't decided yet. Check back soon!`;

  const open = road.candidates.find((c) => c.code === openCode) ?? null;

  return (
    <div className="mt-5 rounded-blob bg-royal-50 p-4 text-center">
      <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-extrabold text-royal shadow-card">
        <span aria-hidden>🛤️</span> The Road
      </p>
      <SpeakableText
        text={line}
        className="justify-center"
        textClassName="font-extrabold text-ink"
      />
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {road.candidates.length > 0 ? (
          road.candidates.map((c) => {
            const team = getTeam(c.code);
            const active = openCode === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setOpenCode(active ? null : c.code)}
                aria-expanded={active}
                aria-label={`Meet ${c.name}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-extrabold ring-1 transition-transform hover:-translate-y-0.5 ${
                  active ? "bg-royal text-white ring-royal" : "bg-white text-ink ring-line"
                }`}
              >
                {team ? (
                  <Flag team={team} size={26} className="!h-[19px] !w-[26px]" />
                ) : c.flag ? (
                  // eslint-disable-next-line @next/next/no-img-element -- provider CDN flag
                  <img src={c.flag} alt="" width={26} height={19} className="h-[19px] w-[26px] rounded-sm object-cover" />
                ) : (
                  <span aria-hidden>🏳️</span>
                )}
                {c.name}
              </button>
            );
          })
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-extrabold text-muted ring-1 ring-line">
            <span aria-hidden>🏆</span> To be decided
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key={open.code}
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <CandidateTeaser candidate={open} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The whole climb at a glance (#65): a dotted outline of the Rounds from the
 * Round of 32 to the Final, current Round marked, no team names — the child
 * sees how far up the mountain this Match sits.
 */
export function RoundsClimb({ stage }: { stage?: Stage }) {
  if (!stage || !ROUND_LADDER.includes(stage)) return null;
  const at = ROUND_LADDER.indexOf(stage);

  return (
    <ol
      aria-label="The road to the Final"
      className="mt-4 flex flex-wrap items-center justify-center gap-y-2"
    >
      {ROUND_LADDER.map((s, i) => {
        const current = i === at;
        const climbed = i < at;
        return (
          <li key={s} className="flex items-center">
            {i > 0 && (
              <span className="mx-1 w-4 border-t-2 border-dotted border-royal-200" aria-hidden />
            )}
            <span
              aria-current={current ? "step" : undefined}
              className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${
                current
                  ? "bg-royal text-white"
                  : climbed
                    ? "border border-dotted border-cedar text-cedar-700"
                    : "border border-dotted border-royal-200 text-muted"
              }`}
            >
              {current && (
                <span aria-hidden className="mr-1">
                  📍
                </span>
              )}
              {s === "FINAL" ? "Final 🏆" : roundName(s)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The end of the Road (#65): the Final has no next Round — whoever wins it
 * lifts the trophy. A celebration, not another arrow.
 */
export function TrophyFinale() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-5 rounded-blob bg-gold-100 p-4 text-center">
      <motion.p
        initial={reduce ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 14 }}
        className="text-5xl"
        aria-hidden
      >
        🏆
      </motion.p>
      <SpeakableText
        text="This is the Final — the very top of the Road. Whoever wins this match lifts the World Cup trophy!"
        className="mt-1 justify-center"
        textClassName="font-extrabold text-gold-700"
      />
    </div>
  );
}

/**
 * The in-place teaser (#64): flag, read-aloud hello, one fun fact. A Country
 * missing richer content degrades gracefully — name and flag at minimum.
 */
function CandidateTeaser({ candidate }: { candidate: RoadCandidate }) {
  const { pick } = useProfile();
  const country = getCountry(candidate.code);
  const team = getTeam(candidate.code);
  const funFact = country?.funFacts[0];

  return (
    <div className="mt-3 rounded-blob bg-white p-4 shadow-card ring-1 ring-line">
      <div className="flex items-center justify-center gap-3">
        {team ? (
          <Flag team={team} size={56} className="!h-[42px] !w-[56px] shrink-0" />
        ) : candidate.flag ? (
          // eslint-disable-next-line @next/next/no-img-element -- provider CDN flag
          <img
            src={candidate.flag}
            alt={`Flag of ${candidate.name}`}
            width={56}
            height={42}
            className="h-[42px] w-[56px] rounded-lg object-cover shadow-sm"
          />
        ) : (
          <span className="text-4xl" role="img" aria-label={`Flag of ${candidate.name}`}>
            🏳️
          </span>
        )}
        <span className="text-xl font-extrabold text-ink">{candidate.name}</span>
      </div>

      {country?.hello && (
        <div className="mt-2 flex justify-center">
          <SpeakableText
            autoRead
            lang={langFor(country.code)}
            text={country.hello}
            speakText={country.hello}
            className="justify-center rounded-full bg-royal-50 px-3 py-1"
            textClassName="font-extrabold text-ink"
          />
        </div>
      )}

      {funFact && (
        <SpeakableText
          text={pick(funFact)}
          speakText={`${candidate.name}. ${pick(funFact)}`}
          className="mt-2 justify-center"
          textClassName="font-semibold text-ink"
        />
      )}
    </div>
  );
}
