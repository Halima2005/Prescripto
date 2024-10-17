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
      'indigo-50':'#EEF2FF',
      'gray-200':'#e5e7eb',
      'red-400':'#f87171',
      'gray-100':'#f3f4f6',
      'green-400':'#4ade80',
      'gray-600':'#4b5563'
    }
  },
  plugins: [],
}