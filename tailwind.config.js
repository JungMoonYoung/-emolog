/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#FDE68A',
        success: '#10B981',
        warning: '#FB923C',
        danger: '#DC2626',
      },
    },
  },
  plugins: [],
}