"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { Country } from "@/types";
import { getCountry } from "@/data/countries";
import { getTeam } from "@/data/teams";
import { getWonderPhoto } from "@/data/wonderPhotos";
import { buildJourney, type Station } from "@/lib/journey";
import { browserKeyValue } from "@/lib/storage";
import { createPassportStore } from "@/lib/passport";
import type { StandingRow } from "@/lib/standings";
import { useProfile } from "./Profiles";
import { Flag } from "./Flag";
import { FindItStation, SayHelloStation, WondersStation, type WonderSlot } from "./Stations";
import { MatchMoment } from "./MatchMoment";
import { Standings } from "./Standings";

const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[38vh] min-h-[260px] w-full items-center justify-center rounded-blob bg-royal-50">
      <span className="animate-float text-5xl" aria-hidden>
        🌍
      </span>
    </div>
  ),
});

const STATION_TITLE: Record<Station["kind"], (name: string) => string> = {
  locate: (n) => `Find ${n} on the globe`,
  hello: (n) => `Say hello to ${n}`,
  wonders: (n) => `Wonders of ${n}`,
};

/**
 * The Match Day Journey shell — the Globe always present as the spine, an
 * ordered run of Stations across both Countries, and a finish that drops a
 * Stamp per Country (issue #2). Stations are pleasant stubs here; #7 makes them
 * interactive.
 */
export function Journey({
  homeCode,
  awayCode,
  matchId = `${homeCode}-${awayCode}`,
  kickoff,
  group = "",
  standings = [],
}: {
  homeCode: string;
  awayCode: string;
  /** Stable id used to store the Prediction (per Profile + Match). */
  matchId?: string;
  /** ISO kickoff for the Match moment countdown, if known. */
  kickoff?: string;
  /** Group letter of this fixture (group stage); empty for knockouts. */
  group?: string;
  /** The playing group's standings, derived from real results (issue #31). */
  standings?: StandingRow[];
}) {
  const { activeProfileId, pick } = useProfile();
  const reduce = useReducedMotion();
  const passport = useMemo(() => createPassportStore(browserKeyValue()), []);

  const journey = useMemo(() => buildJourney(homeCode, awayCode), [homeCode, awayCode]);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  // The Country the child last tapped on the globe — drives "Find it".
  const [tappedCode, setTappedCode] = useState<string | null>(null);
  const [activeWonderSlot, setActiveWonderSlot] = useState<WonderSlot>("landmark");

  // A fresh Station starts un-tapped.
  useEffect(() => {
    setTappedCode(null);
    setActiveWonderSlot("landmark");
  }, [step]);

  if (!journey) {
    return (
      <Shell>
        <div className="kid-card mx-auto mt-10 max-w-md p-8 text-center">
          <p className="text-5xl" aria-hidden>🗺️</p>
          <p className="mt-3 text-lg font-extrabold">This journey isn&rsquo;t ready yet.</p>
          <BackToToday />
        </div>
      </Shell>
    );
  }

  // The learning Stations, then one final Match moment step.
  const total = journey.stations.length + 1;
  const isMatchMoment = step === journey.stations.length;
  const station = isMatchMoment ? null : journey.stations[step];
  const country = station ? getCountry(station.countryCode)! : null;
  // Plain const (not a hook) — we're past the early return above.
  const journeyCodes = new Set(journey.countries.map((c) => c.code));

  function finish() {
    if (activeProfileId) {
      for (const c of journey!.countries) passport.earnStamp(activeProfileId, c.code);
    }
    setFinished(true);
  }

  return (
    <Shell>
      <AnimatePresence mode="wait">
        {station?.kind === "wonders" && country ? (
          <motion.div
            key={`${country.code}-wonder-stage`}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          >
            <WonderStage country={country} activeSlot={activeWonderSlot} />
          </motion.div>
        ) : (
          <motion.div
            key="globe-stage"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            className="overflow-hidden rounded-blob shadow-soft ring-1 ring-black/5"
          >
            <WorldMap
              selectedCode={finished || !station ? null : station.countryCode}
              onSelect={setTappedCode}
              earnedCodes={journeyCodes}
              heightClass="h-[38vh] min-h-[260px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {finished ? (
        <FinishCard countries={journey.countries} />
      ) : (
        <>
          {/* Progress */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="font-bold text-muted">
              Step <span className="text-royal">{step + 1}</span> of {total}
            </p>
            <div className="flex gap-1.5" aria-hidden>
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2.5 rounded-full transition-all ${
                    i === step ? "w-6 bg-royal" : i < step ? "w-2.5 bg-cedar" : "w-2.5 bg-line"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Station (or the final Match moment) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={station ? station.id : "match-moment"}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              className="kid-card mt-3 p-5 sm:p-7"
            >
              {station && country ? (
                <>
                  <div className="mb-3 flex items-center gap-2.5">
                    <Flag
                      team={getTeam(country.code)!}
                      size={44}
                      className="!h-[33px] !w-[44px] shrink-0"
                    />
                    <h2 className="text-2xl font-extrabold sm:text-3xl">
                      {STATION_TITLE[station.kind](country.name)}
                    </h2>
                  </div>
                  {station.kind === "locate" && (
                    <FindItStation country={country} found={tappedCode === country.code} />
                  )}
                  {station.kind === "hello" && <SayHelloStation country={country} />}
                  {station.kind === "wonders" && (
                    <WondersStation
                      country={country}
                      pick={pick}
                      activeSlot={activeWonderSlot}
                      onActiveSlotChange={setActiveWonderSlot}
                    />
                  )}
                </>
              ) : (
                <>
                  <h2 className="mb-3 text-center text-2xl font-extrabold sm:text-3xl">
                    Match moment <span aria-hidden>⚽</span>
                  </h2>
                  <MatchMoment
                    home={journey.countries[0]}
                    away={journey.countries[1]}
                    matchId={matchId}
                    kickoff={kickoff}
                  />
                  {group && standings.length > 0 && (
                    <Standings
                      group={group}
                      rows={standings}
                      highlight={[homeCode, awayCode]}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="kid-btn bg-white text-ink ring-1 ring-line disabled:opacity-40"
            >
              ← Back
            </button>
            {step < total - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
                className="kid-btn bg-royal text-white"
              >
                Next →
              </button>
            ) : (
              <button type="button" onClick={finish} className="kid-btn bg-cedar text-white">
                Finish 🎉
              </button>
            )}
          </div>
        </>
      )}
    </Shell>
  );
}

function WonderStage({
  country,
  activeSlot,
}: {
  country: Country;
  activeSlot: WonderSlot;
}) {
  const wonder = country.wonders?.[activeSlot];
  const photo = getWonderPhoto(country.code, activeSlot);

  return (
    <section className="overflow-hidden rounded-blob bg-ink shadow-soft ring-1 ring-black/10">
      <div className="relative flex h-[38vh] min-h-[260px] max-h-[460px] items-end justify-start overflow-hidden">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={photo.file}
            src={`/wonders/${photo.file}`}
            alt={wonder?.name ?? `${country.name} wonder`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-royal-50">
            <span className="text-8xl grayscale" aria-hidden>
              {wonder?.emoji ?? country.flag}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <div className="relative z-10 w-full p-5 text-white sm:p-7">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-extrabold text-ink shadow-card">
            <Flag team={getTeam(country.code)!} size={26} className="!h-[19px] !w-[26px]" />
            {country.name}
          </div>
          <h2 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-5xl">
            {wonder?.name ?? "Wonder"}
          </h2>
          <p className="mt-2 max-w-xl text-sm font-bold text-white/85 sm:text-base">
            {photo
              ? `${photo.author} · ${photo.license}`
              : "Picture coming soon. The journey still works with the emoji fallback."}
          </p>
        </div>
      </div>
    </section>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 pb-16 pt-5">
      <header className="mb-4 flex items-center justify-between gap-3">
        <BackToToday />
        <h1 className="text-[clamp(1.25rem,5vw,1.75rem)] font-extrabold">
          Match Day Journey <span aria-hidden>🌍</span>
        </h1>
        <span className="w-16" aria-hidden />
      </header>
      {children}
    </div>
  );
}

function BackToToday() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 font-extrabold text-ink shadow-card ring-1 ring-line hover:text-royal"
    >
      <span aria-hidden>←</span> Today
    </Link>
  );
}

function FinishCard({ countries }: { countries: Country[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="kid-card mt-5 flex flex-col items-center gap-3 p-8 text-center"
    >
      <span className="text-6xl" aria-hidden>🎉</span>
      <h2 className="text-2xl font-extrabold sm:text-3xl">Journey complete!</h2>
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-lg font-semibold text-muted">
        You explored
        {countries.map((c, i) => (
          <span key={c.code} className="inline-flex items-center gap-1.5 font-extrabold text-ink">
            <Flag team={getTeam(c.code)!} size={28} className="!h-[21px] !w-[28px]" />
            {c.name}
            {i === 0 ? " and" : ""}
          </span>
        ))}
      </p>
      <p className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-2 font-extrabold text-gold-700">
        <span aria-hidden>🛂</span> 2 new stamps in your Passport!
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/world" className="kid-btn bg-royal text-white">
          See your World 🌍
        </Link>
        <Link href="/" className="kid-btn bg-white text-ink ring-1 ring-line">
          Back to Today
        </Link>
      </div>
    </motion.div>
  );
}
