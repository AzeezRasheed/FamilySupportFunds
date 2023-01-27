import React, { useState } from "react";

function Navbar() {
  const [navbar, setNavbar] = useState(false);
  return (
    <header className="top-0 z-30 w-full py-0 px-4 lg:py-4 md:py-2  bg-[#232536]  shadow-xl">
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8 pb-4 md:pb-0 lg:pb-0 ">
        <div>
          <div className="flex items-center justify-between py-0 pt-2 md:py-5 md:block">
            <a href="/">
             <div className="flex flex-col gap-1 ">
             <h1 className="text-[20px] leading-[20px] font-bold flex  font-inter  text-white text-left ">
                Family Support
              </h1>
              <h1 className="text-[20px] leading-[20px] font-bold flex  font-inter  text-white text-left ">
              Funds
              </h1>
             </div>
            </a>

            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border transition-shadow duration-150 ease-in-out "
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={`md:block   ${navbar ? "block pt-3 md:pt-0 lg:pt-0 " : "hidden"}`}>
          <div className="flex flex-col  md:flex-row lg:flex-row items-center border border-gray-800 rounded-lg bg-gray-900 p-4  md:p-0 lg:p-0 lg:border-none lg:bg-transparent md:border-none md:bg-transparent   ">
            <ul className="flex flex-col  lg:p-4 md:p-4 mt-0 items-center md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
              <li>
                <a
                  href="/"
                  className="block py-2 pl-3 pr-4 text-white text-[16px] leading-[28px] md:hover:bg-transparent md:hover:text-blue-700 md:p-0  md:dark:hover:text-blue-500  dark:hover:text-blue-50  "
                  ariaCurrent="page"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="block py-2 pl-3 pr-4 text-white text-[16px] leading-[28px] md:hover:bg-transparent md:hover:text-blue-700 md:p-0  md:dark:hover:text-blue-500  dark:hover:text-blue-50  "
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="block py-2 pl-3 pr-4  text-white text-[16px] leading-[28px md:hover:bg-transparent md:hover:text-blue-700 md:p-0  md:dark:hover:text-blue-500  dark:hover:text-blue-50  "
                >
                  Contact Us
                </a>
              </li>
              <li className="md:hidden lg:block">
                <a
                  href="/donate"
                  className="block py-2 pl-3 pr-4 text-white text-[16px] leading-[28px] md:hover:bg-transparent md:hover:text-blue-700 md:p-0  md:dark:hover:text-blue-500  dark:hover:text-blue-50  "
                  ariaCurrent="page"
                >
                  Donate
                </a>
              </li>
            </ul>
            <a
              href="/category/business"
              className="flex flex-row items-start py-[16px] px-[48px] gap-[12px] bg-white rounded-full "
            >
              <span className="text-[18px] font-bold flex items-center text-[#232536] leading-[24px]   ">
                Apply Now
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
