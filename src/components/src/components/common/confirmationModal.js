import React, {Fragment, useRef, useEffect, useState} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../assets/svg/modalIcons";
import countryConfig from "../../utils/changesConfig.json";
import { useSelector } from "react-redux";
import { getLocation } from "../../utils/getUserLocation";
import Loading from "./Loading";
import { t } from "i18next";

const ConfirmationModal = ({
  message,
  action,
  actionText,
  loading,
  toggleState,
  cancel
}) => {
  
  const country = useSelector((state) => state.Auth.sessionUserData).country;
  const [userCountry, setUserCountry] = useState(country);
  const [approvalModal, setApprovalModal] = toggleState;
  const cancelButtonRef = useRef(null);

  const getCloseFunction = () => () => {
    setApprovalModal(false)
  }

  const cancelAction = cancel || getCloseFunction()  

  
  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);

  return (
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
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-mini-modal">
            <CloseModal className="ml-auto m-4 mb-0" onClick={() => setApprovalModal(false)} />
            <div className="h-mini-modal flex justify-center items-center">
              <p className="font-customGilroy not-italic text-base font-medium">
                {t(message)}
              </p>
            </div>
            <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
              <button
                className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                onClick={action}
                style={{
                  display: "flex",
                  backgroundColor: countryConfig[userCountry].buttonColor,
                  color: countryConfig[userCountry].textColor,
                }}
              >
                {actionText || 'save'}
                {loading ? <Loading /> : ""}
              </button>

              <button
                className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                onClick={cancelAction}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition.Root>
  );
};

export default ConfirmationModal