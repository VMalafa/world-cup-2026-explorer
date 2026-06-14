import { describe, it, expect } from "vitest";

import { memoryKeyValue } from "./storage";
import { createProfileStore, PROFILES } from "./profiles";

describe("PROFILES", () => {
  it("are the two on-device children, Ava 🦉 and Kai 🐣", () => {
    expect(PROFILES.map((p) => p.id)).toEqual(["ava", "kai"]);
    const ava = PROFILES.find((p) => p.id === "ava")!;
    const kai = PROFILES.find((p) => p.id === "kai")!;
    expect(ava.emoji).toBe("🦉");
    expect(kai.emoji).toBe("🐣");
  });

  it("default each child to an age-appropriate reading level", () => {
    expect(PROFILES.find((p) => p.id === "ava")!.defaultLevel).toBe("enriched");
    expect(PROFILES.find((p) => p.id === "kai")!.defaultLevel).toBe("kinder");
  });
});

describe("createProfileStore", () => {
  it("has no active profile until one is chosen", () => {
    const store = createProfileStore(memoryKeyValue());
    expect(store.getActiveProfileId()).toBeNull();
  });

  it("persists the chosen profile across store instances (a reload)", () => {
    const kv = memoryKeyValue();
    createProfileStore(kv).setActiveProfileId("kai");

    // A fresh store over the same backing = a page reload.
    expect(createProfileStore(kv).getActiveProfileId()).toBe("kai");
  });

  it("returns each profile's default reading level until one is set", () => {
    const store = createProfileStore(memoryKeyValue());
    expect(store.getReadingLevel("ava")).toBe("enriched");
    expect(store.getReadingLevel("kai")).toBe("kinder");
  });

  it("stores reading level per profile, independently", () => {
    const kv = memoryKeyValue();
    const store = createProfileStore(kv);

    store.setReadingLevel("ava", "kinder");

    expect(store.getReadingLevel("ava")).toBe("kinder");
    // Kai is untouched.
    expect(store.getReadingLevel("kai")).toBe("kinder");
    store.setReadingLevel("kai", "enriched");
    expect(store.getReadingLevel("kai")).toBe("enriched");
    expect(store.getReadingLevel("ava")).toBe("kinder");

    // ...and it survives a reload.
    expect(createProfileStore(kv).getReadingLevel("ava")).toBe("kinder");
  });

  it("ignores corrupt stored values and falls back safely", () => {
    const kv = memoryKeyValue({
      "wc.activeProfile": "nobody",
      "wc.readingLevel.ava": "gibberish",
    });
    const store = createProfileStore(kv);
    expect(store.getActiveProfileId()).toBeNull();
    expect(store.getReadingLevel("ava")).toBe("enriched");
  });
});
