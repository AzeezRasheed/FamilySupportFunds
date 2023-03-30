import React, { Fragment, useRef, useState, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { useParams } from "react-router";
import Downloader from "js-file-downloader";
import Dashboard from "../../../Layout/Admin/Dashboard";
import { useTranslation } from "react-i18next";
import { CloseModal, Checked } from "../../../assets/svg/modalIcons";
import Pagination from "../components/pagination";
import noOrder from "../../../assets/svg/noOrders.svg";
import {
	Dropdown,
	Previouspage,
} from "../../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import {
	getSingleDistributor,
	getAllDistributor,
} from "../pages/actions/adminDistributorAction";
import {
	customerTypeBasedOnCountry,
} from "../../../utils/custormerType";
import { addCustomers, getAllCustomers, getPaginatedCustomers } from "./actions/customer";
import { CSVLink } from "react-csv";
import SelectDropdown from "../../../components/common/SelectDropdown";
import ChangeDistributor from "./ChangeDistributor";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import RegisterCustomer from "../components/RegisterCustomer";
import {setDefaultDistrict, getRegions} from "../../../utils/getDistrictsRegions";
import qs from "qs";
import moment from "moment";

const Customers = ({
	location,
	addCustomers
}) => {
	let PageSize = 10;
	const { t } = useTranslation();
	const [currentPage, setCurrentPage] = useState(1);
	const AuthData = useSelector((state) => state.Auth.sessionUserData);
	const ccountry = AuthData?.country;
	const [searchData, setSearchData] = useState("");
	const [loader, setLoader] = useState(false);
	const [tab, setTab] = useState("");
	const [customerData, setCustomerData] = useState("");
	const [open, setOpen] = useState(false);
	const [approvalModal, setApprovalModal] = useState(false);
	const [warningModal, setWarningModal] = useState(false);
	const [country, setCountry] = useState("Nigeria");
	const [upload, checkUpload] = useState(false);
	const [uploadFile, setFile] = useState("");
	const [customerDownloadData, setCustomerDownloadData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [currentTableData, setCurrentTableData] = useState([])
	const [uploadError, setUploadError] = useState(false);
	const [formDataMsg, setFormDataMsg] = useState("");
	const [errorModal, setErrorModal] = useState("");
	const history = useHistory();
	const cancelButtonRef = useRef(null);
	const [openDropdown, setOpenDropdown] = useState(false);
	const { distCode } = useParams();
	const dispatch = useDispatch();
	const changedist_action = useSelector(
		(state) => state.AllUsersReducer.changedist_action
	);
	const [userCountry, setUserCountry] = useState("Ghana");
	const allCustomers = useSelector(
		(state) => state.CustomerReducer.all_customers
	);
	const paginatedCustomers = useSelector(
		(state) => state.CustomerReducer.paginated_customers
	);
	const totalPages = useSelector(
		(state) => state.CustomerReducer.total_pages
	);

	useEffect(async () => {
		const loc = await getLocation();
		setUserCountry(loc);
	});

  useEffect(() => {
    const filterParams = history.location.search.substr(1);
    const filtersFromParams = qs.parse(filterParams);
    if (filtersFromParams.tab) {
      setTab(filtersFromParams.tab);
      setCustomerData(filtersFromParams.tab)
    }
  }, []);
		
	useEffect(()=>{
		history.push(`?tab=${tab}`);
	},[tab])

  useEffect(() => {
    if (searchTerm.length === 0) {
      dispatch(getPaginatedCustomers(ccountry, currentPage, customerData));
    }
	}, [currentPage, customerData]);

	useEffect(() => {
		if (paginatedCustomers.length > 0 && allCustomers.length === 0) {
			dispatch(getAllCustomers(ccountry));
		}
	}, [paginatedCustomers])

	useEffect(() => {
		let customerCsv = [];

		allCustomers &&
			sortCustomers().filter((data) => {
				customerCsv.push({
					"Customer STP": data?.account_id,
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

			setCustomerDownloadData(customerCsv);
	}, [allCustomers])

  useEffect(() => {
    setCurrentPage(1);
    setFilteredCustomers(fetchCustomers());
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    setCurrentTableData(fetchCustomers().slice(firstPageIndex, lastPageIndex))
  }, [searchTerm])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      setCurrentTableData(fetchCustomers().slice(firstPageIndex, lastPageIndex))
    }
  }, [currentPage])

	const sortCustomers = () => {
		const sorted = allCustomers.sort(
			(a, b) => new Date(b.registeredOn) - new Date(a.registeredOn)
		);
		return sorted;
	};
  const fetchCustomers = () => {
		return (
			allCustomers &&
			sortCustomers().filter((data) => {
				return (
					(data?.CUST_Name !== null &&
						String(data?.CUST_Name.toLowerCase()).startsWith(
							`${searchTerm.toLowerCase()}`
						)) ||
					(data?.CUST_Type !== null &&
						data?.CUST_Type.toLowerCase().includes(
							`${searchTerm.toLowerCase()}`
						)) ||
					(data?.bdr !== null &&
						data?.bdr
							.toLowerCase()
							.includes(`${searchTerm.toLowerCase()}`)) ||
          (data?. DIST_Code !== null &&
            data?. DIST_Code
              .toLowerCase()
              .includes(`${searchTerm.toLowerCase()}`)) ||
					(data?.status !== null &&
						data?.status
							.toLowerCase()
							.includes(`${searchTerm.toLowerCase()}`))
				);
			})
		);
	};
	const dropdownItems = [
		{ menu: "Change Distributor", route: "self", action: "change_dist" },
	];

	const performAction = (index, id) => {
		paginatedCustomers.forEach((element) => (element.clicked = false));
		paginatedCustomers[index].clicked = true;

		!openDropdown ? setOpenDropdown(true) : setOpenDropdown(false);
	};

	const handleReset = () => {
		setWarningModal(false);
		setOpen(true);
	};

	const handleApproval = () => {
		setOpen(false);
		setWarningModal(false);
		setApprovalModal(true);
	};

	const pushTomanageCustomer = (id, distCode) => {
		history.push(`/distributor/manage-customer/${distCode}/${id}`);
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [customerData])

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

	const downloadFile = () => {
		const fileUrl =
			"data:image/jpeg;base64,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";
		new Downloader({
			url: fileUrl,
		})
			.then(function () {
				// Called when download ended
			})
			.catch(function (error) {
				// Called when an error occurred
			});
	};

	const fileChange = async (event) => {
		event.preventDefault();
		let formData = new FormData();
		formData.append("csv", uploadFile);
		// let options = { content: formData };
		await axios
			.post("http://102.133.143.139/upload-company/upload", formData, {
				// headers: {
				//   "Content-Type": "multipart/form-data",
				// },
			})
			.then((response) => {
				checkUpload();
				setFormDataMsg("successfully uploaded");
				setUploadError(false);
			})
			.catch((error) => {
				setFormDataMsg("Data already exist");
				setUploadError(true);
			});
	};
	const defaultDistrict = setDefaultDistrict(ccountry);
	const regions = getRegions(ccountry, defaultDistrict);
  const businessRegion = regions[0];
	const [allValues, setAllValues] = useState({
    step: 1,
    formCompleted: false,
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    businessName: "",
    sysproCode: "",
    salesforceCode: "",
    district: defaultDistrict,
    deliveryRegion: businessRegion,
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
		sysproCode,
		district,
		salesforceCode,
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
		sysproCode,
		open,
		loader,
		userCountry,
		country,
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
		ccountry,
		long,
		lat,
	};

	const resetState = () => {
		setAllValues({
      step: 1,
      formCompleted: false,
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phone: "",
      businessName: "",
      district: defaultDistrict,
      salesforceCode: "",
      deliveryRegion: businessRegion,
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
	};

	const handleClose = () => {
		setApprovalModal(false);
		setErrorModal("");
		resetState();
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setLoader(true);
		await addCustomers({
			distCode: distCode ? distCode : sysproCode,
			address,
			phone,
			email,
			firstName,
			lastName,
			country: ccountry,
			SFCode: salesforceCode,
			businessName,
			district,
			deliveryRegion,
			deliveryCity,
			minimumOrderValue,
			priceListId,
			salesRepEmployeeNumber,
			salesRepName,
			salesRepEmail,
			salesRepPhone: Number(salesRepPhone),
			segment,
			subSegment,
			reward,
			latitude: Number(lat),
			longitude: Number(long),
		})
			.then(() => {
				getAllCustomers(ccountry);
        setApprovalModal(true);
				setTimeout(() => {
          setCustomerData('');
					resetState();
					setLoader(false);
					setWarningModal(false);
					setOpen(false);
					setApprovalModal(false);
				}, 3000);
			})
			.catch((error) => {
				setLoader(false);
				setErrorModal(error);
			});
	};

	const data = [
		{
			customer_name: "",
			SYS_Code: "",
			SF_Code: "",
			region: "",
			customer_type: "",
			Owner_Phone: "",
			lat: "",
			long: "",
			address: "",
			country: "",
			state: "",
		},
	];

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
              {t("all_customers")}
            </p>
          </div>
        </div>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded w-full">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div className="flex flex-row justify-between items-center border-b h-16 px-8 w-full ">
              <div className="flex justify-between font-customGilroy text-base font-medium not-italic text-grey-85  h-full ">
                <li className="flex cursor-pointer">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
                      (tab === ""
                        ? "text-active border-b-4 rounded"
                        : "text-default")
                    }
                    style={{
                      borderColor: tab === "" ? borderActive : "",
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
                    backgroundColor: countryConfig[userCountry].buttonColor,
                    color: countryConfig[userCountry].textColor,
                  }}
                  onClick={() => setOpen(true)}
                >
                  {t("create_new_customer")}
                </button>
                <button
                  className={`rounded font-customGilroy text-base px-6 py-3 ${allCustomers.length === 0 && 'opacity-50 cursor none'}`}
                  style={{
                    backgroundColor: countryConfig[userCountry].buttonColor,
                    color: countryConfig[userCountry].textColor,
                  }}
                >
                  {
                    allCustomers.length === 0
                  ?
                    <div fullWidth size="large" variant="outlined">
                      {t("fetching_data")}
                    </div>
                  :
                    <CSVLink
                      data={customerDownloadData}
                      filename="customer-data.csv"
                      style={{ textDecoration: "none" }}
                    >
                      <div fullWidth size="large" variant="outlined">
                        {t("download_customers")}
                      </div>
                    </CSVLink>
                  }
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
                onChange={(e) => setSearchTerm(e.target.value)}
                // onKeyUp={(e) => setFilteredCustomers(fetchCustomers(e.target.value))}
                placeholder={t("search_for_customer")}
              />
              <div className="flex pt-1">
                {/* <div
                  className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <p className="text-default font-normal">All locations(s)</p>{" "}
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
            <div className="tab-content tab-space w-full">
              <div>
                <div className="overflow-x-scroll">
                <table className="mt-8 divide-y divide-gray-200">
                  <thead className="bg-transparent">
                    <tr className="">
                      <th className="px-10 py-3 text-xs font-medium text-center text-black align-middle">
                        S/N
                      </th>
                      <th className="px-10 py-3 text-xs font-medium text-center text-black align-middle">
                        {t("customer_code")}
                      </th>
                      <th className="px-10 py-3 text-xs font-medium text-center text-black align-middle">
                        {t("customer_type")}
                      </th>
                      <th className="px-10 py-3 text-xs font-medium text-center text-black align-middle">
                        {t("customer_name")}
                      </th>
                      <th className="px-10 py-3 text-xs font-medium text-center text-black align-middle">
                        {t("customer_stp")}
                      </th>
                      <th className="px-10 py-3 text-xs font-medium text-center text-black align-middle">
                        Distributor Code
                      </th>
                      <th className="px-10 py-3 text-xs font-medium text-center text-black align-middle">
                        {t("status")}
                      </th>
                      <th className="px-10 py-3 text-xs font-medium text-center text-black align-middle">
                        {t("registration_date")}
                      </th>
                      <th></th>
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
                    {paginatedCustomers.length === 0 ? (
                      <tr className="my-8 justify-center">
                        <td colSpan={9}>
                          <img className="m-auto" src={noOrder} />
                          <p className="text-center font-medium">
                            {!allCustomers ? t("no_data") : t("fetching_data")}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      (searchTerm.length > 0 ? currentTableData : paginatedCustomers)
                      .map((customer, index) => (
                        <tr key={customer.id}>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {`${index + 1}.`}
                          </td>
                          <td
                            onClick={() =>
                              pushTomanageCustomer(
                                customer && customer?.SF_Code,
                                customer?.DIST_Code
                                  ? customer?.DIST_Code
                                  : customer?.SF_Code
                              )
                            }
                            className="cursor-pointer font-customGilroy text-sm font-medium text-center align-middle p-6"
                          >
                            {customer.SF_Code}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer.CUST_Type}
                          </td>
                          <td
                            onClick={() =>
                              pushTomanageCustomer(
                                customer && customer.SF_Code,
                                customer?.DIST_Code
                                  ? customer?.DIST_Code
                                  : customer?.SF_Code
                              )
                            }
                            className="cursor-pointer font-customGilroy text-sm font-medium text-center align-middle p-6"
                          >
                            {customer.CUST_Name
                              ? customer.CUST_Name
                              : t("not_available")}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer?.account_id
                              ? customer?.account_id
                              : "N/A"}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {customer?.DIST_Code ? customer?.DIST_Code : "N/A"}
                          </td>
                          {customer.status === "Active" ? (
                            <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                              <button className="rounded-full bg-green-500 py-1 px-3">
                                {customer.status}
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
                            {
															customer.registeredOn ? 
															(moment(customer.registeredOn).format("DD-MM-YYYY") !== 'Invalid date' ?  moment(customer.registeredOn).format("DD-MM-YYYY") : customer.registeredOn.replaceAll('/', '-'))
															: ''
														}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            <button
                              onClick={() => {
                                // targetDiv = ref.current;
                                performAction(index, customer.id);
                              }}
                              className="flex items-center h-10 gap-2 border border-grey-25 py-1 rounded-lg px-4"
                            >
                              Actions <Dropdown />
                            </button>
                            {openDropdown && customer.clicked ? (
                              <SelectDropdown
                                items={dropdownItems}
                                KPO_id={customer.id}
                              />
                            ) : (
                              ""
                            )}
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
                </div>
                
                <hr />
                <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={ searchTerm.length > 0 ? filteredCustomers.length : (totalPages ?  totalPages * PageSize : 1)}
                    pageSize={PageSize}
                    onPageChange={(page) => setCurrentPage(page)}
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
                      style={{
                        backgroundColor: countryConfig[userCountry].buttonColor,
                        color: countryConfig[userCountry].textColor,
                      }}
                      onClick={() => {
                        setWarningModal(false);
                        setApprovalModal(false);
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
        <ChangeDistributor
          action={changedist_action}
          currentPage={currentPage}
          currentTable={paginatedCustomers}
          customerData={customerData}
        />
      </div>
    </Dashboard>
  );
};
const mapStateToProps = (state) => {
	return {
		distributor: state.AllDistributorReducer.distributor,
		allDistributors: state.AllDistributorReducer.all_distributors,
	};
};

export default connect(mapStateToProps, {
	getAllDistributor,
	addCustomers,
	getSingleDistributor,
})(Customers);
