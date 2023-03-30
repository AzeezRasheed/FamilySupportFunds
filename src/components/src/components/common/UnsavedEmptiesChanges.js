import React, { Fragment, useRef, useState, useEffect } from "react";
import { cloneDeep, concat } from "lodash";
import { Dialog, Transition } from "@headlessui/react";
import { Fade } from "react-reveal";
import { useDispatch, useSelector } from "react-redux";
import whiteLogo from "../../assets/svg/whiteLogo.svg";
import { CloseModal, Checked } from "../../assets/svg/modalIcons";
import ApprovalModal from "../../modules/Admin/components/ApprovalModal";
import Loading from "./Loading";
import {
	discardChanges,
	getAllInventory,
	saveInventory,
	receiveEmpties,
	updateEmptiesQuantity,
	getTotalEmpties,
	returnQuantity,
	updateTransferChange,
} from "../../modules/Inventory/actions/inventoryProductAction";
import {updateCustomer} from "../../modules/Admin/customer/actions/customer"
import { useHistory, useParams } from "react-router-dom";
import { inventoryNet } from "../../utils/urls";
import { useTranslation } from "react-i18next";
import countryConfig from "../../utils/changesConfig.json";
import { getLocation } from "../../utils/getUserLocation";

const UnsavedTransferChanges = () => {
	const { t } = useTranslation();
		const { Dist_Code } = useParams();

	const transferChange = useSelector(
		(state) => state.InventoryReducer.transferChange
	);

	const returnEmpties = useSelector(
		(state) => state.InventoryReducer.return_quantities
	);

	const loadingState = useSelector((state) => state.InventoryReducer.loading);
	const openReceiveEmpties = useSelector(
		(state) => state.InventoryReducer.receive_empties_quantities
	);
	const customer = useSelector((state) => state.CustomerReducer.customer);
	let dist_code = useSelector((state) => state.DistReducer.dist_code);
	if (!dist_code) {
		dist_code = Dist_Code;
	}


	const [approvalModal, setApprovalModal] = useState(false);
	const [successModal, setSuccessModal] = useState(false);
	const [open, setOpen] = useState(false);
	const [save, setSave] = useState(openReceiveEmpties.length > 0 ? t("yes_receive") : t("yes_return"));
	const [loading, setLoading] = useState(false);
	const cancelButtonRef = useRef(null);
	const dispatch = useDispatch();
	const history = useHistory();
	let AuthData = useSelector((state) => state.Auth.sessionUserData);
	const roles = AuthData.roles;

	const [country, setCountry] = useState(AuthData.country);

	useEffect(async () => {
		const loc = await getLocation();
		setCountry(loc);
	});


	// const fromLocation = useSelector(
	//   (state) => state.DropPointReducer.from_dropPoint
	// );
	// const toLocation = useSelector(
	//   (state) => state.DropPointReducer.to_dropPoint
	// );

	const handleReset = () => {
		setApprovalModal(false);
		setOpen(true);
	};
	const updateDB = () => {
		let processedArray = returnEmpties?.map((item) => ({
			productId: parseInt(item.productId),
			quantity: parseInt(item.quantity),
		}));

		let toDB = {
			companyCode: dist_code,
		};
		// toDB["companyCode"] = dist_code;
		setSave(t("updating"));
		setLoading(true);
		if (openReceiveEmpties.length > 0) {
			toDB["customerName"] = customer.customerName;
			toDB["phoneNumber"] = customer.phoneNumber;
			toDB["stocks"] = openReceiveEmpties;
			//addInitialEmpties(toDB)
			const inventory = inventoryNet();
			inventory.post("empties/take-in", toDB).then((response) => {
				setApprovalModal(false);
				setSuccessModal(true);
				setSave(t("yes_recieve"));
				setLoading(false);
				dispatch(updateEmptiesQuantity(false));
				dispatch(receiveEmpties([]));
				dispatch(getAllInventory(dist_code));
				dispatch(getTotalEmpties(dist_code));
        dispatch(updateCustomer({}));
				setTimeout(() => {
					history.push("/dashboard/inventory/" + dist_code);
				}, 1000);
			});
		} else if(returnEmpties){
			toDB["stocks"] = processedArray;

			const inventory = inventoryNet();
			inventory.post("empties/take-out", toDB).then((response) => {
				setApprovalModal(false);
				setSuccessModal(true);
				setSave(t("yes_return"));
				setLoading(false);
				dispatch(updateEmptiesQuantity(false));
				dispatch(returnQuantity([]))
				dispatch(getAllInventory(dist_code));
				dispatch(getTotalEmpties(dist_code));
				setTimeout(() => {
					history.push("/dashboard/inventory/" + dist_code);
				}, 1000);
			});
		}
		
	else {
			toDB["stocks"] = processedArray;

			const inventory = inventoryNet();
			inventory.post("return-empties/", toDB).then((response) => {
				setApprovalModal(false);
				setSuccessModal(true);
				setSave(t("yes_return"));
				setLoading(false);
				dispatch(updateEmptiesQuantity(false));
				dispatch(getAllInventory(dist_code));
				setTimeout(() => {
					history.push("/dashboard/inventory/" + dist_code);
				}, 2000);
			});
		}

		// dispatch(saveInventory(toDB, dist_code));
	};

	return (
		<>
			<Fade>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						boxShadow: "0px 4px 16px rgba(89, 85, 84, 0.15)",
						width: "100%",
						paddingLeft: "0.75em",
						paddingRight: 80,
						paddingTop: "0.75em",
						paddingBottom: "0.75em",
						backgroundColor: countryConfig[country].primaryColor,
					}}
					className="shadow-xl h-20 p-3">
					<div style={{ width: 100 }}></div>
					{/* <img src={whiteLogo} width="178px" height="48px" alt="logo" /> */}
					<div
						className="font-customGilroy"
						style={{
							fontStyle: "italic",
							fontWeight: "bold",
							color: countryConfig[country].textColor,
							fontSize: 20,
							paddingTop: 12,
							paddingBottom: 12,
						}}>
						{t("you_have_unsaved_changes_Do_you_want_to_save_your_changes?")}
					</div>
					<div
						style={{ display: "inline-flex", justifyContent: "space-between" }}>
						<div
							className="border border-white rounded p-3"
							style={{
								backgroundColor: "transparent",
								color: "#FFFFFF",
								fontSize: 16,
								fontWeight: 600,
								textAlign: "center",
								marginRight: 24,
								cursor: "pointer",
							}}
							onClick={() => {
								dispatch(discardChanges());
								window.location.reload();
							}}>
							{t("discard_changes")}
						</div>
						{roles === "Mini-Admin" ? (
							<div
								className="rounded p-3"
								style={{
									backgroundColor: "#BEBEBE",
									color: "black",
									fontSize: 16,
									fontWeight: 600,
									textAlign: "center",
									width: 88,
									cursor: "pointer",
								}}>
								Save
							</div>
						) : (
							<div
								className="rounded p-3"
								style={{
									backgroundColor: countryConfig[country].unsavedButtonColor,
									color: countryConfig[country].unsavedButtonTextColor,
									fontSize: 16,
									fontWeight: 600,
									textAlign: "center",
									width: 88,
									cursor: "pointer",
								}}
								onClick={() => setApprovalModal(true)}>
								{t("save")}
							</div>
						)}
					</div>
				</div>
			</Fade>

			<Transition.Root show={approvalModal} as={Fragment}>
				<Dialog
					as="div"
					className="fixed z-10 inset-0 overflow-y-auto"
					initialFocus={cancelButtonRef}
					onClose={setApprovalModal}>
					<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
						</Transition.Child>

						{/* This element is to trick the browser into centering the modal contents. */}
						<label
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true">
							&#8203;
						</label>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
							<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-mini-modal">
								<CloseModal
									className="ml-auto m-4 mb-0"
									onClick={handleReset}
								/>
								<div className="h-mini-modal flex justify-center items-center">
									<p className="font-customGilroy not-italic text-base font-medium">
										{save === t("yes_receive")? t("are_you_sure_you_want_to_receive_your_selection(s)?") :  t("are_you_sure_you_want_to_return_your_selection(s)?")}
									</p>
								</div>
								<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
									<button
										className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
										onClick={() => updateDB()}
										style={{
											display: "flex",
											backgroundColor: countryConfig[country].buttonColor,
											color: countryConfig[country].textColor,
										}}>
										{save}
										{loading ? <Loading /> : ""}
									</button>

									<button
										className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
										onClick={handleReset}>
										{t("cancel")}
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
					onClose={setSuccessModal}>
					<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
						</Transition.Child>

						{/* This element is to trick the browser into centering the modal contents. */}
						<label
							className="hidden sm:inline-block sm:align-middle sm:h-screen"
							aria-hidden="true">
							&#8203;
						</label>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
							<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
								<button
									className="flex justify-center ml-auto m-4 mb-0"
									onClick={() => setSuccessModal(false)}
									style={{
										backgroundColor: countryConfig[country].buttonColor,
										color: countryConfig[country].textColor,
									}}>
									<CloseModal />
								</button>
								<div className="flex flex-col justify-center items-center w-modal h-sub-modal -mt-12">
									<Checked />
									<p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
										{t("your_inventory_has_been_updated")}
									</p>
								</div>
								<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
									<button
										className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
										onClick={() => setSuccessModal(false)}
										style={{
											backgroundColor: countryConfig[country].buttonColor,
											color: countryConfig[country].textColor,
										}}>
										{t("okay")}
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

export default UnsavedTransferChanges;

const styles = {
	container: {
		display: "flex",
		justifyContent: "space-between",
		background: "#B11F24",
		boxShadow: "0px 4px 16px rgba(89, 85, 84, 0.15)",
		width: "100%",
		paddingLeft: "0.75em",
		paddingRight: 80,
		paddingTop: "0.75em",
		paddingBottom: "0.75em",
	},
	text: {
		fontStyle: "italic",
		fontWeight: "bold",
		color: "#FFFFFF",
		fontSize: 20,
		paddingTop: 12,
		paddingBottom: 12,
	},
};
