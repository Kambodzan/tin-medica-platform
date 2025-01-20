/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Wszystkie pliki w folderze src
    './public/index.html',       // Plik index.html (jeśli jest potrzebny)
  ],
  theme: {
    extend: {}, // Możesz dodać własne rozszerzenia w przyszłości
  },
  plugins: [],
};
