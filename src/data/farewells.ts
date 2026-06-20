import { langFor } from "./languages";

/**
 * The Send-off (CONTEXT.md): a warm "Goodbye and good luck!" played after a
 * child makes a Prediction, in the picked Team's own language (issue #47).
 *
 * Like the `hello` greetings, these are short, verifiable reference phrases —
 * not authored prose — so they aren't Guardian-gated. Each carries the native
 * line (for read-aloud in the Team's language via `langFor`) and an English
 * `gloss` always shown alongside, so a pre-reader's parent always understands it.
 *
 * Keyed by the primary language subtag (the part before the "-" in the BCP-47
 * tag). A language we can't confidently translate falls back to a friendly
 * English send-off — never a guessed phrase.
 */
export interface Farewell {
  /** The send-off in the language itself, read aloud. */
  native: string;
  /** Plain-English meaning, always shown. Equals `native` for English. */
  gloss: string;
}

const ENGLISH: Farewell = { native: "Goodbye and good luck!", gloss: "Goodbye and good luck!" };

const FAREWELL_BY_LANG: Record<string, Farewell> = {
  en: ENGLISH,
  es: { native: "¡Adiós y buena suerte!", gloss: "Goodbye and good luck!" },
  fr: { native: "Au revoir et bonne chance !", gloss: "Goodbye and good luck!" },
  pt: { native: "Adeus e boa sorte!", gloss: "Goodbye and good luck!" },
  de: { native: "Auf Wiedersehen und viel Glück!", gloss: "Goodbye and good luck!" },
  it: { native: "Arrivederci e buona fortuna!", gloss: "Goodbye and good luck!" },
  nl: { native: "Tot ziens en veel succes!", gloss: "Goodbye and good luck!" },
  ar: { native: "مع السلامة وحظًّا سعيدًا", gloss: "Goodbye and good luck!" },
  ja: { native: "さようなら、頑張って！", gloss: "Goodbye and good luck!" },
  ko: { native: "안녕히 가세요, 행운을 빌어요!", gloss: "Goodbye and good luck!" },
  tr: { native: "Hoşça kal ve bol şans!", gloss: "Goodbye and good luck!" },
  pl: { native: "Do widzenia i powodzenia!", gloss: "Goodbye and good luck!" },
  cs: { native: "Na shledanou a hodně štěstí!", gloss: "Goodbye and good luck!" },
  hr: { native: "Doviđenja i sretno!", gloss: "Goodbye and good luck!" },
  bs: { native: "Doviđenja i sretno!", gloss: "Goodbye and good luck!" },
  sr: { native: "Doviđenja i srećno!", gloss: "Goodbye and good luck!" },
  sv: { native: "Hej då och lycka till!", gloss: "Goodbye and good luck!" },
  nb: { native: "Ha det og lykke til!", gloss: "Goodbye and good luck!" },
  da: { native: "Farvel og held og lykke!", gloss: "Goodbye and good luck!" },
  cy: { native: "Hwyl fawr a phob lwc!", gloss: "Goodbye and good luck!" },
  fa: { native: "خداحافظ و موفق باشید", gloss: "Goodbye and good luck!" },
  ht: { native: "Orevwa e bòn chans!", gloss: "Goodbye and good luck!" },
};

/** The send-off for a Country/Team code, in its language (English fallback). */
export function farewellFor(code: string): Farewell {
  const base = (langFor(code) ?? "en").split("-")[0];
  return FAREWELL_BY_LANG[base] ?? ENGLISH;
}
