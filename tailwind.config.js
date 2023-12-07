/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{html,js,tsx}",
    "./src/components/*.{html,js,tsx}",
  ],
  theme: {
    fontFamily: {
      vietnam: `'Be Vietnam Pro', sans-serif`,
      roboto: `'Roboto', sans-serif`,
    },
    extend: {},
  },
  plugins: [],
};
