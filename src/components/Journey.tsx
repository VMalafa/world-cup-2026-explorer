"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { Country } from "@/types";
import { getCountry } from "@/data/countries";
import { getTeam } from "@/data/teams";
import { buildJourney, type Station } from "@/lib/journey";
import { browserKeyValue } from "@/lib/storage";
import { createPassportStore } from "@/lib/passport";
import { useProfile } from "./Profiles";
import { Flag } from "./Flag";
import { FindItStation, SayHelloStation, WondersStation } from "./Stations";

const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[44vh] min-h-[280px] w-full items-center justify-center rounded-blob bg-royal-50">
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
export function Journey({ homeCode, awayCode }: { homeCode: string; awayCode: string }) {
  const { activeProfileId, pick } = useProfile();
  const reduce = useReducedMotion();
  const passport = useMemo(() => createPassportStore(browserKeyValue()), []);

  const journey = useMemo(() => buildJourney(homeCode, awayCode), [homeCode, awayCode]);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  // The Country the child last tapped on the globe — drives "Find it".
  const [tappedCode, setTappedCode] = useState<string | null>(null);

  // A fresh Station starts un-tapped.
  useEffect(() => setTappedCode(null), [step]);

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

  const total = journey.stations.length;
  const station = journey.stations[step];
  const country = getCountry(station.countryCode)!;
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
      {/* Globe spine — always present, focused on the current Country */}
      <div className="overflow-hidden rounded-blob shadow-soft ring-1 ring-black/5">
        <WorldMap
          selectedCode={finished ? null : station.countryCode}
          onSelect={setTappedCode}
          earnedCodes={journeyCodes}
        />
      </div>

      {finished ? (
        <FinishCard countries={journey.countries} />
      ) : (
        <>
          {/* Progress */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="font-bold text-muted">
              Step <span className="text-royal">{step + 1}</span> of {total}
            </p>
            <div className="flex gap-1.5" aria-hidden>
              {journey.stations.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-2.5 rounded-full transition-all ${
                    i === step ? "w-6 bg-royal" : i < step ? "w-2.5 bg-cedar" : "w-2.5 bg-line"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Station */}
          <AnimatePresence mode="wait">
            <motion.div
              key={station.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              className="kid-card mt-3 p-5 sm:p-7"
            >
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
              {station.kind === "wonders" && <WondersStation country={country} pick={pick} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-between gap-3">
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
