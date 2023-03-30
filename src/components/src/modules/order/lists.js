import React, { Fragment, useEffect, useRef, useState, useCallback } from "react";
import moment from "moment";
import { Arrows, Return } from "../../assets/svg/adminIcons";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { findIndex, pullAt, flatten } from "lodash";
import noOrder from "../../assets/svg/noOrders.svg";
import { Dialog, Transition } from "@headlessui/react";
import Dashboard from "../../Layout/Dashboard";
import { MainOrdersList } from "../../utils/data";
import arrowDown from "../../assets/svg/arrowDown.svg";
import Approval from "../../assets/svg/approval.svg";
import Pagination from "../Admin/components/pagination";
import countryConfig from "../../utils/changesConfig.json";
import { getLocation } from "../../utils/getUserLocation";
import { CloseModal, UploadFile, Checked } from "../../assets/svg/modalIcons";
import SortImg from "../../assets/svg/sort.svg";
import {
  Previouspage,
  Progination,
  Redirect,
} from "../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom" 
import  { connect, useDispatch, useSelector } from "react-redux";
import {
	getAllDriversByOwnerId,
	assignOrdersToDrivers,
	pickUpOrders,
	updateOrderStatus,
	updateMultipleOrders,
} from "../Admin/order/actions/orderAction";
import {
  getSingleDistributor,
  getAllDistributor,
} from "../Admin/pages/actions/adminDistributorAction";
import { formatPriceByCountrySymbol } from "../../utils/formatPrice";
import { getAllCustomers } from "../Admin/customer/actions/customer";
import {
	updateQuantityAfterAction,
	getAllInventory,
} from "../Inventory/actions/inventoryProductAction";
import { loadVanData, assignToVan } from "../VanInventory/actions/vanAction";
import { orderNet } from "../../utils/urls";
const Orders = ({
	location,
	distributor,
	getAllInventory,
	allInventory,
	getAllDriversByOwnerId,
	updateMultipleOrders,
	updateQuantityAfterAction,
	allDrivers,
	assignOrdersToDrivers,
	getSingleDistributor,
	// getAllOrdersByDistributor,
	pickUpOrders,
	orders,
	capture,
}) => {
	const { t } = useTranslation()
	let PageSize = 10;
	const dispatch = useDispatch();
	const [currentPage, setCurrentPage] = useState(1);
	const [driver, setDriver] = useState("");
	const [deliveryMode, setDeliveryMode] = useState(null);
	const [orderLength, setOrderLength] = useState(0)
	const { distCode } = useParams();
	const AuthData = useSelector(state => state.Auth.sessionUserData);
	const country = AuthData?.country;
	const [userCountry, setUserCountry] = useState("Ghana");
	const history = useHistory();
	const [selectItems, setSelectItems] = useState([]);
	const [distOrders, setDistOrders] = useState([]);
	const [loading, setLoading] = useState(false)
	const [loader, setLoader] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState([]);
	const [approvalModal, setApprovalModal] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [completedModal, setCompletedModal] = useState(false);
	const [orderData, setOrderData] = useState("Placed");
	const cancelButtonRef = useRef(null);
	const allCustomers = useSelector(
		(state) => state.CustomerReducer.all_customers
	);

	useEffect(async () => {

		const loc = await getLocation();
		dispatch(getAllCustomers(country));
		setUserCountry(loc);
	}, [userCountry]);

	const selectedItem = (item) => {
		if (selectItems?.includes(item)) {
			setSelectItems(
				selectItems.filter((value) => {
					return value !== item;
				})
			);
		} else {
			setSelectItems([...selectItems, item]); // or push
		}
	};

	const selectOrder = (item) => {
		const index = findIndex(selectedOrder, { orderId: item.orderId });
		if (selectedOrder?.includes(item)) {
			pullAt(selectedOrder, [index]);
		} else {
			selectedOrder.push(item);
			setSelectedOrder(selectedOrder);
		}
	};

	const displayDateByFilter = (order, orderData) => {
		let assigned = order?.orderStatus !== null && moment(order?.orderStatus[0]?.dateAssigned).format("YYYY-MM-DD");
		let delivered = order?.orderStatus !== null && moment(order?.orderStatus[0]?.dateDelivered).format("YYYY-MM-DD");
		let accepted = order?.orderStatus !== null && moment(order?.orderStatus[0]?.dateAccepted).format("YYYY-MM-DD");
		let dispatched = order?.orderStatus !== null && moment(order?.orderStatus[0]?.dateDispatched).format("YYYY-MM-DD");
		let completed = order?.orderStatus !== null && moment(order?.orderStatus[0]?.dateCompleted).format("YYYY-MM-DD");
		let rejected = order?.orderStatus !== null && moment(order?.orderStatus[0]?.dateRejected).format("YYYY-MM-DD")
		let date = order?.orderStatus !== null && moment(order?.orderStatus[0]?.datePlaced).format("YYYY-MM-DD")
		switch (orderData) {
			case "Placed":
				date = date
				break;
			case "Accepted":
				date = accepted
				break;
			case "Assigned":
				date = assigned
				break;
			case "Dispatched":
				date = dispatched
				break;
			case "Delivered":
				date = delivered
				break;
			case "Completed":
				date = completed
				break;
			case "Rejected":
				date = rejected
				break;
			default:
				date = date
				break;
		}
		return date
	}

	const generateCustomerDetail = (buyerCompanyId) => {
		const x = allCustomers.find((buyer) => {
			if (buyer.SF_Code === buyerCompanyId) {
				return buyer;
			}
		});
		return x;
	};

	const getDriverName = (vehicleId) => {
		const driversName = allDrivers.filter(
			(driver) => driver?.vehicleId === +vehicleId,
			10
		)[0];
		return driversName;
	};

	const fetchOrders = async(id) => {
		setLoading(true)
		const orderApi = orderNet();
		const response = await orderApi.get(
      `GetOrder/GetOrderBySellerCompanyId/${id}?pageNumber=${currentPage}&orderStatus=${orderData}&pageSize=${PageSize}&routeName=SalesForce,ShopDC,Sap,Walk-In-Sales`
		);
		if(response.data.order) {
			setDistOrders(response.data.order)
			setOrderLength(response.data.totalOrders)
			setLoading(false)
		}
	}

	useEffect(() => {
		const waitOrders = async () => {
			getAllInventory(distCode);
			await getSingleDistributor(distCode);
			getAllDriversByOwnerId(distCode);			
			if(distributor?.SYS_Code) {
				fetchOrders(distributor?.SYS_Code)
			}
		};
		waitOrders();
	}, [distributor?.SYS_Code, currentPage, country, orderData]);

	const handleReset = () => {
		setConfirmModal(false);
		setApprovalModal(false);
		setCompletedModal(false);
	};
	const handleSubmit = async (event) => {
		let orders = [];
		const values = {
			assignedToId: driver.split("-")[0], // fetch recent drivers
			orderId: selectItems,
		};

		selectedOrder.map((value) => {
			value.orderItems.map((item) => {
				orders.push({
					quantity: item.quantity,
					productId: item.productId,
					route: value.routeName,
				});
			});
		});

		const valuesToUpdate = {
			companyCode: distCode,
			vehicleId: parseInt(driver.split("-")[0], 10),
			stocks: orders,
		};
		event.preventDefault();
		setLoader(true);
		await assignOrdersToDrivers(values).then(() => {
			setConfirmModal(false);
			dispatch(assignToVan(valuesToUpdate));
			setTimeout(() => {
				setApprovalModal(true);
				fetchOrders(distributor?.SYS_Code);
				window.location.reload();
			}, 2000);
		});
	};



	const handleUpdate = async (status) => {
		setLoader(true);
		const values = {
			status: status,
			orderId: selectItems,
		};
		await updateMultipleOrders(values).then(() => {
			setTimeout(() => {
				setLoader(false);
				fetchOrders(distributor?.SYS_Code);
				window.location.reload();
			}, 1000);
		});
	};

	const dispactchUpdate = () => {
		let result;
		switch (orderData) {
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
		switch (orderData) {
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
				result = <p>{t("deliver_order")}</p>;
				break;
			default:
				if (loader === true) {
					return (result = <p>{t("accepting")}</p>);
				}
				result = <p>{t("accept_order")}</p>;
				break;
		}
		return result;
	};


	const acceptPickUp = async (order) => {
		const values = {
			orderId: [order?.orderId],
		};
		let orderItems = [];
		order?.orderItems.filter((singleOrder) => {
			return orderItems.push({
				productId: parseInt(singleOrder?.productId, 10),
				quantity: singleOrder.quantity,
			});
		});
		const afterSalesPayload = {
			sellerCompanyId: distributor?.DIST_Code,
			orderItems: orderItems,
		};
		await pickUpOrders(values).then((message) => {
			setTimeout(() => {
				setCompletedModal(true);
				updateQuantityAfterAction(afterSalesPayload);
				fetchOrders(distributor?.SYS_Code);
				// window.location.reload();
			}, 3000);
		});
	};

	const selectDeliveryMode = (order) => {
		let result;
		const pickUp = (
			<button
				disabled={miniAdmin}
				onClick={() => acceptPickUp(order)}
				className="p-1"
				style={{
					backgroundColor: countryConfig[userCountry].buttonColor,
					color: countryConfig[userCountry].textColor,
					borderRadius: "4px",
				}}
			>
				{" "}
				{t("pick_up")}
			</button>
		);
		const selectField = (
			<select
				className="outline-none p-1"
				key={driver.split("-")[1]}
				id="drivers"
				onChange={(e) => {
					setDriver(e.target.value);
				}}
			>
				{allDrivers.length > 0 ? (
					<>
						<option value="driver">{t("assign_driver")}</option>
						{allDrivers.map((driverD, index) => (
							// <div key={driverD.vehicleId}>
								<option
									disabled={miniAdmin}
									key={driverD.vehicleId}
									value={`${driverD.vehicleId}-${driverD.name}`}
								>
									{driver.status !== 0 && driverD.name !== "Select Driver" && driverD.name}
							</option>
							// </div>
						))}
					</>
				) : (
						<option value="driver">{t("no_driver")}</option>
					)}
			</select>
		);

		switch (order.routeName) {
			case "ShopDC":
				switch (order.deliveryType) {
					case "Pick-Up":
						result = pickUp;
						break;
					case "Van-Delivery":
						if (allDrivers.length === 0) {
							return (result = <p>{t("van")}</p>);
						}
						result = selectField;
						break;
					default:
						result = (
							<>
								{allDrivers.length === 0 ? <p>{t("van")}</p> : selectField}
								<p className="text-center my-2">{t("or")}</p>
								{pickUp}{" "}
							</>
						);
						break;
				}

				break;
			case "SalesForce":
				result = selectField;
				break;
			case "Walk-In-Sales":
				result = selectField;
				break;
			case "SAP":
				result = selectField;
				break;
			default:
				result = (
					<>
						<p className="text-center my-2">N/A</p>
					</>
				);
				break;
		}
		return result;
	};
	const miniAdmin = AuthData.roles === "Mini-Admin";

  const handlePush = (sellerId, orderId, buyerId) => {
    history.push(`/dashboard/order-summary/${sellerId}/${orderId}/${buyerId}`);
  };

  const search = (filterInput, filterTBody) => {
    let input, filter, ul, li, a, i;
    input = document.getElementById(filterInput);
    filter = input.value.toUpperCase();
    ul = document.getElementById(filterTBody);
    li = ul.getElementsByTagName("tr");
    for (i = 0; i < li.length; i++) {
      if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
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
							{t("orders")}
						</p>
					</div>
					<div className="flex gap-16 items-center">
						<div className="flex justify-end gap-4 pr-3">
							{allDrivers.length > 0 ? (
								<div
									onClick={() => setConfirmModal(true)}
									className={`${
										selectItems.length > 0 && driver && !miniAdmin
											? "h-12 px-8 py-3 font-bold w-56 rounded text-center"
											: "h-12 px-8 py-3 font-bold w-56 rounded text-center"
										}`}
									style={{
										cursor: "pointer",
										backgroundColor:
											selectItems.length > 0 && driver && !miniAdmin
												? countryConfig[userCountry].buttonColor
												: "#D1D5DB",
										color:
											selectItems.length > 0 && driver && !miniAdmin
												? countryConfig[userCountry].textColor
												: "#9CA3AF",
									}}
								>
									{t("assign_order")}
								</div>
							) : country !== "Nigeria" ||
								orderData === "Completed" ||
								orderData === "Delivered" ||
								orderData === "Rejected" ? (
										<div />
									) : (
										<button
											disabled={selectItems.length === 0 || miniAdmin || loader}
											onClick={() => dispactchUpdate()}
											className={`${
												selectItems.length > 0 && !miniAdmin && !loader
													? "h-12 px-8 py-3 font-bold w-56 rounded text-center"
													: "h-12 px-8 py-3 font-bold w-56 rounded text-center"
												}`}
											style={{
												cursor: "pointer",
												backgroundColor:
													selectItems.length > 0 && !miniAdmin && !loader
														? countryConfig[userCountry].buttonColor
														: "#D1D5DB",
												color:
													selectItems.length > 0 && !miniAdmin && !loader
														? countryConfig[userCountry].textColor
														: "#9CA3AF",
											}}
										>
											{dispactchUpdateText()}
										</button>
									)}
							{/* <Progination /> 1/88 */}
						</div>
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
								style={{ width: "400px", backgroundColor: "#E5E5E5" }}
								// onChange={(e) => setOrderData(e.target.value)}
								onKeyUp={() =>
									search("search", "filter")
								}
								placeholder="Order number, Customer name, Route name, Driver"
							/>
							<div className="flex pt-1">
								<div
									className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block  bg-white border-default-b border-2"
									onClick={(e) => {
										setOrderData("");
									}}
									style={{
										background: `${
											orderData === ""
												? countryConfig[userCountry].buttonColor
												: "white"
											}`,
										color: `${
											orderData === ""
												? countryConfig[userCountry].textColor
												: "gray"
											}`,
									}}
								>
									<p className="text-sm font-normal">{t("all_orders")}</p>{" "}
								</div>
								<div
									className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
									onClick={(e) => {
										setOrderData("Placed");
									}}
									style={{
										background: `${
											orderData === "Placed"
												? countryConfig[userCountry].buttonColor
												: "white"
											}`,
										color: `${
											orderData === "Placed"
												? countryConfig[userCountry].textColor
												: "gray"
											}`,
									}}
								>
									<p className="text-sm font-normal">{t("open_orders")}</p>{" "}
								</div>
								<div
									className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
									onClick={(e) => {
										setOrderData("Assigned");
									}}
									style={{
										background: `${
											orderData === "Assigned"
												? countryConfig[userCountry].buttonColor
												: "white"
											}`,
										color: `${
											orderData === "Assigned"
												? countryConfig[userCountry].textColor
												: "gray"
											}`,
									}}
								>
									<p className="text-sm font-normal">{t("assigned_orders")}</p>{" "}
								</div>
								{country !== "Nigeria" ? (
									<div />
								) : (
										<>
											<div
												className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
												onClick={(e) => {
													setOrderData("Accepted");
												}}
												style={{
													background: `${
														orderData === "Accepted"
															? countryConfig[userCountry].buttonColor
															: "white"
														}`,
													color: `${
														orderData === "Accepted"
															? countryConfig[userCountry].textColor
															: "gray"
														}`,
												}}
											>
												<p className="text-sm font-normal">
													{t("accepted_orders")}
												</p>{" "}
											</div>
											<div
												className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
												onClick={(e) => {
													setOrderData("Dispatched");
												}}
												style={{
													background: `${
														orderData === "Dispatched"
															? countryConfig[userCountry].buttonColor
															: "white"
														}`,
													color: `${
														orderData === "Dispatched"
															? countryConfig[userCountry].textColor
															: "gray"
														}`,
												}}
											>
												<p className="text-sm font-normal">
													{t("dispatched_orders")}
												</p>{" "}
											</div>
											<div
												className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
												onClick={(e) => {
													setOrderData("Delivered");
												}}
												style={{
													background: `${
														orderData === "Delivered"
															? countryConfig[userCountry].buttonColor
															: "white"
														}`,
													color: `${
														orderData === "Delivered"
															? countryConfig[userCountry].textColor
															: "gray"
														}`,
												}}
											>
												<p className="text-sm font-normal">
													{t("delivered_orders")}
												</p>{" "}
											</div>
										</>
									)}
								<div
									className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
									onClick={(e) => {
										setOrderData("Completed");
									}}
									style={{
										background: `${
											orderData === "Completed"
												? countryConfig[userCountry].buttonColor
												: "white"
											}`,
										color: `${
											orderData === "Completed"
												? countryConfig[userCountry].textColor
												: "gray"
											}`,
									}}
								>
									<p className="text-sm font-normal">{t("completed_orders")}</p>{" "}
								</div>
								<div
									className="flex text-center cursor-pointer font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
									onClick={(e) => {
										setOrderData("Rejected");
									}}
									style={{
										background: `${
											orderData === "Rejected"
												? countryConfig[userCountry].buttonColor
												: "white"
											}`,
										color: `${
											orderData === "Rejected"
												? countryConfig[userCountry].textColor
												: "gray"
											}`,
									}}
								>
									<p className="text-sm font-normal">{t("rejected_orders")}</p>{" "}
								</div>
							</div>
						</div>
						<table className="min-w-full mt-8 divide-y divide-gray-200">
							<thead className="bg-transparent font-customGilroy text-sm text-grey-100 tracking-widest">
								<tr className="">
									<th className="pl-8 py-3 text-gray-400 font-medium text-center align-middle">
										<div />
									</th>
									<th className="pl-8 py-3 text-gray-400 font-medium text-center align-middle">
										S/N
                  </th>
									<th className="py-3 text-center align-middle">
										{t("order_number")}
									</th>
									<th className="py-3 text-center align-middle">
										{t("customer_name")}
									</th>
									<th className="py-3 text-center align-middle">
										{t("products")}
									</th>
									<th className="py-3 text-center align-middle">
										{t("route_name")}
									</th>
									<th className="py-3 text-center align-middle">
										{t("route_type")}
									</th>
									{country === "Ghana" && (
										<th className="py-3 text-center align-middle">
											{t("route_schedule")}
										</th>
									)}
									<th className="py-3 text-center align-middle">
										{t("agent_name")}
									</th>
									<th className="py-3 text-center align-middle">
										{t("delivery")}
									</th>
									<th className="py-3 text-center align-middle">{t("date")}</th>
									<th className="py-3 text-center align-middle">
										{t("amount")}
									</th>
								</tr>
							</thead>
							<tbody
								id="filter"
								className="bg-white px-6 divide-y divide-gray-200"
							>
								{distOrders.length === 0 ? (
									<tr className="my-8 justify-center">
										<td colSpan={9}>
											<img className="m-auto" src={noOrder} />
											{loading ? <p className="my-8 flex justify-center">Loading...</p> : <p className="my-8 flex justify-center">No Data Found!!</p>}
										</td>
									</tr>
								) :(
									distOrders &&
									distOrders.map((order, index) => (
											<>
												<tr key={order?.orderId} className="cursor-pointer">
													{miniAdmin ? (
														<td />
													) : (
															<td className="font-customGilroy text-sm font-medium text-center align-middle pl-8 py-6">
																{order?.status === "Completed" ||
																	order?.status === "Delivered" ||
																	order?.status === "Assigned" ||
																	order.deliveryType === "Pick-Up" ? (
																		<div />
																	) : (
																		<input
																			onClick={() => {
																				selectedItem(order?.orderId);
																				selectOrder(order);
																			}}
																			type="checkbox"
																			id="todo"
																			disabled={
																				order?.status === "Completed" ||
																					order?.status === "Assigned"
																					? true
																					: false
																			}
																			name={order?.orderId}
																			value="todo"
																		/>
																	)}
															</td>
														)}
													<td className="font-customGilroy text-sm font-medium text-center align-middle pl-8 py-6">
														{index + 1 + "."}
													</td>
													<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
														{order?.orderId}
													</td>
													<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
														{order?.buyerDetails !== null && order?.buyerDetails !== [] && order?.buyerDetails[0]?.buyerName}
													</td>
													<td
														onClick={() =>
															handlePush(
																distCode,
																order?.orderId,
																order?.buyerCompanyId
															)
														}
														style={{
															color: "rgb(177, 31, 36)",
															cursor: "pointer",
														}}
														className="font-customGilroy text-sm font-medium text-center mr-3 align-middle"
													>
														{order?.orderItems !== null && order?.orderItems?.length ? order?.orderItems?.length : 0 }
													</td>
													<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
														{order?.routeName}
													</td>
													{order?.routeName === "ShopDC" ? (
														<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
															N/A
														</td>
													) : (
															<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
																{order?.specificRouteName === "undefined" || order?.specificRouteName === null ||
																	order.routeName === "Walk-In-Sales"
																	? "N/A"
																	: order?.specificRouteName}
															</td>
														)}
													{country === "Ghana" && (
														<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
															{generateCustomerDetail(order?.buyerCompanyId)
																?.route_schedule === "undefined" || generateCustomerDetail(order?.buyerCompanyId)
																?.route_schedule === null
																? "N/A"
																: generateCustomerDetail(order?.buyerCompanyId)
																	?.route_schedule}
														</td>
													)}
													{order?.routeName === "ShopDC" ? (
														<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
															N/A
														</td>
													) : (
															<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
																{order?.agent === "undefined" || order?.agent === null ||
																	order.routeName === "Walk-In-Sales"
																	? "N/A"
																	: order?.agent}
															</td>
														)}
													<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
														{order.status === "Completed" ||
															order.status === "Delivered" ||
															order.status === "Assigned" ? (
																getDriverName(order?.vehicleId)?.name ? (
																	getDriverName(order?.vehicleId)?.name
																) : (
																		order?.vehicleId
																	)
															) : (
																<div className="flex flex-col align-middle">
																	{selectDeliveryMode(order)}
																</div>
															)}
													</td>
													<td className="font-customGilroy text-sm font-medium text-center align-middle py-6">
														{displayDateByFilter(order, orderData)}
													</td>
													<td className="font-customGilroy text-sm font-medium text-center align-middle">
														{formatPriceByCountrySymbol(
															country,
															order?.totalPrice
														)}
													</td>
												</tr>
											</>
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
				<Transition.Root show={approvalModal} as={Fragment}>
					<Dialog
						as="div"
						className="fixed z-10 inset-0 overflow-y-auto"
						// initialFocus={cancelButtonRef}
						onClose={() => setApprovalModal(false)}
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
										onClick={handleReset}
									/>
									<div className="h-mini-modal py-4 px-8 justify-center items-center">
										<img src={Approval} className="m-auto py-4" />
										<p
											style={{
												fontSize: 16,
												fontWeight: "normal",
												color: "black",
											}}
											className="mb-6 text-center"
										>{`${selectItems.length} Orders has been assigned to ${
											driver && driver.split("-")[1]
											}`}</p>
									</div>
									<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
										<button
											className="bg-red-main rounded font-customGilroy text-white outline-none text-center text-sm font-bold not-italic px-7 py-2"
											style={{
												backgroundColor: countryConfig[userCountry].buttonColor,
												color: countryConfig[userCountry].textColor,
											}}
											onClick={() => setApprovalModal(false)}
										>
											{t("okay")}
										</button>
										<div />
									</div>
								</div>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>
				<Transition.Root show={completedModal} as={Fragment}>
					<Dialog
						as="div"
						className="fixed z-10 inset-0 overflow-y-auto"
						// initialFocus={cancelButtonRef}
						onClose={() => setCompletedModal(false)}
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
										onClick={handleReset}
									/>
									<div className="h-mini-modal py-4 px-8 justify-center items-center">
										<img src={Approval} className="m-auto py-4" />
										<p
											style={{
												fontSize: 16,
												fontWeight: "normal",
												color: "black",
											}}
											className="mb-6 text-center"
										>
											{t("Your Order(s) has been Successfully Completed")}
										</p>
									</div>
								</div>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>
				<Transition.Root show={confirmModal} as={Fragment}>
					<Dialog
						as="div"
						className="fixed z-10 inset-0 overflow-y-auto"
						initialFocus={cancelButtonRef}
						onClose={() => setConfirmModal(false)}
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
										onClick={handleReset}
									/>
									<div className="h-mini-modal py-4 px-8 justify-left">
										<p
											style={{
												fontSize: 30,
												fontWeight: "normal",
												color: "black",
											}}
											className="mb-6"
										>{`Assign ${selectItems.length} Order(s)`}</p>

										{driver ? (
											<p
												style={{ fontSize: 16 }}
												className="font-customGilroy not-italic text-base font-medium"
											>
												{`This will assign ${
													selectItems.length
													} order to driver with ${
													driver && driver.split("-")[1]
													}`}
											</p>
										) : (
												<div className="flex">
													<p
														style={{ fontSize: 16 }}
														className="font-customGilroy py-3 not-italic text-base font-medium"
													>
														{t("Please select a driver")}
													</p>
													<div className="flex border-2 border-gray-400 outline-none rounded ml-6">
														<select
															className="outline-none"
															value={driver}
															onChange={(e) => {
																e.preventDefault();
																setDriver(e.target.value);
															}}
														>
															<option value={null}>{t("select_driver")}</option>
															{allDrivers.map((driver, index) => (
																<option
																	key={driver.vehicleId}
																	value={`${driver.vehicleId}-${driver.name}`}
																	name="driver"
																>
																	{driver.name !== "Select Driver" && driver.name}
																</option>
															))}
														</select>
													</div>
												</div>
											)}
									</div>
									<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
										{selectItems.length > 0 && driver ? (
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
											onClick={handleReset}
										>
											{t("cancel")}
										</button>
									</div>
								</div>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>
			</div>
		</Dashboard>
	);
};

const mapStateToProps = (state) => {
	return {
		distributor: state.AllDistributorReducer.distributor,
		allDistributors: state.AllDistributorReducer.all_distributors,
		orders: state.OrderReducer.all_orders,
		allDrivers: state.OrderReducer.all_drivers,
		allInventory: state.InventoryReducer.all_inventory,
	};
};

export default connect(mapStateToProps, {
	getAllDistributor,
	getAllInventory,
	updateQuantityAfterAction,
	getSingleDistributor,
	getAllDriversByOwnerId,
	assignOrdersToDrivers,
	pickUpOrders,
	updateOrderStatus,
	updateMultipleOrders,
})(Orders);
