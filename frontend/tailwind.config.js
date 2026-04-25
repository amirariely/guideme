/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        cream: '#FAF7F2',
        'warm-white': '#FEFCF9',
        sage: {
          light: '#C8DCC7',
          DEFAULT: '#8BAF8A',
          dark: '#4E7A4D',
        },
        rose: {
          light: '#F5D5CF',
          DEFAULT: '#E8A598',
        },
        midnight: '#1C2B3A',
        slate: '#3D5166',
        steel: '#6B8399',
        mist: {
          light: '#E8F0F5',
          DEFAULT: '#B8CAD6',
        },
        gold: '#C8A96E',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
