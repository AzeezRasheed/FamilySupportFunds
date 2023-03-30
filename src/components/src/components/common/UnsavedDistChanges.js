import React, { Fragment, useEffect, useRef, useState } from "react";
import { cloneDeep, concat } from "lodash";
import { Dialog, Transition } from "@headlessui/react";
import { Fade } from "react-reveal";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import whiteLogo from "../../assets/svg/whiteLogo.svg";
import {
  discardChanges,
  updatePriceChange,
  saveDistProducts,
} from "../../modules/Admin/Pricing/actions/AdminPricingAction";
import { CloseModal, Checked } from "../../assets/svg/modalIcons";
import ApprovalModal from "../../modules/Admin/components/ApprovalModal";
import Loading from "./Loading";
import { t } from "i18next";
import countryConfig from "../../utils/changesConfig.json";
import { getLocation } from "../../utils/getUserLocation";

const UnsavedDistChanges = () => {
  const [approvalModal, setApprovalModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [save, setSave] = useState("Yes, update Distributor prices");
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);
  const dispatch = useDispatch();
  const { Dist_Code } = useParams();
  const [country, setCountry] = useState(
     useSelector(state => state.Auth.sessionUserData).country
  );

  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country]);
  let dist_code = useSelector(state => state.DistReducer.dist_code)
  if (!dist_code) {
    dist_code = Dist_Code;
  }
  const distPriceChange = useSelector(
    (state) => state.DistributorPricingReducer.distPriceChange
  );
  const updatedProducts = useSelector(
    (state) => state.DistributorPricingReducer.updatedProducts
  );
  const loadingState = useSelector(
    (state) => state.DistributorPricingReducer.loading
  );

  const handleReset = () => {
    setApprovalModal(false);
    setOpen(true);
  };

  const updateDB = () => {
    const array = cloneDeep(updatedProducts);
    let processedArray = array.map((item) => ({
      productId: item.id,
      price: item.price,
    }));
    //   let obj = {};
    //   obj["productId"] = item.id
    //   obj["price"] = item.price
    //   return obj
    let toDB = {};
    toDB["products"] = processedArray;
    dispatch(saveDistProducts(toDB, updatedProducts, dist_code));

    if (loadingState) {
      setSave("Updating prices");
      setLoading(true);
    } else {
      setApprovalModal(false);
      setSuccessModal(true);
      setSave("Yes, update prices");
      setLoading(false);
    }
  };

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
            backgroundColor: countryConfig[country].primaryColor,
          }}
          className="shadow-xl h-20 p-3"
        >
          <div style={{ width: 100 }}></div>
          {/* <img src={whiteLogo} width="178px" height="48px" alt="logo" /> */}
          <div className="font-customGilroy" style={styles.text}>
            {t("you_have_unsaved_changes_Do_you_want_to_save_your_changes?")}
          </div>
          <div
            style={{ display: "inline-flex", justifyContent: "space-between" }}
          >
            <div
              className="border border-white rounded p-3 pt-4 capitalize"
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
              }}
            >
              {t("cancel")}
            </div>
            <div
              className="rounded p-3 pt-4"
              style={{
                backgroundColor: countryConfig[country].unsavedButtonColor,
                color: countryConfig[country].unsavedButtonTextColor,
                fontSize: 16,
                fontWeight: 600,
                textAlign: "center",
                width: 88,
                cursor: "pointer",
              }}
              onClick={() => setApprovalModal(true)}
            >
              {t("save")}
            </div>
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
                    {t("Are you sure you want to update these prices?")}
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    onClick={() => updateDB()}
                    style={{
                      display: "flex",
                      backgroundColor: countryConfig[country].buttonColor,
                      color: countryConfig[country].textColor,
                    }}
                  >
                    {save}
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
                    {t("Your changes have been saved, and the prices updated")}
                  </p>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    onClick={() => setSuccessModal(false)}
                    style={{
                      backgroundColor: countryConfig[country].buttonColor,
                      color: countryConfig[country].textColor,
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
    </>
  );
};

export default UnsavedDistChanges;

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
