/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#F78CBC",
        secondary: "#E8D9F1",
        accent: "#FFADC3",
        accent2: "#FBCFF4",
        bg1: "#FFF9FB",
        bg2: "#F5F0FA",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
