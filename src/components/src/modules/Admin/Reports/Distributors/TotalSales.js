import React, { useEffect, useState } from "react";
import moment from "moment";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import CalendarIcon from "../../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom" 
import  { connect, useDispatch, useSelector } from "react-redux";
import { getSingleDistributor } from "../../pages/actions/adminDistributorAction";
import {
  getAllCompletedOrdersByDistributor,
  getAllDriversByOwnerId,
  getAllOrders,
  getDistOrdersByDateRange,
  setLoadingToDefault,
} from "../../order/actions/orderAction";
import { getAllDistributors } from "../../KPO/actions/UsersAction";
import { filter, flatten, orderBy, uniqBy } from "lodash";
import { formatNumber } from "../../../../utils/formatNumber";
import { formatPriceByCountrySymbol } from "../../../../utils/formatPrice";
import Arrowdown from "../../../../assets/svg/arrowDown.svg";
import { showCalendar } from "../actions/ReportAction";
import Calendar from "../../../../components/common/Calendar";
import { CSVLink } from "react-csv";
import { getAllProducts } from "../../Pricing/actions/AdminPricingAction";
import {
  getAllCustomers,
  getAllDistributorCustomers,
} from "../../customer/actions/customer";
import { getHectoliter } from "../../../../utils/getHectoLitres";
import LoadingList from "../../../../components/common/LoadingList";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/pagination";

const TotalSales = ({ location, distributor, getSingleDistributor }) => {
  const { t } = useTranslation();
  const history = useHistory();
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
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  let PageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const code = location.pathname.split("/").at(-1);

  const allCustomers = useSelector(
    (state) => state.CustomerReducer.all_customers
  );

  const loading = useSelector((state) => state.OrderReducer.loading);

  const allDrivers = useSelector((state) => state.OrderReducer.all_drivers);

  const getDistributorName = (code) => {
    let thisDistributor = filter(allDistributors, { SYS_Code: code })[0];
    if (!thisDistributor) {
      thisDistributor = filter(allDistributors, { DIST_Code: code })[0];
    }
    return thisDistributor;
  };
  useEffect(() => {
    getSingleDistributor(code);
    dispatch(getAllDriversByOwnerId(code));
    !allCustomers.length && dispatch(getAllCustomers(country));
    !allProducts.length && dispatch(getAllProducts(country));
    !allDistributors && dispatch(getAllDistributors(country));
    !allDrivers && dispatch(getAllDriversByOwnerId(code));
  }, []);

  const allSystemOrders = useSelector(
    (state) => state.OrderReducer.all_orders_by_date
  );
  const allProducts = useSelector((state) => state.PricingReducer.allProducts);

  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  // if (!allDistributors) {
  //   dispatch(getAllDistributors(country));
  // }

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
    dispatch(setLoadingToDefault());
    dispatch(
      getDistOrdersByDateRange(
        startRange,
        stopRange,
        getDistributorName(code)?.SYS_Code
      )
    );
  }, [startRange, stopRange, allDistributors]);
  // const dist_orders = filter(allSystemOrders, { sellerCompanyId: code });
  let dist_completed_orders = filter(allSystemOrders, function (order) {
    return (
      (order.routeName === "Walk-In-Sales" && order.status === "Completed") ||
      (order.routeName === "One-Off" && order.status === "Completed") ||
      (order.routeName === "Van-Sales" && order.status === "Completed") ||
      (order.routeName === "SalesForce" && order.status === "Completed")
    );
  });
  dist_completed_orders = orderBy(dist_completed_orders, "orderId", "desc");
  const uniqueAllOrders = uniqBy(allSystemOrders, "orderId");

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      uniqueAllOrders && uniqueAllOrders.slice(firstPageIndex, lastPageIndex)
    );
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  useEffect(() => {
    const totalSales = dist_completed_orders.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.price),
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
  }, [dist_completed_orders]);

  const backButton = () => {
    // history.push("/distributor/reports/" + code);
    history.goBack();
  };

  const getProductDetails = (productID) => {
    let thisProduct = filter(allProducts, { productId: productID })[0];
    if (!thisProduct) {
      thisProduct = filter(allProducts, { id: parseInt(productID) })[0];
    }
    return thisProduct;
  };

  const getCustomerDetails = (SF_Code) => {
    let thisCustomer = filter(allCustomers, { SF_Code: SF_Code })[0];

    return thisCustomer;
  };
  const getDriverDetails = (VehicleID) => {
    let thisDriver = allDrivers?.filter((driver) => {
      return driver?.vehicleId === parseInt(VehicleID);
    })[0];
    return thisDriver;
  };

  //csv
  const getData = (orderItems) => {
    let dd = [];
    orderItems?.map((data) => {
      country === "Uganda"
        ? dd.push({
            Syspro_Code: getDistributorName(data.sellerCompanyId)?.SYS_Code,
            // DB_Name: getDistributorName(data.sellerCompanyId)?.company_name,
            Order_ID: data?.orderId,
            Route_Name: data?.routeName,
            Route_Type: data?.specificRouteName,
            "SF Transaction No": data?.transactionNo,
            Agent_Name: data?.agent,
            Vehicle_ID: data?.vehicleId,
            Status: data?.status,
            ReasonForRejection: data?.reasonForRejection,
            Buyer_Name: data?.buyerName,
            Buyer_Type:
              getCustomerDetails(data.buyerCompanyId)?.CUST_Type === "Reseller"
                ? "Stockist"
                : "Outlet",
            Buyer_ID: data.buyerCompanyId,
            "Channel/Customer Type": getCustomerDetails(data.buyerCompanyId)
              ?.CUST_Type,
            BDR_Name: getCustomerDetails(data.buyerCompanyId)?.bdr,
            Price: data?.price,
            "Quantity/Cases": data?.quantity,
            Hectolitres: getHectoliter(
              getProductDetails(data.productId)?.productId,
              data?.quantity
            ),
            Product_Code: getProductDetails(data.productId)?.productId,
            Drs: getDistributorName(data.sellerCompanyId)?.DD_Name,
            Product_SKU: getProductDetails(data.productId)?.sku,
            Product_Name: getProductDetails(data.productId)?.brand,
            District: getCustomerDetails(data.buyerCompanyId)?.district,
            Region: getCustomerDetails(data.buyerCompanyId)?.region,
            Driver_Name: getDriverDetails(data.vehicleId)?.name,
            Date_Placed: moment(data.datePlaced).format(
              "YYYY-MM-DD, h:mm:ss a"
            ),
            Date_Accepted:
              data.routeName === "SalesForce"
                ? moment(data?.dateAccepted).format("YYYY-MM-DD, h:mm:ss a")
                : moment(data.datePlaced).format("YYYY-MM-DD, h:mm:ss a"),
            Date_Completed:
              data.routeName === "SalesForce"
                ? moment(data?.dateCompleted).format("YYYY-MM-DD, h:mm:ss a")
                : moment(data.datePlaced).format("YYYY-MM-DD, h:mm:ss a"),
          })
        : dd.push({
            Syspro_Code: getDistributorName(data.sellerCompanyId)?.SYS_Code,
            // DB_Name: getDistributorName(data.sellerCompanyId)?.company_name,
            Order_ID: data?.orderId,
            Route_Name: data?.routeName,
            Route_Type: data?.specificRouteName,
            "SF Transaction No": data?.transactionNo,
            Agent_Name: data?.agent,
            Vehicle_ID: data?.vehicleId,
            Status: data?.status,
            ReasonForRejection: data?.reasonForRejection,
            Buyer_Name: data?.buyerName,
            Buyer_Type: getCustomerDetails(data.buyerCompanyId)?.CUST_Type,
            Buyer_ID: data.buyerCompanyId,
            BDR_Name: getCustomerDetails(data.buyerCompanyId)?.bdr,
            Price: data?.price,
            "Quantity/Cases": data?.quantity,
            Hectolitres: getHectoliter(
              getProductDetails(data.productId)?.productId,
              data?.quantity
            ),
            Product_Code: getProductDetails(data.productId)?.productId,
            Drs: "",
            Product_SKU: getProductDetails(data.productId)?.sku,
            Product_Name: getProductDetails(data.productId)?.brand,
            District: getCustomerDetails(data.buyerCompanyId)?.district,
            Driver_Name: getDriverDetails(data.vehicleId)?.name,
            Date_Placed: moment(data.datePlaced).format(
              "YYYY-MM-DD, h:mm:ss a"
            ),
            Date_Accepted:
              data.routeName === "SalesForce"
                ? moment(data?.dateAccepted).format("YYYY-MM-DD, h:mm:ss a")
                : moment(data.datePlaced).format("YYYY-MM-DD, h:mm:ss a"),
            Date_Completed:
              data.routeName === "SalesForce"
                ? moment(data?.dateCompleted).format("YYYY-MM-DD, h:mm:ss a")
                : moment(data.datePlaced).format("YYYY-MM-DD, h:mm:ss a"),
          });
    });

    return dd;
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
          <div className="flex gap-16 items-center">
            <CSVLink
              data={getData(allSystemOrders)}
              filename={`${
                getDistributorName(code)?.SYS_Code
              }_allOrders_report.csv`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} alt="download" />
                <p className="report-download">
                  {t("download_all_orders_report")}
                </p>
              </div>
            </CSVLink>
          </div>
          <div className="flex gap-16 items-center">
            <CSVLink
              data={getData(dist_completed_orders)}
              filename={`${
                getDistributorName(code)?.SYS_Code
              }_sales_report.csv`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} alt="download" />
                <p className="report-download">
                  {t("download_completed_orders_report")}
                </p>
              </div>
            </CSVLink>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
            <p className="font-normal text-gray-400">{t("distributor")}</p>/
            <p className="font-medium text-grey-100">
              {getDistributorName(code)?.company_name}
            </p>
            /<p className="font-medium text-grey-100">{t("total_sales")}</p>
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
              {t("total_sales")}: {grandTotal}
            </span>
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
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      S/N
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("buyer")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("route")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-black align-middle">
                      {t("order_id")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("status")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("date")}{" "}
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
                  {currentTableData().map((order, index) => (
                    <tr key={index}>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {index + 1}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {order.buyerName}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {order.routeName === "One-Off" && order.vehicleId !== ""
                          ? "Van-Sales(One-Off)"
                          : order.routeName}
                      </td>
                      <td
                        onClick={() =>
                          history.push(
                            `/distributor/order-summary/${order.orderId}/${order.buyerCompanyId}`
                          )
                        }
                        className="text-left align-middle cursor-pointer"
                      >
                        <p className="font-customGilroy pl-8 text-sm text-red-900 font-medium">
                          {order.orderId}
                        </p>
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {order.status}
                      </td>

                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {moment(order.datePlaced).format("DD/MM/YYYY")}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                        {formatPriceByCountrySymbol(country, order.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allSystemOrders && (
                <>
                  <hr />
                  <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                    <Pagination
                      className="pagination-bar"
                      currentPage={currentPage}
                      totalCount={allSystemOrders?.length}
                      pageSize={PageSize}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </>
              )}
            </>
          )}
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
})(TotalSales);
