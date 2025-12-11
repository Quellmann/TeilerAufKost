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
          text: '#1f2937', // gray-800
          card: '#ffffff', // gray-50
          accent: '#3b82f6', // blue-500
          border: '#e5e7eb', // gray-200
        },
        dark: {
          bgheader: '#151b23', // gray-900
          bg: '#151b23', // gray-800
          text: '#d1d7e0', // gray-50
          card: '#212830', // gray-700
          accent: '#3572a5', // blue-500
          border: '#3d444d', // gray-600
        },
        // dark: {
        //   bgheader: '#161f2e', // gray-900
        //   bg: '#0f1828', // gray-800
        //   text: '#f9fafb', // gray-50
        //   card: '#161f2e', // gray-700
        //   accent: '#3b82f6', // blue-500
        // },
      },
    },
  },
  darkMode: 'class', // Use 'class' strategy for toggling dark mode
  plugins: [],
}