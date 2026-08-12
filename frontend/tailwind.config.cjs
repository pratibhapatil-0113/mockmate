/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          450: '#6366f1'
        }
      },
      borderRadius: {
        '3xl': '1.5rem'
      }
    }
  },
  plugins: []
};
