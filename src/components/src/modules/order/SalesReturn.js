import React, { Fragment, useEffect, useRef, useState } from "react";
import moment from "moment";
import { Arrows, Return } from "../../assets/svg/adminIcons";
import { Link } from "react-router-dom";
import noOrder from "../../assets/svg/noOrders.svg";
import { Dialog, Transition } from "@headlessui/react";
import Dashboard from "../../Layout/Dashboard";
import { MainOrdersList } from "../../utils/data";
import arrowDown from "../../assets/svg/arrowDown.svg";
import Approval from "../../assets/svg/approval.svg";
import { CloseModal, UploadFile, Checked } from "../../assets/svg/modalIcons";
import SortImg from "../../assets/svg/sort.svg";
import {
  Previouspage,
  Progination,
  Redirect,
} from "../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom" 
import  { connect, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  getAllOrdersByDistributor,
  getAllDriversByOwnerId,
  assignOrdersToDrivers,
} from "../Admin/order/actions/orderAction";
import {
  getSingleDistributor,
  getAllDistributor,
} from "../Admin/pages/actions/adminDistributorAction";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { getAllCustomers } from "../Admin/customer/actions/customer";
import { useTranslation } from "react-i18next";
import Pagination from "../Admin/components/pagination";

const Orders = ({
  location,
  distributor,
  getAllDriversByOwnerId,
  orderLength,
  allDistributorsCustomer,
  assignOrdersToDrivers,
  getAllDistributor,
  getAllCustomers,
  getSingleDistributor,
  getAllOrdersByDistributor,
  orders,
}) => {
  let routeType = "Walk-In-Sales,One-Off";
  let orderData = ""
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const { Dist_Code } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  let PageSize = 10;
  const [selectItems, setSelectItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalModal, setApprovalModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [driver, setDriver] = useState(null);
  const cancelButtonRef = useRef(null);
  const [search, setSearch] = useState("");
  const lowercasedSearchFilter = search.toLowerCase();
const getOrders = () => {

  const sortOrder = orders.filter((data) => {
    return (
      data?.orderId.toString().startsWith(`${search}`)
    );
  });

  const sorted = sortOrder.sort(
    (a, b) => new Date(b.datePlaced) - new Date(a.datePlaced)
  );
  return sorted;
}

  const fetchBuyerDetails = (order) => {
    const buyer = allDistributorsCustomer.filter(
      (customer) => {
        return customer?.SF_Code === order.buyerCompanyId
      }
    );
    return order?.buyerDetails !== null && order?.buyerDetails[0]?.buyerName
      ? order?.buyerDetails[0]?.buyerName
      : buyer[0]?.CUST_Name;
  };


  useEffect(() => {
    const waitOrders = async () => {
      await getSingleDistributor(Dist_Code);
      getAllDistributor(country);
      getAllCustomers(country);
      getAllDriversByOwnerId(Dist_Code);
      getAllOrdersByDistributor(distributor?.SYS_Code, currentPage, orderData, PageSize, routeType, false);
    }
    waitOrders();
  }, [country, distributor?.SYS_Code, currentPage, "Walk-In-Sales", "One-Off" , orderData]);

  // const selectedItem = (item) => {
  //   if (selectItems?.includes(item)) {
  //     setSelectItems(
  //       selectItems.filter((value) => {
  //         return value !== item;
  //       })
  //     );
  //   } else {
  //     setSelectItems([...selectItems, item]); // or push
  //   }
  // };

  // const handleReset = () => {
  //   setConfirmModal(false);
  //   setApprovalModal(false);
  // };

  // const handleSubmit = async (event) => {
  //   const values = {
  //     assignedToId: driver.split("-")[0],
  //     orderId: selectItems,
  //   };
  //   event.preventDefault();
  //   setLoader(true);
  //   await assignOrdersToDrivers(values).then(() => {
  //     setConfirmModal(false);
  //     setTimeout(() => {
  //       setApprovalModal(true);
  //     }, 4000);
  //   });
  // };

  const handlePush = (sellerId, orderId, buyerId) => {
    history.push(
      `/dashboard/sales-return-summary/${sellerId}/${orderId}/${buyerId}`
    );
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link to={`/dashboard/transactions/${Dist_Code}`}>
              <Return />
            </Link>
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("sales_return")}
            </p>
          </div>
        </div>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div className="flex mt-3 px-4">
              <input
                className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                id="search"
                type="text"
                name="search"
                style={{ width: "27.5rem", backgroundColor: "#E5E5E5" }}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search_with_order_number")}
              />
            </div>
            <table className="min-w-full mt-8 divide-y divide-gray-200">
              <thead className="bg-transparent font-customGilroy text-sm text-grey-100 tracking-widest">
                <tr className="">
                  {/* <th className="pl-8 py-3 text-gray-400 font-medium text-left align-middle">
                    <div />
                  </th> */}
                  <th className="pl-8 py-3 text-gray-400 font-medium text-left align-middle">
                    S/N
                  </th>
                  <th className="py-3 text-left align-middle">
                    {t("order")} <br />
                    {t("number")}
                  </th>
                  <th className="py-3 text-left align-middle">{t("date")}</th>
                  <th className="py-3 text-left align-middle">{t("customer_name")}</th>
                  <th className="py-3 text-left align-middle">{t("route_name")}</th>
                  {/* <th className="py-3 text-left align-middle">Warehouse</th> */}
                  <th className="py-3 text-left align-middle">{t("products")}</th>
                  <th className="py-3 text-left align-middle">{t("amount")}</th>
                </tr>
              </thead>
              <tbody className="bg-white px-6 divide-y divide-gray-200">
                {!getOrders() ? (
                  <tr className="my-8 justify-center">
                    <td colSpan={9}>
                      <img className="m-auto" src={noOrder} />
                    </td>
                  </tr>
                ) : (
                  orders && 
                  getOrders().map((order, index) => (
                    <tr key={order?.orderId} className="cursor-pointer">
                      {/* <td className="font-customGilroy text-sm font-medium text-left align-middle pl-8 py-6">
                        <input
                          onClick={() => selectedItem(order?.orderId)}
                          type="checkbox"
                          id="todo"
                          name={order?.orderId}
                          value="todo"
                        />
                      </td> */}
                      <td className="font-customGilroy text-sm font-medium text-left align-middle pl-8 py-6">
                        {index + 1 + "."}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {order?.orderId}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {moment(order?.datePlaced).format("MMMM Do YYYY")}
                      </td>
                      <td
                        onClick={() =>
                          handlePush(
                            Dist_Code,
                            order?.orderId,
                            order?.buyerCompanyId
                          )
                        }
                        className="font-customGilroy text-sm font-medium text-left align-middle py-6"
                        style={{ color: "rgb(177, 31, 36)" }}
                      >
                        {fetchBuyerDetails(order)}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                        {order?.routeName}
                      </td>

                      {/* <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                      Munshi mega warehouse
                    </td> */}
                      <td className="font-customGilroy text-sm font-medium text-left mr-3 align-middle">
                        {order?.orderItems !== null && order?.orderItems.length ? order?.orderItems.length : 0}
                      </td>
                      <td className="font-customGilroy text-sm font-medium text-left align-middle">
                        {formatPriceByCountrySymbol(
                          country,
                          order?.totalPrice
                        ) === undefined
                          ? t("unavailable")
                          : formatPriceByCountrySymbol(
                              country,
                              order?.totalPrice
                            )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <hr />
            <div className="flex justify-end items-center gap-4 mr-20 mt-6">
							<Pagination
								className="pagination-bar"
								currentPage={currentPage}
								totalCount={orderLength}
								pageSize={PageSize}
								onPageChange={(page) => setCurrentPage(page)}
							/>
						</div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

const mapStateToProps = (state) => {
  return {
    distributor: state.AllDistributorReducer.distributor,
    allDistributors: state.AllDistributorReducer.all_distributors,
    orders: state.OrderReducer.all_orders,
    orderLength: state.OrderReducer.totalOrdersCount,
    allDrivers: state.OrderReducer.all_drivers,
    allDistributorsCustomer: state.CustomerReducer.all_customers,
  };
};

export default connect(mapStateToProps, {
  getAllDistributor,
  getSingleDistributor,
  getAllDriversByOwnerId,
  assignOrdersToDrivers,
  getAllOrdersByDistributor,
  getAllCustomers,
})(Orders);
