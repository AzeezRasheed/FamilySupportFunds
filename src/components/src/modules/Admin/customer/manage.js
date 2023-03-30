import React, { useEffect } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";

import moment from "moment";
import {
	Arrows,
	Customer,
	Edit,
	EmptyList,
	Location,
	Long_Lat,
	Mail,
	Phone,
	Return,
} from "../../../assets/svg/adminIcons";
import noOrder from "../../../assets/svg/noOrders.svg";
import Dashboard from "../../../Layout/Admin/Dashboard";
import { OrdersList } from "../../../utils/data";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { getAllDriversByOwnerId } from "../order/actions/orderAction";
import { getSingleDistributor } from "../pages/actions/adminDistributorAction";
import { formatPriceByCountrySymbol } from "../../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import {
	getSingleDistributorCustomers,
	getSingleDistributorCustomerOrder,
} from "./actions/customer";

const ManageCustomer = ({
	location,
	orders,
	allDrivers,
	getAllDriversByOwnerId,
	getSingleDistributorCustomerOrder,
	getSingleDistributor,
	distributor,
	distCustomer,
	getSingleDistributorCustomers,
}) => {
	const { t } = useTranslation();

	const checkOrderList = true;
	const { id } = useParams();
	const AuthData = useSelector((state) => state.Auth.sessionUserData);
	const country = AuthData?.country;
	const history = useHistory();
	const sum = (orders) => {
		return orders.reduce(
			(a, b) => parseFloat(a) + parseFloat(b.totalPrice),
			0
		);
	};
	const handlePush = (code, orderId) => {
		history.push(`/distributor/order-summary/${orderId}/${code}`);
	};
	// const handlePush = (orderId, buyerId) => {
	//   history.push(`/dashboard/order-summary/${dist_code}/${orderId}/${buyerId}`);
	// }

	const showColor = (order) => {
		let bgcolor = "";
		if (order?.status === "Placed") {
			bgcolor = "grey";
		} else if (order?.status === "Completed") {
			bgcolor = "green";
		} else if (order?.status === "Assigned") {
			bgcolor = "blue";
		} else if (order?.status === "Accepted") {
			bgcolor = "orange";
		} else if (order?.status === "Rejected") {
			bgcolor = "red";
		}
		return bgcolor;
	};

	const distCode = location.pathname.split("/")[3];
	// const {
	//   params: { id },
	// } = useRouteMatch("/distributor/manage-customer/:distCode/:id");

	const getDriverName = (vehicleId) => {
		const driversName = allDrivers.filter(
			(driver) => driver?.vehicleId === +vehicleId,
			10
		)[0];
		return driversName;
	};

	useEffect(() => {
		getSingleDistributorCustomers(id, country);
		getSingleDistributor(distCode);
		getAllDriversByOwnerId(distCode);
		getSingleDistributorCustomerOrder(id, distCode);
	}, []);

	return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex flex-row justify-between items-center">
          <div className="flex gap-4">
            {/* <Link to="/distributor/customers"> */}
            <Return onClick={() => history.goBack()} />
            {/* </Link> */}
            <h2 className="font-customRoboto text-black font-bold text-2xl">
              {distCustomer[0]?.CUST_Name}
            </h2>
          </div>
          <div className="flex gap-4 items-center">
            {/* <div className="flex gap-1 font-customGilroy text-sm font-medium text-red-900 text-center align-middle p-6">
              <Edit />
            </div> */}
            {/* <div className="flex justify-end items-center gap-4">
              <Arrows />
              1/500
            </div> */}
          </div>
        </div>
        <div className="flex items-center mt-2 gap-2 font-customGilroy text-sm font-medium not-italic mb-16">
          <p className="text-gray-400">{distCustomer[0]?.CUST_Type} /</p>
          <p className="text-grey-85">{distributor?.company_name} /</p>
          <p className="text-grey-85">{distCustomer[0]?.CUST_Name}</p>
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
                    {distCustomer[0]?.CUST_Name}
                  </p>
                  <div className="flex font-medium text-grey mt-2">
                    <p className="">{distCustomer[0]?.SF_Code}</p>
                    <div className="mx-20 border-l-2 text-grey"></div>
                    <div>
                      <p className="text-xs text-grey">STP Code</p>
                      <p className="font-customGilroy font-medium text-small text-black mt-2">
                        {distCustomer[0]?.account_id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className={`rounded-full ${
                    distCustomer[0]?.status ? "bg-green-500" : "bg-red-500"
                  } font-customGilroy text-sm font-medium text-center text-white py-1 px-3`}
                >
                  {distCustomer[0]?.status || "Inactive"}
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
                  {formatPriceByCountrySymbol(country, sum(orders))}
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
                  {formatPriceByCountrySymbol(
                    country,
                    orders.length > 0
                      ? parseInt(sum(orders) / parseInt(orders.length))
                      : 0
                  )}
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
              <p>
                {distCustomer[0]?.owners_first_name}{" "}
                {distCustomer[0]?.owners_last_name}
              </p>
            </div>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Mail />
              <p>
                {distCustomer[0]?.email
                  ? distCustomer[0]?.email
                  : "No Email Available"}
              </p>
            </div>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Phone />
              <p>{distCustomer[0]?.phoneNumber}</p>
            </div>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Location />
              <p>
                {distCustomer[0]?.address}
                <br />
                <span className="text-grey-100">
                  {distCustomer[0]?.district}
                </span>
              </p>
            </div>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Long_Lat />
              <p>{`${distCustomer[0]?.longitude}° N, ${distCustomer[0]?.latitude}° E`}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 bg-white rounded-lg shadow 2xl py-6 px-8 gap-4">
          <div className="flex justify-between font-customGiroy font-bold text-lg text-grey-85 not-italic mb-8">
            <p>{t("recent_orders")}</p>
            {/* <View /> */}
          </div>
          <div className="flex items-center gap-4 justify-start">
            {/* <input
              className="w-search-bar bg-gray-200 placeholder-gray-300::placeholder p-3 rounded"
              placeholder="Order number, Customer name, Route name, Driver"
            /> */}
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
                  {t("product")}
                </th>
                <th className="py-3 text-left text-xs font-semibold text-grey-100 text-center leading-4 text-black align-middle">
                  {t("amount")}
                </th>
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
                    key={order.id}
                    onClick={() =>
                      handlePush(
                        distCustomer[0] && distCustomer[0]?.SF_Code,
                        order?.orderId
                      )
                    }
                    className="cursor-pointer"
                  >
                    <td className="font-customGilroy text-sm font-medium text-center align-middle pl-8 py-6">
                      {`${index + 1}.`}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
                      {order?.orderId}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
                      {moment(order?.datePlaced).format("MMMM Do YYYY")}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
                      {order?.routeName}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
                      {getDriverName(order?.vehicleId)?.name
                        ? getDriverName(order?.vehicleId)?.name
                        : order?.vehicleId}
                    </td>
                    <td className="text-center align-middle">
                      <span className={showColor(order)}>{order?.status}</span>
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center mr-3 align-middle">
                      {order?.noOfProduct}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-center align-middle">
                      {formatPriceByCountrySymbol(country, order.totalPrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Dashboard>
  );
};

const mapStateToProps = (state) => {
	return {
		distributor: state.AllDistributorReducer.distributor,
		distCustomer: state.CustomerReducer.customer,
		orders: state.CustomerReducer.customer_order,
		allDrivers: state.OrderReducer.all_drivers,
	};
};

export default connect(mapStateToProps, {
	getSingleDistributorCustomers,
	getSingleDistributor,
	getAllDriversByOwnerId,
	getSingleDistributorCustomerOrder,
})(ManageCustomer);
