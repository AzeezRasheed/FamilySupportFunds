import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../../assets/svg/modalIcons";
import countryConfig from "../../../utils/changesConfig.json";
import { useTranslation } from "react-i18next";
import csv from '../../../assets/svg/csv.svg'
import UploadCSVModal from "./UploadCSVModal";

const RegisterCustomerStepOne = ({
	nextPage,
	handleChange,
	values,
	onSubmit,
	setWarningModal,
	setOpen,
	step,
}) => {
	const { t } = useTranslation();
	const {
		firstName,
		lastName,
		email,
		businessName,
		ccountry,
		phone,
		segment,
		subSegment,
		userCountry,
		open,
		loader,
	} = values;

	const [formCompleted, setFormCompleted] = useState(false);
	const [showCSVModal, setShowCSVModal] = useState(false);

	useEffect(() => {
		if (
			firstName !== "" &&
			lastName !== "" &&
			email !== "" &&
			businessName !== "" &&
			phone !== "" &&
			segment !== "" &&
			subSegment !== ""
		) {
			setFormCompleted(true);
		} else {
			setFormCompleted(false);
		}
	});

	{
		/* customer Modal - Step 1 */
	}
	return (
		<>
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
								<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle w-modal">
									<div className="h-fit max-h-screen overflow-y-scroll scrollbar-hide">
										<div className="flex justify-between pl-12 pr-6 py-4">
											<div className="flex items-center">
												<button
													className="custom-button flex items-center justify-center pl-1 pr-3 py-2"
													onClick={() => setShowCSVModal(true)}
												>
													<img
														src={csv}
														style={{ width: "25px" }}
														className="h-auto w-auto"
													/>
													<span>{t("Upload")}</span>
												</button>
												<span className="text-sm ml-3">Bulk Upload Customer Data</span>
											</div>
											<div className="flex items-center justify-center close">
												<CloseModal onClick={() => setWarningModal(true)} />
											</div>
										</div>
										<hr />
										<div className="mb-8 mx-6 flex justify-between items-center px-6 mt-4">
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
													(Step 1 of 3)
												</span>
											</p>
										</div>
										<div className="mt-2 px-12">
											<div className="flex justify-between">
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
														{t("customer_first_name") + "(required)*"}
													</label>
													<input
														required
														onChange={handleChange}
														value={firstName}
														name="firstName"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
													/>
												</div>
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
														{t("customer_last_name") + "(required)*"}
													</label>
													<input
														required
														onChange={handleChange}
														value={lastName}
														name="lastName"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
													/>
												</div>
											</div>
											<div className="mb-6">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("business_name") + "(required)*"}
												</label>
												<input
													required
													onChange={handleChange}
													value={businessName}
													name="businessName"
													type="text"
													placeholder="Type here"
													className="bg-white rounded block w-full border border-solid border-grey-25 font-customGilroy text-base font-medium not-italic py-3 px-4"
												/>
											</div>
											<div className="mb-6">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("phone_number") + "(required)*"}
												</label>
												<input
													required
													onChange={handleChange}
													value={phone}
													name="phone"
													type="number"
													placeholder="Type here"
													className="bg-white rounded block w-full border border-solid border-grey-25 font-customGilroy text-base font-medium not-italic py-3 px-4"
												/>
											</div>
											<div className="mb-6">
												<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("email_address") + "(required)*"}
												</label>
												<input
													required
													onChange={handleChange}
													value={email}
													name="email"
													type="email"
													placeholder="Type here"
													className="bg-white rounded block w-full border border-solid border-grey-25 font-customGilroy text-base font-medium not-italic py-3 px-4"
												/>
											</div>
											<div className="flex justify-between">
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
														{t("segment") + "(required)*"}
													</label>
													<select
														required
														onChange={handleChange}
														value={segment}
														name="segment"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
													>
														<option value="POC">POC</option>
														<option value="Bulk Breaker">Bulk Breaker</option>
													</select>
												</div>
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
														{t("sub_segment") + "(required)*"}
													</label>
													<select
														required
														onChange={handleChange}
														value={subSegment}
														name="subSegment"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
													>
														<option value="Reseller">Reseller</option>
														<option value="Mainstream">Mainstream</option>
														<option value="High End">High End</option>
														<option value="Low End">Low End</option>
													</select>
												</div>
											</div>
										</div>
									</div>
									<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
										<button
											className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2 mr-6"
											style={{
												opacity: formCompleted || loader ? "1" : "0.3",
												backgroundColor: countryConfig[userCountry].buttonColor,
												color: countryConfig[userCountry].textColor,
											}}
											disabled={!formCompleted || loader ? true : false}
											onClick={nextPage}
										>
											<p className="text-center"> {t("next")}</p>
										</button>
										<button
											className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2 ml-6"
											onClick={() => setWarningModal(true)}
										>
											{t("cancel")}
										</button>
									</div>
								</div>
							</form>
						</Transition.Child>
					</div>
					<UploadCSVModal
						setShowModal={setShowCSVModal}
						showModal={showCSVModal}
					/>
				</Dialog>
			</Transition.Root>
		</>
	);
};

export default RegisterCustomerStepOne;