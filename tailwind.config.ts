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
          maroon:        "#6B0F1A",   // deep maroon primary
          "maroon-light":"#8B1A26",   // lighter maroon
          "maroon-dark": "#4A0A12",   // darker maroon
          black:         "#0D0608",   // near black with red tint
          "black-light": "#1A0C0E",   // slightly lighter black
          crimson:       "#C41E3A",   // accent crimson
          gold:          "#D4A843",   // warm gold accent
          "gold-light":  "#E8C06A",
          "gold-pale":   "#F5E9C8",
          cream:         "#FAF3F0",   // warm cream for light mode
          slate:         "#B89A9E",   // muted reddish slate
          "slate-light": "#D4BCBF",
          muted:         "#8A6A6E",
        },
        glass: {
          white:  "rgba(255,255,255,0.07)",
          border: "rgba(255,255,255,0.10)",
          dark:   "rgba(13,6,8,0.65)",
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
        "glass":      "0 8px 32px 0 rgba(13,6,8,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glass-lg":   "0 24px 64px 0 rgba(13,6,8,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
        "crimson":    "0 0 40px rgba(196,30,58,0.3)",
        "maroon":     "0 20px 60px rgba(107,15,26,0.5)",
        "card":       "0 2px 20px rgba(13,6,8,0.12), 0 1px 3px rgba(13,6,8,0.08)",
        "card-hover": "0 12px 40px rgba(107,15,26,0.2), 0 4px 12px rgba(13,6,8,0.15)",
        "glow-gold":  "0 0 60px rgba(212,168,67,0.3), 0 0 120px rgba(212,168,67,0.1)",
        "glow-crimson":"0 0 60px rgba(196,30,58,0.35), 0 0 120px rgba(196,30,58,0.1)",
      },

      backdropBlur: { xs: "2px", "4xl": "72px" },

      keyframes: {
        "fade-up":        { "0%": { opacity: "0", transform: "translateY(24px)" },  "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in":        { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-in-left":  { "0%": { opacity: "0", transform: "translateX(-24px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        "slide-in-right": { "0%": { opacity: "0", transform: "translateX(24px)" },  "100%": { opacity: "1", transform: "translateX(0)" } },
        shimmer:          { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
        float:            { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        "pulse-crimson":  { "0%, 100%": { boxShadow: "0 0 0 0 rgba(196,30,58,0.4)" }, "50%": { boxShadow: "0 0 0 12px rgba(196,30,58,0)" } },
        marquee:          { "0%": { transform: "translateX(0%)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        "fade-up":        "fade-up 0.6s ease-out forwards",
        "fade-up-delay":  "fade-up 0.6s ease-out 0.2s forwards",
        "fade-in":        "fade-in 0.4s ease-out forwards",
        "slide-in-left":  "slide-in-left 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        shimmer:          "shimmer 2.5s linear infinite",
        float:            "float 4s ease-in-out infinite",
        "pulse-crimson":  "pulse-crimson 2s ease-in-out infinite",
        marquee:          "marquee 30s linear infinite",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-grid":       "linear-gradient(rgba(196,30,58,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.06) 1px, transparent 1px)",
        "gold-shimmer":    "linear-gradient(105deg, transparent 40%, rgba(212,168,67,0.4) 50%, transparent 60%)",
      },
      backgroundSize: { "hero-grid": "60px 60px", shimmer: "200% auto" },
    },
  },
  plugins: [],
};

export default config;
