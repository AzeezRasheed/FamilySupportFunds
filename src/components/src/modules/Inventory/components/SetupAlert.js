import React, { Fragment } from 'react'
import { useSelector } from 'react-redux';
import { Dialog, Transition } from "@headlessui/react";
import { useParams, useHistory } from "react-router-dom";
import { ReactComponent as Info } from "../../../assets/svg/info-dashboard.svg";
import { useTranslation } from "react-i18next";

const SetupAlert = ({show, code}) => {
  const {t} = useTranslation()
    const history = useHistory();
    const dist_code = useSelector((state) => state.DistReducer.dist_code);
    return (
      <Transition.Root show={show} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => {
            "";
          }}
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
              <div
                style={{ height: 300 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle"
              >
                <div
                  style={{
                    backgroundColor: "#B11F24",
                    padding: "25px 33px",
                    display: "flex",
                  }}
                >
                  <Info width="50px" height="50px" />
                  <div
                    className="font-customGilroy"
                    style={{
                      marginLeft: 17,
                      fontSize: 30,
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    {t("inventory_setup")}
                  </div>
                </div>
                <div className="flex flex-col items-center w-modal">
                  <div
                    className="font-customGilroy not-italic font-medium text-center text-grey-85"
                    style={{ fontSize: 20, marginTop: 24 }}
                  >
                    {t("you_need_to_setup_inventory")}
                  </div>
                </div>
                <div
                  className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4"
                  style={{ marginTop: 85 }}
                >
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic"
                    style={{
                      outline: "none",
                      padding: "8px 29px",
                      fontSize: 14,
                    }}
                    onClick={() =>
                      history.push("/dashboard/inventory-setup/" + code)
                    }
                  >
                    {t("set_inventory")}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
}

export default SetupAlert
