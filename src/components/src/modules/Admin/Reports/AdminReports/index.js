import React, { useState, useEffect } from "react";
import { filter, flatten } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import {
  getCountryOrdersByDateRange
} from "../../order/actions/orderAction";
import { getAllProducts } from "../../Pricing/actions/AdminPricingAction";
import { formatNumber, isDecimal } from "../../../../utils/formatNumber";
import { formatPriceByCountrySymbol } from "../../../../utils/formatPrice";

import moment from "moment";
import { countryCode } from "../../../../utils/countryCode";
import { getHectoliter } from "../../../../utils/getHectoLitres";
import Loading from "../../../../components/common/Loading";
import { useTranslation } from "react-i18next";
import { getDailyStockAverageAccuracy } from "../actions/ReportAction";

const AdminRoutes = ({ location }) => {
  const {t} = useTranslation()
  const history = useHistory();
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  // const country = "Nigeria"
  const loading = useSelector((state) => state.OrderReducer.loading);
  const reportLoading = useSelector((state) => state.ReportReducer.loading);
  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");

  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
  const [HL, SetHL] = useState(0);

  const allProducts = useSelector((state) => state.PricingReducer.allProducts);
  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
  );
  const dailyStockAverageAccuracy = useSelector(
    (state) => state.ReportReducer.daily_stock_average_accuracy
  );

  useEffect(() => {
    !allProducts.length &&
      dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }, []);

  useEffect(() => {
    dispatch(
      getCountryOrdersByDateRange(startRange, stopRange, countryCode(country), "summary")
    );
  }, [startRange, stopRange]);

  useEffect(() => {
    // !allSystemOrders.length && dispatch(getCountryOrdersByDateRange(
    //   startRange,
    //   stopRange,
    //   countryCode(country))
    // );
    dispatch(getDailyStockAverageAccuracy(country === "South Africa" ? "SA" : country))
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }, []);

  // if (!allSystemOrders.length) {
  //   getCountryOrdersByDateRange(startRange, stopRange, countryCode(country));
  // }

  const getProductDetails = (productID) => {
    let thisProduct = filter(allProducts, { productId: productID })[0];
    if (!thisProduct) {
      thisProduct = filter(allProducts, { id: parseInt(productID) })[0];
    }
    return thisProduct;
  };
  let HLtr = 0;

  if (allSystemOrders?.length) {
    // let completedOrders = filter(allSystemOrders, function (order) {
    //   return (
    //     (order.routeName === "Walk-In-Sales" && order.status === "Completed") ||
    //     (order.routeName === "One-Off" && order.status === "Completed") ||
    //     (order.routeName === "Van-Sales" && order.status === "Completed") ||
    //     (order.routeName === "SalesForce" && order.status === "Completed")
    //   );
    // });

    // totalSales = completedOrders.reduce(
    //   (a, b) => parseFloat(a) + parseFloat(b.price),
    //   0
    // );
    // totalVolume = completedOrders.reduce(
    //   (a, b) => parseInt(a) + parseInt(b.quantity),
    //   0
    // );

    // allSystemOrders.forEach((item) => {
    //   HLtr += getHectoliter(
    //     getProductDetails(item.productId)?.productId,
    //     item.quantity
    //   );
    // });
  }

  const handlePush = (value) => {
    history.push("/admin-dashboard/reports/" + value);
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <p
          className="font-bold pb-10"
          style={{ fontSize: 24, fontColor: "#090B17" }}
        >
          {t("reports")}
        </p>
        <div
          className="flex flex-row justify-between"
          style={{ width: "100%" }}
        >
          <div
            className="bg-white py-8 px-10 rounded shadow"
            style={{
              height: "400px",
              width: "32%",
              borderRadius: "8px",
              boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2);",
            }}
          >
            <p
              className="report-box-header mb-6 font-customGilroy"
              style={{ fontSize: 18, fontColor: "#50525B" }}
            >
              {t("sales")}
            </p>
            <div className="h-14 mb-10">
              <p className="mb-2 report-box-title border-b-2 border-dotted w-48">
                {t("sales_this_month_till_date")}
              </p>
              {loading ? (
                <Loading />
              ) : (
                <p
                  className="report-value"
                  style={{
                    fontWeight: 600,
                    fontSize: 28,
                    fontColor: "#2D2F39",
                  }}
                >
                  {formatPriceByCountrySymbol(
                    country,
                    allSystemOrders.totalPrice
                  )}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 divide-y divide-gray-300">
              <div
                onClick={() => handlePush("totalsales")}
                className="pb-3 report-link"
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                {t("total_sales")}
              </div>
              <div
                className="py-3 report-link"
                onClick={() => handlePush("delivery")}
                style={{ cursor: "pointer" }}
              >
                {t("salesforce_orders")}
              </div>
              {country === "South Africa" && <div
                className="py-3 report-link"
                onClick={() => handlePush("sap")}
                style={{ cursor: "pointer" }}
              >
                SAP Orders
              </div>}
              <div
                className="py-3 report-link"
                onClick={() => handlePush("walk-in-sales")}
                style={{ cursor: "pointer" }}
              >
                {t("walk_in_sales")}
              </div>
              <div
                className="py-3 report-link"
                onClick={() => handlePush("van-sales")}
                style={{ cursor: "pointer" }}
              >
                {t("van_sales")}
              </div>
              <div />
            </div>
          </div>
          <div
            className="bg-white py-8 px-10 rounded shadow"
            style={{
              height: "348px",
              width: "32%",
              borderRadius: "8px",
            }}
          >
            <p className="report-box-header mb-6">Volume</p>
            <div className="h-14 mb-10">
              <p className="mb-2 report-box-title border-b-2 border-dotted w-60">
                {t("volume_sold_this_month_till_date").toUpperCase()}
              </p>
              {loading ? (
                <Loading />
              ) : (
                <p className="report-value">
                  {formatNumber(allSystemOrders.totalCases)}  {t("cases")}, {HLtr.toFixed(5)} HL
                  {/* {", "}{HLtr.toFixed(5)} HL */}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 divide-y divide-gray-300">
              <div
                className="pb-3 report-link"
                onClick={() => handlePush("volumesold")}
                style={{ cursor: "pointer" }}
              >
                {t("total_volume_sold")}
              </div>
              <div
                className="py-3 report-link"
                onClick={() => handlePush("volumereceived")}
                style={{ cursor: "pointer" }}
              >
                {t("total_volume_received")}
              </div>
              <div
                className="py-3 report-link"
                onClick={() => handlePush("stockreceived")}
                style={{ cursor: "pointer" }}
              >
                {t("stock_received")}
              </div>
              <div />
            </div>
          </div>
          <div
            className="bg-white py-8 px-10 rounded shadow"
            style={{
              height: "348px",
              width: "32%",
              borderRadius: "8px",
              boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2);",
            }}
          >
            <p className="report-box-header mb-6">{t("Stock")}</p>
            <div className="h-14 mb-10">
              <p className="mb-2 report-box-title border-b-2 border-dotted w-max">
                {t("accuracy_till_date")}
              </p>
              {reportLoading ? (
                <Loading />
              ) : (
                <p className="report-value">
                  {isDecimal(dailyStockAverageAccuracy) ? dailyStockAverageAccuracy.toFixed(2) : dailyStockAverageAccuracy}%
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 divide-y divide-gray-300">
              <div
                className="pb-3 report-link"
                onClick={() => handlePush("daily-stock-count")}
                style={{ cursor: "pointer" }}
              >
                {t("daily_stock_count")}
              </div>
              <div
                className="py-3 report-link"
                onClick={() => handlePush("stock-level")}
                style={{ cursor: "pointer" }}
              >
                {t("stock_level")}
              </div>
              <div
                className="py-3 report-link"
                onClick={() => handlePush("closing-stock")}
                style={{ cursor: "pointer" }}
              >
                {t("closing_stock")}
              </div>
              <div />
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default AdminRoutes;
