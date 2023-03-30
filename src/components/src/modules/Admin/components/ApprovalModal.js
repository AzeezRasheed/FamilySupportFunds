import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal, Checked } from "../../../assets/svg/modalIcons";

const ApprovalModal = () => {
  const [open, setOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={successModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setSuccessModal}
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
                onClick={() => setSuccessModal(false)}
              >
                <CloseModal />
              </button>
              <div className="flex flex-col justify-center items-center w-modal h-sub-modal -mt-12">
                <Checked />
                <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                  Your changes have been saved, and the prices updated
                </p>
              </div>
              <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                <button className="bg-red-main bg-opacity-30 rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                  onClick={() => setSuccessModal(false)}
                >
                  Okay
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ApprovalModal;
