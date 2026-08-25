/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0E17",
        surface: "#141C2B",
        surfaceBorder: "#1E2B42",
        cyanNeon: "#00D2FF",
        blueElectric: "#0084FF",
        greenNeon: "#00E676",
        emeraldPotable: "#10B981",
        alertRed: "#EF4444",
        alertAmber: "#F59E0B",
        textSecondary: "#94A3B8"
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 210, 255, 0.35)',
        'glow-green': '0 0 20px rgba(0, 230, 118, 0.35)',
        'glow-blue': '0 0 25px rgba(0, 132, 255, 0.45)',
      }
    },
  },
  plugins: [],
}
