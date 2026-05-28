import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          light: "var(--primary-light)",
        },
        "primary-foreground": "var(--primary-foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        card: "var(--card)",
      },
    },
  },
  plugins: [
    // scrollbar-hide — utilisé dans CataloguePage pour les chips de filtre
    // npm install -D tailwind-scrollbar-hide
    require("tailwind-scrollbar-hide"),
  ],
};

export default config;
