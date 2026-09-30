/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marvel: {
          red: '#E62429',
          darkRed: '#990000',
          dark: '#0F1016',
          card: '#181924',
          border: '#2A2C3D',
        }
      }
    },
  },
  plugins: [],
}
