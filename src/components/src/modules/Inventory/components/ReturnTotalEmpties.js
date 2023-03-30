import React, { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../../assets/svg/modalIcons";
import Loading from "../../../components/common/Loading";
import { inventoryNet } from "../../../utils/urls";
import { getTotalEmpties, openEmptiesButton, openReturnTotalEmptiesButton } from "../actions/inventoryProductAction";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'

const ReturnTotalEmpties = ({ code, show }) => {
  const {t} = useTranslation()
    const [loading, setLoading] = useState(false);
    const [emptiesNo, setEmptiesNo] = useState();
    const [truckNo, setTruckNo] = useState("");
    const [saveButton, setSaveButton] = useState(t("yes_please"));
    const [approvalModal, setApprovalModal] = useState(false);
    const [disable, setDisable] = useState(false)
    const [country, setCountry] = useState('Ghana');


    useEffect(async () => {
      const loc = await getLocation();
      setCountry(loc);
    })
    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);
    const dispatch = useDispatch()
    const openReturnTotalEmpties = useSelector(
      (state) => state.InventoryReducer.return_empties_button
    );

    const handleReset = () => {
      setApprovalModal(false);
      dispatch(openEmptiesButton(true));
    //   setOpen(true);
  };
  useEffect(() => {
    dispatch(getTotalEmpties(code));
  }, []);

    const totalEmpties = useSelector(
      (state) => state.InventoryReducer.totalEmpties
    );
    const updateDB = () => {
      
        // setLoading(true);
      // setSaveButton("Updating ");
      let toDB = {};
      toDB = {
        truckNo: truckNo,
        companyCode: code,
        quantityToReturn: parseInt(emptiesNo),
      };

    //addInitialEmpties(toDB)
      const inventory = inventoryNet()
      inventory.post("empties/take-out", toDB).then((response) => {
        setApprovalModal(false);
        setLoading(false);
        setEmptiesNo("")
        setTruckNo("")
        dispatch(openReturnTotalEmptiesButton(false))
        setSaveButton(t("yes_please"));
        dispatch(getTotalEmpties(code));
      });
      
    };

    return (
      <>
        <Transition.Root show={openReturnTotalEmpties} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            onClose={() => {
              dispatch(openReturnTotalEmptiesButton(false))
              // dispatch(openEmptiesButton(true));
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
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal">
                  <CloseModal
                    className="ml-auto m-4 mb-0"
                    onClick={() =>{
                      dispatch(openReturnTotalEmptiesButton(false));
                      dispatch(openEmptiesButton(true));
                    }
                    }
                  />
                  <div className="flex justify-between items-center px-6">
                    <p
                      className="font-customGilroy not-italic font-normal grey-100"
                      style={{ fontSize: "32px" }}
                    >
                      {t("return_empties")}
                    </p>
                  </div>
                  <input
                    className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
                    placeholder={t("Enter the number of empties")}
                    value={emptiesNo}
                    onChange={(e) => setEmptiesNo(e.target.value)}
                    style={{
                      marginLeft: "1.5rem",
                      marginTop: "1.5rem",
                      outline: "none",
                    }}
                  />
                  <input
                    className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-6"
                    placeholder={t("enter the plate number of the truck")}
                    value={truckNo}
                    onChange={(e) => setTruckNo(e.target.value)}
                    style={{
                      marginLeft: "1.5rem",
                      marginTop: "1.5rem",
                      outline: "none",
                    }}
                  />
                  <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                    <button
                      style={{
                        backgroundColor: countryConfig[country].buttonColor,
                        color: countryConfig[country].textColor,
                        opacity:
                          truckNo === "" || emptiesNo === "" ? "50%" : "100%",
                      }}
                      disabled={
                        truckNo === "" || emptiesNo === "" ? true : false
                      }
                      type="submit"
                      className="rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
                      onClick={() =>
                        parseInt(emptiesNo) > totalEmpties
                          ? t(
                              "This number is greater than the empties you have"
                            )
                          : setApprovalModal(true)
                      }
                    >
                      {t("save")}
                    </button>
                    <button
                      className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                      onClick={() =>
                        {
                          dispatch(openReturnTotalEmptiesButton(false));
                          dispatch(openEmptiesButton(true));
                        }
                      }
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

        <Transition.Root show={approvalModal} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            initialFocus={cancelButtonRef}
            onClose={() => setApprovalModal(false)}
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
                    onClick={() => handleReset()}
                  />
                  <div className="h-mini-modal flex justify-center items-center">
                    <p className="font-customGilroy not-italic text-base font-medium">
                      {t("Are you sure you want to return these empties?")}
                    </p>
                  </div>
                  <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                    <button
                      className="rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                      onClick={() => updateDB()}
                      style={{
                        display: "flex",
                        backgroundColor: countryConfig[country].buttonColor,
                        color: countryConfig[country].textColor,
                      }}
                    >
                      {saveButton}
                      {loading ? <Loading /> : ""}
                    </button>

                    <button
                      className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                      onClick={() => handleReset()}
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

export default ReturnTotalEmpties;
