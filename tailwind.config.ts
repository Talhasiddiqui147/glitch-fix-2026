import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        code: ["monospace"],
      },
    },
  },
  plugins: [],
};

export default config;