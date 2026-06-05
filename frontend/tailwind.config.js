/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Using rgba(var(...), <alpha-value>) so Tailwind opacity modifiers work with comma-separated RGB triplets.
          dark:        'rgba(var(--brand-dark), <alpha-value>)',
          card:        'rgba(var(--brand-card), <alpha-value>)',
          blue:        '#2563EB',
          lightBlue:   'rgba(var(--brand-light-blue), <alpha-value>)',
          textPrimary: 'rgba(var(--brand-text-primary), <alpha-value>)',
          textMuted:   'rgba(var(--brand-text-muted), <alpha-value>)',
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
