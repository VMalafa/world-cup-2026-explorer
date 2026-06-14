import { describe, it, expect } from "vitest";

import { chooseVoice, isSpeechSupported } from "./useSpeak";

/** Minimal stand-ins for SpeechSynthesisVoice. */
const voice = (lang: string, name = lang) => ({ lang, name }) as SpeechSynthesisVoice;

describe("chooseVoice", () => {
  const voices = [voice("en-US"), voice("fr-FR"), voice("ja-JP"), voice("es-ES")];

  it("returns null when no language is requested", () => {
    expect(chooseVoice(voices, undefined)).toBeNull();
  });

  it("prefers an exact language match (case-insensitive)", () => {
    expect(chooseVoice(voices, "fr-FR")?.lang).toBe("fr-FR");
    expect(chooseVoice(voices, "JA-jp")?.lang).toBe("ja-JP");
  });

  it("falls back to a primary-subtag match (fr → fr-FR)", () => {
    expect(chooseVoice(voices, "fr")?.lang).toBe("fr-FR");
    expect(chooseVoice(voices, "es-MX")?.lang).toBe("es-ES");
  });

  it("returns null when no voice fits the language", () => {
    expect(chooseVoice(voices, "sw-KE")).toBeNull();
  });
});

describe("isSpeechSupported", () => {
  it("is false in a non-browser environment (graceful degradation)", () => {
    // vitest runs in node here — no window/speechSynthesis.
    expect(isSpeechSupported()).toBe(false);
  });
});
