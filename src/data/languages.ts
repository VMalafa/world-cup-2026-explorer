/**
 * BCP-47 language per Country, for speaking the native greeting ("hello") in
 * its own language during a journey (ADR-0001). Reference data, not authored
 * prose — so it isn't Guardian-gated.
 *
 * Authentic-first: minority-language greetings (Māori, Zulu, Welsh, …) use the
 * real code, so a device that has the voice pronounces it correctly; where it
 * doesn't, `useSpeak` degrades to the default voice. Journey blurbs are English
 * and don't use this — only the greeting does.
 */
export const COUNTRY_LANG: Record<string, string> = {
  MEX: "es-MX", CRO: "hr-HR", CMR: "fr-CM", KSA: "ar-SA",
  CAN: "en-CA", ECU: "es-EC", MAR: "ar-MA", UZB: "uz-UZ",
  USA: "en-US", WAL: "cy-GB", IRN: "fa-IR", JAM: "en-JM",
  ARG: "es-AR", AUS: "en-AU", POL: "pl-PL", CRC: "es-CR",
  BRA: "pt-BR", SUI: "de-CH", SRB: "sr-RS", NZL: "mi-NZ",
  FRA: "fr-FR", KOR: "ko-KR", RSA: "zu-ZA", PAN: "es-PA",
  ESP: "es-ES", JPN: "ja-JP", TUN: "ar-TN", PAR: "es-PY",
  GER: "de-DE", COL: "es-CO", QAT: "ar-QA", SCO: "en-GB",
  POR: "pt-PT", URU: "es-UY", GHA: "ak-GH", NOR: "nb-NO",
  NED: "nl-NL", SEN: "wo-SN", DEN: "da-DK", CHI: "es-CL",
  BEL: "nl-BE", NGA: "ha-NG", AUT: "de-AT", EGY: "ar-EG",
  ENG: "en-GB", ITA: "it-IT", ALG: "ar-DZ", CIV: "fr-CI",
};

/** The greeting language for a Country code, if known. */
export function langFor(code: string): string | undefined {
  return COUNTRY_LANG[code];
}
