import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

function WinnersList() {
  return (
    <div className="bg-white ">
      <Navbar />
      <section className="flex flex-col lg:p-10 md:p-10 p-2 justify-center m-auto mt-8">
        <div className="flex flex-col lg:p-14 md:p-14 p-14  gap-4  items-center ">
          <h1 className="font-bold text-[30px] text-center font-sen lg:text-[48px] md:text-[40px] lg:leading-[64px] md:leading-[48px] leading-[40px] tracking-[-2px] text-[#232536] capitalize  ">
            WINNERS LIST
          </h1>

          <p className="text-[#6D6E76] font-inter lg:w-[515px] text-center font-normal text-[12px] lg:text-[16px] md:text-[16px]  leading-[28px]  ">
            JOIN THE WINNING TEAM
          </p>
        </div>

        <div className="overflow-x-auto lg:w-full ">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-3 px-6">Names</th>

                <th scope="col" className="py-3 px-6">
                  Delivery Location
                </th>
                <th scope="col" className="py-3 px-6">
                  Delivery Status
                </th>
                <th scope="col" className="py-3 px-6">
                  Delivery Month
                </th>
                <th scope="col" className="py-3 px-6">
                  Delivery Amount
                </th>
                <th scope="col" className="py-3 px-6">
                  Deliveries Process
                </th>
                <th scope="col" className="py-3 px-6">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {/* <td className="py-4 px-6"> {index + 1}</td> */}
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Liam Noah
                </th>
                <td className="py-4 px-6">Home Address</td>
                <td className="py-4 px-6">Cash </td>
                <td className="py-4 px-6">May </td>
                <td className="py-4 px-6">$530,000.00 </td>
                <td className="py-4 px-6">Delivered </td>
                <td className="py-4 px-6">Satisfied</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default WinnersList;
