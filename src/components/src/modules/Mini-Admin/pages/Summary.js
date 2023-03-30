import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Previouspage } from "../../../assets/svg/adminIcons";
import Dashboard from "../../../Layout/Mini-Admin/Dasboard";
import styles from "../componentsForSummary/cssFile/mainCss.module.css";
import wareHouseCustom from "../../../assets/svg/wareHouseCustom.svg";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import calendarIcon from "../../../assets/svg/calendarIcon.svg";
import downloadReport from "../../../assets/svg/downloadReport.svg";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { getAllDistributors } from "../../Admin/KPO/actions/UsersAction";
import { getAllProducts } from "../../Admin/Pricing/actions/AdminPricingAction";
import { GetDistributorsOrders } from "../GetDistributorsOrders";
import Calendar from "../../../components/common/Calendar";
import {
  showCalendar,
  showMinDistributors,
} from "../../Admin/Reports/actions/ReportAction";
import { formatNumber } from "../../../utils/formatNumber";
import LoadingList from "../../../components/common/LoadingList";
import MiniAdminDistributors from "../../../components/common/MiniAdminDistributors";
import { GetDistributors } from "../GetDistributors";

const Summary = ({ location }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
  const [calendarText, setCalendarText] = useState(t("this_month"));
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const country = AuthData?.country;
  useEffect(() => {
    dispatch(getAllDistributors(country));
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
    setTimeout(() => {
      // window.location.reload();
    }, 2000);
  }, [AuthData]);
  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );
  const loading = useSelector((state) => state.OrderReducer.loading);
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

      if (start !== stop) {
        setCalendarText(t("custom date"));
      } else {
        start === stopDay && stop === stopDay
          ? setCalendarText(t("today"))
          : setCalendarText(t("custom date"));
      }
    }
  }, [selectedDayRange]);
  const { orders_by_date, stocks_by_date } = useSelector(
    (state) => state.OrderReducer
  );
  const { show_mini_admin_dist, selected_dist } = useSelector(
    (state) => state.ReportReducer
  );

  const HL = orders_by_date?.IndividualCasesSold?.reduce(
    (a, b) => parseFloat(a) + parseFloat(b.HL),
    0
  );

  const getIndividualSellOut = (code) => {
    return orders_by_date?.IndividualCasesSold.filter(
      (val) => val.productId === code
    )[0];
  };

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );
  const allProducts = useSelector((state) => state.PricingReducer.allProducts);
  GetDistributorsOrders("mini-admin-summary");
  let dists = [];

  dists = dists.length === 0 && GetDistributors();

  const history = useHistory();

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex gap-4">
          <Previouspage
            onClick={() => history.goBack()}
            style={{ cursor: "pointer" }}
          />

          <h2 className="font-customGilroy text-black font-bold text-2xl">
            {t("summary")}
          </h2>
        </div>
        <div className={styles.topMenu}>
          <div className={styles.allDistributors}>
            <div
              style={{
                maxWidth: 300,
                position: "relative",
                left: "-33px",
                top: "45px",
              }}
            >
              <MiniAdminDistributors dists={dists} />
            </div>
            <div
              id={styles.customWarehouse}
              onClick={() =>
                dispatch(showMinDistributors(!show_mini_admin_dist))
              }
            >
              <img src={wareHouseCustom} alt="" />
              <h5>
                {selected_dist.company_name === "all"
                  ? `${t("my_distributors")}(${dists.length})`
                  : selected_dist.company_name}
              </h5>
              <img src={arrowDown} alt="" />
            </div>

            <div>
              <div
                id={styles.calendar}
                onClick={() => dispatch(showCalendar(true))}
              >
                <img src={calendarIcon} alt="" />
                <h4>{calendarText}</h4>
              </div>
              <div
                style={{
                  maxWidth: 300,
                  position: "absolute",
                  top: "215px",
                }}
              >
                <Calendar />
              </div>
            </div>
          </div>
          <div id={styles.reportDownload}>
            {/* <img src={downloadReport} alt="" /> */}
            {/* <h4>Download Report</h4> */}
          </div>
        </div>
        {loading ? (
          <LoadingList />
        ) : (
          <div className={styles.cardContainer}>
            <div
              className="bg-white my-10 py-0"
              style={{
                boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2)",
                borderRadius: "8px",
                maxHeight: "680px",
              }}
            >
              <div className={styles.headDisplay}>
                <div id={styles.headDisplayRow1}>
                  <span id={styles.headInformation}>
                    <h4>{t("order fulfillment rate")}</h4>
                    <big>{orders_by_date?.OFR ?? 0}%</big>
                  </span>
                  <span id={styles.headInformation}>
                    <h4>{t("total_customers")}</h4>
                    <big>{formatNumber(orders_by_date?.Total_Customer)}</big>
                  </span>
                  <span id={styles.headInformation}>
                    <h4>{t("total_orders")}</h4>
                    <big>{formatNumber(orders_by_date?.Total_Orders)}</big>
                  </span>
                </div>
                <div id={styles.headDisplayRow2}>
                  <span id={styles.headInformation}>
                    <h4>{t("unique_customer_orders")}</h4>
                    <big>{formatNumber(orders_by_date?.Unique_Customer)}</big>
                  </span>
                  <span id={styles.headInformation}>
                    <h4>{t("volume")}</h4>
                    <big>{HL.toFixed(4)} hl</big>
                  </span>
                </div>
              </div>
              <div>
                <div style={{ overflow: "auto" }}>
                  <table
                    className={styles.inventory}
                    style={{ border: "none" }}
                  >
                    <thead>
                      <tr>
                        <th>{t("order_type")}</th>
                        <th>{t("No of orders")}</th>
                        <th>{t("percentage")}</th>
                      </tr>
                    </thead>
                    {orders_by_date.Tabular.map((item, index) => (
                      <tr key={index}>
                        <td>{item?.Order_Type}</td>
                        <td>{item?.No_Of_Orders}</td>
                        <td>
                          {item?.Percentage
                            ? item?.Percentage?.toFixed(2)
                            : 0 ?? 0}
                          %
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>
            <div
              className="bg-white my-10 py-0"
              style={{
                boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2)",
                borderRadius: "8px",
              }}
            >
              <div className={styles.headDisplayCard2}>
                <div id={styles.stockTable} style={{ padding: "12.5px 40px" }}>
                  <span id={styles.headInformation}>
                    <h4>{t("received stock cases")}</h4>
                    <big>
                      {formatNumber(stocks_by_date?.totalReceievedStock)}
                    </big>
                  </span>
                  <span id={styles.headInformation}>
                    <h4>{t("sell out cases")}</h4>
                    <big>{formatNumber(orders_by_date.TotalCasesSold)}</big>
                  </span>
                  <span id={styles.headInformation}>
                    <h4>{t("current stock cases")}</h4>
                    <big>{formatNumber(stocks_by_date?.currentStock)}</big>
                  </span>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className={styles.inventory} style={{ border: "none" }}>
                  <thead>
                    <tr>
                      <th>{t("product")}</th>
                      <th>{t("sell in cases")}</th>
                      <th>{t("sell out cases")}</th>
                      <th>{t("current stock cases")}</th>
                    </tr>
                  </thead>
                  {stocks_by_date?.result?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="flex gap-4">
                          <img
                            className="h-20 w-10 rounded-full"
                            src={item.product.imageUrl}
                            // style={{ objectFit: "cover" }}

                            alt=""
                          />
                          <div
                          // style={{ display: "flex", alignItems: "center" }}
                          >
                            <div className="text-base my-1 font-semibold mb-3">
                              {item.product.productName}
                            </div>
                            <div className="flex gap-2 items-center">
                              <div className="font-customGilroy text-sm font-medium text-center align-middle text-white">
                                <button
                                  className="rounded-full py-1 px-3"
                                  style={{ backgroundColor: "#F49C00" }}
                                >
                                  {item.product.productType}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <span id={styles.bottle}>
                        <img src={Budweiser600ml} alt="" />
                        {item.goodsType}
                      </span> */}
                      </td>
                      <td>{formatNumber(item?.sellInQuantity)}</td>
                      <td>
                        {getIndividualSellOut(item.product.productCode)
                          ?.Cases ?? 0}
                      </td>
                      <td>{formatNumber(item?.currentQuantity)}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default Summary;
