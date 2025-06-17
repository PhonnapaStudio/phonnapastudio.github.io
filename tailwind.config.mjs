// tailwind.config.mjs
import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}', // scan component & page files
    './public/**/*.html', // optional if you use static HTML
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f78cbc',
        'primary-light': '#e8d9f1',
        accent: '#ffadc3',
        'accent-light': '#fbcff4',
        soft: '#f5f0fa',
      },
    },
  },
  plugins: [],
})
