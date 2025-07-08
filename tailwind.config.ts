import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        slideFade: {
          "0%": { opacity: "0", transform: "translateY(-100%)" },
          "30%": { opacity: "1", transform: "translateY(0)" },
          "70%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-50%)" },
        },
      },
      animation: {
        slideFade: "slideFade 3s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
