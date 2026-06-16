"use client";

import type { Continent } from "@/types";
import { getTeam } from "@/data/teams";
import { Flag } from "./Flag";

/** One team's verifiable facts (issue #33), as produced by `computeInsights`. */
export interface TeamInsights {
  code: string;
  facts: string[];
}

// Literal class strings so Tailwind's JIT keeps them; keyed by continent so the
// accent bar reinforces where the country is (geography is the spine).
const ACCENT: Record<Continent, string> = {
  africa: "bg-continent-africa",
  asia: "bg-continent-asia",
  europe: "bg-continent-europe",
  namerica: "bg-continent-namerica",
  samerica: "bg-continent-samerica",
  oceania: "bg-continent-oceania",
};

/**
 * The "Insights" panel shown in the Match Day Journey: for each of the two
 * playing Countries, a flag-headed list of bite-size, source-verifiable football
 * facts (derived from real results — never AI narrative or quotes). Issue #33.
 */
export function Insights({ teams }: { teams: TeamInsights[] }) {
  const withFacts = teams.filter((t) => t.facts.length > 0);
  if (withFacts.length === 0) return null;

  return (
    <section aria-label="Insights" className="mt-4">
      <h3 className="mb-2 text-lg font-extrabold">
        Insights <span aria-hidden>💡</span>
      </h3>
      <div className="space-y-4">
        {withFacts.map((t) => {
          const team = getTeam(t.code);
          const accent = team ? ACCENT[team.continent] : "bg-royal";
          return (
            <div key={t.code}>
              <div className="mb-1.5 flex items-center gap-2">
                {team ? (
                  <Flag team={team} size={24} className="!h-[18px] !w-[24px] shrink-0" />
                ) : (
                  <span className="text-base" aria-hidden>
                    🏳️
                  </span>
                )}
                <span className="text-sm font-extrabold">{team?.name ?? t.code}</span>
              </div>
              <ul className="space-y-1.5">
                {t.facts.map((fact, i) => (
                  <li
                    key={i}
                    className="flex items-stretch gap-2.5 rounded-xl bg-white pr-3 ring-1 ring-line"
                  >
                    <span
                      className={`w-1.5 shrink-0 rounded-l-xl ${accent}`}
                      aria-hidden
                    />
                    <span className="py-2 text-sm font-semibold leading-snug">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
