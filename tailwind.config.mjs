import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode: Slightly blue theme
        background: {
          DEFAULT: "#f4f8fd",
          light: "#eaf2fb",
        },
        foreground: {
          DEFAULT: "#1a233a",
        },
        primary: {
          DEFAULT: "#2563eb", // blue-600
          light: "#60a5fa", // blue-400
        },
        // Asmani (sky/azure) for dark mode
        dark: {
          background: "#0a192f",
          foreground: "#e0eaff",
          accent: "#38bdf8", // sky-400
        },
      },
    },
  },
  plugins: [],
};
export default config;
