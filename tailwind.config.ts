import type { Config } from "tailwindcss";

/**
 * Playful, high-contrast theme tuned for 4–6 year olds:
 * big rounded shapes, vibrant colours, friendly type.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Continent colour coding — reused across the map & compare view.
        continent: {
          africa: "#f59e0b", // amber
          asia: "#ef4444", // red
          europe: "#3b82f6", // blue
          namerica: "#10b981", // emerald
          samerica: "#a855f7", // purple
          oceania: "#06b6d4", // cyan
        },
        grass: "#22c55e",
        sky: "#38bdf8",
        sunshine: "#facc15",
        bubble: "#fb7185",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "2rem",
      },
      boxShadow: {
        pop: "0 10px 0 0 rgba(0,0,0,0.12)",
        soft: "0 12px 30px -8px rgba(0,0,0,0.25)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        wiggle: "wiggle 0.6s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        pulseRing: "pulseRing 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
