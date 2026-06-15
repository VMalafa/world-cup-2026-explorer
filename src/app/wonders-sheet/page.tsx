"use client";

import { useState } from "react";

import { COUNTRIES } from "@/data/countries";
import { COUNTRY_CONTENT } from "@/data/countryContent";

/**
 * Wonder illustration contact sheet — an AUTHORING/review tool (ADR-0004), not
 * part of the child-facing app and not linked from the nav. After running
 * `npm run gen:wonders`, open `/wonders-sheet` to eyeball every generated
 * picture (the one human pass that stands in for pixel review) before committing
 * the PNGs. Cells with no image yet show the emoji fallback the app would use.
 */
const SLOTS = ["landmark", "animal", "food"] as const;

export default function WondersSheet() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-ink">Wonders contact sheet</h1>
      <p className="mt-1 text-sm text-muted">
        Review tool for ADR-0004. {Object.keys(COUNTRY_CONTENT).length} countries × 3 ={" "}
        {Object.keys(COUNTRY_CONTENT).length * 3} wonders. A grey emoji cell means the picture
        isn&apos;t generated yet — the app shows that emoji as the fallback.
      </p>

      <div className="mt-6 space-y-8">
        {COUNTRIES.filter((c) => COUNTRY_CONTENT[c.code]).map((country) => {
          const wonders = COUNTRY_CONTENT[country.code].wonders;
          return (
            <section key={country.code}>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">
                {country.flag} {country.name}{" "}
                <span className="font-mono text-line">({country.code})</span>
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {SLOTS.map((slot) => (
                  <Cell
                    key={slot}
                    code={country.code}
                    slot={slot}
                    name={wonders[slot].name}
                    emoji={wonders[slot].emoji}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function Cell({
  code,
  slot,
  name,
  emoji,
}: {
  code: string;
  slot: string;
  name: string;
  emoji: string;
}) {
  const [failed, setFailed] = useState(false);
  const file = `${code.toLowerCase()}-${slot}.png`;
  return (
    <figure className="overflow-hidden rounded-lg ring-1 ring-line">
      <div className="flex aspect-square items-center justify-center bg-royal-50">
        {failed ? (
          <span className="text-5xl grayscale" aria-hidden>
            {emoji}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/wonders/${file}`}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <figcaption className="px-2 py-1.5">
        <p className="truncate text-xs font-bold text-ink">{name}</p>
        <p className="font-mono text-[10px] text-muted">{file}</p>
      </figcaption>
    </figure>
  );
}
