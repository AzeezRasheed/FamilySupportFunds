/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('./assets/HeroImage.png')",
        'category': "url('./assets/homepage-banner.webp')",
        'contactus': "url('./assets/contactus.jpg')",
        'business': "url('./assets/business2.jpg')",
        'education': "url('./assets/educationsupport.jpg')",
        'personal': "url('./assets/personal.jpg')",
        'realestate': "url('./assets/realestate2.jpg')",
        'donate': "url('./assets/donate.jpg')",
        'herobg1': "url('./assets/cdc-SAwxJ8PHY3Q-unsplash.jpg')",
        'herobg2': "url('./assets/gabriel-tovar-En1Is3KsRZw-unsplash.jpg')",
        'herobg3': "url('./assets/luca-baini-wwtSYc8p9cI-unsplash.jpg')",
      },
      fontFamily: {
        "inter":['Inter', "sans-serif"],
        "sen":['Playfair Display', "serif"],
        
      },
  
    },
  },
  plugins: [],
};
