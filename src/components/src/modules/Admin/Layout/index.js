import React, { useEffect, useMemo, useState } from "react";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import SortImg from "../../../assets/svg/sort.svg";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Progination } from "../../../assets/svg/adminIcons";
import { Link, useHistory } from "react-router-dom";
import Pagination from "../components/pagination";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import { orderNet } from "../../../utils/urls";
import Loading from "../../../components/common/Loading";
import { useTranslation } from "react-i18next";

import {
  // uploadCSV,
  getAllDistributor,
} from "../pages/actions/adminDistributorAction";

const AdminDistributorLayout = ({ top, DistributorList }) => {
  const { t } = useTranslation();
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [distData, setDistData] = useState("");
  const [orders, setOrders] = useState(0);
  const history = useHistory();
  const navigate = (code) => {
    history.push(`/admin-distributor/${code}`);
  };

  const [country, setCountry] = useState("Ghana");
	const AuthData = useSelector(state => state.Auth.sessionUserData);

  useEffect(async () => {
    getAllDistributor(AuthData?.country);
    const loc = await getLocation();
    setCountry(loc);
  });

	const filterByStatus = (status) => {    
		return DistributorList.filter((data)=>data?.status===status).length
	}

  const fetchDistributors = () => {
    return (
      DistributorList &&
      DistributorList.filter((data) => {
        return (
          (data?.company_name &&
            String(data?.company_name) !== null &&
            data?.company_name &&
            String(data?.company_name)
              .toLowerCase()
              .includes(`${distData && distData.toLowerCase()}`)) ||
          (data?.DIST_Code &&
            String(data?.DIST_Code) !== null &&
            data &&
            String(data?.DIST_Code)
              .toLowerCase()
              .includes(`${distData && distData.toLowerCase()}`)) ||
          (data?.SYS_Code &&
            String(data?.SYS_Code) !== null &&
            data?.SYS_Code &&
            String(data?.SYS_Code)
              .toLowerCase()
              .includes(`${distData && distData.toLowerCase()}`)) || //data?.status &&
          // String(data?.status) !== null &&
          // data && console.log(data.status))
          (data &&
            String(data?.status)
              .toLowerCase()
              .includes(`${distData && distData.toLowerCase()}`)) ||
          (data?.state &&
            String(data?.state) !== null &&
            data?.state &&
            String(data?.state)
              .toLowerCase()
              .includes(`${distData && distData.toLowerCase()}`))
        );
      })
    );
  };

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      DistributorList &&
      fetchDistributors().slice(firstPageIndex, lastPageIndex)
    );
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  return (
    <>
      <div
        className={`relative flex flex-col min-w-0 break-words bg-white w-full mb-6 ${top} shadow-lg rounded`}
      >
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className="block">
                  <div className="mt-3 px-4 flex">
                    <input
                      className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                      id="searchDistributor"
                      type="text"
                      name="search"
                      style={{ width: "26.063rem", backgroundColor: "#E5E5E5" }}
                      // onChange={(e) => onChange(e)}
                      placeholder={t("search_for_distributor")}
                      onChange={(e) => setDistData(e.target.value)}
                    />
                    <div className="flex pt-1">
                      <button
                        className="text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2 cursor-pointer set-tab"
                        style={{
                          whiteSpace: "nowrap",
                          background: `${
                            distData === ""
                              ? countryConfig[country].buttonColor
                              : "white"
                          }`,
                        }}
                        // product-cont-active
                        onClick={() => {
                          setDistData("");
                        }}
                      >
                        <p
                          style={{
                            whiteSpace: "nowrap",
                            color:
                              distData === "" &&
                              countryConfig[country].textColor,
                          }}
                          className="text-default font-normal"
                        >
                          {/* product-text-active */}
                         {t("all_distributors")}
                        </p>{" "}
                      </button>
                      <button
                        className="text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2 cursor-pointer set-tab"
                        style={{
                          whiteSpace: "nowrap",
                          background: `${
                            distData === "active"
                              ? countryConfig[country].buttonColor
                              : "white"
                          }`,
                        }}
                        // product-cont-active
                        onClick={() => {
                          setDistData("active");
                        }}
                      >
                        <p
                          style={{
                            whiteSpace: "nowrap",
                            color:
                              distData === "active" &&
                              countryConfig[country].textColor,
                          }}
                          className="text-default font-normal"
                        >
                          {/* product-text-active */}
                          {t("active")}  ({filterByStatus("Active")})
                        </p>{" "}
                      </button>
                      <button
                        className="text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2 cursor-pointer set-tab"
                        style={{
                          whiteSpace: "nowrap",
                          background: `${
                            distData === null
                              ? countryConfig[country].buttonColor
                              : "white"
                          }`,
                        }}
                        // product-cont-active
                        onClick={() => {
                          setDistData(null && "");
                        }}
                      >
                        <p
                          style={{
                            whiteSpace: "nowrap",
                            color:
                              distData === null &&
                              countryConfig[country].textColor,
                          }}
                          className="text-default font-normal"
                        >
                          {/* product-text-active */}
                          {t("inactive")} ({filterByStatus(null && "")})
                        </p>{" "}
                      </button>
                      {/* <div
                        className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                        style={{ width: "auto"}}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <p className=" text-default font-normal">
                          All locations(s)
                        </p>{" "}
                        <img className="pl-3 pr-2" src={arrowDown} alt="" />
                      </div> */}
                      {/* <div
                        className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block  bg-white border-default-b border-2"
                        style={{ width: "auto"}}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <p className=" text-default font-normal">
                          Any Status
                        </p>{" "}
                        <img className="pl-3 pr-2" src={arrowDown} alt="" />
                      </div> */}
                      {/* <div
                        style={{ cursor: "pointer", width: "auto" }}
                        className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                      >
                        <img className="pr-2" src={SortImg} alt="" />
                        <p className=" text-default font-normal">
                          Sort By
                        </p>
                      </div> */}
                    </div>
                  </div>
                  {!DistributorList.length ? (
                    <center style={{ marginTop: 30 }}>
                      <Loading />
                      <Loading />
                      <Loading />
                    </center>
                  ) : (
                    <table className="min-w-full mt-8 divide-y divide-gray-200">
                      <thead className="bg-transparent ">
                        <tr className="">
                          <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                            S/N
                          </th>
                          <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("distributor_code")}
                          </th>
                          <th className="px-10 py-3 text-center text-xs font-medium text-black align-middle">
                          {t("distributor_name")}
                          </th>
                          <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("state/city")}
                          </th>
                          <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("country")}
                          </th>
                          <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("status")}
                          </th>
                          {/* <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          Total Orders
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          Total Sales
                        </th> */}
                          <th className="px-10 py-3 ">{"          "}</th>
                        </tr>
                      </thead>

                      <tbody
                        id="distributors"
                        className="bg-white px-6 divide-y divide-gray-200"
                      >
                        {DistributorList &&
                          currentTableData().map((distributor, index) => (
                            <tr key={distributor?.id}>
                              <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                                {index + 1 + "."}
                              </td>
                              <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                                {distributor?.SYS_Code}
                              </td>
                              <td
                                onClick={() => navigate(distributor?.DIST_Code)}
                                className="font-customGilroy text-sm font-medium text-center align-middle p-6 cursor-pointer"
                              >
                                <p
                                  className="font-customGilroy text-sm font-medium"
                                  // style={{ color: 'red' }}
                                >
                                  {distributor?.company_name}
                                </p>
                              </td>
                              <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                                {distributor?.state}
                              </td>
                              <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                                {distributor?.country}
                              </td>
                              {distributor?.status === "Active" ? (
                                <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                  <button className="rounded-full bg-green-500 py-1 px-3">
                                    {distributor?.status}
                                  </button>
                                </td>
                              ) : (
                                <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                  <button className="rounded-full bg-red-500 py-1 px-3">
                                    {t("inactive")}
                                  </button>
                                </td>
                              )}
                              {/* <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            100
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            300
                          </td> */}

                              <td
                                className="flex gap-1 font-customGilroy text-sm font-medium  text-center align-middle pt-7 pb-6 border-none"
                                // style={{ color: 'red'}}
                              >
                                <Redirect />
                                <Link
                                  target="_blank"
                                  to={`/dashboard/overview/${distributor?.DIST_Code}`}
                                >
                                  <u>{t("dashboard")}</u>
                                </Link>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                  <hr />
                  <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                    <Pagination
                      className="pagination-bar"
                      currentPage={currentPage}
                      totalCount={fetchDistributors().length}
                      pageSize={PageSize}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDistributorLayout;
