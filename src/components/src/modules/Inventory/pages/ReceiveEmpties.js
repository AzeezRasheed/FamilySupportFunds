import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import arrowBackBox from "../../../assets/svg/arrowBack.svg";

import Dashboard from "../../../Layout/Dashboard";

import countryConfig from "../../../utils/changesConfig.json";
import Loading from "../../../components/common/Loading";
import {
	getAllDistributorCustomers,
	getAllCustomers,
	updateCustomer
} from "../../Admin/customer/actions/customer";
import {
	getAllOneOffCustomers,
	addOneOffCustomerAction,
	clearOneOff,
} from "../../Admin/customer/actions/customer";
import { ReactComponent as ArrowEdit } from "../../../assets/svg/edit-arrow.svg";
import { updateEmptiesQuantity, receiveEmpties } from "../actions/inventoryProductAction";

const ReceiveEmpties = ({ location }) => {
	const history = useHistory();

	const { Dist_Code } = useParams();

	const { t } = useTranslation();

  const loading = useSelector(state => state.InventoryReducer.loadingInventory)

	const inventoryData = useSelector(
		(state) => state.InventoryReducer.all_inventory
	);
	  // const distributorDetails = useSelector(state => state.AllDistributorReducer?.distributor).DIST_Code
		// console.log(Dist_Code);
	const AuthData = useSelector((state) => state.Auth.sessionUserData);

	const dispatch = useDispatch();

	const [search, setSearch] = useState("");
	const [searchOneOff, setSearchOneOff] = useState("");
	const [toolTip, setTooltip] = useState(false);
	const [emptiesInventory, setEmptiesInventory] = useState(inventoryData);

	const [customerDetails, setCustomer] = useState({
		phoneNumber: "",
		name2: "",
		custType: "",
	});
	const ccountry = AuthData?.country;

	const { phoneNumber, name2 } = customerDetails;
	const [open, setOpen] = useState(false);	
	const [userCountry, setUserCountry] = useState("Ghana");
	const [productData, setPoductData] = useState("");
	const [counter, setCounter] = useState({});
	const [editedEmpties, setEditedEmpties] = useState([]);



	const { distributor } = useSelector((state) => state.AllDistributorReducer);

	const {
		all_customers,
		all_dist_customers,
		allOneOffCustomers,
		addOneOffCustomers,
		loadingAddOneOffCustomers,
		customer
	} = useSelector((state) => state.CustomerReducer);

	

	const checkCustomerTypeOneOff = (country) => {
		let customerType = "Poc";
		switch (country) {
			case "Uganda":
				customerType = "Reseller";
				break;
			case "Tanzania":
				customerType = "Stockist";
				break;
			case "Ghana":
				customerType = "Low End";
				break;
			case "Zambia":
				customerType = "Low End";
				break;
			case "Nigeria":
				customerType = customerType;
				break;
			case "South Africa":
				customerType = customerType;
				break;
			default:
				customerType = customerType;
				break;
		}
		return customerType;
	};

	const getCustomerData = (country) => {
		let customerData = all_customers;
		switch (country) {
			case "Nigeria":
				customerData = customerData;
				break;
			case "Uganda":
				customerData = all_dist_customers;
				break;
			case "Tanzania":
				customerData = all_dist_customers;
				break;
			case "Ghana":
				customerData = all_dist_customers;
				break;
			case "Mozambique":
				customerData = all_dist_customers;
				break;
			case "Zambia":
				customerData = all_dist_customers;
				break;
			case "South Africa":
				customerData = all_dist_customers;
				break;
			default:
				customerData = customerData;
				break;
		}
		return customerData;
	};

	const [oneOffDetails, setOneOffDetails] = useState({
		oneOffNumber: "",
		oneOffName: "",
		oneOffPriceGroup: "",
		oneOffType: checkCustomerTypeOneOff(distributor?.country),
		country: distributor?.country,
	});
	const { oneOffNumber, oneOffName, country } =
		oneOffDetails;
	const [showCapture, setshowCapture] = useState(false);
	const lowercasedSearchFilter = search.toLowerCase();
	const lowercasedFilter = searchOneOff.toLowerCase();

	const miniAdmin = AuthData.roles === "Mini-Admin";

	useEffect(() => {
		dispatch(getAllDistributorCustomers(distributor?.SYS_Code));
		dispatch(getAllCustomers(country));
		dispatch(getAllOneOffCustomers(ccountry));
	}, [distributor?.SYS_Code, country, ccountry]);

	useEffect(() => {
		if (addOneOffCustomers?.success) {
			setOneOffDetails({
				...oneOffDetails,
				oneOffNumber: "",
				oneOffName: "",
				oneOffPriceGroup: "",
				oneOffType: checkCustomerTypeOneOff(distributor?.country),
				country: distributor?.country,
			});
			setSearchOneOff("");

			setTimeout(() => {
				dispatch(clearOneOff());
			}, 3000);
		}

		// eslint-disable-next-line
	}, [addOneOffCustomers?.success, country]);

	useEffect(() => {
		if (addOneOffCustomers) dispatch(getAllOneOffCustomers(ccountry));
	}, [addOneOffCustomers, country]);

	useEffect(() => {
		if (inventoryData) {
			const data = inventoryData.filter((inventory) => {
				const productType = inventory.product?.productType?.toLowerCase();
				return productType && (productType !== 'can' && productType !== 'pet' && productType !== 'nrb')
			})
			setEmptiesInventory(data);
		}
	}, [inventoryData])

	useEffect(() => {
		if (inventoryData) {
			const data = inventoryData.filter((data) => {
				const product = data?.product?.brand
					.toLowerCase()
					.startsWith(`${productData.toLowerCase()}`);
				const productType = data.product?.productType?.toLowerCase();
				return product && productType && (productType !== 'can' && productType !== 'pet' && productType !== 'nrb');
			})
			setEmptiesInventory(data);
		}
	}, [productData])

useEffect(()=>{
	if(((phoneNumber === "" || name2 === "" ) && (oneOffName==="" || oneOffNumber==="")) || (editedEmpties.length < 1)){ 
		dispatch(updateEmptiesQuantity(false))
	}else{
		// console.log(editedEmpties.length, 560);
				dispatch(updateEmptiesQuantity(true));

			dispatch(updateCustomer({customerName:name2||oneOffName,phoneNumber:phoneNumber||oneOffNumber}))
	}
	 let stocks = editedEmpties.map((stock)=>{
          return {productId:stock.id, quantity:stock.quantity}
          })
        			dispatch(receiveEmpties(stocks))
},[editedEmpties,name2,phoneNumber,oneOffName,oneOffNumber])

	const sortCustomer = getCustomerData(ccountry).filter((item) => {
		return Object.keys(item).some(
			(key) =>
				(item[key] !== null &&
					item[key] !== undefined &&
					item[key]
						.toString()
						.toLowerCase()
						.includes(lowercasedSearchFilter)) ||
				!lowercasedSearchFilter
		);
	});

	const sortOneOffCustomer =
		allOneOffCustomers === null
			? []
			: allOneOffCustomers.filter((item) => {
					return Object.keys(item).some(
						(key) =>
							item[key] &&
							item[key].toString().toLowerCase().includes(lowercasedFilter)
					);
			  });
	const onChangeOneOffNumber = (e) => {
		setOneOffDetails({ ...oneOffDetails, oneOffNumber: e.target.value });
		setSearchOneOff(e.target.value);
	};
	const onChangeOneOffName = (e) => {
		setOneOffDetails({ ...oneOffDetails, oneOffName: e.target.value });
		setSearchOneOff(e.target.value);
	};

	const setDetails = (
		id,
		phone,
		name,
		type,
	
	) => {
	
		setCustomer({
			...customerDetails,
			phoneNumber: phone,
			name2: name,
			custType: type,
		});
		setSearch("");
	};

	const reset = () => {
		setCustomer({ ...customerDetails, phoneNumber: "", name2: "" });
		setSearch("");
	};

	const resetNewCustomer = () => {
		setCustomer({ ...customerDetails, phoneNumber: "", name2: "" });
		setSearch("");
		setOpen(!open);
	};

	const OnsubmitAddOneOff = () => {
		dispatch(
			addOneOffCustomerAction(oneOffName, oneOffNumber, distributor?.country)
		);
		
	};
	const resetOneOff = () => {
		setOneOffDetails({
			...oneOffDetails,
			oneOffNumber: "",
			oneOffName: "",
			oneOffType: checkCustomerTypeOneOff(distributor?.country),
			country: distributor?.country,
		});
		setSearchOneOff("");
		setshowCapture(false);
	};
	const addOneOffDetails = (
		phone,
		name,
		type,
		priceGroup,
	) => {

		setOneOffDetails({
			...oneOffDetails,
			oneOffNumber: phone,
			oneOffName: name,
			oneOffType: type,
			oneOffPriceGroup: priceGroup,
			country: distributor?.country,
		});
		setSearchOneOff("");
	};
const updateEdits = (productId, quantity, id,e) => {
		setCounter(e ? {
			...counter,
			[e.target.name]: quantity,
		}:{ ...counter, [productId]: quantity });
		const check = editedEmpties.find(
			(product) => product.productId === productId
		);
		let newEdit;
		if (check) {
			if (quantity === 0) {
				newEdit = editedEmpties.filter(
					(product) => product.productId !== productId
				);
			}
			 else {
				newEdit = editedEmpties.map((product) => {
					if (product.productId === productId) {
						return {
							...product,
							quantity,
							id
						};
					} else {
						return product;
					}
				});
			}
		} else {
			newEdit = [...editedEmpties, { productId: productId, quantity, id }];
		}
		setEditedEmpties(newEdit);

	};

	const handleChange = (e, productId, stock,id ) => {
		const quantity = Number(e.target.value)
		if(quantity > 0){
		updateEdits(productId,quantity,id,e)

		}

	};

	const decrementCounter = (productId,id) => {
		const quantity =
			(counter[productId] > 0 && parseInt(counter[productId]) - 1) || 0;
		setCounter({ ...counter, [productId]: quantity });
		setTooltip(true);
		updateEdits(productId, quantity,id);
		
	};

	const incrementCounter = (productId,id) => {
	
		const quantity = parseInt(counter[productId] ?? 0) + 1;
		setCounter({ ...counter, [productId]: quantity });
		setTooltip(true);
		updateEdits(productId, quantity, id);

	};

	return (
		<Dashboard location={location}>
			<div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
				<div className="flex">
					<img
						onClick={() => history.push("/dashboard/inventory/" + Dist_Code)}
						className="van-img"
						src={arrowBackBox}
						alt=""
					/>
					<h2 className="font-customRoboto mx-4 text-black font-bold text-2xl capitalize">
						{t("receive_empties")}
					</h2>
				</div>
				<div className="flex justify-between">
					<div className="flex " style={{ flexGrow: 1 }}>
						<div
							style={{ flexGrow: 0.15, position: "relative", Width: "100%" }}>
							<p className="select-customer mt-10 mb-1">
								{t("select_customer")}
							</p>
							<input
								className="h-12 px-2"
								style={{
									width: "100%",
									border: "1px solid #BBBDC2",
									borderRadius: "4px",
									outline: "none",
								}}
								placeholder="Type name or phone number here ..."
								onChange={(e) => setSearch(e.target.value)}
								value={search || phoneNumber}
							/>
							{(search || phoneNumber) && (
								<span
									onClick={() => reset()}
									style={{
										position: "absolute",
										top: 70,
										right: "15px",
										color: "red",
										fontWeight: 500,
										cursor: "pointer",
									}}>
									X
								</span>
							)}
							<div className="h-2  py-2 mb-2">
								<p>{name2}</p>
							</div>
							{search && (
								<div
									className=" bg-white pt-2 mt-1 shadow-lg -ml-2 "
									style={{
										width: "100%",
										zIndex: 1000,
										position: "absolute",
										borderRadius: 10,
										overflow: "scroll",
										maxHeight: "600px",
										marginTop: "-20px",
									}}>
									{sortCustomer.length === 0 ? (
										<div style={{ minHeight: "100px" }}>
											{" "}
											<p className="text-center px-2 py-2">
												{t("customer_not_in_database")}
											</p>{" "}
										</div>
									) : (
										sortCustomer.map((customer, index) => (
											<div
												key={index}
												className="border-b-2 pt-1 mb-3 flex flex-col cursor-pointer"
												onClick={() =>
													setDetails(
														customer.id,
														customer?.phoneNumber,
														customer?.CUST_Name,
														customer?.CUST_Type,
														customer.price_group,
														customer?.SF_Code,
														"Walk-In-Sales",
														customer?.address,
														customer?.status
													)
												}>
												<span
													className="px-5 py-1"
													style={{
														color: "#2D2F39",
														fontSize: 14,
														fontWeight: 600,
														lineHeight: "16px",
													}}>
													{customer?.phoneNumber}
												</span>
												<span
													className="px-5 py-1"
													style={{
														color: "#50525B",
														fontSize: 12,
														fontWeight: 400,
														lineHeight: "16px",
													}}>
													{customer?.CUST_Name}
												</span>
											</div>
										))
									)}
								</div>
							)}
						</div>
						{!miniAdmin && (
							<div
								className="flex  ml-3 items-center mt-10 mt-5 cursor-pointer "
								onClick={() => resetNewCustomer()}>
								<img src={countryConfig[userCountry].plusIcon} />{" "}
								<button className="ml-1">
									<span
										style={{
											fontWeight: 500,
											fontSize: 16,
											lineHeight: "24px",
											color: "#090B17",
										}}>
										{" "}
										{t("new_customer")}
									</span>
								</button>
							</div>
						)}
					</div>
				</div>
				{open && (
					<>
						<div
							className="bg-white mt-4 w-full rounded-md flex "
							style={{ height: 56 }}>
							<div
								style={{
									width: 10,
									background: countryConfig[userCountry].orderTypeColor,
								}}></div>
							<div className="flex justify-between flex-grow">
								<div className="flex justify-center items-center ml-2">
									{t("new_one_off_customer")}
								</div>
								<div
									className=" flex justify-end items-center pr-5 cursor-pointer"
									style={{ color: "#9799A0" }}
									onClick={() => resetNewCustomer()}>
									X
								</div>
							</div>
						</div>
						<div className="flex justify-between mt-10">
							<div
								className="flex flex-col flex-grow "
								style={{ position: "relative" }}>
								<div style={{ width: "50%", position: "relative" }}>
									<p className="select-customer  mb-1">Phone number</p>
									<input
										className="h-12 px-2"
										style={{
											width: "100%",
											border: "1px solid #BBBDC2",
											borderRadius: "4px",
											outline: "none",
											marginRight: "30px",
											position: "relative",
										}}
										placeholder="Type name or phone number here..."
										onChange={(e) => onChangeOneOffNumber(e)}
										value={oneOffNumber}
										name="oneOffNumber"
										type="text"
									/>
									{oneOffNumber && (
										<span
											onClick={() => resetOneOff()}
											style={{
												position: "absolute",
												top: 35,
												right: "15px",
												color: "red",
												fontWeight: 500,
												cursor: "pointer",
											}}>
											X
										</span>
									)}
								</div>

								{searchOneOff && (
									<div
										className=" bg-white pt-2 mt-3 shadow-lg -ml-1 "
										style={{
											width: "52%",
											zIndex: 1000,
											position: "absolute",
											borderRadius: 10,
											overflow: "scroll",
											maxHeight: "600px",
											marginTop: "70px",
										}}>
										{sortOneOffCustomer && sortOneOffCustomer.length === 0 ? (
											<div style={{ minHeight: "100px" }}>
												{" "}
												<p className="text-center px-2 py-2">
													{t("customer_not_in_database")}
												</p>{" "}
											</div>
										) : (
											allOneOffCustomers &&
											sortOneOffCustomer.map((customer, index) => (
												<div
													key={index}
													className="border-b-2 pt-1 mb-3 flex flex-col cursor-pointer"
													onClick={() =>
														addOneOffDetails(
															customer?.phoneNumber,
															customer?.CUST_Name,
															checkCustomerTypeOneOff(distributor?.country),
															customer?.id,
															customer.price_group,
															"One-Off"
														)
													}>
													<span
														className="px-5 py-1"
														style={{
															color: "#2D2F39",
															fontSize: 14,
															fontWeight: 600,
															lineHeight: "16px",
														}}>
														{customer?.phoneNumber}
													</span>
													<span
														className="px-5 py-1"
														style={{
															color: "#50525B",
															fontSize: 12,
															fontWeight: 400,
															lineHeight: "16px",
														}}>
														{customer?.CUST_Name}
													</span>
												</div>
											))
										)}
									</div>
								)}
							</div>
							<div className="flex flex-col flex-grow">
								<p className="select-customer mb-1">{t("name")}</p>
								<input
									className="h-12 px-2"
									style={{
										width: "70%",
										border: "1px solid #BBBDC2",
										borderRadius: "4px",
										outline: "none",
										marginRight: "30px",
									}}
									placeholder={t("type_here")}
									onChange={(e) => onChangeOneOffName(e)}
									value={oneOffName}
									name="oneOffName"
								/>
							</div>

							<div className="flex items-end">
								{oneOffName &&
								sortOneOffCustomer.length === 0 &&
								oneOffNumber ? (
									<button
										style={{
											minWidth: 100,
											background: countryConfig[userCountry].buttonColor,
											borderRadius: 4,
											minHeight: 48,
										}}
										onClick={() => OnsubmitAddOneOff()}>
										<span
											style={{
												fontWeight: 700,
												fontSize: 16,
												lineHeight: "24px",
												color: countryConfig[userCountry].textColor,
											}}>
											{loadingAddOneOffCustomers ? (
												<span className="flex items-center justify-center">
													<Loading />
												</span>
											) : (
												"Add"
											)}
										</span>
									</button>
								) : null}
							</div>
						</div>
					</>
				)}
				<div className="bg-white mt-4 w-full rounded-md ">
					<div
						className="flex justify-center items-center mt-3"
						style={{ color: "green", fontWeight: 500 }}>
						{addOneOffCustomers?.msg}
					</div>
					<div className="py-5 flex-auto">
						<div className="stock-cont py-4">
							<div className="flex flex-wrap">
								<div className="w-full">
									<div className="py-2 flex-auto">
										<div className="tab-content tab-space">
											<div className="block">
												<div
													className="mt-3 px-4 flex "
													style={{ width: "100%" }}>
													<input
														className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400"
														id="search"
														type="text"
														name="search"
														style={{
															width: "30%",
															backgroundColor: "#E5E5E5",
														}}
														onChange={(e) => setPoductData(e.target.value)}
														placeholder={t("search_for_a_product")}
													/>
													{/* <div className="flex ">
														<select
															required
															onChange={(e) => setProducts(e.target.value)}
															value={products}
															name="product"
															type="text"
															placeholder={t("select_product(s)")}
															className="bg-white rounded border border-solid border-grey-25 font-customGilroy text-base font-medium not-italic py-3 px-3">
															<option>{t("select_product(s)")}</option>
															{items?.map((item, key) => (
																<option key={key}>{item}</option>
															))}
														</select>
														<select
															required
															onChange={(e) => setProducts(e.target.value)}
															value={products}
															name="product"
															type="text"
															placeholder={t("select_product(s)")}
															className="bg-white rounded border border-solid border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4">
															<option>{t("all_sku(s)")}</option>
															{items?.map((item, key) => (
																<option key={key}>{item}</option>
															))}
														</select>
													</div> */}
												</div>
												{!Dist_Code ||
												loading ? (
													<center
														className=" flex justify-center items-center mx-auto flex-col "
														style={{ marginTop: 20, marginBottom: 20 }}>
														<Loading /> <Loading /> <Loading />
													</center>
												) : (
													<table className="min-w-full mt-8 divide-y divide-gray-200">
														<thead className="bg-transparent ">
															<tr className="">
																<th
																	scope="col"
																	className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider">
																	{t("product")}
																</th>
																<th
																	scope="col"
																	className="py-3 text-left text-sm font-medium text-black tracking-wider">
																	{t("SKU")}
																</th>
																<th
																	scope="col"
																	className="py-3 text-left text-sm font-medium text-black tracking-wider">
																	{t("quantity_to_receive")}
																</th>
																<th
																	scope="col"
																	className="py-3 text-left text-sm font-medium text-black tracking-wider w-1/12"></th>
															</tr>
														</thead>
														<tbody className="bg-white px-6 divide-y divide-gray-200">
															{emptiesInventory.length === 0 ? (
																<div className="flex justify-start ml-10">
																	{" "}
																	<p className="py-4 pl-2">
																		{" "}
																		{t("not_available")}
																	</p>{" "}
																</div>
															) : (
																emptiesInventory
																.map(
																	(
																		{
																			product,
																			is_abi,
																			price,
																			quantity,
																			productId,
																		},
																		i
																	) => (
																		<tr key={product?.id} className={`ease-in-out duration-300 ${counter[product.productId] > 0 ? "edited_row" : null}`}>
																			<td
																				scope="col"
																				className="pl-12 py-3 text-left text-sm">
																				<div className="flex items-center">
																					<div className="flex-shrink-0 h-20 w-10">
																						<img
																							className="h-20 w-10 rounded-full"
																							src={product?.imageUrl}
																							alt=""
																						/>
																					</div>
																					<div className="ml-4">
																						<div className="text-sm font-medium text-gray-900">
																							{product?.brand}
																						</div>
																						<div className="flex">
																							<div
																								className="px-2 mt-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
																								style={{
																									backgroundColor: "#F49C00",
																								}}>
																								<span className="capitalize">
																									{t("empty")}
																								</span>
																							</div>
																				
																						</div>
																					</div>
																				</div>
																			</td>
																			<td scope="col" className=" py-3 text-sm">
																				<p
																					className=""
																					style={{ color: "#45130F" }}>
																					{product.sku}
																				</p>
																			</td>
																			<td scope="col" className=" py-3 text-sm">
																				<div className="flex relative">
																					<div
																						style={{
																							position: "absolute",
																							top: "-25px",
																							left: 20,
																							fontSize: 12,
																							color:
																								"rgba(177, 31, 36, var(--tw-bg-opacity))",
																						}}>
																						{toolTip &&
																						Number(quantity) <
																							Number(counter[productId])
																							? `${t(
																									"max_availability_is"
																							  )} ${quantity}`
																							: ""}
																					</div>
																					<button
																						className="border-gray-200 border-2 h-8 w-8 mr-2 counter cursor-pointer"
																						disabled={miniAdmin}
																						onClick={() =>
																							decrementCounter(
																								product.productId,
																								quantity,
																								product.id
																							)
																						}
																						style={{
																							backgroundColor:
																								countryConfig[userCountry]
																									.textColor,
																							opacity: `${
																								!counter[product.productId] ||
																								counter[product.productId] === 0
																									? "0.3"
																									: "1"
																							}`,
																						}}>
																						<p
																							style={{
																								color:
																									countryConfig[userCountry]
																										.inverseColor2,
																							}}
																							className="couter-text">
																							-
																						</p>
																					</button>

																					<input
																						type="number"
																						min="0"
																						max={quantity}
																						id="quantity-input"
																						placeholder="0"
																						value={
																							counter[product.productId] || 0
																						}
																						name={product.productId}
																						onChange={(e) =>
																							{
																								handleChange(
																								e,
																								product.productId,
																								quantity,
																								product.id
																							)}
																						}
																						readOnly={miniAdmin}
																						className="border-defaut bg-red font-normal text-sm rounded-md text-center border-2 w-20 h-8 pl-2"
																					/>
																				
																					<button
																						className="border-gray-200 border-2 h-8 w-9 ml-2 counter cursor-pointer"
																						disabled={miniAdmin}
																						onClick={() => {
																							incrementCounter(
																								product.productId,
																								quantity,
																								product.id
																							);
																						}}
																						style={{
																							backgroundColor:
																								countryConfig[userCountry]
																									.textColor,
																							opacity: `${
																								counter[productId] === quantity
																									? "0.3"
																									: "1"
																							}`,
																						}}>
																						<p
																							className="couter-text"
																							style={{
																								color:
																									countryConfig[userCountry]
																										.inverseColor2,
																							}}>
																							+
																						</p>
																					</button>
																				</div>
																			</td>
																			{counter[product.productId] > 0 ? (
																				<td className="relative w-1/12">
																					<p className="absolute top-2 left-0 inline-block  edit_badge quantity_badge">
																						{t("edited")}
																					</p>
																					<ArrowEdit className="absolute top-5 left-16 " />
																				</td>
																			) : null}
																		</tr>
																	)
																)
															)}
														</tbody>
													</table>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Dashboard>
	);
};

export default ReceiveEmpties;
