/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('./assets/HeroImage.png')",
        'category': "url('./assets/homepage-banner.webp')",
        'business': "url('./assets/business2.jpg')",
        'education': "url('./assets/educationsupport.jpg')",
        'personal': "url('./assets/personal.jpg')",
        'realestate': "url('./assets/realestate2.jpg')",
        'donate': "url('./assets/donate.jpg')",
        'contactus': "url('./assets/contactus.jpg')",
      },
      fontFamily: {
        "inter":['Inter', "sans-serif"],
        "sen":['Playfair Display', "serif"],
        
      },
  
    },
  },
  plugins: [],
};
