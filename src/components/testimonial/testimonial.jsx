import React, { useState } from "react";
import data from "./data";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
function Testimonial() {
  const [state, setState] = useState(0);
  const list = data;
  const length = list.length;

  const handlePrevItem = () => {
    const newIndex = state - 1;
    setState(newIndex < 0 ? length - 1 : newIndex);
  };

  const handleNextItem = () => {
    const newIndex = state + 1;
    setState(newIndex >= length ? 0 : newIndex);
  };

  return (
    <section>
      <div className="flex flex-col lg:p-10 md:p-10 p-2 justify-center m-auto mt-8 max-w-screen-2xl">
        <div className="flex flex-col items-center justify-center w-full max-w-screen-2xl m-auto  ">
          <div className=" bg-[#FBF6EA] lg:h-[500px] h-full  w-full ">
            <div className="relative flex h-full flex-col lg:flex-row md:flex-col lg:p-20 md:p-14 p-8  gap-10 lg:items-start md:items-start  items-center ">
              <div className=" lg:w-[50%] flex flex-col lg:p-8  lg:pt-20 gap-8 text-center lg:text-start md:text-start">
                <h2 className=" text-[16px] leading-[20px] font-inter font-semibold capitalize text-[#232536]  tracking-[3px] ">
                  TESTIMONIALs
                </h2>

                <h1 className="font-bold text-[20px] font-sen text-start lg:text-[28px] md:text-[24px] lg:leading-[40px] md:leading-[38px] tracking-[-1px] text-[#232536] lg:w-[345px] ">
                  What people say about our programmes
                </h1>
              </div>

              <div className="absolute left-[50%] rotate-90 pt-80">
                {" "}
                <div className="  w-[310px] h-full  opacity-40 bg-white border border-solid border-[#6D6E76] hidden md:hidden lg:block"></div>
              </div>
              <div className="lg:pl-6 lg:pt-6 lg:w-[50%] ">
                {list.map((item, index) => (
                  <div
                    className={`carousel text-start slide relative carousel-dark flex flex-col font-bold text-[#232536] gap-10 lg:gap-20 ${
                      index === state ? "block" : "hidden"
                    }`}
                    data-bs-ride="carousel"
                    key={index}
                  >
                    <div className="carousel-inner lg:h-[90px] relative w-full overflow-hidden">
                      <div className="carousel-item active relative float-left w-full text-start lg:pb-2 ">
                        <p className="text-xl italic mx-auto text-[#232536] font-sen max-w-4xl">
                          {item.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex lg:flex-row md:flex-row flex-col gap-8 lg:gap-0 md:gap-0   justify-between items-center ">
                      <div className="flex flex-row items-center  gap-4 ">
                        <div className=" flex justify-center">
                          <img
                            src={item.pic}
                            className="rounded-sm w-24 h-24 shadow-lg"
                            alt="sampleimage"
                          />
                        </div>
                        <p className="text-gray-500 font-sen">-{item.name}</p>
                      </div>
                      <div className="flex flex-row gap-8 items-center ">
                        <button
                          type="button"
                          className="carousel-control-prev bg-white text-black hover:bg-black hover:text-white hover:ease-in hover:transition hover:duration-700  rounded-full p-4"
                          onClick={handlePrevItem}
                        >
                          <span
                            className="carousel-control-prev-icon  bg-no-repeat"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">
                            {" "}
                            <FaArrowLeft />{" "}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="carousel-control-next bg-white text-black hover:bg-black hover:text-white hover:ease-in hover:transition hover:duration-700 rounded-full p-4"
                          onClick={handleNextItem}
                        >
                          <span
                            className="carousel-control-next-icon  bg-no-repeat"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">
                            <FaArrowRight />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:p-10 md:p-10 p-2 mb-8 lg:mb-12 justify-center text-center m-auto mt-8  gap-4 pb-20">
        <h1 className="font-bold text-[20px] font-sen text-center lg:text-[28px] md:text-[24px] lg:leading-[40px] md:leading-[38px] tracking-[-1px] text-[#232536]  ">
          Get Help From Family Support Funds
        </h1>
        <hr className="h-[2px] w-full  bg-orange-500 max-w-[600px] m-auto items-center " />
        <div className="flex flex-col gap-2 text-start m-auto max-w-[800px]">
          <p className="text-[#6D6E76] font-inter  font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px]  ">
            Family Support Funds provides financial support to more than a
            million people each year. We are the pantry to U.S charity sector,
            providing financial support to 2,950 frontline charities.
          </p>
          <p className="text-[#6D6E76] font-inter  font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px]  ">
            We know one in three people struggling to provide for their
            household needs are new to the situation.
          </p>
          <p className="text-[#6D6E76] font-inter  font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px]  ">
            There is no shame in asking for help. Life happens to us all and
            we’re here for everyone.
          </p>
          <p className="text-[#6D6E76] font-inter  font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px]  ">
            Through our wonderful charity partners, we’re able to provide 1.2
            million financial aid in a month to people in need. People like
            Mandy, who has struggled to find work to provide for her family due
            to ongoing health issues. And Deb, a loving Grandmother who’s cancer
            diagnosis has put her in a position where she struggles to access a
            steady income.{" "}
          </p>
        </div>
        <div>
          <a href="/category/business">
            <button className="flex flex-row items-start gap-[12px] m-auto  rounded-sm  bg-[#50C0FF] py-[16px] px-[48px] ">
              <span className="text-[18px] font-sen font-bold flex items-center text-[#232536]  leading-[24px]   ">
                join now
              </span>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
