import { type Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          "2xl": "1360px",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config
