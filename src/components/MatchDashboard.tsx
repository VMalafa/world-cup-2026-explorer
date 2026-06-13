"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPinIcon, TrophyIcon } from "@heroicons/react/24/solid";
import { getFeatured, liveMinute, prettyDate, type Featured } from "@/lib/schedule";
import { getTeam } from "@/data/teams";
import type { Match } from "@/types";
import { CountdownTimer } from "./CountdownTimer";
import { Flag } from "./Flag";

const HEADING: Record<Featured["kind"], { title: string; sub: string }> = {
  today: { title: "Today's Matches", sub: "Here is what's happening today!" },
  upcoming: { title: "Next Up", sub: "The next exciting match day is coming!" },
  recent: { title: "Latest Matches", sub: "Look back at the last match day." },
};

function Side({ code }: { code: string }) {
  const team = getTeam(code);
  if (!team) return null;
  return (
    <div className="flex flex-1 flex-col items-center gap-2 text-center">
      <Flag team={team} size={88} />
      <span className="text-xl font-extrabold leading-tight sm:text-2xl">
        {team.name}
      </span>
      <span className="text-sm text-slate-500">{team.hello}</span>
    </div>
  );
}

function ScoreOrVs({ match }: { match: Match }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (match.status === "scheduled") {
    return (
      <div className="flex flex-col items-center gap-1 px-2">
        <span className="font-display text-3xl font-extrabold text-slate-300">
          vs
        </span>
      </div>
    );
  }

  const isLive = match.status === "live";
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <div className="flex items-center gap-2 font-display text-4xl font-extrabold tabular-nums">
        <span>{match.homeScore ?? 0}</span>
        <span className="text-slate-300">:</span>
        <span>{match.awayScore ?? 0}</span>
      </div>
      {isLive ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-extrabold uppercase text-white">
          <span className="h-2 w-2 animate-ping rounded-full bg-white" />
          Live {liveMinute(match, now)}&apos;
        </span>
      ) : (
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-extrabold uppercase text-slate-600">
          Full time
        </span>
      )}
    </div>
  );
}

function MatchCard({ match, index }: { match: Match; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 220, damping: 24 }}
      className="kid-card p-5 sm:p-7"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sunshine/30 px-3 py-1 text-sm font-extrabold text-amber-700">
          <TrophyIcon className="h-4 w-4" aria-hidden /> Group {match.group}
        </span>
        <span className="text-sm font-bold text-slate-500">
          {new Date(match.kickoff).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Side code={match.homeCode} />
        <ScoreOrVs match={match} />
        <Side code={match.awayCode} />
      </div>

      {match.status === "scheduled" && (
        <div className="mt-5 flex flex-col items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Kicks off in
          </span>
          <CountdownTimer target={match.kickoff} />
        </div>
      )}

      <div className="mt-5 flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-slate-600">
        <MapPinIcon className="h-4 w-4 shrink-0 text-bubble" aria-hidden />
        <span>
          {match.stadium}, {match.city}
        </span>
      </div>
    </motion.article>
  );
}

export function MatchDashboard({
  onFeatured,
}: {
  /** Lets the parent page know which teams/day to theme other sections with. */
  onFeatured?: (f: Featured) => void;
}) {
  const [featured, setFeatured] = useState<Featured | null>(null);

  useEffect(() => {
    const update = () => {
      const f = getFeatured(new Date());
      setFeatured(f);
      onFeatured?.(f);
    };
    update();
    // Refresh periodically so live scores & statuses keep ticking.
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
    // onFeatured is stable enough for this use; intentionally run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!featured) {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="kid-card h-64 animate-pulse bg-white/50" />
        ))}
      </div>
    );
  }

  const heading = HEADING[featured.kind];

  return (
    <section aria-labelledby="dash-heading">
      <div className="mb-5 text-center">
        <h2 id="dash-heading" className="text-3xl font-extrabold sm:text-4xl">
          {heading.title}
        </h2>
        <p className="mt-1 text-lg font-semibold text-slate-600">{heading.sub}</p>
        <p className="mt-1 text-base font-bold text-sky-600">
          {prettyDate(featured.date)}
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {featured.matches.map((m, i) => (
          <MatchCard key={m.id} match={m} index={i} />
        ))}
      </div>
    </section>
  );
}
