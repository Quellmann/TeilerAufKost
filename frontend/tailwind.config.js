/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bgheader: '#fbfbfb',
          bg: '#f9fafb',
          text: '#1f2937',
          card: '#ffffff',
          accent: '#3b82f6',
          border: '#e5e7eb',
        },
        dark: {
          bgheader: '#151b23',
          bg: '#151b23',
          text: '#d1d7e0',
          card: '#212830',
          accent: '#3572a5',
          border: '#3d444d',
        },
      },
    },
  },
  darkMode: 'class', // Use 'class' strategy for toggling dark mode
  plugins: [],
}