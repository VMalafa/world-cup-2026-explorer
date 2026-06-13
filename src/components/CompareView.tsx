"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MagnifyingGlassPlusIcon,
  XMarkIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/solid";
import {
  TEAMS,
  getTeam,
  CONTINENT_LABEL,
  CONTINENT_COLOR,
} from "@/data/teams";
import type { Team } from "@/types";
import { useReadingLevel } from "./ReadingLevel";
import { ReadingLevelToggle } from "./ReadingLevelToggle";
import { Flag } from "./Flag";

function ContinentBadge({ team }: { team: Team }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold text-white shadow-sm"
      style={{ backgroundColor: CONTINENT_COLOR[team.continent] }}
    >
      🌍 {CONTINENT_LABEL[team.continent]}
    </span>
  );
}

function TeamPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (code: string) => void;
  label: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-full border-4 border-white bg-white/90 px-4 py-2 text-center text-lg font-extrabold shadow-soft focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky"
      >
        {TEAMS.map((t) => (
          <option key={t.code} value={t.code}>
            {t.flag} {t.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function CompareColumn({
  team,
  onZoom,
}: {
  team: Team;
  onZoom: (t: Team) => void;
}) {
  const { pick } = useReadingLevel();
  return (
    <motion.div
      layout
      className="kid-card flex flex-col items-center gap-3 p-5 text-center"
      style={{ boxShadow: `0 12px 30px -12px ${CONTINENT_COLOR[team.continent]}` }}
    >
      <Flag team={team} size={120} className="!h-[90px] !w-[120px]" />
      <h3 className="text-2xl font-extrabold">{team.name}</h3>
      <p className="text-lg font-bold text-slate-500">{team.hello}</p>

      <dl className="grid w-full grid-cols-1 gap-2 text-left">
        <div className="rounded-2xl bg-slate-50 px-4 py-2">
          <dt className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Capital city
          </dt>
          <dd className="text-lg font-bold">🏙️ {team.capital}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-2">
          <dt className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Continent
          </dt>
          <dd className="mt-1">
            <ContinentBadge team={team} />
          </dd>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-2">
          <dt className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Fun fact
          </dt>
          <dd className="text-base font-semibold leading-snug">
            {pick(team.funFacts[0])}
          </dd>
        </div>
      </dl>

      <button
        onClick={() => onZoom(team)}
        className="kid-btn mt-1 bg-sky text-white outline-sky"
      >
        <MagnifyingGlassPlusIcon className="h-5 w-5" aria-hidden /> Zoom in
      </button>
    </motion.div>
  );
}

function ZoomModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const { pick } = useReadingLevel();
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`More about ${team.name}`}
    >
      <motion.div
        className="kid-card relative max-h-[88vh] w-full max-w-lg overflow-y-auto p-6 text-center sm:p-8"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `8px solid ${CONTINENT_COLOR[team.continent]}` }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
        >
          <XMarkIcon className="h-6 w-6" aria-hidden />
        </button>

        <motion.div
          initial={{ scale: 0.4, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
          className="mx-auto w-fit"
        >
          <Flag team={team} size={200} className="!h-[150px] !w-[200px]" />
        </motion.div>

        <h3 className="mt-4 text-3xl font-extrabold">
          {team.flag} {team.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <ContinentBadge team={team} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-extrabold text-slate-600">
            🏙️ {team.capital}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-extrabold text-slate-600">
            🏆 Group {team.group}
          </span>
        </div>
        <p className="mt-3 text-lg font-bold text-slate-500">
          They say hello like this: <span className="text-sky-600">{team.hello}</span>
        </p>

        <ul className="mt-5 space-y-3 text-left">
          {team.funFacts.map((f, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="flex gap-3 rounded-2xl bg-slate-50 p-3"
            >
              <span className="text-2xl" aria-hidden>
                ✨
              </span>
              <span className="text-base font-semibold leading-snug">
                {pick(f)}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export function CompareView({
  defaultLeft = "BRA",
  defaultRight = "FRA",
}: {
  defaultLeft?: string;
  defaultRight?: string;
}) {
  const [left, setLeft] = useState(defaultLeft);
  const [right, setRight] = useState(defaultRight);
  const [zoom, setZoom] = useState<Team | null>(null);

  // Follow the featured match when the parent provides new defaults.
  useEffect(() => setLeft(defaultLeft), [defaultLeft]);
  useEffect(() => setRight(defaultRight), [defaultRight]);

  const leftTeam = getTeam(left)!;
  const rightTeam = getTeam(right)!;

  const swap = () => {
    setLeft(right);
    setRight(left);
  };

  return (
    <section aria-labelledby="compare-heading">
      <div className="mb-5 text-center">
        <h2 id="compare-heading" className="text-3xl font-extrabold sm:text-4xl">
          Compare Countries 🔍
        </h2>
        <p className="mt-1 text-lg font-semibold text-slate-600">
          Pick two countries and see how they match up!
        </p>
        <div className="mt-3 flex justify-center">
          <ReadingLevelToggle compact />
        </div>
      </div>

      <div className="mx-auto grid max-w-3xl items-start gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <TeamPicker value={left} onChange={setLeft} label="Choose the first country" />
          <CompareColumn team={leftTeam} onZoom={setZoom} />
        </div>

        <div className="flex justify-center sm:pt-2">
          <button
            onClick={swap}
            aria-label="Swap countries"
            className="kid-btn bg-bubble text-white outline-bubble"
          >
            <ArrowsRightLeftIcon className="h-6 w-6" aria-hidden />
          </button>
        </div>

        <div className="space-y-3">
          <TeamPicker value={right} onChange={setRight} label="Choose the second country" />
          <CompareColumn team={rightTeam} onZoom={setZoom} />
        </div>
      </div>

      <AnimatePresence>
        {zoom && <ZoomModal team={zoom} onClose={() => setZoom(null)} />}
      </AnimatePresence>
    </section>
  );
}
