import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Dashboard from "../../../Layout/Admin/Dashboard";
import {
	CloseModal,
	UploadFile,
	Checked,
} from "../../../assets/svg/modalIcons";
import noOrder from "../../../assets/svg/noOrders.svg";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import SortImg from "../../../assets/svg/sort.svg";
import { CSVLink } from "react-csv";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
	Previouspage,
	Progination,
	Redirect,
} from "../../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import DistributorNavbar from "../components/navbar";
import Pagination from "../components/pagination";
import {
	getSingleDistributor,
	getAllDistributor,
} from "../pages/actions/adminDistributorAction";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import {
	customerTypeBasedOnCountry,
	showCustomerBasedOnCountry,
} from "../../../utils/custormerType";
import { addCustomers, getAllDistributorCustomers } from "./actions/customer";
import { getSingleOrderByBuyerId } from "../order/actions/orderAction";
import RegisterCustomer from "../components/RegisterCustomer";
import qs from "qs";


const Customers = ({
	location,
	distributor,
	getAllDistributor,
	addCustomers,
	allDistCustomers,
	getAllDistributorCustomers,
	getSingleDistributor,
	getSingleOrderByBuyerId,
	orders,
}) => {
	const { t } = useTranslation();
	let PageSize = 10;
	const [currentPage, setCurrentPage] = useState(1);
	const AuthData = useSelector((state) => state.Auth.sessionUserData);
	const ccountry = AuthData?.country;
	const [loader, setLoader] = useState(false);
	const [tab, setTab] = useState("");
	const [customerData, setCustomerData] = useState("");
	const [open, setOpen] = useState(false);
	const [approvalModal, setApprovalModal] = useState(false);
	const [warningModal, setWarningModal] = useState(false);
	// const [custType, setCustType] = useState(
	//   ccountry === "Nigeria" ? "Bulkbreaker" : "Reseller"
	// );
	const [errorModal, setErrorModal] = useState("");
	// const [address, setAddress] = useState("");
	// const [phone, setPhone] = useState("");
	// const [name, setName] = useState("");
	// const [distDistrict, setDistDistrict] = useState(
	//   ccountry === "Nigeria" ? "Lagos North" : "East"
	// );
	// const [sysproCode, setSysproCode] = useState("");
	// const [businessRegion, setBusinessRegion] = useState("");
	// const [email, setEmail] = useState("");
	// const [country, setCountry] = useState("Nigeria");
	// const [salesforceCode, setSalesforceCode] = useState("");
	// const [lat, setLat] = useState("");
	// const [long, setLong] = useState("");
	//const [formCompleted, setFormCompleted] = useState(false);
	const history = useHistory();
	const cancelButtonRef = useRef(null);
	const { distCode } = useParams();

	const handleReset = () => {
		setWarningModal(false);
		setOpen(true);
	};

	const [userCountry, setUserCountry] = useState("Ghana");

	useEffect(async () => {
		const loc = await getLocation();
		setUserCountry(loc);
	});

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

	const sortCustomers = () => {
		const sorted = allDistCustomers.sort(
			(a, b) => new Date(b.registeredOn) - new Date(a.registeredOn)
		);
		return sorted;
	};

	const fetchCustomers = () => {
		return (
			allDistCustomers &&
			sortCustomers().filter((data) => {
				return (
					(data?.CUST_Name !== null &&
						String(data?.CUST_Name.toLowerCase()).startsWith(
							`${customerData.toLowerCase()}`
						)) ||
					(data?.CUST_Type !== null &&
						data?.CUST_Type.toLowerCase().includes(
							`${customerData.toLowerCase()}`
						)) ||
					(data?.bdr !== null &&
						data?.bdr
							.toLowerCase()
							.includes(`${customerData.toLowerCase()}`)) ||
					(data?.status !== null &&
						data?.status
							.toLowerCase()
							.includes(`${customerData.toLowerCase()}`))
				);
			})
		);
	};

	const currentTableData = () => {
		const firstPageIndex = (currentPage - 1) * PageSize;
		const lastPageIndex = firstPageIndex + PageSize;
		return (
			allDistCustomers &&
			fetchCustomers().slice(firstPageIndex, lastPageIndex)
		);
	};

	const handleApproval = () => {
		setOpen(false);
		setWarningModal(false);
		setApprovalModal(true);
	};

	const pushTomanageCustomer = (id, code) => {
		history.push(`/distributor/manage-customer/${code}/${id}`);
	};

	useEffect(() => {
		currentTableData();
		getSingleDistributor(distCode);
		getAllDistributorCustomers(distributor?.SYS_Code);
	}, [
		distributor?.SYS_Code,
		distCode,
		currentPage,
		distCode,
		allDistCustomers.length,
	]);
	useEffect(() => {
		getAllDistributor(ccountry);
		//getSingleOrderByBuyerId()
	}, [ccountry]);

	const selectDistrictBasedOnRegionNig = (value) => {
		let option;
		switch (value) {
			case "Lagos And West 1":
				option = (
					<>
						<option value="Lagos North">Lagos North</option>
						<option value="Lagos South">Lagos South</option>
						<option value="West 1">West 1</option>
					</>
				);
				break;
			case "North And West 2":
				option = (
					<>
						<option value="Abuja">Abuja</option>
						<option value="Benin">Benin</option>
						<option value="Ilesa">Ilesa</option>
					</>
				);
				break;
			case "South East":
				option = (
					<>
						<option value="Aba">Aba</option>
						<option value="Onitsha">Onitsha</option>
						<option value="PortHarcourt">PortHarcourt</option>
					</>
				);
				break;
			default:
				option = (
					<>
						<option value="Lagos North">Lagos North</option>
					</>
				);
				break;
		}
		return option;
	};

	let customerCsv = [];

	allDistCustomers &&
		sortCustomers().filter((data) => {
			customerCsv.push({
				"Customer Name": data?.CUST_Name,
				"Customer Type": data?.CUST_Type,
				"Salesforce Code": data?.SF_Code,
				"Distributor Code": data?.DIST_Code,
				"Phone-Number": data?.phoneNumber,
				Address: data?.address,
				"Customer Status": data?.status,
				"Registered Date": data?.registeredOn,
				"Customer Bdr": data?.bdr,
				Latitude: data?.latitude,
				Longitude: data?.longitude,
				Region: data?.region,
				"Route Schedule":
					data?.country === "Ghana" ? data?.route_schedule : "N/A",
				"Price Group":
					data?.country === "Tanzania" ? data?.price_group : "N/A",
			});
		});

	const [allValues, setAllValues] = useState({
		step: 1,
		formCompleted: false,
		firstName: "",
		lastName: "",
		email: "",
		address: "",
		phone: "",
		businessName: "",
		salesforceCode: "",
		district: ccountry === "Nigeria" ? "Lagos North" : "East",
		deliveryRegion: "",
		deliveryCity: "",
		minimumOrderValue: 0,
		priceListId: "",
		salesRepEmployeeNumber: "",
		salesRepName: "",
		salesRepEmail: "",
		salesRepPhone: "",
		segment: "POC",
		subSegment: "Mainstream",
		reward: "Yes",
		long: "",
		lat: "",
	});

	const {
		step,
		firstName,
		lastName,
		email,
		address,
		phone,
		businessName,
		salesforceCode,
		district,
		deliveryRegion,
		deliveryCity,
		minimumOrderValue,
		priceListId,
		salesRepEmployeeNumber,
		salesRepName,
		salesRepEmail,
		salesRepPhone,
		segment,
		subSegment,
		reward,
		long,
		lat,
	} = allValues;

	const prevStep = () => {
		const { step } = allValues;
		setAllValues({ ...allValues, step: step - 1 });
	};

	const nextStep = () => {
		const { step } = allValues;
		setAllValues({ ...allValues, step: step + 1 });
	};

	const handleChange = (e) => {
		setAllValues({ ...allValues, [e.target.name]: e.target.value });
	};

	const handleCloseModal = () => {
		setAllValues({ ...allValues, openModal: false });
	};

	const handleOpenModal = () => {
		setAllValues({ ...allValues, openModal: true });
	};

	const nextPage = (e) => {
		e.preventDefault();
		nextStep();
	};

	const previousPage = (e) => {
		e.preventDefault();
		prevStep();
	};

	const values = {
		distCode,
		open,
		loader,
		userCountry,
		ccountry,
		firstName,
		lastName,
		email,
		address,
		phone,
		businessName,
		district,
		deliveryRegion,
		deliveryCity,
		minimumOrderValue,
		priceListId,
		salesRepEmployeeNumber,
		salesRepName,
		salesRepEmail,
		salesRepPhone,
		segment,
		subSegment,
		reward,
		distCode,
		ccountry,
		long,
		lat,
	};

	function resetState() {
		setAllValues({
			step: 1,
			formCompleted: false,
			firstName: "",
			lastName: "",
			email: "",
			address: "",
			phone: "",
			businessName: "",
			district: ccountry === "Nigeria" ? "Lagos North" : "East",
			salesforceCode: "",
			deliveryRegion: "",
			deliveryCity: "",
			minimumOrderValue: 0,
			priceListId: "",
			salesRepEmployeeNumber: "",
			salesRepName: "",
			salesRepEmail: "",
			salesRepPhone: "",
			segment: "POC",
			subSegment: "Mainstream",
			reward: "Yes",
			long: "",
			lat: "",
		});
	}

	const handleClose = () => {
		setApprovalModal(false);
		setErrorModal("");
		resetState();
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setLoader(true);

		await addCustomers({
			distCode: distCode,
			address,
			phone,
			email,
			district,
			firstName,
			lastName,
			country: ccountry,
			SFCode: salesforceCode,
			businessName,
			deliveryRegion,
			deliveryCity,
			minimumOrderValue,
			priceListId,
			salesRepEmployeeNumber,
			salesRepName,
			salesRepEmail,
			salesRepPhone,
			segment,
			subSegment,
			reward,
			latitude: lat,
			longitude: long,
		})
			.then(() => {
				getAllDistributorCustomers(distributor?.SYS_Code);
				setTimeout(() => {
					resetState();
					setLoader(false);
					setWarningModal(false);
					setOpen(false);
					setApprovalModal(true);
				}, 3000);
			})
			.catch((error) => {
				setApprovalModal(true);
				setLoader(false);
				setErrorModal(error);
			});
	};

	const borderActive = countryConfig[userCountry].borderBottomColor;
	return (
		<Dashboard location={location}>
			<div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
				<div className="flex justify-between items-center">
					<div className="flex gap-4">
						{/* <Link to="/admin-dashboard"> */}
						<Previouspage onClick={() => history.goBack()} />
						{/* </Link> */}
						<p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
							{distributor?.company_name}
						</p>
					</div>
				</div>
				<div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
					<p className="font-normal text-gray-400">
						{distributor?.company_type}
					</p>
					/
					<p className="font-medium text-grey-100">
						{distributor?.company_name}
					</p>
				</div>
				<DistributorNavbar distributor={distributor} code={distCode} />
				<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
					<div className="block tab-content tab-space pb-5 flex-auto w-full">
						<div className="flex flex-row justify-between items-center border-b h-16 px-8">
							<div className="flex justify-between font-customGilroy text-base font-medium not-italic text-grey-85 w-3/7 h-full">
								<li className="flex cursor-pointer">
									<a
										className={
											"flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
											(tab === ""
												? "text-active border-b-4 rounded"
												: "text-default")
										}
										style={{
											borderColor:
												tab === "" ? borderActive : "",
										}}
										onClick={(e) => {
											e.preventDefault();
											setCustomerData("");
											setTab("");

										}}
									>
										{t("all_customers")}
									</a>
								</li>
								{customerTypeBasedOnCountry(
									ccountry,
									customerData,
									setCustomerData,
									tab,
									setTab,								
									borderActive
								)}
							</div>
							<div className="flex">
								<button
									className="rounded mr-4 font-customGilroy text-base px-6 py-3"
									style={{
										backgroundColor:
											countryConfig[userCountry].buttonColor,
										color: countryConfig[userCountry].textColor,
									}}
									onClick={() => setOpen(true)}
								>
									{t("add_new_customers")}
								</button>
								<button
									className="rounded font-customGilroy text-base px-6 py-3"
									style={{
										backgroundColor:
											countryConfig[userCountry].buttonColor,
										color: countryConfig[userCountry].textColor,
									}}
								>
									<CSVLink
										data={customerCsv}
										filename="customer-data.csv"
										style={{ textDecoration: "none" }}
									>
										<div fullWidth size="large" variant="outlined">
											{t("download_customers")}
										</div>
									</CSVLink>
								</button>
							</div>
						</div>
						<div className="flex mt-3 px-4">
							<input
								className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
								id="search"
								type="text"
								name="search"
								style={{
									width: "26.063rem",
									backgroundColor: "#E5E5E5",
								}}
								onChange={(e) => setCustomerData(e.target.value)}
								placeholder={t("search_for_customer")}
							/>
							<div className="flex pt-1">
								{/* <div
                  className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                  style={{ width: "auto" }}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <p className="text-default font-normal">All locations(s)</p>{" "}
                  <img className="pl-3 pr-2" src={arrowDown} alt="" />
                </div> */}
                {/* <div
                  className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block  bg-white border-default-b border-2"
                  style={{ width: "auto" }}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <p className="text-default font-normal">Any Status</p>{" "}
                  <img className="pl-3 pr-2" src={arrowDown} alt="" />
                </div> */}
                {/* <div
                  style={{ width: "auto" }}
                  className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                >
                  <img className="pr-2" src={SortImg} alt="" />
                  <p className="text-default font-normal">Sort By</p>
                </div> */}
              </div>
            </div>
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
                        Distributor Code
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("status")}
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("registration")} <br />
                        {t("date")}
                      </th>
                      {/* <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        Total Orders
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        Total Amount <br />
                        Spent
                      </th> */}
                    </tr>
                  </thead>
                  <tbody
                    className="bg-white px-6 divide-y divide-gray-200"
                    id="filterTBody"
                  >
                    {allDistCustomers.length === 0 ? (
                      <tr className="my-8 justify-center">
                        <td colSpan={9}>
                          <img className="m-auto" src={noOrder} />
                          <p className="text-center font-medium">
                            {!allDistCustomers
                              ? t("no_data")
                              : t("fetching_data")}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      allDistCustomers &&
                      currentTableData().map((customer, index) => (
                        <tr
                          key={customer.id}
                          onClick={() =>
                            pushTomanageCustomer(
                              customer?.SF_Code,
                              customer?.DIST_Code
                                ? customer?.DIST_Code
                                : customer?.SF_Code
                            )
                          }
                          className="cursor-pointer"
                        >
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {`${index + 1}.`}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer?.SF_Code}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer?.CUST_Type}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer && customer?.CUST_Name
                              ? customer?.CUST_Name
                              : t("not_available")}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer && customer?.DIST_Code}
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
                          {/* <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer.totalOrder}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer.amountSpent}
                          </td> */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <hr />
                <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={fetchCustomers().length}
                    pageSize={PageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                    handleOpenModal={handleOpenModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* customer Modal */}
        <RegisterCustomer
          handleChange={handleChange}
          handleOpenModal={handleOpenModal}
          setWarningModal={setWarningModal}
          setLoader={setLoader}
          handleCloseModal={handleCloseModal}
          nextPage={nextPage}
          previousPage={previousPage}
          values={values}
          step={step}
          onSubmit={onSubmit}
          setOpen={setOpen}
          loader={loader}
        />

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
                    onClick={handleClose}
                  >
                    <CloseModal />
                  </button>
                  <div className="flex flex-col justify-center items-center w-modal h-sub-modal -mt-12">
                    {!errorModal ? (
                      <>
                        <Checked />
                        <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                          {t("new_customer_created_successfully")}!
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl">❌</p>
                        <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                          {errorModal}!
                        </p>
                      </>
                    )}
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
                      onClick={() => {
                        setWarningModal(false);
                        setApprovalModal(false);
                      }}
                      style={{
                        backgroundColor: countryConfig[userCountry].buttonColor,
                        color: countryConfig[userCountry].textColor,
                      }}
                    >
                      {t("yes_exit")}
                    </button>

                    <button
                      className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
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
		allDistCustomers: state.CustomerReducer.all_dist_customers,
	};
};

export default connect(mapStateToProps, {
	getAllDistributor,
	addCustomers,
	getSingleDistributor,
	getAllDistributorCustomers,
})(Customers);
