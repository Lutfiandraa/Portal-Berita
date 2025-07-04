/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // aktifkan dark mode berbasis class
  theme: {
    extend: {
      colors: {
        light: {
          background: '#F9FAFB',    // abu terang
          text: '#111827',          // hampir hitam (text utama)
        },
        dark: {
          background: '#1E1E20',    // 🆕 Gunmetal (mirip dark mode ChatGPT)
          surface: '#2A2A2E',       // 🆕 Lebih gelap, cocok untuk card
          text: '#F9FAFB',          // Putih lembut
        },
      },
    },
  },
  plugins: [],
};