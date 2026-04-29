import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        foreground: "#FAFAFA",
        muted: "#1A1A1A",
        "muted-foreground": "#737373",
        accent: "#FF3D00",
        "accent-foreground": "#0A0A0A",
        border: "#262626",
        input: "#1A1A1A",
        card: "#0F0F0F",
        "card-foreground": "#FAFAFA",
        ring: "#FF3D00",
        primary: "#FF3D00",
        "primary-focus": "#FF3D00",
        "primary-on-dark": "#FF3D00",
        canvas: "#0A0A0A",
        "canvas-parchment": "#1A1A1A",
        "surface-pearl": "#0F0F0F",
        "surface-tile-1": "#111111",
        "surface-tile-2": "#151515",
        "surface-tile-3": "#101010",
        "surface-black": "#0A0A0A",
        "surface-chip-translucent": "rgba(38, 38, 38, 0.82)",
        ink: "#FAFAFA",
        body: "#FAFAFA",
        "body-on-dark": "#FAFAFA",
        "body-muted": "#9A9A9A",
        "ink-muted-80": "#B0B0B0",
        "ink-muted-48": "#737373",
        "divider-soft": "#262626",
        hairline: "#262626",
      },
      fontFamily: {
        display: ["Inter Tight", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "hero-display": [
          "clamp(4.5rem, 11vw, 10rem)",
          { lineHeight: "0.92", letterSpacing: "-0.06em", fontWeight: "700" },
        ],
        "display-lg": [
          "clamp(3.25rem, 7vw, 6rem)",
          { lineHeight: "0.95", letterSpacing: "-0.05em", fontWeight: "700" },
        ],
        "display-md": [
          "clamp(2.5rem, 5vw, 4.5rem)",
          { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "700" },
        ],
        lead: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "400" }],
        "lead-airy": [
          "1.25rem",
          { lineHeight: "1.75", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        tagline: ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "600" }],
        "body-strong": ["1rem", { lineHeight: "1.5", letterSpacing: "-0.01em", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6", letterSpacing: "-0.01em", fontWeight: "400" }],
        "dense-link": ["1rem", { lineHeight: "1.6", letterSpacing: "-0.01em", fontWeight: "400" }],
        caption: ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "400" }],
        "caption-strong": [
          "0.75rem",
          { lineHeight: "1.5", letterSpacing: "0.14em", fontWeight: "600" },
        ],
        "button-large": [
          "0.875rem",
          { lineHeight: "1.2", letterSpacing: "0.14em", fontWeight: "600" },
        ],
        "button-utility": [
          "0.875rem",
          { lineHeight: "1.2", letterSpacing: "0.14em", fontWeight: "600" },
        ],
        "fine-print": [
          "0.75rem",
          { lineHeight: "1.5", letterSpacing: "0.08em", fontWeight: "400" },
        ],
        "micro-legal": [
          "0.625rem",
          { lineHeight: "1.3", letterSpacing: "0.12em", fontWeight: "500" },
        ],
        "nav-link": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.16em", fontWeight: "600" }],
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "17px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        section: "80px",
        "section-lg": "112px",
        "section-xl": "160px",
      },
      borderRadius: {
        none: "0px",
        xs: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        pill: "0px",
        full: "0px",
      },
      boxShadow: {
        product: "none",
      },
      maxWidth: {
        content: "1200px",
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.28'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} satisfies Config;
