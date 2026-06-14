"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { storiesForMatch } from "@/data/players";
import { getTeam } from "@/data/teams";
import { useReadingLevel } from "./ReadingLevel";
import type { PlayerStory } from "@/types";

const CARD_TILTS = [-4, 3, -2, 5, -3, 2, 4, -5];

function StoryCard({
  story,
  index,
  constraints,
  onOpen,
}: {
  story: PlayerStory;
  index: number;
  constraints: React.RefObject<HTMLDivElement>;
  onOpen: (s: PlayerStory) => void;
}) {
  const { pick } = useReadingLevel();
  const team = getTeam(story.teamCode);
  const [dragging, setDragging] = useState(false);

  return (
    <motion.button
      type="button"
      drag
      dragConstraints={constraints}
      dragElastic={0.35}
      dragSnapToOrigin
      onDragStart={() => setDragging(true)}
      // Delay clearing so the click that ends a drag doesn't open the card.
      onDragEnd={() => setTimeout(() => setDragging(false), 50)}
      onClick={() => !dragging && onOpen(story)}
      whileHover={{ scale: 1.04, rotate: 0 }}
      whileDrag={{ scale: 1.12, rotate: 0, zIndex: 50, cursor: "grabbing" }}
      initial={{ opacity: 0, y: 30, rotate: CARD_TILTS[index % CARD_TILTS.length] }}
      animate={{ opacity: 1, y: 0, rotate: CARD_TILTS[index % CARD_TILTS.length] }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 240, damping: 20 }}
      className="kid-card relative flex w-full cursor-grab touch-none flex-col items-center gap-2 p-5 text-center active:cursor-grabbing"
      aria-label={`Open story about ${story.name}`}
    >
      <span className="text-5xl" aria-hidden>
        {story.emoji}
      </span>
      <span className="text-lg font-extrabold leading-tight">{story.name}</span>
      <span className="flex items-center gap-1 text-sm font-semibold text-muted">
        <span aria-hidden>{team?.flag}</span> {story.position}
      </span>
      <p className="text-sm font-semibold text-muted">{pick(story.hook)}</p>
      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1 text-xs font-extrabold text-gold-700">
        <SparklesIcon className="h-3.5 w-3.5" aria-hidden /> Tap to read
      </span>
    </motion.button>
  );
}

function StoryModal({
  story,
  onClose,
}: {
  story: PlayerStory;
  onClose: () => void;
}) {
  const { pick } = useReadingLevel();
  const team = getTeam(story.teamCode);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Story about ${story.name}`}
    >
      <motion.div
        className="kid-card relative max-h-[88vh] w-full max-w-lg overflow-y-auto p-6 sm:p-8"
        initial={{ scale: 0.8, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close story"
          className="absolute right-3 top-3 rounded-full bg-canvas p-2 text-muted hover:bg-line"
        >
          <XMarkIcon className="h-6 w-6" aria-hidden />
        </button>

        <div className="flex flex-col items-center gap-2 text-center">
          <motion.span
            className="text-7xl"
            aria-hidden
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
          >
            {story.emoji}
          </motion.span>
          <h3 className="text-2xl font-extrabold">{story.name}</h3>
          <p className="flex items-center gap-1.5 font-semibold text-muted">
            <span aria-hidden className="text-xl">
              {team?.flag}
            </span>
            {team?.name} · {story.position}
          </p>
        </div>

        <motion.p
          className="mt-5 text-pretty text-lg font-semibold leading-relaxed text-ink"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          {pick(story.story)}
        </motion.p>

        <motion.div
          className="mt-5 rounded-blob bg-gold-50 p-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 240, damping: 20 }}
        >
          <p className="text-sm font-extrabold uppercase tracking-wide text-gold-700">
            ⭐ The big idea
          </p>
          <p className="mt-1 text-lg font-bold text-ink">
            {pick(story.lesson)}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function PlayerStoryCards({
  homeCode,
  awayCode,
}: {
  homeCode?: string;
  awayCode?: string;
}) {
  const area = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<PlayerStory | null>(null);
  const stories = storiesForMatch(homeCode ?? "", awayCode ?? "");

  return (
    <section aria-labelledby="stories-heading">
      <div className="mb-4 text-center">
        <h2 id="stories-heading" className="text-3xl font-extrabold sm:text-4xl">
          Hero Stories 🌟
        </h2>
        <p className="mt-1 text-lg font-semibold text-muted">
          Drag the cards around. Tap one to hear a true story!
        </p>
      </div>

      <div
        ref={area}
        className="relative grid grid-cols-2 gap-4 rounded-blob bg-white/50 ring-1 ring-line p-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {stories.map((s, i) => (
          <StoryCard
            key={s.id}
            story={s}
            index={i}
            constraints={area}
            onOpen={setOpen}
          />
        ))}
      </div>

      <AnimatePresence>
        {open && <StoryModal story={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
