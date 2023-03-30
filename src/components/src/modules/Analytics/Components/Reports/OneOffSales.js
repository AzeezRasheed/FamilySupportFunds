import React, { useEffect, useState } from "react";
import moment from "moment";
import Dashboard from "../../Layout/Dashboard";
import { Previouspage } from "../../assets/svg/adminIcons";
import Download from "../../assets/svg/download-report.svg";
import CalendarIcon from "../../assets/svg/calendarIcon.svg";
import { useHistory, useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { getSingleDistributor } from "../Admin/pages/actions/adminDistributorAction";
import {
  getAllOrders,
  getDistOrdersByDateRange,
} from "../Admin/order/actions/orderAction";
import { filter, orderBy } from "lodash";
import { formatNumber } from "../../utils/formatNumber";
import Arrowdown from "../../assets/svg/arrowDown.svg";
import { showCalendar } from "../Admin/Reports/actions/ReportAction";
import Calendar from "../../components/common/Calendar";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { getAllDistributors } from "../Admin/KPO/actions/UsersAction";
import { useTranslation } from "react-i18next";

const OneOffSales = ({ location, distributor, getSingleDistributor }) => {
  const history = useHistory();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const { t } = useTranslation();
  const country = AuthData?.country;
  const { Dist_Code } = useParams();

  const code = location.pathname.split("/").at(-1);
  useEffect(() => {
    getSingleDistributor(Dist_Code);
  }, []);

  const dispatch = useDispatch();

  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [calendarText, setCalendarText] = useState(t("this_month"));
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
  const [grandTotal, SetGrandTotal] = useState(0);
  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
  );

  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  if (!allDistributors) {
    dispatch(getAllDistributors(country));
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
        setStartRange(start + " 00:00:00");
        setStopRange(stop + " 23:59:59");
      }
    }
  }, [selectedDayRange]);

  useEffect(() => {
    dispatch(
      getDistOrdersByDateRange(
        startRange,
        stopRange,
        getDistributorName(Dist_Code)?.SYS_Code
      )
    );
  }, [startRange, stopRange, allDistributors]);

  let oneOffSales = filter(allSystemOrders, function (order) {
    return (
      //   (order?.sellerCompanyId === code &&
      //     order?.routeName === "Walk-In-Sales") ||
      order?.routeName === "One-Off"
    );
  });
  oneOffSales = orderBy(oneOffSales, "orderId", "desc");

  const backButton = () => {
    // history.push("/dashboard/reports/" + code);
    history.goBack();
  };

  const handlePush = (code) => {
    // history.push(`/admin-dashboard/distributor/reports/${code}`);
  };

  useEffect(() => {
    const totalSales = oneOffSales.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.totalPrice),
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
  }, [oneOffSales]);

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={() => backButton()} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("one_of_sales")}
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
      </div>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
        <div className="block tab-content tab-space pb-5 flex-auto w-full">
          <table className="min-w-full mt-8 divide-y divide-gray-200">
            <thead className="bg-transparent font-customGilroy text-sm text-grey-100 tracking-widest">
              <tr>
                <th className="py-3 text-left align-middle font-customGilroy text-center p-6">
                  S/N
                </th>
                <th className="py-3 text-left align-middle font-customGilroy text-center p-6">
                  {t("date")}
                </th>
                <th className="py-3 text-left align-middle">
                  {t("order_number")}
                </th>
                <th className="py-3 text-left align-middle font-customGilroy text-center p-6">
                  {t("amount")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white px-6 divide-y divide-gray-200">
              {oneOffSales?.map((order, index) => (
                <tr>
                  <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                    {index + 1}
                  </td>
                  <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                    {moment(order?.datePlaced).format("DD/MM/YYYY")}
                  </td>
                  <td
                    onClick={() =>
                      history.push(
                        `/dashboard/order-summary/${Dist_Code}/${order?.orderId}/${order?.buyerCompanyId}`
                      )
                    }
                    className="text-left align-middle cursor-pointer"
                  >
                    <p className="font-customGilroy pl-8 text-sm text-red-900 font-medium">
                      {order?.orderId}
                    </p>
                  </td>
                  <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                    {formatPriceByCountrySymbol(
                      country,
                      parseInt(order?.totalPrice)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
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
})(OneOffSales);
