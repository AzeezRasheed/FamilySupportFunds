import React from "react";
import Aboutus from "../../components/about-us-and-our-vision/Aboutus";
import Hero from "../../components/hero/Hero";
import Navbar from "../../components/navbar/Navbar";
import Category from "../../components/choose-a-category/Category";
import Testimonial from "../../components/testimonial/testimonial";
import Footer from "../../components/footer/Footer";
function Home() {
  return (
    <div className="bg-white ">
      <Navbar />
      <Hero />
      <Aboutus />
      <Category />
      <Testimonial />
      <Footer />
    </div>
  );
}

export default Home;
