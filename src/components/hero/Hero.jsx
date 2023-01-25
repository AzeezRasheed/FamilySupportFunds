import React, { useState, useEffect } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import "./hero.css";
import FirstSlideImage from "../../assets/cdc-SAwxJ8PHY3Q-unsplash.jpg";
import SecondSlideImage from "../../assets/gabriel-tovar-En1Is3KsRZw-unsplash.jpg";
import ThirdSlideImage from "../../assets/luca-baini-wwtSYc8p9cI-unsplash.jpg";

function Hero() {
  const sliderData = [
    {
      image: FirstSlideImage,
    },
    {
      image: SecondSlideImage,
    },
    {
      image: ThirdSlideImage,
    },
  ];

  const slideLength = sliderData.length;

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
          {sliderData.map((slide, index) => {
            return (
              <div
                className={` ${
                  index === currentSlide
                    ? "opacity-1   duration-700 ease translate-x-0 "
                    : "opacity-0 transition ease "
                } 
              `}
              >
                {index === currentSlide && (
                  <div className={`active relative float-left w-full h-full `}>
                    <img
                      src={slide.image}
                      alt="slide"
                      className="block w-full h-full"
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div class="absolute mx-auto  bg-gray-800 h-full w-full  opacity-70 px-4 py-6 lg:py-32 md:py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
            <div class="max-w-xl text-center sm:text-left">
              <h1 class="text-[24px] text-white font-extrabold md:text-5xl lg:text-5xl">
                Building Hope, Strength And Stability To{" "}
                <span class="block font-extrabold text-rose-700">
                  Families.
                </span>
              </h1>

              <p class="lg:mt-4 md:mt-4 max-w-lg text-[12px] text-gray-300 md:text-xl lg:text-xl sm:leading-relaxed">
                Family Support Funds transforms lives by providing practical,
                emotional and financial support to those who are experiencing
                poverty, disadvantage and social isolation across the country.
              </p>

              <div class="mt-2 lg:mt-8 md:mt-8 flex flex-wrap gap-4 text-center">
                <a
                  href="#about"
                  class="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
