import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mzansi: {
          green: '#16a34a', 
          black: '#0a0a0a',
          white: '#ffffff',
        }
      }
    },
  },
  plugins: [forms, typography],
}
