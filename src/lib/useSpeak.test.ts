import { describe, it, expect } from "vitest";

import { chooseVoice, isSpeechSupported, rankVoice, chunkText } from "./useSpeak";

/** Minimal stand-ins for SpeechSynthesisVoice. */
const voice = (lang: string, name = lang, extra: Partial<SpeechSynthesisVoice> = {}) =>
  ({ lang, name, ...extra }) as SpeechSynthesisVoice;

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

  it("prefers a higher-quality neural voice within the same language", () => {
    const enVoices = [
      voice("en-US", "Alex"),
      voice("en-US", "Samantha (Enhanced)"),
      voice("en-US", "Albert (compact)"),
    ];
    expect(chooseVoice(enVoices, "en-US")?.name).toBe("Samantha (Enhanced)");
  });

  it("still honours the exact-over-partial tier before quality", () => {
    const mixed = [
      voice("en-GB", "Daniel (Enhanced)"), // premium, but wrong region
      voice("en-US", "Alex"), // plain, but exact region
    ];
    // Exact en-US wins the tier even though the en-GB voice scores higher.
    expect(chooseVoice(mixed, "en-US")?.name).toBe("Alex");
  });
});

describe("rankVoice", () => {
  it("scores neural/enhanced voices above plain, and compact below", () => {
    const enhanced = rankVoice(voice("en-US", "Samantha (Enhanced)"));
    const plain = rankVoice(voice("en-US", "Alex"));
    const compact = rankVoice(voice("en-US", "Albert (compact)"));
    expect(enhanced).toBeGreaterThan(plain);
    expect(plain).toBeGreaterThan(compact);
  });

  it("nudges on-device voices ahead of otherwise-equal ones", () => {
    expect(rankVoice(voice("en-US", "Alex", { localService: true }))).toBeGreaterThan(
      rankVoice(voice("en-US", "Alex", { localService: false })),
    );
  });
});

describe("chunkText", () => {
  it("keeps a short line as a single chunk", () => {
    expect(chunkText("Hello there!")).toEqual(["Hello there!"]);
  });

  it("splits multiple sentences so long lines aren't cut off", () => {
    const out = chunkText("France is in Europe. Its flag is blue, white and red. Bonjour!");
    expect(out.length).toBe(3);
    expect(out[0]).toBe("France is in Europe.");
  });

  it("breaks an overlong single sentence on spaces", () => {
    const long = Array.from({ length: 60 }, (_, i) => `word${i}`).join(" ");
    const out = chunkText(long, 40);
    expect(out.length).toBeGreaterThan(1);
    expect(out.every((c) => c.length <= 40)).toBe(true);
  });
});

describe("isSpeechSupported", () => {
  it("is false in a non-browser environment (graceful degradation)", () => {
    // vitest runs in node here — no window/speechSynthesis.
    expect(isSpeechSupported()).toBe(false);
  });
});
