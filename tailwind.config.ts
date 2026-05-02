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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-manrope)"],
      },
      boxShadow: {
        premium: "0 20px 50px -12px rgba(29, 62, 142, 0.12)",
        soft: "0 4px 10px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
