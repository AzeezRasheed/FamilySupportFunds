import React, { useEffect, useState } from "react";
import moment from "moment";
import Dashboard from "../../../Layout/Admin/Dashboard";
import { useParams } from "react-router";
import SortImg from "../../../assets/svg/sort.svg";
import noOrder from "../../../assets/svg/noOrders.svg";
import {
  Previouspage,
  Progination,
  Redirect,
} from "../../../assets/svg/adminIcons";
import { Link } from "react-router-dom"
import DistributorNavbar from "../components/navbar";
import { useHistory } from "react-router-dom" 
import  { connect, useSelector } from "react-redux";
import {
  getAllOrdersByDistributor
} from "./actions/orderAction";
import {
  getSingleDistributor,
  getAllDistributor,
} from "../pages/actions/adminDistributorAction";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import {formatPriceByCountrySymbol} from "../../../utils/formatPrice"
import { useTranslation } from "react-i18next";
import Pagination from "../components/pagination";

const Orders = ({
  location,
  distributor,
  getAllDistributor,
  getSingleDistributor,
  getAllOrdersByDistributor,
  orders,
  orderLength
}) => {
  const {t} = useTranslation()
  const history = useHistory();
  const handlePush = (orderId, buyerCode) => {
    history.push(`/distributor/order-summary/${orderId}/${buyerCode}`);
  };
  const { distCode } = useParams();
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [userCountry, setUserCountry] = useState("Ghana");

	const [orderData, setOrderData] = useState("");
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  useEffect(() => {
    getSingleDistributor(distCode);
    getAllOrdersByDistributor(distributor?.SYS_Code, currentPage, orderData, PageSize, "");
  }, [distributor?.SYS_Code, currentPage, orderData]);
  useEffect(async() => {
    const loc = await getLocation();
    getAllDistributor(country);
    setUserCountry(loc);
  }, [country]);

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

  const showColor = (status) => {
    let bgcolor = "";
    if (status?.status === "Placed") {
      bgcolor = "grey";
    } else if (status?.status === "Completed") {
      bgcolor = "green";
    } else if (status?.status === "Assigned") {
      bgcolor = "blue";
    } else if (status?.status === "Accepted") {
      bgcolor = "orange";
    } else if (status?.status === "Rejected") {
      bgcolor = "red";
    }
    return bgcolor;
  };
  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link to="/admin-dashboard">
              <Previouspage />
            </Link>
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {distributor?.company_name}
            </p>
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
        </div>
        <DistributorNavbar distributor={distributor} code={distCode} />
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div className="flex mt-3 px-4">
              <input
                className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                id="search"
                type="text"
                name="search"
                style={{ width: "13.5rem", backgroundColor: "#E5E5E5" }}
                // onChange={(e) => setOrderData(e.target.value)}
                onKeyUp={() => search("search", "filter")}
                placeholder="Order number, Customer name, Route name, Driver"
              />
              <div className="flex pt-1">
                <div
                  className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block  bg-white border-default-b border-2"
                  onClick={(e) => {
                    setOrderData("");
                  }}
                  style={{
                    background: `${
                      orderData === ""
                        ? countryConfig[userCountry].buttonColor
                        : "white"
                    }`,
                    color: `${
                      orderData === ""
                        ? countryConfig[userCountry].textColor
                        : "gray"
                    }`,
                  }}
                >
                  <p className="text-sm font-normal">{t("all_orders")}</p>{" "}
                </div>
                <div
                  className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                  onClick={(e) => {
                    setOrderData("Placed");
                  }}
                  style={{
                    background: `${
                      orderData === "Placed"
                        ? countryConfig[userCountry].buttonColor
                        : "white"
                    }`,
                    color: `${
                      orderData === "Placed"
                        ? countryConfig[userCountry].textColor
                        : "gray"
                    }`,
                  }}
                >
                  <p className="text-sm font-normal">{t("open_orders")}</p>{" "}
                </div>
                <div
                  className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                  onClick={(e) => {
                    setOrderData("Assigned");
                  }}
                  style={{
                    background: `${
                      orderData === "Assigned"
                        ? countryConfig[userCountry].buttonColor
                        : "white"
                    }`,
                    color: `${
                      orderData === "Assigned"
                        ? countryConfig[userCountry].textColor
                        : "gray"
                    }`,
                  }}
                >
                  <p className="text-sm font-normal">{t("assigned_orders")}</p>{" "}
                </div>
                {country !== "Nigeria" ? (
                  <div />
                ) : (
                  <>
                    <div
                      className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                      onClick={(e) => {
                        setOrderData("Accepted");
                      }}
                      style={{
                        background: `${
                          orderData === "Accepted"
                            ? countryConfig[userCountry].buttonColor
                            : "white"
                        }`,
                        color: `${
                          orderData === "Accepted"
                            ? countryConfig[userCountry].textColor
                            : "gray"
                        }`,
                      }}
                    >
                      <p className="text-sm font-normal">
                        {t("accepted_orders")}
                      </p>{" "}
                    </div>
                    <div
                      className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                      onClick={(e) => {
                        setOrderData("Dispatched");
                      }}
                      style={{
                        background: `${
                          orderData === "Dispatched"
                            ? countryConfig[userCountry].buttonColor
                            : "white"
                        }`,
                        color: `${
                          orderData === "Dispatched"
                            ? countryConfig[userCountry].textColor
                            : "gray"
                        }`,
                      }}
                    >
                      <p className="text-sm font-normal">
                        {t("dispatched_orders")}
                      </p>{" "}
                    </div>
                    <div
                      className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                      onClick={(e) => {
                        setOrderData("Delivered");
                      }}
                      style={{
                        background: `${
                          orderData === "Delivered"
                            ? countryConfig[userCountry].buttonColor
                            : "white"
                        }`,
                        color: `${
                          orderData === "Delivered"
                            ? countryConfig[userCountry].textColor
                            : "gray"
                        }`,
                      }}
                    >
                      <p className="text-sm font-normal">
                        {t("delivered_orders")}
                      </p>{" "}
                    </div>
                  </>
                )}
                <div
                  className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                  onClick={(e) => {
                    setOrderData("Completed");
                  }}
                  style={{
                    background: `${
                      orderData === "Completed"
                        ? countryConfig[userCountry].buttonColor
                        : "white"
                    }`,
                    color: `${
                      orderData === "Completed"
                        ? countryConfig[userCountry].textColor
                        : "gray"
                    }`,
                  }}
                >
                  <p className="text-sm font-normal">{t("completed_orders")}</p>{" "}
                </div>
                <div
                  className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                  onClick={(e) => {
                    setOrderData("Rejected");
                  }}
                  style={{
                    background: `${
                      orderData === "Rejected"
                        ? countryConfig[userCountry].buttonColor
                        : "white"
                    }`,
                    color: `${
                      orderData === "Rejected"
                        ? countryConfig[userCountry].textColor
                        : "gray"
                    }`,
                  }}
                >
                  <p className="text-sm font-normal">{t("rejected_orders")}</p>{" "}
                </div>
              </div>
            </div>
            <table className="min-w-full mt-8 divide-y divide-gray-200">
              <thead className="bg-transparent font-customGilroy text-sm text-grey-100 tracking-widest">
                <tr className="">
                  <th className="pl-8 py-3 text-gray-400 font-medium text-left align-middle">
                    S/N
                  </th>
                  <th className="py-3 text-left align-middle">
                    {t("order")} <br />
                    {t("number")}
                  </th>
                  <th className="py-3 text-left align-middle">{t("date")}</th>
                  <th className="py-3 text-left align-middle">
                    {t("customer_name")}
                  </th>
                  <th className="py-3 text-left align-middle">
                    {t("route_name")}
                  </th>
                  <th className="py-3 text-left align-middle">{t("status")}</th>
                  <th className="py-3 text-left align-middle">
                    {t("products")}
                  </th>
                  <th className="py-3 text-left align-middle">{t("amount")}</th>
                </tr>
              </thead>
              <tbody className="bg-white px-6 divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr className="my-8 justify-center">
                    <td colSpan={9}>
                      <img className="m-auto" src={noOrder} />
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        handlePush(order?.orderId, order?.buyerCompanyId)
                      }
                      className="cursor-pointer"
                    >
                      <td className="font-customGilroy text-sm font-medium text-left align-middle pl-8 py-6">
                        {`${index + 1}.`}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {order && order?.orderId}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {moment(order && order?.datePlaced).format(
                          "MMMM Do YYYY"
                        )}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {order && order?.buyerDetails[0]?.buyerName}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {order && order?.routeName}
                      </td>
                      <td>
                        <span className={showColor(order && order)}>
                          {order && order?.status}
                        </span>
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left mr-3 align-middle">
                        {order && order?.orderItems?.length}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle">
                        {order &&
                          formatPriceByCountrySymbol(
                            country,
                            parseInt(order?.totalPrice)
                          )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <hr />
            <div className="flex justify-end items-center gap-4 mr-20 mt-6">
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={orderLength}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};
const mapStateToProps = (state) => {
  return {
    distributor: state.AllDistributorReducer.distributor,
    allDistributors: state.AllDistributorReducer.all_distributors,
    orders: state.OrderReducer.all_orders,
    orderLength: state.OrderReducer.totalOrdersCount
  };
};

export default connect(mapStateToProps, {
  getAllDistributor,
  getSingleDistributor,
  getAllOrdersByDistributor
})(Orders);
