/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom light & dark palette
        light: {
          bg: '#ffffff',
          text: '#1f2937', // gray-800
          card: '#f9fafb', // gray-50
          accent: '#3b82f6', // blue-500
        },
        dark: {
          bg: '#1f2937', // gray-800
          text: '#f9fafb', // gray-50
          card: '#374151', // gray-700
          accent: '#3b82f6', // blue-500
        },
      },
    },
  },
  darkMode: 'class', // Use 'class' strategy for toggling dark mode
  plugins: [],
}