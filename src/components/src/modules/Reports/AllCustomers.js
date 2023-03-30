import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { Dialog, Transition } from "@headlessui/react";
import Dashboard from "../../Layout/Dashboard";
import { CloseModal, UploadFile, Checked } from "../../assets/svg/modalIcons";
import arrowDown from "../../assets/svg/arrowDown.svg";
import SortImg from "../../assets/svg/sort.svg";
import noOrder from "../../assets/svg/noOrders.svg";
import {
  Previouspage,
  Progination,
  Redirect,
} from "../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom" 
import  {
  getAllCustomers,
  getAllDistributorCustomers,
} from "../Admin/customer/actions/customer";
import LoadingList from "../../components/common/LoadingList";
import { filter, findLastIndex, uniqBy } from "lodash";
import {
  getAllOrdersByDateRange,
  getAllOrdersByDistributor,
  getCountryOrdersByDateRange,
} from "../Admin/order/actions/orderAction";
import moment from "moment";
import { getAllDistributors } from "../Admin/KPO/actions/UsersAction";
import { getAllProducts } from "../Admin/Pricing/actions/AdminPricingAction";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { countryCode } from "../../utils/countryCode";
import { useTranslation } from "react-i18next";
// import DistributorNavbar from '../components/navbar';

const AllCustomers = ({ location }) => {
  const {t} = useTranslation()
  const { Dist_Code } = useParams();

  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  if (!dist_code) {
    dist_code = Dist_Code;
  }
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const history = useHistory();
  const formCompleted = false;
  const [openTab, setOpenTab] = useState(1);
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;

  const startRange = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopRange = moment(new Date(Date.now())).format("YYYY-MM-DD");

  useEffect(() => {
    dispatch(getAllCustomers(country));
  }, [country]);
  useEffect(() => {
    getCountryOrdersByDateRange(startRange, stopRange, countryCode(country));
    setDataLoaded(true);
  }, []);

  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
  );

  if (!allSystemOrders.length) {
    getCountryOrdersByDateRange(startRange, stopRange, countryCode(country));
  }

  const allCustomers = useSelector(
    (state) => state.CustomerReducer.all_customers
  );
  const distOrders = filter(allSystemOrders, { sellerCompanyId: dist_code });
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  if (!allDistributors) {
    dispatch(getAllDistributors(country));
  }
  const allProducts = useSelector((state) => state.PricingReducer.allProducts);
  if (!allProducts.length) {
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }

  const completedOrders = filter(distOrders, function (order) {
    return (
      (order.routeName === "Walk-In-Sales" && order.status === "Completed") ||
      (order.routeName === "Van-Sales" && order.status === "Completed") ||
      (order.routeName === "SalesForce" && order.status === "Completed")
    );
  });

  const uniqueCompletedOrders = uniqBy(completedOrders, "buyerCompanyId");

  let completedBulkOrders = [];
  let completedPocOrders = [];
  uniqueCompletedOrders?.map((order, index) => {
    const buyer = filter(allCustomers, { SF_Code: order.buyerCompanyId })[0];
    if (buyer?.CUST_Type === "Bulkbreaker") completedBulkOrders.push(order);
    if (buyer?.CUST_Type === "Poc") completedPocOrders.push(order);
  });

  const getCustomerDetails = (SF_Code) => {
    const thisCustomer = filter(allCustomers, { SF_Code: SF_Code })[0];
    return thisCustomer;
  };

  const getCustTotalOrders = (CustID) => {
    const thisCustOrders = filter(completedOrders, { buyerCompanyId: CustID });
    const totalAmountSpent = thisCustOrders.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.price),
      0
    );
    const lastOrderIndex = findLastIndex(distOrders, {
      buyerCompanyId: CustID,
    });

    const lastOrderDate =
      lastOrderIndex >= 0
        ? thisCustOrders[lastOrderIndex]?.datePlaced
        : "Not ordered yet";
    return {
      totalOrders: thisCustOrders.length,
      totalAmountSpent: totalAmountSpent,
      lastOrderDate: lastOrderDate,
    };
  };

  if (allCustomers?.length > 0 && loadingState) {
    setLoadingState(false);
  }

  const pushTomanageCustomer = (custID) => {
    history.push("/dashboard/manage-customer/" + dist_code + "/" + custID);
  };
  const backButton = () => {
    // history.push("/dashboard/reports/" + dist_code);
    history.goBack();
  };
  const getDistributorName = (code) => {
    let thisDistributor = filter(allDistributors, { SYS_Code: code })[0];
    if (!thisDistributor) {
      thisDistributor = filter(allDistributors, { DIST_Code: code })[0];
    }
    return thisDistributor?.company_name;
  };

  const search = (filterInput, filterTBody) => {
    let input, filter, ul, li, a, i;
    input = document.getElementById(filterInput);
    filter = input.value.toUpperCase();
    ul = document.getElementById(filterTBody);
    li = ul.getElementsByTagName("tr");
    for (i = 0; i < li.length; i++) {
      if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={() => backButton()} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("all_customers")}
            </p>
          </div>
          {/* <div className="flex gap-16 items-center">
            <div className="flex justify-end gap-4 pr-3">
              <img src={Download} />
              <p className="report-download">Download Report</p>
            </div>
          </div> */}
        </div>
        <div className="flex justify-between">
          {/* <div className="flex mt-4 px-3 report-date-cont justify-between bg-white w-32 h-12">
            <img style={{ height: "25px", margin: "auto" }} src={Calendar} />
            <p className="report-date">This Month</p>
          </div> */}
        </div>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div className="flex flex-row justify-between items-center border-b h-16 px-8">
              <div className="flex justify-between items-center font-customGilroy text-base font-medium not-italic text-grey-85 w-3/7 h-full">
                <li className="flex">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal mr-16 " +
                      (openTab === 1
                        ? "text-active border-b-4 rounded border-basic"
                        : "text-default")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(1);
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    {t("registred_customers")}
                  </a>
                </li>
                <li className="flex ">
                  <a
                    className="flex pt-6 w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(2);
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <p
                      className={
                        "flex font-customGilroy text-base font-normal mr-16 " +
                        (openTab === 2
                          ? "text-active border-b-4 rounded border-basic"
                          : "text-default")
                      }
                    >
                      BulkBreaker
                    </p>
                  </a>
                </li>
                <li className="flex ">
                  <a
                    className="flex w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(3);
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <p
                      className={
                        "flex pt-6 font-customGilroy text-base font-normal mr-16 " +
                        (openTab === 3
                          ? "text-active border-b-4 rounded border-basic"
                          : "text-default")
                      }
                    >
                      Pocs
                    </p>
                  </a>
                </li>
              </div>
            </div>
            <div className="flex mt-3 px-4">
              <input
                className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                id="search"
                type="text"
                name="search"
                style={{ width: "26.063rem", backgroundColor: "#E5E5E5" }}
                onKeyUp={() => search("search", "filterTBody")}
                placeholder="Search for customer"
              />
              <div className="flex pt-1">
                {/* <div
                  className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <p className="text-sm text-default font-normal">
                    All locations(s)
                  </p>{" "}
                  <img className="pl-3 pr-2" src={arrowDown} alt="" />
                </div> */}
                {/* <div
                  className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block  bg-white border-default-b border-2"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <p className="text-sm text-default font-normal">Any Status</p>{" "}
                  <img className="pl-3 pr-2" src={arrowDown} alt="" />
                </div> */}
                {/* <div className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                  <img className="pr-2" src={SortImg} alt="" />
                  <p className="text-sm text-default font-normal">Sort By</p>
                </div> */}
              </div>
            </div>

            {!loadingState ? (
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <table className="min-w-full mt-8 divide-y divide-gray-200">
                    <thead className="bg-transparent ">
                      <tr className="">
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          S/N
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("customer_code")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("customer_name")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("location")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("status")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("last_order_date")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("total_orders")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("total_amount")} <br />
                          {t("spent")}
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className="bg-white px-6 divide-y divide-gray-200"
                      id="filterTBody"
                    >
                      {uniqueCompletedOrders?.length === 0 ? (
                        <tr className="my-8 justify-center">
                          <td colSpan={9}>
                            <img className="m-auto" src={noOrder} alt="" />
                          </td>
                        </tr>
                      ) : (
                        uniqueCompletedOrders?.map((order, index) => (
                          <tr
                            key={index}
                            onClick={() =>
                              pushTomanageCustomer(order.buyerCompanyId)
                            }
                            className="cursor-pointer"
                          >
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {index + 1 + "."}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {order.buyerCompanyId}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {
                                getCustomerDetails(order.buyerCompanyId)
                                  ?.CUST_Name
                              }
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {
                                getCustomerDetails(order.buyerCompanyId)
                                  ?.address
                              }
                            </td>
                            {getCustomerDetails(order.buyerCompanyId)
                              ?.status === "Active" ? (
                              <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                <button className="rounded-full bg-green-500 py-1 px-3">
                                  {
                                    getCustomerDetails(order.buyerCompanyId)
                                      ?.status
                                  }
                                </button>
                              </td>
                            ) : (
                              <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                <button className="rounded-full bg-red-500 py-1 px-3">
                                  {t("inactive")}
                                </button>
                              </td>
                            )}
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {moment
                                .utc(
                                  getCustTotalOrders(order.buyerCompanyId)
                                    .lastOrderDate
                                )
                                .format("DD/MM/YYYY")}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {
                                getCustTotalOrders(order.buyerCompanyId)
                                  .totalOrders
                              }
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {formatPriceByCountrySymbol(
                                country,
                                getCustTotalOrders(order.buyerCompanyId)
                                  .totalAmountSpent
                              ).toLocaleString(undefined)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className={openTab === 2 ? "block" : "hidden"} id="link1">
                  <table className="min-w-full mt-8 divide-y divide-gray-200">
                    <thead className="bg-transparent ">
                      <tr className="">
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          S/N
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("customer_code")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("customer_name")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("location")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("status")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {/* Last Order <br />
                          Date */}
                          {t("last_order_date")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("total_orders")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("total_amount")} <br />
                          {t("spent")}
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className="bg-white px-6 divide-y divide-gray-200"
                      id="filterTBody"
                    >
                      {completedBulkOrders?.length === 0 ? (
                        <tr className="my-8 justify-center">
                          <td colSpan={9}>
                            <img className="m-auto" src={noOrder} alt="" />
                          </td>
                        </tr>
                      ) : (
                        completedBulkOrders?.map((order, index) => (
                          <tr
                            key={index}
                            onClick={() =>
                              pushTomanageCustomer(order.buyerCompanyId)
                            }
                            className="cursor-pointer"
                          >
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {index + 1 + "."}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {order.buyerCompanyId}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {
                                getCustomerDetails(order.buyerCompanyId)
                                  ?.CUST_Name
                              }
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {
                                getCustomerDetails(order.buyerCompanyId)
                                  ?.address
                              }
                            </td>
                            {getCustomerDetails(order.buyerCompanyId)
                              ?.status === "Active" ? (
                              <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                <button className="rounded-full bg-green-500 py-1 px-3">
                                  {
                                    getCustomerDetails(order.buyerCompanyId)
                                      ?.status
                                  }
                                </button>
                              </td>
                            ) : (
                              <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                <button className="rounded-full bg-red-500 py-1 px-3">
                                  {t("inactive")}
                                </button>
                              </td>
                            )}
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {moment
                                .utc(
                                  getCustTotalOrders(order.buyerCompanyId)
                                    .lastOrderDate
                                )
                                .format("DD/MM/YYYY")}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {
                                getCustTotalOrders(order.buyerCompanyId)
                                  .totalOrders
                              }
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {formatPriceByCountrySymbol(
                                country,
                                getCustTotalOrders(order.buyerCompanyId)
                                  .totalAmountSpent
                              ).toLocaleString(undefined)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link1">
                  <table className="min-w-full mt-8 divide-y divide-gray-200">
                    <thead className="bg-transparent ">
                      <tr className="">
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          S/N
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("customer_code")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("customer_name")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("location")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("status")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {/* Last Order <br />
                          Date */}
                          {t("last_order_date")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("total_orders")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("total_amount")} <br />
                          {t("spent")}
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className="bg-white px-6 divide-y divide-gray-200"
                      id="filterTBody"
                    >
                      {completedPocOrders?.length === 0 ? (
                        <tr className="my-8 justify-center">
                          <td colSpan={9}>
                            <img className="m-auto" src={noOrder} alt="" />
                          </td>
                        </tr>
                      ) : (
                        completedPocOrders?.map((order, index) => (
                          <tr
                            key={index}
                            onClick={() =>
                              pushTomanageCustomer(order.buyerCompanyId)
                            }
                            className="cursor-pointer"
                          >
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {index + 1 + "."}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {order.buyerCompanyId}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {
                                getCustomerDetails(order.buyerCompanyId)
                                  ?.CUST_Name
                              }
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {
                                getCustomerDetails(order.buyerCompanyId)
                                  ?.address
                              }
                            </td>
                            {getCustomerDetails(order.buyerCompanyId)
                              ?.status === "Active" ? (
                              <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                <button className="rounded-full bg-green-500 py-1 px-3">
                                  {
                                    getCustomerDetails(order.buyerCompanyId)
                                      ?.status
                                  }
                                </button>
                              </td>
                            ) : (
                              <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                <button className="rounded-full bg-red-500 py-1 px-3">
                                  {t("inactive")}
                                </button>
                              </td>
                            )}
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {moment
                                .utc(
                                  getCustTotalOrders(order.buyerCompanyId)
                                    .lastOrderDate
                                )
                                .format("DD/MM/YYYY")}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {
                                getCustTotalOrders(order.buyerCompanyId)
                                  .totalOrders
                              }
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {formatPriceByCountrySymbol(
                                country,
                                getCustTotalOrders(order.buyerCompanyId)
                                  .totalAmountSpent
                              ).toLocaleString(undefined)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <LoadingList />
            )}
            {dataLoaded && allCustomers.length === 0
              ? // <div
                //   className="px-6"
                //   style={{ textAlign: "center", color: "#9799A0", marginTop: 30, marginBottom: 30 }}
                // >
                //   You do not have any customer
                // </div>
                ""
              : ""}
            <hr />
            <div className="flex justify-end items-center gap-4 mr-20 mt-6">
              1 - 50 of 100 <Progination />
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default AllCustomers;
