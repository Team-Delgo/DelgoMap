/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      scrollbarHide: {
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
      boxShadow: {
        '1': '0px 0px 5px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
};
