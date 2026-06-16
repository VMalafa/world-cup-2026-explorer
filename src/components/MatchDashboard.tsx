"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinIcon, TrophyIcon } from "@heroicons/react/24/solid";
import { matchClock, prettyDate, type Featured } from "@/lib/schedule";
import { getTeam } from "@/data/teams";
import type { Match } from "@/types";
import { CountdownTimer } from "./CountdownTimer";
import { Flag } from "./Flag";

const HEADING: Record<Featured["kind"], { title: string; sub: string }> = {
  today: { title: "Today's Matches", sub: "Here is what's happening today!" },
  upcoming: { title: "Next Up", sub: "The next exciting match day is coming!" },
  recent: { title: "Latest Matches", sub: "Look back at the last match day." },
};

function Side({
  code,
  name,
  flagUrl,
}: {
  code: string;
  /** Fallback display name when the team isn't in the curated set. */
  name?: string;
  /** Fallback flag image URL for non-curated teams. */
  flagUrl?: string;
}) {
  const team = getTeam(code);

  // Curated team → full learning data (flag with emoji fallback + greeting).
  if (team) {
    return (
      <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
        <Flag team={team} size={72} className="sm:!h-[66px] sm:!w-[88px]" />
        <span className="break-words text-lg font-extrabold leading-tight sm:text-2xl">
          {team.name}
        </span>
        <span className="text-sm text-muted">{team.hello}</span>
      </div>
    );
  }

  // Live team not in the curated set → show what the provider gave us.
  const label = name || code;
  return (
    <div className="flex flex-1 flex-col items-center gap-2 text-center">
      {flagUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- provider CDN flag
        <img
          src={flagUrl}
          alt={`Flag of ${label}`}
          width={88}
          height={66}
          loading="lazy"
          className="h-[54px] w-[72px] rounded-lg object-cover shadow-sm sm:h-[66px] sm:w-[88px]"
        />
      ) : (
        <span className="text-5xl" role="img" aria-label={`Flag of ${label}`}>
          🏳️
        </span>
      )}
      <span className="break-words text-lg font-extrabold leading-tight sm:text-2xl">
        {label}
      </span>
    </div>
  );
}

function ScoreOrVs({ match }: { match: Match }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const clock = matchClock(match, now);

  if (clock.kind === "scheduled") {
    return (
      <div className="flex shrink-0 flex-col items-center gap-1 px-2">
        <span className="font-display text-3xl font-extrabold text-royal-200">
          vs
        </span>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-1 px-2">
      <div className="flex items-center gap-1.5 font-display text-3xl font-extrabold tabular-nums sm:gap-2 sm:text-4xl">
        <span>{match.homeScore ?? 0}</span>
        <span className="text-royal-200">:</span>
        <span>{match.awayScore ?? 0}</span>
      </div>
      {clock.kind === "playing" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-unity px-3 py-1 text-xs font-extrabold uppercase text-white">
          <span className="h-2 w-2 animate-ping rounded-full bg-white" />
          Live {clock.minute}&apos;
        </span>
      ) : clock.kind === "halftime" ? (
        <span className="rounded-full bg-unity px-3 py-1 text-xs font-extrabold uppercase text-white">
          Halftime
        </span>
      ) : (
        <span className="rounded-full bg-line px-3 py-1 text-xs font-extrabold uppercase text-muted">
          Full time
        </span>
      )}
    </div>
  );
}

function MatchCard({
  match,
  index,
  featured = false,
  clickable = false,
}: {
  match: Match;
  index: number;
  /** The auto-picked Match of the Day. */
  featured?: boolean;
  /** Both teams are curated, so the card opens a journey. */
  clickable?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 220, damping: 24 }}
      className={`kid-card h-full p-4 transition-transform sm:p-7 ${
        clickable ? "hover:-translate-y-0.5" : ""
      } ${featured ? "ring-2 ring-gold" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-sm font-extrabold text-gold-700">
          {featured ? (
            <>
              <span aria-hidden>⭐</span> Match of the Day
            </>
          ) : (
            <>
              <TrophyIcon className="h-4 w-4" aria-hidden /> Group {match.group}
            </>
          )}
        </span>
        <span className="text-sm font-bold text-muted">
          {new Date(match.kickoff).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Side code={match.homeCode} name={match.homeName} flagUrl={match.homeFlag} />
        <ScoreOrVs match={match} />
        <Side code={match.awayCode} name={match.awayName} flagUrl={match.awayFlag} />
      </div>

      {match.status === "scheduled" && (
        <div className="mt-5 flex flex-col items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-wide text-muted">
            Kicks off in
          </span>
          <CountdownTimer target={match.kickoff} />
        </div>
      )}

      {match.stadium && (
        <div className="mt-5 flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-muted">
          <MapPinIcon className="h-4 w-4 shrink-0 text-unity" aria-hidden />
          <span>
            {match.stadium}
            {match.city ? `, ${match.city}` : ""}
          </span>
        </div>
      )}

      {clickable && (
        <p className="mt-4 text-center text-sm font-extrabold text-royal">
          {featured ? "Start the Match Day Journey" : "Explore these countries"} →
        </p>
      )}
    </motion.article>
  );
}

export function MatchDashboard({
  featured,
  source,
}: {
  featured: Featured | null;
  /** Whether the data is live or the last-good real snapshot, for the badge. */
  source?: "live" | "snapshot" | null;
}) {
  if (!featured) {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="kid-card h-64 animate-pulse bg-white/60" />
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
        <p className="mt-1 text-lg font-semibold text-muted">{heading.sub}</p>
        <p className="mt-1 text-base font-bold text-royal">
          {prettyDate(featured.date)}
        </p>
        {source && (
          <span
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
              source === "live"
                ? "bg-cedar-100 text-cedar-700"
                : "bg-line text-muted"
            }`}
            title={
              source === "live"
                ? "Showing real fixtures & scores from the live data source"
                : "The live feed is resting — showing the most recent real scores we saved"
            }
          >
            {source === "live" ? "🟢 Live scores" : "⚪ Recent scores"}
          </span>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {featured.matches.map((m, i) => {
          const curated = Boolean(getTeam(m.homeCode) && getTeam(m.awayCode));
          // The ⭐ Match of the Day is a spotlight only on the real today; on
          // other browsed days every fixture is an equal journey (#30).
          const isMatchOfTheDay = featured.kind === "today" && i === 0;
          const card = (
            <MatchCard match={m} index={i} featured={isMatchOfTheDay} clickable={curated} />
          );
          return curated ? (
            <Link
              key={m.id}
              href={`/journey?home=${m.homeCode}&away=${m.awayCode}`}
              aria-label={`Start the Match Day Journey for ${getTeam(m.homeCode)?.name} versus ${getTeam(m.awayCode)?.name}`}
              className="block rounded-blob"
            >
              {card}
            </Link>
          ) : (
            <div key={m.id}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
