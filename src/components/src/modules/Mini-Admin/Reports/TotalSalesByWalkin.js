import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../Layout/Mini-Admin/Dasboard";
import { Previouspage } from "../../../assets/svg/adminIcons";
import CalendarIcon from "../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom" 
import  {
  getAllOrders,
  getAllOrdersByDateRange,
  getCountryOrdersByDateRange,
  setLoadingToDefault,
} from "../../Admin/order/actions/orderAction";
import { filter, orderBy, uniqBy, sortedUniqBy } from "lodash";
import { formatPriceByCountrySymbol } from "../../../utils/formatPrice";
import { getAllDistributors } from "../../Admin/KPO/actions/UsersAction";
import moment from "moment";
import { showCalendar } from "../../Admin/Reports/actions/ReportAction";
import Calendar from "../../../components/common/Calendar";
import Arrowdown from "../../../assets/svg/arrowDown.svg";
import { countryCode } from "../../../utils/countryCode";
import Pagination from "../../Admin/components/pagination";
import LoadingList from "../../../components/common/LoadingList";
import { GetDistributorsOrders } from "../GetDistributorsOrders";
import {Link} from "react-router-dom"
import { useTranslation } from "react-i18next";

const TotalSalesByDelivery = ({ location, distributor }) => {
  const {t} = useTranslation()
  const history = useHistory();
  const dispatch = useDispatch();

  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [calendarText, setCalendarText] = useState("Calendar");
  const [customDate, setCustomDate] = useState("");
  const [grandTotal, SetGrandTotal] = useState(0);
  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  let PageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const loading = useSelector((state) => state.OrderReducer.loading);

  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
  );
  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  useEffect(() => {
    !allDistributors && dispatch(getAllDistributors(country));
  }, [])

  GetDistributorsOrders("Walk-In-Sales");

  let completedOrders =
    allSystemOrders?.orders?.length > 0 &&
    allSystemOrders?.filter(
      (order) =>
        order?.routeName === "Walk-In-Sales" ||
        (order?.routeName === "One-Off" &&
          (order.vehicleID === "" || order.vehicleId === null))
    );
  completedOrders = orderBy(completedOrders, "orderId", "desc");
  const uniqueCompletedOrders = uniqBy(completedOrders, "sellerCompanyId");

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      uniqueCompletedOrders &&
      uniqueCompletedOrders.slice(firstPageIndex, lastPageIndex)
    );
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);


  const getDistTotalAmount = (code) => {
    const thisOrders = filter(completedOrders, { sellerCompanyId: code });
    const totalSales = thisOrders.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.price),
      0
    );
    return totalSales;
  };

  const backButton = () => {
    // history.push("/admin-dashboard/reports");
    history.goBack();
  };

  // const getDistTotalAmount = (code) => {
  // const thisDistOrders = filter(completedOrders, { sellerCompanyId: code });
  useEffect(() => {
    const totalSales = completedOrders.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.price),
      0
    );
    SetGrandTotal(
      formatPriceByCountrySymbol(country, totalSales).toLocaleString(
        // or use String(totalSales).replace(/(.)(?=(\d{3})+$)/g,'$1,')
        undefined // leave undefined to use the visitor's browser
        // locale or a string like 'en-US' to override it.
        // { minimumFractionDigits: 2 }
      )
    );
  }, [completedOrders]);

  // };

  const handlePush = (code) => {
    history.push(`/distributor/reports/${code}`);
  };

  // const code = location.pathname.split("/").at(-1);
  
  const getDistributorName = (code) => {
    let thisDistributor = filter(allDistributors, { SYS_Code: code })[0];
    if (!thisDistributor) {
      thisDistributor = filter(allDistributors, { DIST_Code: code })[0];
    }
    return thisDistributor;
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={backButton} style={{ cursor: "pointer" }} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("walk_in_sales")}
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
              {allSystemOrders?.orders?.length > 0 && (
                <p className="text-sm text-center" style={{ color: "green" }}>
                  This is a summary of the last 1,000 orders.
                </p>
              )}
              <table className="min-w-full mt-3 divide-y divide-grey-500">
                <thead className="bg-transparent ">
                  <tr className="">
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      S/N
                    </th>
                    {/* <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                Date
              </th> */}
                    <th className="px-10 py-3 text-left text-xs font-medium text-black align-middle">
                      {t("distributor_name")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("amount")}
                    </th>
                  </tr>
                </thead>

                <tbody
                  id="distributors"
                  className="bg-white px-6 divide-y divide-gray-200"
                >
                  {currentTableData().map((order, index) => (
                    <tr key={index}>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {index + 1}
                      </td>
                      {/* <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {moment(order.datePlaced).format("DD/MM/YYYY")}
                </td> */}
                      <td
                        // onClick={() => handlePush(order.sellerCompanyId)}
                        className="text-left align-middle cursor-pointer"
                      >
                        <Link
                          target="_blank"
                          to={`/dashboard/walkinsales/${
                            getDistributorName(order.sellerCompanyId).DIST_Code
                          }`}
                        >
                          <p className="font-customGilroy pl-8 text-sm text-red-900 font-medium">
                            {
                              getDistributorName(order.sellerCompanyId)
                                ?.company_name
                            }
                          </p>
                        </Link>
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {formatPriceByCountrySymbol(
                          country,
                          getDistTotalAmount(order.sellerCompanyId)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
              <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={uniqueCompletedOrders.length}
                  pageSize={PageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default TotalSalesByDelivery;
