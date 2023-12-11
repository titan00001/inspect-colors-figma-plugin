/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/UI/*.{html,js,tsx}",
    "./src/UI/components/**/*.{html,js,tsx}",
    "./src/UI/pages/**/*.{html,js,tsx}",
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
