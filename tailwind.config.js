/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    fontFamily: {
      body: ['Noto Sans Myanmar', 'Raleway', 'sans-serif'],
      baronneue: 'BARONNEUE',
      'mm-sabae': 'MyanmarSabae',
      'midashi-go-pro': 'A-OTF-MidashiGoPro-MB31',
      'mm-font': 'mmFont',
    },
    extend: {
      animation: {
        tilt: 'tilt 10s infinite linear',
      },
      keyframes: {
        tilt: {
          '0%, 50%, 100%': {
            transform: 'rotate(0deg)',
            opacity: 0.75,
          },
          '25%': {
            transform: 'rotate(2deg)',
            opacity: 1,
          },
          '75%': {
            transform: 'rotate(-2deg)',
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [],
};
