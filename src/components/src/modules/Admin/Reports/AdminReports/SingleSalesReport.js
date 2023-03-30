import React, { useEffect } from "react";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import Calendar from "../../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom" 
import  { useTranslation } from "react-i18next";

const SingeSalesReport = ({ location, distributor }) => {
  const history = useHistory();
  const {t} = useTranslation()
  // const handlePush = (cod) => {
  //   history.push("/distributor/order-summary");
  // };

  // const code = location.pathname.split("/").at(-1);

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("total_sales")}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            <div className="flex justify-end gap-4 pr-3">
              <img src={Download} />
              <p className="report-download">{t("downoad_report")}</p>
            </div>
          </div>
        </div>
        <div className="flex mt-4 px-3 report-date-cont justify-between bg-white w-32 h-12">
          <img style={{ height: "25px", margin: "auto" }} src={Calendar} />
          <p className="report-date">{t("this_month")}</p>
        </div>
      </div>
      <div
        className="bg-white mx-10 py-6"
        style={{
          boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2)",
          borderRadius: "8px",
        }}
      >
        <table className="min-w-full mt-3 divide-y divide-grey-500">
          <thead className="bg-transparent ">
            <tr className="">
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                S/N
              </th>
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                {t("date")}
              </th>
              <th className="px-10 py-3 text-left text-xs font-medium text-black align-middle">
                {t("distributor_name")}
              </th>
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                {t("amount")}
              </th>
            </tr>
          </thead>

          <tbody
            id="distributors"
            className="bg-white px-6 divide-y divide-gray-200"
          >
            {/* {[].map((report, index) => ( */}
            <tr>
              <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                1
              </td>
              <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                21-02-2021
              </td>
              <td
                // onClick={() => navigate(distributor.DIST_Code)}
                className="text-left align-middle cursor-pointer"
              >
                <p className="font-customGilroy pl-8 text-sm text-red-900 font-medium">
                  KMS Nigeria Ltd
                </p>
              </td>
              <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                #200,0000
              </td>
            </tr>
            {/* ))} */}
          </tbody>
        </table>
      </div>
    </Dashboard>
  );
};

export default SingeSalesReport;
