import React, { Fragment, useEffect, useRef, useState } from "react";
import { findIndex, pullAt } from "lodash";
import { Dialog, Transition } from "@headlessui/react";
import { Fade } from "react-reveal";
import { useDispatch, useSelector } from "react-redux";
import { CloseModal, Checked } from "../../assets/svg/modalIcons";
import Loading from "./Loading";
import {
  discardChanges,
  getAllInventory,
  updateTransferChange,
  getLVAV,
  setInventoryDocument,
  receiveNewStock,
} from "../../modules/Inventory/actions/inventoryProductAction";
import { getSingleDistributor } from "../../modules/Admin/pages/actions/adminDistributorAction";
import { useHistory, useParams } from "react-router-dom";
import { inventoryNet, distributorNet } from "../../utils/urls";
import { useTranslation } from "react-i18next";
import { getLocation } from "../../utils/getUserLocation";
import countryConfig from "../../utils/changesConfig.json";

const UnsavedTransferChanges = () => {
  const {t} = useTranslation()
  const [approvalModal, setApprovalModal] = useState(false);
  const [empties, setEmpties] = useState(0);
  const [emptiesModal, setEmptiesModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [discardModal, setDiscardModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [save, setSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const { Dist_Code } = useParams();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [userCountry, setUserCountry] = useState(country)

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);

  const transferQuantity = useSelector(
    (state) => state.InventoryReducer.transfer_quantities
  );

  const returnEmpties = useSelector(
		(state) => state.InventoryReducer.return_quantities
	);

  const receiveStock = useSelector(
    (state) => state.InventoryReducer.receive_new_stock
  );

  const inventoryDocumentDetails = useSelector(
    (state) => state.InventoryReducer.inventoryDocumentDetails
  );
  const approval_modal = useSelector(
    (state) => state.InventoryReducer.approval_modal
  );
  
  const docNo = inventoryDocumentDetails?.invoiceNumber;
  const orderNo = inventoryDocumentDetails?.orderNumber;
  const truckNo = inventoryDocumentDetails?.driver;
  const remarks = inventoryDocumentDetails?.remarks;
  const [LVAVToStore, setLVAVToStore] = useState([]);
  let adjustInventory = false;
  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  let dist_details = useSelector(
    (state) => state.AllDistributorReducer.distributor
  );
  const roles = AuthData.roles;
  if (!dist_code) {
    dist_code = Dist_Code;
  }

  useEffect(() => {
    dispatch(getSingleDistributor(dist_code));
  }, []);

  useEffect(() => {
    if (approval_modal) {
      setApprovalModal(true);
    } else {
      setApprovalModal(false);
    }
  }, [approval_modal])

  const handleReset = () => {
    setApprovalModal(false);
    setEmptiesModal(false);
    setOpen(true);
  };

  const updateDB = () => {
    setSave(t("updating"));
    setLoading(true);

    let toDB = {};
    if (
      transferQuantity.type === "setup" ||
      transferQuantity.type === "new-stock"
    ) {
      toDB["companyCode"] = dist_code;
      toDB["truckNo"] =
        truckNo === undefined || truckNo === "" ? "set-up" : truckNo;
      toDB["docNo"] = docNo === undefined || docNo === "" ? "set-up" : docNo;
      toDB["orderNo"] =
        orderNo === undefined || orderNo === "" ? "set-up" : orderNo;
      toDB["remarks"] =
        orderNo === undefined || remarks === "" ? "set-up" : remarks;
      toDB["country"] = country;
      toDB["stocks"] = transferQuantity.stockCounted;
      if (transferQuantity.type === "new-stock") {
        toDB["invoiceNo"] = docNo === undefined || docNo === "" ? "set-up" : docNo;
      }

      if (returnEmpties.length > 0) {
        let returnData = {
          companyCode: dist_code,
          stocks: returnEmpties?.map((item) => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
          }))
        }

        const inventory = inventoryNet();
			  inventory.post("empties/take-out", returnData).then((response) => {
          inventory.post("add-stock/", toDB).then((response) => {
            const distributor = distributorNet();
            distributor
              .patch("company-status/status/" + dist_details.SYS_Code, {
                status: "Active",
              })
              .then((response) => {
                setApprovalModal(false);
                setSuccessModal(true);
                dispatch(getAllInventory(dist_code));
                dispatch(setInventoryDocument({}));
                dispatch(updateTransferChange(false));
                dispatch(receiveNewStock(false));
                setTimeout(() => {
                  history.push("/dashboard/inventory/" + dist_code);
                }, 3000);
              });
          });
        })
      } else {
        const inventory = inventoryNet();
        inventory.post("add-stock/", toDB).then((response) => {
          const distributor = distributorNet();
          distributor
            .patch("company-status/status/" + dist_details.SYS_Code, {
              status: "Active",
            })
            .then((response) => {
              setApprovalModal(false);
              setSuccessModal(true);
              dispatch(getAllInventory(dist_code));
              dispatch(setInventoryDocument({}));
              dispatch(updateTransferChange(false));
              dispatch(receiveNewStock(false));
              setTimeout(() => {
                history.push("/dashboard/inventory/" + dist_code);
              }, 3000);
            });
        });
      }

    }
    // add an else if block to pop out modal with reasons and confirm button
    else {
      adjustInventory = true;
      toDB["companyCode"] = dist_code;
      toDB["data"] = transferQuantity.stockCounted;

      const inventory = inventoryNet();
      inventory.put("edit", toDB).then(() => {
        setApprovalModal(false);
        setSuccessModal(true);
        setSave(t("update_inventory"));
        setLoading(false);
        dispatch(updateTransferChange(false));
        dispatch(getAllInventory(dist_code));
        setTimeout(() => {
          history.push("/dashboard/inventory/" + dist_code);
        }, 2000);
      });
    }
  };

  const saveLVAV = (productID, LVAV) => {
    const index = findIndex(LVAVToStore, { productId: productID });
    if (!LVAV) {
      pullAt(LVAVToStore, [index]);
    } else {
      const item = {
        productId: productID,
        lowStock: parseInt(LVAV),
      };

      if (index < 0) {
        LVAVToStore.push(item);
      } else {
        LVAVToStore[index] = item;
      }
    }
    // LVAVToStore.length > 0
    //   ? dispatch(updateTransferQuantity(true, true))
    //   : dispatch(updateTransferQuantity(false, false));
  };

  return (
    <>
      {
        !receiveStock &&
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
              {t("you_have_unsaved_changes_Do_you_want_to_save_your_changes?")}
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
                  setDiscardModal(true)
                }}
              >
                {t("discard_changes")}
              </div>
              {roles === "Mini-Admin" ? (
                <button
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
                </button>
              ) : <div
                className="rounded p-3"
                style={{
                  backgroundColor: countryConfig[userCountry].unsavedButtonColor,
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
                {t("save")}
              </div>}
            </div>
          </div>
        </Fade>
      }

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
                    {
                      transferQuantity.type === 'edit' || (transferQuantity.type === 'new-stock' && returnEmpties.length > 0)
                    ?
                      t("are_you_sure_you_want_to_update_your_inventory?")
                    :
                      transferQuantity.type === 'setup'
                    ?
                      t("save_all_changes_made_to_the_inventory?")
                    :
                      t("are_you_sure_you_want_to_add_the_selection(s)_to_your_inventory?")
                    }
                  </p>
                </div>
                <div className="border border-solid px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-5 py-2"
                    onClick={() => updateDB()}
                    style={{
                      display: "flex",
                      backgroundColor: countryConfig[userCountry].buttonColor,
                      color: countryConfig[userCountry].textColor,
                    }}
                  >
                    { 
                      save || 
                        transferQuantity.type === 'edit' 
                      ? 
                        t("update_inventory") 
                      : 
                        transferQuantity.type === 'setup'
                      ?
                        t("yes, save")
                      :
                        t("add_to_inventory")
                    }
                    {loading ? <Loading /> : ""}
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

      <Transition.Root show={successModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
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
                <div className="flex flex-col justify-center items-center w-modal h-36">
                  <Checked />
                  <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                    {t("your_inventory_has_been_updated")}
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
                      dispatch(getAllInventory(dist_code));
                      dispatch(updateTransferChange(false));
                      history.push("/dashboard/inventory/" + dist_code);
                    }}
                  >
                    {t("okay")}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={discardModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setDiscardModal}
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
                  onClick={() => setDiscardModal(false)}
                >
                  <CloseModal />
                </button>
                <div className="flex flex-col justify-center items-center w-modal h-40 my-4">
                  <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4 px-12">
                    {t("discard_all_changes")}
                  </p>
                </div>
                <div className="border border-solid px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-5 py-2"
                    style={{
                      backgroundColor: countryConfig[userCountry].buttonColor,
                      color: countryConfig[userCountry].textColor,
                    }}
                    onClick={() => {
                      dispatch(discardChanges())
                      window.location.reload()
                    }}
                  >
                    {t("yes, discard changes")}
                  </button>
                  <button
                    className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                    onClick={() => setDiscardModal(false)}
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

export default UnsavedTransferChanges;

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
