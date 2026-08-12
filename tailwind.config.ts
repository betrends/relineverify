import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0E1A",
          900: "#12162A",
          800: "#1B2038",
          700: "#262C4A",
        },
        violet: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          400: "#9B85FF",
          500: "#7C5CFC",
          600: "#6544E0",
        },
        mint: {
          400: "#3DDC97",
          500: "#22B87D",
        },
        amber: {
          400: "#FFB454",
        },
        danger: {
          400: "#FB7185",
        },
        paper: {
          100: "#EDEEF7",
          300: "#C7CAE3",
        },
        slate: {
          400: "#8890B5",
          500: "#6B7295",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        serif: ["var(--font-serif)", "serif"],
      },
      fontWeight: {
        "500": "500",
        "700": "700",
      },
      keyframes: {
        scramble: {
          "0%": { opacity: "0.3" },
          "100%": { opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        scramble: "scramble 0.15s ease-out",
        pulseDot: "pulseDot 1.4s ease-in-out infinite",
        "gradient-shift": "gradientShift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
