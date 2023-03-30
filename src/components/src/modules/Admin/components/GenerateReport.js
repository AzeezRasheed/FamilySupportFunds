import React, { useState, Fragment, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dialog, Transition } from "@headlessui/react";
import { Checked, CloseModal, Error } from "../../../assets/svg/modalIcons";
import Loading from "../../../components/common/Loading";

const GenerateReport = ({ type, generateReport }) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [sendEmail, setSendEmail] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const isDownloadSuccessful = useSelector((state) => state.ReportReducer.is_download_success);
  const save = "Yes, send email";

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (generateReport) {
      setApprovalModal(true);
    }
  }, [generateReport])

  useEffect(() => {
    if (isDownloadSuccessful !== null) {
      if (isDownloadSuccessful) {
        setSendEmail(false);
        setApprovalModal(false);
        setSuccessModal(true);
      } else {
        setErrorModal(true);
        setApprovalModal(false);
        setSendEmail(false);
      }
    }
  }, [isDownloadSuccessful])

  const sendReport = () => {
    setSendEmail(true)
    // update type when sending as params
    if (type === 'getStockCount') {
      // replace with endpoint to call to dispatch a generateReport function
    //   dispatch(downloadDailyStockReport(country === "South Africa" ? "SA" : country, startRange, stopRange, AuthData.email))
    }
  }

  const handleReset = () => {
    setApprovalModal(false);
    setErrorModal(false)
    setSuccessModal(false);
  };

  return (
    <>
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
                <button
                  className="flex justify-center ml-auto m-4 mb-0"
                  onClick={handleReset}
                >
                  <CloseModal />
                </button>
                <div className="h-mini-modal flex justify-center items-center">
                  {/* <Checked /> */}
                  <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                    We will send this report to your registered email:<br />
                    {AuthData.email}. <br /> Do you want to continue?
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    onClick={() => sendReport()}
                    style={{ display: "flex", opacity: sendEmail ? "0.5" : 1 }}
                    disabled={sendEmail}
                  >
                    {save}
                    {sendEmail ? <Loading /> : ""}
                  </button>

                  <button
                    className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                    onClick={handleReset}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={errorModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setErrorModal}
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
                <button
                  className="flex justify-center ml-auto m-4 mb-0"
                  onClick={handleReset}
                >
                  <CloseModal />
                </button>
                <div
                  className=" flex justify-center items-center"
                  style={{ flexDirection: "column" }}
                >
                  <Error width={50} height={50} />
                  <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                    Network error. Please try again.
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                    onClick={handleReset}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
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
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-mini-modal">
                <button
                  className="flex justify-center ml-auto m-4 mb-0"
                  onClick={handleReset}
                >
                  <CloseModal />
                </button>
                <div
                  className="h-mini-modal flex justify-center items-center"
                  style={{ flexDirection: "column" }}
                >
                  <Checked width={50} height={50} />
                  <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                    Report sent. <br />
                    It will arrive in your inbox within 3-5 minutes
                    <br />
                    <span className="text-sm">
                      You can check your spam/junk folder also
                    </span>
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    onClick={handleReset}
                  >
                    Okay, thanks.
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

export default GenerateReport;
