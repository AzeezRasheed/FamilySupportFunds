import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import "./hero.css";
function Hero() {
  return (
    <div className="bg-hero  w-full bg-cover bg-center ">
      <div className=" hero-overlay w-full h-full flex md:h-[600px] lg:h-[720px]  ">
        <div className="flex flex-col text-center lg:text-start md:text-start justify-center lg:justify-start md:justify-center lg:pt-[180px] md:pt-[140px] lg:pl-[80px] md:pl-[50px] h-[381px] gap-2 pt-4 lg:gap-[8] items-center md:items-start lg:items-start ">
          <h2 className="leading-[20px] text-[16px] font-inter font-semibold text-white uppercase   ">
            Better living through lottery
          </h2>

          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 mb-3 lg:mb-6  md:mb-6">
            <h1 className="font-bold leading-64px font-sen text-white text-[24px] lg:text-[45px] md:text-[40px] lg:w-[903px] md:w-[603px] ">
              THE SUSTENTATION LOTTERY GRANTS
            </h1>
            <p className="leading-[28px] font-inter text-white text-[12px] md:text-[16px] lg:text-[16px] font-normal lg:w-[599px] md:w-[550px] w-full pl-2 pr-2 md:pl-0 md:pr-0 lg:pl-0 lg:pr-0 ">
              You wouldn’t be alone if you’ve ever found yourself worrying about
              how to get help with bills or other financial expenses of your
              daily needs that pop up out of the blue. According to NBC News,
              65% of Americans lose sleep due to anxiety over finances.
            </p>
          </div>
            <a href="#about">
          <button className="flex flex-row items-start py-[16px] px-[48px] gap-[12px] bg-[#50C0FF] rounded-sm   ">
              <span className="text-[18px] font-sen items-center flex flex-row font-bold flex items-center text-[#232536] leading-[24px]   ">
                Read More <MdOutlineKeyboardArrowRight />
              </span>
          </button>
            </a>
        </div>
      </div>
    </div>
  );
}

export default Hero;
