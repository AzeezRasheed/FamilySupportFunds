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
          <div className=" bg-[#FBF6EA] lg:h-[500px]  w-full ">
            <div className="relative flex flex-col lg:flex-row md:flex-col lg:p-20 md:p-14 p-8  gap-10 lg:items-start md:items-start  items-center ">
              <div className=" lg:w-[50%] flex flex-col lg:p-8 gap-8 text-center lg:text-start md:text-start">
                <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                  TESTIMONIALs
                </h2>

                <h1 className="font-bold text-[20px] text-start lg:text-[28px] md:text-[24px] lg:leading-[40px] md:leading-[38px] tracking-[-1px] text-[#232536] lg:w-[345px] ">
                  What people say about our lottery programmes
                </h1>
                <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] lg:w-[349px] ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor.
                </p>
              </div>

              <div className="absolute left-[50%] rotate-90 pt-80">
                {" "}
                <div className="  w-[310px] h-full  opacity-40 bg-white border border-solid border-[#6D6E76] hidden md:hidden lg:block"></div>
              </div>
              <div className="lg:pl-6 lg:pt-6 lg:w-[50%] ">
                {list.map((item, index) => (
                  <div
                    class={`carousel text-start slide relative carousel-dark flex flex-col font-bold text-[#232536] gap-10 lg:gap-20 ${
                      index === state ? "block" : "hidden"
                    }`}
                    data-bs-ride="carousel"
                    key={index}
                  >
                    <div class="carousel-inner relative w-full overflow-hidden">
                      <div class="carousel-item active relative float-left w-full text-start h-[138px] ">
                        <p class="text-xl italic mx-auto text-[#232536] max-w-4xl">
                          {item.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex lg:flex-row md:flex-row flex-col gap-8 lg:gap-0 md:gap-0   justify-between items-center ">
                      <div className="flex flex-row items-center  gap-4 ">
                        <div class=" flex justify-center">
                          <img
                            src={item.pic}
                            className="rounded-full w-14 h-14 shadow-lg"
                            alt="sampleimage"
                          />
                        </div>
                        <p class="text-gray-500">-{item.name}</p>
                      </div>
                      <div className="flex flex-row gap-8 items-center ">
                        <button
                          type="button"
                          className="carousel-control-prev bg-white text-black rounded-full p-4"
                          onClick={handlePrevItem}
                        >
                          <span
                            class="carousel-control-prev-icon  bg-no-repeat"
                            aria-hidden="true"
                          ></span>
                          <span class="visually-hidden">
                            {" "}
                            <FaArrowLeft />{" "}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="carousel-control-next bg-black text-white rounded-full p-4"
                          onClick={handleNextItem}
                        >
                          <span
                            class="carousel-control-next-icon  bg-no-repeat"
                            aria-hidden="true"
                          ></span>
                          <span class="visually-hidden">
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

      <div className="flex flex-col lg:p-10 md:p-10 p-2 mb-8 lg:mb-12 justify-center text-center m-auto mt-8 lg:w-[461px] md:w-[461px] gap-4 pb-20">
        <h1 className="font-bold text-[20px] text-center lg:text-[28px] md:text-[24px] lg:leading-[40px] md:leading-[38px] tracking-[-1px] text-[#232536]  ">
          Your are one step away from a lifetime opportunity
        </h1>
        <p className="text-[#6D6E76] text-center font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] lg:w-[349px] ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor.
        </p>
        <div>
          <a href="/category/business">
            <button className="flex flex-row items-start gap-[12px] m-auto  rounded-sm  bg-[#50C0FF] py-[16px] px-[48px] ">
              <span className="text-[18px] font-bold flex items-center text-[#232536]  leading-[24px]   ">
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
