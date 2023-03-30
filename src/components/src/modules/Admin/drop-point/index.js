import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Dashboard from "../../../Layout/Admin/Dashboard";
import { DropPoints } from "../../../utils/data";
import {
  Dropdown,
  Previouspage,
  Progination,
  Redirect,
} from "../../../assets/svg/adminIcons";
import {
  CloseModal,
  UploadFile,
  Checked,
} from "../../../assets/svg/modalIcons";
import DistributorNavbar from "../components/navbar";
import { useHistory } from "react-router-dom" 
import  { getSingleDistributor } from "../pages/actions/adminDistributorAction";
import { getDroppointsByCompanyId, addDropPoint } from "./actions/droppoints";
import { useTranslation } from "react-i18next";

const DropPoint = ({
  location,
  getSingleDistributor,
  distributor,
  addDropPoint,
  getDroppointsByCompanyId,
  dropPoints,
}) => {
  const code = location.pathname.split("/").at(-1);
  useEffect(() => {
    getDroppointsByCompanyId(code);
    getSingleDistributor(code);
  }, []);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [dLocation, setDLocation] = useState("");
  const [locationId, setLocationId] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [formCompleted, setFormCompleted] = useState(false);
  const { t } = useTranslation();

  const history = useHistory();

  const cancelButtonRef = useRef(null);
  const handlePush = () => {
    history.push("/distributor/order-summary");
  };

  const handleReset = () => {
    setWarningModal(false);
    setOpen(true);
  };

  useEffect(() => {
    if (
      locationName !== "" &&
      address !== "" &&
      dLocation !== "" &&
      locationId !== "" &&
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
    await addDropPoint({
      companyID: code,
      locationName,
      address,
      locationId,
      location: dLocation,
      latitude: lat,
      longitude: long,
    }).then(() => {
      getDroppointsByCompanyId(code);
      setTimeout(() => {
        setDLocation("");
        setLocationName("");
        setLocationId("");
        setAddress("");
        setLat("");
        setLong("");
        setLoader(false);
        setOpen(false);
        setApprovalModal(true);
      }, 3000);
    });
  };
  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {/* <Link to="/admin-dashboard"> */}
            <Previouspage onClick={() => history.goBack()} />
            {/* </Link> */}
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {distributor.company_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
          <p className="font-normal text-gray-400">
            {distributor.company_type}
          </p>
          /
          <p className="font-medium text-grey-100">
            {distributor.company_name}
          </p>
        </div>
        <DistributorNavbar distributor={distributor} code={code} />
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div className="flex mt-3 px-4 justify-between items-center">
              <input
                className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                id="search"
                type="text"
                name="search"
                style={{ width: "45rem", backgroundColor: "#E5E5E5" }}
                // onChange={(e) => onChange(e)}.
                placeholder="Search for a drop point"
              />
              <button
                className="bg-red-main font-customGilroy not-italic font-bold text-base text-white py-2 px-5 rounded"
                onClick={() => setOpen(true)}
              >
                {t("add_new_drop_point")}
              </button>
            </div>
            <table className="min-w-full mt-8 divide-y divide-gray-200">
              <thead className="bg-transparent font-customGilroy text-sm text-grey-100 tracking-widest">
                <tr className="">
                  <th className="pl-8 py-3 text-gray-400 font-medium text-left align-middle">
                    S/N
                  </th>
                  <th className="py-3 text-left align-middle">Drop Point</th>
                  <th className="py-3 text-left align-middle">Address</th>
                  <th className="py-3 text-left align-middle">Coordinate</th>
                  {/* <th className="py-3 text-left align-middle"></th> */}
                </tr>
              </thead>
              <tbody className="bg-white px-6 divide-y divide-gray-200">
                {dropPoints.map((data, index) => (
                  <tr
                    key={index}
                    onClick={handlePush}
                    className="cursor-pointer"
                  >
                    <td className="font-customGilroy text-sm font-medium text-left align-middle pl-8 py-6">
                      {index + 1 + "."}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                      {data.location_name}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                      {data.address}
                    </td>
                    <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">{`${data.long} ${data.lat} `}</td>
                    {/* <td className="font-customGilroy text-sm font-medium text-left align-middle py-6">
                      <button className="flex items-center h-10 gap-2 border border-grey-25 py-1 rounded-lg px-4 mt-2">
                        Actions <Dropdown />
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
            <div className="flex justify-end items-center gap-4 mr-20 mt-6">
              1 - 50 of 100 <Progination />
            </div>
          </div>
        </div>
        {/* Add Drop Point Modal Modal */}
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
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-modal">
                    <div className="h-modal overflow-y-scroll scrollbar-hide">
                      <CloseModal
                        className="ml-auto m-4 mb-0"
                        onClick={() => setOpen(false)}
                      />
                      <div className="-mt-2 px-12">
                        <div className="flex justify-between items-center mb-10">
                          <p className="font-customGilroy text-basex2 not-italic font-normal grey-100 py-6">
                            {t("new_drop_point")}
                          </p>
                          <div className="flex gap-2 mr-6">
                            <UploadFile />
                            <p className="font-customGilroy text-base font-semibold text-grey-70">
                              {t("upload")} CSV
                            </p>
                          </div>
                        </div>
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("location_name")}
                        </label>
                        <input
                          onChange={(e) => setLocationName(e.target.value)}
                          value={locationName}
                          name="locationName"
                          type="text"
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
                          required
                        />
                        <div className="flex justify-between">
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("distributor_location")}
                            </label>
                            <input
                              onChange={(e) => setDLocation(e.target.value)}
                              value={dLocation}
                              name="location"
                              type="text"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                              required
                            />
                          </div>
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              {t("address")}
                            </label>
                            <input
                              onChange={(e) => setAddress(e.target.value)}
                              value={address}
                              name="address"
                              type="text"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                              required
                            />
                          </div>
                        </div>
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("location_id")}
                        </label>
                        <input
                          onChange={(e) => setLocationId(e.target.value)}
                          value={locationId}
                          name="locationId"
                          type="text"
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
                          required
                        />
                        <div className="flex justify-between">
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              Longitude
                            </label>
                            <input
                              onChange={(e) => setLong(e.target.value)}
                              value={long}
                              name="longitude"
                              type="text"
                              placeholder={t("type_here")}
                              className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                              required
                            />
                          </div>
                          <div className="mb-6">
                            <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                              Latitude
                            </label>
                            <input
                              onChange={(e) => setLat(e.target.value)}
                              value={lat}
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
                      <button
                        type="submit"
                        className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                        style={{ opacity: formCompleted ? "1" : "0.3" }}
                        disabled={!formCompleted ? true : false}
                      >
                        <p className="text-center">
                          {" "}
                          {loader ? t("saving") : t("save")}
                        </p>
                      </button>
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
                </form>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
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
                      {t("new_drop_created")}
                    </p>
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
                      {t("exit_drop_drop")}
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
    dropPoints: state.DropPointReducer.drop_points,
    distributor: state.AllDistributorReducer.distributor,
  };
};

export default connect(mapStateToProps, {
  getDroppointsByCompanyId,
  addDropPoint,
  getSingleDistributor,
})(DropPoint);
