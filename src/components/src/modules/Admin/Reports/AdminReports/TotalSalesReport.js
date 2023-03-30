import React, { useState, useEffect, Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import CalendarIcon from "../../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom";
import {
	getAllDrivers,
	getAllOrders,
	getAllOrdersByDateRange,
	getCountryOrdersByDateRange,
	setLoadingToDefault,
} from "../../order/actions/orderAction";
import getStoredState from "redux-persist/es/getStoredState";
import { distributorNet, orderNet } from "../../../../utils/urls";
import { filter, uniqBy, flatten, orderBy, sortedUniqBy } from "lodash";
import { getAllDistributors } from "../../KPO/actions/UsersAction";
import moment from "moment";
import { formatNumber } from "../../../../utils/formatNumber";
import Calendar from "../../../../components/common/Calendar";
import { showCalendar } from "../actions/ReportAction";
import Arrowdown from "../../../../assets/svg/arrowDown.svg";
import { CSVLink } from "react-csv";
import { formatPriceByCountrySymbol } from "../../../../utils/formatPrice";
import { getAllProducts } from "../../Pricing/actions/AdminPricingAction";
import { countryCode } from "../../../../utils/countryCode";
import { getAllCustomers } from "../../customer/actions/customer";
import { getHectoliter } from "../../../../utils/getHectoLitres";
import Pagination from "../../components/pagination";
import LoadingList from "../../../../components/common/LoadingList";
import { useTranslation } from "react-i18next";
import { Dialog, Transition } from "@headlessui/react";
import { Checked, CloseModal, Error } from "../../../../assets/svg/modalIcons";
import Loading from "../../../../components/common/Loading";
import jwt from "jsonwebtoken";

const TotalSalesReport = ({ location, distributor }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();
	const startDay = moment(
		new Date(new Date().getFullYear(), new Date().getMonth(), 1),
	).format("YYYY-MM-DD");
	const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
	const [customDate, setCustomDate] = useState("");
	const [startRange, setStartRange] = useState(startDay + " 00:00:00");
	const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
	const [grandTotal, SetGrandTotal] = useState(0);
	const [approvalModal, setApprovalModal] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [successModal, setSuccessModal] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const [save, setSave] = useState("Yes, send email");
	const [calendarText, setCalendarText] = useState("This Month");
	const AuthData = useSelector((state) => state.Auth.sessionUserData);
	const country = AuthData?.country;
	const errorMsg = useRef("");
	let PageSize = 20;
	const [currentPage, setCurrentPage] = useState(1);
	const cancelButtonRef = useRef(null);

	const { REACT_APP_JWT_SECRET } = process.env;

	const allSystemOrders = useSelector(
		(state) => state.OrderReducer.all_orders_by_date,
	);

	// const { order } = allSystemOrders;

	const handleReset = () => {
		setApprovalModal(false);
		setErrorModal(false);
		setSuccessModal(false);
	};

	const loading = useSelector((state) => state.OrderReducer.loading);

	useEffect(() => {
		dispatch(getAllDistributors(country));
		dispatch(getAllCustomers(country));
		dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
		dispatch(getAllDrivers());
	}, []);

	const selectedDayRange = useSelector(
		(state) => state.ReportReducer.selected_day_range,
	);

	const allDistributors = useSelector(
		(state) => state.AllUsersReducer.allDistributors,
	);
	const allProducts = useSelector((state) => state.PricingReducer.allProducts);

	const allCustomers = useSelector(
		(state) => state.CustomerReducer.all_customers,
	);

	const allDrivers = useSelector(
		(state) => state.OrderReducer.all_system_drivers,
	);

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
						selectedDayRange?.to?.day,
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
			getCountryOrdersByDateRange(startRange, stopRange, countryCode(country), "summary"),
		);
	}, [startRange, stopRange]);

	// console.log(allSystemOrders.length);

	//if (!allSystemOrders.length) {

	// const allCountryOrders = filter(allSystemOrders, {
	//   country: countryCode(country),
	// });

	// let completedOrders = filter(allSystemOrders, function (order) {
	//   return (
	//     (order.routeName === "Walk-In-Sales" && order.status === "Completed") ||
	//     (order.routeName === "One-Off" && order.status === "Completed") ||
	//     (order.routeName === "Van-Sales" && order.status === "Completed") ||
	//     (order.routeName === "SalesForce" && order.status === "Completed")
	//   );
	// });
	// completedOrders = orderBy(completedOrders, "orderId", "desc");
	const uniqueCompletedOrders = uniqBy(
		allSystemOrders?.orders,
		"sellerCompanyId",
	);

	const backButton = () => {
		// history.push("/admin-dashboard/reports");
		history.goBack();
	};

	const getDistTotalAmount = (code) => {
		const thisDistOrders = filter(allSystemOrders?.orders, {
			sellerCompanyId: code,
		});
		const totalSales = thisDistOrders.reduce(
			(a, b) => parseFloat(a) + parseFloat(b.price),
			0,
		);
		return totalSales;
	};

	const handlePush = (code) => {
		history.push(`/distributor/reports/${code}`);
	};

	const currentTableData = () => {
		const firstPageIndex = (currentPage - 1) * PageSize;
		const lastPageIndex = firstPageIndex + PageSize;
		return (
			uniqueCompletedOrders &&
			uniqueCompletedOrders.slice(firstPageIndex, lastPageIndex)
		);
	};

	useEffect(() => {
		currentTableData();
	}, [currentPage]);

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
	const downloadReport = () => {
		setDownloading(true);
		const encrypted_email = jwt.sign(
			{ email: AuthData.email },
			process.env.REACT_APP_JWT_SECRET,
			{
				expiresIn: "15m",
			},
		);

		const orderApi = orderNet();
		orderApi
			.get(
				`GetOrder/GetDataForReport/${countryCode(
					country,
				)}/${startRange}/${stopRange}/${encrypted_email}`,
			)
			.then((response) => {
				const link = document.createElement("a");
				link.href = response.data.order;
				link.click();
				setDownloading(false);
				setApprovalModal(false);
				setSuccessModal(true);
			})
			.catch((error) => {
				console.log(error.response);
				const { response } = error;
				if (
					response.data &&
					response.data.message === "Date range exceeds limit"
				) {
					errorMsg.current =
						"Sorry, you cannot generate report for more than two weeks interval";
				}
				setErrorModal(true);
				setApprovalModal(false);
				setDownloading(false);
			});
	};

	// useEffect(() => {
	//   const totalSales = completedOrders.reduce(
	//     (a, b) => parseFloat(a) + parseFloat(b.price),
	//     0
	//   );
	//   SetGrandTotal(
	//     formatPriceByCountrySymbol(country, totalSales).toLocaleString(
	//       // or use String(totalSales).replace(/(.)(?=(\d{3})+$)/g,'$1,')
	//       undefined // leave undefined to use the visitor's browser
	//       // locale or a string like 'en-US' to override it.
	//       // { minimumFractionDigits: 2 }
	//     )
	//   );
	// }, [completedOrders]);

	// const getData = (orderItems) => {
	//   //total sales csv
	//   let dd = [];

	//   orderItems?.map((data) => {
	//     country === "Uganda"
	//       ? dd.push({
	//           Syspro_Code: getDistributorName(data.sellerCompanyId)?.SYS_Code,
	//           DB_Name: getDistributorName(data.sellerCompanyId)?.company_name,
	//           Order_ID: data?.orderId,
	//           Route_Name: data?.routeName,
	//           Route_Type: data?.specificRouteName,
	//           "SF Transaction No": data?.transactionNo,
	//           Agent_Name: data?.agent,
	//           Vehicle_ID: data?.vehicleId,
	//           Status: data?.status,
	//           ReasonForRejection: data?.reasonForRejection,
	//           Buyer_Name: data?.buyerName,
	//           Buyer_Type:
	//             getCustomerDetails(data.buyerCompanyId)?.CUST_Type === "Reseller"
	//               ? "Stockist"
	//               : "Outlet",
	//           Buyer_ID: data.buyerCompanyId,
	//           "Channel/Customer Type": getCustomerDetails(data.buyerCompanyId)
	//             ?.CUST_Type,
	//           BDR_Name: getCustomerDetails(data.buyerCompanyId)?.bdr,
	//           Price: data?.price,
	//           "Quantity/Cases": data?.quantity,
	//           Hectolitres: getHectoliter(
	//             getProductDetails(data.productId)?.productId,
	//             data?.quantity
	//           ),
	//           Product_Code: getProductDetails(data.productId)?.productId,
	//           Drs: getDistributorName(data.sellerCompanyId)?.DD_Name,
	//           Product_SKU: getProductDetails(data.productId)?.sku,
	//           Product_Name: getProductDetails(data.productId)?.brand,
	//           District: getCustomerDetails(data.buyerCompanyId)?.district,
	//           Region: getCustomerDetails(data.buyerCompanyId)?.region,
	//           Driver_Name: getDriverDetails(data.vehicleId)?.name,
	//           Date_Placed: moment(data.datePlaced).format(
	//             "YYYY-MM-DD, h:mm:ss a"
	//           ),
	//           Date_Accepted:
	//             data.routeName === "SalesForce"
	//               ? moment(data?.dateAccepted).format("YYYY-MM-DD, h:mm:ss a")
	//               : moment(data.datePlaced).format("YYYY-MM-DD, h:mm:ss a"),
	//           Date_Completed:
	//             data.routeName === "SalesForce"
	//               ? moment(data?.dateCompleted).format("YYYY-MM-DD, h:mm:ss a")
	//               : moment(data.datePlaced).format("YYYY-MM-DD, h:mm:ss a"),
	//         })
	//       : dd.push({
	//           Syspro_Code: getDistributorName(data.sellerCompanyId)?.SYS_Code,
	//           DB_Name: getDistributorName(data.sellerCompanyId)?.company_name,
	//           Order_ID: data?.orderId,
	//           Route_Name: data?.routeName,
	//           Route_Type: data?.specificRouteName,
	//           "SF Transaction No":
	//             data?.transactionNo !== undefined || data?.transactionNo !== ""
	//               ? data?.transactionNo
	//               : "",
	//           Agent_Name: data?.agent,
	//           Vehicle_ID: data?.vehicleId,
	//           Status: data?.status,
	//           ReasonForRejection: data?.reasonForRejection,
	//           Buyer_Name: data?.buyerName,
	//           Buyer_Type: getCustomerDetails(data.buyerCompanyId)?.CUST_Type,
	//           Buyer_ID: data.buyerCompanyId,
	//           BDR_Name: getCustomerDetails(data.buyerCompanyId)?.bdr,
	//           Price: data?.price,
	//           "Quantity/Cases": data?.quantity,
	//           Hectolitres: getHectoliter(
	//             getProductDetails(data.productId)?.productId,
	//             data?.quantity
	//           ),
	//           Product_Code: getProductDetails(data.productId)?.productId,
	//           Drs: "",
	//           Product_SKU: getProductDetails(data.productId)?.sku,
	//           Product_Name: getProductDetails(data.productId)?.brand,
	//           District: getCustomerDetails(data.buyerCompanyId)?.district,
	//           Driver_Name: getDriverDetails(data.vehicleId)?.name,
	//           Date_Placed: moment(data.datePlaced).format(
	//             "YYYY-MM-DD, h:mm:ss a"
	//           ),
	//           Date_Accepted:
	//             data.routeName === "SalesForce"
	//               ? moment(data?.dateAccepted).format("YYYY-MM-DD, h:mm:ss a")
	//               : moment(data.datePlaced).format("YYYY-MM-DD, h:mm:ss a"),
	//           Date_Completed:
	//             data.routeName === "SalesForce"
	//               ? moment(data?.dateCompleted).format("YYYY-MM-DD, h:mm:ss a")
	//               : moment(data.datePlaced).format("YYYY-MM-DD, h:mm:ss a"),
	//         });
	//   });

	//   return dd;
	// };

	// console.log(getData(completedOrders && completedOrders));

	return (
		<Dashboard location={location}>
			<div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10">
				<div className="flex justify-between items-center">
					<div className="flex gap-4">
						<Previouspage onClick={backButton} style={{ cursor: "pointer" }} />
						<p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
							{t("total_sales")}
						</p>
					</div>
					<div className="flex gap-16 items-center">
						{/* <CSVLink
              data={getData(allSystemOrders && allSystemOrders)}
              filename={"dms_allOrders_report.csv"}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} />
                <p className="report-download">
                  {t("download_all_orders_report")}
                </p>
              </div>
            </CSVLink> */}
					</div>
					<div className="flex gap-16 items-center">
						{/* <CSVLink
              data={getData(completedOrders && completedOrders)}
              filename={"dms_sales_report.csv"}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} />
                <p className="report-download">
                  {t("download_completed_orders_report")}
                </p>
              </div>
            </CSVLink> */}
						<div className="flex justify-end gap-4 pr-3">
							{downloading && <Loading />}
							<img src={Download} alt="download_completed order report" />
							<p
								className="report-download"
								style={{ cursor: "pointer" }}
								onClick={() => downloadReport()}
							>
								Generate Report
							</p>
						</div>
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
							{t("total_amount")}:
							{allSystemOrders?.totalPrice
								? formatPriceByCountrySymbol(
										country,
										allSystemOrders?.totalPrice,
								  )
								: "0"}
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
							<p className="text-sm text-center" style={{ color: "green" }}>
								This is a summary of the last 1,000 orders. To view report of
								all orders, please click on Generate Report.
							</p>
							<table className="min-w-full mt-3 divide-y divide-gray-200">
								<thead className="bg-transparent ">
									<tr className="">
										<th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
											S/N
										</th>
										{/* <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                Date
              </th> */}
										<th className="px-10 py-3 text-left text-xs font-medium text-black align-middle">
											{t("distributor_name")}
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
											{/* <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {moment(order.datePlaced).format("DD/MM/YYYY")}
                </td> */}
											<td
												onClick={() => handlePush(order.sellerCompanyId)}
												className="text-left align-middle cursor-pointer"
											>
												<p className="font-customGilroy pl-8 text-sm text-red-900 font-medium">
													{
														getDistributorName(order.sellerCompanyId)
															?.company_name
													}
												</p>
											</td>
											<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
												{formatPriceByCountrySymbol(
													country,
													parseInt(getDistTotalAmount(order.sellerCompanyId)),
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<hr />
							<div className="flex justify-end items-center gap-4 mr-20 mt-6">
								<Pagination
									className="pagination-bar"
									currentPage={currentPage}
									totalCount={uniqueCompletedOrders.length}
									pageSize={PageSize}
									onPageChange={(page) => setCurrentPage(page)}
								/>
							</div>
						</>
					)}
				</div>
			</div>
			<Transition.Root show={approvalModal} as={Fragment}>
				<Dialog
					as="div"
					className="fixed z-10 inset-0 overflow-y-auto"
					initialFocus={cancelButtonRef}
					onClose={setApprovalModal}
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
								<button
									className="flex justify-center ml-auto m-4 mb-0"
									onClick={handleReset}
								>
									<CloseModal />
								</button>
								<div className="h-mini-modal flex justify-center items-center">
									{/* <Checked /> */}
									<p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
										This Report will be downloaded to your device
									</p>
								</div>
								<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
									<button
										className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
										onClick={() => {}}
										style={{
											display: "flex",
											opacity: downloading ? "0.5" : 1,
										}}
										disabled={downloading}
									>
										{save}
										{downloading ? <Loading /> : ""}
									</button>

									<button
										className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
										onClick={handleReset}
									>
										Close
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={errorModal} as={Fragment}>
				<Dialog
					as="div"
					className="fixed z-10 inset-0 overflow-y-auto"
					initialFocus={cancelButtonRef}
					onClose={setErrorModal}
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
								<button
									className="flex justify-center ml-auto m-4 mb-0"
									onClick={handleReset}
								>
									<CloseModal />
								</button>
								<div
									className=" flex justify-center items-center"
									style={{ flexDirection: "column" }}
								>
									<Error width={50} height={50} />
									<p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
										{errorMsg.current || "Network error. Please try again."}
									</p>
								</div>
								<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
									<button
										className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
										onClick={handleReset}
									>
										Okay
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>
			<Transition.Root show={successModal} as={Fragment}>
				<Dialog
					as="div"
					className="fixed z-10 inset-0 overflow-y-auto"
					initialFocus={cancelButtonRef}
					onClose={setSuccessModal}
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
								<button
									className="flex justify-center ml-auto m-4 mb-0"
									onClick={handleReset}
								>
									<CloseModal />
								</button>
								<div
									className="h-mini-modal flex justify-center items-center"
									style={{ flexDirection: "column" }}
								>
									<Checked width={50} height={50} />
									<p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
										Report arrived. <br />
										<br />
										<span className="text-sm">
											You can check your download folder
										</span>
									</p>
								</div>
								<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
									<button
										className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
										onClick={handleReset}
									>
										Okay, thanks.
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

export default TotalSalesReport;