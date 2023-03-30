import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../Layout/Mini-Admin/Dasboard";
import { Previouspage } from "../../../assets/svg/adminIcons";
import Download from "../../../assets/svg/download-report.svg";
import CalendarIcon from "../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom" 
import  moment from "moment";
import Calendar from "../../../components/common/Calendar";

import LoadingList from "../../../components/common/LoadingList";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { formatDateMonthOrDayToTwoDigit } from "../../../utils/formatDate";
import Pagination from "../../Admin/components/pagination";
import { getMiniAdminDailyStockReport, setLoadingToDefault, showCalendar } from "../../Admin/Reports/actions/ReportAction";
import { GetDistributors } from "../GetDistributors";

const DailyStockCount = ({ location }) => {
  const {t} = useTranslation()
  const history = useHistory();
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const myDistributors = GetDistributors();

  const startDay = moment(
    new Date(Date.now())
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [calendarText, setCalendarText] = useState(t("today"));
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay);
  const [stopRange, setStopRange] = useState(stopDay);
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [distributorLength, setDistributorLength] = useState(myDistributors.length);

  const loading = useSelector((state) => state.ReportReducer.loading);
  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );
  const daily_stock = useSelector((state) => state.ReportReducer.mini_admin_daily_stock_report);

  useEffect(() => {
    if (Object.keys(selectedDayRange).length !== 0) {
      const start =
        selectedDayRange?.from?.year +
        "-" +
        formatDateMonthOrDayToTwoDigit(selectedDayRange?.from?.month) +
        "-" +
        formatDateMonthOrDayToTwoDigit(selectedDayRange?.from?.day);

      setStartRange(start);

      const stop =
        selectedDayRange?.to?.year +
        "-" +
        formatDateMonthOrDayToTwoDigit(selectedDayRange?.to?.month) +
        "-" +
        formatDateMonthOrDayToTwoDigit(selectedDayRange?.to?.day);
      setStopRange(stop);

      if (start !== stop) {
        setCalendarText(t("custom_date"));
        setCustomDate(
          selectedDayRange?.from?.year +
            "/" +
            formatDateMonthOrDayToTwoDigit(selectedDayRange?.from?.month) +
            "/" +
            formatDateMonthOrDayToTwoDigit(selectedDayRange?.from?.day) +
            "  ->  " +
            selectedDayRange?.to?.year +
            "/" +
            formatDateMonthOrDayToTwoDigit(selectedDayRange?.to?.month) +
            "/" +
            formatDateMonthOrDayToTwoDigit(selectedDayRange?.to?.day)
        );
      } else {
        if (start === stopDay && stop === stopDay) {
          setCalendarText(t("today"));
          setCustomDate("");
        } else {
          setCalendarText(t("custom_date"));
          setCustomDate(
            selectedDayRange?.from?.year +
              "/" +
              formatDateMonthOrDayToTwoDigit(selectedDayRange?.from?.month) +
              "/" +
              formatDateMonthOrDayToTwoDigit(selectedDayRange?.from?.day)
          );
        }
      }
    }
  }, [selectedDayRange]);

  useEffect(() => {
    setDistributorLength(myDistributors.length)
  }, [myDistributors])

  useEffect(() => {
    let distributors = [...myDistributors].map(dist => dist.DIST_Code);
    if (distributors.length > 0) {
      dispatch(setLoadingToDefault());
      dispatch(getMiniAdminDailyStockReport(startRange, stopRange, country === "South Africa" ? "SA" : country, {
        companyCodes: distributors
      }));
    }
  }, [startRange, stopRange, distributorLength]);

  daily_stock.sort((a, b) => new Date(b.date) - new Date(a.date)).map((stock, index) => {
    stock.tableId = index + 1;
  })

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      daily_stock &&
      daily_stock.slice(firstPageIndex, lastPageIndex)
    );
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  const backButton = () => {
    history.goBack();
  };

  const handlePush = (code) => {
    history.push(`/distributor/reports/${code}`);
  };

  //csv
  const getData = (daily_stock) => {
    let dd = [];
    daily_stock?.map((stock) => {
      dd.push({
        Distributor: stock.distributor,
        "Syspro code": stock.sysproCode,
        Country: stock.country,
        Date: moment(stock.date).format("DD-MM-YYYY"),
        Time: stock.time,
        Accuracy: stock.accurate,
      })
    });
    return dd;
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10 mb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={backButton} style={{ cursor: "pointer" }} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("daily_stock_count")}
            </p>
          </div>
          <div className={`gap-16 items-center ${daily_stock.length === 0 ? 'hidden' : 'flex'}`}>
            <CSVLink
              data={getData(daily_stock)}
              filename={`${country}_daily_stock_count_${startRange}-${stopRange}.csv`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} alt="" />
                <p className="report-download">{t("download_report")}</p>
              </div>
            </CSVLink>
          </div>
        </div>
        <div className="flex" style={{ justifyContent: "space-between" }}>
          <div style={{ maxWidth: 300, position: "absolute" }}>
            <Calendar />
          </div>
          <div
            className={
              `mt-8 px-3 report-date-cont bg-white h-12 py-3 
              ${calendarText === t("today") ? 'w-24' : 'w-42'}`
            }
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(showCalendar(true))}
          >
            <div className={`flex ${calendarText === t("custom_date") ? 'justify-start' : 'justify-around'}`}>
              <img
                style={{ height: "25px" }}
                src={CalendarIcon}
                alt=""
              />
              <p className={`report-date ${calendarText === t("custom_date") && 'pl-3'}`}>{calendarText}</p>
            </div>
            {/* {calendarText === t("custom_date") && 
              <p className="text-xs text-center">{customDate}</p>
            } */}
            {/* <div className="mx-1 my-auto">
              <img className="" src={Arrowdown} alt="" />
            </div> */}
          </div>
        </div>
        <div
          className="bg-white mt-6 mb-10 py-6"
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
                    <th className="pl-10 pr-6 py-3 text-xs font-medium text-right text-gray-400 align-middle">
                      S/N
                    </th>
                    <th className="pl-4 pr-10 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("distributor")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("date")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("time")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-semibold text-black align-middle">
                    {t("accuracy")}
                    </th>
                  </tr>
                </thead>

                <tbody
                  id="distributors"
                  className="bg-white px-6 divide-y divide-gray-200"
                >
                  {currentTableData().map((stock, index) => (
                    <tr key={index}>
                      <td className="font-customGilroy text-sm font-medium text-right align-middle p-6 w-24">
                        {stock.tableId}.
                      </td>
                      <td
                        // onClick={() => handlePush(stock.companyCode)}
                        className="text-left align-middle pl-4 pr-10"
                      >
                        <p className="font-customGilroy text-sm text-red-900 font-medium">
                          {stock.distributor}
                        </p>
                      </td>
                      <td className="font-customGilroy text-sm font-medium align-middle py-6 px-10 w-60">
                        {moment(stock.date).format("DD-MM-YYYY")}
                      </td>
                      <td className="font-customGilroy text-sm font-medium align-middle py-6 px-10 w-60">
                        {stock.time}
                      </td>
                      <td className="font-customGilroy text-sm font-medium align-middle py-6 px-10 w-60">
                        {stock.accurate ? 'True' : 'False'}
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
                  totalCount={daily_stock.length}
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

export default DailyStockCount;
