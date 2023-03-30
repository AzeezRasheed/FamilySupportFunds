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
  getAllOrdersByDateRange,
  getDistOrdersByDateRange,
} from "../Admin/order/actions/orderAction";
import { getAllDistributors } from "../Admin/KPO/actions/UsersAction";
import { filter, flatten, orderBy, uniqBy } from "lodash";
import { getAllProducts } from "../Admin/Pricing/actions/AdminPricingAction";
import Arrowdown from "../../assets/svg/arrowDown.svg";
import { showCalendar } from "../Admin/Reports/actions/ReportAction";
import Calendar from "../../components/common/Calendar";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { CSVLink } from "react-csv";
import { formatNumber } from "../../utils/formatNumber";
import { getHectoliter } from "../../utils/getHectoLitres";
import { useTranslation } from "react-i18next";

const VolumeSold = ({ location, distributor, getSingleDistributor }) => {
  const history = useHistory();
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const { Dist_Code, startRange, stopRange, productCode } = useParams();

  useEffect(() => {
    getSingleDistributor(Dist_Code);
  }, []);
  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
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

  const getProductDetails = (productID) => {
    let thisProduct = filter(allProducts, { productId: productID })[0];
    if (!thisProduct) {
      thisProduct = filter(allProducts, { id: parseInt(productID) })[0];
    }
    return thisProduct;
  };

  const restartRange = startRange.replace("%", " ")
  const restopRange = stopRange.replace("%", " ");
  

  useEffect(() => {
    dispatch(
      getDistOrdersByDateRange(
        restartRange,
        restopRange,
        getDistributorName(Dist_Code)?.SYS_Code
      )
    );
  }, [startRange, stopRange, allDistributors]);
  let completedOrders = filter(allSystemOrders, function (order) {
    return (
      order.routeName === "Walk-In-Sales" ||
      order.routeName === "One-Off" ||
      (order.routeName === "Van-Sales" && order.status === "Completed") ||
      (order.routeName === "SalesForce" && order.status === "Completed")
    );
  });

  // completedOrders = uniqBy(completedOrders, "routeName");

  const allProducts = useSelector((state) => state.PricingReducer.allProducts);
  if (!allProducts.length) {
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }

  const getRouteName = (orderId) =>{ 
    const order = filter(completedOrders, { orderId: orderId });
    //put vansales one-off
    return order[0].routeName
  }

  const getQuantitySoldByRoute = (orderId) => {
    const routeName = getRouteName(orderId)
    
  }

  const productOrders = []

    completedOrders.map((value) => {
      if (value.productId === productCode) {
        const value2 = { ...value, routeName: value.routeName };
        // console.log("value1", value);
        // console.log("value2", value2);
        productOrders.push(value2);
      }
    });

  //////////get total volume per product /////////////
  let orderItems = [];
  const product = [];
  const totalQ = productOrders.reduce((a, b) => parseFloat(a) + parseFloat(b.quantity), 0);
    const totalAmt = productOrders.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.price),
      0
    );
  productOrders.map((item) => {
    if (!filter(product, { routeName: item.routeName }).length) {
      const x = filter(productOrders, { routeName: item.routeName });
      product.push({
        productId: item.productId,
        productName: getProductDetails(item.productId)?.brand,
        productSKU: getProductDetails(item.productId)?.sku,
        orderId: item.orderId,
        routeName: item.vehicleId > 0 && item.routeName === "One-Off" ? "Van-Sales(One-Off)" : item.routeName,
        quantity: x.reduce((a, b) => parseFloat(a) + parseFloat(b.quantity), 0),
        price: x.reduce(
          (a, b) => parseFloat(a) + parseFloat(b.price),
          0
        ),
      });
        
    }
  });

  const backButton = () => {
    // history.push("/dashboard/reports/" + code);
    history.goBack();
  };

  //csv
  let data = [];
  product.map((arra) => {
    data.push({
        RouteName: arra.routeName,
      Product: getProductDetails(arra.productId)?.brand,
      SKU: getProductDetails(arra.productId)?.sku,
      Product_Code: getProductDetails(arra.productId)?.productId,
      Volume: arra.quantity,
      Hectolitres: getHectoliter(getProductDetails(arra.productId)?.productId, arra.quantity),
      Amount: formatPriceByCountrySymbol(country, arra.price).toLocaleString(
        undefined
      ),
      
    });
  });

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-10 lg:pb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={() => backButton()} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("volume_sold")} ({productCode})
            </p>
          </div>
          <div className="flex gap-16 items-center">
            <span
              style={{
                backgroundColor: "#50525B",
                padding: "4px 8px",
                borderRadius: 4,
                color: "#FFFFFF",
                fontSize: 16,
              }}
            >
              <strong>{t("total_volume_sold")}:</strong> {formatNumber(totalQ)}
            </span>
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              {t("total_amount")}: {formatPriceByCountrySymbol(country, totalAmt)}
            </span>
          </div>
          {/* <div className="flex gap-16 items-center">
            <div className="flex gap-16 items-center">
              <CSVLink
                data={data}
                filename={`${
                  getDistributorName(Dist_Code)?.SYS_Code
                }_volume_sold_${startRange}-${stopRange}.csv`}
                style={{ textDecoration: "none" }}
              >
                <div className="flex justify-end gap-4 pr-3">
                  <img src={Download} alt="" />
                  <p className="report-download">Download Report</p>
                </div>
              </CSVLink>
            </div>
          </div> */}
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
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                S/N
              </th>
              {/* <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                Product Code
              </th> */}
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                {t("route_name")}
              </th>
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                {t("product")}
              </th>
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                SKU
              </th>
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                {t("volume_Cases")}
              </th>
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                HL
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
            {uniqBy(product, "routeName")?.map((product, index) => (
              <tr key={index}>
                <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {index + 1}
                </td>
                {/* <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {getProductDetails(product.productId)?.productId}
                </td> */}
                <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {product.routeName}
                </td>
                <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {product.productName}
                </td>
                <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {product.productSKU}
                </td>
                <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {product.quantity}
                </td>
                <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {getHectoliter(
                    getProductDetails(product.productId)?.productId,
                    product.quantity
                  )}
                </td>
                <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {formatPriceByCountrySymbol(
                    country,
                    product.price
                  ).toLocaleString(undefined)}
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
})(VolumeSold);
