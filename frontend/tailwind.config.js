/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A0E1A',
          card: '#0F1524',
          orange: '#F97316',
          blue: '#3B82F6',
          textPrimary: '#F1F5F9',
          textMuted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(249, 115, 22, 0.2), 0 0 10px rgba(249, 115, 22, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(249, 115, 22, 0.6), 0 0 25px rgba(249, 115, 22, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
