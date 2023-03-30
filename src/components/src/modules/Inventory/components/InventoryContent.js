import React, { useEffect, useState, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import coloredAlert from "../../../assets/svg/coloredAlert.svg";
import { CloseModal } from "../../../assets/svg/modalIcons";
import Loading from "../../../components/common/Loading";

import { Dialog, Transition } from "@headlessui/react";
import warehouse from "../../../assets/svg/warehouse.svg";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import SortImg from "../../../assets/svg/sort.svg";
import LoadingList from "../../../components/common/LoadingList";
import { getAllProducts } from "../../Admin/Pricing/actions/AdminPricingAction";
import TotalEmpties from "./TotalEmpties";
import {
	getAbiInventory,
	getAllOutOfStock,
	getTotalEmpties,
	getLVAV,
	addInitialEmpties,
	setSelectedOtherProducts,
	updateDailysTOCKTransferQuantity,
	openReceiveEmptiesButton,
	openEmptiesButton,
	openReturnTotalEmptiesButton,
} from "../actions/inventoryProductAction";
import { useTranslation } from "react-i18next";

import { filter } from "lodash";
import axios from "../../../utils/axios";
import { inventory, inventoryNet } from "../../../utils/urls";
import { formatPriceByCountrySymbol } from "../../../utils/formatPrice";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import { formatEmptiesQuantity } from "../../../utils/helperFunction";

const Tabs = ({ top, borderActive, inventoryData, history, Dist_Code }) => {
	const { t } = useTranslation();

	const [openTab, setOpenTab] = useState(1);
	const [open, setOpen] = useState(false);
	const [emptiesNo, setEmptiesNo] = useState(0);
	const [loadingState, setLoadingState] = useState(true);
	const [empties, setEmpties] = useState("");
	const [loading, setLoading] = useState(false);
	const cancelButtonRef = useRef(null);
	const [approvalModal, setApprovalModal] = useState(false);
	const [saveButton, setSaveButton] = useState("Yes, please");
	const [otherProducts, setOtherProducts] = useState([]);
	const AuthData = useSelector((state) => state.Auth.sessionUserData);
	const [customerName, setCustomerName] = useState("");
	const [returnReceiveEmpties, setReturnReceiveEmpties] = useState(false);
	const [userCountry, setUserCountry] = useState(AuthData.country);

	useEffect(async () => {
		const loc = await getLocation();
		setUserCountry(loc);
	}, [userCountry]);

	const openReceiveEmpties = useSelector(
		(state) => state.InventoryReducer.receive_empties_button
	);

	const dispatch = useDispatch();
	const country = AuthData?.country;
	// const country = "Zambia";
	const miniAdmin = AuthData.roles === "Mini-Admin";

	if (inventoryData?.length > 0 && loadingState) {
		setLoadingState(false);
	}

	const allProducts = useSelector((state) => state.PricingReducer.allProducts);
	if (!allProducts) {
		dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
	}

	const handleReset = () => {
		setApprovalModal(false);
	};

	const handlePush = (distCode) => {
		history.push(`/dashboard/inventory-adjustment/${distCode}`);
	};

	let dist_code = useSelector((state) => state.DistReducer.dist_code);
	if (!dist_code) {
		dist_code = Dist_Code;
	}

	const totalEmpties = useSelector(
		(state) => state.InventoryReducer.totalEmpties
	);

	const updateDB = () => {
		// setLoading(true)
		// setSaveButton("Updating ")
		let toDB = {};
		toDB = {
			companyCode: dist_code,
			quantityToReturn: parseInt(emptiesNo),
		};

		//addInitialEmpties(toDB)
		const inventory = inventoryNet()
		inventory.post("empties/take-in", toDB).then((response) => {
			setApprovalModal(false);
			dispatch(openReceiveEmptiesButton(false));
			dispatch(openEmptiesButton(false));
			setEmptiesNo("");
			setCustomerName("");
			setLoading(false);
			setSaveButton("Yes, please");
			dispatch(addInitialEmpties(emptiesNo));
			dispatch(getTotalEmpties(dist_code));
		});
	};

	useEffect(() => {
		const inventoryApi = inventory();
		dispatch(getAbiInventory(Dist_Code));
		dispatch(getAllOutOfStock(Dist_Code));
		dispatch(getLVAV(Dist_Code));
		inventoryApi.get(`non-abi/inventory/${Dist_Code}`).then((response) => {
			const { data } = response.data;
			setOtherProducts(data);
		});
		dispatch(updateDailysTOCKTransferQuantity(false));
	}, []);

	const abiInventory = useSelector(
		(state) => state.InventoryReducer.abi_inventory
	);
	const all_outOfStock = useSelector(
		(state) => state.InventoryReducer.all_outOfStock
	);
	const low_stock_products = useSelector(
		(state) => state.InventoryReducer.low_stock_values
	);

	const searchProduct = (filterInput, filterUL) => {
		let input, filter, ul, li, a, i;
		input = document.getElementById(filterInput);
		filter = input.value.toUpperCase();
		ul = document.getElementById(filterUL);
		li = ul.getElementsByTagName("tr");
		for (i = 0; i < li.length; i++) {
			if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}
	};

	const showLabel = (country) => {
		let value;
		switch (country) {
			case "Nigeria":
				value = "Bulkbreakers";
				break;
			case "Uganda":
				value = "Stockiest Price";
				break;
			case "Ghana":
				value = "PTW";
				break;
			case "South Africa":
				value = "PFW";
			case "Zambia":
				value = "Price";
			case "Tanzania":
				value = "Price";
				break;
			// case 'Tanzania':
			//   value = 'Recommended Price'
			//   break;
			// case 'Mozambique':
			//   value = 'Recommended Price'
			//   break;
			// case 'Zambia':
			//   value = 'Recommended Price'
			//   break;
			default:
				value = value;
				break;
		}
		return value;
	};

	const showRetailerLabel = (country) => {
		let value;
		switch (country) {
			case "Nigeria":
				value = "Retailers";
				break;
			case "Uganda":
				value = "Outlet Price";
				break;
			case "Ghana":
				value = "PTR";
				break;
			case "South Africa":
				value = "PTR";
				break;
			case "Zambia":
				value = "Price";
			// case 'Tanzania':
			//   value = 'Recommended Price'
			//   break;
			// case 'Mozambique':
			//   value = 'Recommended Price'
			//   break;
			// case 'Zambia':
			//   value = 'Recommended Price'
			//   break;
			default:
				value = value;
				break;
		}
		return value;
	};

	return (
		<>
			<div
        className={`relative flex flex-col min-w-0 break-words bg-white w-full mb-6 ${top} shadow-lg rounded`}
      >
				<div className="flex flex-wrap">
					<div className="w-full ">
						<div className="flex justify-between border-default-b border-b-2">
							<ul
								className="flex px-8 mb-0 list-none flex-wrap pt-8 flex-row w-full"
                role="tablist"
              >
								<li className="flex">
									<a
										className={
											"flex font-customGilroy text-base font-normal pb-3 mr-16 " +
											(openTab === 1
												? "text-active border-b-4 rounded"
												: "text-default")
										}
										style={{ borderColor: openTab === 1 ? borderActive : "" }}
										onClick={(e) => {
											e.preventDefault();
											setOpenTab(1);
										}}
										data-toggle="tab"
										href="#link1"
                    role="tablist"
                  >
										{t("all_products")}
									</a>
								</li>
								{(country === "South Africa" ||
									country === "Zambia" ||
									country === "Tanzania") && (
									<li className="flex">
										<a
											className={
												"flex font-customGilroy text-base font-normal pb-3 mr-16 " +
												(openTab === 2
													? "text-active border-b-4 rounded"
													: "text-default")
											}
											style={{ borderColor: openTab === 2 ? borderActive : "" }}
											onClick={(e) => {
												e.preventDefault();
												setOpenTab(2);
											}}
											data-toggle="tab"
											href="#link1"
                      role="tablist"
                    >
											ABI Products
										</a>
									</li>
								)}
								{(country === "South Africa" ||
									country === "Zambia" ||
									country === "Tanzania") && (
									<li className="flex ">
										<a
											className="flex w-full"
											onClick={(e) => {
												e.preventDefault();
												setOpenTab(3);
											}}
											data-toggle="tab"
											href="#link1"
                      role="tablist"
                    >
											<p
												className={
													"flex font-customGilroy text-base font-normal pb-3 mr-16 " +
													(openTab === 3
														? "text-active border-b-4 rounded"
														: "text-default")
												}
												style={{
													borderColor: openTab === 3 ? borderActive : "",
                        }}
                      >
												Non-ABI Products
											</p>
										</a>
									</li>
								)}
								<li className="flex ">
									<a
										className="flex w-full"
										onClick={(e) => {
											e.preventDefault();
											setOpenTab(4);
										}}
										data-toggle="tab"
										href="#link1"
                    role="tablist"
                  >
										<div className="mt-1">
											<img className="mr-1" src={coloredAlert} alt="" />
										</div>
										<p
											className={
												"flex font-customGilroy text-base font-normal pb-3 mr-16 " +
												(openTab === 4
													? "text-active border-b-4 rounded"
													: "text-default")
											}
                      style={{ borderColor: openTab === 4 ? borderActive : "" }}
                    >
											{t("out_of_stock")} (
											{all_outOfStock ? all_outOfStock?.length : 0})
										</p>
									</a>
								</li>
								{/* <li className="flex ">
                  <a
                    className="flex w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(3);
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    <div className="mt-1">
                      <img className="mr-1" src={coloredAlert} alt="" />
                    </div>
                    <p
                      className={
                        "flex font-customGilroy text-base font-normal pb-3 mr-16 " +
                        (openTab === 3
                          ? "text-active border-b-4 rounded border-basic"
                          : "text-default")
                      }
                    >
                      Low Volume (
                      {low_stock_products ? low_stock_products?.length : 0})
                    </p>
                  </a>
                </li> */}
							</ul>
							{!miniAdmin && (
								<div>
									<button
										className="flex items-center mr-4 mt-4"
										style={{
											width: 168,
											background: "#DEE0E4",
											borderRadius: 4,
											height: 42,
											outline: "none",
											color: "#2D2F39",
										}}
										// onClick={onSubmit}
									>
										{/* <div
                      className="flex items-center"
                      style={{
                        fontWeight: 500,
                        fontSize: 16,
                        height: 42,
                        lineHeight: "24px",
                        borderRight: "1px solid #9799A0",
                        width: 168,
                        justifyContent: "center",
                      }}
                      onClick={() => setOpen(true)}
                    >
                      Receive Empties
                    </div> */}
										<div
											style={{
												fontWeight: 500,
												fontSize: 16,
												lineHeight: "24px",
												width: 168,
											}}
                      onClick={() => handlePush(Dist_Code)}
                    >
											{country === "Tanzania"
												? "Adjust Stock"
												: t("adjust_inventory")}
										</div>
									</button>
								</div>
							)}
						</div>

						<div className="py-5 flex-auto">
							<div className="tab-content tab-space">
								<div className="mt-3 px-4 flex">
									<input
										className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400"
										id="searchInput"
										type="text"
										name="search"
										style={{ width: "26.063rem", backgroundColor: "#E5E5E5" }}
										onKeyUp={() =>
											searchProduct("searchInput", "ProductsTbody")
										}
										placeholder={t("search_for_a_product")}
									/>
									{/* 
                    <div
                      className="flex font-customGilroy text-center font-normal mr-4 px-2 py-3 rounded-md block  bg-white border-default-b border-2"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <p className="text-default font-normal">
                        All Products Types
                      </p>{" "}
                      <img className="pl-3 pr-2" src={arrowDown} alt="" />
                    </div>
                    <div
                      className="flex font-customGilroy text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <p className="font-customGilroy text-default font-normal">
                        All SKUs
                      </p>{" "}
                      <img className="pl-3 pr-2" src={arrowDown} alt="" />
                    </div>
                    <div className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                      <img className="pr-2" src={SortImg} alt="" />
                      <p className="text-default font-normal">Sort By</p>
                    </div>
                  </div> */}
								</div>
								{/* <TotalEmpties code={Dist_Code} /> */}
								<div className={openTab === 1 ? "block" : "hidden"} id="link1">
									{!loadingState ? (
										<table className="min-w-full mt-8 divide-y divide-gray-200">
											<thead className="bg-transparent ">
												<tr className="">
													<th
														scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                          >
														{t("product")}
													</th>
													{/* <th
														scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                          >
														{t("SKU")}
													</th> */}
													{/* <th
														scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                          >
                            {t("quantity_available")}
													</th> */}
                          													<th
														scope="col"
														className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider">
														<div>
															<p>{t("quantity")}</p>
															<p className="w-min  quantity_badge quantity_full_badge">
																{t("fulls")}
															</p>
														</div>
													</th>
													<th
														scope="col"
														className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider">
														<div>
															<p>{t("quantity")}</p>
															<p className="w-min  quantity_badge quantity_empty_badge">
																{t("empties")}
															</p>
														</div>
													</th>
													{/* <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                          >
                            Low Volume Value
                          </th> */}
												</tr>
											</thead>
											<tbody
												className="bg-white px-6 divide-y divide-gray-200"
                        id="ProductsTbody"
                      >
												{(country === "South Africa" ||
												country === "Zambia" ||
												country === "Tanzania"
													? inventoryData
													: abiInventory
												)?.map((sku, index) => (
													<tr key={index}>
														<td className="px-12 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className="flex-shrink-0 h-20 w-10">
																	<img
																		className="h-20 w-10 rounded-full"
																		src={sku.product?.imageUrl}
																		alt=""
																	/>
																</div>
																<div className="ml-4">
                                  {/* <div className="text-sm font-medium text-gray-900">
                                    {sku.product?.brand +
                                      " " +
                                      sku.product?.sku}
																	</div>
																	<div
																		className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                    style={{ backgroundColor: "#D86217" }}
                                  >
                                    {sku.product?.productType}
																	</div> */}
                              		<div className="text-sm font-semibold capitalize text-gray-900">
																		{sku.product?.brand}
																	</div>
																	<div className=" py-1 font-customGilroy inline-flex text-xs leading-5 rounded-full">
																		{sku.product?.sku}
																	</div>
																	<div className=" py-1 font-customGilroy text-xs leading-5 rounded-full w-12 uppercase semi-bold text-center quantity_badge quantity_empty_badge" style={{ backgroundColor: "#D86217" }}>
																		{sku.product?.productType}
																	</div>
																</div>
															</div>
														</td>
														{/* <td className="px-6 py-2 ">
                              <div className="font-normal font-customGilroy text-sm text-left w-25">
																{sku.product?.sku}
															</div>
														</td> */}
														<td className="px-6 py-2 ">
															<div className="font-customGilroy font-normal text-sm text-left w-20">
																{sku.quantity}
															</div>
														</td>
														<td className="px-6 py-2 ">
															<div className={`font-customGilroy font-normal text-sm text-left w-20
																${
																	formatEmptiesQuantity(
																		sku?.product?.productType,
																		sku?.empties
																	) === "Nil" && "text--accent"
																}`}
															>
																{formatEmptiesQuantity(sku?.product?.productType, sku?.empties)}
															</div>
														</td>
														{/* <td className="px-6 py-2 ">
                              <div className="font-customGilroy font-normal text-sm text-center w-20">
                                {sku.lowStock ? sku.lowStock : 0}
                              </div>
                            </td> */}
													</tr>
												))}
											</tbody>
										</table>
									) : (
										<LoadingList />
									)}
								</div>
								<div className={openTab === 2 ? "block" : "hidden"} id="link1">
									{!loadingState ? (
										<table className="min-w-full mt-8 divide-y divide-gray-200">
											<thead className="bg-transparent ">
												<tr className="">
													<th
														scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                          >
															{t("product")}
													</th>
													{/* <th
														scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                          >
														SKU
													</th> */}
													 													<th
														scope="col"
														className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider">
														<div>
															<p>{t("quantity")}</p>
															<p className="w-min  quantity_badge quantity_full_badge">
																{t("fulls")}
															</p>
														</div>
													</th>
														<th
														scope="col"
														className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider">
														<div>
															<p>{t("quantity")}</p>
															<p className="w-min  quantity_badge quantity_empty_badge">
																{t("empties")}
															</p>
														</div>
													</th>
													{/* <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                          >
                            Low Volume Value
                          </th> */}
												</tr>
											</thead>
											<tbody
												className="bg-white px-6 divide-y divide-gray-200"
                        id="ProductsTbody"
                      >
												{abiInventory?.map((sku, index) => (
													<tr key={index}>
													<td className="px-12 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className="flex-shrink-0 h-20 w-10">
																	<img
																		className="h-20 w-10 rounded-full"
																		src={sku.product?.imageUrl}
																		alt=""
																	/>
																</div>
																<div className="ml-4">
                                  {/* <div className="text-sm font-medium text-gray-900">
                                    {sku.product?.brand +
                                      " " +
                                      sku.product?.sku}
																	</div>
																	<div
																		className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                    style={{ backgroundColor: "#D86217" }}
                                  >
                                    {sku.product?.productType}
																	</div> */}
                              		<div className="text-sm font-semibold capitalize text-gray-900">
																		{sku.product?.brand}
																	</div>
																	<div className=" py-1 font-customGilroy inline-flex text-xs leading-5 rounded-full">
																		{sku.product?.sku}
																	</div>
																	<div className=" py-1 font-customGilroy text-xs leading-5 rounded-full w-12 uppercase semi-bold text-center quantity_badge quantity_empty_badge" style={{ backgroundColor: "#D86217" }}>
																		{sku.product?.productType}
																	</div>
																</div>
															</div>
														</td>
														{/* <td className="px-6 py-2 ">
															<div className="font-normal font-customGilroy text-sm text-left w-25">
																{sku.product?.sku}
															</div>
														</td> */}
														<td className="px-6 py-2 ">
															<div className="font-customGilroy font-normal text-sm text-center w-20">
																{sku.quantity}
															</div>
														</td>
														{/* <td className="px-6 py-2 ">
                              <div className="font-customGilroy font-normal text-sm text-center w-20">
                                {sku.lowStock ? sku.lowStock : 0}
                              </div>
                            </td> */}
															<td className="px-6 py-2 ">
															<div className="font-customGilroy font-normal text-sm text-left w-20">
																{sku.empties ?? t("nil")}
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									) : (
										<LoadingList />
									)}
								</div>
								<div className={openTab === 3 ? "block" : "hidden"} id="link2">
									<table className="min-w-full mt-8 divide-y divide-gray-200">
										<thead className="bg-transparent ">
											<tr className="">
												<th
													scope="col"
                          className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                        >
													Product
												</th>
												{/* <th
													scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
													SKU
												</th> */}
												<th
													scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
													{showLabel(country)}
												</th>
												{/* <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
                          {showRetailerLabel(country)}
                        </th> */}
										 													<th
														scope="col"
														className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider">
														<div>
															<p>{t("quantity")}</p>
															<p className="w-min  quantity_badge quantity_full_badge">
																{t("fulls")}
															</p>
														</div>
													</th>
															<th
														scope="col"
														className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider">
														<div>
															<p>{t("quantity")}</p>
															<p className="w-min  quantity_badge quantity_empty_badge">
																{t("empties")}
															</p>
														</div>
													</th>
											</tr>
										</thead>
										<tbody
											className="bg-white px-6 divide-y divide-gray-200"
                      id="ProductsTbody"
                    >
											{otherProducts?.map((sku, index) => (
												<tr key={index}>
												<td className="px-12 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className="flex-shrink-0 h-20 w-10">
																	<img
																		className="h-20 w-10 rounded-full"
																		src={sku.product?.imageUrl}
																		alt=""
																	/>
																</div>
																<div className="ml-4">
                                  {/* <div className="text-sm font-medium text-gray-900">
                                    {sku.product?.brand +
                                      " " +
                                      sku.product?.sku}
																	</div>
																	<div
																		className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                    style={{ backgroundColor: "#D86217" }}
                                  >
                                    {sku.product?.productType}
																	</div> */}
                              		<div className="text-sm font-semibold capitalize text-gray-900">
																		{sku.product?.brand}
																	</div>
																	<div className=" py-1 font-customGilroy inline-flex text-xs leading-5 rounded-full">
																		{sku.product?.sku}
																	</div>
																	<div className=" py-1 font-customGilroy text-xs leading-5 rounded-full w-12 uppercase semi-bold text-center quantity_badge quantity_empty_badge" style={{ backgroundColor: "#D86217" }}>
																		{sku.product?.productType}
																	</div>
																</div>
															</div>
														</td>
													{/* <td className="px-6 py-2 ">
														<div className="font-normal font-customGilroy text-sm text-left w-25">
															{sku.product.sku}
														</div>
													</td> */}
													<td className="px-6 py-2 ">
														<div className="font-normal font-customGilroy text-sm text-left w-25">
															{formatPriceByCountrySymbol(country, sku.price)}
														</div>
													</td>
													{/* <td className="px-6 py-2 ">
                            <div className="font-normal font-customGilroy text-sm text-left w-25">
                              {formatPriceByCountrySymbol(
                                country,
                                sku.retailerPrice
                              )}
                            </div>
                          </td> */}
													{/* <td className="px-6 py-2 ">
                            <div className="font-normal font-customGilroy text-sm text-left w-25">
                              {sku.product.sku}
                            </div>
                          </td> */}
													<td className="px-6 py-2 ">
														<div className="font-customGilroy font-normal text-sm text-center w-20">
															{sku.quantity}
														</div>
													</td>
													<td className="px-6 py-2 ">
															<div className="font-customGilroy font-normal text-sm text-left w-20">
																{sku.empties ?? t("nil")}
															</div>
														</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								{/* /////////////////////////// Out of stock //////////////////////////////// */}
								<div className={openTab === 4 ? "block" : "hidden"} id="link2">
									<table className="min-w-full mt-8 divide-y divide-gray-200">
										<thead className="bg-transparent ">
											<tr className="">
												<th
													scope="col"
                          className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                        >
													{t("product")}
												</th>
												{/* <th
													scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
													{t("SKU")}
												</th> */}
											   													<th
														scope="col"
														className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider">
														<div>
															<p>{t("quantity")}</p>
															<p className="w-min  quantity_badge quantity_full_badge">
																{t("fulls")}
															</p>
														</div>
													</th>
											</tr>
										</thead>
										<tbody
											className="bg-white px-6 divide-y divide-gray-200"
                      id="ProductsTbody"
                    >
											{all_outOfStock?.map((sku, index) => (
												<tr key={index}>
														<td className="px-12 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className="flex-shrink-0 h-20 w-10">
																	<img
																		className="h-20 w-10 rounded-full"
																		src={sku.product?.imageUrl}
																		alt=""
																	/>
																</div>
																<div className="ml-4">
                                  {/* <div className="text-sm font-medium text-gray-900">
                                    {sku.product?.brand +
                                      " " +
                                      sku.product?.sku}
																	</div>
																	<div
																		className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                    style={{ backgroundColor: "#D86217" }}
                                  >
                                    {sku.product?.productType}
																	</div> */}
                              		<div className="text-sm font-semibold capitalize text-gray-900">
																		{sku.product?.brand}
																	</div>
																	<div className=" py-1 font-customGilroy inline-flex text-xs leading-5 rounded-full">
																		{sku.product?.sku}
																	</div>
																	<div className=" py-1 font-customGilroy text-xs leading-5 rounded-full w-12 uppercase semi-bold text-center quantity_badge quantity_empty_badge" style={{ backgroundColor: "#D86217" }}>
																		{sku.product?.productType}
																	</div>
																</div>
															</div>
														</td>
													{/* <td className="px-6 py-2 ">
														<div className="font-normal font-customGilroy text-sm text-left w-25">
															{sku.product.sku}
														</div>
													</td> */}
													<td className="px-6 py-2 ">
															<div className="font-customGilroy font-normal text-sm text-left w-20">
																{sku.quantity}
															</div>
														</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								{/* /////////////////////////// Out of stock //////////////////////////////// */}
								{/* <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <table className="min-w-full mt-8 divide-y divide-gray-200">
                    <thead className="bg-transparent ">
                      <tr className="">
                        <th
                          scope="col"
                          className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
                          SKU
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
                          Quantity Available
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className="bg-white px-6 divide-y divide-gray-200"
                      id="ProductsTbody"
                    >
                      {low_stock_products?.map((sku, index) => (
                        <tr key={index}>
                          <td className="px-12 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-20 w-10">
                                <img
                                  className="h-20 w-10 rounded-full"
                                  src={sku.product.imageUrl}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {sku.product.brand + " " + sku.product.sku}
                                </div>
                                <div
                                  className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                  style={{ backgroundColor: "#D86217" }}
                                >
                                  {sku.product.productType}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-2 ">
                            <div className="font-normal font-customGilroy text-sm text-left w-25">
                              {sku.product.sku}
                            </div>
                          </td>
                          <td className="px-6 py-2 ">
                            <div className="font-customGilroy font-normal text-sm text-center w-20">
                              {sku.quantity}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Transition.Root show={openReceiveEmpties} as={Fragment}>
				<Dialog
					as="div"
					className="fixed z-10 inset-0 overflow-y-auto"
					onClose={() => {
						dispatch(openReceiveEmptiesButton(false));
						// dispatch(openEmptiesButton(true));
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
							<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal">
								<CloseModal
									className="ml-auto m-4 mb-0"
									onClick={() => {
										dispatch(openReceiveEmptiesButton(false));
										dispatch(openEmptiesButton(true));
									}}
								/>
								<div className="flex justify-between items-center px-6">
									<p
										className="font-customGilroy not-italic font-normal grey-100"
                    style={{ fontSize: "32px" }}
                  >
										Receive Empties
									</p>
								</div>
								<input
									className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
									placeholder="Enter the number of empties"
									value={emptiesNo}
									onChange={(e) => setEmptiesNo(e.target.value)}
									style={{
										marginLeft: "1.5rem",
										marginTop: "1.5rem",
									}}
								/>
								<input
									className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
									placeholder="Customer name"
									value={customerName}
									onChange={(e) => setCustomerName(e.target.value)}
									style={{
										marginLeft: "1.5rem",
										marginTop: "1.5rem",
									}}
								/>
								<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
									<button
										type="submit"
										className="rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
										onClick={() => setApprovalModal(true)}
										style={{
											backgroundColor: countryConfig[userCountry].buttonColor,
											color: countryConfig[userCountry].textColor,
											opacity:
												emptiesNo < 1 || customerName === "" ? "50%" : "100%",
										}}
										disabled={
											emptiesNo < 1 || customerName === "" ? true : false
                    }
                  >
										Save
									</button>
									<button
										className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
										onClick={() => {
											dispatch(openReceiveEmptiesButton(false));
											dispatch(openEmptiesButton(true));
                    }}
                  >
										Cancel
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>

			<Transition.Root show={approvalModal} as={Fragment}>
				<Dialog
					as="div"
					className="fixed z-10 inset-0 overflow-y-auto"
					initialFocus={cancelButtonRef}
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
									onClick={() => handleReset()}
								/>
								<div className="h-mini-modal flex justify-center items-center">
									<p className="font-customGilroy not-italic text-base font-medium">
										Are you sure you want to add these empties?
									</p>
								</div>
								<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
									<button
										className="rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
										onClick={() => updateDB()}
										style={{
											display: "flex",
											backgroundColor: countryConfig[userCountry].buttonColor,
											color: countryConfig[userCountry].textColor,
                    }}
                  >
										{saveButton}
										{loading ? <Loading /> : ""}
									</button>

									<button
										className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                    onClick={() => handleReset()}
                  >
										Cancel
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
};

export default Tabs;
