import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { useParams, useHistory } from "react-router-dom";
import Dashboard from "../../../Layout/Dashboard";
import QuickActions from "../../../components/common/QuickActions";
import { quickActionsData } from "../../../utils/quickActions";
import { logout } from "../../Auth/actions/auth.action";
import onlineImg from "../../../assets/svg/online.svg";
import soundwave from "../../../assets/svg/soundwave.svg";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import customersImg from "../../../assets/svg/customers.svg";
//import { NotificationData as data } from "../../../utils/data";
import { Link } from "react-router-dom";
import Calendar from "../../../components/common/Calendar";
import {
  orderNet,
  completedOrdersNet,
  customerNet,
  locationNet,
  inventoryNet,
} from "../../../utils/urls";
import { ReactComponent as Info } from "../../../assets/svg/info-dashboard.svg";
import { setDistCode, showCalendar } from "../actions/DistributorAction";
// import { getAllOrdersByDistributor } from "../../Admin/order/actions/orderAction";
import {
  getAllCustomers,
  getAllDistributorCustomers,
} from "../../Admin/customer/actions/customer";
import { filter, uniqBy, flatten } from "lodash";
import moment from "moment";
import ReturnTotalEmpties from "../../Inventory/components/ReturnTotalEmpties";
import { formatNumber } from "../../../utils/formatNumber";
import { discardChanges } from "../../Inventory/actions/inventoryProductAction";
import { formatPriceByCountrySymbol } from "../../../utils/formatPrice";
import { getSingleDistributor } from "../../Admin/pages/actions/adminDistributorAction";
import { useTranslation } from "react-i18next";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'
import { getAllOrdersByDistributor } from "../../Admin/order/actions/orderAction";

const Home = ({ location }) => {
  const { t } = useTranslation();
  const { Dist_Code } = useParams();
  const currentDateISO = moment().toISOString();
  const todayStartTime =
    moment(currentDateISO).format("YYYY-MM-DD") + " 00:00:00";
  const todayEndTime =
    moment(currentDateISO).format("YYYY-MM-DD") + " 23:59:59";
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const distDetails = useSelector(
    (state) => state.AllDistributorReducer.distributor
  );
  const allDistCustomers = useSelector(
    (state) => state.CustomerReducer.all_dist_customers
  );
  const [userCountry, setUserCountry] = useState('Ghana');
  const roles = AuthData.roles;

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry])
  const { sessionUser } = useSelector((state) => state.Auth);
  const [customDate, setCustomDate] = useState("");
  const [openOrders, setOpenOrders] = useState([]);
  const [startRange, setStartRange] = useState(todayStartTime);
  const [stopRange, setStopRange] = useState(todayEndTime);
  const [totalOrderPricee, setTotalOrderPrice] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [totalOpenOrderPricee, setTotalOpenOrderPrice] = useState(0);
  const [loadingOrderState, setLoadingOrderState] = useState(true);
  const [outStockState, setOutStockState] = useState("Loading...");
  const [openOrderState, setOpenOrderState] = useState("Loading...");
  const [calendarText, setCalendarText] = useState("Business Today");
  const [inventory, setInventory] = useState(false);
  const [outStock, setOutStock] = useState([
    {
      locationName: "",
      locationId: "",
      product: {},
    },
  ]);
  const history = useHistory();
  const openReturnTotalEmpties = useSelector(
    (state) => state.InventoryReducer.return_empties_button
  );
  const selectedDayRange = useSelector(
    (state) => state.DistReducer.selected_day_range
  );

  useEffect(() => {
    setLoadingOrderState(true);
    const wait = async () => {
      dispatch(getAllOrdersByDistributor(distDetails?.SYS_Code, '', 'Completed', '', '', ''));
      dispatch(getAllDistributorCustomers(distDetails?.SYS_Code));
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
          setCalendarText("Custom Date");
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
          setCalendarText("Business Today");
          setCustomDate("");
        }
      }
      //check if there is inventory for this company
      const inventory = inventoryNet()
      inventory.get(Dist_Code).then((response) => {
        const { data } = response.data;
        data.length > 0 ? setInventory(false) : setInventory(true);
      });
      dispatch(discardChanges());
      //get open orders
      const orderApi = orderNet()
      orderApi
        .get(
          `GetOrder/GetOrderBySellerCompanyId/${distDetails?.SYS_Code}/${startRange}/${stopRange}`
        )
        .then((response) => {
          const { data } = response;
          const paidorders = filter(data.order, function (order) {
            return (
              order.routeName === "Walk-In-Sales" ||
              order.routeName === "One-Off" ||
              (order.routeName === "Van-Sales" &&
                order.status === "Completed") ||
              (order.routeName === "SalesForce" && order.status === "Completed")
              // (order.status === "Assigned" || order.status === "Completed")
            );
          });
          let orderItems = [];
          paidorders &&
            paidorders.map((order, index) => {
              orderItems.push(order.orderItems);
            });
          orderItems = flatten(orderItems);

          const totalVolume = orderItems.reduce(
            (a, b) => parseInt(a.quantity) + parseInt(b.quantity),
            0
          );

          setTotalCases(totalVolume);

          const openOrders = filter(data.order, function (order) {
          return (
            order.status === "Placed"
            );
          });

          if (openOrders.length > 0) {
            const totalOpenOrderPrice = openOrders.reduce(
              (accum, item) => accum + parseFloat(item.totalPrice),
              0
            );
            const totalOrderPrice = paidorders.reduce(
              (accum, item) => accum + parseFloat(item.totalPrice),
              0
            );
            setOpenOrders(openOrders);
            setTotalOpenOrderPrice(totalOpenOrderPrice);
            setTotalOrderPrice(totalOrderPrice);
          } else {
            setOpenOrderState(t("no_new_order"))
          }
        })
        .catch((error) => {
          setOpenOrderState(t('error_fetching_open_orders'))
          return;
        });
      //get out of stock by company by location
    inventory
        .get("company-out-of-stock/" + Dist_Code)
        .then((response) => {
          const { data } = response;
          data.data.length
            ? setOutStock(data.data)
            : setOutStockState(t("no_product_is_out_of_stock"));
        })
        .catch((error) => {
          setOutStockState(t("error_fetching_out_of_stock_orders"));
          return;
        });
    };
    wait();
  }, [
    Dist_Code,
    distDetails?.SYS_Code,
    country,
    selectedDayRange,
    startRange,
    stopRange,
  ]);


  let completedBulkOrders = [];
  let completedPocOrders = [];
  let completedMainstreamOrders = [];
  let completedResellerOrders = [];
  let completedStockistOrders = [];
  let completedHigEndOrders = [];
  let completedLowEndOrders = [];
  //get ditributor customers

  const getTotalCustomer = (country) => {
    let totalCustomers;
    switch (country) {
      case "Nigeria":
        totalCustomers =
          [...new Set(completedBulkOrders)].length +
          [...new Set(completedPocOrders)].length;
        break;
      case "South Africa":
        totalCustomers =
          [...new Set(completedBulkOrders)].length +
          [...new Set(completedPocOrders)].length;
        break;
      case "Uganda":
        totalCustomers =
          [...new Set(completedMainstreamOrders)].length +
          [...new Set(completedResellerOrders)].length +
          [...new Set(completedHigEndOrders)].length +
          [...new Set(completedLowEndOrders)].length;
        break;
      case "Ghana":
        totalCustomers =
          [...new Set(completedMainstreamOrders)].length +
          [...new Set(completedResellerOrders)].length +
          [...new Set(completedHigEndOrders)].length +
          [...new Set(completedLowEndOrders)].length;
        break;
      case "Tanzania":
        totalCustomers =
          [...new Set(completedMainstreamOrders)].length +
          [...new Set(completedStockistOrders)].length +
          [...new Set(completedHigEndOrders)].length +
          [...new Set(completedLowEndOrders)].length;
        break;
      case "Mozambique":
        totalCustomers =
          [...new Set(completedMainstreamOrders)].length +
          [...new Set(completedStockistOrders)].length +
          [...new Set(completedHigEndOrders)].length +
          [...new Set(completedLowEndOrders)].length +
          [...new Set(completedResellerOrders)].length;
        break;
      case "Zambia":
        totalCustomers =
          [...new Set(completedMainstreamOrders)].length +
          [...new Set(completedHigEndOrders)].length +
          [...new Set(completedLowEndOrders)].length
        break;
      default:
        totalCustomers =
          [...new Set(completedBulkOrders)].length +
          [...new Set(completedPocOrders)].length;
        break;
    }
    return totalCustomers;
  };
  const distOrders = useSelector((state) => state.OrderReducer.all_orders);
  const completedOrders = filter(distOrders, function (order) {
    return (
      order.routeName === "Walk-In-Sales" ||
      order.routeName === "One-Off" ||
      order.routeName === "Van-Sales" ||
      order.routeName === "SalesForce"
    );
  });
  const uniqueCompletedOrders = uniqBy(completedOrders, "buyerCompanyId");
  uniqueCompletedOrders?.map((order, index) => {
    const buyer = allDistCustomers.filter(
      (customer) => order.buyerCompanyId === customer.SF_Code
    )[0];
    if (buyer?.CUST_Type === "Bulkbreaker")
      completedBulkOrders.push(order.buyerCompanyId);
    if (buyer?.CUST_Type === "Poc")
      completedPocOrders.push(order.buyerCompanyId);
    if (buyer?.CUST_Type === "Mainstream")
      completedMainstreamOrders.push(order.buyerCompanyId);
    if (buyer?.CUST_Type === "Reseller")
      completedResellerOrders.push(order.buyerCompanyId);
    if (buyer?.CUST_Type === "Stockist")
      completedStockistOrders.push(order.buyerCompanyId);
    if (buyer?.CUST_Type === "High End")
      completedHigEndOrders.push(order.buyerCompanyId);
    if (buyer?.CUST_Type === "Low End")
      completedLowEndOrders.push(order.buyerCompanyId);
  });

  return (
    <Dashboard location={location} sessionUser={sessionUser}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <h2 className="font-customRoboto text-black font-bold text-2xl">
          {t("home")}
        </h2>
        <div className="flex justify-between w-full my-8">
          <div
            className="h-48 rounded-md shadow-lg relative"
            style={{
              backgroundImage: countryConfig[userCountry].kpoInfoBoxLeft,
              width: "49%",
            }}
          >
            <div
              className="flex justify-between py-5 px-8"
              style={{ width: "70%" }}
            >
              <div className="mr-32">
                <div style={{ position: "absolute" }}>
                  <Calendar />
                </div>
                <div
                  className="flex bg-white w-36 cursor-pointer h-8 text-center rounded-md"
                  onClick={() => dispatch(showCalendar(true))}
                >
                  <p
                    className="font-medium my-auto w-full"
                    style={{ fontSize: "14px", color: "#50525B" }}
                  >
                    {calendarText}
                  </p>
                  <div className="mx-1 my-auto">
                    <img className="" src={arrowDown} alt="" />
                  </div>
                </div>
                <p
                  className="text-base font-normal"
                  style={{
                    color: countryConfig[userCountry].textColor,
                    fontSize: "11px",
                    fontWeight: "bold",
                    marginBottom: customDate ? -15 : 0,
                  }}
                >
                  {customDate}
                </p>
                <div className="mt-3 w-max">
                  <p
                    className="text-base font-normal"
                    style={{ color: countryConfig[userCountry].textColor }}
                  >
                    {t("total_sales")}
                  </p>
                  <div
                    className="border-dotted border-b-2"
                    style={{
                      borderColor: countryConfig[userCountry].dottedBorderColor,
                    }}
                  />
                </div>

                <p
                  className="text-white mt-2 font-medium"
                  style={{
                    fontSize: "28px",
                    color: countryConfig[userCountry].textColor,
                  }}
                >
                  {formatPriceByCountrySymbol(country, totalOrderPricee)}
                </p>
                <div>
                  <p
                    className=" text-base font-normal"
                    style={{
                      fontSize: "11px",
                      color: countryConfig[userCountry].textColor,
                    }}
                  >
                    {t("total_cases_home")}:{" "}
                    <span className="font-medium" style={{ fontSize: 14 }}>
                      {formatNumber(totalCases)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="">
                <div className="">
                  <p
                    className="font-normal"
                    style={{
                      fontSize: "11px",
                      color: countryConfig[userCountry].textColor,
                    }}
                  >
                    {t("confirmed_invoice").toUpperCase()}
                  </p>
                  <div
                    className="border-dotted border-b-2"
                    style={{
                      borderColor: countryConfig[userCountry].dottedBorderColor,
                    }}
                  />
                </div>
                <p
                  className=" mt-2 font-medium"
                  style={{
                    fontSize: "18px",
                    color: countryConfig[userCountry].textColor,
                  }}
                >
                  {formatPriceByCountrySymbol(country, totalOrderPricee)}
                </p>

                <div className="mt-5 w-30">
                  <p
                    className="font-normal"
                    style={{
                      fontSize: "11px",
                      color: countryConfig[userCountry].textColor,
                    }}
                  >
                    {t("open_orders").toUpperCase()}
                  </p>
                  <div
                    className="border-dotted border-b-2"
                    style={{
                      borderColor: countryConfig[userCountry].dottedBorderColor,
                    }}
                  />
                </div>
                <p
                  className=" mt-2 font-medium"
                  style={{
                    fontSize: "18px",
                    color: countryConfig[userCountry].textColor,
                  }}
                >
                  {formatPriceByCountrySymbol(country, totalOpenOrderPricee)}
                </p>
              </div>
            </div>
            <img
              src={soundwave}
              alt="rare-img"
              style={{ position: "absolute", right: "-60px", bottom: "-80px" }}
            />
          </div>

          <div
            className="h-48 rounded-md shadow-lg relative"
            style={{
              backgroundImage: countryConfig[userCountry].kpoInfoBoxRight,
              width: "49%",
            }}
          >
            <div
              className="flex justify-between p-5"
              style={{ width: country === "Mozambique" ? "100%" : "85%", height: "100%" }}
            >
              <div className="m-auto flex">
                <img className="mr-4 text-center" alt="customer-icon" src={customersImg} />
                <div>
                  <div>
                    <p
                      className="text-base font-normal"
                      style={{ color: countryConfig[userCountry].textColor }}
                    >
                      {t("total_customer")}
                    </p>
                    <div
                      className="border-dotted border-b-2 "
                      style={{
                        borderColor:
                          countryConfig[userCountry].dottedBorderColor,
                      }}
                    />
                  </div>
                  <p
                    className="mt-2 font-medium"
                    style={{
                      fontSize: "28px",
                      color: countryConfig[userCountry].textColor,
                    }}
                  >
                    {getTotalCustomer(country)}
                  </p>
                </div>
              </div>
              <div className={`ml-6 my-auto ${country === "Mozambique" ? "w-72" : "w-48"}`}>
                {country === "Nigeria" || country === "South Africa" ? (
                  <>
                    <div className="mt-3 w-max">
                      <p
                        className=" text-base font-normal"
                        style={{
                          fontSize: "11px",
                          color: countryConfig[userCountry].textColor,
                        }}
                      >
                        BULKBREAKERS
                      </p>
                      <div
                        className="border-dotted border-b-2"
                        style={{
                          borderColor:
                            countryConfig[userCountry].dottedBorderColor,
                        }}
                      />
                    </div>
                    <p
                      className=" mt-2 font-medium"
                      style={{
                        fontSize: "18px",
                        color: countryConfig[userCountry].textColor,
                      }}
                    >
                      {[...new Set(completedBulkOrders)].length}
                    </p>

                    <div className="mt-2 w-max">
                      <p
                        className=" text-base  font-normal"
                        style={{
                          fontSize: "11px",
                          color: countryConfig[userCountry].textColor,
                        }}
                      >
                        POCs
                      </p>
                      <div
                        className="border-dotted border-b-2"
                        style={{
                          borderColor:
                            countryConfig[userCountry].dottedBorderColor,
                        }}
                      />
                    </div>
                    <p
                      className=" mt-2 font-medium"
                      style={{
                        fontSize: "18px",
                        color: countryConfig[userCountry].textColor,
                      }}
                    >
                      {[...new Set(completedPocOrders)].length}
                    </p>
                  </>
                ) : (
                    <>
                      <div className="flex">
                        {country !== "Zambia" && (
                          <div className={country === "Mozambique" ? 'w-1/3' : 'w-1/2'}>
                            <div className="mt-2 w-max">
                              <p
                                className=" text-base  font-normal pr-3"
                                style={{
                                  fontSize: "16px",
                                  color: countryConfig[userCountry].textColor,
                                }}
                              >
                                {country === "Tanzania" ? t("stockist") : t("Reseller")}
                              </p>
                              <div
                                className="border-dotted border-b-2"
                                style={{
                                  borderColor:
                                    countryConfig[userCountry].dottedBorderColor,
                                }}
                              />
                            </div>
                            <p
                              className=" mt-2 mr-10 font-medium"
                              style={{
                                fontSize: "18px",
                                color: countryConfig[userCountry].textColor,
                              }}
                            >
                              {country === "Tanzania"
                                ? [...new Set(completedStockistOrders)].length
                                : [...new Set(completedResellerOrders)].length}
                            </p>
                          </div>
                        )}
                        <div className={country === "Mozambique" ? 'w-1/3' : 'w-1/2'}>
                          <div className="mt-2 w-max">
                            <p
                              className=" text-medium font-normal"
                              style={{
                                fontSize: "16px",
                                color: countryConfig[userCountry].textColor,
                              }}
                            >
                              {t('Mainstream')}
                            </p>
                            <div
                              className="border-dotted border-b-2"
                              style={{
                                borderColor:
                                  countryConfig[userCountry].dottedBorderColor,
                              }}
                            />
                          </div>
                          <p
                            className=" mt-2 mr-4  font-medium"
                            style={{
                              fontSize: "18px",
                              color: countryConfig[userCountry].textColor,
                            }}
                          >
                            {[...new Set(completedMainstreamOrders)].length}
                          </p>
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div className={country === "Mozambique" ? 'w-1/3' : 'w-1/2'}>
                          <div className="mt-2 w-max">
                            <p
                              className=" text-medium font-normal"
                              style={{
                                fontSize: "16px",
                                color: countryConfig[userCountry].textColor,
                              }}
                            >
                              {t('High_End')}
                          </p>
                            <div
                              className="border-dotted border-b-2"
                              style={{
                                borderColor:
                                  countryConfig[userCountry].dottedBorderColor,
                              }}
                            />
                          </div>
                          <p
                            className="mt-2 font-medium"
                            style={{
                              fontSize: "18px",
                              color: countryConfig[userCountry].textColor,
                            }}
                          >
                            {[...new Set(completedHigEndOrders)].length}
                          </p>
                        </div>
                        <div className={country === "Mozambique" ? 'w-1/3' : 'w-1/2'}>
                          <div className="mt-2 w-max">
                            <p
                              className=" text-medium  font-normal"
                              style={{
                                fontSize: "16px",
                                color: countryConfig[userCountry].textColor,
                              }}
                            >
                              {t("Low_End")}
                            </p>
                            <div
                              className="border-dotted border-b-2"
                              style={{
                                borderColor:
                                  countryConfig[userCountry].dottedBorderColor,
                              }}
                            />
                          </div>
                          <p
                            className="mt-2 font-medium"
                            style={{
                              fontSize: "18px",
                              color: countryConfig[userCountry].textColor,
                            }}
                          >
                            {[...new Set(completedLowEndOrders)].length}
                          </p>
                        </div>
                        {
                          country === "Mozambique" && (
                            <div className='w-1/3'>
                              <div className="mt-2 w-max">
                                <p
                                  className="text-base font-normal pr-3"
                                  style={{
                                    fontSize: "16px",
                                    color: countryConfig[userCountry].textColor,
                                  }}
                                >
                                  {t('stockist')}
                                </p>
                                <div
                                  className="border-dotted border-b-2"
                                  style={{
                                    borderColor:
                                      countryConfig[userCountry].dottedBorderColor,
                                  }}
                                />
                              </div>
                              <p
                                className=" mt-2 mr-2 font-medium"
                                style={{
                                  fontSize: "18px",
                                  color: countryConfig[userCountry].textColor,
                                }}
                              >
                                {[...new Set(completedStockistOrders)].length}
                              </p>
                            </div>
                          ) 
                        }
                      </div>
                    </>
                  )}
              </div>
            </div>
            <img
              src={soundwave}
              alt="rare-img"
              style={{
                position: "absolute",
                right: "-60px",
                bottom: "-80px",
              }}
            />
          </div>
        </div>
        {AuthData.roles !== "Mini-Admin" && (
          <>
            <h2
              className="font-customRoboto pt-5 font-medium text-xl"
              style={{ color: "black", fontWeight: 500, fontSize: 20 }}
            >
              {t("quick_action")}
            </h2>
            <div className="mt-5 mb-5">
              <QuickActions data={quickActionsData} code={Dist_Code} />
            </div>
          </>
        )}
        <h2
          className="font-customRoboto mt-10 mb-5 font-medium text-xl"
          style={{ color: "black", fontWeight: 500, fontSize: 20 }}
        >
          {t("updates")}{" "}
          {/*<span className="ml-3 text-base font-normal"> 8 Unread</span>*/}
        </h2>
        <div className="bg-white w-full rounded-md p-6">
          <div className="new-update">
            <div className="flex justify-between">
              <p
                className="font-medium"
                style={{ color: "#50525B", fontSize: "18px", fontWeight: 600 }}
              >
                {t("new_order_alert")}{" "}
                {/* <span className="ml-3 text-base font-normal">5 Unread</span> */}
              </p>
              {/* <Link
                to=""
                className="text-base mt-1 font-normal"
                style={{ color: "#0033FF" }}
              >
                {" "}
                View All
              </Link> */}
            </div>
            {
              openOrders.length > 0
            ?
              openOrders.map((val, index) => (
                <div className="flex w-full mt-5 mb-8" key={index}>
                  <div className="flex w-3/5">
                    <img className="mr-4" src={onlineImg} alt="" />
                    <p
                      className="w-full font-normal text-base"
                      style={{ color: "#50525B" }}
                    >
                      {t("new_order")} {val?.orderId} {t("has_been_placed_by")}{" "}
                      {val?.buyerDetails[0]?.buyerName || val?.buyerCompanyId}.
                    </p>
                  </div>
                  <p
                    className="w-1/5 text-center font-normal text-base"
                    style={{ color: "#50525B" }}
                  >
                    {moment(val?.datePlaced).format("DD-MM-YYYY")}
                  </p>
                  <p
                    className="w-1/5 text-center font-normal text-base"
                    style={{ color: "#50525B" }}
                  >
                    {moment(val?.datePlaced).format("HH:mm" )}
                  </p>
                </div>
              ))
            :
              <div
                style={{ paddingTop: 10, paddingBottom: 10, color: "#50525B" }}
              >
                {openOrderState}
              </div>
            }
            {openOrders.length > 5 && (
              <div
                className="w-full rounded-md text-center mb-12 py-3 cursor-pointer"
                style={{ backgroundColor: "#DEE0E4" }}
              >
                <p
                  className="font-medium text-base"
                  style={{ color: "#2D2F39" }}
                  onClick={() => history.push(`/dashboard/notifications/${Dist_Code}`)}
                >
                  {t("show_more")}
                </p>
              </div>
            )}
          </div>
          <div className="border-b-2 border-black-200" />
          <div className="low-volume mt-8">
            <div className="flex justify-between">
              <p
                className="font-medium"
                style={{
                  color: "#D82C0D",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {t("out_of_stock_alert")}{" "}
                {/* <span className="ml-3 text-base font-normal">5 Unread</span> */}
              </p>
            </div>
            {outStock.length > 0 ? (
              outStock.map((val, index) => (
                <div className="flex w-full mt-5 mb-8" key={index}>
                  {val.product.brand != undefined ? (
                    <>
                      <div className="flex w-3/5">
                        <img className="mr-4" src={onlineImg} alt="" />
                        <p
                          className="w-full font-normal text-base"
                          style={{ color: "#50525B" }}
                        >
                          {t("you_have_run_out_of")}{" "}
                          {val.product?.brand + " " + val.product?.sku}.{" "}
                          {t("you_need_to_restock")}
                        </p>
                      </div>
                      <p
                        className="w-1/5 text-center font-normal text-base"
                        style={{ color: "#50525B" }}
                      >
                        {moment(val?.date).format("DD-MM-YYYY")}
                      </p>
                      <p
                        className="w-1/5 text-right font-normal text-base"
                        style={{ color: "#50525B" }}
                      >
                        {val.time}
                      </p>
                    </>
                  ) : (
                    <div
                      style={{ paddingTop: 10, paddingBottom: 10, color: "#50525B" }}
                    >
                      {outStockState}
                    </div>
                  )}
                </div>
              ))
            ) : (
                <div
                  style={{ paddingTop: 10, paddingBottom: 10, color: "#50525B" }}
                >
                  {outStockState}
                </div>
              )}
            {outStock.length > 5 ? (
              <div
                className="w-full rounded-md text-center mb-12 py-3 cursor-pointer"
                style={{ backgroundColor: "#DEE0E4" }}
              >
                <p
                  className="font-medium text-base"
                  style={{ color: "#2D2F39" }}
                >
                  {t("show_more")}
                </p>
              </div>
            ) : (
                ""
              )}
          </div>
        </div>
      </div>
      <Transition.Root show={inventory} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => {
            "";
          }}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <label
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </label>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                style={{ height: 300 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle"
              >
                <div
                  style={{
                    backgroundColor:
                      countryConfig[country].inventorySetupBGColor,
                    padding: "25px 33px",
                    display: "flex",
                  }}
                >
                  {/* <Info width="50px" height="50px" /> */}
                  <img src={countryConfig[country].infoIcon} alt="" />
                  <div
                    className="font-customGilroy"
                    style={{
                      marginLeft: 17,
                      fontSize: 30,
                      fontWeight: 600,
                      color: countryConfig[country].inventorySetupHTextColor,
                    }}
                  >
                    {t("inventory_setup")}
                  </div>
                </div>
                <div className="flex flex-col items-center w-modal">
                  <div
                    className="font-customGilroy not-italic font-medium text-center text-grey-85"
                    style={{ fontSize: 20, marginTop: 24 }}
                  >
                    {t("you_need_to_setup_inventory")}
                  </div>
                </div>
                <div
                  className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4"
                  style={{ marginTop: 85 }}
                >
                  {roles === "Mini-Admin" ? (
                    <button
                      className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic"
                      style={{
                        outline: "none",
                        padding: "8px 29px",
                        fontSize: 14,
                        backgroundColor: countryConfig[country].buttonColor,
                        color: countryConfig[country].textColor,
                      }}
                      onClick={() =>
                        history.push("/dashboard/inventory-setup/" + Dist_Code)
                      }
                    >
                      View inventory
                    </button>
                  ) : (<button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic"
                    style={{
                      outline: "none",
                      padding: "8px 29px",
                      fontSize: 14,
                      backgroundColor: countryConfig[country].buttonColor,
                      color: countryConfig[country].textColor,
                    }}
                    onClick={() =>
                      history.push("/dashboard/inventory-setup/" + Dist_Code)
                    }
                  >
                    {t("set_inventory")}
                  </button>)}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <ReturnTotalEmpties show={openReturnTotalEmpties} code={Dist_Code} />
    </Dashboard>
  );
};


export default Home
