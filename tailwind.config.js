/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Beige / Warm Theme Palette (with Blue Accents)
        background: '#F5F5F0', // Slightly darker warm beige for visibility
        surface: '#F5F5F0',    // Matching surface
        primary: '#3B82F6',    // Reverted to Blue-500
        secondary: '#A89F91',  // Warm gray
        income: '#10B981',     // Keep green for income
        expense: '#F59E0B',    // Reverted to Amber-500 for better contrast with blue
        text: {
          primary: '#44403C',   // Warm dark gray (Stone-700)
          secondary: '#78716C', // Warm medium gray (Stone-500)
        },
        border: '#E7E5E4',      // Stone-200

        // Retain dark tokens to prevent build errors if referenced, but map them to light equivalents or ignore
        dark: {
          background: '#FAF9F6',
          surface: '#FFFFFF',
          primary: '#8B7355',
          text: {
            primary: '#44403C',
            secondary: '#78716C',
          },
          border: '#E7E5E4',
        }
      },
      fontFamily: {
        sans: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
