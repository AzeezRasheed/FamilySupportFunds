import React, { Fragment, useEffect, useRef, useState } from "react";
import arrowDown from "../../../../../assets/svg/arrowDown.svg";
import { Fade } from "react-reveal";
import noOrder from "../../../../../assets/svg/noOrders.svg";
import Loading from "../../../../../components/common/Loading";
import { Dialog, Transition } from "@headlessui/react";
import SortImg from "../../../../../assets/svg/sort.svg";
import ArrowEdit from "../../../../../assets/svg/edit-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import Approval from "../../../../../assets/svg/approval.svg";
import countryConfig from '../../../../../utils/changesConfig.json'
import { getLocation } from '../../../../../utils/getUserLocation.js'
import {
  CloseModal,
  UploadFile,
  Checked,
} from "../../../../../assets/svg/modalIcons";

import { getAllInventory } from "../../../../Inventory/actions/inventoryProductAction";
import {
  getAllSingleVanInventory,
  loadVanData,
  transferQuantity,
  updateTransferQuantity,
} from "../../../actions/vanAction";
import { pullAt, findIndex, filter } from "lodash";
import { useTranslation } from "react-i18next";
const Tabs = ({ code, top, driver }) => {
  const { t } = useTranslation();

  let targetElem = "";
  const inputRefs = useRef([]);
  const [counter, setCounter] = useState({});
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [quantitiesToTransfer, setQuantitiesToTransfer] = useState([]);
  const [added, checkAdded] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const cancelButtonRef = useRef(null);
  const AuthData = useSelector(state => state.Auth.sessionUserData);

  const driverId = parseInt(+driver.split("-")[0], 10);
  const dispatch = useDispatch();
  const { all_single_van_inventory: driverInventory } = useSelector(
    (state) => state.VanInventoryReducer
  );
  const loading = useSelector(
    (state) => state.InventoryReducer.loadingInventory
  );

  const [userCountry, setUserCountry] = useState('Ghana');


  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry])

  const miniAdmin = AuthData.roles === "Mini-Admin"

  useEffect(() => {
    if (code) {
      dispatch(getAllInventory(code));
      dispatch(getAllSingleVanInventory(driverId));
    }
  }, [driverId, code]);

  const handleKeyUp = (targetElem) => {
    if (targetElem) targetElem.focus();
  };

  const getQuantityAvailable = (productId) => {
    const results = driverInventory?.find((driverDetails) => {
      return driverDetails?.productId === productId;
    })?.quantity;
    return results ? results : 0;
  };

  const inventoryData = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );

  const handleReset = () => {
    setConfirmModal(false);
    setApprovalModal(false);
  };

  const sortOrder = inventoryData.filter((data) => {
    return data?.product?.brand
      .toLowerCase()
      .startsWith(`${search.toLowerCase()}`);
  });

  const close = () => {
    setApprovalModal(false);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const getOriginQuantity = (productId) => {
    const product = filter(inventoryData, { productId: productId })[0];
    const value = product ? product?.quantity : 0;
    return value;
  };

  const handleSubmit = async (event) => {
    const values = {
      companyCode: code,
      vehicleId: parseInt(driverId, 10),
      stocks: selectItems,
    };
    event.preventDefault();
    setLoader(true);
    setApprovalModal(false);
    await dispatch(loadVanData(values)).then(() => {
      dispatch(getAllInventory(code));
      dispatch(getAllSingleVanInventory(driverId));
      setLoader(false);
      setConfirmModal(false);
      setTimeout(() => {
        setApprovalModal(true);
      }, 2000);
    });
    // .catch (() => {

    // })
  };

  const incrementCounter = (productId, stock) => {
    const quantity = parseInt(counter[productId] ?? 0) + 1;
    if (quantity <= stock) {
      setCounter({ ...counter, [productId]: quantity });
    }
  };

  const decrementCounter = (productId, qty) => {
    if (counter[productId] && counter[productId] > 0) {
      setCounter({ ...counter, [productId]: parseInt(counter[productId]) - 1 });
    }
  };

  const handleChange = (e, productId, stock) => {
    const quantity = Math.min(Number(e.target.value), Number(stock));
    setCounter({
      ...counter,
      [e.target.name]: parseInt(quantity),
    });
  };

  const AddedItems = (productID, quantity, originQuantity) => {
    if (parseInt(quantity) === 0 || quantity > originQuantity) {
      quantitiesToTransfer.length > 0
        ? dispatch(updateTransferQuantity(true))
        : dispatch(updateTransferQuantity(false));
      return;
    }
    const index = findIndex(quantitiesToTransfer, { productId: productID });
    if (!quantity) {
      pullAt(quantitiesToTransfer, [index]);
      dispatch(transferQuantity(quantitiesToTransfer, code, driverId));
    } else {
      const item = {
        productId: productID,
        quantity: quantity,
      };

      if (index < 0) {
        quantitiesToTransfer.push(item);
      } else {
        quantitiesToTransfer[index] = item;
      }
      dispatch(transferQuantity(quantitiesToTransfer, code, driverId));
    }
    quantitiesToTransfer.length > 0
      ? dispatch(updateTransferQuantity(true))
      : dispatch(updateTransferQuantity(false));
  };

  const removeItem = (productId) => {
    setCounter({ ...counter, [productId]: 0 });
    checkAdded(false);
  };

  return (
    <>
      <div
        className={`relative flex flex-col min-w-0 break-words bg-white w-full mb-6 ${top} shadow-lg rounded`}
      >
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className="block">
                  <div className="flex justify-between align-items-center divide-y divide-gray-200 pl-8 pb-3">
                    <p
                      className="mx-3 my-auto"
                      style={{
                        color: "#2D2F39",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {t("select_product(s)_to_transfer")}
                    </p>
                  </div>
                  <hr />
                  <div className="mt-3 px-4 flex">
                    <input
                      className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400"
                      id="search"
                      type="text"
                      name="search"
                      style={{ width: "28.063rem", backgroundColor: "#E5E5E5" }}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t("search_for_products")}
                    />
                  </div>
                  <table className="min-w-full mt-8 divide-y divide-gray-200">
                    <thead className="bg-transparent ">
                      <tr className="">
                        <th
                          scope="col"
                          className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                        >
                          {t("product")}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
                          <p>
                            {t("quantity_available")}
                            <br />
                            {t("originating_warehouse")}
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
                          <p>
                            {t("quantity_available")}
                            <br />
                            {t("mobile_warehouse")}
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
                          {t("quantity_to_transfer")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white px-6 divide-y divide-gray-200">
                      {(driverInventory.length === 0 &&
                        inventoryData.length === 0) ||
                        (sortOrder.length === 0 && !code) ? (
                        <tr className="my-8 justify-center">
                          <td colSpan={9}>
                            <img className="m-auto" src={noOrder} />
                          </td>
                        </tr>
                      ) : loading ? (
                        <tr>
                          <td colSpan={9}>
                            <center style={{ marginTop: 20, marginBottom: 20 }}>
                              <Loading />
                              <Loading />
                              <Loading />
                            </center>
                          </td>
                        </tr>
                      ) : (
                        (search === "" ? inventoryData : sortOrder).map(
                          ({ product, quantity, productId }, index) => (
                            <>
                              <tr key={product?.id}>
                                <td className="px-12 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-20 w-10">
                                      <img
                                        className="h-20 w-10 rounded-full"
                                        src={product?.imageUrl}
                                        alt=""
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {product?.brand} {product?.sku}
                                      </div>
                                      <div className="text-sm my-1 text-gray-500">
                                        {product?.productType}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-2">
                                  <div
                                    className="border-defaut qa font-normal text-sm rounded-md text-center border-1 w-20 h-9"
                                    style={{ backgroundColor: countryConfig[userCountry].vanBoxLeft }}
                                  >
                                    <p style={{ color: countryConfig[userCountry].textColor }} className="qa-text pt-2">{quantity}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-6">
                                  <div
                                    className="border-defaut qa bg-blue font-normal text-sm rounded-md text-center border-1 w-20 h-9"
                                    style={{ backgroundColor: countryConfig[userCountry].vanBoxRight }}
                                  >
                                    <p style={{ color: "#fff" }} className="qa-text pt-2">
                                      {getQuantityAvailable(productId)}
                                    </p>
                                  </div>
                                </td>
                                <td
                                  scope="col"
                                  className="px-12 py-3 text-left text-sm"
                                >
                                  <div className="flex">
                                    {driver.length > 0 ? (
                                      <input
                                        key={index}
                                        placeholder="0"
                                        readOnly={miniAdmin}
                                        type="number"
                                        id={"input" + index}
                                        name={productId}
                                        onChange={(e) => {
                                          const quantity = e.target.value
                                            ? e.target.value
                                            : 0;

                                          AddedItems(
                                            productId,
                                            quantity,
                                            getOriginQuantity(productId)
                                          );
                                        }}
                                        onKeyUp={(e) => {
                                          switch (e.key) {
                                            case "ArrowDown":
                                              targetElem =
                                                inputRefs.current[
                                                index ===
                                                  inventoryData.length - 1
                                                  ? 0
                                                  : index + 1
                                                ];
                                              break;
                                            case "ArrowUp":
                                              targetElem =
                                                inputRefs.current[
                                                index ===
                                                  inventoryData.length + 1
                                                  ? 0
                                                  : index - 1
                                                ];
                                              break;
                                            default:
                                              return "";
                                          }
                                          handleKeyUp(targetElem);
                                        }}
                                        ref={(el) =>
                                          (inputRefs.current[index] = el)
                                        }
                                        className="border-defaut bg-red font-normal text-sm rounded-md text-center border-2 w-20 h-8 pl-2"
                                      />
                                    ) : (
                                      "0"
                                    )}
                                  </div>
                                </td>
                              </tr>
                            </>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                    onClick={handleReset}
                  />
                  <div className="h-mini-modal py-4 px-8 justify-center items-center">
                    <img alt="" src={Approval} className="m-auto py-4" />
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: "normal",
                        color: "black",
                      }}
                      className="mb-6 text-center"
                    >
                      {t("Van Has been Successfull Replenished")}
                    </p>
                  </div>
                  <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                    <button
                      className="bg-red-main rounded font-customGilroy text-white outline-none text-center text-sm font-bold not-italic px-7 py-2"
                      onClick={close}
                    >
                      Okay
                    </button>
                    <div />
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <Transition.Root show={confirmModal} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            initialFocus={cancelButtonRef}
            onClose={() => setConfirmModal(false)}
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
                  <div className="h-mini-modal py-14 px-8 justify-center items-center">
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: "normal",
                        color: "black",
                      }}
                      className="mb-6 text-center"
                    >
                      {t("Are you sure you want to replenish this Van")}
                    </p>
                  </div>

                  <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                    {selectItems.length > 0 ? (
                      <button
                        className="bg-red-main rounded font-customGilroy text-white outline-none text-center text-sm font-bold not-italic px-7 py-2"
                        onClick={handleSubmit}
                      >
                        {loader ? "Replenishing" : "Yes EHEN Van"}
                      </button>
                    ) : (
                      <button
                        className="bg-gray-400 rounded font-customGilroy text-white outline-none text-center text-sm font-bold not-italic px-7 py-2"
                        style={{ cursor: "pointer" }}
                      >
                        {t("assign_order")}
                      </button>
                    )}
                    <button
                      className="bg-white border-2 border-gray-400 rounded font-customGilroy text-gray-500 text-center text-sm font-bold not-italic px-14 py-2"
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
      </div>
    </>
  );
};

export default Tabs;
