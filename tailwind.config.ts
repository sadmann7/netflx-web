/** @type {import('tailwindcss').Config} */
module.exports = {
  dark: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "5vw",
        screens: {
          "2xl": "1400px",
        },
      },
      screens: {
        xxs: "320px",
        xs: "420px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
