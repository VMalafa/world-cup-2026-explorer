"use client";

import { useEffect, type ElementType } from "react";

import { useSpeak, type SpeakOptions } from "@/lib/useSpeak";

/**
 * A line of journey text paired with its audio affordance. Every line is
 * tappable to hear it; pass `autoRead` (for the youngest) to have it read itself
 * aloud when it appears. Falls back to plain text when speech is unavailable.
 */
export function SpeakableText({
  text,
  speakText,
  lang,
  autoRead = false,
  as: Tag = "p",
  className = "",
  textClassName = "",
}: {
  text: string;
  /**
   * What to read aloud, when it should differ from what's shown. Lets a card
   * display just the blurb but speak "Name. Blurb" so a non-reader hears the
   * subject before its description (issue #46). Defaults to `text`.
   */
  speakText?: string;
  lang?: SpeakOptions["lang"];
  /** Read aloud automatically when shown — for non-readers. */
  autoRead?: boolean;
  as?: ElementType;
  className?: string;
  textClassName?: string;
}) {
  const { supported, speaking, speak, stop } = useSpeak();
  const spoken = speakText ?? text;

  useEffect(() => {
    if (supported && autoRead) speak(spoken, { lang });
    // Re-read whenever the spoken line itself changes.
  }, [supported, autoRead, spoken, lang, speak]);

  return (
    <Tag className={`flex items-center gap-2 ${className}`}>
      <span className={textClassName}>{text}</span>
      {supported && (
        <button
          type="button"
          onClick={() => (speaking ? stop() : speak(spoken, { lang }))}
          aria-label={speaking ? "Stop reading" : "Read aloud"}
          aria-pressed={speaking}
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-royal-50 text-lg text-royal ring-1 ring-royal-100 transition-colors hover:bg-royal-100 ${
            speaking ? "animate-pulse" : ""
          }`}
        >
          <span aria-hidden>{speaking ? "⏸️" : "🔊"}</span>
        </button>
      )}
    </Tag>
  );
}
