import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function Aboutus() {
  return (
    <section>
      <div className="flex flex-col lg:p-10 md:p-10 p-2 justify-center m-auto mt-8 max-w-screen-2xl ">
        <div className=" pl-2 pr-2 ">
          <div className="flex flex-row -mx-2 ">
            <div className="w-full md:w-1/2 lg:w-1/4     ">
              <div className=" h-[23px] text-sm text-grey-dark flex items-center justify-center"></div>
            </div>
            <div className="w-full lg:w-1/2  ">
              <div className=" h-[23px] text-sm bg-[#50C0FF] text-grey-dark flex items-center justify-center"></div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/4 ">
              <div className=" h-[23px] text-sm text-grey-dark bg-[#52E73A] flex items-center justify-center"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-screen-2xl m-auto  ">
          <div className=" bg-[#F4F0F8] lg:h-[500px] md:h-[500px] w-full ">
            <div className="flex flex-col lg:flex-row md:flex-row lg:p-14 md:p-14 p-8  gap-10 lg:items-start md:items-start items-center ">
              <div className="flex flex-col gap-8 lg:w-[50%] md:w-[50%] text-center lg:text-start md:text-start ">
                <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                  About us
                </h2>
                <h1 className="font-bold text-[24px] text-start lg:text-[36px] md:text-[30px] lg:leading-[48px] md:leading-[38px] tracking-[-2px] text-[#232536]  ">
                  We are a community of people who aim to give live changing
                  opportunities
                </h1>
                <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <button className="flex flex-row items-start gap-[12px] bg-transparent rounded-sm   ">
                  <span className="text-[18px] font-bold flex items-center text-[#52E73A] leading-[24px]   ">
                    Read More <MdOutlineKeyboardArrowRight />
                  </span>
                </button>
              </div>

              <div className="flex flex-col gap-8  lg:w-[50%] md:w-[50%] text-center lg:text-start md:text-start">
                <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                  Our mision
                </h2>

                <h1 className="font-bold text-[24px] text-start lg:text-[36px] md:text-[30px] lg:leading-[48px] md:leading-[38px] tracking-[-2px] text-[#232536]  ">
                Creating valuable life for people all around the world
                </h1>
                <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Aboutus;
