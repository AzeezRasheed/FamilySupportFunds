import React, { useEffect } from "react";
import moment from "moment";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import Calendar from "../../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom" 
import  { connect } from "react-redux";
import { getSingleDistributor } from "../../pages/actions/adminDistributorAction";


const DriverSales = ({ location, distributor, getSingleDistributor }) => {
  const history = useHistory();
  
  const code = location.pathname.split("/").at(-1);
  useEffect(() => {
    getSingleDistributor(code);
  }, []);

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={() => history.goBack()} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {distributor?.company_name}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            {/* <div className="flex justify-end gap-4 pr-3">
              <img src={Download} />
              <p className="report-download">Download Report</p>
            </div> */}
          </div>
        </div>
        <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
          <p className="font-normal text-gray-400">
            {distributor?.company_type}
          </p>
          /
          <p className="font-medium text-grey-100">
            {distributor?.company_name}
          </p>
          /<p className="font-medium text-grey-100">sales by devlivery</p>
        </div>
      </div>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
        <div className="block tab-content tab-space pb-5 flex-auto w-full">
          <table className="min-w-full mt-8 divide-y divide-gray-200">
            <thead className="bg-transparent font-customGilroy text-sm text-grey-100 tracking-widest">
              <tr className="">
                <th className="pl-8 py-3 text-gray-400 font-medium text-left align-middle">
                  S/N
                </th>
                <th className="py-3 text-left align-middle">Order Number</th>
                <th className="py-3 text-left align-middle">Order</th>
                <th className="py-3 text-left align-middle">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white px-6 divide-y divide-gray-200">
              <tr key={index} onClick={handlePush} className="cursor-pointer">
                <td className="font-customGilroy text-sm font-medium text-left align-middle pl-8 py-6"></td>
                <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                  2021-09-01
                </td>
                <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                  XXXXHJD
                </td>
                <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                  #200,000
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
        </div>
      </div>
    </Dashboard>
  );
};

const mapStateToProps = (state) => {
  return {
    distributor: state.AllDistributorReducer.distributor,
  };
};

export default connect(mapStateToProps, {
  getSingleDistributor,
})(DriverSales);
