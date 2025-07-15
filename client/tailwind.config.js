/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          background: '#F9FAFB',
          text: '#111827',
        },
        dark: {
          background: '#1E1E20',
          surface: '#2A2A2E',
          text: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
};