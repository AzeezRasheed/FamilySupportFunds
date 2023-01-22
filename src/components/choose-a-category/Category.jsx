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
  const text =
    "We understand that sometimes it can be difficult to cover all your expenses every month so we have developed a comprehensive directory of benefits, resources, programs and help for those that qualify. There are numerous local, state and federal government organizations, included but not limited to; charities, churches, private businesses and other companies offer a wide variety of low-income assistance programs you may be eligible for.There are several programs that can help hardship victims get help with paying your rent, utility bills, mortgage assistance, or provide foreclosure prevention. There are additional services that can help with medical bills, school loans, personal loans or related expenses, and much more.There are over 1,100 community actions agencies located across the country that provide low and moderate income families with various services. The programs and resources that are administered can provide people with short term assistance with paying their bills.";
  const shortenWord = (text) => {
    return text.substring(0, 320);
  };

  const [showMore, setShowMore] = useState(false);
  return (
    <section>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col lg:p-10 md:p-10 p-2 justify-center m-auto mt-8 gap-8">
          <div className="flex flex-col">
            <h2 className=" p-4 font-sen text-center lg:text-[36px] md:text-[30px] text-[24px] leading-[48px] font-bold capitalize text-[#232536] tracking-[1px] lg:tracking-[-2px] md:tracking-[-2px] #232536 ">
              Choose A Catagory
            </h2>
          </div>
          <div className=" mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                className={`flex  border border-solid hover:bg-blue-500 hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76] w-[296px]  items-start `}
              >
                <div className="flex flex-col justify-between gap-[1.5rem] p-4">
                  <div className="flex flex-col gap-3">
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
                    <h2 className="text-[#232536] font-sen font-bold text-[28px] leading-[40px] tracking-[-1px] ">
                      Business Lottery
                    </h2>
                    <ul className="flex flex-col font-inter list-disc pl-4 gap-2">
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Small Business Funding / Management
                      </li>
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        <li className="text-[14px] font-normal leading-[28px]  ">
                          Start-up / Expansion Business Capital
                        </li>
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Home Business Assistance
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Women-Owned Business Funding
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Small Business Loans
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Minority-Owned Business Funding
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Private Money / Venture Capital
                      </li>
                    </ul>
                  </div>
                  <a href="/category/education" className="flex items-start ">
                    <button className="flex font-sen flex-row items-center py-[16px] px-[48px] gap-[12px] bg-[#50C0FF] rounded-sm   ">
                      <span className="text-[18px] font-bold flex items-center text-[#232536] leading-[24px]   ">
                        Apply Now
                      </span>
                    </button>
                  </a>
                </div>
              </div>

              <div
                className={`flex  border border-solid hover:bg-blue-500 hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76] w-[296px]  items-start `}
              >
                <div className="flex flex-col justify-between gap-[1.5rem] p-4">
                  <div className="flex flex-col gap-3">
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
                    <h2 className="text-[#232536] font-sen font-bold text-[28px] leading-[40px] tracking-[-1px] ">
                      Education Lottery
                    </h2>
                    <ul className="flex flex-col font-inter list-disc pl-4 gap-2 pb-4">
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Federal Pell Lottery
                      </li>
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        <li className="text-[14px] font-normal leading-[28px]  ">
                          Scholarships
                        </li>
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Student Financial Aid
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Training Lottery
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Tuition Assistance
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Lottery For Research
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Stafford Loans
                      </li>
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Lottery for Universities
                      </li>
                    </ul>
                  </div>
                  <a href="/category/education" className="flex items-start ">
                    <button className="flex font-sen flex-row items-center py-[16px] px-[48px] gap-[12px] bg-[#50C0FF] rounded-sm   ">
                      <span className="text-[18px] font-bold flex items-center text-[#232536] leading-[24px]   ">
                        Apply Now
                      </span>
                    </button>
                  </a>
                </div>
              </div>

              <div
                className={`flex  border border-solid hover:bg-blue-500 hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76] w-[296px]  items-start `}
              >
                <div className="flex flex-col justify-between gap-[1.4rem] p-4">
                  <div className="flex flex-col gap-3">
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
                    <h2 className="text-[#232536] font-sen font-bold text-[28px] leading-[40px] tracking-[-1px] ">
                      Real Estate Lottery
                    </h2>
                    <ul className="flex flex-col font-inter list-disc pl-4 gap-2 pb-4">
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        1st Time Home Buyer
                      </li>
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        <li className="text-[14px] font-normal leading-[28px]  ">
                          Mobile Homes / Parks
                        </li>
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Rental Housing Projects
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Commerical Property
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Apartment Buildings
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Land Development
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        RV Parks
                      </li>
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        New Construction
                      </li>
                    </ul>
                  </div>
                  <a href="/category/real-estate" className="flex items-start ">
                    <button className="flex font-sen flex-row items-center py-[16px] px-[48px] gap-[12px] bg-[#50C0FF] rounded-sm   ">
                      <span className="text-[18px] font-bold flex items-center text-[#232536] leading-[24px]   ">
                        Apply Now
                      </span>
                    </button>
                  </a>
                </div>
              </div>

              <div
                className={`flex  border border-solid hover:bg-blue-500 hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76] w-[296px]  items-start `}
              >
                <div className="flex flex-col justify-between gap-[3.5rem] p-4">
                  <div className="flex flex-col gap-3">
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
                    <h2 className="text-[#232536] font-sen font-bold text-[28px] leading-[40px] tracking-[-1px] ">
                      Personal Assistance
                    </h2>
                    <ul className="flex flex-col font-inter list-disc pl-4 gap-2 pb-4">
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Home Repair
                      </li>
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        <li className="text-[14px] font-normal leading-[28px]  ">
                          Rent Assistance
                        </li>
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Child Care
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Food and Nutrition
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Medical Bills Assistance
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Utility Bills Assistance
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Education Assistance
                      </li>
                    </ul>
                  </div>
                  <a href="/category/personal" className="flex items-start ">
                    <button className="flex font-sen flex-row items-center py-[16px] px-[48px] gap-[12px] bg-[#50C0FF] rounded-sm   ">
                      <span className="text-[18px] font-bold flex items-center text-[#232536] leading-[24px]   ">
                        Apply Now
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:p-10 md:p-10 p-2  mt-8 m-auto gap-4 lg:gap-0 ">
          <div className=" ">
            <img src={CloseUp} alt="close-up" className="w-full  " />
          </div>
          <div className=" w-full lg:w-[706px]   md:h-[548px] lg:h-[548px] bg-white   shadow-md lg:mt-[158px] lg:-ml-80  ">
            <div className="p-10 flex flex-col gap-3">
              <h2 className=" text-[16px] font-inter leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                Why we started
              </h2>

              <h1 className="font-bold text-[30px] text-start font-sen  leading-[40px] tracking-[-2px] text-[#232536] lg:w-[546px] ">
                It started out as a simple idea and evolved into our passion.
              </h1>

              <p className="text-[#6D6E76] font-normal font-inter text-[12px]   leading-[28px] lg:w-[546px] "></p>
              {showMore ? text : `${shortenWord(text)}...`}
              <div>
                <button
                  className="flex flex-row items-start font-sen gap-[12px] bg-transparent rounded-sm   "
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? (
                    <span className="text-[18px] font-bold flex items-center text-[#52E73A] leading-[24px]   ">
                      Read Less <MdOutlineKeyboardArrowRight />
                    </span>
                  ) : (
                    <span className="text-[18px] font-bold flex items-center text-[#52E73A] leading-[24px]   ">
                      Read More <MdOutlineKeyboardArrowRight />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row md:flex-col text-center lg:text-start md:text-start lg:p-10 md:p-10 p-2 justify-center   m-auto mt-8 gap-5 lg:gap-10 items-center ">
        <div className="flex flex-col gap-1   ">
          <p className="font-normal text-[#6D6E76] font-inter leading-[20px] text-[14px]   ">
            We are
          </p>
          <h2 className=" leading-[32px] font-sen text-[#6D6E76] text-[24px] font-bold ">
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
