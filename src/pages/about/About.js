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
        <div className="z-40 flex md:pb-20">
          <div className="items-center  m-auto max-w-[1133px] h-full lg:h-[356px] md:h-[356px] lg:-mb-20 md:-mb-20  w-full flex flex-col lg:flex-row md:flex-row gap-4 lg:gap-0 md:gap-0  ">
            <div className="lg:w-[50%] md:w-[50%] flex flex-col gap-4 lg:h-[356px] lg:p-10 md:p-8 md:pt-0 bg-white ">
              <h2 className=" text-[16px] font-inter leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                About us
              </h2>

              <h1 className="font-bold text-[26px] font-inter text-start lg:text-[40px] md:text-[35px] lg:leading-[64px] md:leading-[48px] leading-[40px] tracking-[-2px] text-[#232536]  ">
                We are a community of people who aim to give live changing
                opportunities
              </h1>
            </div>
            <div className="lg:w-[50%] md:w-[50%] lg:mb-28 md:mb-28 mb-10 md:pt-10 ">
              <p className="text-[#6D6E76] font-inter font-normal text-[12px] lg:text-[16px] md:text-[16px]  leading-[28px]  ">
                Families come in all shapes and sizes. No matter how they are
                constructed, Family Support Funds is committed to supporting
                them to realise their potential. All families encounter
                difficult and challenging times and many will find ways to deal
                with their problems, getting the support they need from friends
                and relatives.FSF works to tackle some of the most complex and
                difficult issues facing families today – including financial
                hardship, mental health problems, social isolation, learning
                disabilities, domestic abuse, or substance misuse and alcohol
                problems.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col max-w-[1280px] m-auto lg:mb-14 md:mb:14 ">
          <div className="w-full  rounded ">
            <img src={Overview} alt="image1" />
          </div>
          <div className="flex flex-col items-center justify-center w-full max-w-screen-2xl m-auto  ">
            <div className=" bg-[#F4F0F8] lg:h-[600px] md:h-[800px] w-full ">
              <div className="flex flex-col  lg:flex-row md:flex-row p-10  pt-8 gap-10 lg:items-start md:items-start items-start pb-8">
                <div className="flex flex-col gap-8 lg:w-[50%] md:w-[50%] text-start lg:text-start md:text-start ">
                  <h2 className=" font-inter text-[16px] leading-[20px] text-center font-semibold capitalize text-[#232536]  tracking-[3px] ">
                    Our mision
                  </h2>
                  <h1 className="font-bold font-inter text-[24px] text-center md:text-start lg:text-start lg:text-[36px] md:text-[30px] lg:leading-[48px] md:leading-[38px] tracking-[-2px] text-[#232536]  ">
                    Creating valuable content for creatives all around the world
                  </h1>
                  <p className="text-[#6D6E76] font-inter font-normal text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                    To keep U.S citizen success central while providing the
                    highest level of service, and equal opportunity in the
                    awarding of funds at all citizens. Creating valuable life
                    for people all around the world, we increase opportunities
                    for access and affordability by providing accurate financial
                    information, and individualized guidance and support for
                    people in an environment which embraces teamwork and
                    collaborative partnership.
                  </p>
                </div>

                <div className="flex  flex-col gap-7 lg:w-[50%] md:w-[50%] text-start lg:text-start md:text-start">
                  <h2 className=" text-[16px] font-inter leading-[20px] font-semibold capitalize text-[#232536] text-center  tracking-[3px] ">
                    Our Values
                  </h2>

                  <h1 className="font-bold text-[24px] font-inter text-center md:text-start lg:text-start lg:text-[36px] md:text-[30px] lg:leading-[48px] md:leading-[38px] tracking-[-2px] text-[#232536]  ">
                    A platform that empowers individuals to improve
                  </h1>
                  <p className="text-[#6D6E76] font-normal  font-inter text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                    <ul className="flex font-inter flex-col list-disc pl-4 gap-2">
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        We increase our families’ capacity for self-sufficiency
                        by providing supportive services, building on strengths,
                        enhancing life skills, and strengthening community
                        linkages.
                      </li>
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        <li className="text-[14px] font-normal leading-[28px]  ">
                          We are non-judgmental and approach families with
                          respect.
                        </li>
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        Our services are family-driven; we regularly communicate
                        with families to gather their input and assure their
                        satisfaction.
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        We believe in every family’s right to
                        self-determination.
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        We take pride in providing culturally competent services
                        and embracing cultural differences in everything we do.
                      </li>{" "}
                      <li className="text-[14px] font-normal leading-[28px]  ">
                        We maintain integrity in our operations and services.
                      </li>{" "}
                    </ul>
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
                  <h2 className=" text-[16px] font-sen leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                    Our team of creatives
                  </h2>
                  <h1 className="font-bold text-[24px] font-inter text-start lg:text-[24px] md:text-[24px] lg:leading-[32px] md:leading-[32px] tracking-[-1px] text-[#232536]  ">
                    To keep U.S citizen success central while providing the
                    highest level of service, and equal opportunity in the
                    awarding of funds at all citizens.
                  </h1>
                  <p className="text-[#6D6E76] font-normal font-inter text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                    There are over 1,100 community actions agencies located
                    across the country that provide low and moderate income
                    families with various services. The programs and resources
                    that are administered can provide people with short term
                    assistance with paying their bills.
                  </p>
                </div>

                <div className="w-full lg:w-[50%] md:w-[50%]  rounded ">
                  <img src={KnowAUs} alt="image1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row mb-10 ">
          <div className="flex flex-col items-center justify-center w-full max-w-screen-2xl m-auto  ">
            <div className="  lg:h-[500px] md:h-[500px] w-full ">
              <div className="flex flex-col-reverse  lg:flex-row md:flex-row lg:pt-14 md:pt-14 pt-8  gap-10 lg:items-start md:items-start items-center ">
                <div class="w-full lg:w-[50%] md:w-[50%]  rounded ">
                  <img src={WhyWSTB} alt="image1" />
                </div>
                <div className="flex flex-col p-4 gap-8 lg:w-[50%] md:w-[50%] text-center lg:text-start md:text-start ">
                  <h2 className=" text-[16px] font-sen leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
                    Why we started
                  </h2>
                  <h1 className="font-bold text-[24px] font-inter text-start lg:text-[24px] md:text-[24px] lg:leading-[32px] md:leading-[32px] tracking-[-1px] text-[#232536]  ">
                    It started out as a simple idea and evolved into our
                    passion.
                  </h1>
                  <p className="text-[#6D6E76] font-normal font-inter text-[12px] lg:text-[16px] md:text-[16px]  leadind-[28px] ">
                    We understand that sometimes it can be difficult to cover
                    all your expenses every month so we have developed a
                    comprehensive directory of benefits, resources, programs and
                    help for those that qualify. There are numerous local, state
                    and federal government organizations, included but not
                    limited to; charities, churches, private businesses and
                    other companies offer a wide variety of low-income
                    assistance programs you may be eligible for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default About;
