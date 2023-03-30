import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import CalendarIcon from "../../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom"
import moment from "moment";
import Calendar from "../../../../components/common/Calendar";
import { showCalendar } from "../actions/ReportAction";
import Arrowdown from "../../../../assets/svg/arrowDown.svg";
import { filter, sortedUniqBy, flatten, orderBy } from "lodash";
import { getAllDistributors } from "../../KPO/actions/UsersAction";
import { getAllStocksByDateRange } from "../actions/ReportAction";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/pagination";
import LoadingList from "../../../../components/common/LoadingList";
import { getLocation } from "../../../../utils/getUserLocation";
import countryConfig from "../../../../utils/changesConfig.json";

const AdminStockReceived = ({ location }) => {
  const {t} = useTranslation()
  const history = useHistory();
  const dispatch = useDispatch();
  const backButton = () => {
    // history.push("/admin-dashboard/reports");
    history.goBack()
  };
  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay);
  const [stopRange, setStopRange] = useState(stopDay);
  const [calendarText, setCalendarText] = useState(t("this_month"));
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  let PageSize = 30;
  const [userCountry, setUserCountry] = useState("Ghana");

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, []);
  const [currentPage, setCurrentPage] = useState(1);

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  const loading = useSelector((state) => state.ReportReducer.loading);

  if (!allDistributors) {
    dispatch(getAllDistributors(country));
  }

  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  ); //=====stopped here
  useEffect(() => {
    if (Object.keys(selectedDayRange).length !== 0) {
      const start =
        selectedDayRange?.from?.year +
        "-" +
        selectedDayRange?.from?.month +
        "-" +
        selectedDayRange?.from?.day;

      setStartRange(moment(start).format("YYYY-MM-DD"));

      const stop =
        selectedDayRange?.to?.year +
        "-" +
        selectedDayRange?.to?.month +
        "-" +
        selectedDayRange?.to?.day;
      setStopRange(moment(stop).format("YYYY-MM-DD"));

      // Object.keys(selectedDayRange.to).length !== 0
      //   ? setStopRange(stop)
      //   : setStopRange(start + " 23:59:59");

      if (start !== stop) {
        setCalendarText(t("custom_date"));
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
          : setCalendarText(t("custom_date"));
        setCustomDate("");
        setStartRange(start);
        setStopRange(stop);
      }
    }
  }, [selectedDayRange]);

  useEffect(() => {
    dispatch(getAllStocksByDateRange(startRange, stopRange, country));
  }, [startRange, stopRange]);

  let allStocks = useSelector(
    (state) => state.ReportReducer.all_stocks_by_date
  );


  allStocks = filter(allStocks.products, function (o) {
    return o.docNo !== "set-up" && o.docNo !== "undefined";
  });
  allStocks = sortedUniqBy(allStocks, "docNo");
  allStocks = orderBy(allStocks, "id", "desc");

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return allStocks && allStocks.slice(firstPageIndex, lastPageIndex);
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  const getDistributorName = (code) => {
    const thisDistributor = filter(allDistributors, { DIST_Code: code })[0];
    return thisDistributor;
  };
  const handlePush = (code) => {
    //history.push(`/distributor/reports/${code}`);
  };

  let dd = [];
  allStocks.map((arra) => {
    dd.push({
      Distributor_Name: getDistributorName(arra?.companycode)?.company_name,
      Document_No: arra.docNo,
      Date_Received: arra.date,
      Order_No: arra.orderNo,
      Truck_No: arra.truckNo,
    });
  });
  const data = dd;

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={backButton} style={{ cursor: "pointer" }} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("stock_received")}
            </p>
          </div>
          {/* <div className="flex gap-16 items-center">
            <CSVLink
              data={data}
              filename={"stock_received_report.csv"}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} />
                <p className="report-download">{t("download")}</p>
              </div>
            </CSVLink>
          </div> */}
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
                <thead className="bg-transparent ">
                  <tr className="">
                    <th className="px-10 py-3 text-left text-xs font-medium text-black align-middle">
                    {t("distributor_name")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium  text-black align-middle">
                      {countryConfig[userCountry].documentNumberText}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                    {t("date_received")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {countryConfig[userCountry].orderNumberText}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("truck_no")}
                    </th>
                  </tr>
                </thead>

                <tbody
                  id="distributors"
                  className="bg-white px-6 divide-y divide-gray-200"
                >
                  {currentTableData()?.map((stock, index) => (
                    <tr key={index}>
                      <td className="font-customGilroy text-sm font-medium px-10 py-3 text-left">
                        {getDistributorName(stock?.companycode)?.company_name}
                      </td>
                      <td
                        // onClick={() => handlePush(stock?.docNo)}
                        className="font-customGilroy px-10 py-3 text-left text-sm text-red-900 font-medium "
                      >
                        {stock?.docNo === "undefined" ||
                        stock?.docNo === "set-up" ? (
                          stock?.docNo
                        ) : (
                          <Link
                            className="cursor-pointer"
                            target="_blank"
                            to={`/admin-dashboard/reports/singlestockreceived/${stock?.companycode}/${stock?.docNo}`}
                          >
                            {stock?.docNo}
                          </Link>
                        )}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {stock?.date}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {stock?.orderNo}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {stock?.truckNo}
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
                  totalCount={allStocks.length}
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

export default AdminStockReceived;
