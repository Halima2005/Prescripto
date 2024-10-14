/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors:{
      'primary':"#5F6FFF",
      'white':"#FFFFFF",
      'dark-faded-white': 'rgba(255, 255, 255, 0.4)',
      'indigo-50':'#EEF2FF'
    }
  },
  plugins: [],
}