/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pro-bg': '#e3f2fd',
        'con-bg': '#fce4ec',
      },
      keyframes: {
        flip: {
          '0%, 100%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(1800deg)' }
        },
        ellipsis: {
          '0%': { content: '.' },
          '33%': { content: '..' },
          '66%': { content: '...' },
          '100%': { content: '.' }
        }
      },
      animation: {
        flip: 'flip 2s ease-in-out',
        ellipsis: 'ellipsis 2s steps(1) infinite'
      }
    },
  },
  plugins: [],
} 