import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fade } from "react-reveal";
import { useDispatch, useSelector } from "react-redux";
import { CloseModal, Checked, Error } from "../../assets/svg/modalIcons";
import Loading from "./Loading";
import {
  discardChanges,
  getAllInventory,
  updateDailysTOCKTransferQuantity,
  updateAccurateDailyStockCount,
} from "../../modules/Inventory/actions/inventoryProductAction";
import { useHistory, useParams } from "react-router-dom";
import { getLocation } from "../../utils/getUserLocation";
import countryConfig from "../../utils/changesConfig.json";

const UnsavedDailyStock = () => {
  const [approvalModal, setApprovalModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [save, setSave] = useState("Yes, save");
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const { Dist_Code } = useParams();
  let AuthData = useSelector((state) => state.Auth.sessionUserData);
  const country = AuthData.country;
  const [prevStock, setPreviousStock] = useState([]);
  const [userCountry, setUserCountry] = useState(country);

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);

  const roles = AuthData.roles;
  const transferQuantity = useSelector(
    (state) => state.InventoryReducer.transfer_quantities_daily_stock
  );

  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );

  const stock_count_updated = useSelector(
    (state) => state.InventoryReducer.stock_count_updated
  );

  const error = useSelector(
    (state) => state.InventoryReducer.error
  );
  const errorMessage = useSelector(
    (state) => state.InventoryReducer.error_message
  );

  useEffect(() => {
    allInventory.map((value) => {
      prevStock.push({
        productId: value.productId,
        quantity: value.quantity,
      });
    });
  }, []);

  useEffect(() => {
    if (stock_count_updated) {
      setApprovalModal(false);
      setLoading(false);
      if (error) {
        setErrorModal(true);
      } else {
        setSuccessModal(true);
        setSave("Yes, save");
        dispatch(updateDailysTOCKTransferQuantity(false));
        dispatch(getAllInventory(dist_code));
        setTimeout(() => {
          history.push("/dashboard/inventory/" + dist_code);
        }, 2000);
      }
    }
  }, [stock_count_updated])

  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  if (!dist_code) {
    dist_code = Dist_Code;
  }

  const handleReset = () => {
    setApprovalModal(false);
  };

  const updateDB = () => {
    setLoading(true);
    setSave("Saving");

    let processedArray = [];
    prevStock?.map((item) => {
      const value = transferQuantity.stockCounted?.filter(
        (val) => val.productId === item.productId
      )[0];
      value
        ? processedArray.push({
            productId: parseInt(value.productId),
            quantity: parseInt(value.quantity),
            empties: parseInt(value.empties),
            reason: !value.reason ? [] : value.reason,
          })
        : processedArray.push({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            empties: !item.empties ? 0 : parseInt(item.empties),
            reason: [],
          });
    });
      
    const toDB = {
      companyCode: dist_code,
      country: country === "South Africa" ? "SA" : country,
      stocks: processedArray,
      accurate: false,
    }

    dispatch(updateAccurateDailyStockCount(toDB));
  };

  const clearError = () => {
    setErrorModal(false);
    dispatch(updateDailysTOCKTransferQuantity(false));
    dispatch(getAllInventory(dist_code));
    setTimeout(() => {
      history.push("/dashboard/inventory/" + dist_code);
    }, 1000);
  }

  return (
    <>
      <Fade>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            boxShadow: "0px 4px 16px rgba(89, 85, 84, 0.15)",
            width: "100%",
            paddingLeft: "0.75em",
            paddingRight: 80,
            paddingTop: "0.75em",
            paddingBottom: "0.75em",
            backgroundColor: countryConfig[userCountry].primaryColor,
          }}
          className="shadow-xl h-20 p-3"
        >
          <div style={{ width: 100 }}></div>
          {/* <img src={whiteLogo} width="178px" height="48px" alt="logo" /> */}
          <div
            className="font-customGilroy"
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              color: countryConfig[userCountry].textColor,
              fontSize: 20,
              paddingTop: 12,
              paddingBottom: 12,
            }}
          >
            You have unsaved changes. Do you want to save your changes?
          </div>
          <div
            style={{ display: "inline-flex", justifyContent: "space-between" }}
          >
            <div
              className="border border-white rounded p-3"
              style={{
                backgroundColor: "transparent",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 600,
                textAlign: "center",
                marginRight: 24,
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch(discardChanges());
                window.location.reload();
              }}
            >
              Discard changes
            </div>
            {roles === "Mini-Admin" ? (
              <div
                className="rounded p-3"
                style={{
                  backgroundColor: "#BEBEBE",
                  color: "black",
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: "center",
                  width: 88,
                  cursor: "pointer",
                }}
              >
                Save
              </div>
            ) : (
              <div
                className="rounded p-3"
                style={{
                  backgroundColor:
                    countryConfig[userCountry].unsavedButtonColor,
                  color: countryConfig[userCountry].unsavedButtonTextColor,
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: "center",
                  width: 88,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setApprovalModal(true);
                }}
              >
                Save
              </div>
            )}
          </div>
        </div>
      </Fade>

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
                <CloseModal
                  className="ml-auto m-4 mb-0"
                  onClick={handleReset}
                />
                <div className="h-mini-modal flex justify-center items-center">
                  <p className="font-customGilroy not-italic text-base font-medium">
                    Save today's Stock count?
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    onClick={() => updateDB()}
                    style={{
                      display: "flex",
                      backgroundColor: countryConfig[userCountry].buttonColor,
                      color: countryConfig[userCountry].textColor,
                    }}
                  >
                    {save}
                    {loading ? <Loading /> : ""}
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
                    Your inventory has been updated
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
                      setSuccessModal(false);
                      history.push("/dashboard/inventory/" + dist_code);
                    }}
                  >
                    Okay
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
                  onClick={clearError}
                >
                  <CloseModal />
                </button>
                <div
                  className=" flex justify-center items-center"
                  style={{ flexDirection: "column" }}
                >
                  <Error width={50} height={50} />
                  <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                    {error ? errorMessage : 'Network error. Please try again.'}
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                    onClick={clearError}
                  >
                    Okay
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

export default UnsavedDailyStock;

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    background: "#B11F24",
    boxShadow: "0px 4px 16px rgba(89, 85, 84, 0.15)",
    width: "100%",
    paddingLeft: "0.75em",
    paddingRight: 80,
    paddingTop: "0.75em",
    paddingBottom: "0.75em",
  },
  text: {
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
};
