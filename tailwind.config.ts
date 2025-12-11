import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1a1a2e",
        "background-dark": "#0f0f1a",
        primary: "#00BCD4",
        "primary-dark": "#00838F",
        accent: "#F57C00",
        "accent-light": "#FF9800",
        card: "#2a2a3e",
        "card-light": "#3a3a4e",
        "text-primary": "#ffffff",
        "text-secondary": "#b0b0b0",
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
        logo: ["NauryzRedKeds", "Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.perspective-900': {
          perspective: '900px',
        },
      })
    }),
  ],
};
export default config;
