/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0a',
          900: '#121212',
          800: '#1f1f1f',
          700: '#2a2a2a',
          400: '#a3a3a3',
          200: '#e5e5e5',
        },
        lime: {
          500: '#c4ff3d',
        },
      },
      fontVariantNumeric: ['tabular-nums'],
    },
  },
  plugins: [],
};
