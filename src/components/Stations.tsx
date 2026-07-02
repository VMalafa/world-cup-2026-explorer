"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import type { Country, DualText, Wonder } from "@/types";
import { CONTINENT_LABEL } from "@/data/teams";
import { langFor } from "@/data/languages";
import { geographyFor, type Compass } from "@/lib/geography";
import { getWonderPhoto } from "@/data/wonderPhotos";
import type { WonderPhoto } from "@/lib/wikimedia";
import { SpeakableText } from "./SpeakableText";
import { ConfirmBadge } from "./ConfirmBadge";

const COMPASS_WORD: Record<Compass, string> = {
  N: "north", NE: "north-east", E: "east", SE: "south-east",
  S: "south", SW: "south-west", W: "west", NW: "north-west",
};

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export type WonderSlot = "landmark" | "animal" | "food";

/**
 * Find it — the globe has flown to the Country; the child taps its dot. On a
 * correct tap we reveal where it sits absolutely (continent + ocean) and
 * relative to all four Homelands ("how far from home"). All derived (#3).
 */
export function FindItStation({ country, found }: { country: Country; found: boolean }) {
  const geo = geographyFor(country);

  if (!found) {
    return (
      <div className="text-center">
        <SpeakableText
          as="div"
          autoRead
          text={`Can you find ${country.name}? Tap its glowing dot on the globe!`}
          className="justify-center"
          textClassName="text-lg font-extrabold text-ink"
        />
        <p className="mt-2 text-base font-semibold text-muted">
          <span aria-hidden>🔎</span> Look for the gold ring up on the globe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <ConfirmBadge label="You found it!" tone="cedar" />
        <span aria-hidden className="text-2xl">🎉</span>
      </div>
      <SpeakableText
        autoRead
        text={`You found ${country.name}!`}
        textClassName="text-lg font-extrabold text-cedar-700"
      />
      <SpeakableText
        text={`It sits in ${CONTINENT_LABEL[country.continent]}, near the ${capitalize(geo.ocean)} Ocean.`}
        textClassName="font-semibold text-ink"
      />
      <div>
        <p className="mb-1.5 text-sm font-extrabold uppercase tracking-wide text-muted">
          How far from home?
        </p>
        <ul className="space-y-1.5">
          {geo.fromHomelands.map((b) => (
            <li key={b.homeland.code}>
              <SpeakableText
                text={
                  b.km === 0
                    ? `${b.homeland.name} — this is home!`
                    : `${b.km.toLocaleString()} kilometres ${COMPASS_WORD[b.compass]} of ${b.homeland.name}.`
                }
                textClassName="font-semibold text-ink"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Say hello — hear the greeting in the Country's own language (#6), tap to
 * repeat, then "your turn!".
 */
export function SayHelloStation({ country }: { country: Country }) {
  const hello = country.hello ?? "Hello!";
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <SpeakableText
        autoRead
        text={hello}
        lang={langFor(country.code)}
        className="justify-center"
        textClassName="text-3xl font-extrabold text-ink sm:text-4xl"
      />
      <p className="font-semibold text-muted">
        That&rsquo;s how you say hello in {country.name}. Tap <span aria-hidden>🔊</span> to hear it again.
      </p>
      <p className="mt-1 rounded-full bg-gold-100 px-4 py-2 font-extrabold text-gold-700">
        <span aria-hidden>🗣️</span> Now your turn — say it out loud!
      </p>
    </div>
  );
}

/** Wonders — three tap-to-reveal cards (landmark / animal / food), read aloud. */
export function WondersStation({
  country,
  pick,
  activeSlot = "landmark",
  onActiveSlotChange,
}: {
  country: Country;
  pick: (t: DualText) => string;
  activeSlot?: WonderSlot;
  onActiveSlotChange?: (slot: WonderSlot) => void;
}) {
  if (!country.wonders) {
    return (
      <SpeakableText
        autoRead
        text={`We're still gathering the wonders of ${country.name} — come back soon!`}
        textClassName="text-lg font-semibold text-ink"
      />
    );
  }
  const slots = [
    { slot: "landmark", wonder: country.wonders.landmark },
    { slot: "animal", wonder: country.wonders.animal },
    { slot: "food", wonder: country.wonders.food },
  ] as const;
  return (
    <div className="space-y-3">
      <p className="text-center font-semibold text-muted">
        Tap each card to discover a wonder of {country.name}!
      </p>
      <ul className="space-y-3">
        {slots.map(({ slot, wonder }) => (
          <li key={wonder.name}>
            <WonderCard
              wonder={wonder}
              code={country.code}
              slot={slot}
              pick={pick}
              active={activeSlot === slot}
              onActivate={() => onActiveSlotChange?.(slot)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function WonderCard({
  wonder,
  code,
  slot,
  pick,
  active,
  onActivate,
}: {
  wonder: Wonder;
  code: string;
  slot: WonderSlot;
  pick: (t: DualText) => string;
  active: boolean;
  onActivate: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const reduce = useReducedMotion();
  const photo = getWonderPhoto(code, slot);

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => {
          onActivate();
          setRevealed(true);
        }}
        className={`flex w-full items-center gap-3 rounded-blob px-4 py-5 text-left ring-1 transition-transform hover:-translate-y-0.5 ${
          active ? "bg-gold-100 ring-gold-300" : "bg-royal-50 ring-royal-100"
        }`}
      >
        <span className="text-4xl grayscale" aria-hidden>{wonder.emoji}</span>
        <span className="text-lg font-extrabold text-royal">Tap to discover ✨</span>
      </button>
    );
  }

  return (
    <motion.div
      initial={reduce ? false : { rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
      onClick={onActivate}
      className={`kid-card flex cursor-pointer flex-col gap-3 p-4 transition ${
        active ? "ring-2 ring-gold-300" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <WonderArt photo={photo} emoji={wonder.emoji} name={wonder.name} />
        <div>
          <p className="font-extrabold text-ink">{wonder.name}</p>
          <SpeakableText
            autoRead
            text={pick(wonder.blurb)}
            // Speak the wonder's name before its description so a non-reader
            // hears what they're exploring first (issue #46).
            speakText={`${wonder.name}. ${pick(wonder.blurb)}`}
            textClassName="font-semibold text-muted"
          />
        </div>
      </div>
      {photo && <PhotoCredit photo={photo} />}
    </motion.div>
  );
}

/**
 * The required CC attribution for a real photo (ADR-0007 / issue #28), plus a
 * parent-facing "Learn more" link to the source. The link is deliberately small
 * and muted — not a primary kid button — because the users are 4 and 6 and must
 * not free-roam the open web.
 */
function PhotoCredit({ photo }: { photo: WonderPhoto }) {
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-[0.7rem] leading-snug text-muted">
      <span>
        Photo: {photo.author} · {photo.license}
      </span>
      {photo.sourceUrl && (
        <a
          href={photo.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          // Parent affordance: opens Wikimedia in a new tab, away from the journey.
          className="font-bold text-royal underline decoration-dotted underline-offset-2"
        >
          Learn more ↗
        </a>
      )}
    </p>
  );
}

/**
 * A wonder's real photo (ADR-0007 / issue #28), loaded from `public/wonders`
 * using the committed attribution manifest. Until a photo is sourced — or if it
 * fails to load — this gracefully falls back to the wonder's emoji, so the
 * journey is never broken by a missing image (Design Principle 3).
 */
function WonderArt({
  photo,
  emoji,
  name,
}: {
  photo: WonderPhoto | undefined;
  emoji: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!photo || failed) {
    return <span className="text-4xl" aria-hidden>{emoji}</span>;
  }
  return (
    // A plain <img> keeps this offline-friendly: the committed photo appears,
    // and onError swaps in the emoji. No optimizer round-trip needed.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/wonders/${photo.file}`}
      alt={name}
      width={64}
      height={64}
      className="h-16 w-16 shrink-0 rounded-blob object-cover ring-1 ring-line"
      onError={() => setFailed(true)}
    />
  );
}
