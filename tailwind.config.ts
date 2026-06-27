import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Design Tokens - Noura
        primary: "#a43947",
        "on-primary": "#ffffff",
        "primary-container": "#ff7e8b",
        "on-primary-container": "#751427",
        "primary-fixed": "#ffdadb",
        "primary-fixed-dim": "#ffb2b7",
        "on-primary-fixed": "#40000e",
        "on-primary-fixed-variant": "#842131",
        "inverse-primary": "#ffb2b7",

        secondary: "#635882",
        "on-secondary": "#ffffff",
        "secondary-container": "#dbcdfe",
        "on-secondary-container": "#60557f",
        "secondary-fixed": "#e8ddff",
        "secondary-fixed-dim": "#cdbff0",
        "on-secondary-fixed": "#1f153b",
        "on-secondary-fixed-variant": "#4b4169",

        tertiary: "#775935",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#c59f76",
        "on-tertiary-container": "#503615",
        "tertiary-fixed": "#ffddb9",
        "tertiary-fixed-dim": "#e8bf94",
        "on-tertiary-fixed": "#2b1700",
        "on-tertiary-fixed-variant": "#5d4120",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        surface: "#fff8f7",
        "surface-dim": "#e9d5d6",
        "surface-bright": "#fff8f7",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#fff0f0",
        "surface-container": "#fee9e9",
        "surface-container-high": "#f8e3e4",
        "surface-container-highest": "#f2dede",
        "on-surface": "#231919",
        "on-surface-variant": "#564243",
        "inverse-surface": "#3a2d2e",
        "inverse-on-surface": "#ffecec",

        outline: "#897172",
        "outline-variant": "#ddc0c0",
        "surface-tint": "#a43947",
        "surface-variant": "#f2dede",
        background: "#fff8f7",
        "on-background": "#231919",
      },
      fontFamily: {
        sans: ["Work Sans", "sans-serif"],
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Work Sans", "sans-serif"],
        label: ["Work Sans", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["32px", { lineHeight: "38px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      spacing: {
        unit: "8px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        gutter: "16px",
        "section-gap": "48px",
        "container-padding": "24px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(164, 57, 71, 0.04)",
        hover: "0 8px 30px rgba(164, 57, 71, 0.08)",
        card: "0 2px 12px rgba(164, 57, 71, 0.06)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "spin-slow": "spin 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
