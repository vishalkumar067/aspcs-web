import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          mint:          "#E8F8F5",   // soft mint background
          "mint-light":  "#F0FAF8",   // lighter mint
          "mint-deep":   "#C8EEE7",   // deeper mint
          teal:          "#0D9488",   // primary teal
          "teal-light":  "#14B8A6",   // lighter teal
          "teal-dark":   "#0F766E",   // darker teal
          "teal-deep":   "#115E59",   // very dark teal
          sage:          "#6EE7B7",   // sage green accent
          white:         "#FFFFFF",
          cream:         "#F8FFFE",   // warm white with mint tint
          slate:         "#5EAAA0",   // muted teal slate
          "slate-light": "#A7D7D2",   // lighter slate
          muted:         "#7BA9A5",   // muted text
          dark:          "#134E4A",   // dark text
          "dark-light":  "#1A6B65",   // slightly lighter dark
          gold:          "#F59E0B",   // warm amber accent
          "gold-light":  "#FCD34D",
        },
        glass: {
          white:  "rgba(255,255,255,0.7)",
          border: "rgba(13,148,136,0.15)",
          teal:   "rgba(13,148,136,0.08)",
        },
      },

      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body:    ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "monospace"],
      },

      fontSize: {
        "2xs":         ["0.625rem", { lineHeight: "1rem" }],
        "display-xs":  ["2rem",    { lineHeight: "2.25rem",  letterSpacing: "-0.02em" }],
        "display-sm":  ["2.5rem",  { lineHeight: "2.75rem",  letterSpacing: "-0.025em" }],
        "display-md":  ["3rem",    { lineHeight: "3.25rem",  letterSpacing: "-0.03em" }],
        "display-lg":  ["3.75rem", { lineHeight: "4rem",     letterSpacing: "-0.035em" }],
        "display-xl":  ["4.5rem",  { lineHeight: "4.75rem",  letterSpacing: "-0.04em" }],
        "display-2xl": ["5.5rem",  { lineHeight: "5.75rem",  letterSpacing: "-0.045em" }],
      },

      spacing: {
        "18": "4.5rem", "22": "5.5rem", "88": "22rem",
        "100": "25rem", "112": "28rem", "128": "32rem",
      },
      maxWidth: { "8xl": "88rem", "9xl": "96rem" },
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },

      boxShadow: {
        "glass":       "0 8px 32px 0 rgba(13,148,136,0.10), inset 0 1px 0 rgba(255,255,255,0.8)",
        "glass-lg":    "0 24px 64px 0 rgba(13,148,136,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
        "teal":        "0 0 40px rgba(13,148,136,0.25)",
        "card":        "0 2px 20px rgba(13,148,136,0.08), 0 1px 3px rgba(13,148,136,0.05)",
        "card-hover":  "0 12px 40px rgba(13,148,136,0.18), 0 4px 12px rgba(13,148,136,0.10)",
        "glow-teal":   "0 0 60px rgba(13,148,136,0.25), 0 0 120px rgba(13,148,136,0.10)",
        "glow-gold":   "0 0 40px rgba(245,158,11,0.25)",
        "soft":        "0 4px 24px rgba(13,148,136,0.06)",
      },

      backdropBlur: { xs: "2px", "4xl": "72px" },

      keyframes: {
        "fade-up":        { "0%": { opacity: "0", transform: "translateY(24px)" },  "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in":        { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-in-left":  { "0%": { opacity: "0", transform: "translateX(-24px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        "slide-in-right": { "0%": { opacity: "0", transform: "translateX(24px)" },  "100%": { opacity: "1", transform: "translateX(0)" } },
        shimmer:          { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
        float:            { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        marquee:          { "0%": { transform: "translateX(0%)" }, "100%": { transform: "translateX(-50%)" } },
        "pulse-teal":     { "0%, 100%": { boxShadow: "0 0 0 0 rgba(13,148,136,0.3)" }, "50%": { boxShadow: "0 0 0 12px rgba(13,148,136,0)" } },
      },
      animation: {
        "fade-up":        "fade-up 0.6s ease-out forwards",
        "fade-up-delay":  "fade-up 0.6s ease-out 0.2s forwards",
        "fade-in":        "fade-in 0.4s ease-out forwards",
        "slide-in-left":  "slide-in-left 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        shimmer:          "shimmer 2.5s linear infinite",
        float:            "float 4s ease-in-out infinite",
        marquee:          "marquee 30s linear infinite",
        "pulse-teal":     "pulse-teal 2s ease-in-out infinite",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "teal-shimmer":    "linear-gradient(105deg, transparent 40%, rgba(13,148,136,0.3) 50%, transparent 60%)",
        "mint-gradient":   "linear-gradient(135deg, #E8F8F5 0%, #F0FAF8 50%, #E0F2F0 100%)",
        "hero-pattern":    "linear-gradient(rgba(13,148,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.04) 1px, transparent 1px)",
      },
      backgroundSize: { shimmer: "200% auto", "hero-pattern": "60px 60px" },
    },
  },
  plugins: [],
};

export default config;
