import type { Config } from "tailwindcss";

/**
 * The Malafa World Cup theme — "Four Homes, One Game".
 *
 * The palette is a deliberate blend of the four family flags:
 *   • Unity Red   — the one colour in ALL four flags (Cameroon, Netherlands,
 *                   Lebanon, USA). The unifying primary.
 *   • Royal Blue  — Netherlands + USA. The deep, refined anchor for headings.
 *   • Cedar Green — Cameroon + Lebanon. Secondary / live / growth.
 *   • Trophy Gold — Cameroon's star and the World Cup trophy itself. Highlight.
 *   • White        — the shared stripe of three flags. The clean canvas.
 *
 * Jewel-toned, not primary-bright: friendly enough for a 4–6 year old, refined
 * enough to feel professional. Values are tuned in OKLCH then expressed as hex.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Malafa brand scales ────────────────────────────────────────────
        // Unity Red — primary action, live, emphasis.
        unity: {
          50: "#FCEBED",
          100: "#F9D6DB",
          200: "#F1AAB4",
          300: "#E87C8C",
          400: "#DE5366",
          500: "#D32F45", // DEFAULT
          600: "#B7243A",
          700: "#931C2F",
          800: "#6E1523",
          900: "#4A0E18",
          DEFAULT: "#D32F45",
        },
        // Royal Blue — headings, ink, primary navigation, trust.
        royal: {
          50: "#EAF0FB",
          100: "#D6E1F6",
          200: "#A9C0EC",
          300: "#769BDE",
          400: "#4570C2",
          500: "#2C53A6",
          600: "#234C9E", // DEFAULT
          700: "#1A3B7B",
          800: "#142E60",
          900: "#0E2046",
          DEFAULT: "#234C9E",
        },
        // Cedar Green — secondary, live data, success, "go".
        cedar: {
          50: "#E4F5EE",
          100: "#C7ECDD",
          200: "#8FD8BB",
          300: "#52C195",
          400: "#1FA774",
          500: "#0E9266", // DEFAULT
          600: "#0B7C56",
          700: "#0A6347",
          800: "#074B36",
          900: "#053425",
          DEFAULT: "#0E9266",
        },
        // Trophy Gold — highlights, badges, celebration, the cup.
        gold: {
          50: "#FCF3DC",
          100: "#FAE7B6",
          200: "#F4D079",
          300: "#EFBC42",
          400: "#E5A81C",
          500: "#C98A12", // DEFAULT (readable on light)
          600: "#A56F0E",
          700: "#80560C",
          800: "#5C3E0A",
          900: "#3D2906",
          DEFAULT: "#C98A12",
        },
        // ── Neutrals — cool, faintly royal-tinted. Deliberately NOT cream. ──
        ink: "#16223F", // deep blue-black — primary text
        muted: "#566182", // secondary text — ≥4.5:1 on canvas & white
        canvas: "#F4F6FB", // page background — cool near-white
        line: "#E2E7F1", // hairline borders

        // ── Backward-compatible semantic aliases (remapped to the brand) ────
        // Older references resolve on-brand without a per-file rewrite.
        grass: "#0E9266", // → cedar
        sky: "#234C9E", // → royal
        sunshine: "#C98A12", // → gold (readable)
        bubble: "#D32F45", // → unity

        // Continent colour-coding — refined to sit beside the brand while
        // staying mutually distinguishable for the map legend & dots.
        continent: {
          africa: "#C98A12", // gold
          asia: "#D32F45", // unity red
          europe: "#234C9E", // royal blue
          namerica: "#0E9266", // cedar green
          samerica: "#7C3AED", // violet (kept distinct)
          oceania: "#0E7C9B", // teal (kept distinct)
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "1.75rem",
      },
      boxShadow: {
        // A refined version of the chunky "pop" — brand-tinted, slightly softer,
        // still tactile for little fingers.
        pop: "0 8px 0 0 rgba(22, 34, 63, 0.12)",
        soft: "0 18px 40px -16px rgba(22, 34, 63, 0.28)",
        card: "0 1px 2px rgba(22,34,63,0.04), 0 10px 28px -14px rgba(22,34,63,0.22)",
        ring: "0 0 0 4px rgba(35, 76, 158, 0.18)",
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
        sheen: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        wiggle: "wiggle 0.6s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        pulseRing: "pulseRing 1.6s ease-out infinite",
        sheen: "sheen 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
