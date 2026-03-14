/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeDefault : {
          100: "#E6FFFD",
          200: "#AEE2FF",
          300: "#ACBCFF",
          400: "#B799FF"
        },
        themeWhiteBlack : {
          100: "#f3f4f6",
          200: "#9ca3af",
          300: "#111827",
          400: "#030712"
        },
        themePink : {
          100: "#fae8ff",
          200: "#f0abfc",
          300: "#d946ef",
          400: "#a21caf"
        }
      },
      fontFamily: {
        "ZenMaru": ["Zen Maru Gothic"]
      }
    },
  },
  plugins: [
  ],
}

