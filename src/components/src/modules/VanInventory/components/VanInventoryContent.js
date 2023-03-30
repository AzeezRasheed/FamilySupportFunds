import React, { useState, useEffect } from "react";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import warehouse from "../../../assets/svg/delivery-man.svg";
import Loading from "../../../components/common/Loading";
import SortImg from "../../../assets/svg/sort.svg";
import { connect } from "react-redux";
import noOrder from "../../../assets/svg/noOrders.svg";
import { getAllSingleVanInventory } from "../actions/vanAction";
import { getAllDriversByOwnerId } from "../../Admin/order/actions/orderAction";
import { useTranslation } from "react-i18next";
import SearchFiltersVanInventory from "../../../components/common/SearchFiltersVanInventory";
import { getProductList, getSkuList } from "../../../utils/filters";
import { formatEmptiesQuantity } from "../../../utils/helperFunction";
import { formatNumber } from '../../../utils/formatNumber';

const Tabs = ({
	location,
	code,
	top,
	vanInventoryData,
	allDrivers,
	getAllDriversByOwnerId,
	getAllSingleVanInventory,
}) => {
	
	const {t} = useTranslation()
	const [driver, setDriver] = useState();
	const driverId = +driver;
	const [tempInventory, setTempInventory] = useState(vanInventoryData);
	const skuList = getSkuList(vanInventoryData);
	const productList = getProductList(vanInventoryData);

	useEffect(() => {
		getAllSingleVanInventory(driverId !== 0 ? driverId : null);
		getAllDriversByOwnerId(code);
	}, [driverId, driver]);

	useEffect(()=>{
		if(allDrivers.length > 0 && !driver){
			setDriver(allDrivers[0]?.vehicleId)
		}	
	},[allDrivers])

	useEffect(()=>{
		if(vanInventoryData.length>0){
			setTempInventory(vanInventoryData)
		}
	}, [vanInventoryData])


	return (
		<>
			<div
				className={`relative flex flex-col min-w-0 break-words bg-white w-full mb-6 ${top} shadow-lg rounded`}
			>
				<div className="flex flex-wrap">
					<div className="w-full">
						<div className="py-5 flex-auto">
							<div className="tab-content tab-space">
								<div className="block">
									<div className="flex pl-8 pb-3">
										<img className="" alt="" src={warehouse} />
										{allDrivers.length > 0 ? (
											<select
												className="outline-none mx-3 px-2"
												value={driver}
												onChange={(e) => {
													e.preventDefault();
													setDriver(e.target.value);
												}}
											>
												<option value={allDrivers[0].vehicleId}>{allDrivers[0].name} ({allDrivers[0].vehicleId})</option>
												{allDrivers.slice(1)?.map((driver, index) => (
													<option
														key={index}
														value={driver?.vehicleId}
														name="driver"
														className="font-medium"
													>
														{driver?.name !== "Select Driver" && driver?.name} ({driver?.vehicleId})
													</option>
												))}
											</select>
										) : (
											<div className="mx-4 mt-1 font-medium">
												{t("no_drivers_available")}
											</div>
										)}
									</div>
									<div className="mt-3 filters flex w-full ">
										<SearchFiltersVanInventory
											tempInventory={tempInventory}
											allInventory={vanInventoryData}
											setTempInventory={setTempInventory}
											skusList={skuList}
											productList={productList}
										/>
						
									</div>
									<table className="table-cont flex flex-col flex-no wrap sm:table-row md:min-w-full lg:min-w-full mt-8 divide-y divide-gray-200">
										<thead className="bg-transparent table-head">
											<tr className="">
												<th
													scope="col"
													className="px-12 pt-10 md:w-96 py-3 text-left text-sm font-medium text-black tracking-wider"
												>
													{t("product")}
												</th>
												<th
													scope="col"
													className="px-6 md:w-96 py-3 pt-10 text-left text-sm font-medium text-black  tracking-wider"
												/>
												<th
													scope="col"
													className="px-6 md:w-96 py-3 pt-10 text-left text-sm font-medium text-black  tracking-wider"
												>
													SKU
												</th>
												<th
													scope="col"
													className="px-6 md:w-96 py-3 pt-10 text-left text-sm font-medium text-black  tracking-wider"
												/>
												<th
													scope="col"
													className="px-6 md:w-96 py-3 pt-10 text-left text-sm font-medium text-black  tracking-wider"
												>
													{t("quantity")}
													<span
														// className="px-4 text-xs leading-5 font-semibold rounded-full bg-green-100 text-white w-[43px]"
														className="block text-white py-0.5 px-2 rounded-3xl w-min text-xs mt-1 bg--blue mt-2"
														>Fulls</span>
												</th>
											
												<th
													scope="col"
													className="px-6 md:w-96 py-3 pt-10 text-left text-sm font-medium text-black  tracking-wider"
												>
													{t("quantity")}
													<span
														className="block text-white py-0.5 px-2 rounded-3xl w-min text-xs mt-1 bg--accent mt-2"
														>Empties</span>
												</th>
											</tr>
										</thead>
										<tbody className="bg-white table-head px-6 divide-y divide-gray-200">
											{!driver && vanInventoryData.length === 0 ? (
												<tr className="my-8 justify-center">
													<td colSpan={9}>
														<img alt="" className="m-auto" src={noOrder} />
													</td>
												</tr>
											) : !vanInventoryData.length && driver !== 'Select Driver' ? (
												<tr>
													<td colSpan={9}>
														<center style={{ marginTop: 20, marginBottom: 20 }}>
															<Loading />
															<Loading />
															<Loading />
														</center>
													</td>
												</tr>
											) : (
												driver !== 'Select Driver' && vanInventoryData &&
												(tempInventory).map(({ product, quantity, id, empty}, i) => (
													<tr key={id}>
														<td className="px-12 md:w-96 py-4 whitespace-nowrap">
															<div className="flex items-center">
																<div className="flex-shrink-0 h-20 w-10">
																	<img
																		className="h-20 w-10 rounded-full"
																		src={product?.imageUrl}
																		alt={product?.brand}
																	/>
																</div>
																<div className="ml-4">
																	<div className="text-sm font-medium text-gray-900">
																		{product?.brand}
																		
																	</div>
																	{ }
																	
																</div>
															</div>
														</td>
														<td className="px-6 md:w-96 py-2 " />
															
														<td className="px-6 md:w-96 py-2 ">
															<div className="text-sm my-1 text-gray-500">
																{product?.sku} x {product?.name?.substring(0,2)} (
																	{product?.productType === "full"? "RB":product?.productType.toUpperCase()})
																	
															</div>
														</td>
														<td className="px-6 md:w-96 py-2 " />
														<td className="md:w-96 py-2 ">
															<div className=" font-normal text-sm text-center w-20">
															{formatNumber(quantity)}
															</div>
														</td>
													
														<td className="px-6 md:w-96 py-2 ">
															<div className={`text-sm w-48 px-6 ${formatEmptiesQuantity(product?.productType, empty) === 'Nil' && 'text--accent'}`}>
															{formatEmptiesQuantity(product?.productType, empty)}
															</div>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
const mapStateToProps = (state) => {
	return {
		vanInventoryData: state.VanInventoryReducer.all_single_van_inventory,
		allDrivers: state.OrderReducer.all_drivers,
	};
};

export default connect(mapStateToProps, {
	getAllSingleVanInventory,
	getAllDriversByOwnerId,
})(Tabs);
