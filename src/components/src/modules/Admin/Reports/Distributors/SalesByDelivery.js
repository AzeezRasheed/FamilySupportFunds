import React, { useEffect, useState } from "react";
import moment from "moment";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import CalendarIcon from "../../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom" 
import  { connect, useDispatch, useSelector } from "react-redux";
import {
  getSingleDistributor,
  getSingleDistributorBySyspro,
} from "../../pages/actions/adminDistributorAction";
import {
  getAllCompletedOrdersByDistributor,
  getAllDriversByOwnerId,
  getAllOrders,
  getDistOrdersByDateRange,
  setLoadingToDefault,
} from "../../order/actions/orderAction";
import { filter, orderBy, uniqBy } from "lodash";
import { completedOrdersNet } from "../../../../utils/urls";
import Arrowdown from "../../../../assets/svg/arrowDown.svg";
import { showCalendar } from "../actions/ReportAction";
import Calendar from "../../../../components/common/Calendar";
import { formatPriceByCountrySymbol } from "../../../../utils/formatPrice";
import { getAllDistributors } from "../../KPO/actions/UsersAction";
import LoadingList from "../../../../components/common/LoadingList";
import Pagination from "../../components/pagination";
import { useTranslation } from "react-i18next";

const SalesByDelivery = ({ location, distributor, getSingleDistributor }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const ccountry = AuthData?.country;
  let PageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const code = location.pathname.split("/").at(-1);
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );
  const allDrivers = useSelector((state) => state.OrderReducer.all_drivers);
  const loading = useSelector((state) => state.OrderReducer.loading);

  useEffect(() => {
    getSingleDistributorBySyspro(code);
    !allDrivers && dispatch(getAllDriversByOwnerId(code));
    !allDistributors && dispatch(getAllDistributors(ccountry));
  }, []);

  // if (!allDrivers) {
  //   dispatch(getAllDriversByOwnerId(code));
  // }

  const getDistributorName = (code) => {
    let thisDistributor = filter(allDistributors, { SYS_Code: code })[0];
    if (!thisDistributor) {
      thisDistributor = filter(allDistributors, { DIST_Code: code })[0];
    }
    return thisDistributor;
  };

  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [calendarText, setCalendarText] = useState(t("this_month"));
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
  const [grandTotal, SetGrandTotal] = useState(0);
  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );

  useEffect(() => {
    if (Object.keys(selectedDayRange).length !== 0) {
      const start =
        selectedDayRange?.from?.year +
        "-" +
        selectedDayRange?.from?.month +
        "-" +
        selectedDayRange?.from?.day;

      setStartRange(start + " 00:00:00");

      const stop =
        selectedDayRange?.to?.year +
        "-" +
        selectedDayRange?.to?.month +
        "-" +
        selectedDayRange?.to?.day;
      setStopRange(stop + " 23:59:59");

      // Object.keys(selectedDayRange.to).length !== 0
      //   ? setStopRange(stop)
      //   : setStopRange(start + " 23:59:59");

      if (start !== stop) {
        setCalendarText(t("custom date"));
        setCustomDate(
          selectedDayRange?.from?.year +
            "/" +
            selectedDayRange?.from?.month +
            "/" +
            selectedDayRange?.from?.day +
            "  ->  " +
            selectedDayRange?.to?.year +
            "/" +
            selectedDayRange?.to?.month +
            "/" +
            selectedDayRange?.to?.day
        );
      } else {
        start === stopDay && stop === stopDay
          ? setCalendarText(t("today"))
          : setCalendarText(t("custom date"));
        setCustomDate("");
        setStartRange(start + " 00:00:00");
        setStopRange(stop + " 23:59:59");
      }
    }
  }, [selectedDayRange]);

  useEffect(() => {
    dispatch(setLoadingToDefault());
    dispatch(
      getDistOrdersByDateRange(
        startRange,
        stopRange,
        getDistributorName(code)?.SYS_Code
      )
    );
  }, [startRange, stopRange, allDistributors]);

  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
  );
  let completedOrders = filter(allSystemOrders, function (order) {
    return order.routeName === "SalesForce" && order.status === "Completed";
  });
  const deliveryOrders = orderBy(completedOrders, "orderId", "desc");

  const uniqueAllOrders = uniqBy(deliveryOrders, "orderId");

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      uniqueAllOrders && uniqueAllOrders.slice(firstPageIndex, lastPageIndex)
    );
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  useEffect(() => {
    const totalSales = completedOrders.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.price),
      0
    );
    SetGrandTotal(
      formatPriceByCountrySymbol(ccountry, totalSales).toLocaleString(
        // or use String(totalSales).replace(/(.)(?=(\d{3})+$)/g,'$1,')
        undefined // leave undefined to use the visitor's browser
        // locale or a string like 'en-US' to override it.
        // { minimumFractionDigits: 2 }
      )
    );
  }, [completedOrders]);

  const backButton = () => {
    // history.push("/distributor/reports/" + code);
    history.goBack();
  };

  const handlePush = (code) => {
    // history.push(`/admin-dashboard/distributor/reports/${code}`);
  };

  const getDriverDetails = (VehicleID) => {
    let thisDriver = allDrivers?.filter((driver) => {
      return driver?.vehicleId === parseInt(VehicleID);
    })[0];
    return thisDriver;
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-10 lg:pb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={() => backButton()} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {getDistributorName(code)?.company_name}
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
            {getDistributorName(code)?.company_type}
          </p>
          /
          <p className="font-medium text-grey-100">
            {getDistributorName(code)?.company_name}
          </p>
          /<p className="font-medium text-grey-100">salesforce orders</p>
        </div>
        <div className="flex" style={{ justifyContent: "space-between" }}>
          <div style={{ maxWidth: 300, position: "absolute" }}>
            <Calendar />
          </div>
          <div
            className="flex mt-4 px-3 report-date-cont justify-between bg-white w-40 h-12"
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(showCalendar(true))}
          >
            <img
              style={{ height: "25px", margin: "auto" }}
              src={CalendarIcon}
              alt=""
            />
            <p className="report-date">{calendarText}</p>
            <div className="mx-1 my-auto">
              <img className="" src={Arrowdown} alt="" />
            </div>
          </div>
          <div className="flex gap-16 items-center">
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              {t("total_amount")}: {grandTotal}
            </span>
          </div>
        </div>
        <div
          className="bg-white my-10 py-6"
          style={{
            boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2)",
            borderRadius: "8px",
          }}
        >
          {loading ? (
            <LoadingList />
          ) : (
            <>
              <table className="min-w-full mt-3 divide-y divide-grey-500">
                <thead className="bg-transparent font-customGilroy text-sm text-grey-100 tracking-widest">
                  <tr className="">
                    <th className="pl-8 py-3 text-gray-400 font-medium text-left align-middle">
                      S/N
                    </th>
                    <th className="py-3 text-left align-middle">{t("date")}</th>
                    <th className="py-3 text-left align-middle">
                      {t("order")}
                    </th>
                    <th className="py-3 text-left align-middle">
                      {t("delivery_driver")} Id
                    </th>
                    <th className="py-3 text-left align-middle">
                      {t("delivery_name")}
                    </th>
                    <th className="py-3 text-left align-middle">
                      {t("customer_name")}
                    </th>
                    <th className="py-3 text-left align-middle">
                      {t("amount")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white px-6 divide-y divide-gray-200">
                  {currentTableData().map((order, index) => (
                    <tr
                      key={index}
                      onClick={handlePush}
                      className="cursor-pointer"
                    >
                      <td className="font-customGilroy text-sm font-medium text-left align-middle pl-8 py-6">
                        {index + 1}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {moment(order.datePlaced).format("DD/MM/YYYY")}
                      </td>
                      <td
                        onClick={() =>
                          history.push(
                            `/distributor/order-summary/${order.orderId}/${order.buyerCompanyId}`
                          )
                        }
                        className="font-customGilroy text-sm font-medium text-left align-middle py-6"
                      >
                        {order.orderId}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {order.vehicleId}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {getDriverDetails(order.vehicleId)?.name}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {order.buyerDetails[0]?.buyerName}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {formatPriceByCountrySymbol(ccountry, order.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
              {uniqueAllOrders && (
                <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={uniqueAllOrders?.length}
                    pageSize={PageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </>
          )}
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
})(SalesByDelivery);
