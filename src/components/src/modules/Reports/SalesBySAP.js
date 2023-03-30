import React, { useEffect, useState } from "react";
import moment from "moment";
import Dashboard from "../../Layout/Dashboard";
import { Previouspage } from "../../assets/svg/adminIcons";
import Download from "../../assets/svg/download-report.svg";
import CalendarIcon from "../../assets/svg/calendarIcon.svg";
import { useHistory, useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getSingleDistributor,
  getSingleDistributorBySyspro,
} from "../Admin/pages/actions/adminDistributorAction";
import {
  getAllDriversByOwnerId,
  getAllOrders,
  getAllOrdersByDateRange,
  getDistOrdersByDateRange,
  setLoadingToDefault,
} from "../Admin/order/actions/orderAction";
import { filter, orderBy, uniqBy } from "lodash";
import Arrowdown from "../../assets/svg/arrowDown.svg";
import { showCalendar } from "../Admin/Reports/actions/ReportAction";
import Calendar from "../../components/common/Calendar";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { getAllDistributors } from "../Admin/KPO/actions/UsersAction";
import LoadingList from "../../components/common/LoadingList";
import Pagination from "../Admin/components/pagination";

const SalesBySAP = ({ location, distributor, getSingleDistributor }) => {
  const history = useHistory();
  const { Dist_Code } = useParams();
  const dispatch = useDispatch();
  const AuthData =  useSelector(state => state.Auth.sessionUserData);
  const ccountry = AuthData?.country;
  let PageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getSingleDistributorBySyspro(Dist_Code);
  }, []);

  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [calendarText, setCalendarText] = useState("This Month");
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
  const [grandTotal, SetGrandTotal] = useState(0);
  const [uniqueAllOrders, setUniqueOrders] = useState([]);
  const [salesforce, setSalesforce] = useState([]);

  useEffect(() => {
    dispatch(getAllDriversByOwnerId(Dist_Code));
  }, []);

  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
  );

  const loading = useSelector((state) => state.OrderReducer.loading);

  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  if (!allDistributors) {
    dispatch(getAllDistributors(ccountry));
  }

  const allDrivers = useSelector((state) => state.OrderReducer.all_drivers);
  if (!allDrivers) {
    dispatch(getAllDriversByOwnerId(Dist_Code));
  }

  const getDistributorName = (code) => {
    let thisDistributor = filter(allDistributors, { SYS_Code: code })[0];
    if (!thisDistributor) {
      thisDistributor = filter(allDistributors, { DIST_Code: code })[0];
    }
    return thisDistributor;
  };

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
        setCalendarText("Custom Date");
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
          ? setCalendarText("Today")
          : setCalendarText("Custom Date");
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
        getDistributorName(Dist_Code)?.SYS_Code
      )
    );
  }, [startRange, stopRange, allDistributors]);

  useEffect(() => {
    allSystemOrders && setUniqueOrders(uniqBy(allSystemOrders[0], "orderId"));
  }, [allSystemOrders]);

  useEffect(() => {
    let walkInSales = filter(uniqueAllOrders, function (order) {
      return order.routeName === "SAP" && order.status === "Completed";
    });
    uniqueAllOrders && setSalesforce(walkInSales);
  }, [uniqueAllOrders]);

  // let completedOrders = filter(allSystemOrders, function (order) {
  //   return order.routeName === "SalesForce" && order.status === "Completed";
  // });
  // const deliveryOrders = orderBy(completedOrders, "orderId", "desc");
  // const uniqueAllOrders = uniqBy(deliveryOrders, "orderId");

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return salesforce && salesforce.slice(firstPageIndex, lastPageIndex);
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  const backButton = () => {
    // history.push("/dashboard/reports/" + code);
    history.goBack();
  };

  const handlePush = (sellerId, orderId, buyerId) => {
    history.push(`/dashboard/order-summary/${sellerId}/${orderId}/${buyerId}`);
  };

  useEffect(() => {
    const totalSales = salesforce.reduce(
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
  }, [salesforce]);

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
              SAP Orders
            </p>
          </div>
          <div className="flex gap-16 items-center">
            {/* <div className="flex justify-end gap-4 pr-3">
              <img src={Download} />
              <p className="report-download">Download Report</p>
            </div> */}
          </div>
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
              Total Amount: {grandTotal}
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
                    <th className="py-3 text-left align-middle">Date</th>
                    <th className="py-3 text-left align-middle">Order</th>
                    <th className="py-3 text-left align-middle">
                      Delivery Driver Id
                    </th>
                    <th className="py-3 text-left align-middle">
                      Delivery Name
                    </th>
                    <th className="py-3 text-left align-middle">
                      Customer Name
                    </th>
                    <th className="py-3 text-left align-middle">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white px-6 divide-y divide-gray-200">
                  {currentTableData().map((order, index) => (
                    <tr key={index} className="cursor-pointer">
                      <td className="font-customGilroy text-sm font-medium text-left align-middle pl-8 py-6">
                        {index + 1}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {moment(order.datePlaced).format("DD/MM/YYYY")}
                      </td>
                      <td
                        onClick={() =>
                          handlePush(
                            Dist_Code,
                            order?.orderId,
                            order?.buyerCompanyId
                          )
                        }
                        className="font-customGilroy cursor-pointer text-sm font-medium text-left align-middle py-6"
                      >
                        <p className="text-red-900 font-medium">
                          {order?.orderId}
                        </p>
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {order.vehicleId}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {getDriverDetails(order?.vehicleId)?.name}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {order?.buyerName}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {formatPriceByCountrySymbol(
                          ccountry,
                          order?.totalPrice
                        )}
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
})(SalesBySAP);
