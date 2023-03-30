import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import moment from "moment";
import { Arrows, Return } from "../../../assets/svg/adminIcons";
import Dashboard from "../../../Layout/Admin/Dashboard";
import { OrdersList, OrderSummaryData } from "../../../utils/data";
import { ReactComponent as Delivered } from "../../../assets/svg/bar.svg";
import {
  getSingleOrder,
  setLoadingToDefault,
} from "./actions/orderAction";
import { getAllProducts } from "../Pricing/actions/AdminPricingAction";
import { formatPriceByCountrySymbol } from "../../../utils/formatPrice";
import { filter } from "lodash";
import LoadingList from "../../../components/common/LoadingList";
import { useTranslation } from "react-i18next";

const OrderSummary = ({ location }) => {
  const { t } = useTranslation();
  const { buyerCode, orderId } = useParams();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;

  const history = useHistory();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.OrderReducer.loading);
  useEffect(() => {
    // getsingleOrderByBuyerId(buyerCode);
    dispatch(setLoadingToDefault());
     dispatch(setLoadingToDefault());
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
    dispatch(getSingleOrder(orderId));
  }, []);

  const singleOrder = useSelector((state) => state.OrderReducer.order);

  if (Object.keys(singleOrder).length === 0) {
    dispatch(getSingleOrder(orderId));
  }

  const allProducts = useSelector((state) => state.PricingReducer.allProducts);

  const getProductDetails = (productId) => {
    let thisProduct = filter(allProducts, { productId: productId })[0];
    if (!thisProduct) {
      thisProduct = filter(allProducts, { id: parseInt(productId) })[0];
    }
    return thisProduct;
  };
  const getProductDetailsArray = (productId) => {
    return (
      singleOrder.length &&
      singleOrder?.orderItems.filter((product) => product.productId)
    );
  };

  const sum = (orders) => {
    return orders?.reduce((a, b) => parseFloat(a) + parseFloat(b.price), 0);
  };

  return (
    <Dashboard>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="flex gap-4">
            {/* <Link to={`/distributor/orders/${singleOrder?.sellerCompanyId}`}> */}
            <Return onClick={() => history.goBack()} />
            {/* </Link> */}
            <h2 className="font-customRoboto text-black font-bold text-2xl">
              {`Order ${orderId}`}
            </h2>
          </div>
          <div className="flex justify-end items-center gap-4">
            <Arrows />
            1/500
          </div>
        </div>
        {!loading && Object.keys(singleOrder).length ? (
          <>
            <div className="flex items-center gap-2 font-customGilroy text-sm font-medium not-italic mb-10">
              <p className="text-gray-400">Buyer</p> /
              {/* <p className="text-gray-400">KMS Nigeria Limited</p> / */}
              <p className="text-gray-400">
                {singleOrder?.buyerDetails[0]?.buyerName}
              </p>{" "}
              /<p className="text-gray-400">Order History</p> /
              <p className="text-grey-85">{orderId}</p>
            </div>
            <p className="font-customGilroy text-lg font-normal not-italic text-gray-400 mb-4">
              {`Placed ${moment(singleOrder?.datePlaced).format(
                "dddd, MMMM Do YYYY"
              )} at ${moment(singleOrder?.datePlaced).format("h:mm:ss a")} by`}
              <span className="text-grey-400"> {singleOrder?.routeName}</span>
            </p>
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
                    {singleOrder?.orderItems?.map((orderData) => (
                      <tr key={orderData.id}>
                        <td className="px-10 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10">
                              <img
                                className="h-20 w-10 rounded-full"
                                src={
                                  getProductDetails(orderData.productId)
                                    ?.imageUrl
                                }
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-base my-1 font-semibold mb-3">
                                {getProductDetails(orderData.productId)?.brand}{" "}
                                {getProductDetails(orderData.productId)?.sku}
                              </div>
                              <div className="flex gap-2 items-center">
                                <div
                                  className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                  style={{ backgroundColor: "#F49C00" }}
                                >
                                  {
                                    getProductDetails(orderData.productId)
                                      ?.productType
                                  }
                                </div>
                                <p className="font-customGilroy text-sm font-medium not-italic text-grey-40">
                                  {t("qty")}:{orderData.quantity}
                                </p>
                              </div>
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
                    {t("total")}
                  </p>
                  <p
                    className="text-base leading-5 font-semibold"
                    style={{ color: "#45130F" }}
                  >
                    {formatPriceByCountrySymbol(
                      country,
                      singleOrder?.totalPrice
                      // sum(
                      //   getProductDetailsArray(
                      //     singleOrder?.orderItems[0]?.productId
                      //   )
                      // )
                    )}
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
                  {t("delivery_status")}
                </p>
                <div className="flex gap-2 text-grey-70 font-normal text-xs items-center">
                  <Delivered />
                  <p className="text-grey-100">
                    {t("placed")}
                    <span className="text-grey-40 ml-2">{`Placed ${moment(
                      singleOrder?.orderStatus[0]?.datePlaced
                    ).format("dddd, MMMM Do YYYY")} at ${moment(
                      singleOrder?.orderStatus[0].datePlaced
                    ).format("h:mm:ss a")}`}</span>
                  </p>
                </div>
                {singleOrder?.orderStatus[0]?.dateAssigned !== null &&
                  singleOrder?.orderStatus[0]?.dateCompleted !== null && (
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
                              singleOrder?.orderStatus[0]?.dateAssigned
                            ).format("dddd, MMMM Do YYYY")} at ${moment(
                              singleOrder?.orderStatus[0]?.dateAssigned
                            ).format("h:mm:ss a")}`}
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                {singleOrder?.orderStatus[0]?.dateCompleted !== null && (
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
                            singleOrder?.orderStatus[0]?.dateCompleted
                          ).format("dddd, MMMM Do YYYY")} at ${moment(
                            singleOrder?.orderStatus[0]?.dateCompleted
                          ).format("h:mm:ss a")}`}
                        </span>
                      </p>
                    </div>
                  </>
                )}
                <p className="flex mt-5 gap-4 text-grey-70 font-normal text-sm mb-3">
                  {t("delivery_history")}
                </p>
                <p className="flex gap-4 text-grey-100 font-normal text-xs mb-4">
                  {`${t("order_through")} ${singleOrder?.routeName}`}
                </p>
              </div>
            </div>{" "}
          </>
        ) : (
          <LoadingList />
        )}
      </div>
    </Dashboard>
  );
};

export default OrderSummary;
