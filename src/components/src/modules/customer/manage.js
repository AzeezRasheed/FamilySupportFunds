import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Arrows,
  Customer,
  EmptyList,
  Location,
  Long_Lat,
  Mail,
  Phone,
  Return,
} from "../../assets/svg/adminIcons";
import straightDivider from "../../assets/svg/straightDivider.svg";
import CalendarIcon from "../../assets/svg/calendarIcon.svg";
import Dashboard from "../../Layout/Dashboard";
import { OrdersList } from "../../utils/data";
import { useHistory } from "react-router-dom" 
import  {
  getSingleDistributorCustomerOrder,
  getSingleDistributorCustomers,
} from "../Admin/customer/actions/customer";
import { getSingleDistributor } from "../Admin/pages/actions/adminDistributorAction";
import moment from "moment";
import { filter } from "lodash";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";

const ManageCustomer = ({ location }) => {
  const { t } = useTranslation();
  const checkOrderList = true;
  const history = useHistory();
  const dispatch = useDispatch();
  const { distCode, id } = useParams();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  if (!dist_code) {
    dist_code = distCode;
  }

  const thisCustomerDetails = useSelector(
    (state) => state.CustomerReducer.customer
  )[0];


  const distributor = useSelector(
    (state) => state.AllDistributorReducer.distributor
  );

  useEffect(() => {

    dispatch(getSingleDistributorCustomers(id, country));
    dispatch(getSingleDistributor(dist_code));
  }, [id]);

  const orders = useSelector((state) => state.CustomerReducer.customer_order);
  const completedOrders = filter(orders, function (order) {
    return (
      order?.routeName === "Walk-In-Sales" ||
      (order?.routeName === "Van-Sales" && order?.status === "Completed") ||
      (order?.routeName === "Salesforce" && order?.status === "Completed")
    );
  });

  useEffect(() => {
    dispatch(
      getSingleDistributorCustomerOrder(thisCustomerDetails?.SF_Code, dist_code)
    );
  }, [thisCustomerDetails, distributor?.SYS_Code]);

  const sum = (completedOrders) => {
    return completedOrders.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.totalPrice),
      0
    );
  };

  const handlePush = (orderId, buyerId) => {
    history.push(`/dashboard/order-summary/${dist_code}/${orderId}/${buyerId}`);
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex flex-row justify-between items-center">
          <div className="flex gap-4">
            <div style={{ cursor: "pointer" }} onClick={() => history.goBack()}>
              <Return />
            </div>
            <h2 className="font-customRoboto text-black font-bold text-2xl">
              {thisCustomerDetails?.CUST_Name}
            </h2>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-1 font-customGilroy text-sm font-medium text-red-900 text-center align-middle p-6"></div>
            <div className="flex justify-end items-center gap-4">

            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 font-customGilroy text-sm font-medium not-italic mb-16">
          <p className="text-gray-400">Distributors /</p>
          <p className="text-grey-85">{distributor?.company_name} /</p>
          <p className="text-grey-85">{thisCustomerDetails?.CUST_Name}</p>
        </div>
        <div className="grid grid-rows-1 grid-flow-col gap-4 mb-14">
          <div className="col-span-7 h-distributor-overview bg-white rounded shadow-2xl">
            <p className="font-customGilroy text-lg not-italic font-bold text-grey-85 mt-8 px-6">
              {t("customer_overview")}
            </p>
            <div className="flex flex-row justify-between items-center border-b h-40 px-6">
              <div className="flex gap-4 font-customGilroy text-base not-italic">
                <Customer />
                <div>
                  <p className="font-bold text-grey-85">
                    {thisCustomerDetails?.CUST_Name}
                  </p>
                  <div className="flex font-medium text-grey mt-2">
                    <p className="">{thisCustomerDetails?.SF_Code}</p>
                    <div className="mx-20 border-l-2 text-grey"></div>
                    <div>
                      <p className="text-xs text-grey">STP Code</p>
                      <p className="font-customGilroy font-medium text-small text-black mt-2">
                        {thisCustomerDetails?.account_id ? thisCustomerDetails?.account_id: "N/A"}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-grey-55 mt-2">
                    {thisCustomerDetails?.registeredOn}
                  </p>
                </div>
              </div>
              <div>
             	  <button className={`rounded-full ${thisCustomerDetails?.status? "bg-green-500" : "bg-red-500"} font-customGilroy text-sm font-medium text-center text-white py-1 px-3`}>
									{thisCustomerDetails?.status || "Inactive"}
								</button>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center px-12 pt-6 pb-8">
              <p className="font-customGilroy text-grey-70 font-normal text-sm text-center w-p">
                <span className="border-b-2 border-dotted border-grey-55">
                  {t("total_amount_spent")}
                </span>
                <br />
                <span className="font-customGilroy font-semibold text-lg text-grey-85 mt-2">
                  {formatPriceByCountrySymbol(
                    country,
                    sum(completedOrders)
                  ).toLocaleString(undefined)}
                </span>
              </p>
              <p className="font-customGilroy text-grey-70 font-normal text-sm text-center w-p">
                <span className="border-b-2 border-dotted border-grey-55">
                  {t("total_orders")}
                </span>
                <br />
                <span className="font-customGilroy font-semibold text-lg text-grey-85 mt-2">
                  {orders.length}
                </span>
              </p>
              <p className="font-customGilroy text-grey-70 font-normal text-sm text-center w-p">
                <span className="border-b-2 border-dotted border-grey-55">
                  {t("average_order_value")}
                </span>
                <br />
                <span className="font-customGilroy font-semibold text-lg text-grey-85 mt-2">
                  {}
                  {completedOrders.length > 0
                    ? formatPriceByCountrySymbol(
                      country,
                      parseInt(sum(completedOrders)) / orders.length
                    ).toLocaleString(undefined)
                    : 0}
                </span>
              </p>
            </div>
          </div>
          <div
            className="col-span-2 h-small-modal bg-white rounded-lg font-customGilroy shadow-2xl px-8 py-6"
            style={{ height: "100%" }}
          >
            <p className=" not-italic font-bold text-lg text-grey-85 mb-8">
              {t("contact_details")}
            </p>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Mail />
              <p className="pl-3">
                {thisCustomerDetails?.email
                  ? thisCustomerDetails?.email
                  : t("no_email_available")}
              </p>
            </div>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Phone />
              <p className="pl-3">{thisCustomerDetails?.phoneNumber}</p>
            </div>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Location />
              <p className="text-grey-100 pl-3">
                {thisCustomerDetails?.address
                  ? thisCustomerDetails?.address
                  : thisCustomerDetails?.country}{" "}
                <br />
                <span className="text-grey-100">
                  {thisCustomerDetails?.district}
                </span>
              </p>
            </div>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Long_Lat />
              <p className="pl-3">
                {thisCustomerDetails?.latitude},{" "}
                {thisCustomerDetails?.longitude}° E
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 bg-white rounded-lg shadow 2xl py-6 px-8 gap-4">
          <div className="flex justify-between font-customGiroy font-bold text-lg text-grey-85 not-italic mb-8">
            <p>{t("recent_orders")}</p>
            {/* <View /> */}
          </div>
          <div
            className="flex items-center gap-4 justify-between"
            style={{ width: "100%" }}
          >
            {/* <input
              className="w-search-bar bg-gray-200 placeholder-gray-300::placeholder p-3 rounded"
              placeholder={t("order_number_customer_name_driver")}
              style={{ width: "60%" }}
            /> */}
            {/* <div className="flex justify-between" style={{ width: "35%" }}>
              <div className="flex items-center border border-grey-25 rounded p-3">
                <p className="font-customGilroy not-italic font-medium text-grey-85 mr-2">
                  {t("all_orders")}
                </p>
              </div>
              <div className="flex items-center border border-grey-25 rounded p-3">
                <p className="font-customGilroy not-italic font-medium text-grey-85 mr-2">
                  {t("all_drivers")}
                </p>
              </div>
              <div className="flex items-center border border-grey-25 rounded p-3">
                <p className="font-customGilroy not-italic font-medium text-grey-85 ml-2">
                  {t("sort_by")}
                </p>
              </div>
              <img className="mx-3" src={straightDivider} />
              <div className="flex text-center font-normal ml-1 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                <img className="pr-2" src={CalendarIcon} alt="" />
                <p className="text-sm text-default font-normal">
                  {t("select_date_range")}
                </p>
              </div>
            </div> */}
          </div>
          <table className="min-w-full mt-8 divide-y divide-gray-200">
            <thead className="bg-transparent ">
              <tr className="">
                <th className="py-3 text-left text-xs font-semibold text-grey-100 text-center leading-4 text-black align-middle">
                  S/N
                </th>
                <th className="py-3 text-left text-xs font-semibold text-grey-100 text-center leading-4 text-black align-middle">
                  {t("order")}
                  <br />
                  {t("number")}
                </th>
                <th className="py-3 text-left text-xs font-semibold text-grey-100 text-center leading-4 text-black align-middle">
                  {t("date")}
                </th>
                <th className="py-3 text-left text-xs font-semibold text-grey-100 text-center leading-4 text-black align-middle">
                  {t("route")}
                  <br />
                  {t("name")}
                </th>
                <th className="py-3 text-left text-xs font-semibold text-grey-100 text-center leading-4 text-black align-middle">
                  {t("delivery")}
                  <br />
                  {t("driver")}
                </th>
                <th className="py-3 text-left text-xs font-semibold text-grey-100 text-center leading-4 text-black align-middle">
                  {t("status")}
                </th>
                <th className="py-3 text-left text-xs font-semibold text-grey-100 text-center leading-4 text-black align-middle">
                  {t("products")}
                </th>
                <th className="py-3 text-left text-xs font-semibold text-grey-100 text-center leading-4 text-black align-middle">
                  {t("amount")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white px-6 divide-y divide-gray-200">
              {checkOrderList &&
                orders.map((order, index) => (
                  <tr
                    key={order.id}
                    onClick={() =>
                      handlePush(
                        order.orderId,
                        thisCustomerDetails && thisCustomerDetails.SF_Code
                      )
                    }
                    className="cursor-pointer"
                  >
                    <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                      {index + 1 + "."}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                      {order?.orderId}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                      {moment(order?.datePlaced).format("YYYY-MM-DD")}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                      {order.routeName}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                      {order?.vehicleId}
                    </td>
                    {order.status === "Completed" ? (
                      <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                        <button className="rounded-full bg-green-500 py-1 px-3">
                          {order?.status}
                        </button>
                      </td>
                    ) : order.status === "Assigned" ? (
                      <td className="font-customGilroy text-sm font-medium text-center text-white align-middle text-white p-6">
                        <button className="rounded-full bg-gray-300 py-1 px-3">
                          {order?.status}
                        </button>
                      </td>
                    ) : order.status === "Accepted" ? (
                      <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                        <button className="rounded-full bg-yellow-500 py-1 px-3">
                          {order?.status}
                        </button>
                      </td>
                    ) : order.status === "Rejected" ? (
                      <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                        <button className="rounded-full bg-red-500 py-1 px-3">
                          {order?.status}
                        </button>
                      </td>
                    ) : (
                              <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                <button className="rounded-full bg-gray-300 py-1 px-3">
                                  {order?.status}
                                </button>
                              </td>
                            )}
                    <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                      {order?.noOfProduct}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                      {formatPriceByCountrySymbol(
                        country,
                        parseInt(order.totalPrice)
                      ).toLocaleString(undefined)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!checkOrderList && (
            <div className="flex flex-col items-center justify-center py-4">
              <EmptyList />
              <p className="mt-5">{t("there_are_no_orders_yet")}</p>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default ManageCustomer;
