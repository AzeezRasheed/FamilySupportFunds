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
    // <div className="bg-hero  w-full bg-cover bg-center ">
    //   <div className=" hero-overlay w-full h-full flex md:h-[600px] lg:h-[720px]  ">
    //     <div className="flex flex-col text-center lg:text-start md:text-start justify-center lg:justify-start md:justify-center lg:pt-[180px] md:pt-[140px] lg:pl-[80px] md:pl-[50px] h-[381px] gap-2 pt-4 lg:gap-[8] items-center md:items-start lg:items-start ">
    //       <h2 className="leading-[20px] text-[16px] font-inter font-semibold text-white uppercase   ">
    //         Better living through lottery
    //       </h2>

    //       <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 mb-3 lg:mb-6  md:mb-6">
    //         <h1 className="font-bold leading-64px font-sen text-white text-[24px] lg:text-[45px] md:text-[40px] lg:w-[903px] md:w-[603px] ">
    //           THE SUSTENTATION LOTTERY GRANTS
    //         </h1>
    //         <p className="leading-[28px] font-inter text-white text-[12px] md:text-[16px] lg:text-[16px] font-normal lg:w-[599px] md:w-[550px] w-full pl-2 pr-2 md:pl-0 md:pr-0 lg:pl-0 lg:pr-0 ">
    //           You wouldn’t be alone if you’ve ever found yourself worrying about
    //           how to get help with bills or other financial expenses of your
    //           daily needs that pop up out of the blue. According to NBC News,
    //           65% of Americans lose sleep due to anxiety over finances.
    //         </p>
    //       </div>
    //         <a href="#about">
    //       <button className="flex flex-row items-start py-[16px] px-[48px] gap-[12px] bg-[#50C0FF] rounded-sm   ">
    //           <span className="text-[18px] font-sen items-center flex flex-row font-bold flex items-center text-[#232536] leading-[24px]   ">
    //             Read More <MdOutlineKeyboardArrowRight />
    //           </span>
    //       </button>
    //         </a>
    //     </div>
    //   </div>
    // </div>

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
                  <div
                    className={`active relative float-left w-full h-full `}
                  >
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

          <div class="absolute mx-auto max-w-screen-xl px-4 py-4 lg:py-32 md:py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
            <div class="max-w-xl text-center sm:text-left">
              <h1 class="text-[24px] text-white font-extrabold md:text-5xl lg:text-5xl">
                Building Hope, Strength And Stability To{" "}
                <span class="block font-extrabold text-rose-700">
                  Families.
                </span>
              </h1>

              <p class="lg:mt-4 md:mt-4 max-w-lg text-[12px] text-white md:text-xl lg:text-xl sm:leading-relaxed">
                Family Support Program transforms lives by providing practical,
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
