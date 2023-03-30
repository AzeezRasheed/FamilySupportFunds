import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../../assets/svg/modalIcons";
import countryConfig from "../../../utils/changesConfig.json";
import { useTranslation } from "react-i18next";
import { getRegions, getDistricts } from "../../../utils/getDistrictsRegions";

const RegisterCustomerStepTwo = ({
  previousPage,
  nextPage,
  handleChange,
  setWarningModal,
  values,
  onSubmit,
  setOpen,
}) => {
  const { t } = useTranslation();
  const {
    deliveryCity,
    deliveryRegion,
    address,
    ccountry,
    userCountry,
    long,
    lat,
    open,
    district,
  } = values;

  const [formCompleted, setFormCompleted] = useState(false);
  const [loader, setLoader] = useState(false);
  const districts = getDistricts(ccountry);
  const regions = getRegions(ccountry, district);
  useEffect(() => {
    if (ccountry === "Uganda" || ccountry === "Tanzania") {
      if (
        deliveryRegion !== "" &&
        deliveryCity !== "" &&
        address !== "" &&
        district !== "" &&
        long !== "" &&
        lat !== ""
      ) {
        setFormCompleted(true);
      } else {
        setFormCompleted(false);
      }
    } else {
      if (
        address !== "" &&
        long !== "" &&
        lat !== "" &&
        district !== "" &&
        deliveryRegion !== ""
      ) {
        setFormCompleted(true);
      } else {
        setFormCompleted(false);
      }
    }
  });

  {
    /* customer Modal - Step 2 */
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
                        (Step 2 of 3)
                      </span>
                    </p>
                  </div>
                  <div className="mt-2 px-12">
                    <div className="flex justify-between">
                      <div className="mb-6">
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("country")}
                        </label>
                        <div className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4">
                          {ccountry}
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("delivery_city_required")}
                          {ccountry === "Uganda" || ccountry === "Tanzania"
                            ? "(required)*"
                            : ""}
                        </label>
                        <input
                          required={
                            ccountry === "Uganda" || ccountry === "Tanzania"
                          }
                          onChange={handleChange}
                          value={deliveryCity}
                          name="deliveryCity"
                          type="text"
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="mb-6">
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("district_required")}*
                        </label>
                        <select
                          required
                          onChange={handleChange}
                          value={district}
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
                          {t("delivery_region")}*
                        </label>
                        <select
                          required
                          onChange={handleChange}
                          value={deliveryRegion}
                          name="deliveryRegion"
                          type="text"
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                        >
                          {regions?.map((item, key) => (
                            <option key={key}>{item}</option>
                          ))}
                        </select>                 
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                        {t("address") + "(required)*"}
                      </label>
                      <input
                        required
                        onChange={handleChange}
                        value={address}
                        name="address"
                        type="text"
                        placeholder={t("type_here")}
                        className="bg-white rounded block w-full border border-solid border-grey-25 font-customGilroy text-base font-medium not-italic py-3 px-4"
                      />
                    </div>
                    <div className="flex justify-between">
                      <div className="mb-12">
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          Longitude(required)*
                        </label>
                        <input
                          required
                          onChange={handleChange}
                          value={long}
                          name="long"
                          type="text"
                          placeholder="Type here"
                          className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                        />
                      </div>
                      <div className="mb-12">
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          Latitude(required)*
                        </label>
                        <input
                          required
                          onChange={handleChange}
                          value={lat}
                          name="lat"
                          type="text"
                          placeholder="Type here"
                          className="bg-white rounded border border-solid w-input-sm border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4"
                        />
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
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2 ml-6"
                    style={{
                      backgroundColor: countryConfig[userCountry].buttonColor,
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

export default RegisterCustomerStepTwo;
