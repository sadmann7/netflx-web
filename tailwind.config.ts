import { type Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "5vw",
        screens: {
          "2xl": "1360px",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config
