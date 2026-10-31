/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#faf7f2',
          100: '#f5eee3',
          200: '#ede0ce',
          300: '#dfcca9',
          400: '#cbb48b',
          500: '#b8996b',
          600: '#9d7e52',
          700: '#7e623f',
          800: '#5e482f',
          900: '#3a2d1d',
        },
        detective: {
          950: '#0c0a09',
          900: '#14110f',
          850: '#1a1613',
          800: '#231e1a',
          700: '#332b24',
          600: '#4a3f35',
          500: '#67584a',
        },
        seal: {
          red: '#8b1e1e',
          redLight: '#a82c2c',
          gold: '#c99a3e',
          darkGold: '#9c7324',
        },
        cork: {
          light: '#a68263',
          DEFAULT: '#886246',
          dark: '#5e3f28',
        }
      },
      fontFamily: {
        serif: ['"Merriweather"', 'Georgia', 'serif'],
        mono: ['"Courier Prime"', '"Special Elite"', 'Courier', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'paper': '0 4px 15px -1px rgba(0, 0, 0, 0.4), 0 2px 6px -2px rgba(0, 0, 0, 0.3)',
        'paper-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 4px 12px -3px rgba(0, 0, 0, 0.3)',
        'dossier': '0 20px 40px -10px rgba(0,0,0,0.7), inset 0 0 10px rgba(0,0,0,0.2)',
        'stamp': '0 0 0 3px rgba(139, 30, 30, 0.4), inset 0 0 8px rgba(139, 30, 30, 0.3)',
      },
      backgroundImage: {
        'cork-texture': 'radial-gradient(#886246 15%, transparent 16%), radial-gradient(#6e4d34 15%, transparent 16%)',
      }
    },
  },
  plugins: [],
}
