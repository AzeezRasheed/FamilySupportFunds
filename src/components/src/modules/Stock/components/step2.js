import React, { Fragment, useEffect, useRef, useState } from "react";
import Dashboard from "../../../Layout/Dashboard";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  discardChanges,
  setInventoryDocument,
} from "../../Inventory/actions/inventoryProductAction";
import { Return } from "../../../assets/svg/adminIcons";
import { inventoryNet } from "../../../utils/urls";
import { useTranslation } from "react-i18next";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../../assets/svg/modalIcons";

const Step2 = ({ location }) => {
  const [documentNumber, setDocumentNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const { Dist_Code } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const { t } = useTranslation();
  const [userCountry, setUserCountry] = useState('Ghana');
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState(false);
  const cancelButtonRef = useRef(null);

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
    dispatch(discardChanges());
  }, []);

  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  if (!dist_code) {
    dist_code = Dist_Code;
  }

  const inventoryDocumentDetails = useSelector(
    (state) => state.InventoryReducer.inventoryDocumentDetails
  );

  useEffect(() => {
    if (inventoryDocumentDetails.invoiceNumber) {
      setDocumentNumber(inventoryDocumentDetails.invoiceNumber)
    }
    if (inventoryDocumentDetails.orderNumber) {
      setOrderNumber(inventoryDocumentDetails?.orderNumber)
    }
    if (inventoryDocumentDetails.driver) {
      setTruckNumber(inventoryDocumentDetails?.driver)
    }
    if (inventoryDocumentDetails.remarks) {
      setRemarks(inventoryDocumentDetails?.remarks)
    }
  }, [inventoryDocumentDetails])

  const clickFunction = () => {
    let details = {};
    details["invoiceNumber"] = documentNumber;
    details["orderNumber"] = orderNumber;
    details["driver"] = truckNumber;
    details["country"] = country === "South Africa" ? "SA" : country;
    details["dist_code"] = dist_code;
    details["remarks"] = remarks;

    setLoading(true);
    const inventory = inventoryNet()
    inventory.get("stocks/" + documentNumber).then((response) => {
      const { products } = response.data.data;

      if (products.length > 0) {
        setLoading(false);
        setErrorModal(true);
        setError(true);
      } else {
        dispatch(setInventoryDocument(details));
        history.push(`/dashboard/add-product/${dist_code}`);
      }
    });
  };
  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex gap-6">
          <div onClick={() => history.goBack()}>
            <Return />
          </div>
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("receive_new_stock")}
          </h2>
        </div>
        <div className="bg-white mt-4 w-full rounded-md">
          <div className="py-8 px-8 flex-auto">
            <div className="flex title-step px-3 py-3">
              <p className="title">{t("add_stock_details")}</p>
              <p
                style={{ color: countryConfig[userCountry].backgroundColor }}
                className="step"
              >
                {t("step 1of2")}
              </p>
            </div>
            <div className="stock-cont px-14 py-4">
              <form className="w-full md:w-full">
                <div className="flex md:w-full mb-6">
                  <div className="w-full md:w-full px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide label-text text-normal font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      {countryConfig[userCountry].documentNumberText} (*)
                    </label>
                    <input
                      className="appearance-none block w-full py-3 px-4 form-inp mb-3 leading-tight focus:outline-none focus:bg-white"
                      style={{ color: "#000000" }}
                      id="grid-first-name"
                      type="text"
                      placeholder={t("type_here")}
                      value={documentNumber}
                      onChange={(e) => { 
                        setDocumentNumber(e.target.value);
                        setError(false);
                      }}
                      required
                    />
                  </div>
                  <div className="w-full md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide label-text text-normal font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      {countryConfig[userCountry].orderNumberText} (*)
                    </label>
                    <input
                      className="appearance-none block w-full form-inp rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                      style={{ color: "#000000" }}
                      id="grid-last-name"
                      type="text"
                      placeholder={t("type_here")}
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-full md:w-full px-3">
                    <label
                      className="block uppercase tracking-wide label-text text-normal font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      {t("truck_plate_number")} (*)
                    </label>
                    <input
                      className="appearance-none block w-full form-inp rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                      style={{ color: "#000000" }}
                      id="grid-last-name"
                      type="text"
                      placeholder={t("type_here")}
                      value={truckNumber}
                      onChange={(e) => setTruckNumber(e.target.value)}
                      required={country !== "Ghana" ? true : false}
                    />
                  </div>
                </div>
                <div className="w-full md:w-full px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide label-text text-normal font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    {t("remarks")} ({t("optional")})
                  </label>
                  <textarea
                    rows="10"
                    className="appearance-none block w-full py-3 px-4 form-inp mb-3 leading-tight focus:outline-none focus:bg-white"
                    style={{ color: "#000000" }}
                    id="grid-first-name"
                    type="text"
                    placeholder={t("type_here")}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </form>
              <div className="btn-cont mx-4">
                <button
                  // onClick={() => history.push(``)}

                  className="mt-8 px-14 py-3 next"
                  style={{ backgroundColor: "#DEE0E4" }}
                >
                  <Link to={`/dashboard/inventory/${dist_code}`}>
                    <p className="van-text" style={{ color: "#2D2F39" }}>
                      {t("cancel")}
                    </p>
                  </Link>{" "}
                </button>
                <button
                  onClick={() => clickFunction()}
                  className="mt-8 px-14 py-3"
                  style={{
                    backgroundColor: countryConfig[userCountry].buttonColor,
                    color: countryConfig[userCountry].textColor,
                    opacity:
                      documentNumber === "" ||
                        orderNumber === "" ||
                        error ||
                        (country !== "Ghana" && truckNumber === "")
                        ? "50%"
                        : "100%",
                  }}
                  disabled={
                    documentNumber === "" ||
                     orderNumber === "" ||
                      error ||
                      (country !== "Ghana" && truckNumber === "")
                      ? true
                      : false
                  }
                >
                  <p
                    style={{ color: countryConfig[userCountry].textColor }}
                    className="van-text"
                  >
                    {loading ? t("please_wait") : t("next")}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal">
                <CloseModal
                  className="ml-auto m-4 mb-0"
                  onClick={() => setErrorModal(false)}
                />
                <p
                  className="font-customGilroy not-italic text-center text-2xl font-medium"
                  style={{
                    marginLeft: "1.5rem",
                    marginTop: "1.5rem",
                    marginBottom: "3rem",
                    alignSelf: "center",
                  }}
                >
                  {t("this")} {countryConfig[userCountry].documentNumberText} {t("already_exist")}!
                </p>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Dashboard>
  );
};

export default Step2;
