import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rr: {
          black: "#050509",
          panel: "#0C0D12",
          gunmetal: "#1C2028",
          chrome: "#C7CCD4",
          silver: "#E4E8EF",
          purple: "#9D00FF",
          violet: "#B451FF",
          danger: "#FF3B5F"
        }
      },
      boxShadow: {
        glow: "0 0 32px rgba(157, 0, 255, 0.35)",
        chrome: "inset 0 1px 0 rgba(255,255,255,.18), 0 12px 40px rgba(0,0,0,.35)"
      },
      backgroundImage: {
        "rr-radial": "radial-gradient(circle at 50% 0%, rgba(157,0,255,.24), transparent 38%), linear-gradient(180deg, #050509 0%, #0C0D12 100%)",
        "chrome-line": "linear-gradient(90deg, transparent, rgba(228,232,239,.7), transparent)"
      }
    }
  },
  plugins: []
};

export default config;
