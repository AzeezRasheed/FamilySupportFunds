/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('./assets/HeroImage.png')",
        'category': "url('./assets/homepage-banner.webp')",
        'donate': "url('./assets/IMG-20230122-WA0008.jpg')",
      },
      fontFamily: {
        "inter":['Inter', "sans-serif"],
        "sen":['Playfair Display', "serif"],
        
      },
  
    },
  },
  plugins: [],
};
