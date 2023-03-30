import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fade } from "react-reveal";
import { connect, useDispatch, useSelector } from "react-redux";
import { CloseModal, Checked } from "../../assets/svg/modalIcons";
import Loading from "./Loading";
import { useHistory } from "react-router-dom";
import {
  getCatalogueBySellerId,
  getAllCatalogue,
  updateCataloguePrice,
  discardChanges,
} from "../../modules/Transaction/actions/productCatalogue";
import { inventoryNet, productCatolgueNet } from "../../utils/urls";
import { t } from "i18next";
import countryConfig from "../../utils/changesConfig.json";
import { getLocation } from "../../utils/getUserLocation";

const UnsavedVanTransferChanges = (sellersCatalogue) => {
  const [approvalModal, setApprovalModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [save, setSave] = useState("Update Price");
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const [country, setCountry] = useState(
    useSelector((state) => state.Auth.sessionUserData).country
  );

  
  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country]);
  
  useEffect(() => {}, []);
  
  const catalogueChanges = useSelector(
    (state) => state.ProductCatalogueReducer.allCatalogue
  );

    const dist_code = useSelector((state) => state.VanInventoryReducer.distCode);
    useEffect(() => {
      getCatalogueBySellerId(dist_code)
    }, [dist_code]);

  // const fromLocation = useSelector(
  //   (state) => state.DropPointReducer.from_dropPoint
  // );
  // const toLocation = useSelector(
  //   (state) => state.DropPointReducer.to_dropPoint
  // );
  const handleReset = () => {
    setApprovalModal(false);
    setOpen(true);
  };

  const getProductCatalogueId = (productId) => {
    const catalogue = sellersCatalogue.sellersCatalogue.data.filter((product) => product.productId === productId);
    if (catalogue.length === 0) {
      return false;
    }
    return catalogue[0].productCatalogueId;
  }

  const updateDB = async() => {
    let toBeCreatedArray = [];
    let toBeUpdatedArray = [];

    catalogueChanges?.map((item) => {
      const productCatalogueId = getProductCatalogueId(item.productId);

      if (!productCatalogueId) {
        toBeCreatedArray.push({
          productId: item.productId,
          price: item.price,
          sellerCompanyId: item.sellerCompanyId
        })
      } else {
        toBeUpdatedArray.push({
          productCatalogueId: productCatalogueId,
          price: item.price
        })
      }
    });

    const toBeCreatedValues = {
      data: toBeCreatedArray
    };

    const toBeUpdatedValues = {
      data: toBeUpdatedArray
    }

    setSave("Updating...");
    setLoading(true);

    const productCatalogue = productCatolgueNet();
    productCatalogue
      .post(
        `CreateProductCatalogue`,
        toBeCreatedValues
      )
      .then((response) => {
        if (toBeUpdatedArray.length === 0) {
          setApprovalModal(false);
          setSuccessModal(true);
          setSave("Change Price");
          setLoading(false);
          dispatch(updateCataloguePrice(false));
          dispatch(getCatalogueBySellerId(dist_code));
        } else {
          productCatalogue
            .patch(
              `EditProductCatalogue/UpdatePrice`,
              toBeUpdatedValues
            ).then((response) => {
              setApprovalModal(false);
              setSuccessModal(true);
              setSave("Change Price");
              setLoading(false);
              dispatch(updateCataloguePrice(false));
              dispatch(getCatalogueBySellerId(dist_code));
            })
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {});
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
          <div
            className="font-customGilroy"
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              color: countryConfig[country].textColor,
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
                dispatch(discardChanges());
                window.location.reload();
              }}
            >
              {t("discard_changes")}
            </div>
            <div
              className="rounded p-3"
              style={{
                backgroundColor: countryConfig[country].unsavedButtonColor,
                color: countryConfig[country].unsavedButtonTextColor,
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
                    {t("Are you sure you want to update these prices")}
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
                    style={{
                      backgroundColor: countryConfig[country].buttonColor,
                      color: countryConfig[country].textColor,
                    }}
                    onClick={() => setSuccessModal(false)}
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

// export default UnsavedVanTransferChanges;

const mapStateToProps = (state) => {
  return {
    sellersCatalogue: state.ProductCatalogueReducer.allSellersCatalogue
  };
};

export default connect(mapStateToProps, {
  getCatalogueBySellerId
})(UnsavedVanTransferChanges);

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
