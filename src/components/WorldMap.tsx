"use client";

import { useEffect } from "react";
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

/** Smoothly fly to a team when it becomes selected. */
function FlyToSelected({ team }: { team: Team | null }) {
  const map = useMap();
  useEffect(() => {
    if (team) map.flyTo([team.lat, team.lng], Math.max(map.getZoom(), 4), {
      duration: 0.8,
    });
  }, [team, map]);
  return null;
}

export default function WorldMap({
  selectedCode,
  onSelect,
}: {
  selectedCode: string | null;
  onSelect: (code: string) => void;
}) {
  const selectedTeam = TEAMS.find((t) => t.code === selectedCode) ?? null;

  return (
    <MapContainer
      center={[25, -40]}
      zoom={2}
      minZoom={2}
      maxZoom={6}
      worldCopyJump
      scrollWheelZoom
      className="h-[60vh] min-h-[360px] w-full"
      // Keep the world from scrolling infinitely off into grey.
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemap.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
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
        return (
          <CircleMarker
            key={team.code}
            center={[team.lat, team.lng]}
            radius={selected ? 13 : 7}
            pathOptions={{
              color: "#ffffff",
              weight: selected ? 3 : 1.5,
              fillColor: CONTINENT_COLOR[team.continent],
              fillOpacity: 0.95,
            }}
            eventHandlers={{ click: () => onSelect(team.code) }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <span style={{ fontWeight: 800 }}>
                {team.flag} {team.name}
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}

      <FlyToSelected team={selectedTeam} />
    </MapContainer>
  );
}
