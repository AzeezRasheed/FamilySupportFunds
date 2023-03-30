import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import CalendarIcon from "../../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom"
import moment from "moment";
import { getClosingStockReport, setLoadingToDefault, showCalendar, getMiniAdminClosingStockReport } from "../actions/ReportAction";
import Calendar from "../../../../components/common/Calendar";
import Pagination from "../../components/pagination";
import LoadingList from "../../../../components/common/LoadingList";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { formatDateMonthOrDayToTwoDigit } from "../../../../utils/formatDate";
import Tag from "../../../Inventory/components/Tag";
import {formatEmptiesQuantity} from "../../../../utils/helperFunction"

const DailyStockCount = ({ location }) => {
  const {t} = useTranslation()
  const history = useHistory();
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const yesterday = moment(moment().subtract(1, 'day'));
  const startDay = yesterday.format("YYYY-MM-DD");
  const [calendarText, setCalendarText] = useState(t("Yesterday"));
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay);
  const [stopRange, setStopRange] = useState(startDay);
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
    const currentDateISO = moment().toISOString();
  const defaultDate = {
    year: parseInt(moment(currentDateISO).format("YYYY")),
    month: parseInt(moment(currentDateISO).format("MM")),
    day: parseInt(moment(moment().subtract(1, 'day')).format("DD")),
  }
  const loading = useSelector((state) => state.ReportReducer.loading);
  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );

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

      if (start !== startRange) {
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
        if (startDay === startRange ) {
          setCalendarText("Yesterday")
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
    dispatch(setLoadingToDefault());
    dispatch(getClosingStockReport(startRange, stopRange, country === "South Africa" ? "SA" : country));
  }, [startRange, stopRange]);

  const daily_stock = useSelector((state) => state.ReportReducer.closing_stock_report);
  let distributors;
  useEffect(()=>{
     if(daily_stock.length > 0){
     distributors = [...new Set(daily_stock.map((distributor)=>distributor.companyCode))]
      dispatch(getMiniAdminClosingStockReport(startRange,stopRange,country === "South Africa" ? "SA" : country, {companyCodes: distributors}))
    }
  },[daily_stock])

  const distributorsStockWithSku = useSelector((state)=> state.ReportReducer.mini_admin_closing_stock_report);
  
  daily_stock?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((stock, index) => {
    stock.tableId = index + 1;
  })
  
  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      daily_stock &&
      daily_stock?.slice(firstPageIndex, lastPageIndex)
    );
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  const backButton = () => {
    history.goBack();
  };

  const handlePush = (code) => {
    history.push(`/distributor/reports/closing-stock/${code}`);
    localStorage.setItem('date_range', `${startRange}/${stopRange}`)
  };

  //csv
  const getData = (stock) => {
    let tableData = [];
    stock?.map((stock) => {
      tableData?.push({
        Distributor: stock.distributor,
        Country:country,
        "Syspro code": stock.sysproCode,
        Brand:stock.brand,
        SKU: stock.sku,
        Date: stock.date,
        "Quantity(fulls)": stock?.quantity,
        "Quantity(empties)": formatEmptiesQuantity(stock?.productType, stock?.empties)
 })
    });
    return tableData;
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10 mb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={backButton} style={{ cursor: "pointer" }} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("closing_stock")}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            <CSVLink
              data={getData(distributorsStockWithSku)}
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
            <Calendar 
            maximumDate={defaultDate}
            defaultDate={defaultDate}
            />
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
                    <th className="pl-10 pr-6 py-3 text-right text-xs font-medium text-black align-middle">
                      S/N
                    </th>
                    <th className="pl-4 pr-6 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("date")}
                    </th>
                    <th className="pl-4 pr-6 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("distributor")}
                    </th>
                   
                    <th className="px-8 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("total_stock")}
                      <Tag className="bg--blue mt-1" tagName={t("fulls")} />
                    </th>
                    <th className="px-8 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("total_stock")}
                      <Tag className="bg--accent mt-1" tagName={t("empties")} />
                    </th>
                    
                  </tr>
                </thead>

                <tbody
                  id="distributors"
                  className="bg-white px-6 divide-y divide-gray-200"
                >
                  {currentTableData()?.map((stock, index) => (
                    <tr key={index}>
                      <td className="font-customGilroy text-sm font-medium text-right align-middle p-6 w-24">
                        {stock.tableId}.
                      </td>
                      <td className="font-customGilroy text-sm font-medium align-middle pl-4 pr-6 py-6 w-36">
                         {`${startRange} - ${stopRange} `}
                      </td>
                      <td
                        onClick={() => handlePush(stock.companyCode)}
                        className="text-left align-middle cursor-pointer"
                      >
                        <p className="font-customGilroy text-sm font-medium align-middle pr-6 py-6">
                          {stock.distributor}
                        </p>
                      </td>
                      <td className="font-customGilroy text-sm font-medium align-middle px-10 py-6">
                        {stock.quantity}
                      </td>
                      <td className="font-customGilroy text-sm font-medium align-middle px-10 py-6">
                        {formatEmptiesQuantity(stock?.productType, stock.empties)}
                      </td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentTableData().length < 1 && <div className="w-full p-4"><p className="text-center">No data found!</p></div> }

              <hr />
              <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={daily_stock?.length}
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
