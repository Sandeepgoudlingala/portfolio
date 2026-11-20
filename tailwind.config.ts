import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#FFFFFF",
        muted: "#8a8a8a",
        border: "rgba(255, 255, 255, 0.14)",
        accent: {
          DEFAULT: "#8fb3d9",
          dark: "#4f7aa8",
        },
        card: {
          DEFAULT: "#141414",
          border: "#333333",
        },
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        archivo: ["var(--font-archivo)", "system-ui", "sans-serif"],
        sora: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        serif: ["var(--font-serif)", "serif"],
        vt: ["var(--font-vt)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
