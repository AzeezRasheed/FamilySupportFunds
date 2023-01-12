import React, { useState } from "react";
import FIcon from "../../assets/FIcon.png";
import SIcon from "../../assets/SIcon.png";
import TIcon from "../../assets/TIcon.png";
import FthIcon from "../../assets/FthIcon.png";
import CloseUp from "../../assets/close-up.png";
import Logo1 from "../../assets/Logo 1.png";
import Logo2 from "../../assets/Logo 2.png";
import Logo3 from "../../assets/Logo 3.png";
import Logo4 from "../../assets/Logo 4.png";
import Logo5 from "../../assets/Logo 5.png";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function Category() {
  const [isActive, setIsActive] = useState(false);
  return (
    <section>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col lg:p-10 md:p-10 p-2 justify-center m-auto mt-8 gap-8">
          <div className="flex flex-col">
            <h2 className=" p-4 text-center lg:text-[36px] md:text-[30px] text-[24px] leading-[48px] font-bold capitalize text-[#232536] tracking-[1px] lg:tracking-[-2px] md:tracking-[-2px] #232536 ">
              Choose A Catagory
            </h2>
          </div>
          <div className=" mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="/category/business"
                className={`flex  border border-solid hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76] w-[296px] h-[228px] items-start `}
              >
                <div className="flex flex-col gap-4 p-4">
                  <div
                    className={`w-[48px] h-[48px] ${
                      isActive ? "bg-transparent" : "bg-[#FBF6EA]"
                    }  flex rounded `}
                  >
                    <img
                      src={FIcon}
                      alt="FIcon"
                      className="w-[48px] h-[48px] align-middle m-auto flex  "
                    />
                  </div>
                  <h2 className="text-[#232536] font-bold text-[28px] leading-[40px] tracking-[-1px] ">
                    Business Lottery
                  </h2>
                  <p className="text-[16px] font-normal leading-[28px]  ">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  </p>
                </div>
              </a>

              <a href="/category/education"
                className={`flex  border border-solid hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76] w-[296px] h-[228px] items-start `}
              >
                <div className="flex flex-col gap-4 p-4">
                  <div
                    className={`w-[48px] h-[48px] ${
                      isActive ? "bg-transparent" : "bg-[#FBF6EA]"
                    }  flex rounded `}
                  >
                    <img
                      src={SIcon}
                      alt="SIcon"
                      className="w-[23px] h-[23px] align-middle m-auto flex  "
                    />
                  </div>
                  <h2 className="text-[#232536] font-bold text-[28px] leading-[40px] tracking-[-1px] ">
                    Education Lottery
                  </h2>
                  <p className="text-[16px] font-normal leading-[28px]  ">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  </p>
                </div>
              </a>

              <a href="/category/real-estate"
                className={`flex  border border-solid hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76] w-[296px] h-[228px] items-start `}
              >
                <div className="flex flex-col gap-4 p-4">
                  <div
                    className={`w-[48px] h-[48px] ${
                      isActive ? "bg-transparent" : "bg-[#FBF6EA]"
                    }  flex rounded `}
                  >
                    <img
                      src={TIcon}
                      alt="TIcon"
                      className="w-[48px] h-[48px] align-middle m-auto flex  "
                    />
                  </div>
                  <h2 className="text-[#232536] font-bold text-[28px] leading-[40px] tracking-[-1px] ">
                    Real Estate Lottery
                  </h2>
                  <p className="text-[16px] font-normal leading-[28px]  ">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  </p>
                </div>
              </a>

              <a href="/category/technology"
                className={`flex  border border-solid hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76] w-[296px] h-[228px] items-start `}
              >
                <div className="flex flex-col gap-4 p-4">
                  <div
                    className={`w-[48px] h-[48px] ${
                      isActive ? "bg-transparent" : "bg-[#FBF6EA]"
                    }  flex rounded `}
                  >
                    <img
                      src={FthIcon}
                      alt="FthIcon"
                      className="w-[48px] h-[48px] align-middle m-auto flex  "
                    />
                  </div>
                  <h2 className="text-[#232536] font-bold text-[28px] leading-[40px] tracking-[-1px] ">
                    Technology Lottery
                  </h2>
                  <p className="text-[16px] font-normal leading-[28px]  ">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:p-10 md:p-10 p-2  mt-8 m-auto gap-4 lg:gap-0 ">
          <div className=" ">
            <img src={CloseUp} alt="close-up" className="w-full  " />
          </div>
          <div className=" w-full lg:w-[706px]   md:h-[548px] lg:h-[548px] bg-white   shadow-md lg:mt-[158px] lg:-ml-80  ">
            <div className="p-10 flex flex-col gap-6">
              <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                Why we started
              </h2>

              <h1 className="font-bold text-[30px] text-start lg:text-[48px] md:text-[40px] lg:leading-[64px] md:leading-[48px] leading-[40px] tracking-[-2px] text-[#232536] lg:w-[546px] ">
                It started out as a simple idea and evolved into our passion
              </h1>

              <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px]  leading-[28px] lg:w-[546px] ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip.
              </p>

              <div>
                <button className="flex flex-row items-start py-[16px] px-[48px] gap-[12px] bg-[#50C0FF] rounded-sm   ">
                  <span className="text-[12px] font-bold flex items-center text-[#232536] bg-[#50C0FF] leading-[24px]   ">
                    Discover our story <MdOutlineKeyboardArrowRight />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row md:flex-col text-center lg:text-start md:text-start lg:p-10 md:p-10 p-2 justify-center   m-auto mt-8 gap-5 lg:gap-10 items-center ">
        <div className="flex flex-col gap-1  ">
          <p className="font-normal text-[#6D6E76] leading-[20px] text-[14px]   ">
            We are
          </p>
          <h2 className=" leading-[32px] text-[#6D6E76] text-[24px] font-bold ">
            Featured in
          </h2>
        </div>
        <div className="flex flex-col md:flex-col lg:flex-row lg:gap-14 pt-4 md:gap-4 gap-4">
          <div className="flex flex-col gap-4 md:flex-row  md:gap-14 ">
            <img src={Logo1} alt="logo1" className="w-[160px] h-[32px] " />
            <img src={Logo2} alt="logo2" className="w-[136px] h-[32px] " />
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:gap-14">
            <img src={Logo3} alt="logo3" className="w-[135px] h-[32px] " />
            <img src={Logo4} alt="logo4" className="w-[153px] h-[32px] " />
          </div>
          <div>
            <img src={Logo5} alt="logo5" className="w-[136px] h-[32px] " />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Category;
