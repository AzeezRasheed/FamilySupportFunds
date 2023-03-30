import React, { useEffect, useState } from "react";
import moment from "moment";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import CalendarIcon from "../../../../assets/svg/calendarIcon.svg";
import { useHistory, useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { getSingleDistributor } from "../../pages/actions/adminDistributorAction";
import { getAllDistributors } from "../../KPO/actions/UsersAction";
import { filter, orderBy, sortedUniqBy } from "lodash";
import Arrowdown from "../../../../assets/svg/arrowDown.svg";
import { getAllStocksByDateRange, showCalendar } from "../actions/ReportAction";
import Calendar from "../../../../components/common/Calendar";
import { inventoryNet } from "../../../../utils/urls";
import { getAllInventory } from "../../../Inventory/actions/inventoryProductAction";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocation } from "../../../../utils/getUserLocation";
import countryConfig from "../../../../utils/changesConfig.json";

const StockReceived = ({ location, distributor, getSingleDistributor }) => {
  const {t} = useTranslation()
  const history = useHistory();
  const dispatch = useDispatch();

  const { Dist_Code } = useParams();
  const code = Dist_Code;
  const backButton = () => {
    // history.push("/admin-dashboard/reports");
    history.goBack();
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
  const [userCountry, setUserCountry] = useState("Ghana");

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, []);

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

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

      setStartRange(start);

      const stop =
        selectedDayRange?.to?.year +
        "-" +
        selectedDayRange?.to?.month +
        "-" +
        selectedDayRange?.to?.day;
      setStopRange(stop);

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

  allStocks = filter(allStocks, function (o) {
    return (
      o.docNo !== "set-up" && o.docNo !== "undefined" && o.companycode === code
    );
  });
  allStocks = sortedUniqBy(allStocks, "docNo");
  allStocks = orderBy(allStocks, "id", "desc");


  let data = [];
  allStocks.map((arra) => {
    data.push({
      Document_No: arra.docNo,
      Date_Received: arra.date,
      Order_No: arra.orderNo,
      Truck_No: arra.truckNo,
    });
  });

  const getDistributorName = (code) => {
    let thisDistributor = filter(allDistributors, { SYS_Code: code })[0];
    if (!thisDistributor) {
      thisDistributor = filter(allDistributors, { DIST_Code: code })[0];
    }
    return thisDistributor;
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
          {/* <div className="flex gap-16 items-center">
            <CSVLink
              data={data}
              filename={`${
                getDistributorName(code)?.SYS_Code
              }_stock_received.csv`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} alt="" />
                <p className="report-download">{t("download")}</p>
              </div>
            </CSVLink>
          </div> */}
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
            <p className="font-normal text-gray-400">{t("distributor")}</p>/
            <p className="font-medium text-grey-100">
              {getDistributorName(code)?.company_name}
            </p>
            /<p className="font-medium text-grey-100">{t("stock_received")}</p>
          </div>
        </div>
        <div>
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
      </div>
      <div
        className="bg-white mx-10 py-6"
        style={{
          boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2)",
          borderRadius: "8px",
        }}
      >
        <table className="min-w-full mt-3 divide-y divide-grey-500">
          <thead className="bg-transparent ">
            <tr className="">
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
            {allStocks?.map((stock, index) => (
              <tr key={index}>
                <td
                  // onClick={() => handlePush(stock?.docNo)}
                  className="font-customGilroy px-10 py-3 text-left text-sm text-red-900 font-medium "
                >
                  <Link
                    className="cursor-pointer"
                    target="_blank"
                    to={`/admin-dashboard/reports/singlestockreceived/${Dist_Code}/${stock?.docNo}`}
                  >
                    {stock?.docNo}
                  </Link>
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
})(StockReceived);
