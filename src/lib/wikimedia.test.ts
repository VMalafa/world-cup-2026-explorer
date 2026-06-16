import { describe, it, expect } from "vitest";

import {
  isFreeLicense,
  plainText,
  buildSearchQuery,
  toWonderPhoto,
  extForMime,
  type CommonsImageInfo,
} from "./wikimedia";

describe("isFreeLicense", () => {
  it("accepts public domain and the CC family", () => {
    for (const l of ["CC0", "Public domain", "CC BY 4.0", "CC BY-SA 3.0", "PD-old"]) {
      expect(isFreeLicense(l)).toBe(true);
    }
  });

  it("rejects non-free / unknown licenses", () => {
    for (const l of ["Fair use", "All rights reserved", "Non-free", "", undefined]) {
      expect(isFreeLicense(l)).toBe(false);
    }
  });
});

describe("plainText", () => {
  it("strips tags and decodes common entities", () => {
    expect(plainText('<a href="x">Jane &amp; Co</a>')).toBe("Jane & Co");
  });
  it("is empty for nullish input", () => {
    expect(plainText(undefined)).toBe("");
  });
});

describe("buildSearchQuery", () => {
  it("drops parentheticals and tidies whitespace", () => {
    expect(buildSearchQuery("Couscous (dish)")).toBe("Couscous");
    expect(buildSearchQuery("  Eiffel   Tower ")).toBe("Eiffel Tower");
  });
});

describe("extForMime", () => {
  it("maps mime to a committed extension", () => {
    expect(extForMime("image/jpeg")).toBe("jpg");
    expect(extForMime("image/png")).toBe("png");
    expect(extForMime(undefined)).toBe("jpg");
  });
});

describe("toWonderPhoto", () => {
  const freeJpeg: CommonsImageInfo = {
    url: "https://upload.wikimedia.org/x.jpg",
    mime: "image/jpeg",
    descriptionurl: "https://commons.wikimedia.org/wiki/File:X.jpg",
    extmetadata: {
      LicenseShortName: { value: "CC BY-SA 4.0" },
      Artist: { value: '<a href="/wiki/User:Jane">Jane Doe</a>' },
      ObjectName: { value: "Eiffel Tower" },
    },
  };

  it("extracts attribution for a free still photo", () => {
    expect(toWonderPhoto(freeJpeg)).toEqual({
      title: "Eiffel Tower",
      author: "Jane Doe",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:X.jpg",
    });
  });

  it("rejects a non-image mime (svg/gif/video)", () => {
    expect(toWonderPhoto({ ...freeJpeg, mime: "image/svg+xml" })).toBeNull();
  });

  it("rejects a non-free license", () => {
    expect(
      toWonderPhoto({
        ...freeJpeg,
        extmetadata: { ...freeJpeg.extmetadata, LicenseShortName: { value: "Fair use" } },
      }),
    ).toBeNull();
  });

  it("rejects a file carrying usage restrictions", () => {
    expect(
      toWonderPhoto({
        ...freeJpeg,
        extmetadata: { ...freeJpeg.extmetadata, Restrictions: { value: "trademarked" } },
      }),
    ).toBeNull();
  });

  it("falls back to a generic author when none is given", () => {
    const noArtist: CommonsImageInfo = {
      ...freeJpeg,
      extmetadata: { LicenseShortName: { value: "CC0" }, ObjectName: { value: "Fennec" } },
    };
    expect(toWonderPhoto(noArtist)?.author).toBe("Wikimedia Commons");
  });
});
