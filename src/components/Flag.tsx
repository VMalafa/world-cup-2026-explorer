"use client";

import { useState } from "react";
import type { Team } from "@/types";

/**
 * Shows a crisp flag image from flagcdn.com, falling back to the emoji flag
 * if the image can't load (e.g. offline). Decorative — the team name carries
 * the meaning for screen readers.
 */
export function Flag({
  team,
  className = "",
  size = 80,
}: {
  team: Team;
  className?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const width = Math.round(size);
  const height = Math.round((size * 3) / 4);

  if (failed) {
    return (
      <span
        className={className}
        style={{ fontSize: height }}
        role="img"
        aria-label={`Flag of ${team.name}`}
      >
        {team.flag}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- simple CDN flag with graceful fallback
    <img
      src={`https://flagcdn.com/w${width <= 80 ? 80 : 160}/${team.iso2}.png`}
      alt={`Flag of ${team.name}`}
      width={width}
      height={height}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`rounded-lg object-cover shadow-sm ${className}`}
      style={{ width, height }}
    />
  );
}
