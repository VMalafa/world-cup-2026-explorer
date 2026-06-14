"use client";

import { useSpeak, type SpeakOptions } from "@/lib/useSpeak";

/**
 * The audio affordance: a round 🔊 button that reads `text` aloud (tap again to
 * stop). Renders nothing when speech isn't available, so the surrounding text
 * still shows and nothing breaks (ADR-0001 graceful degradation).
 */
export function SpeakButton({
  text,
  lang,
  label = "Read aloud",
  className = "",
}: {
  text: string;
  lang?: SpeakOptions["lang"];
  label?: string;
  className?: string;
}) {
  const { supported, speaking, speak, stop } = useSpeak();
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => (speaking ? stop() : speak(text, { lang }))}
      aria-label={speaking ? "Stop reading" : label}
      aria-pressed={speaking}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-royal-50 text-lg text-royal ring-1 ring-royal-100 transition-colors hover:bg-royal-100 ${
        speaking ? "animate-pulse" : ""
      } ${className}`}
    >
      <span aria-hidden>{speaking ? "⏸️" : "🔊"}</span>
    </button>
  );
}
