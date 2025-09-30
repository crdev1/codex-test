/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 36px rgba(15, 23, 42, 0.08)',
        modal: '0 32px 64px rgba(15, 23, 42, 0.25)',
      },
      colors: {
        brand: {
          50: '#e0f2fe',
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
