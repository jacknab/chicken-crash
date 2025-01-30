/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'win-notification': 'win-notification 4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
      }
    },
  },
  plugins: [],
};
