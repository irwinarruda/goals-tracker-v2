const { colors } = require('goals-react/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      backgroundColor: { ...colors },
      fontFamily: {
        sans: ['Roboto'],
      },
    },
  },
  plugins: [],
};
