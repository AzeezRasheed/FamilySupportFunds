import React, { useState, useEffect } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import "./hero.css";
import FirstSlideImage from "../../assets/cdc-SAwxJ8PHY3Q-unsplash.jpg";
import SecondSlideImage from "../../assets/gabriel-tovar-En1Is3KsRZw-unsplash.jpg";
import ThirdSlideImage from "../../assets/luca-baini-wwtSYc8p9cI-unsplash.jpg";

function Hero() {
  // const sliderData = [
  //   {
  //     image: FirstSlide,
  //   },
  //   {
  //     image: SecondSlide,
  //   },
  //   {
  //     image: ThirdSlide,
  //   },
  // ];

  const slideLength = 3;

  const autoScroll = true;
  let slideInterval;
  let intervalTime = 5000;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  function auto() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      auto();
    }
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  return (
    <section>
      <div className="carousel slide relative   ">
        <div className="carousel-inner relative w-full overflow-hidden h-full ">
         
              <div
                className={` 
              `}
              >
                
              
  

          <div className={`  ${
                   currentSlide === 0 && "bg-herobg1 bg-cover object-cover bg-center opacity-1  w-full  duration-700 ease translate-x-0 "
                } 

                ${
                  currentSlide === 1 && "bg-herobg2 bg-cover object-cover bg-center opacity-1    duration-700 ease translate-x-0 "
               } 
               ${
                currentSlide === 2 && "bg-herobg3 bg-cover object-cover bg-center opacity-1  duration-700 ease translate-x-0 "
             } 
                 transition ease  `}>
         <div mx-auto className="relative mx-auto bg-gray-800 h-full w-full  opacity-60 px-4 py-32  sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
         <div className="max-w-xl text-center sm:text-left">
              <h1 className="text-[24px] text-white font-extrabold md:text-5xl lg:text-5xl">
                Building Hope, Strength And Stability To{" "}
                <span className="block font-extrabold text-rose-700">
                  Families.
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-[12px] text-gray-300 md:text-xl lg:text-xl sm:leading-relaxed">
                Family Support Funds transforms lives by providing practical,
                emotional and financial support to those who are experiencing
                poverty, disadvantage and social isolation across the country.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 text-center">
                <a
                  href="#about"
                  className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
                >
                  Learn More
                </a>
              </div>
            </div>
         </div>
          </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
