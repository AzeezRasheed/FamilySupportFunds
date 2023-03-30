import React, { Fragment, useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";
import { Arrows, Return } from "../../assets/svg/adminIcons";
import timer from "../../assets/svg/timer.svg";
import Dashboard from "../../Layout/Dashboard";
import CountDown from "../../components/common/CountDown";
import Loading from "../../components/common/Loading";
import { ReactComponent as Delivered } from "../../assets/svg/bar.svg";
import { ReactComponent as Rejected } from "../../assets/svg/coloredAlert.svg";
import { CloseModal, Checked } from "../../assets/svg/modalIcons";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getSingleOrder,
  getSingleOrderByBuyerId,
  updateOrderStatus,
  getAllDriversByOwnerId,
  assignOrdersToDrivers,
  updateMultipleOrders,
} from "../Admin/order/actions/orderAction";
import countryConfig from "../../utils/changesConfig.json";
import { getLocation } from "../../utils/getUserLocation";
import { getAllProducts } from "../Admin/Pricing/actions/AdminPricingAction";
import { getSingleDistributor } from "../Admin/pages/actions/adminDistributorAction";
import { flatten, filter } from "lodash";
import { formatNumber } from "../../utils/formatNumber";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { runClock } from "../../utils/countdown";
import { orderNet } from "../../utils/urls";
import { t } from "i18next";

const OrderSummary = ({
  allProducts,
  getAllProducts,
  location,
  buyerOrders,
  getSingleOrderByBuyerId,
  getSingleOrder,
  allDrivers,
  singleOrder,
  updateOrderStatus,
  updateMultipleOrders,
  assignOrdersToDrivers,
}) => {
  const { buyerId, orderId } = useParams();
  const dispatch = useDispatch();
  const [rejectModal, setRejectModal] = useState(false);
  const [lastDriver, setLastDriver] = useState("");
  const [assignModal, setAssignModal] = useState(false);
  const [checkType, setCheckType] = useState("");
  const [driver, setDriver] = useState("");
  const [approval, setApproval] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const { sellerId } = useParams();
  const time_in_minutes = 10;
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const miniAdmin = AuthData.roles === "Mini-Admin";
  const current_time = Date.parse(singleOrder?.datePlaced);
  const cancelButtonRef = useRef(null);
  const country = AuthData?.country;
  const [userCountry, setUserCountry] = useState("Ghana");
  const { distCode } = useParams();
  const deadline = localStorage.setItem(
    "dateObj",
    new Date(current_time + time_in_minutes * 60 * 1000)
  );

  useEffect(async () => {
    const orderApi = orderNet();
    const customerLastDriver = await orderApi.get(
      `GetOrder/GetLastVSMByBuyerCompanyId/${buyerId}`
    );
    setLastDriver(customerLastDriver?.data?.vehicleId);
    getAllDriversByOwnerId(distCode);

    const loc = await getLocation();
    setUserCountry(loc);
    
  }, [userCountry, allDrivers.length, lastDriver]);

  useEffect(() => {
    getSingleOrderByBuyerId(buyerId);
    getSingleOrder(orderId);
    getAllProducts(country === "South Africa" ? "SA" : country);
    dispatch(getSingleDistributor(sellerId));
  }, [country]);

  const distributor = useSelector(
    (state) => state.AllDistributorReducer.distributor
  );
  const history = useHistory();
  const getProductDetails = (productId) => {
    let thisProduct = filter(allProducts, { productId: productId })[0];
    if (!thisProduct) {
      thisProduct = filter(allProducts, { id: parseInt(productId) })[0];
    }
    return thisProduct;
  };

  const handleOpen = () => {
    setRejectModal(true);
    // setOpen(true);
  };
  const closeModal = () => {
    setRejectModal(false);
    // setOpen(false);
  };

  const getDriverName = (vehicleId) => {
    const driversName = allDrivers.filter(
      (driver) => driver?.vehicleId === +vehicleId,
      10
    )[0]?.name;
    return driversName;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const values = {
      assignedToId: lastDriver ? lastDriver : +driver.split("-")[0],
      orderId: [+singleOrder?.orderId],
    };
    setLoader(true);
    await assignOrdersToDrivers(values).then(() => {
      setCheckType("assign");
      setAssignModal(false);
      setApproval(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const values = {
      status: "Rejected",
      reasonForRejection: reason,
    };
    await updateOrderStatus(orderId, values);
    setLoading(false);
    setTimeout(() => {
      setApproval(true);
      history.push(`/dashboard/orders-list/${sellerId}`);
    }, 2000);
  };

  const handleUpdate = async (status) => {
    setLoader(true);
    const values = {
      status: status,
      orderId: [orderId],
    };
    await updateMultipleOrders(values).then(() => {
      setTimeout(() => {
        setLoader(false);
        history.push(`/dashboard/orders-list/${sellerId}`);
      }, 1000);
    });
  };

  const dispactchUpdate = () => {
    let result;
    switch (singleOrder.status) {
      case "Placed":
        result = handleUpdate("Accepted");
        break;
      case "Accepted":
        result = handleUpdate("Dispatched");
        break;
      case "Dispatched":
        result = handleUpdate("Delivered");
        break;
      default:
        result = handleUpdate("Accepted");
        break;
    }
    return result;
  };

  const dispactchUpdateText = () => {
    let result;
    switch (singleOrder.status) {
      case "Placed":
        if (loader === true) {
          return (result = <p>{t("accepting")}</p>);
        }
        result = <p>{t("accept_order")}</p>;
        break;
      case "Accepted":
        if (loader === true) {
          return (result = <p>{t("dispatching")}</p>);
        }
        result = <p>{t("dispatch_order")}</p>;
        break;
      case "Dispatched":
        if (loader === true) {
          return (result = <p>{t("delivering")}</p>);
        }
        result = <p>{t("delivered_order")}</p>;
        break;
      default:
        result = <p>{t("accept_order")}</p>;
        break;
    }
    return result;
  };

  console.log(singleOrder, '---singleOrder');
  
  let buyerDetails = [];
  singleOrder &&
    singleOrder?.buyerDetails?.map((detail, index) => {
      buyerDetails.push(detail);
    });

  let orderItems = [];
  singleOrder &&
    singleOrder?.orderItems?.map((order, index) => {
      orderItems.push(order);
    });
  orderItems = flatten(orderItems);

  let orderStatus = [];
  singleOrder &&
    singleOrder?.orderStatus?.map((status, index) => {
      orderStatus.push(status);
    });
  orderStatus = flatten(orderStatus);

  const getProductDetailsArray = (productId) => {
    return buyerOrders?.orderItems.filter((product) => product.productId);
  };

  {
    /* <div
          className="flex my-3 py-1 text-center"
          style={{
            border: "1px solid #FFAB00",
            background: "#FFF5D0",
            borderRadius: "8px",
            width: "66%",
          }}
        >
          <img className="pl-4" src={timer} alt="timer-countdown" />
          <div className="text-center py-3">
            {runClock(localStorage.getItem("dateObj"), singleOrder)}
          </div>
        </div> */
  }

  const displayCountDown = () => {
    if (singleOrder) {
      return (
        <>
          <div className="flex justify-between gap-6 mb-8">
            <div className="h-12 py-3 mt-3" style={{ width: "66%" }}></div>
            <div className="flex justify-between gap-3 col-span-3">
              {country !== "Nigeria" ||
                singleOrder.status === "Completed" ||
                singleOrder.status === "Rejected" ||
                singleOrder.status === "Delivered" ||
                singleOrder.deliveryType === "Pick-Up" ? (
                  <div />
                ) : (
                  <button
                    disabled={miniAdmin || loader}
                    onClick={() => dispactchUpdate()}
                    className={`${
                      !miniAdmin && !loader
                        ? "h-12 mt-3 py-3 font-bold w-52 rounded bg-red-700 text-center text-white"
                        : "bg-gray-300 mt-4 text-gray-400 h-12 py-3 font-bold w-52 rounded text-center"
                      }`}
                    style={{ cursor: "pointer", outline: "none" }}
                  >
                    {dispactchUpdateText()}
                  </button>
                )}
              {singleOrder.status === "Placed" &&
                singleOrder.status !== "Completed" &&
                singleOrder.status !== "Assigned" &&
                singleOrder.status !== "Delivered" && (
                  <div className="flex justify-between items-center pt-3">
                    <button
                      style={{
                        outline: "none",
                        backgroundColor:
                          countryConfig[userCountry].buttonColor,
                        color: countryConfig[userCountry].textColor,
                      }}
                      className="h-12 mr-4 py-3 font-bold w-52 rounded bg-red-700 text-center text-white"
                      // onClick={onSubmit}
                      onClick={handleOpen}
                    >
                      {t("reject_order")}
                    </button>

                    <button
                      style={{
                        outline: "none",
                        backgroundColor:
                          countryConfig[userCountry].buttonColor,
                        color: countryConfig[userCountry].textColor,
                      }}
                      className="h-12 py-3 font-bold w-52 rounded bg-red-700 text-center text-white"
                      // onClick={onSubmit}
                      onClick={() => setAssignModal(true)}
                    >
                      {t("assign_order")}
                    </button>
                  </div>
                )}
            </div>
          </div>
          <Transition.Root show={rejectModal} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 " onClose={closeModal}>
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
                  <div className="inline-block align-bottom bg-white rounded-lg text-left  shadow-xl transform transition-all sm:mt-1 sm:align-middle w-modal">
                    <div
                      onClick={closeModal}
                      className="cursor-pointer bg-gray-50 rounded-lg"
                    >
                      <CloseModal className="ml-auto  pb-2" />
                    </div>

                    <div className="px-12 py-1 bg-gray-50">
                      <p className="pt-3">
                        {t("Why are you rejecting this Order")}
                      </p>
                      <textarea
                        rows="5"
                        name="reasonForRejection"
                        type="text"
                        placeholder={t("Type your reason here")}
                        onChange={(e) => setReason(e.target.value)}
                        className="border-defaut bg-red font-normal outline-none text-medium rounded-md text-left border-2 w-full pl-5 pt-4 mt-3"
                      />
                    </div>

                    <div
                      className="overflow-scroll mt-1 "
                      style={{ maxHeight: 400 }}
                    ></div>
                    <div className="">
                      <div
                        className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4 "
                        style={{
                          borderBottomRightRadius: "0.5rem",
                          borderBottomLeftRadius: "0.5rem",
                        }}
                      >
                        {reason === "" ? (
                          <button className="bg-gray-400 outline-none cursor-not-allowed rounded font-customGilroy text-white text-center text-sm font-bold not-italic ml-3 px-14 py-2">
                            {t("reject")}
                          </button>
                        ) : (
                            <button
                              className="bg-red-main outline-none rounded font-customGilroy text-white text-center text-sm font-bold not-italic ml-3 px-14 py-2"
                              onClick={onSubmit}
                            >
                              {loading ? (
                                <div className="flex items-center justify-center">
                                  <Loading />
                                </div>
                              ) : (
                                  t("reject")
                                )}
                            </button>
                          )}

                        <button
                          className="bg-white border outline-none border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                          onClick={closeModal}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          <Transition.Root show={assignModal} as={Fragment}>
            <Dialog
              as="div"
              className="fixed z-10 inset-0 overflow-y-auto"
              initialFocus={cancelButtonRef}
              onClose={() => setAssignModal(false)}
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
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-mini-modal">
                    <CloseModal
                      className="ml-auto m-4 mb-0"
                      onClick={() => setAssignModal(false)}
                    />
                    <div className="h-mini-modal py-4 px-8 justify-left">
                      <p
                        style={{
                          fontSize: 30,
                          fontWeight: "normal",
                          color: "black",
                        }}
                        className="mb-6"
                      >{`Assign  Order ${singleOrder?.orderId}`}</p>

                      {driver ? (
                        <p
                          style={{ fontSize: 16 }}
                          className="font-customGilroy not-italic text-base font-medium"
                        >
                          {`This will assign order ${
                            singleOrder?.orderId
                            } to driver ${driver && driver.split("-")[1]}`}
                        </p>
                      ) : (
                          <div className="flex">
                            <p
                              style={{ fontSize: 16 }}
                              className="font-customGilroy py-3 not-italic text-base font-medium"
                            >
                              {t("Please select a driver")}
                            </p>
                            {lastDriver ? <div className="flex border-2 border-gray-400 outline-none rounded ml-6">
                              <select
                                className="outline-none"
                                value={lastDriver}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setDriver(e.target.value);
                                }}
                              >
                                <option
                                  key={lastDriver}
                                  value={`${lastDriver}`}
                                  name="driver"
                                >
                                  {driver?.vehicleId !== "Select Driver" &&
                                    getDriverName(lastDriver)}
                                </option>
                              </select>
                            </div> : (<div className="flex border-2 border-gray-400 outline-none rounded ml-6">
                              <select
                                className="outline-none"
                                value={driver}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setDriver(e.target.value);
                                }}
                              >
                                <option value={null}>
                                  {t("select_driver")}
                                </option>
                                {allDrivers.map((driver, index) => (
                                  <option
                                    key={driver.id}
                                    value={`${driver.vehicleId}-${driver.name}`}
                                    name="driver"
                                  >
                                    {driver?.vehicleId !== "Select Driver" &&
                                      driver?.name}
                                  </option>
                                ))}
                              </select>
                            </div>)}
                          </div>
                        )}
                    </div>
                    <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                      {singleOrder?.orderId && driver || lastDriver ? (
                        <button
                          className="rounded font-customGilroy outline-none text-center text-sm font-bold not-italic px-7 py-2"
                          onClick={handleSubmit}
                          style={{
                            backgroundColor:
                              countryConfig[userCountry].buttonColor,
                            color: countryConfig[userCountry].textColor,
                          }}
                        >
                          {t("assign_order")}
                        </button>
                      ) : (
                          <button
                            className="bg-gray-400 rounded font-customGilroy text-white outline-none text-center text-sm font-bold not-italic px-7 py-2"
                            style={{ cursor: "pointer" }}
                          >
                            {t("assign_order")}
                          </button>
                        )}
                      <button
                        className="bg-white border-2 border-gray-400 rounded font-customGilroy text-gray-500 text-center text-sm font-bold not-italic px-14 py-2"
                        onClick={() => setAssignModal(false)}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          <Transition.Root show={approval} as={Fragment}>
            <Dialog
              as="div"
              className="fixed z-10 inset-0 overflow-y-auto"
              onClose={setApproval}
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
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                  </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="modal-container inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                    <div className="flex flex-col justify-center items-center bg-white h-95">
                      <Checked />
                      <p className="approve-text">{`${
                        checkType === "reject"
                          ? "Order Rejected Successfully!"
                          : "Order Assigned Successfully!"
                        }`}</p>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </>
      );
    } else {
      return <div />;
    }
  };

  const datePlacedValue =
    orderStatus[0]?.datePlaced !== null &&
    orderStatus[0]?.datePlaced.split("T")[1].split(".")[0];
  const dateAssignedValue =
    orderStatus[0]?.dateAssigned &&
    orderStatus[0]?.dateAssigned.split("T")[1].split(".")[0];
  const dateDispatchedValue =
    orderStatus[0]?.dateDispatched &&
    orderStatus[0]?.dateDispatched.split("T")[1].split(".")[0];
  const dateAcceptedValue =
    orderStatus[0]?.dateAccepted &&
    orderStatus[0]?.dateAccepted.split("T")[1].split(".")[0];
  const dateDeliveredValue =
    orderStatus[0]?.dateDelivered &&
    orderStatus[0]?.dateDelivered.split("T")[1].split(".")[0];
  const dateRejectedValue =
    orderStatus[0]?.dateRejected !== null &&
    orderStatus[0]?.dateRejected.split("T")[1].split(".")[0];
  const dateCompletedValue =
    orderStatus[0]?.dateCompleted !== null &&
    orderStatus[0]?.dateCompleted.split("T")[1].split(".")[0];
  const tConvert = (time) => {
    // Check correct time format and split into components
    time = (time &&
      time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/)) || [
        time,
      ];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  };

  const time_remaining = (endtime, singleOrder) => {
    var t = Date.parse(endtime) - Date.parse(singleOrder?.datePlaced);
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  };
  const runClock = (endtime, singleOrder) => {
    let result;
    var t = time_remaining(endtime, singleOrder);
    if (t.total <= 0) {
      result = <p>{t("times_up")}!</p>;
    } else {
      result = (
        <div className="flex text-center">
          <p className="font-medium pl-2 pr-2">
            {`${t.minutes} Min ${t.seconds} Sec`}{" "}
          </p>
          <span className="">{t("left for to confirm this order")}</span>
        </div>
      );
    }

    return result;
  };

  const sum = (orders) => {
    return orders?.reduce((a, b) => parseFloat(a) + parseFloat(b.price), 0);
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="flex gap-4">
            <div onClick={() => history.goBack()}>
              <Return />
            </div>
            <h2 className="font-customRoboto text-black font-bold text-2xl">
              {`Order ${orderId}`}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 font-customGilroy text-sm font-medium not-italic mb-10">
          <p className="text-gray-400">{t("distributor")}</p> /
            <p className="text-gray-400">{distributor?.company_name}</p> /
            <p className="text-gray-400">{buyerDetails[0]?.buyerName}</p> /
            <p className="text-gray-400">{t("order_history")}</p> /
            <p className="text-grey-85">{orderId}</p>
        </div>
        <p className="font-customGilroy text-lg font-normal not-italic text-gray-400 mb-4">
          {`Placed ${moment(singleOrder?.datePlaced).format(
            "dddd, MMMM Do YYYY"
          )} at ${datePlacedValue} by`}
          <span className="text-grey-400"> {singleOrder?.routeName}</span>
        </p>

        <div>{!miniAdmin && displayCountDown()}</div>
        <div className="grid grid-rows-3 grid-flow-col gap-4 mb-14">
          <div className="col-span-7 row-span-3 h-distributor-overview bg-white rounded shadow-2xl">
            <p className="font-customGilroy text-lg not-italic font-bold text-grey-85 mt-8 px-6">
              {t("order_summary")}
            </p>
            <table className="min-w-full mt-8 divide-y divide-gray-200">
              <thead className="bg-transparent ">
                <tr className="">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                  ></th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-base font-medium text-red-main tracking-wider"
                  >
                    {t("unit_price")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-base font-medium text-red-main tracking-wider"
                  >
                    {t("amount")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white px-6 divide-y divide-gray-200">
                {orderItems &&
                  orderItems.map((orderData, index) => (
                    <tr key={index}>
                      <td className="px-10 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10">
                            <img
                              className="h-20 w-10 rounded-full"
                              src={
                                getProductDetails(orderData?.productId)
                                  ?.imageUrl
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-base my-1 font-semibold mb-3">
                              {getProductDetails(orderData?.productId)?.brand}{" "}
                              {getProductDetails(orderData?.productId)?.sku}
                            </div>

                            <div className="flex gap-2 items-center">
                              <div
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                style={{ backgroundColor: "#F49C00" }}
                              >
                                {
                                  getProductDetails(orderData?.productId)
                                    ?.productType
                                }
                              </div>
                              <p className="font-customGilroy text-sm font-medium not-italic text-grey-40">
                                Qty:{formatNumber(orderData.quantity)}
                              </p>
                            </div>
                            {orderData?.comboID &&
                              orderData?.comboID !== "-" && (
                                <div className="flex mt-2 gap-2 items-center">
                                  <div
                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                    style={{ backgroundColor: "green" }}
                                  >
                                    {t("combo")}:
                                    </div>
                                  <p className="font-customGilroy text-sm font-medium not-italic text-grey-40">
                                    {orderData?.comboID}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2 ">
                        <div className="font-normal text-base text-center w-20">
                          {formatPriceByCountrySymbol(
                            country,
                            orderData.price / orderData.quantity
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-2 inline-flex text-base leading-5 font-semibold rounded-full"
                          style={{ color: "#45130F" }}
                        >
                          {formatPriceByCountrySymbol(
                            country,
                            orderData.price
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="px-36 py-4 flex justify-between">
              <p className="text-lg font-semibold text-grey-85">
                 Empties Returned
              </p>
             
              <p
                className="text-base leading-5 font-semibold"
                style={{ color: "#45130F" }}
              >
                {
                   singleOrder.emptiesReturned
                }
              </p>
            </div>
            <div className="px-36 py-2 flex justify-between">
              <p className="text-lg font-semibold text-grey-85">
                {t("total")}
              </p>
              <p
                className="text-base leading-5 font-semibold"
                style={{ color: "#45130F" }}
              >
                {
                  formatPriceByCountrySymbol(country, singleOrder.totalPrice)
                }
              </p>
            </div>
          </div>
          <div
            className="col-span-2 h-small-modal bg-white rounded-lg font-customGilroy shadow-2xl px-8 py-6"
            style={{ height: "100%" }}
          >
            <p className=" not-italic font-bold text-lg text-grey-85 mb-10">
              {t("delivery_details")}
            </p>
            <p className="flex gap-4 text-grey-70 font-normal text-xs mb-4">
              {t("Delivery_Status")}
            </p>
            <div className="flex gap-2 text-grey-70 font-normal text-xs items-center">
              <Delivered />
              <p className="text-grey-100">
                {t("placed")}
                <span className="text-grey-40 ml-2">{`${t("placed")} ${moment(
                  singleOrder?.datePlaced
                ).format("dddd, MMMM Do YYYY")} at ${tConvert(
                  datePlacedValue
                )}`}</span>
              </p>
            </div>
            {orderStatus[0]?.dateAssigned !== null && (
              <>
                <div
                  className="h-4 ml-3"
                  style={{
                    borderLeft: "solid",
                    borderLeftColor: "grey",
                    borderLeftWidth: "2px",
                  }}
                />
                <div className="flex gap-2 text-grey-70 font-normal text-xs items-center">
                  <Delivered />
                  <p className="text-grey-100">
                    {t("assigned")}
                    <span className="text-grey-40 ml-2">
                      {`${t("assigned")} ${moment(
                        orderStatus[0]?.dateAssigned
                      ).format("dddd, MMMM Do YYYY")} at ${tConvert(
                        dateAssignedValue
                      )}`}
                    </span>
                  </p>
                </div>
              </>
            )}
            {orderStatus[0]?.dateAccepted !== null && (
              <>
                <div
                  className="h-4 ml-3"
                  style={{
                    borderLeft: "solid",
                    borderLeftColor: "grey",
                    borderLeftWidth: "2px",
                  }}
                />
                <div className="flex gap-2 text-grey-70 font-normal text-xs items-center">
                  <Delivered />
                  <p className="text-grey-100">
                    {t("accepted")}
                    <span className="text-grey-40 ml-2">
                      {`${t("accepted")} ${moment(
                        orderStatus[0]?.dateAccepted
                      ).format("dddd, MMMM Do YYYY")} at ${tConvert(
                        dateAcceptedValue
                      )}`}
                    </span>
                  </p>
                </div>
              </>
            )}
            {orderStatus[0]?.dateDispatched !== null && (
              <>
                <div
                  className="h-4 ml-3"
                  style={{
                    borderLeft: "solid",
                    borderLeftColor: "grey",
                    borderLeftWidth: "2px",
                  }}
                />
                <div className="flex gap-2 text-grey-70 font-normal text-xs items-center">
                  <Delivered />
                  <p className="text-grey-100">
                    {t("dispatched")}
                    <span className="text-grey-40 ml-2">
                      {`${t("dispatched")} ${moment(
                        orderStatus[0]?.dateDispatched
                      ).format("dddd, MMMM Do YYYY")} at ${tConvert(
                        dateDispatchedValue
                      )}`}
                    </span>
                  </p>
                </div>
              </>
            )}
            {orderStatus[0]?.dateDelivered !== null && (
              <>
                <div
                  className="h-4 ml-3"
                  style={{
                    borderLeft: "solid",
                    borderLeftColor: "grey",
                    borderLeftWidth: "2px",
                  }}
                />
                <div className="flex gap-2 text-grey-70 font-normal text-xs items-center">
                  <Delivered />
                  <p className="text-grey-100">
                    {t("delivered")}
                    <span className="text-grey-40 ml-2">
                      {`${t("delivered")} ${moment(
                        orderStatus[0]?.dateDelivered
                      ).format("dddd, MMMM Do YYYY")} at ${tConvert(
                        dateDeliveredValue
                      )}`}
                    </span>
                  </p>
                </div>
              </>
            )}
            {orderStatus[0]?.dateCompleted !== null && (
              <>
                <div
                  className="h-4 ml-3"
                  style={{
                    borderLeft: "solid",
                    borderLeftColor: "grey",
                    borderLeftWidth: "2px",
                  }}
                />
                <div className="flex gap-2 text-grey-70 font-normal text-xs items-center">
                  <Delivered />
                  <p className="text-grey-100">
                    {t("completed")}
                    <span className="text-grey-40 ml-2">
                      {`${t("completed")} ${moment(
                        orderStatus[0]?.dateCompleted
                      ).format("dddd, MMMM Do YYYY")} at ${tConvert(
                        dateCompletedValue
                      )}`}
                    </span>
                  </p>
                </div>
              </>
            )}
            {orderStatus[0]?.dateRejected !== null && (
              <>
                <div
                  className="h-4 ml-3"
                  style={{
                    borderLeft: "solid",
                    borderLeftColor: "grey",
                    borderLeftWidth: "2px",
                  }}
                />
                <div className="flex gap-2 px-1 text-grey-70 font-normal text-xs items-center">
                  <Rejected />
                  <p className="text-grey-100 pl-1">
                    {t("rejected")}
                    <span className="text-grey-40 ml-2">
                      {`${t("rejected")} ${moment(
                        orderStatus[0]?.dateRejected
                      ).format("dddd, MMMM Do YYYY")} at ${tConvert(
                        dateRejectedValue
                      )}`}
                    </span>
                  </p>
                </div>
              </>
            )}
            <p className="flex mt-5 gap-4 text-grey-70 font-normal text-sm mb-3">
              {t("delivery_history")}
            </p>
            <p className="flex gap-4 text-grey-100 font-normal text-xs mb-4">
              {`Order through ${singleOrder?.routeName}`}
            </p>
            {orderStatus[0]?.dateRejected && (
              <p className="flex gap-4 text-grey-100 font-bold text-sm mb-4">
                {t("Reason For Rejection")}:{" "}
                {orderStatus[0]?.reasonForRejection}
              </p>
            )}
          </div>
        </div>
      </div>
    </Dashboard>
  );
};


const mapStateToProps = (state) => {
  return {
    allProducts: state.PricingReducer.allProducts,
    buyerOrders: state.OrderReducer.buyer_orders[0],
    singleOrder: state.OrderReducer.order,
    allDrivers: state.OrderReducer.all_drivers,
  };
};

export default connect(mapStateToProps, {
  getSingleOrderByBuyerId,
  getAllProducts,
  getSingleOrder,
  updateOrderStatus,
  getAllDriversByOwnerId,
  updateMultipleOrders,
  assignOrdersToDrivers,
})(OrderSummary);
