/** @type {import('tailwindcss').Config} */
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindcss(),],
}
