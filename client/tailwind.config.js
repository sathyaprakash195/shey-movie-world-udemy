/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B2447",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
