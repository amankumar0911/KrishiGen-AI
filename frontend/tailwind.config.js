/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        krishi: {
          50: '#f4f7f4',
          100: '#e5eee6',
          200: '#cdddcF',
          300: '#a5c4a9',
          400: '#75a47c',
          500: '#40916c',
          600: '#2d6a4f',
          700: '#1b4332',
          800: '#143326',
          900: '#081c15',
        },
        earth: {
          50: '#fbf8f3',
          100: '#f6f0e4',
          200: '#ecdcc4',
          300: '#dec29d',
          400: '#cfa675',
          500: '#bc6c25',
          600: '#9d551c',
          700: '#7e4018',
          800: '#673519',
          900: '#552d17',
        },
        wheat: {
          50: '#fdfdf6',
          100: '#faf7e6',
          200: '#f4eec7',
          300: '#ebdf9f',
          400: '#dec973',
          500: '#d4a373',
          600: '#b88252',
          700: '#96633d',
        },
        soil: '#4a3728',
        offwhite: '#fcfbf7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

