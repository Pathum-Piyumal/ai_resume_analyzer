/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}", // Broad scan for safety
    "!./node_modules/**",     // Exclude node modules
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#060814',
          card: '#0D1121',
          blue: '#2563EB',
          lightBlue: '#60A5FA',
          textPrimary: '#F8FAFC',
          textMuted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
