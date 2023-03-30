import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../../Layout/Dashboard";
import { Previouspage, Redirect } from "../../assets/svg/adminIcons";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { useDispatch, useSelector } from "react-redux";
import { filter, flatten, uniqBy } from "lodash";
import {
  getAllOrdersByDateRange,
  getDistOrdersByDateRange,
} from "../Admin/order/actions/orderAction";
import {
  getSingleDistributor,
  getSingleDistributorBySyspro,
} from "../Admin/pages/actions/adminDistributorAction";
import { formatNumber } from "../../utils/formatNumber";
import moment from "moment";
import { discardChanges } from "../Inventory/actions/inventoryProductAction";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { getAllDistributors } from "../Admin/KPO/actions/UsersAction";
import { getHectoliter } from "../../utils/getHectoLitres";
import { getAllProducts } from "../Admin/Pricing/actions/AdminPricingAction";
import Loading from "../../components/common/Loading";
import { useTranslation } from "react-i18next";

const Reports = ({ location, distributor, getSingleDistributorBySyspro }) => {
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const { t } = useTranslation();
  const country = AuthData?.country;
  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
  const { Dist_Code } = useParams();
  const code = Dist_Code;
  const dispatch = useDispatch();
  const history = useHistory();
  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
  );

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  const loading = useSelector((state) => state.OrderReducer.loading);

  const allProducts = useSelector((state) => state.PricingReducer.allProducts);

  useEffect(() => {
    !allDistributors && dispatch(getAllDistributors(country));
    !allProducts.length &&
      dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
    getSingleDistributorBySyspro(code);
  }, []);

  const getProductDetails = (productID) => {
    let thisProduct = filter(allProducts, { productId: productID })[0];
    if (!thisProduct) {
      thisProduct = filter(allProducts, { id: parseInt(productID) })[0];
    }
    return thisProduct;
  };

  const getDistributorName = (code) => {
    let thisDistributor = filter(allDistributors, { SYS_Code: code })[0];
    if (!thisDistributor) {
      thisDistributor = filter(allDistributors, { DIST_Code: code })[0];
    }
    return thisDistributor;
  };

  useEffect(() => {
    dispatch(discardChanges());
    dispatch(
      getDistOrdersByDateRange(
        startRange,
        stopRange,
        getDistributorName(Dist_Code)?.SYS_Code
      )
    );
  }, [allDistributors]);

  if (!allSystemOrders) {
    dispatch(
      getDistOrdersByDateRange(
        startRange,
        stopRange,
        getDistributorName(Dist_Code)?.SYS_Code
      )
    );
  }
  // const dist_orders = filter(allSystemOrders, { sellerCompanyId: code });
  // const dist_completed_orders = filter(allSystemOrders, function (order) {
  //   return (
  //     order.routeName === "Walk-In-Sales" ||
  //     order.routeName === "One-Off" ||
  //     (order.routeName === "Van-Sales" && order.status === "Completed") ||
  //     (order.routeName === "SalesForce" && order.status === "Completed")
  //   );
  // });
  // const dist_customers_orders = filter(allSystemOrders, function (order) {
  //   return (
  //     order.routeName === "Walk-In-Sales" ||
  //     (order.routeName === "Van-Sales" && order.status === "Completed") ||
  //     (order.routeName === "SalesForce" && order.status === "Completed")
  //   );
  // });

  // const uniqueCustomersOrders = uniqBy(dist_customers_orders, "buyerCompanyId");

  // let totalSales = 0;
  // let totalVolume = 0;
  // let HLtr = 0;

  // totalSales = dist_completed_orders.reduce(
  //   (a, b) => parseFloat(a) + parseFloat(b.totalPrice),
  //   0
  // );
  // totalVolume = dist_completed_orders.reduce(
  //   (a, b) => parseInt(a) + parseInt(b.quantity),
  //   0
  // );
  // dist_completed_orders.forEach((item) => {
  //   HLtr += getHectoliter(
  //     getProductDetails(item.productId)?.productId,
  //     item.quantity
  //   );
  // });

  const handlePush = (value) => {
    history.push("/dashboard/" + value + "/" + code);
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("reports")}
            </p>
          </div>
        </div>
        <div
          className="flex mt-10 flex-row justify-between"
          style={{ width: "100%" }}
        >
          {/* <div
            className="bg-white p-6 rounded shadow"
            style={{ height: "480px", width: "32%", borderRadius: "8px" }}
          > */}
          <div
            className="bg-white pt-6 px-6 pb-12 rounded shadow"
            style={{
              height: "520px",
              width: "49%",
              borderRadius: "8px",
              boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2);",
            }}
          >
            <p className="report-box-header mb-10">{t("sales")}</p>
            <p className="mb-3 report-box-title border-b-2 border-dotted w-48">
              {t("sales_this_month_till_date")}
            </p>
            {loading ? (
              <Loading />
            ) : (
                <p className="mb-8 report-value">
                  {formatPriceByCountrySymbol(
                    country,
                    allSystemOrders[1][0]?.price
                  ) ?? 0}
                </p>
              )}
            <div className="grid grid-cols-1 divide-y divide-gray-300">
              <div
                onClick={() => handlePush("totalsales")}
                style={{ cursor: "pointer", fontWeight: "bold" }}
                className="py-5 report-link"
              >
                {t("total_sales")}
              </div>
              <div
                className="py-5 report-link"
                onClick={() => handlePush("walkinsales")}
                style={{ cursor: "pointer" }}
              >
                {t("walk_in_sales")}
              </div>
              {/* <div
                className="py-5 report-link"
                onClick={() => handlePush("oneoffsales")}
                style={{ cursor: "pointer" }}
              >
                One-Off Sales
              </div> */}
              <div
                className="py-5 report-link"
                onClick={() => handlePush("van-sales")}
                style={{ cursor: "pointer" }}
              >
                {t("van_sales")}
              </div>
              <div
                className="py-5 report-link"
                onClick={() => handlePush("sales-by-delivery")}
                style={{ cursor: "pointer" }}
              >
                {t("salesforce_orders")}
              </div>
              {
                country === "South Africa" && <div
                  className="py-5 report-link"
                  onClick={() => handlePush("sap")}
                  style={{ cursor: "pointer" }}
                >
                  SAP Orders
                </div>
              }

              <div />
            </div>
          </div>
          {/* <div
            className="bg-white p-6 rounded shadow"
            style={{ height: "480px", width: "32%", borderRadius: "8px" }}
          > */}
          <div
            className="bg-white pt-6 px-6 pb-12 rounded shadow"
            style={{
              height: "520px",
              width: "49%",
              borderRadius: "8px",
              boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2);",
            }}
          >
            <p className="report-box-header mb-10">Volume</p>
            <p className="mb-3 report-box-title border-b-2 border-dotted w-60">
              {t("volume_sold_this_month_till_date")}
            </p>
            {loading ? (
              <Loading />
            ) : (
                <p className="mb-8 report-value">
                  {formatNumber(allSystemOrders[1][0]?.cases) ?? 0} {t("cases")}
                </p>
              )}
            <div className="grid grid-cols-1 divide-y divide-gray-300">
              <div
                className="py-5 report-link"
                onClick={() => handlePush("volumesold")}
                style={{ cursor: "pointer" }}
              >
                {t("total_volume_sold")}
              </div>
              <div
                className="py-5 report-link"
                onClick={() => handlePush("volumereceived")}
                style={{ cursor: "pointer" }}
              >
                {t("total_volume_received")}
              </div>
              <div
                className="py-5 report-link"
                onClick={() => handlePush("stockreceived")}
                style={{ cursor: "pointer" }}
              >
                {t("stock_received")}
              </div>
              <div />
            </div>
          </div>
          {/* <div
            className="bg-white p-6 rounded shadow"
            style={{ height: "480px", width: "32%", borderRadius: "8px" }}
          >
            <p className="report-box-header mb-10">Customers</p>
            <p
              className="mb-3 report-box-title border-b-2 border-dotted"
              style={{ width: "60%" }}
            >
              ACTIVE CUSTOMERS THIS MONTH TILL DATE
            </p>
            <p className="mb-8 report-value">
              {formatNumber(uniqueCustomersOrders?.length)}
            </p>
            <div className="grid grid-cols-1 divide-y divide-gray-300">
              <div
                className="py-5 report-link"
                onClick={() => handlePush("all-customers")}
                style={{ cursor: "pointer" }}
              >
                Registered Customers
              </div>
              <div
                className="py-5 report-link"
                onClick={() => handlePush("new-customers")}
                style={{ cursor: "pointer" }}
              >
                New Customers
              </div>
              <div
                className="py-5 report-link"
                onClick={() => handlePush("bulkbreakers")}
                style={{ cursor: "pointer" }}
              >
                BulkBreaker
              </div>
              <div
                className="py-5 report-link"
                onClick={() => handlePush("poc")}
                style={{ cursor: "pointer" }}
              >
                Pocs
              </div>
              <div />
            </div>
          </div> */}
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
  getSingleDistributorBySyspro,
})(Reports);
