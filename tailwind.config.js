/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12151A",
        paper: "#F6F5F1",
        panel: "#1B1F26",
        add: "#3FB950",
        del: "#F85149",
        wire: "#2A2F38",
        muted: "#8B93A1",
      },
      fontFamily: {
        display: ["Source Serif 4", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
