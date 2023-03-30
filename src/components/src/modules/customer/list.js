import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { Dialog, Transition } from "@headlessui/react";
import Dashboard from "../../Layout/Dashboard";
import { CloseModal, UploadFile, Checked } from "../../assets/svg/modalIcons";
import { CustomerList } from "../../utils/data";
import arrowDown from "../../assets/svg/arrowDown.svg";
import SortImg from "../../assets/svg/sort.svg";
import noOrder from "../../assets/svg/noOrders.svg";
import {
  Previouspage,
  Progination,
  Redirect,
} from "../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom";
import {
  getAllCustomers,
  getAllDistributorCustomers,
} from "../Admin/customer/actions/customer";
import countryConfig from '../../utils/changesConfig.json'
import { getLocation } from '../../utils/getUserLocation'
import Pagination from "../Admin/components/pagination";
import { getSingleDistributor } from "../Admin/pages/actions/adminDistributorAction";
import Loading from "../../components/common/Loading";
import LoadingList from "../../components/common/LoadingList";
import { filter, findLastIndex, uniqBy } from "lodash";
import moment from "moment";
import { connect } from "react-redux";
import { setDistCode } from "../Distributors/actions/DistributorAction";
import { discardChanges } from "../Inventory/actions/inventoryProductAction";
import { customerTypeBasedOnCountry } from "../../utils/custormerType";
import { useTranslation } from "react-i18next";
import qs from "qs";
// import DistributorNavbar from '../components/navbar';

const Customers = ({
  location,
  distributor,
  allDistCustomers,
  getAllDistributorCustomers,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const { Dist_Code } = useParams();
  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  if (!dist_code) {
    dispatch(setDistCode(Dist_Code));
  }
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
	const [tab, setTab] = useState("");
  const [customerData, setCustomerData] = useState("");
  const [open, setOpen] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const history = useHistory();
  const formCompleted = false;
	const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;

	const [userCountry, setUserCountry] = useState('Ghana');


	useEffect(async () => {
		const loc = await getLocation();
		setUserCountry(loc);
	})

	 useEffect(() => {
    const filterParams = history.location.search.substr(1);
    const filtersFromParams = qs.parse(filterParams);
    if (filtersFromParams.tab) {
      setTab(filtersFromParams.tab);
    }
  }, []);
		
useEffect(()=>{
	    history.push(`?tab=${tab}`);
	if(customerData === "" && tab !== ""){
		setCustomerData(tab)
	}
},[customerData,tab])

	const fetchCustomers = () => {
		return allDistCustomers && allDistCustomers.filter((data) => {
			return (
				data?.CUST_Name !== null && String(data?.CUST_Name.toLowerCase()).startsWith(`${customerData.toLowerCase()}`) ||
				data?.CUST_Type !== null && data?.CUST_Type.toLowerCase().includes(
					`${customerData.toLowerCase()}`
				) ||
				data?.bdr !== null && data?.bdr.toLowerCase().includes(`${customerData.toLowerCase()}`) ||
				data?.status !== null && data?.status.toLowerCase().includes(`${customerData.toLowerCase()}`)
			);
		});
	};

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      allDistCustomers && fetchCustomers().slice(firstPageIndex, lastPageIndex)
    );
  };
	const sys_code = distributor.SYS_Code
	useEffect(() => {
		getAllDistributorCustomers(sys_code)
			;
		setDataLoaded(true);
		dispatch(discardChanges());
	}, [country, sys_code, allDistCustomers.length]);

	useEffect(() => {
		currentTableData();
	}, [currentPage])

  const distOrders = useSelector((state) => state.OrderReducer.all_orders);

  const completedOrders = filter(distOrders, function (order) {
    return (
      order.routeName === "Walk-In-Sales" ||
      order.routeName === "Van-Sales" ||
      order.routeName === "SalesForce"
    );
  });

  const uniqueCompletedOrders = uniqBy(completedOrders, "buyerCompanyId");

	const getCustomerDetails = (SF_Code) => {
		const thisCustomer = filter(allDistCustomers, { SF_Code: SF_Code })[0];
		return thisCustomer;
	};

  const getCustTotalOrders = (CustID) => {
    const thisCustOrders = filter(completedOrders, { buyerCompanyId: CustID });
    const totalAmountSpent = thisCustOrders.reduce(
      (a, b) => parseFloat(a) + parseFloat(b.totalPrice),
      0
    );
    const lastOrderIndex = findLastIndex(distOrders, {
      buyerCompanyId: CustID,
    });

    const lastOrderDate =
      lastOrderIndex >= 0
        ? thisCustOrders[lastOrderIndex]?.datePlaced
        : "Not ordered yet";
    return {
      totalOrders: thisCustOrders.length,
      totalAmountSpent: totalAmountSpent,
      lastOrderDate: lastOrderDate,
    };
  };

  if (allDistCustomers?.length > 0 && loadingState) {
    setLoadingState(false);
  }

  const cancelButtonRef = useRef(null);

  const handleReset = () => {
    setWarningModal(false);
    setOpen(true);
  };

  const handleApproval = () => {
    setOpen(false);
    setWarningModal(false);
    setApprovalModal(true);
  };

  const pushTomanageCustomer = (custID) => {
    history.push("/dashboard/manage-customer/" + dist_code + "/" + custID);
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

	const borderActive = countryConfig[userCountry].borderBottomColor;

	return (
		<Dashboard location={location}>
			<div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
				<div className="flex justify-between items-center">
					<div className="flex gap-4">
						<p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
							{t("customers")}
						</p>
					</div>
				</div>
				<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
					<div className="block tab-content tab-space pb-5 flex-auto w-full">
						<div className="flex flex-row justify-between items-center border-b h-16 px-8">
							<div className={`flex justify-between items-center font-customGilroy text-base font-medium not-italic text-grey-85 h-full 
								${country === "Mozambique" ? 'w-8/12' : 'w-50'}`}
							>
								<li className="flex cursor-pointer">
									<a
										className={
											"flex font-customGilroy pt-6 px-3 text-base font-normal cursor-pointer" +
											(customerData === ""
												? "text-active border-b-4 rounded"
												: "text-default")
										}
										style={{ borderColor: customerData === "" ? borderActive : "" }}
										onClick={(e) => {
											e.preventDefault();
											setCustomerData("");
											setTab("")
										}}
									>
										{t("registered_customers")}
									</a>
								</li>
								{customerTypeBasedOnCountry(
									country,
									customerData,
									setCustomerData,
									tab,
									setTab,
									borderActive
								)}
							</div>
						</div>
						<div className="flex mt-3 px-4">
							<input
								className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
								id="search"
								type="text"
								name="search"
								style={{ width: "26.063rem", backgroundColor: "#E5E5E5" }}
								onChange={(e) => setCustomerData(e.target.value)}
								placeholder={t("search_for_customer")}
							/>
							<div className="flex pt-1">
								{/* <div
                    className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <p className="text-default font-normal">
                      All locations(s)
                    </p>{" "}
                    <img className="pl-3 pr-2" src={arrowDown} alt="" />
                  </div> */}
                {/* <div
                    className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block  bg-white border-default-b border-2"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <p className="text-default font-normal">Any Status</p>{" "}
                    <img className="pl-3 pr-2" src={arrowDown} alt="" />
                  </div> */}
                {/* <div className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                    <img className="pr-2" src={SortImg} alt="" />
                    <p className="text-default font-normal">Sort By</p>
                  </div> */}
              </div>
            </div>

						{!loadingState ? (
							<div className="tab-content tab-space">
								<div className="">
									<table className="min-w-full mt-8 divide-y divide-gray-200">
										<thead className="bg-transparent ">
										<tr className="">
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          S/N
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("customer_code")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("customer_type")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("customer_name")}
                        </th>
												<th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("customer_stp")}
                      </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          Distributor Code
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("status")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("registration")} <br />
                          {t("date")}
                        </th>
                      </tr>
										</thead>
										<tbody
											className="bg-white px-6 divide-y divide-gray-200"
											id="filterTBody"
										>
											{allDistCustomers?.length === 0 ? (
												<tr className="my-8 justify-center">
													<td colSpan={9}>
														<img className="m-auto" src={noOrder} alt="" />
													</td>
												</tr>
											) : (
													allDistCustomers &&
													currentTableData().map((customer, index) => (
														<tr
															key={index}
															onClick={() =>
																pushTomanageCustomer(customer?.SF_Code)
															}
															className="cursor-pointer"
														>
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
																{index + 1 + "."}
															</td>
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
																{customer?.SF_Code}
															</td>
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
																{customer?.CUST_Type}
															</td>
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
																{customer?.CUST_Name
																	? customer?.CUST_Name
																	: "Not Available"}
															</td>
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer?.account_id
                              ? customer?.account_id
                              : "N/A"}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer?.DIST_Code ? customer?.DIST_Code : "N/A"}
                          </td>
															{customer?.status === "Active" ? (
																<td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
																	<button className="rounded-full bg-green-500 py-1 px-3">
																		{customer?.status}
																	</button>
																</td>
															) : (
																	<td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
																		<button className="rounded-full bg-red-500 py-1 px-3">
                                    {t("inactive")}
																</button>
																	</td>
																)}
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
																{customer?.registeredOn}
															</td>
														</tr>
													))
												)}
										</tbody>
									</table>
								</div>
							</div>
						) : (
								<LoadingList />
							)}
						{dataLoaded && allDistCustomers.length === 0
							? // <div
							//   className="px-6"
							//   style={{ textAlign: "center", color: "#9799A0", marginTop: 30, marginBottom: 30 }}
							// >
							//   You do not have any customer
							// </div>
							""
							: ""}
						<hr />
						<div className="flex justify-end items-center gap-4 mr-20 mt-6">
							<Pagination
								className="pagination-bar"
								currentPage={currentPage}
								totalCount={fetchCustomers().length}
								pageSize={PageSize}
								onPageChange={(page) => setCurrentPage(page)}
							/>
						</div>
					</div>
				</div>

        {/* customer Modal */}
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
								<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-modal">
									<div className="h-modal overflow-y-scroll scrollbar-hide">
										<CloseModal
											className="ml-auto m-4 mb-0"
											onClick={() => setWarningModal(true)}
										/>
										<div className="-mt-2 px-12">
											<div className="flex justify-between items-center mb-10">
												<p className="font-customGilroy text-basex2 not-italic font-normal grey-100 py-6">
                        {t("new_customer")}
												</p>
												<div className="flex gap-2 mr-6">
													<UploadFile />
													<p className="font-customGilroy text-base font-semibold text-grey-70">
                          {t("upload_file")}
													</p>
												</div>
											</div>
											<p className="font-customGilroy text-sm font-semibold not-italic text-red-main mb-8">
											{t("account_owner")}
											</p>
											<div className="flex justify-between">
												<div className="mb-10">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("first_name")}
													</label>
													<input
														name="firstName"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
														required
													/>
												</div>
												<div className="mb-10">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("last_name")}
													</label>
													<input
														name="lastName"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
														required
													/>
												</div>
											</div>
											<p className="font-customGilroy text-sm font-semibold not-italic text-red-main mb-8">
                      {t("business_details")}
											</p>
											<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                      {t("business_name")}
											</label>
											<input
												name="businessName"
												type="text"
												placeholder={t("type_here")}
												className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
												required
											/>
											<div className="flex justify-between">
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
													{t("email_address")}
													</label>
													<input
														name="email"
														type="email"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
														required
													/>
												</div>
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("phone_number")}
													</label>
													<input
														name="phone"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
														required
													/>
												</div>
											</div>
											<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                      {t("address")}
											</label>
											<input
												name="address"
												type="text"
												placeholder={t("type_here")}
												className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
												required
											/>
											<div className="flex justify-between">
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("city")}
													</label>
													<input
														name="city"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
														required
													/>
												</div>
												<div className="mb-6">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("state")}
													</label>
													<input
														name="state"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
														required
													/>
												</div>
											</div>
											<div className="flex justify-between">
												<div className="mb-12">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
														Longitude
													</label>
													<input
														name="longitude"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
														required
													/>
												</div>
												<div className="mb-12">
													<label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
														Latitude
													</label>
													<input
														name="latitude"
														type="text"
														placeholder={t("type_here")}
														className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
														required
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
										{formCompleted ? (
											<button
												className="rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
												onClick={() => setOpen(false)}
												style={{ backgroundColor: countryConfig[userCountry].buttonColor, color: countryConfig[userCountry].textColor }}
											>
												{t("save")}
											</button>
										) : (
												<button
													className="bg-opacity-30 rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
													onClick={handleApproval}
													style={{ backgroundColor: countryConfig[userCountry].buttonColor, color: countryConfig[userCountry].textColor }}
												>
													{t("save")}
												</button>
											)}

										{formCompleted ? (
											<button
												className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
												onClick={() => setOpen(false)}
											>
												{t("cancel")}
											</button>
										) : (
												<button
													className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
													onClick={() => setWarningModal(true)}
												>
													{t("cancel")}
												</button>
											)}
									</div>
								</div>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>

        {/* ApprovalModal */}
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
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                  <button
                    className="flex justify-center ml-auto m-4 mb-0"
                    onClick={() => setApprovalModal(false)}
                  >
                    <CloseModal />
                  </button>
                  <div className="flex flex-col justify-center items-center w-modal h-sub-modal -mt-12">
                    <Checked />
                    <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                      {t("new_customer_created_successfully")}!
                    </p>

                    <div className="flex flex-row-reverse gap-4 mt-10">
                      <button
                        className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-5 py-2"
                        onClick={() => setApprovalModal(false)}
                      >
                        {t("manage_customer")}
                      </button>

                      <button
                        className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-2.5 py-2"
                        onClick={() => setOpen(true)}
                      >
                        {t("create_new_customer")}
                      </button>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* warningModal */}
        <Transition.Root show={warningModal} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            initialFocus={cancelButtonRef}
            onClose={setWarningModal}
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
                  <div className="h-mini-modal flex justify-center items-center">
                    <p className="font-customGilroy not-italic text-base font-medium">
                      {t(
                        "are_you_sure_you_want_to_exit_this_customer_creation"
                      )}
                    </p>
                  </div>
                  <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                    <button
                      className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                      onClick={() => setWarningModal(false)}
                    >
                      {t("yes_exit")}
                    </button>

                    <button
                      className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                      onClick={handleReset}
                    >
                      {t('cancel')}
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
    allDistCustomers: state.CustomerReducer.all_dist_customers,
  };
};

export default connect(mapStateToProps, {
  getSingleDistributor,
  getAllDistributorCustomers,
})(Customers);
