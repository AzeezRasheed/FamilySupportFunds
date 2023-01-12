/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('./assets/HeroImage.png')",
      },
    },
  },
  plugins: [],
};
