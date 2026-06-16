/**
 * Pure helpers for sourcing **Wonder** photos from Wikimedia Commons (ADR-0007).
 *
 * Used by the authoring script `scripts/generateWonderPhotos.mts`; kept here,
 * separate from any network code, so the licensing/attribution logic — the part
 * that must be correct — is unit-tested. Nothing here runs in the live app.
 */

/** One committed Wonder photo's metadata (the manifest entry shape). */
export interface WonderPhoto {
  /** Committed filename in `public/wonders` (e.g. "fra-landmark.jpg"). */
  file: string;
  /** Human title / subject of the photo. */
  title: string;
  /** Plain-text author/artist, for the required attribution credit. */
  author: string;
  /** License short name, e.g. "CC BY-SA 4.0". */
  license: string;
  /** Wikimedia file description page — the parent-facing "learn more" target. */
  sourceUrl: string;
}

/**
 * Whether a Wikimedia license short-name is one we may use (free / open). We
 * allow public domain and the CC family, and explicitly reject anything that
 * smells non-free, so a mislabelled file never ships.
 */
export function isFreeLicense(shortName: string | undefined | null): boolean {
  if (!shortName) return false;
  const s = shortName.toLowerCase();
  if (/non-?free|fair use|all rights|copyright|no license/.test(s)) return false;
  return /cc0|public domain|pd-|cc[ -]?by/.test(s);
}

/** Strip HTML tags/entities from a Wikimedia `Artist`/`Credit` field. */
export function plainText(html: string | undefined | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ") // tags
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Build a Commons search query for a wonder (its name is usually specific). */
export function buildSearchQuery(wonderName: string): string {
  // Drop any parenthetical aside ("Couscous (dish)") and tidy whitespace.
  return wonderName.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
}

/** Minimal shape of a Commons `imageinfo` entry we care about. */
export interface CommonsImageInfo {
  url?: string;
  thumburl?: string;
  mime?: string;
  descriptionurl?: string;
  extmetadata?: Record<string, { value?: string } | undefined>;
}

/**
 * Turn a Commons image record into a committed-photo's attribution, or null if
 * it isn't a usable still photo under a free license. `file` is filled in by the
 * caller (it owns the `<code>-<slot>` naming); everything else comes from the
 * file's own metadata.
 */
export function toWonderPhoto(
  info: CommonsImageInfo,
): Omit<WonderPhoto, "file"> | null {
  const meta = info.extmetadata ?? {};
  const get = (k: string) => meta[k]?.value;

  // Photos only — skip SVG/GIF/video and anything not an image.
  const mime = info.mime ?? "";
  if (!/^image\/(jpe?g|png)$/i.test(mime)) return null;

  const license = plainText(get("LicenseShortName"));
  if (!isFreeLicense(license)) return null;
  // A flagged usage restriction (trademark, personality rights…) → skip.
  if (plainText(get("Restrictions"))) return null;

  const author = plainText(get("Artist")) || plainText(get("Credit")) || "Wikimedia Commons";
  const title = plainText(get("ObjectName")) || plainText(get("ImageDescription")) || "";
  const sourceUrl = info.descriptionurl ?? "";
  if (!sourceUrl) return null;

  return { title, author, license, sourceUrl };
}

/** The file extension to commit for a given mime type. */
export function extForMime(mime: string | undefined): "jpg" | "png" {
  return /png/i.test(mime ?? "") ? "png" : "jpg";
}
