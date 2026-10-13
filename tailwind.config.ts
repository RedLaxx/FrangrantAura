import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f6f3",
          100: "#eceae5",
          200: "#d3cfc7",
          300: "#a9a9b4",
          400: "#8b8b97",
          500: "#6c6c78",
          600: "#52525d",
          700: "#3a3a44",
          800: "#22222a",
          850: "#17171c",
          900: "#0f0f13",
          950: "#08080a",
        },
        gold: {
          50: "#fbf7ec",
          100: "#f5ecd2",
          200: "#ebdca9",
          300: "#dfc678",
          400: "#d0ac4c",
          500: "#c0932f",
          600: "#9c7424",
          700: "#7c5a1d",
          800: "#5e4418",
          900: "#40300f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.6s ease-out both",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
