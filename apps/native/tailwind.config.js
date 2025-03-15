const { colors, fontSizes, roundeds } = require('goals-react/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      backgroundColor: { ...colors },
      borderColor: { ...colors },
      fontSize: { ...fontSizes },
      textColor: { ...colors },
      borderRadius: { ...roundeds },
      fontFamily: {
        sans: ['Roboto'],
      },
    },
  },
  plugins: [],
};
