"use client";

import type { StandingRow } from "@/lib/standings";
import { getTeam } from "@/data/teams";
import { Flag } from "./Flag";

/**
 * A group's live table (issue #31), derived from real results. Shown in the
 * Match Day Journey for the two playing Countries' group, with both of them
 * highlighted so a child can see "where do my countries stand?".
 */
export function Standings({
  group,
  rows,
  highlight = [],
}: {
  group: string;
  rows: StandingRow[];
  /** Team codes to emphasise (the two playing this match). */
  highlight?: string[];
}) {
  if (rows.length === 0) return null;
  const lit = new Set(highlight);
  const anyPlayed = rows.some((r) => r.played > 0);

  return (
    <section
      aria-label={`Group ${group} standings`}
      className="mt-4 rounded-blob bg-white p-4 ring-1 ring-line sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-extrabold">
          Group {group} <span aria-hidden>🏆</span>
        </h3>
        <span className="text-xs font-bold uppercase tracking-wide text-muted">
          {anyPlayed ? "Points so far" : "Not started yet"}
        </span>
      </div>

      {/* Column key — tiny, since the rows are wide and kid-targeted. */}
      <div className="mb-1 grid grid-cols-[1.5rem_1fr_2rem_2.25rem_2.25rem] items-center gap-2 px-1 text-[0.65rem] font-bold uppercase tracking-wide text-muted">
        <span aria-hidden>#</span>
        <span>Team</span>
        <span className="text-center" title="Played">
          P
        </span>
        <span className="text-center" title="Goal difference">
          GD
        </span>
        <span className="text-center" title="Points">
          Pts
        </span>
      </div>

      <ol className="space-y-1">
        {rows.map((r, i) => {
          const team = getTeam(r.code);
          const isLit = lit.has(r.code);
          return (
            <li
              key={r.code}
              className={`grid grid-cols-[1.5rem_1fr_2rem_2.25rem_2.25rem] items-center gap-2 rounded-xl px-1 py-1.5 ${
                isLit ? "bg-royal-50 ring-1 ring-royal-200" : ""
              }`}
            >
              <span className="text-center text-sm font-extrabold tabular-nums text-muted">
                {i + 1}
              </span>
              <span className="flex min-w-0 items-center gap-2">
                {team ? (
                  <Flag team={team} size={28} className="!h-[21px] !w-[28px] shrink-0" />
                ) : (
                  <span className="text-lg" aria-hidden>
                    🏳️
                  </span>
                )}
                <span className="truncate text-sm font-extrabold">
                  {team?.name ?? r.code}
                </span>
              </span>
              <span className="text-center text-sm font-bold tabular-nums text-muted">
                {r.played}
              </span>
              <span className="text-center text-sm font-bold tabular-nums text-muted">
                {r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}
              </span>
              <span className="text-center text-base font-extrabold tabular-nums text-royal">
                {r.points}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
