/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(222.2 84% 4.9%)",
        foreground: "hsl(210 40% 98%)",
        muted: "hsl(217.2 32.6% 17.5%)",
        "muted-foreground": "hsl(215 20.2% 65.1%)",
        card: "hsl(222.2 84% 4.9%)",
        "card-foreground": "hsl(210 40% 98%)",
        border: "hsl(217.2 32.6% 17.5%)",
        ring: "hsl(222.2 84% 4.9%)",
        accent: "hsl(142.1 70.6% 45.3%)",
        "accent-foreground": "hsl(355.7 100% 97.3%)"
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0,0,0,0.45)"
      }
    }
  },
  plugins: []
};


