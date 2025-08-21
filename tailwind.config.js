/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'weather-blue': '#3B82F6',
        'weather-light': '#EBF8FF',
        'weather-dark': '#1E3A8A',
      }
    },
  },
  plugins: [],
}