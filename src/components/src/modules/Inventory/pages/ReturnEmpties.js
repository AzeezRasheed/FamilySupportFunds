import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import arrowBackBox from "../../../assets/svg/arrowBack.svg";
import { ReactComponent as ArrowEdit } from "../../../assets/svg/edit-arrow.svg";
import { useParams, useHistory } from "react-router-dom";
import Dashboard from "../../../Layout/Dashboard";
import { useTranslation } from "react-i18next";
import countryConfig from "../../../utils/changesConfig.json";
import Loading from "../../../components/common/Loading";
import { updateEmptiesQuantity, returnQuantity, updateTransferQuantity, setApprovalModal} from "../actions/inventoryProductAction";
import UnsavedReceiveNewStock from "../../../components/common/UnsavedReceiveNewStock";
import { formatEmptiesQuantity } from "../../../utils/helperFunction";
import Warning from "../../../assets/svg/warning.svg";

const ReturnEmpties = ({ location }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { Dist_Code } = useParams();
  const history = useHistory();

	const AuthData = useSelector((state) => state.Auth.sessionUserData);
	const inventoryData = useSelector(
		(state) => state.InventoryReducer.all_inventory
	);
  const loading = useSelector(state => state.InventoryReducer.loadingInventory)

	const [productData, setPoductData] = useState("");
  const [counter, setCounter] = useState({});
	const [userCountry, setUserCountry] = useState("Ghana");
	const [toolTip, setTooltip] = useState(false);
	const [editedEmpties, setEditedEmpties] = useState([]);
	const [finalReceiveStock, setFinalReceiveStock] = useState(false);
	const [emptiesInventory, setEmptiesInventory] = useState(inventoryData);
	const [error, setError] = useState([]);

	const receiveStock = useSelector(
    (state) => state.InventoryReducer.receive_new_stock
  );

	useEffect(() => {
		dispatch(setApprovalModal(false));
	}, [])

	useEffect(() => {
		const data = inventoryData.filter((inventory) => {
			const productType = inventory.product.productType.toLowerCase();
			return productType !== 'can' && productType !== 'pet' && productType !== 'nrb'
		})
		const errors = new Array().fill(false, 0, data.length);
		setError(errors);
		setEmptiesInventory(data);
	}, [inventoryData])

  useEffect(()=>{
		if(editedEmpties.length < 1){ 
			dispatch(updateEmptiesQuantity(false));
			setFinalReceiveStock(false);
		}else{
			let stocks = editedEmpties.map((stock)=>{
				return { productId:stock.id, quantity:stock.quantity }
			})
			if (receiveStock) {
				setFinalReceiveStock(true);
				dispatch(returnQuantity(stocks))
			} else {
				dispatch(updateEmptiesQuantity(true));
				// const {quantity, id} = editedEmpties
				dispatch(returnQuantity(stocks))
			}
		}
	},[editedEmpties])
	const miniAdmin = AuthData.roles === "Mini-Admin";

	const sortOrder = emptiesInventory.filter((data) => {
		return data?.product?.brand
			.toLowerCase()
			.startsWith(`${productData.toLowerCase()}`);
	});

	const updateEdits = (productId, quantity, id,e) => {
		setCounter(e ? {
			...counter,
			[e.target.name]: quantity,
		}:{ ...counter, [productId]: quantity });
		let newEdit;
	
		const check = editedEmpties.find(
			(product) => product.productId === productId
		);
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
	const handleChange = (e, productId, empties, i, id ) => {
		const quantity = Number(e.target.value)
		if (quantity <= empties){
			setError({ ...error, [i]: false })
			updateEdits(productId, quantity, id, e)
		} else {
			setError({ ...error, [i]: true });
		}
	};

  const incrementCounter = (productId, empties, i, id) => {
	
		const quantity = parseInt(counter[productId] ?? 0) + 1;
		if (quantity <= empties) {
			setError({ ...error, [i]: false })
			setCounter({ ...counter, [productId]: quantity });
			setTooltip(true);
			updateEdits(productId, quantity, id);
		} else {
			setError({ ...error, [i]: true });
		}
	};

	const decrementCounter = (productId, empties, i, id) => {
		const quantity =
			(counter[productId] > 0 && parseInt(counter[productId]) - 1) || 0;
		if (quantity <= empties) {
			setError({ ...error, [i]: false })
			setCounter({ ...counter, [productId]: quantity });
			setTooltip(true);
			updateEdits(productId, quantity,id);
		} else {
			setError({ ...error, [i]: true });
		}
	};

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
				<div className="flex">
					<img
						onClick={() => history.goBack()}
						className="van-img"
						src={arrowBackBox}
						alt=""
					/>
					<h2 className="font-customRoboto mx-4 text-black font-bold text-2xl capitalize">
						{t("return_empties")}
					</h2>
				</div>
        <div className="bg-white mt-4 w-full rounded-md ">
  					<div className="py-5 flex-auto">
							<div className="stock-cont py-4">
								<div className="flex flex-wrap">
									<div className="w-full">
										{
											receiveStock &&
											<p className="px-7 mb-2">{t("select_empties_returned")}</p>
										}
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
																	className="py-3 text-left text-sm font-medium text-black tracking-wider w-56">
																	{t("SKU")}
																</th>
																<th
																	scope="col"
																	className="py-3 text-left text-sm font-medium text-black tracking-wider">
																	{t("quantity_available")}
																</th>
																<th
																	scope="col"
																	className="py-3 text-left text-sm font-medium text-black tracking-wider">
																	{t("quantity_to_return")}
																</th>
																<th
																	scope="col"
																	className="py-3 text-left text-sm font-medium text-black tracking-wider w-1/12"></th>
															</tr>
														</thead>
														<tbody className="bg-white px-6 divide-y divide-gray-200">
															{sortOrder.length === 0 ||
															inventoryData.length === 0 ? (
																<div className="flex justify-start ml-10">
																	{" "}
																	<p className="py-4 pl-2">
																		{" "}
																		{t("not_available")}
																	</p>{" "}
																</div>
															) : (
																(productData === ""
																	? emptiesInventory
																	: sortOrder
																).map(
																	(
																		{
																			product,
																			is_abi,
																			price,
																			quantity,
																			productId,
																			empties
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
																				<p
																					className=""
																					style={{ color: "#45130F" }}>
																					{formatEmptiesQuantity(product?.productType, empties)}
																				</p>
																			</td>
																			<td scope="col" className=" py-3 text-sm relative">
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
																						Number(formatEmptiesQuantity(product?.productType,empties)) <
																							Number(counter[productId])
																							? `${t(
																									"max_availability_is"
																							  )} ${empties || 0}`
																							: ""}
																					</div>
																					<button
																						className={`border-gray-200 border-2 h-8 w-8 mr-2 counter
																							${
																								(!empties && !counter[product.productId]) ||
																								typeof(counter[product.productId]) === 'undefined' ||
																								Number(counter[product.productId]) === 0
																								? "pointer-events-none"
																								: "cursor-pointer"
																							}
																						`}
																						disabled={miniAdmin}
																						onClick={() =>
																							decrementCounter(
																								product.productId,
																								empties,
																								i,
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
																						max={empties}
																						id="quantity-input"
																						placeholder="0"
																						value={
																							counter[product.productId] || 0
																						}
																						name={product.productId}
																						onChange={(e) => {
																							handleChange(
																								e,
																								product.productId,
																								empties,
																								i,
																								product.id
																							)
																						}}
																						disabled={
																							formatEmptiesQuantity(
																								product?.productType,
																								empties
																							) === "Nil" && "true"
																						}
																						readOnly={miniAdmin}
																						className={`border-defaut bg-red font-normal text-sm rounded-md text-center border-2 w-20 h-8 pl-2
																						${
																							formatEmptiesQuantity(
																								product.productType,
																								empties
																							) === "Nil" && "bg-neutral-300 opacity-50"
																						}
																						`}
																					/>
																				
																					<button
																						className="border-gray-200 border-2 h-8 w-9 ml-2 counter cursor-pointer"
																						disabled={miniAdmin}
																						onClick={() => {
																							incrementCounter(
																								product.productId,
																								empties,
																								i,
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
																					{
																						error[i] &&
																						<div className="flex absolute">
																							<div className="flex-shrink-0 h-6 w-6 cursor-pointer mt-0.5">
																								<img src={Warning} alt="warning" />
																							</div>
																							<span className="text-critical">
																								Max quantity is {empties || 0}
																							</span>
																						</div>
																					}
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
      {
				finalReceiveStock &&
				<UnsavedReceiveNewStock
          actionText={t("click_done_to_complete_receive_new_stock_process")}
          backText={t("previous")}
          forwardText={t("done")}
          onClickForward={() => {
						setFinalReceiveStock(false);
						dispatch(setApprovalModal(true));
            dispatch(updateTransferQuantity(true));
          }}
        />
			}
    </Dashboard>
  );
};

export default ReturnEmpties;
