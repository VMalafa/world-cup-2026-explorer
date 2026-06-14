"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Read-aloud via the browser Web Speech API (ADR-0001).
 *
 * Every Station line must be hearable by a non-reader. We use on-device
 * `speechSynthesis` — zero content cost, no per-line network calls, all 48
 * countries instantly — and degrade gracefully where no voice/API exists.
 */

/** True only in a browser that actually has speech synthesis. */
export function isSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

/**
 * Pick the best voice for a BCP-47 language: an exact match first, then any
 * voice sharing the primary subtag (so "fr" or "es-MX" still find "fr-FR" /
 * "es-ES"). Returns null when nothing fits — the caller sets `lang` anyway and
 * lets the engine choose, or simply reads in the default voice.
 */
export function chooseVoice(
  voices: SpeechSynthesisVoice[],
  lang: string | undefined,
): SpeechSynthesisVoice | null {
  if (!lang) return null;
  const want = lang.toLowerCase();
  const primary = want.split("-")[0];
  return (
    voices.find((v) => v.lang.toLowerCase() === want) ??
    voices.find((v) => v.lang.toLowerCase().split("-")[0] === primary) ??
    null
  );
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

  useEffect(() => {
    setSupported(isSpeechSupported());
  }, []);

  const stop = useCallback(() => {
    if (!isSpeechSupported()) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, opts: SpeakOptions = {}) => {
    if (!isSpeechSupported() || !text.trim()) return;
    const synth = window.speechSynthesis;
    synth.cancel(); // a new line stops the previous one

    const utterance = new SpeechSynthesisUtterance(text);
    if (opts.lang) utterance.lang = opts.lang;
    const voice = chooseVoice(synth.getVoices(), opts.lang);
    if (voice) utterance.voice = voice;
    utterance.rate = opts.rate ?? 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    synth.speak(utterance);
  }, []);

  // Stop speaking on unmount / navigation away.
  useEffect(() => {
    return () => {
      if (isSpeechSupported()) window.speechSynthesis.cancel();
    };
  }, []);

  return { supported, speaking, speak, stop };
}
