/**
 * The storage seam (ADR-0003).
 *
 * All persisted state goes through `KeyValueStore` so the v1 `localStorage`
 * backing can be swapped for Neon later without touching feature code. Nothing
 * here makes a network call: on-device only, so no data about a child ever
 * leaves the device.
 */

/** The minimal string key/value contract — `window.localStorage` already fits. */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** An in-memory store — used in tests and as the SSR/no-storage fallback. */
export function memoryKeyValue(seed: Record<string, string> = {}): KeyValueStore {
  const map = new Map<string, string>(Object.entries(seed));
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

/**
 * The browser-backed store. Falls back to an ephemeral in-memory store when
 * `localStorage` is unavailable (SSR, private-mode quota errors) so callers
 * never throw — they just don't persist in that degraded case.
 */
export function browserKeyValue(): KeyValueStore {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const ls = window.localStorage;
      // Probe: Safari private mode exposes localStorage but throws on write.
      const probe = "__wc_probe__";
      ls.setItem(probe, "1");
      ls.removeItem(probe);
      return ls;
    }
  } catch {
    // fall through to memory
  }
  return memoryKeyValue();
}
