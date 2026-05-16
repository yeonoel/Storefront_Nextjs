import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // scrollbar-hide — utilisé dans CataloguePage pour les chips de filtre
    // npm install -D tailwind-scrollbar-hide
    require("tailwind-scrollbar-hide"),
  ],
};

export default config;
