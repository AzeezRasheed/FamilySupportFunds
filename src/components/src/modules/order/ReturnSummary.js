import React, { Fragment, useEffect, useRef, useState } from "react";
import moment from "moment";
import { filter } from "lodash";
import Loading from "../../components/common/Loading";
import { Arrows, Return } from "../../assets/svg/adminIcons";
import { Link } from "react-router-dom";
import noOrder from "../../assets/svg/noOrders.svg";
import { Dialog, Transition } from "@headlessui/react";
import Dashboard from "../../Layout/Dashboard";
import { MainOrdersList } from "../../utils/data";
import arrowDown from "../../assets/svg/arrowDown.svg";
import Approval from "../../assets/svg/approval.svg";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { CloseModal, UploadFile, Checked } from "../../assets/svg/modalIcons";
import SortImg from "../../assets/svg/sort.svg";
import countryConfig from '../../utils/changesConfig.json'
import { getLocation } from '../../utils/getUserLocation'
import {
  Previouspage,
  Progination,
  Redirect,
} from "../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom" 
import  { connect, useSelector } from "react-redux";
import {
  getAllDriversByOwnerId,
  assignOrdersToDrivers,
  getSingleOrder,
  reset,
  updateOrderItems,
} from "../Admin/order/actions/orderAction";
import { returnSalesAction } from "../Inventory/actions/inventoryProductAction";
import {
  getSingleDistributor,
  getAllDistributor,
} from "../Admin/pages/actions/adminDistributorAction";
import { getAllProductsNonAbi } from "../Admin/Pricing/actions/AdminPricingAction";
import { useParams } from "react-router";
import { t } from "i18next";

const Orders = ({
  location,
  distributor,
  getAllDriversByOwnerId,
  allDrivers,
  assignOrdersToDrivers,
  getAllDistributor,
  getSingleDistributor,
  updateOrderItems,
  getSingleOrder,
  loadingState,
  singleOrderState,
  getAllProductsNonAbi,
  allProducts,
  reset,
  returnSalesAction,
  returnobj,
}) => {
  const { sellerId, orderId } = useParams();
  // const orderId = location.pathname.split("/").at(4);
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  useEffect(() => {
    getAllDistributor(country);
    getSingleDistributor(sellerId);
    getAllDriversByOwnerId(sellerId);
    getSingleOrder(orderId)
    getAllProductsNonAbi(country === "South Africa" ? "SA" : country);
  }, [country]);

  const [userCountry, setUserCountry] = useState('Ghana');


  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry])

  useEffect(() => {
    if (returnobj?.returnStatus?.status === true) {
      setWarningModal(false);
      setSuccessModal(true);
    }
  }, [returnobj?.returnStatus]);

  const history = useHistory();
  const miniAdmin = AuthData.roles === "Mini-Admin";

  const [openOrders, seOpenOrders] = useState([]);
  const cancelButtonRef = useRef(null);
  const [counter, setCounter] = useState({});

  const [search, setSearch] = useState("");
  // const [productData, setPoductData] = useState('')

  const [successModal, setSuccessModal] = useState(false);
  const [returnOrderItemsLoader, setReturnOrderItemsLoader] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [returnEmpty, setReturnEmpty] = useState(0);

  const getProductDetails = (productId) => {    
    let thisProduct = filter(allProducts, { productId: productId })[0];
    if (!thisProduct) {
      thisProduct = filter(allProducts, { id: parseInt(productId) })[0];
    }
    return thisProduct;
  };

  const formatPrice = (price, symbol = "₦") => {
    return `${symbol}${Number(price)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
    // .toFixed(2)
  };

  const addDefaultPriceEmpty = (country) => {
    let amount = 1000;
    switch (country) {
      case "Nigeria":
        amount = amount;
        break;
      case "Uganda":
        amount = 22000;
        break;
      case 'Ghana':
        amount = 40
        break;
      case 'South Africa':
        amount = 100
        break;
      case 'Tanzania':
        amount = 11000
        break;
      default:
        amount = amount;
        break;
    }
    return amount;
  };

  const handlePush = () => {
    reset();

    history.push(`/dashboard/sales-return/${sellerId}`);
  };


  const incrementCounter = (productId, stock) => {
    const quantity = parseInt(counter[productId] ?? 0) + 1;
    if (quantity <= stock) {
      setCounter({ ...counter, [productId]: quantity });
      // setTooltip(true)
    }
  };

  const decrementCounter = (productId, qty) => {
    if (counter[productId] && counter[productId] > 0) {
      setCounter({ ...counter, [productId]: parseInt(counter[productId]) - 1 });
    }
  };

  const sumAmount = (productId, price) => {
    return parseInt(counter[productId] || 0) * price;
  };
  const handleChange = (e, productId, stock) => {
    const quantity = Math.min(Number(e.target.value), Number(stock));
    setCounter({
      ...counter,
      [e.target.name]: parseInt(quantity),
    });
  };

  const decrementEmpty = () => {
    if (returnEmpty > 0) {
      setReturnEmpty(returnEmpty - 1);
    }
  };

  const incrementEmpty = (qty) => {
    const quantity = parseInt(returnEmpty ?? 0) + 1;
    if (Number(quantity) <= Number(qty)) {
      setReturnEmpty(quantity);
    }
  };

  const handleChangeEmpty = (e, qty) => {
    const quantity = Math.min(Number(e.target.value), Number(qty));
    setReturnEmpty(quantity);
  };

  const onSubmit = async () => {
    const selectedProductIds = Object.keys(counter);
    const orderItems = singleOrderState?.orderItems
      ?.filter(
        ({ productId }) =>
          counter[productId] &&
          selectedProductIds?.includes(productId?.toString())
      )
      ?.map((item) => {
        console.log(item, 'item');
        
        return {
          productId: Number(item?.productId),
          // price: (item?.product?.price) * counter[item?.productId],
          quantity: counter[item?.productId],
          orderItemsId: item?.orderItemsId,
          // SFlineID: "a0s1w000009xs0RAAQ"
        }
      });

      
      const payload = {
        orderItems,
        empties: returnEmpty,
        companyCode: sellerId,
      };
      console.log(payload, '----payload');
    setReturnOrderItemsLoader(true);
    await updateOrderItems(payload);
    await returnSalesAction(payload);
    history.goBack();
    setReturnOrderItemsLoader(false);
    setWarningModal(false);
  };

  const handleReset = () => {
    onSubmit();
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div className="cursor-pointer" onClick={() => history.goBack()}>
              <Return />
            </div>
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("sales_return_for_order")} {orderId}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            {!miniAdmin && <div className="flex justify-end gap-4 pr-3">
              {counter && <div
                onClick={() => setWarningModal(true)}
                // onClick={onSubmit}
                className="h-12 px-8 py-3 font-bold w-56 rounded text-center"
                style={{ background: countryConfig[country].buttonColor, color: countryConfig[country].textColor, cursor: "pointer" }}
              >
                {t("confirm")}
              </div>}
            </div>}
          </div>
        </div>
        {/* <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
            <p className="font-normal text-gray-400">Distributor</p>
            /
            <p className="font-medium text-grey-100">KMS Nigeria Limited</p>
          </div> */}
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div
              style={{
                marginLeft: 32,
                marginTop: 24,
                fontWeight: 700,
                fontSize: 18,
                lineHeight: "24px",
                color: "#50525B",
              }}
            >
              {t("order_summary")}
            </div>
            <div className="flex mt-3 px-4">
              {/* <input
                className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                id="search"
                type="text"
                name="search"
                style={{ width: "27.5rem", backgroundColor: "#E5E5E5" }}
                onChange={(e) => setSearch(e.target.value)}
                placeholder=" Search for a product"
              /> */}
            </div>
            <table className="min-w-full mt-8 divide-y divide-gray-200">
              <thead className="bg-transparent font-customGilroy text-sm text-grey-100 tracking-widest">
                <tr className="">
                  {/* <th className="pl-8 py-3 text-gray-400 font-medium text-left align-middle">
                    <div />
                  </th> */}
                  {/* <th className="pl-8 py-3 text-gray-400 font-medium text-left align-middle">
                    S/N
                  </th> */}
                  <th className="py-3 text-left align-middle pl-8">
                    {t("product")}
                  </th>
                  <th className="py-3 text-left align-middle">
                    {t("unit_price")}
                  </th>
                  <th className="py-3 text-left align-middle">
                    {" "}
                    {t("amount")}
                  </th>
                  <th className="py-3 text-left align-middle">
                    {t("quantity_to_return")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white px-6 divide-y divide-gray-200">
                {loadingState ? (
                  <tr className="my-8 justify-center">
                    <td colSpan={9}>
                      <center
                        className=" flex justify-center items-center mx-auto flex-col"
                        style={{ marginTop: 20, marginBottom: 20 }}
                      >
                        <Loading /> <Loading /> <Loading />
                      </center>
                    </td>
                  </tr>
                ) : singleOrderState?.orderItems?.length === 0 ? (
                  <tr className="my-8 justify-center">
                    <td colSpan={9}>
                      <img className="m-auto" src={noOrder} />
                    </td>
                  </tr>
                ) : (
                      singleOrderState?.orderItems?.map((order, index) => (
                        <>
                          <tr className="cursor-pointer">
                            {/* <td className="font-customGilroy text-sm font-medium text-left align-middle pl-8 py-6">
                          <input
                            onClick={() => selectedItem(order?.orderId)}
                            type="checkbox"
                            id="todo"
                            name={order?.orderId}
                            value="todo"
                          />
                        </td> */}
                            {/* <td key={order?.orderId} className="font-customGilroy text-sm font-medium text-left align-middle pl-8 py-6">
                                {index + 1 + "."}
                              </td> */}
                            <td className="font-customGilroy text-sm font-medium text-left align-middle py-6 pl-8">
                              {/* <img
                                  className="h-20 w-10 rounded-full"
                                  src={getProductDetails(order?.productId)?.imageUrl}
                                  alt=""
                                />

                                <div className="text-sm font-medium text-gray-900">
                                  {getProductDetails(order?.productId)?.brand}  {getProductDetails(order?.productId)?.sku}
                                </div> */}
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-20 w-10">
                                  <img
                                    className="h-20 w-10 rounded-full"
                                    src={getProductDetails(order?.productId)?.imageUrl}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {getProductDetails(order?.productId)?.brand}  {getProductDetails(order?.productId)?.sku}
                                  </div>
                                  <div className="flex">
                                    <div
                                      className="px-2 mt-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                      style={{
                                        backgroundColor: '#F49C00',
                                      }}
                                    >
                                      <span className='capitalize'>{getProductDetails(order?.productId)?.productType}</span>
                                    </div>
                                    <p className="mt-3 ml-4" >
                                      <span style={{ color: "#9799A0" }}>Qty:</span> {order?.quantity}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                              {formatPriceByCountrySymbol(country, order?.price / order?.quantity)}
                            </td>
                            <td
                              // onClick={() =>
                              //   handlePush(order?.sellerCompanyId, order?.orderId, order?.buyerCompanyId)
                              // }
                              className="font-customGilroy text-sm font-medium text-left align-middle py-6"

                            >
                              {formatPriceByCountrySymbol(country, order?.price)}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                              <div className="flex relative">
                                <div style={{ position: 'absolute', top: '-25px', left: 20, fontSize: 12, color: 'rgba(177, 31, 36, var(--tw-bg-opacity))' }}>{(Number(order?.quantity) > Number(counter[order?.productId])) && `Max  possible return is ${order?.quantity}`}

                                </div>
                                <button
                                  disabled={miniAdmin}

                                  className="h-8 w-8 mr-2 counter" onClick={() => decrementCounter(order?.productId, order?.quantity)} style={{
                                    opacity: `${counter[order?.productId] === 0 ? '0.3' : '1'}`, backgroundColor: countryConfig[userCountry].textColor,
                                  }}>
                                  <p className="couter-text" style={{ color: countryConfig[userCountry].inverseColor2 }} >-</p>
                                </button>

                                <input
                                  readOnly={miniAdmin}
                                  type="number"
                                  min={1}
                                  max={order?.quantity}
                                  id="quantity-input"
                                  value={counter[order?.productId] ?? 0}
                                  name={order?.productId}
                                  onChange={(e) => handleChange(e, order?.productId, order?.quantity)}
                                  className="border-defaut bg-red font-normal text-sm rounded-md text-center border-2 w-20 h-8 pl-2"

                                />

                                <button
                                  disabled={miniAdmin}
                                  className="h-8 w-9 ml-2 counter" onClick={() => incrementCounter(order?.productId, order?.quantity)
                                  } style={{ opacity: `${counter[order?.productId] === order?.quantity ? '0.3' : '1'}`, backgroundColor: countryConfig[userCountry].textColor, }}>
                                  <p className="couter-text" style={{ color: countryConfig[userCountry].inverseColor2 }} >+</p>
                                </button>
                              </div>

                            </td>
                          </tr>
                        </>
                      ))
                    )}

                <tr>
                  <td className="py-6 pl-12">
                    <div className="flex ">
                      <div className="flex-col">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            lineHeight: "16px",
                          }}
                        >
                          {t("empties")}
                        </span>
                        <p className="">
                          <span style={{ color: "#9799A0" }}>{t("qty")}: </span>{" "}
                          {singleOrderState?.emptiesReturned}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {formatPriceByCountrySymbol(
                      country,
                      addDefaultPriceEmpty(country)
                    )}
                  </td>
                  <td>
                    {formatPriceByCountrySymbol(
                      country,
                      singleOrderState?.emptiesReturned *
                      addDefaultPriceEmpty(country)
                    )}
                  </td>
                  <td>
                    <div className="flex relative">
                      <div
                        style={{
                          position: "absolute",
                          top: "-25px",
                          left: 20,
                          fontSize: 12,
                          color: "rgba(177, 31, 36, var(--tw-bg-opacity))",
                        }}
                      >
                        {Number(singleOrderState?.emptiesReturned) >
                          Number(returnEmpty) &&
                          `${t("Max  possible return is")} ${
                          singleOrderState?.emptiesReturned
                          }`}
                      </div>
                      <button
                        disabled={miniAdmin}
                        className="h-8 w-8 mr-2 counter"
                        onClick={() =>
                          decrementEmpty(singleOrderState?.emptiesReturned)
                        }
                        style={{ opacity: `${returnEmpty == 0 ? "0.3" : "1"}` }}
                      >
                        <p className="couter-text ">-</p>
                      </button>

                      <input
                        readOnly={miniAdmin}
                        type="number"
                        min={1}
                        max={singleOrderState?.emptiesReturned}
                        id="quantity-input"
                        value={returnEmpty}
                        // name={singleOrderState?.orderId}
                        onChange={(e) =>
                          handleChangeEmpty(
                            e,
                            singleOrderState?.emptiesReturned
                          )
                        }
                        className="border-defaut bg-red font-normal text-sm rounded-md text-center border-2 w-20 h-8 pl-2"
                      />

                      <button
                        disabled={miniAdmin}
                        className="h-8 w-9 ml-2 counter"
                        onClick={() =>
                          incrementEmpty(singleOrderState?.emptiesReturned)
                        }
                        style={{
                          opacity: `${
                            returnEmpty == singleOrderState?.emptiesReturned
                              ? "0.3"
                              : "1"
                            }`,
                        }}
                      >
                        <p className="couter-text">+</p>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
          </div>
        </div>
      </div>
      <Transition.Root show={successModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setSuccessModal}
        >
          <div
            className="flex items-end justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0 min-h-screen"
            style={{ height: 100 }}
          >
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
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                <button
                  className="flex justify-center ml-auto m-4 mb-0"
                  onClick={() => setSuccessModal(false)}
                >
                  <CloseModal />
                </button>
                <div
                  className="flex flex-col justify-center items-center w-modal h-sub-modal -mt-12"
                  style={{ width: 600, height: 300 }}
                >
                  <Checked />
                  <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                    {t(
                      "Your changes have been saved, and your inventory updated"
                    )}
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    onClick={() => setSuccessModal(false)}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={warningModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setWarningModal}
        >
          <div
            className="flex items-end justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0 min-h-screen"
            style={{ height: 100 }}
          >
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
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                <button
                  className="flex justify-center ml-auto m-4 mb-0"
                  onClick={() => setWarningModal(false)}
                >
                  <CloseModal />
                </button>
                <div
                  className="flex flex-col justify-center items-center w-modal h-sub-modal -mt-12"
                  style={{ width: 700, height: 200 }}
                >
                  {/* <Checked /> */}
                  <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                    {t(
                      "Are you sure you want to make these changes to this order?"
                    )}
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className=" rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    onClick={onSubmit}
                    style={{
                      color: countryConfig[userCountry].textColor,
                      backgroundColor: countryConfig[userCountry].buttonColor
                    }}
                  >
                    {returnobj.loadingReturnStatus || returnOrderItemsLoader
                      ? `${t("loading")}...`
                      : t("yes")}
                  </button>
                  <button
                    className=" bg-gray-400 rounded font-customGilroy text-white outline-none text-center text-sm font-bold not-italic px-7 py-2"
                    onClick={() => setWarningModal(false)}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Dashboard>
  );
};

const mapStateToProps = (state) => {
  
  return {
    distributor: state.AllDistributorReducer.distributor,
    allDistributors: state.AllDistributorReducer.all_distributors,
    allDrivers: state.OrderReducer.all_drivers,
    loadingState: state.OrderReducer.loadingsales,
    singleOrderState: state.OrderReducer.order,
    allProducts: state.PricingReducer.allProductsNonAbi,
    returnobj: state.InventoryReducer,
  };
};

export default connect(mapStateToProps, {
  getAllDistributor,
  getSingleDistributor,
  getAllDriversByOwnerId,
  assignOrdersToDrivers,
  getSingleOrder,
  getAllProductsNonAbi,
  reset,
  returnSalesAction,
  updateOrderItems,
})(Orders);
