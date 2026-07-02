"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { COUNTRIES, getCountry } from "@/data/countries";
import { CONTINENT_COLOR, CONTINENT_LABEL, getTeam } from "@/data/teams";
import { langFor } from "@/data/languages";
import { browserKeyValue } from "@/lib/storage";
import { createPassportStore, type Stamp } from "@/lib/passport";
import { useSpeak } from "@/lib/useSpeak";
import { useProfile } from "./Profiles";
import { ProfileChip } from "./ProfileChip";
import { Flag } from "./Flag";
import { SpeakButton } from "./SpeakButton";
import { SurfaceNav } from "./SurfaceNav";

// Leaflet touches `window`; load the Globe only on the client.
const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] min-h-[360px] w-full items-center justify-center rounded-blob bg-royal-50">
      <div className="flex flex-col items-center gap-3 text-royal">
        <span className="animate-float text-5xl" aria-hidden>
          🌍
        </span>
        <span className="font-extrabold">Loading the world…</span>
      </div>
    </div>
  ),
});

const TOTAL = COUNTRIES.length;

/**
 * The **World** surface (CONTEXT.md): the free-explore Globe plus the child's
 * **Passport** of collected **Stamps**. Browse-only — Stamps are earned by
 * *learning* in a Match Day Journey, never here. Per active Profile, on-device.
 */
export function WorldView() {
  const { activeProfile, activeProfileId, hydrated } = useProfile();
  const reduce = useReducedMotion();
  const { speak } = useSpeak();

  const passport = useMemo(() => createPassportStore(browserKeyValue()), []);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  // Read this profile's Passport once we know who's exploring.
  useEffect(() => {
    if (!hydrated || !activeProfileId) return;
    setStamps(passport.listStamps(activeProfileId));
  }, [hydrated, activeProfileId, passport]);

  const earnedCodes = useMemo(
    () => new Set(stamps.map((s) => s.countryCode)),
    [stamps],
  );
  const selectedCountry = selected ? getCountry(selected) : null;
  // Show most-recently earned first in the Passport grid.
  const recent = useMemo(() => [...stamps].reverse(), [stamps]);

  /**
   * A Globe tap says the tapped Country's name aloud, so a pre-reader can hear
   * what every country is called (#59). Repeated taps re-speak; where speech
   * is unavailable the tap still selects (useSpeak no-ops silently).
   */
  function handleGlobeTap(code: string) {
    setSelected(code);
    const name = getCountry(code)?.name;
    if (name) speak(`${name}!`);
  }

  if (hydrated && !activeProfile) return null; // first-run gate covers this

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pb-28 pt-5">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[clamp(1.5rem,7vw,2rem)] font-extrabold">
          <span className="text-royal">{activeProfile?.name}&rsquo;s</span> World{" "}
          <span aria-hidden>🌍</span>
        </h1>
        <ProfileChip />
      </header>

      {/* Passport */}
      <section aria-labelledby="passport-heading" className="mb-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 id="passport-heading" className="text-2xl font-extrabold sm:text-3xl">
            <span aria-hidden>🛂</span> Passport
          </h2>
          <p className="font-bold text-muted">
            <span className="text-royal">{stamps.length}</span> of {TOTAL} countries
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-royal-50"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-valuenow={stamps.length}
          aria-label={`${stamps.length} of ${TOTAL} countries explored`}
        >
          <motion.div
            className="unity-ribbon h-full rounded-full"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${(stamps.length / TOTAL) * 100}%` }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>

        {stamps.length === 0 ? (
          <div className="kid-card mt-4 flex flex-col items-center gap-2 px-6 py-8 text-center">
            <span className="text-5xl" aria-hidden>
              🛂
            </span>
            <p className="text-lg font-extrabold text-ink">
              Your passport is empty — for now!
            </p>
            <p className="max-w-sm font-semibold text-muted">
              Finish a Match Day Journey to earn your first stamp and start
              collecting the world.
            </p>
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {recent.map((s, i) => {
              const c = getCountry(s.countryCode);
              if (!c) return null;
              return (
                <li key={s.countryCode}>
                  <motion.button
                    type="button"
                    onClick={() => setSelected(s.countryCode)}
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={reduce ? { duration: 0 } : { delay: Math.min(i * 0.03, 0.4) }}
                    aria-label={`${c.name} — stamp earned`}
                    className="kid-card flex w-full flex-col items-center gap-1.5 px-2 py-3"
                    style={{ boxShadow: `inset 0 0 0 2px ${CONTINENT_COLOR[c.continent]}33` }}
                  >
                    <Flag team={getTeam(c.code)!} size={64} className="!h-[39px] !w-[52px]" />
                    <span className="text-center text-xs font-extrabold leading-tight text-ink">
                      {c.name}
                    </span>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Globe — free explore; earned countries wear a gold ring */}
      <section aria-labelledby="globe-heading" className="flex-1">
        <h2 id="globe-heading" className="mb-3 text-2xl font-extrabold sm:text-3xl">
          <span aria-hidden>🗺️</span> Explore the Globe
        </h2>
        <div className="overflow-hidden rounded-blob shadow-soft ring-1 ring-black/5">
          <WorldMap
            selectedCode={selected}
            onSelect={handleGlobeTap}
            earnedCodes={earnedCodes}
          />
        </div>

        <AnimatePresence mode="wait">
          {selectedCountry && (
            <motion.div
              key={selectedCountry.code}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              className="kid-card mx-auto mt-4 flex max-w-xl items-center gap-4 p-5"
            >
              <Flag
                team={getTeam(selectedCountry.code)!}
                size={96}
                className="!h-[72px] !w-[96px] shrink-0"
              />
              <div className="text-left">
                <h3 className="flex items-center gap-2 text-2xl font-extrabold">
                  {selectedCountry.name}
                  {earnedCodes.has(selectedCountry.code) && (
                    <span title="Stamp earned" aria-label="Stamp earned">
                      ✅
                    </span>
                  )}
                </h3>
                <p className="font-semibold text-muted">
                  🏙️ {selectedCountry.capital} ·{" "}
                  {CONTINENT_LABEL[selectedCountry.continent]}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SpeakButton
                    text={`${selectedCountry.name}. Its capital city is ${selectedCountry.capital}.`}
                    label={`Hear about ${selectedCountry.name}`}
                  />
                  {selectedCountry.hello && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-royal-50 px-3 py-1 font-extrabold text-ink">
                      <span aria-hidden>🗣️</span> {selectedCountry.hello}
                      <SpeakButton
                        text={selectedCountry.hello}
                        lang={langFor(selectedCountry.code)}
                        label={`Say hello the ${selectedCountry.name} way`}
                        className="!h-7 !w-7 !text-base"
                      />
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <SurfaceNav />
    </div>
  );
}
