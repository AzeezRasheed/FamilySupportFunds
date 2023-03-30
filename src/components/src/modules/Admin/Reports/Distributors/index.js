import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useParams } from "react-router";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import arrowDown from "../../../../assets/svg/arrowDown.svg";
import SortImg from "../../../../assets/svg/sort.svg";
import noOrder from "../../../../assets/svg/noOrders.svg";
import {
  Previouspage,
  Progination,
  Redirect,
} from "../../../../assets/svg/adminIcons";
import DistributorNavbar from "../../components/navbar";
import { useHistory } from "react-router-dom" 
import  { connect } from "react-redux";
import {
  getAllCompletedOrdersByDistributor,
  getAllOrders,
  getAllOrdersByDateRange,
  getDistOrdersByDateRange,
  getAllOrdersByDistributor,
} from "../../order/actions/orderAction";
import {
  getSingleDistributorBySyspro,
  getAllDistributor,
} from "../../pages/actions/adminDistributorAction";
import { useDispatch, useSelector } from "react-redux";
import { filter, flatten, uniqBy } from "lodash";
import { formatNumber } from "../../../../utils/formatNumber";
import { formatPriceByCountrySymbol } from "../../../../utils/formatPrice";
import { countryCode } from "../../../../utils/countryCode";
import { getAllDistributors } from "../../KPO/actions/UsersAction";
import { getHectoliter } from "../../../../utils/getHectoLitres";
import { getAllProducts } from "../../Pricing/actions/AdminPricingAction";
import Loading from "../../../../components/common/Loading";
import { useTranslation } from "react-i18next";

const Reports = ({ location, distributor, getSingleDistributor }) => {
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const {t} = useTranslation()
  const country = AuthData?.country;
  // const code = location.pathname.split("/").at(-1);
  const { Dist_Code } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();
  // const currentDateISO = moment().toISOString();
  // const todayMonth = moment(currentDateISO).format("YYYY-MM");
  // const startRange = todayMonth + "-" + "01";
  // const stopRange = todayMonth + "-" + "31";
  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  const loading = useSelector((state) => state.OrderReducer.loading);

  useEffect(() => {
    !allProducts.length &&
      dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
    !allDistributors && dispatch(getAllDistributors(country));
  }, []);

  const allProducts = useSelector((state) => state.PricingReducer.allProducts);

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
    dispatch(
      getDistOrdersByDateRange(
        startRange,
        stopRange,
        getDistributorName(Dist_Code)?.SYS_Code
      )
    );
    dispatch(
      getSingleDistributorBySyspro(getDistributorName(Dist_Code)?.SYS_Code)
    );
  }, [allDistributors]);

  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
  );

  // if (!allSystemOrders.length) {
  //   dispatch(getDistOrdersByDateRange(startRange, stopRange, Dist_Code));
  // }
  // const dist_orders = filter(allSystemOrders, { sellerCompanyId: Dist_Code });
  const dist_completed_orders = filter(allSystemOrders, function (order) {
    return (
      (order.routeName === "Walk-In-Sales" && order.status === "Completed") ||
      (order.routeName === "One-Off" && order.status === "Completed") ||
      (order.routeName === "Van-Sales" && order.status === "Completed") ||
      (order.routeName === "SalesForce" && order.status === "Completed")
    );
  });
  const dist_customers_orders = filter(allSystemOrders, function (order) {
    return (
      (order.routeName === "Walk-In-Sales" && order.status === "Completed") ||
      (order.routeName === "Van-Sales" && order.status === "Completed") ||
      (order.routeName === "SalesForce" && order.status === "Completed")
    );
  });
  const uniqueCustomersOrders = uniqBy(dist_customers_orders, "buyerCompanyId");

  let totalSales = 0;
  let totalVolume = 0;
  let HLtr = 0

  totalSales = dist_completed_orders.reduce(
    (a, b) => parseFloat(a) + parseFloat(b.price),
    0
  );
  totalVolume = dist_completed_orders.reduce(
    (a, b) => parseInt(a) + parseInt(b.quantity),
    0
  );

   dist_completed_orders.forEach((item) => {
     HLtr += getHectoliter(
       getProductDetails(item.productId)?.productId,
       item.quantity
     );
   });

  const handlePush = (value) => {
    history.push("/distributor/reports/" + value + "/" + Dist_Code);
    // history.push("/admin-dashboard")
  };
  const backButton = () => {
    // history.push("/admin-dashboard/");
    history.goBack();
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link to="/admin-dashboard">
              <Previouspage />
            </Link>
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {getDistributorName(Dist_Code)?.company_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
          <p className="font-normal text-gray-400">
            {getDistributorName(Dist_Code)?.company_type}
          </p>
          /
          <p className="font-medium text-grey-100">
            {getDistributorName(Dist_Code)?.company_name}
          </p>
        </div>
        <DistributorNavbar distributor={distributor} code={Dist_Code} />
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
              height: "480px",
              width: "49%",
              borderRadius: "8px",
              boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2);",
            }}
          >
            <p className="report-box-header mb-10">Sales</p>
            <p className="mb-3 report-box-title border-b-2 border-dotted w-48">
              {t("sales_this_month_till_date")}
            </p>
            {loading ? (
              <Loading />
            ) : (
              <p className="mb-8 report-value">
                {formatPriceByCountrySymbol(country, totalSales)}
              </p>
            )}

            <div className="grid grid-cols-1 divide-y divide-gray-300">
              <Link to={`/distributor/reports/totalsales/${Dist_Code}`}>
                <div
                  onClick={() =>
                    history.push("/distributor/reports/totalsales/" + Dist_Code)
                  }
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                  className="py-5 report-link"
                >
                  {t("total_sales")}
                </div>
              </Link>
              <div
                className="py-5 report-link"
                onClick={() => handlePush("walk-in-sales")}
                style={{ cursor: "pointer" }}
              >
                {t("walk_in_sales")}
              </div>
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
              height: "480px",
              width: "49%",
              borderRadius: "8px",
              boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2);",
            }}
          >
            <p className="report-box-header mb-10">Volume</p>
            <p className="mb-3 report-box-title border-b-2 border-dotted w-60">
              {t("volumr_sold_till_date")}
            </p>
            {loading ? (
              <Loading />
            ) : (
              <p className="mb-8 report-value">
                {formatNumber(totalVolume)} {t("cases")}, {HLtr.toFixed(5)} HL
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
              <div
                className="py-5 report-link"
                onClick={() => handlePush("stock-level")}
                style={{ cursor: "pointer" }}
              >
                {t("stock_level")}
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
