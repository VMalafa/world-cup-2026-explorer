"use client";

import type { Country } from "@/types";
import { getTeam } from "@/data/teams";
import { roundName } from "@/lib/round";
import type { RoadStep } from "@/lib/road";
import { Flag } from "./Flag";
import { SpeakableText } from "./SpeakableText";

/**
 * The Road beat (#63) — inside a knockout Match's journey, extend the child's
 * Prediction forward: "if your pick wins, they'd next meet X or Y." Pre-match
 * conditional only: fixture team lists, never live scores, and it never
 * touches Stamp/Passport state. Undecided rivals get the friendly
 * to-be-decided treatment (#44/ADR-0008), never an invented name.
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
            return (
              <span
                key={c.code}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-extrabold text-ink ring-1 ring-line"
              >
                {team ? (
                  <Flag team={team} size={26} className="!h-[19px] !w-[26px]" />
                ) : (
                  <span aria-hidden>🏳️</span>
                )}
                {c.name}
              </span>
            );
          })
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-extrabold text-muted ring-1 ring-line">
            <span aria-hidden>🏆</span> To be decided
          </span>
        )}
      </div>
    </div>
  );
}
