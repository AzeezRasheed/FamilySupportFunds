import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { filter, flatten } from "lodash";
import { useSelector } from 'react-redux';
import moment from "moment";
import {
  Customer,
  Location,
  Long_Lat,
  Phone,
  Return,
} from "../../../../assets/svg/adminIcons";
import noOrder from "../../../../assets/svg/noOrders.svg";
import Dashboard from "../../../../Layout/Dashboard";
import { OrdersList } from "../../../../utils/data";
import { useHistory, useParams } from "react-router-dom";
import { getAllOrderForDrivers } from "../../../Admin/order/actions/orderAction";
import { getDriverDetails } from "../../actions/vanAction";
import { connect } from "react-redux";
import { formatPriceByCountrySymbol } from "../../../../utils/formatPrice";
import { formatNumber } from "../../../../utils/formatNumber";
import { useTranslation } from "react-i18next";

const ManageVsm = ({
  location,
  getDriverDetails,
  driver,
  getAllOrderForDrivers,
  allDriverOrders,
}) => {
  const history = useHistory();
  const [totalCases, setTotalCases] = useState(0);
  const [orderData, setOrderData] = useState("");
	const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const { distCode, vehicleId } = useParams();
  const { t } = useTranslation();
  const handlePush = (sellerId, orderId, buyerId) => {
    history.push(`/dashboard/order-summary/${sellerId}/${orderId}/${buyerId}`);
  };

  useEffect(() => {
    const waitResults = async () => {
      await getAllOrderForDrivers(vehicleId);
      await getDriverDetails(vehicleId);
    };
    waitResults();
  }, [distCode, vehicleId]);

  const completedOders = filter(allDriverOrders, function (order) {
    return order.status === "Completed";
  });
  const sum = (orders) => {
    return orders.reduce((a, b) => parseFloat(a) + parseFloat(b.totalPrice), 0);
  };

  const sortOrder = () => {
    const sorted = allDriverOrders.sort(
      (a, b) => new Date(b.datePlaced) - new Date(a.datePlaced)
    );
    return sorted;
  };


  const sortOrderDrivers = () => {
    const result = allDriverOrders && sortOrder().filter((data) => (
      data?.status?.startsWith(`${orderData}`) ||
      data?.buyerDetails[0]?.buyerName !== null && data?.buyerDetails[0]?.buyerName
        .toLowerCase()
        .includes(`${orderData.toLowerCase()}`) ||
      data?.orderId !== null && String(data?.orderId).toLowerCase().includes(`${orderData.toLowerCase()}`) ||
      data?.routeName !== null && data?.routeName.toLowerCase().includes(`${orderData.toLowerCase()}`)
    ));

    return result
  };

  const totalVolume = () => {
    let orderItems = [];
    allDriverOrders.map((order, index) => {
      orderItems.push(order.orderItems);
    });
    orderItems = flatten(orderItems);
    return orderItems.reduce((a, b) => parseInt(a) + parseInt(b.quantity), 0);
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

  // const {
  //   params: { id },
  // } = useRouteMatch("/distributor/manage-customer/:distCode/:id");

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex flex-row justify-between items-center">
          <div className="flex gap-4">
            <Link to={`/dashboard/van-sales-men/${distCode}`}>
              <Return />
            </Link>
            <h2 className="font-customRoboto ml-3 text-black font-bold text-2xl">
              {driver?.name}
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
        <div className="grid grid-rows-1 grid-flow-col gap-4 mt-8 mb-14">
          <div className="col-span-7 h-distributor-overview bg-white rounded shadow-2xl">
            <p className="font-customGilroy text-lg not-italic font-bold text-grey-85 mt-8 px-6">
              {t("vsm_overview")}
            </p>
            <div className="flex flex-row justify-between items-center border-b h-40 px-6">
              <div className="flex gap-4 font-customGilroy text-base not-italic">
                <Customer />
                <div className="ml-3">
                  <p className="font-bold text-grey-85">{driver?.name}</p>
                  <p className="font-medium text-grey-55 mt-2">
                    {driver.vehicleId}
                  </p>
                  <p className="font-medium text-grey-55 mt-2">
                    {driver.syspro_code
                      ? driver?.syspro_code
                      : driver?.ownerCompanyId}
                  </p>
                </div>
              </div>
              <div>
                <button className="rounded-full bg-green-500 font-customGilroy text-sm font-medium text-center text-white py-1 px-3">
                  {driver.vehicleId ? t("active") : t("inactive")}
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center px-12 pt-6 pb-8">
              <p className="font-customGilroy text-grey-70 font-normal text-sm text-center w-p">
                <span className="border-b-2 border-dotted border-grey-55">
                  {t("total_completed_order")}
                </span>
                <br />
                <span className="font-customGilroy font-semibold text-lg text-grey-85 mt-2">
                  {formatPriceByCountrySymbol(country, sum(completedOders))}
                </span>
              </p>
              <p className="font-customGilroy text-grey-70 font-normal text-sm text-center w-p">
                <span className="border-b-2 border-dotted border-grey-55">
                  {t("total_cases")}
                </span>
                <br />
                <span className="font-customGilroy font-semibold text-lg text-grey-85 mt-2">
                  {formatNumber(totalVolume())}
                </span>
              </p>
              <p className="font-customGilroy text-grey-70 font-normal text-sm text-center w-p">
                <span className="border-b-2 border-dotted border-grey-55">
                  {t("total_orders")}
                </span>
                <br />
                <span className="font-customGilroy font-semibold text-lg text-grey-85 mt-2">
                  {allDriverOrders.length}
                </span>
              </p>
              <p className="font-customGilroy text-grey-70 font-normal text-sm text-center w-p">
                <span className="border-b-2 border-dotted border-grey-55">
                  {t("average_completed_order_value")}
                </span>
                <br />
                <span className="font-customGilroy font-semibold text-lg text-grey-85 mt-2">
                  {formatPriceByCountrySymbol(
                    country,
                    completedOders.length > 0
                      ? parseInt(
                        sum(completedOders) / parseInt(completedOders.length)
                      )
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
              <Phone />
              <p>{driver?.phoneNumber}</p>
            </div>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Location />
              <p>{driver?.address}</p>
            </div>
            <div className="flex gap-4 text-grey-70 font-normal text-sm mb-4">
              <Long_Lat />
              <p>{driver?.country ? driver.country : "Not Available"}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 bg-white rounded-lg shadow 2xl py-6 px-8 gap-4">
          <div className="flex justify-between font-customGiroy font-bold text-lg text-grey-85 not-italic mb-8">
            <p>{t("all_orders")}</p>
          </div>
          <div className="flex items-center gap-4 justify-start">
            <input
              className="w-search-bar bg-gray-200 placeholder-gray-300::placeholder p-3 rounded"
              style={{ width: "26.5rem", backgroundColor: "#E5E5E5", outline: 'none' }}
              onChange={(e) => setOrderData(e.target.value)}
              placeholder={t("order_number_customer_name_route_name_driver")}
            />

            {/* <div className="flex items-center border border-grey-25 rounded p-3 shadow-md">
              <p className="font-customGilroy not-italic font-medium text-grey-85 ml-2">
                Select date range
              </p>
            </div> */}
          </div>
          <table className="min-w-full mt-8 divide-y divide-gray-200">
            <thead className="bg-transparent ">
              <tr>
                <th className="right-align">S/N</th>
                <th>{t("order_number")}</th>
                <th>{t("date")}</th>
                <th>{t("customer_name")}</th>
                <th>{t("products")}</th>
                <th>{t("route_name")}</th>
                <th>{t("status")}</th>
                <th>{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {allDriverOrders.length === 0 ? (
                <tr className="my-8 justify-center">
                  <td colSpan={9}>
                    <img className="m-auto" src={noOrder} />
                  </td>
                </tr>
              ) : (
                  sortOrderDrivers().map((order, index) => (
                    <tr key={index + 1}>
                      <td className="right-align">{`${index + 1}.`}</td>
                      <td>{order?.orderId}</td>
                      <td>
                        {moment(order && order?.datePlaced).format(
                          "MMMM Do YYYY"
                        )}
                      </td>
                      <td>{order && order?.buyerDetails[0]?.buyerName}</td>
                      <td className="td-numbers cursor-pointer"
                        style={{
                          color: "rgb(177, 31, 36)",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handlePush(
                            distCode,
                            order?.orderId,
                            order?.buyerCompanyId
                          )
                        }
                      >
                        {order && order?.orderItems.length}
                      </td>
                      <td>{order && order?.routeName}</td>
                      <td>
                        <span className={showColor(order)}>
                          {order && order?.status}
                        </span>
                      </td>
                      <td>
                        {formatPriceByCountrySymbol(
                          country,
                          order && order?.totalPrice
                        )}
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
    allDriverOrders: state.OrderReducer.all_orders_driver,
    driver: state.VanInventoryReducer.driverDetails,
  };
};

export default connect(mapStateToProps, {
  getAllOrderForDrivers,
  getDriverDetails,
})(ManageVsm);
