import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../../assets/svg/modalIcons";
import countryConfig from "../../../utils/changesConfig.json";
import { useTranslation } from "react-i18next";

const RegisterCustomerStepThree = ({
	onSubmit,
	handleChange,
	setWarningModal,
	values,
	previousPage,
	setOpen,
}) => {
	const { t } = useTranslation();
	const {
		sysproCode,
		salesforceCode,
		distCode,
		salesRepEmployeeNumber,
		salesRepName,
		salesRepEmail,
		ccountry,
		salesRepPhone,
		minimumOrderValue,
		priceListId,
		reward,
		country,
		userCountry,
		open,
		loader,
	} = values;

	const [formCompleted, setFormCompleted] = useState(false);

	useEffect(() => {
		if (ccountry === "Uganda" || ccountry === "Tanzania") {
			if (
				distCode !== "" &&
				salesRepEmail !== "" &&
				salesRepEmployeeNumber !== "" &&
				salesRepName !== "" &&
				salesRepPhone !== "" &&
				minimumOrderValue !== "" &&
				priceListId !== "" &&
				reward !== ""
			) {
				setFormCompleted(true);
			} else {
				setFormCompleted(false);
			}
		} else {
			if (sysproCode !== "") {
				setFormCompleted(true);
			} else {
				setFormCompleted(false);
			}
		}
	});

	{
		/* customer Modal - Step 3 */
	}
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="fixed z-10 inset-0 overflow-y-auto"
				onClose={setOpen}
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
						<form
							className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal"
							role="form"
							onSubmit={onSubmit}
						>
							<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal">
								<div className="h-modal overflow-y-scroll scrollbar-hide">
									<CloseModal
										className="ml-auto m-4 mb-0"
										onClick={() => setWarningModal(true)}
									/>
									<div className="mb-8 mx-6 flex justify-between items-center px-6">
										<p>
											<span
												style={{ fontSize: "32px" }}
												className="font-customGilroy not-italic font-normal grey-100"
											>
												{t("new_customer")}
											</span>{" "}
											<span
												style={{ fontSize: "24px" }}
												className="font-customGilroy not-italic font-normal grey-100"
											>
												(Step 3 of 3)
											</span>
										</p>
									</div>
									<div className="mt-2 px-12">
										<div className="flex justify-between">
											<div className="mb-6">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{country === "South Africa"
														? "Stp Code"
														: t("salesforce_code_required")}
												</label>
												<input
													onChange={handleChange}
													value={salesforceCode}
													name="salesforceCode"
													type="text"
													placeholder={t("type_here")}
													className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
												/>
											</div>
											{distCode ? (
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
														{t("dist_code")}
													</label>
													<div className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4">
														{distCode}
													</div>
												</div>
											) : (
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
														{t("dist_code") + "(required)*"}
													</label>
													<input
														required
														onChange={handleChange}
														value={sysproCode}
														name="sysproCode"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
													/>
												</div>
											)}
										</div>
										<div className="mb-6">
											<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
												{t("bdr_name_required")}{" "}
												{/* {ccountry === "Uganda" ||
												ccountry === "Tanzania"
													? "(required)*"
													: ""} */}
											</label>
											<input
												required={
													ccountry === "Uganda" ||
													ccountry === "Tanzania"
												}
												onChange={handleChange}
												value={salesRepName}
												name="salesRepName"
												type="text"
												placeholder={t("type_here")}
												className="bg-white rounded block w-full border border-solid border-grey-25 font-customGilroy text-base font-medium not-italic py-3 px-4"
											/>
										</div>
										<div className="flex justify-between">
											<div className="mb-6">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("bdr_email_required")}{" "}
													{/* {ccountry === "Uganda" ||
													ccountry === "Tanzania"
														? "(required)*"
														: ""} */}
												</label>
												<input
													required={
														ccountry === "Uganda" ||
														ccountry === "Tanzania"
													}
													onChange={handleChange}
													value={salesRepEmail}
													name="salesRepEmail"
													type="email"
													placeholder={t("type_here")}
													className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
												/>
											</div>
											<div className="mb-6">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("bdr_employee_number_required")}{" "}
													{/* {ccountry === "Uganda" ||
													ccountry === "Tanzania"
														? "(required)*"
														: ""} */}
												</label>
												<input
													required={
														ccountry === "Uganda" ||
														ccountry === "Tanzania"
													}
													onChange={handleChange}
													value={salesRepEmployeeNumber}
													name="salesRepEmployeeNumber"
													type="number"
													placeholder={t("type_here")}
													className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
												/>
											</div>
										</div>
										<div className="flex justify-between">
											<div className="mb-6">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("bdr_phone_required")}{" "}
													{/* {ccountry === "Uganda" ||
													ccountry === "Tanzania"
														? "(required)*"
														: ""} */}
												</label>
												<input
													required={
														ccountry === "Uganda" ||
														ccountry === "Tanzania"
													}
													onChange={handleChange}
													value={salesRepPhone}
													name="salesRepPhone"
													type="number"
													placeholder="Type here"
													className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
												/>
											</div>
											<div className="mb-12">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("price_list_id")}{" "}
													{ccountry === "Uganda" ||
													ccountry === "Tanzania"
														? "(required)*"
														: ""}
												</label>
												<select
													required={
														ccountry === "Uganda" ||
														ccountry === "Tanzania"
													}
													onChange={handleChange}
													value={priceListId}
													name="priceListId"
													type="text"
													placeholder={t("type_here")}
													className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
												>
													<option value="N/A">N/A</option>
													<option value="UG_C">UG_C</option>
													<option value="UG_E">UG_E</option>
													<option value="TZ_DAR_TBL_List_Price">
														TZ_DAR_TBL_List_Price
													</option>
													<option value="TZ_NE_TBL_List_Price">
														TZ_NE_TBL_List_Price
													</option>
													<option value="TZ_NW_TBL_List_Price">
														TZ_NW_TBL_List_Price
													</option>
													<option value="TZ_FS_TBL_List_Price">
														TZ_FS_TBL_List_Price
													</option>
													<option value="TZ_ZNZ_TBL_List_Price">
														TZ_ZNZ_TBL_List_Price
													</option>
												</select>
											</div>
										</div>
										<div className="flex justify-between">
											<div className="mb-12">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("minimum_order_value_required")}{" "}
													{/* {ccountry === "Uganda" ||
													ccountry === "Tanzania"
														? "(required)*"
														: ""} */}
												</label>
												<input
													required={
														ccountry === "Uganda" ||
														ccountry === "Tanzania"
													}
													onChange={handleChange}
													value={minimumOrderValue}
													name="minimumOrderValue"
													type="number"
													placeholder="Type here"
													className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
												/>
											</div>
											<div className="mb-12">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("eligible_for_reward")}{" "}
													{ccountry === "Uganda" ||
													ccountry === "Tanzania"
														? "(required)*"
														: ""}
												</label>
												<select
													required={
														ccountry === "Uganda" ||
														ccountry === "Tanzania"
													}
													onChange={handleChange}
													value={reward}
													name="reward"
													type="text"
													placeholder={t("type_here")}
													className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
												>
													<option value="Yes">Yes</option>
													<option value="No">No</option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
									<button
										type="submit"
										className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2 mr-6"
										style={{
											opacity:
												!formCompleted || loader ? "0.3" : "1",
											backgroundColor:
												countryConfig[userCountry].buttonColor,
											color: countryConfig[userCountry].textColor,
										}}
										disabled={!formCompleted || loader ? true : false}
									>
										<p className="text-center">
											{/* {" "} */}
											{loader ? t("saving") : t("save")}
										</p>
									</button>
									<button
										className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2 ml-6"
										style={{
											backgroundColor:
												countryConfig[userCountry].buttonColor,
											color: countryConfig[userCountry].textColor,
										}}
										onClick={previousPage}
									>
										<p className="text-center"> {t("previous")}</p>
									</button>
								</div>
							</div>
						</form>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default RegisterCustomerStepThree;
