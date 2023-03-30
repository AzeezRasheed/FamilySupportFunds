import React, { Fragment, useRef, useState, useEffect } from "react";
import axios from "axios";
import Downloader from "js-file-downloader";
import download from "../../../assets/svg/download-report.svg";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import { Dialog, Transition } from "@headlessui/react";
import Dashboard from "../../../Layout/Admin/Dashboard";
import AdminDistributorLayout from "../Layout";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import { getRegions, getDistricts, setDefaultDistrict } from "../../../utils/getDistrictsRegions";

import {
  // uploadCSV,
  addDistributor,
  getAllDistributor,
} from "./actions/adminDistributorAction";
import {
  CloseModal,
  UploadFile,
  Checked,
} from "../../../assets/svg/modalIcons";

const Home = ({
  location,
  addDistributor: addDis,
  getAllDistributor,
  allDistributors,
}) => {
  const { t } = useTranslation();
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const ccountry = AuthData?.country;
  // const ccountry = "Zambia"
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [compName, setCompName] = useState("");
  const [uploadFile, setFile] = useState("");
  const [developerName, setDeveloperName] = useState("");
  const [developerEmail, setDeveloperEmail] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  
  const [state, setState] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessOwnerName, setBusinessOwnerName] = useState("");
  const [sysproCode, setSysproCode] = useState("");
  const [businessOwnerPhone, setBusinessOwnerPhone] = useState("");
  const [developerPhone, setDeveloperPhone] = useState("");
  const [salesforceCode, setSalesforceCode] = useState("");
  const [approvalModal, setApprovalModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [upload, checkUpload] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formDataMsg, setFormDataMsg] = useState("");
  const [formCompleted, setFormCompleted] = useState(false);
  const [calendar, setShowCalendar] = useState(false);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState("");

  const [showError, setShowError] = useState(false);
  const [userCountry, setUserCountry] = useState(AuthData?.country);
  const [country, setCountry] = useState(userCountry);

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);

  const showCalender = () => {
    setShowCalendar(calendar ? false : true);
  };
  const { sessionUser } = useSelector((state) => state.Auth); 
    
  const defaultDistrict = setDefaultDistrict(ccountry);
  const [distDistrict, setDistDistrict] = useState(defaultDistrict);
  const districts = getDistricts(ccountry);
  const regions = getRegions(country, distDistrict);
  const [businessRegion, setBusinessRegion] = useState(regions[0]);

  useEffect(() => {
    getAllDistributor(ccountry).then((response) => {});
    // console.log(sessionUser, "sessionUser");
  }, [ccountry]);

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (
      compName !== "" &&
      developerName !== "" &&
      businessEmail !== "" &&
      developerEmail !== "" &&
      state !== "" &&
      distDistrict !== "" &&
      businessAddress !== "" &&
      developerPhone !== "" &&
      developerName !== "" &&
      businessOwnerName !== "" &&
      businessOwnerPhone !== "" &&
      businessRegion !== "" &&
      country !== "" &&
      sysproCode !== "" &&
      lat !== "" &&
      long !== ""
    ) {
      setFormCompleted(true);
    } else {
      setFormCompleted(false);
    }
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    console.log("I got here");

    await addDis({
      compName: compName,
      country: country,
      email: businessEmail,
      type: "Distributor",
      district: distDistrict,
      DD_Email: developerEmail,
      region: businessRegion,
      address: businessAddress,
      DD_Name: developerName,
      DD_Phone: developerPhone,
      salesforceCode: salesforceCode,
      Owner_Name: businessOwnerName,
      Owner_Phone: businessOwnerPhone,
      sysproCode: sysproCode,
      lat,
      state,
      long,
    })
      .then(() => {
        console.log("then here");
        getAllDistributor(ccountry);
        setCompName("");
        setDeveloperName("");
        setBusinessEmail("");
        setDistDistrict(defaultDistrict);
        setDeveloperEmail("");
        setBusinessAddress("");
        setBusinessRegion("");
        setBusinessOwnerPhone("");
        setDeveloperPhone("");
        setSysproCode("");
        setLat("");
        setLong("");
        setBusinessOwnerName("");
        setSalesforceCode("");
        setCountry(ccountry);
        setLoader(false);
        setWarningModal(false);
        setOpen(false);
        setApprovalModal(true);
      })
      .catch((error) => {
        setErrorModal(error);
        setApprovalModal(true);
      });
  };

  const fileChange = async (event) => {
    event.preventDefault();
    const uploadFile = event.target.files[0];
    const formData = new FormData();
    formData.append("csv", uploadFile);

    // try {
    //   const res = await axios.post(" ${process.env.REACT_APP_BASE_URL}/company/upload-company/upload", formData)

    //   if (res) {
    //     console.log('============uploadFile========================');
    //     console.log(res);
    //     console.log('=============uploadFile=======================');
    //   }
    // } catch (error) {
    //   console.log('===========error=========================');
    //   console.log(error);
    //   console.log('=============error=======================');
    // }
    // let options = { content: formData };
    // await axios
    //   .post(` ${process.env.REACT_APP_BASE_URL}/company/upload-company/upload`, { file: formData }, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((response) => {
    //     checkUpload()
    //     setFormDataMsg("successfully uploaded")
    //     setUploadError(false)
    //     console.log(response, "uploaded successfuly", formData, "form data");
    //   })
    //   .catch((error) => {
    //     setFormDataMsg("Data already exist")
    //     setUploadError(true)
    //   });
    console.log("=============uploadFile=======================");
    for (var value of formData.values()) {
    }
    console.log("============uploadFile========================");
    await axios({
      method: "post",
      url: "http://102.133.143.139/upload-company/upload",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
      })
      .catch(function (response) {
        //handle error
      });
  };

  // const handleFileUpload = e => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = (evt) => {
  //     /* Parse data */
  //     const bstr = evt.target.result;
  //     const wb = XLSX.read(bstr, { type: 'binary' });
  //     /* Get first worksheet */
  //     const wsname = wb.SheetNames[0];
  //     const ws = wb.Sheets[wsname];
  //     /* Convert array of arrays */
  //     const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
  //     processData(data);
  //   };
  //   reader.readAsBinaryString(file);
  // }

  const handleReset = () => {
    setWarningModal(false);
    setOpen(true);
  };

  const closeModal = () => {
    setWarningModal(false);
    setOpen(false);
  };

  const handleApproval = () => {
    setOpen(false);
    setWarningModal(false);
  };

  const sortItems = (value) => {
    const sorted = value.sort((a, b) => b.id - a.id);
    return sorted;
  };

  const checkSorted = (value) => {
    return [].slice.call(value).sort((a, b) => {
      if (b.id - a.id) {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
  };


  const data = [
    {
      company_name: "",
      SYS_Code: "",
      SF_Code: "",
      district: "",
      region: "",
      company_type: "",
      email: "",
      DD_Name: "",
      DD_Email: "",
      Owner_Name: "",
      Owner_Phone: "",
      lat: "",
      long: "",
      address: "",
      country: "",
    },
  ];

  const clearNewDistributor = () => {
    setOpen(false);
    setCompName("");
    setDeveloperName("");
    setBusinessEmail("");
    setDistDistrict(defaultDistrict);
    setDeveloperEmail("");
    setBusinessAddress("");
    setBusinessRegion(regions[0]);
    setBusinessOwnerPhone("");
    setDeveloperPhone("");
    setSysproCode("");
    setLat("");
    setLong("");
    setBusinessOwnerName("");
    setSalesforceCode("");
    setCountry(userCountry);
  }

  return (
    <Dashboard location={location} sessionUser={sessionUser}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex flex-row justify-between">
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("all_distributors")}
            <span className="font-customGilroy text-gray-400 ml-0.5">{`(${allDistributors.length})`}</span>
          </h2>
          <button
            className="rounded font-customGilroy text-base px-6 py-3"
            onClick={() => setOpen(true)}
            style={{
              backgroundColor: countryConfig[userCountry].buttonColor,
              color: countryConfig[userCountry].textColor,
            }}
          >
            {t("create_new_distributor")}
          </button>
        </div>
        <AdminDistributorLayout
          top="mt-8"
          DistributorList={sortItems(allDistributors)}
        />
        {/* Distributor Modal */}
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
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal">
                  <CloseModal
                    className="ml-auto m-4 mb-0"
                    onClick={() => setOpen(false)}
                  />
                  <div className="flex justify-between items-center px-6">
                    <p
                      className="font-customGilroy not-italic font-normal grey-100"
                      style={{ fontSize: "32px" }}
                    >
                      {t("new_distributor")}
                    </p>

                    {/* <form
                      encType="multipart/form-data"
                      className="inline-block align-bottom bg-white text-left transform transition-all sm:mt-8"
                      role="form"
                      onChange={fileChange}
                    >
                      <div className="flex gap-2">
                        <input
                          onChange={(event) =>
                            setFile(event.target.files[0])
                          }
                          className="w-32"
                          name="file"
                          accept="text/csv"
                          id="icon-button-file"
                          type="file"
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="icon-button-file"
                          className="w-32 flex justify-between"
                          style={{ cursor: "pointer" }}
                        >
                          <UploadFile />
                          <p className="font-customGilroy text-base font-semibold text-grey-70">
                            Upload CSV
                          </p>
                        </label>
                      </div>
                    </form> */}
                  </div>
                  <form
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal"
                    role="form"
                    onSubmit={onSubmit}
                  >
                    <div className="h-modal overflow-y-scroll scrollbar-hide">
                      <div className="mt-4 px-12">
                        {showError ? (
                          <div style={{ color: "red" }}>{error}</div>
                        ) : (
                          ""
                        )}
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("business_name_required")}*
                        </label>
                        <input
                          required
                          name="compName"
                          value={compName}
                          type="text"
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
                          onChange={(e) => setCompName(e.target.value)}
                        />
                        <div className="flex justify-between">
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("business_owner_name_required")}*
                            </label>
                            <input
                              required
                              onChange={(e) =>
                                setBusinessOwnerName(e.target.value)
                              }
                              value={businessOwnerName}
                              name="Owner_Name"
                              type="text"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                            />
                          </div>
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("business_owner_phone_required")}*
                            </label>
                            <input
                              required
                              onChange={(e) =>
                                setBusinessOwnerPhone(e.target.value)
                              }
                              value={businessOwnerPhone}
                              name="Owner_Phone"
                              type="number"
                              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                            />
                          </div>
                        </div>
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("email_address_required")}*
                        </label>
                        <input
                          required
                          onChange={(e) => setBusinessEmail(e.target.value)}
                          value={businessEmail}
                          name="email"
                          type="email"
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
                        />
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("address")}({t("required")})*
                        </label>
                        <input
                          required
                          onChange={(e) => setBusinessAddress(e.target.value)}
                          value={businessAddress}
                          name="address"
                          type="text"
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
                        />
                        <div className="flex justify-between">
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("country")}({t("required")})*
                            </label>
                            <div className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4">
                              {ccountry}
                            </div>
                          </div>
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("state/city")}({t("required")})*
                            </label>
                            <input
                              required
                              onChange={(e) => setState(e.target.value)}
                              value={state}
                              name="state"
                              type="text"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                            <>
                              <div className="mb-6">
                                <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                                  {t("district_required")}*
                                </label>
                                <select
                                  required
                                  onChange={(e) =>
                                    setDistDistrict(e.target.value)
                                  }
                                  value={distDistrict}
                                  name="district"
                                  type="text"
                                  placeholder={t("type_here")}
                                  className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                                >
                                  {districts?.map((item, key) => (
                                    <option key={key}>{item}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="mb-6">
                                <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                                  {t("region_required")}*
                                </label>
                                <select
                                  required
                                  onChange={(e) =>
                                    setBusinessRegion(e.target.value)
                                  }
                                  value={businessRegion}
                                  name="district"
                                  type="text"
                                  placeholder={t("type_here")}
                                  className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                                >
                                  {regions?.map((item, key) => (
                                    <option key={key}>{item}</option>
                                  ))}
                                </select>
                              </div>
                            </>
                        </div>
                        <div className="flex justify-between">
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {country === "South Africa"
                                ? "Stp Code(optional)"
                                : t("salesforce_code")}
                              ({t("optional")})
                            </label>
                            <input
                              onChange={(e) =>
                                setSalesforceCode(e.target.value)
                              }
                              value={salesforceCode}
                              name="salesforceCode"
                              type="text"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                            />
                          </div>
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("syspro_code")}*
                            </label>
                            <input
                              required
                              onChange={(e) => setSysproCode(e.target.value)}
                              value={sysproCode}
                              name="sysproCode"
                              type="text"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              Longitude({t("required")})*
                            </label>
                            <input
                              required
                              onChange={(e) => setLong(e.target.value)}
                              value={long}
                              name="long"
                              type="number"
                              step="0.000001"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                            />
                          </div>
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              Latitude({t("required")})*
                            </label>
                            <input
                              required
                              onChange={(e) => setLat(e.target.value)}
                              value={lat}
                              name="lat"
                              type="number"
                              step="0.000001"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                            />
                          </div>
                        </div>
                        <p className="font-customGilroy text-sm font-semibold not-italic text-red-main mb-5">
                          {ccountry === "Tanzania"
                            ? "Distributor Specialist"
                            : t("distributor_developer")}
                        </p>
                        <div className="flex justify-between">
                          <div className="mb-5">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("name")}({t("required")})*
                            </label>
                            <input
                              onChange={(e) => setDeveloperName(e.target.value)}
                              value={developerName}
                              name="DD_Name"
                              type="text"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("email_address")}({t("required")})*
                            </label>
                            <input
                              onChange={(e) =>
                                setDeveloperEmail(e.target.value)
                              }
                              value={developerEmail}
                              name="DD_Phone"
                              type="email"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                            />
                          </div>
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("phone_number")}({t("required")})*
                            </label>
                            <input
                              onChange={(e) =>
                                setDeveloperPhone(e.target.value)
                              }
                              value={developerPhone}
                              name="phone"
                              type="number"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                      <button
                        type="submit"
                        className="rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
                        style={{
                          backgroundColor:
                            countryConfig[userCountry].buttonColor,
                          color: countryConfig[userCountry].textColor,
                          opacity: formCompleted ? "1" : "0.3",
                        }}
                        disabled={!formCompleted ? true : false}
                      >
                        <p className="text-center">
                          {" "}
                          {loader ? t("saving") : t("save")}
                        </p>
                      </button>
                      {formCompleted ? (
                        <button
                          type="button"
                          className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                          onClick={clearNewDistributor}
                        >
                          {t("cancel")}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                          onClick={clearNewDistributor}
                        >
                          {t("cancel")}
                        </button>
                      )}
                    </div>
                  </form>
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
                    {!errorModal ? (
                      <>
                        <Checked />
                        <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                          {t("new_distributor_created")}!
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl">❌</p>
                        <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                          {t("an_error_occured")}!
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        {/*Upload modal*/}
        <Transition.Root show={uploadError} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            initialFocus={cancelButtonRef}
            onClose={() => setUploadError(false)}
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
                    onClick={() => setUploadError(false)}
                  >
                    <CloseModal />
                  </button>
                  <div className="flex flex-col justify-center items-center w-modal h-sub-modal -mt-12">
                    <Checked />
                    <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                      {formDataMsg}
                    </p>

                    <div className="flex flex-row-reverse gap-4 mt-10">
                      {/* <button
                        className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-5 py-2"
                        onClick={() => setApprovalModal(false)}
                      >
                        Manage Distributor
                      </button> */}

                      {/* <button
                        className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-2.5 py-2"
                        onClick={() => setOpen(true)}
                      >
                        Create New Distributor
                      </button> */}
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
                      {t("exit_distributor_creation")}
                    </p>
                  </div>
                  <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                    <button
                      className="rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
                      onClick={() => setWarningModal(false)}
                      style={{
                        backgroundColor: countryConfig[userCountry].buttonColor,
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
    allDistributors: state.AllDistributorReducer.all_distributors,
  };
};

export default connect(mapStateToProps, {
  addDistributor,
  getAllDistributor,
})(Home);
