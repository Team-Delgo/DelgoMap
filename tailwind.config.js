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
        1: '0px 0px 5px rgba(0, 0, 0, 0.15)',
      },
      keyframes: {
        backButton: {
          '0%': {
            backgroundColor: '#f3efea',
          },
          '100%': {
            backgroundColor: '#c9c4bf',
          },
        },
        signupcomplete: {
          '0%': {
            transform: 'scale(0.5)',
          },
          '50%': {
            transform: 'scale(1.2)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        checkboxCheck: {
          '0%': {
            transform: 'scale(0.5)',
          },
          '50%': {
            transform: 'scale(1.1)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        buttonMount: {
          '0%': {
            top: 'calc(60%)',
            opacity: '0',
          },
          '100%': {
            top: 'calc(50%)',
            opacity: '1',
          },
        },
        buttonUnMount: {
          '0%': {
            top: 'calc(50%)',
            opacity: '1',
          },
          '99%': {
            display: 'flex',
            top: 'calc(60%)',
            opacity: '0',
          },
          '100%': {
            display: 'none',
            top: 'calc(60%)',
            opacity: '0',
          },
        },
      },
      animation: {
        backButton: 'backButton 0.1s ease ',
        signupcomplete: 'signupcomplete 0.5s',
        checkboxCheck: 'checkboxCheck 0.3s ease-out',
        buttonMount: 'buttonMount 0.3s ease-in-out',
        buttonUnMount: 'buttonUnMount 0.3s ease-in-out',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
