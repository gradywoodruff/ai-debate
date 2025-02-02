/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'pro-bg': '#e3f2fd',
        'con-bg': '#fce4ec',
      },
      keyframes: {
        flip: {
          '0%, 100%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(1800deg)' }
        },
        ellipsis1: {
          '0%, 100%': { opacity: 0 },
          '25%, 50%, 75%': { opacity: 1 },
        },
        ellipsis2: {
          '0%, 25%, 100%': { opacity: 0 },
          '50%, 75%': { opacity: 1 },
        },
        ellipsis3: {
          '0%, 25%, 50%, 100%': { opacity: 0 },
          '75%': { opacity: 1 },
        },
      },
      animation: {
        flip: 'flip 2s ease-in-out',
        'ellipsis1': 'ellipsis1 2s infinite',
        'ellipsis2': 'ellipsis2 2s infinite',
        'ellipsis3': 'ellipsis3 2s infinite',
      }
    },
  },
  plugins: [],
} 