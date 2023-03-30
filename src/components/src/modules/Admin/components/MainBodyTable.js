import React, {useState, useEffect} from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  SearchIcon,
  EyeIcon,
  SortDescendingIcon,
  SwitchVerticalIcon,
} from "@heroicons/react/solid";
import { useTranslation } from "react-i18next";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'
import { CalendarIcon } from "@heroicons/react/outline";
import { Sort, ArrowDown } from "../../../assets/svg/index";
import noOrder from "../../../assets/svg/noOrders.svg";
import { formatPriceByCountrySymbol } from "../../../utils/formatPrice";

import { OverviewTableTh } from "../../../utils/data";
import Pagination from "./pagination";

const MainBodyTable = ({ orders, orderData, setOrderData, setCurrentPage, currentPage, allDrivers, orderLength }) => {
  const { t } = useTranslation();
  const PageSize = 10
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const ccountry = AuthData?.country;

  const [userCountry, setCountry] = useState('Ghana');


    useEffect(async () => {
      const loc = await getLocation();
      setCountry(loc);
    })
  const getDriverName = (vehicleId) => {
    const driversName =
      allDrivers &
      allDrivers.filter((driver) => driver?.vehicleId === +vehicleId)[0];
    return driversName;
  };
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
  return (
    <div className="main-table">
      <div className="main-table-header">
        <div className="section-header">
          <h6>{t("recent_orders")}</h6>
          {/* <div className="section-header-right">
            <EyeIcon className="h-5" color={countryConfig[userCountry].borderBottomColor} />
            <p style={{color: countryConfig[userCountry].borderBottomColor}}>{t("view_all")}</p>
          </div> */}
        </div>

        <div className="header-botton-row">
          <div style={{ width: "33%"}} className="search-bar table-search-bar">
            <div className="search-bar-icon">
              <SearchIcon className="h-5" color="#9799a0" />
            </div>
            <input
              className="py-3 search-bar-input"
              type="text"
              placeholder={t("order_number_customer_name_driver")}
            />
          </div>

          <div className="flex ml-3">
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
								{ccountry !== "Nigeria" ? (
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
      </div>
      <table className="table">
        <tr>
          <th className="right-align">S/N</th>
          <th>{t("order_number")}</th>
          <th>{t("date")}</th>
          <th>{t("customer_name")}</th>
          <th>{t("route_name")}</th>
          <th>{t("status")}</th>
          <th>{t("products")}</th>
          <th>{t("amount")}</th>
        </tr>
        {orderLength === 0 ? (
          <tr className="my-8 justify-center">
            <td colSpan={9}>
              <img className="m-auto" src={noOrder} />
            </td>
          </tr>
        ) : (
          orders.map((order, index) => (
            <tr key={index + 1}>
              <td className="right-align">{`${index + 1}.`}</td>
              <td>{order?.orderId}</td>
              <td>
                {moment(order && order?.datePlaced).format("MMMM Do YYYY")}
              </td>
              <td>{order && order?.buyerDetails[0]?.buyerName}</td>
              <td>{order && order?.routeName}</td>
              <td>
                <span className={showColor(order)}>
                  {order && order?.status}
                </span>
              </td>
              <td className="td-numbers">
                {order && order?.orderItems?.length}
              </td>
              <td>
                {formatPriceByCountrySymbol(
                  ccountry,
                  order && order?.totalPrice
                )}
              </td>
            </tr>
          ))
        )}
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
  );
};

export default MainBodyTable;
