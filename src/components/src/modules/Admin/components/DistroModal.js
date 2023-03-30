import React, { Fragment, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import Dashboard from '../../../Layout/Admin/Dashboard';
import DistributorLayout from '../Layout';
import { CloseModal, UploadFile, Checked } from '../../../assets/svg/modalIcons';
import { DistributorList } from '../../../utils/data';
import countryConfig from '../../utils/changesConfig.json'
import { getLocation } from '../../utils/getUserLocation'
import { tupleExpression } from '@babel/types';
import { useTranslation } from "react-i18next";



const DistroModal = ({ open,
  setOpen, approvalModal, setApprovalModal, warningModal, setWarningModal, formCompleted, cancelButtonRef, handleReset, handleApproval }) => {
    const { t } = useTranslation();
    const [country, setCountry] = useState('Ghana');


    useEffect(async () => {
      const loc = await getLocation();
      setCountry(loc);
    })
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
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-modal">
                <div className="h-modal overflow-y-scroll scrollbar-hide">
                  <CloseModal
                    className="ml-auto m-4 mb-0"
                    onClick={() => setWarningModal(true)}
                  />
                  <div className="-mt-2 px-12">
                    <div className="flex justify-between items-center mb-10">
                      <p className="font-customGilroy text-basex2 not-italic font-normal grey-100 py-6">
                        {t("new_distributor")}
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
                          Email Address
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
                      style={{ backgroundColor: countryConfig[country].buttonColor, color: countryConfig[country].textColor}}
                    >
                      {t("save")}
                    </button>
                  ) : (
                    <button
                      className="bg-opacity-30 rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
                      onClick={handleApproval}
                      style={{ backgroundColor: countryConfig[country].buttonColor, color: countryConfig[country].textColor}}

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
                    {t("new_distributor_created")}!
                  </p>

                  <div className="flex flex-row-reverse gap-4 mt-10">
                    <button
                      className="rounded font-customGilroy  text-center text-sm font-bold not-italic px-5 py-2"
                      onClick={() => setApprovalModal(false)}
                      style={{ backgroundColor: countryConfig[country].buttonColor, color: countryConfig[country].textColor}}

                    >
                      {t("manage_distributor")}
                    </button>

                    <button
                      className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-2.5 py-2"
                      onClick={() => setOpen(true)}
                    >
                      {t("create_new_distributor")}
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
                    {t("exit_distributor_creation")}
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
                    onClick={() => setWarningModal(false)}
                    style={{ backgroundColor: countryConfig[country].buttonColor, color: countryConfig[country].textColor}}
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
    </>
  );
};

export default DistroModal;
