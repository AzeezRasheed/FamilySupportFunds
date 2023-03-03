import React from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";

function Donate() {
  return (
    <section className="bg-white flex flex-col  justify-center m-auto ">
      <Navbar />

      <div className=" bg-donate lg:h-[400px] w-full  bg-cover object-cover bg-center">
        <div className="flex flex-col lg:p-14 md:p-14 p-20 pt-30 lg:pt-32 gap-4  items-center bg-gray-800 h-full opacity-70 w-full">
          <h1 className="font-bold text-[30px] text-center font-sen lg:text-[48px] md:text-[40px] lg:leading-[-2px] md:leading-[48px] leading-[40px] tracking-[2px] text-slate-100 capitalize  ">
            Donate
          </h1>
        </div>
      </div>

      <div>
        <div className="flex flex-col lg:p-10 md:p-10 p-2 mb-8 lg:mb-12 justify-center text-center m-auto mt-8  gap-4 pb-20">
      <div className=" items-center m-auto flex max-w-[800px]  w-full">
      <div className="flex flex-col gap-4   text-start items-start">
        <h1 className="font-bold text-[20px] font-sen  lg:text-[28px] md:text-[24px] lg:leading-[40px] md:leading-[38px] tracking-[-1px] text-[#232536]  ">
            Help Us Help Others
          </h1>
          <hr className="h-[2px]   bg-orange-500 md:w-[650px] lg:w-[800px] w-[310px] " />
        </div>
      </div>
          <div className="flex flex-col gap-8 text-start m-auto max-w-[800px]">
            <p className="text-[#6D6E76] font-inter  font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px]  ">
              Your generosity makes a significant difference in the lives of the
              children, youth and families we work with every day.
            </p>
            <p className="text-[#6D6E76] font-inter  font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px]  ">
              Family Support Funds is a Not For Profit Organisation,
              a Public Benevolent Institution, and is endorsed as a Deductible
              Gifts Recipient.
            </p>

            <p className="text-[#6D6E76] font-inter font-bold  text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px]  ">
              If you would like to support our work kindly send us a mail at{" "}
              <span className="text-orange-500"><a href="mailto:info@familysupportfunds.org">info@familysupportfunds.org</a></span>
            </p>
          </div>
       
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default Donate;
