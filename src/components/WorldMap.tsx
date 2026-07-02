"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TEAMS, CONTINENT_COLOR } from "@/data/teams";
import { STADIUMS } from "@/data/matches";
import type { Team } from "@/types";

/** Stadium coordinates (host cities) for the little ⚽ markers. */
const STADIUM_COORDS: Record<string, [number, number]> = {
  "Mexico City": [19.3, -99.15],
  "New York / New Jersey": [40.81, -74.07],
  "Los Angeles": [33.95, -118.34],
  Dallas: [32.75, -97.09],
  Atlanta: [33.75, -84.4],
  Miami: [25.96, -80.24],
  Houston: [29.68, -95.41],
  "Kansas City": [39.05, -94.48],
  Philadelphia: [39.9, -75.17],
  "San Francisco Bay Area": [37.4, -121.97],
  Seattle: [47.6, -122.33],
  Boston: [42.09, -71.26],
  Toronto: [43.63, -79.42],
  Vancouver: [49.28, -123.11],
  Guadalajara: [20.68, -103.46],
  Monterrey: [25.67, -100.31],
};

const ballIcon = L.divIcon({
  className: "wc-ball-icon",
  html: '<div style="font-size:18px;line-height:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.4))">⚽</div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/** The default whole-world view (the MapContainer's initial center/zoom). */
const WORLD_CENTER: [number, number] = [25, -40];
const WORLD_ZOOM = 2;

/** Fly (or jump instantly under reduced motion) to a point. */
function flyOrJump(
  map: L.Map,
  center: [number, number],
  zoom: number,
  reduce: boolean,
) {
  if (reduce) map.setView(center, zoom);
  else map.flyTo(center, zoom, { duration: 0.8 });
}

/** Smoothly fly to a team when it becomes selected. */
function FlyToSelected({ team, reduce }: { team: Team | null; reduce: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (team) flyOrJump(map, [team.lat, team.lng], Math.max(map.getZoom(), 4), reduce);
  }, [team, map, reduce]);
  return null;
}

/**
 * Fly to whatever the child tapped — not just the station's target — so the
 * Globe answers every tap (#58). The nonce makes re-tapping the same country
 * fly again after panning away.
 */
function FlyToTapped({
  tap,
  reduce,
}: {
  tap: { team: Team; nonce: number } | null;
  reduce: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (tap) flyOrJump(map, [tap.team.lat, tap.team.lng], Math.max(map.getZoom(), 4), reduce);
  }, [tap, map, reduce]);
  return null;
}

/**
 * The 🌍 "Whole world" reset — a child who pans or zooms off somewhere can
 * always come back to the full map, so exploring stays forgiving (#58).
 * Large touch target for small hands; sits above the leaflet panes.
 */
function WholeWorldButton({ reduce }: { reduce: boolean }) {
  const map = useMap();
  return (
    <button
      type="button"
      aria-label="Back to the whole world"
      onClick={() => flyOrJump(map, WORLD_CENTER, WORLD_ZOOM, reduce)}
      className="absolute bottom-3 left-3 z-[1000] inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white px-4 py-2 font-extrabold text-ink shadow-card ring-1 ring-line hover:text-royal"
    >
      <span aria-hidden>🌍</span> Whole world
    </button>
  );
}

export default function WorldMap({
  selectedCode,
  onSelect,
  earnedCodes,
  heightClass = "h-[60vh] min-h-[360px]",
}: {
  selectedCode: string | null;
  onSelect: (code: string) => void;
  /** Countries with a Passport Stamp — drawn with a gold ring. Optional. */
  earnedCodes?: Set<string>;
  /**
   * Height utility classes for the map. Defaults to the large free-explore
   * globe; the Match Day Journey passes a shorter one so the globe, station,
   * and Next button fit a small screen together (issue #45a).
   */
  heightClass?: string;
}) {
  const selectedTeam = TEAMS.find((t) => t.code === selectedCode) ?? null;
  const reduce = useReducedMotion() ?? false;
  // The last tapped marker, nonce'd so the same country re-flies on re-tap.
  const [tapped, setTapped] = useState<{ team: Team; nonce: number } | null>(null);
  const tapCount = useRef(0);

  return (
    <MapContainer
      center={WORLD_CENTER}
      zoom={WORLD_ZOOM}
      minZoom={2}
      maxZoom={6}
      worldCopyJump
      scrollWheelZoom
      className={`${heightClass} w-full`}
      // Keep the world from scrolling infinitely off into grey.
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* Host stadium markers */}
      {STADIUMS.map((s) => {
        const pos = STADIUM_COORDS[s.city];
        if (!pos) return null;
        return (
          <Marker key={s.name} position={pos} icon={ballIcon}>
            <Tooltip direction="top" offset={[0, -8]}>
              <strong>🏟️ {s.name}</strong>
              <br />
              {s.city}
            </Tooltip>
          </Marker>
        );
      })}

      {/* Selectable nation markers, coloured by continent */}
      {TEAMS.map((team) => {
        const selected = team.code === selectedCode;
        const earned = earnedCodes?.has(team.code) ?? false;
        return (
          <CircleMarker
            key={team.code}
            center={[team.lat, team.lng]}
            radius={selected ? 13 : earned ? 8 : 7}
            pathOptions={{
              // Earned countries wear a gold ring; selection still wins.
              color: selected ? "#ffffff" : earned ? "#C98A12" : "#ffffff",
              weight: selected ? 3 : earned ? 3 : 1.5,
              fillColor: CONTINENT_COLOR[team.continent],
              fillOpacity: 0.95,
            }}
            eventHandlers={{
              click: () => {
                onSelect(team.code);
                setTapped({ team, nonce: ++tapCount.current });
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <span style={{ fontWeight: 800 }}>
                {earned ? "✅ " : ""}
                {team.flag} {team.name}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}

      <FlyToSelected team={selectedTeam} reduce={reduce} />
      <FlyToTapped tap={tapped} reduce={reduce} />
      <WholeWorldButton reduce={reduce} />
    </MapContainer>
  );
}
