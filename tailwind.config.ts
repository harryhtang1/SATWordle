import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tile-correct":  "#6aaa64",
        "tile-present":  "#c9b458",
        "tile-absent":   "#787c7e",
        "key-correct":   "#6aaa64",
        "key-present":   "#c9b458",
        "key-absent":    "#787c7e",
        "key-unused":    "#d3d6da",
        "border-empty":  "#d3d6da",
        "border-filled": "#878a8c",
      },
      keyframes: {
        shake: {
          "0%, 100%":       { transform: "translateX(0)" },
          "10%, 50%, 90%":  { transform: "translateX(-4px)" },
          "30%, 70%":       { transform: "translateX(4px)" },
        },
        pop: {
          "0%":   { transform: "scale(1)" },
          "50%":  { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
        bounce: {
          "0%, 20%": { transform: "translateY(0)" },
          "40%":     { transform: "translateY(-28px)" },
          "50%":     { transform: "translateY(5px)" },
          "60%":     { transform: "translateY(-14px)" },
          "80%":     { transform: "translateY(2px)" },
          "100%":    { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shake:    "shake 0.5s ease-in-out",
        pop:      "pop 0.1s ease-in-out",
        bounce:   "bounce 0.8s ease-in-out",
        "fade-in": "fade-in 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
