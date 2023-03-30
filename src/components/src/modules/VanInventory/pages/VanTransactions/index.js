import React, { Fragment, useRef, useState, useEffect } from "react";
import Dashboard from "../../../../Layout/Dashboard";
import { useParams } from "react-router";
import moment from "moment";
import noOrder from "../../../../assets/svg/noOrders.svg";
import arrowDown from "../../../../assets/svg/arrowDown.svg";
import { Link } from "react-router-dom";
import { formatPriceByCountrySymbol } from "../../../../utils/formatPrice";
import countryConfig from '../../../../utils/changesConfig.json'
import { getLocation } from '../../../../utils/getUserLocation.js'
import {
  Previouspage,
  Progination,
  Redirect,
} from "../../../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom" 
import  { connect, useSelector } from "react-redux";
import {
  getAllOrdersByDistributor,
  getAllDriversByOwnerId,
} from "../../../Admin/order/actions/orderAction";
import Pagination from "../../../Admin/components/pagination";
import {
  getSingleDistributor,
  getAllDistributor,
} from "../../../Admin/pages/actions/adminDistributorAction";
import { useTranslation } from "react-i18next";


const VanTransactions = ({
  location,
  distributor,
  getAllDriversByOwnerId,
  getAllOrdersByDistributor,
  orders,
  orderLength,
  allDrivers
}) => {
  let PageSize = 10;
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1);
  const [openTab, setOpenTab] = useState(1);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const [orderData, setOrderData] = useState("");
  const { distCode } = useParams();
	const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [userCountry, setUserCountry] = useState('Ghana');
  let routeType = "Van-Sales,SalesForce,SAP,One-Off"

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry])

  useEffect(() => {
    // currentTableData();
    getSingleDistributor(distCode);
    getAllDriversByOwnerId(distCode);
    getAllOrdersByDistributor(distributor?.SYS_Code, currentPage, orderData, PageSize, routeType);
  }, [distCode, distributor, currentPage, orderData, routeType]);

  const getDriverName = (vehicleId) => {

    const driversName = allDrivers.filter((driver) => driver?.vehicleId === +vehicleId, 10)[0];
    return driversName
  }
  const getOrderByVSM = () => {
    const mainOrders = orders.filter((order) => order.routeName === "Van-Sales" || (order.routeName === "SalesForce" && order?.status === "Assigned") || (order.routeName === "SAP" && order?.status === "Assigned") || (order?.routeName === "One-Off" && order.vehicleId !== "" && order.vehicleId !== null) || (order?.routeName === "Walk-In-Sales" && order.vehicleId !== "" && order.vehicleId !== null))
    const sorted = mainOrders.sort(
      (a, b) => new Date(b.datePlaced) - new Date(a.datePlaced)
    );
    return sorted;
  };


  const handlePush = (sellerId, orderId, buyerId) => {
    history.push(`/dashboard/order-summary/${sellerId}/${orderId}/${buyerId}`);
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

  // const sortOrder = () => {
  //   return orders && getOrderByVSM().filter((data) => {
  //     return (
  //       data?.status?.startsWith(`${orderData}`) ||
  //       data?.buyerDetails[0]?.buyerName !== null && data?.buyerDetails[0] && data?.buyerDetails[0]?.buyerName.toLowerCase()
  //         .includes(`${orderData.toLowerCase()}`) ||
  //       data?.orderId !== null && String(data?.orderId).toLowerCase().includes(`${orderData.toLowerCase()}`) ||
  //       data?.routeName !== null && data?.routeName.toLowerCase().includes(`${orderData.toLowerCase()}`)
  //     );
  //   });
  // };

  const borderActive = countryConfig[userCountry].borderBottomColor;

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex van-replenish-cont">
          <div className="flex">
            <Link to={`/dashboard/van-inventory/${distCode}`}>
              <Previouspage />
            </Link>
            <h2 className="font-customRoboto mx-4 text-black font-bold text-2xl">
              {t("van_transactions")}
            </h2>
          </div>
        </div>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div className="flex flex-row justify-between items-center border-b h-16 px-8">
              <div className="flex justify-between font-customGilroy text-base font-medium not-italic text-grey-85 w-3/7 h-full">
                <li className="flex ">
                  <a
                    className="flex pt-6 w-36"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderData("");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <p
                      className={
                        "flex font-customGilroy text-base font-normal mr-16 " +
                        (orderData === ""
                          ? "text-active border-b-4 rounded"
                          : "text-default")
                      }
                      style={{ borderColor: orderData === "" ? borderActive : "" }}
                    >
                      {t("all_orders")}
                    </p>
                  </a>
                </li>
                <li className="flex ">
                  <a
                    className="flex pt-6 w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderData("Placed");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <p
                      className={
                        "flex font-customGilroy text-base font-normal mr-16 " +
                        (orderData === "Placed"
                          ? "text-active border-b-4 rounded"
                          : "text-default")
                      }
                      style={{ borderColor: orderData === "Placed" ? borderActive : "" }}

                    >
                      {t("open")}
                    </p>
                  </a>
                </li>
                <li className="flex ">
                  <a
                    className="flex w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderData("Assigned");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <p
                      className={
                        "flex pt-6 font-customGilroy text-base font-normal mr-16 " +
                        (orderData === "Assigned"
                          ? "text-active border-b-4 rounded"
                          : "text-default")
                      }
                      style={{ borderColor: orderData === "Assigned" ? borderActive : "" }}

                    >
                      {t("assigned")}
                    </p>
                  </a>
                </li>
                <li className="flex ">
                  <a
                    className="flex w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderData("Accepted");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <p
                      className={
                        "flex pt-6 font-customGilroy text-base font-normal mr-16 " +
                        (orderData === "Accepted"
                          ? "text-active border-b-4 rounded"
                          : "text-default")
                      }
                      style={{ borderColor: orderData === "Accepted" ? borderActive : "" }}

                    >
                      {t("accepted")}
                    </p>
                  </a>
                </li>
                <li className="flex ">
                  <a
                    className="flex w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderData("Completed")
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <p
                      className={
                        "flex pt-6 font-customGilroy text-base font-normal mr-16 " +
                        (orderData === "Completed"
                          ? "text-active border-b-4 rounded"
                          : "text-default")
                      }
                      style={{ borderColor: orderData === "Completed" ? borderActive : "" }}

                    >
                      {t("completed")}
                    </p>
                  </a>
                </li>
                <li className="flex ">
                  <a
                    className="flex w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderData("Rejected");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <p
                      className={
                        "flex pt-6 font-customGilroy text-base font-normal mr-16 " +
                        (orderData === "Rejected"
                          ? "text-active border-b-4 rounded border-basic"
                          : "text-default")
                      }
                      style={{ borderColor: orderData === "Rejected" ? borderActive : "" }}

                    >
                      {t("rejected")}
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
                onKeyUp={() =>
									search("search", "filter")
								}
                placeholder={t("keyword")}
              />
            </div>
            <div className="tab-content tab-space">
              <div className="" id="link1">
                <table className="min-w-full mt-8 divide-y divide-gray-200">
                  <thead className="bg-transparent ">
                    <tr className="">
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        S/N
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("date")}
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("order_number")}
                      </th>
                      {/* <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("delivery_driver_id")}
                      </th> */}
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("delivery_driver_name")}
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("customer_name")}
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("order_type")}
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("amount")}
                      </th>
                      {/* <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        Total Orders
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        Total Amount <br />
                        Spent
                      </th> */}
                    </tr>
                  </thead>
                  <tbody id="filter" className="bg-white px-6 divide-y divide-gray-200">
                    {getOrderByVSM().length === 0 ? (
                      <tr className="my-8 justify-center">
                        <td colSpan={9}>
                          <img className="m-auto" src={noOrder} />
                        </td>
                      </tr>
                    ) : (
                        orders &&
                        getOrderByVSM().map((order, index) => (
                          // <>
                          <tr
                            key={order?.orderId}
                            //   onClick={() => pushTomanageCustomer(customer.id, code)}
                            className="cursor-pointer"
                          >
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {index + 1 + "."}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">

                              {moment(order?.datePlaced).format("MMMM Do YYYY")}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">

                              {order?.orderId}
                            </td>
                            {/* <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                          {order?.vehicleId}
                        </td> */}
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {getDriverName(order?.vehicleId)?.name}
                            </td>
                            <td
                              onClick={() =>
                                handlePush(
                                  distCode,
                                  order?.orderId,
                                  order?.buyerCompanyId
                                )
                              }
                              className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {order?.buyerDetails[0]?.buyerName}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              <span className="text-white p-2" style={{ backgroundColor: countryConfig[userCountry].orderTypeColor, borderRadius: '14px' }}>
                                {order?.routeName}
                              </span>
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {formatPriceByCountrySymbol(country, order?.totalPrice)}
                            </td>
                            {/* <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                          {customer.totalOrder}
                        </td>
                        <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                          {customer.amountSpent}
                        </td> */}
                          </tr>
                          // </>
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
        </div>
      </div>
    </Dashboard>
  )
}

const mapStateToProps = (state) => {
  return {
    distributor: state.AllDistributorReducer.distributor,
    allDistributors: state.AllDistributorReducer.all_distributors,
    orders: state.OrderReducer.all_orders,
    orderLength: state.OrderReducer.totalOrdersCount,
    allDrivers: state.OrderReducer.all_drivers,
  };
};

export default connect(mapStateToProps, {
  getAllDriversByOwnerId,
  getAllOrdersByDistributor,
})(VanTransactions);
