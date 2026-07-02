"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Read-aloud via the browser Web Speech API (ADR-0001).
 *
 * Every Station line must be hearable by a non-reader. We use on-device
 * `speechSynthesis` — zero content cost, no per-line network calls, all 48
 * countries instantly — and degrade gracefully where no voice/API exists.
 *
 * This version fixes the field problems reported in issue #29 ("robotic" and
 * "doesn't always work"), which were the API being mis-driven rather than the
 * API being bad:
 *   - VOICE QUALITY: we now actively select the best available neural voice
 *     (iOS "Siri"/"Enhanced", Android/desktop "Natural"/"Premium") instead of
 *     letting the engine fall back to its robotic default.
 *   - VOICES LOAD LATE: `getVoices()` is empty on first call in many browsers
 *     (notably Chrome/iOS), so the old code set no voice at all. We cache voices
 *     and refresh on `voiceschanged`.
 *   - LONG LINES GET CUT: some engines truncate a long utterance, so we speak
 *     in sentence-sized chunks queued back to back.
 *   - CHROME/iOS PAUSE BUG: playback stalls after ~15s; a periodic `resume()`
 *     keepalive prevents the cut-off.
 */

/** True only in a browser that actually has speech synthesis. */
export function isSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

/** The read-aloud copy is English unless a line carries its own language. */
const DEFAULT_LANG = "en-US";

/**
 * Score a voice for naturalness. Higher is better. The Web Speech API has no
 * quality flag, so we go by the well-known naming conventions platforms use for
 * their good neural voices, and prefer on-device voices (more reliable offline,
 * and the iOS enhanced voices are local).
 */
export function rankVoice(v: SpeechSynthesisVoice): number {
  const name = (v.name ?? "").toLowerCase();
  let score = 0;
  if (/siri|enhanced|premium|neural|natural/.test(name)) score += 100;
  if (/compact|eloquence|espeak/.test(name)) score -= 80; // known low-quality
  if (v.localService) score += 10; // on-device → reliable + usually the good ones
  if (v.default) score += 1;
  return score;
}

/**
 * Pick the best voice for a BCP-47 language: exact-language matches first, then
 * any voice sharing the primary subtag (so "fr" or "es-MX" still find "fr-FR" /
 * "es-ES"), and within that tier the highest-ranked by `rankVoice`. Returns null
 * when nothing fits — the caller sets `lang` anyway and lets the engine choose.
 */
export function chooseVoice(
  voices: SpeechSynthesisVoice[],
  lang: string | undefined,
): SpeechSynthesisVoice | null {
  if (!lang) return null;
  const want = lang.toLowerCase();
  const primary = want.split("-")[0];

  const exact = voices.filter((v) => v.lang.toLowerCase() === want);
  const partial = voices.filter((v) => v.lang.toLowerCase().split("-")[0] === primary);
  const tier = exact.length ? exact : partial;
  if (tier.length === 0) return null;

  return tier.reduce((best, v) => (rankVoice(v) > rankVoice(best) ? v : best));
}

/**
 * Split text into sentence-sized chunks so long lines aren't truncated by the
 * engine, and a runaway chunk is further broken on spaces. Short kid lines pass
 * through as a single chunk.
 */
export function chunkText(text: string, max = 180): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  const chunks: string[] = [];
  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;
    if (s.length <= max) {
      chunks.push(s);
      continue;
    }
    // Overlong sentence: pack words up to `max`.
    let line = "";
    for (const word of s.split(/\s+/)) {
      if ((line + " " + word).trim().length > max) {
        if (line) chunks.push(line.trim());
        line = word;
      } else {
        line = `${line} ${word}`;
      }
    }
    if (line.trim()) chunks.push(line.trim());
  }
  return chunks.length ? chunks : [text.trim()];
}

export interface SpeakOptions {
  /** BCP-47 language for this utterance, e.g. "fr-FR" for "Bonjour!". */
  lang?: string;
  /** Speaking rate; a touch slower by default for little ears. */
  rate?: number;
}

export interface Speaker {
  /** Whether read-aloud is available at all (else hide the audio button). */
  supported: boolean;
  /** Whether something is being spoken right now. */
  speaking: boolean;
  speak: (text: string, opts?: SpeakOptions) => void;
  stop: () => void;
}

export function useSpeak(): Speaker {
  // Resolve support after mount to avoid an SSR/hydration mismatch.
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Voices load asynchronously; keep the latest list in a ref for `speak`.
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  // Keepalive timer that defeats the ~15s pause/cut-off bug.
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isSpeechSupported()) return;
    setSupported(true);

    const synth = window.speechSynthesis;
    const refresh = () => {
      const v = synth.getVoices();
      if (v.length) voicesRef.current = v;
    };
    refresh();
    synth.addEventListener("voiceschanged", refresh);
    return () => synth.removeEventListener("voiceschanged", refresh);
  }, []);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (!isSpeechSupported()) return;
    window.speechSynthesis.cancel();
    stopKeepAlive();
    setSpeaking(false);
  }, [stopKeepAlive]);

  const speak = useCallback(
    (text: string, opts: SpeakOptions = {}) => {
      if (!isSpeechSupported() || !text.trim()) return;
      const synth = window.speechSynthesis;
      synth.cancel(); // a new line stops the previous one
      stopKeepAlive();

      const lang = opts.lang ?? DEFAULT_LANG;
      const voice = chooseVoice(voicesRef.current, lang);
      const chunks = chunkText(text);

      setSpeaking(true);
      // Some engines (Chrome, iOS) stall mid-utterance; nudge them along.
      keepAliveRef.current = setInterval(() => {
        if (synth.speaking && !synth.paused) synth.resume();
      }, 8000);

      chunks.forEach((chunk, i) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = opts.lang ?? voice?.lang ?? lang;
        if (voice) utterance.voice = voice;
        utterance.rate = opts.rate ?? 0.95;
        // Only the final chunk ends the "speaking" state.
        if (i === chunks.length - 1) {
          utterance.onend = () => {
            stopKeepAlive();
            setSpeaking(false);
          };
          utterance.onerror = () => {
            stopKeepAlive();
            setSpeaking(false);
          };
        }
        synth.speak(utterance);
      });
    },
    [stopKeepAlive],
  );

  // Stop speaking on unmount / navigation away.
  useEffect(() => {
    return () => {
      if (isSpeechSupported()) window.speechSynthesis.cancel();
      stopKeepAlive();
    };
  }, [stopKeepAlive]);

  return { supported, speaking, speak, stop };
}
