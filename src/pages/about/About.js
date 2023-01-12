import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Overview from "../../assets/Overview.png";
import KnowAUs from "../../assets/ground-group-growth-hands-461049.png";
import WhyWSTB from "../../assets/three-persons-sitting-on-the-stairs-talking-with-each-other-1438072.png";
import TeamMembers from "../../components/team-members/Team-Members";
function About() {
  return (
    <div className="bg-white ">
      <Navbar />
      <section className="flex flex-col lg:p-10 md:p-10 p-2 justify-center m-auto mt-8">
        <div className="z-40 flex">
          <div className="items-center m-auto max-w-[1133px] h-[300px]  lg:h-[356px] md:h-[356px] lg:-mb-20 md:-mb-20  w-full flex flex-col lg:flex-row md:flex-row gap-4 lg:gap-0 md:gap-0  ">
            <div className="lg:w-[50%] md:w-[50%] flex flex-col gap-4 lg:h-[356px] lg:p-10 md:p-8 bg-white ">
              <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                About us
              </h2>

              <h1 className="font-bold text-[30px] text-start lg:text-[48px] md:text-[40px] lg:leading-[64px] md:leading-[48px] leading-[40px] tracking-[-2px] text-[#232536]  ">
                We are a team of content writers who share their learnings
              </h1>
            </div>
            <div className="lg:w-[50%] md:w-[50%] mb-28 ">
              <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px]  leading-[28px]  ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col max-w-[1280px] m-auto lg:mb-14 md:mb:14 ">
          <div class="w-full  rounded ">
            <img src={Overview} alt="image1" />
          </div>
          <div className="flex flex-col items-center justify-center w-full max-w-screen-2xl m-auto  ">
            <div className=" bg-[#F4F0F8] lg:h-[500px] md:h-[500px] w-full ">
              <div className="flex flex-col lg:flex-row md:flex-row p-10  pt-14 gap-10 lg:items-start md:items-start items-center pb-8">
                <div className="flex flex-col gap-8 lg:w-[50%] md:w-[50%] text-center lg:text-start md:text-start ">
                  <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                    Our mision
                  </h2>
                  <h1 className="font-bold text-[24px] text-center md:text-start lg:text-start lg:text-[36px] md:text-[30px] lg:leading-[48px] md:leading-[38px] tracking-[-2px] text-[#232536]  ">
                    Creating valuable content for creatives all around the world
                  </h1>
                  <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Non blandit massa enim nec. Scelerisque viverra
                    mauris in aliquam sem. At risus viverra adipiscing at in
                    tellus.
                  </p>
                </div>

                <div className="flex  flex-col gap-8 lg:w-[50%] md:w-[50%] text-center lg:text-start md:text-start">
                  <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                    Our Vision
                  </h2>

                  <h1 className="font-bold text-[24px] text-center md:text-start lg:text-start lg:text-[36px] md:text-[30px] lg:leading-[48px] md:leading-[38px] tracking-[-2px] text-[#232536]  ">
                    A platform that empowers individuals to improve
                  </h1>
                  <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Non blandit massa enim nec. Scelerisque viverra
                    mauris in aliquam sem. At risus viverra adipiscing at in
                    tellus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row ">
          <div className="flex flex-col items-center justify-center w-full max-w-screen-2xl m-auto  ">
            <div className="  lg:h-[500px] md:h-[500px] w-full ">
              <div className="flex flex-col lg:flex-row md:flex-row lg:pt-14 md:pt-14 pt-8  gap-10 lg:items-start md:items-start items-center ">
                <div className="flex flex-col p-4 gap-8 lg:w-[50%] md:w-[50%] text-center lg:text-start md:text-start ">
                  <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                    Our team of creatives
                  </h2>
                  <h1 className="font-bold text-[24px] text-start lg:text-[24px] md:text-[24px] lg:leading-[32px] md:leading-[32px] tracking-[-2px] text-[#232536]  ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt.
                  </h1>
                  <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat.
                  </p>
                </div>

                <div class="w-full lg:w-[50%] md:w-[50%]  rounded ">
                  <img src={KnowAUs} alt="image1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row ">
          <div className="flex flex-col items-center justify-center w-full max-w-screen-2xl m-auto  ">
            <div className="  lg:h-[500px] md:h-[500px] w-full ">
              <div className="flex flex-col lg:flex-row md:flex-row lg:pt-14 md:pt-14 pt-8  gap-10 lg:items-start md:items-start items-center ">
                <div class="w-full lg:w-[50%] md:w-[50%]  rounded ">
                  <img src={WhyWSTB} alt="image1" />
                </div>
                <div className="flex flex-col p-4 gap-8 lg:w-[50%] md:w-[50%] text-center lg:text-start md:text-start ">
                  <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                    Why we started this Blog
                  </h2>
                  <h1 className="font-bold text-[24px] text-start lg:text-[24px] md:text-[24px] lg:leading-[32px] md:leading-[32px] tracking-[-2px] text-[#232536]  ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt.
                  </h1>
                  <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TeamMembers/>
      </section>
      <Footer />
    </div>
  );
}

export default About;
