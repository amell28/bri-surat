/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        briBlue: '#014181',
        briOrange: '#FF7401',
      }
    },
  },
  plugins: [],
}