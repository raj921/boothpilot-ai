import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070907",
        panel: "#10140f",
        field: "#171d15",
        line: "#2b3428",
        signal: "#B7FF3C",
        copper: "#D39A5E",
        ice: "#C8E7FF",
        fog: "#DDE7D0"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(183,255,60,0.16), 0 24px 80px rgba(0,0,0,0.5)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"]
      }
    }
  },
  plugins: []
};

export default config;
