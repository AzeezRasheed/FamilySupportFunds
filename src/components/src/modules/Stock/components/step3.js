import React, { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import arrowBackBox from "../../../assets/svg/arrowBack.svg";
import { Link } from "react-router-dom";
import Dashboard from "../../../Layout/Dashboard";
import { getAllProducts } from "../../Admin/Pricing/actions/AdminPricingAction";
import { getAllInventory, receiveNewStock, setApprovalModal, transferQuantity, updateTransferQuantity } from "../../Inventory/actions/inventoryProductAction";
import { concat, findIndex, pullAt, isEmpty, cloneDeep } from "lodash";
import { Fade } from "react-reveal";
import { ReactComponent as ArrowEdit } from "../../../assets/svg/edit-arrow.svg";
import {filter} from "lodash"
import { useTranslation } from "react-i18next";
import { stripSkuFromBrandName } from "../../../utils/helperFunction";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { CloseModal } from "../../../assets/svg/modalIcons";
import { Dialog, Transition } from "@headlessui/react";
import countryConfig from "../../../utils/changesConfig.json";
import UnsavedReceiveNewStock from "../../../components/common/UnsavedReceiveNewStock";

const Step3 = ({ location }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { Dist_Code } = useParams();
  let targetElem = "";
  let targetDiv = "";
  const fullInputRefs = useRef([]);
  const emptiesInputRefs = useRef([]);
  const editedRefs = useRef([]);
  const [quantitiesToStock, setQuantitiesToStock] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const roles = AuthData?.roles;
  const country = AuthData?.country;
  const [emptiesModal, setEmptiesModal] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }, [country])

  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  if (!dist_code) {
    dist_code = Dist_Code;
  }

  const inventoryDocumentDetails = useSelector(
    (state) => state.InventoryReducer.inventoryDocumentDetails
  );

  const receiveStock = useSelector(
    (state) => state.InventoryReducer.receive_new_stock
  );

  const allProducts = useSelector((state) => state.PricingReducer.allProducts);
  if (!allProducts){
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }

  useEffect(() => {
    if (allProducts?.length > 0) {
      const prevProducts = cloneDeep(allProducts);
      setUpdatedProducts(prevProducts);
    }
  }, [allProducts]);

  useEffect(() => {
    if (quantitiesToStock.length === 0) {
      dispatch(receiveNewStock(false));
    } else {
      dispatch(receiveNewStock(true));
      dispatch(
        transferQuantity({
          stockCounted: quantitiesToStock,
          type: 'new-stock'
        })
      );
    }
  }, [quantitiesToStock])

  
   useEffect(() => {
     if (isEmpty(inventoryDocumentDetails) === true) history.goBack();
   }, []);

  const updateQtyByTyping = (newQty, index, type) => {
    const newArray = [...updatedProducts];
    if (type === "empties") {
      newArray[index].empties = Number(newQty);
      emptiesInputRefs.current[index].value = newQty;
    } else {
      newArray[index].quantity = Number(newQty);
      fullInputRefs.current[index].value = newQty;
    }
    setUpdatedProducts(newArray);
  };

  const handleIncrease = (index, prevQty, productId, type) => {
    if (prevQty && Number(prevQty) >= 0) {
      updateQty(index, Number(prevQty) + 1, productId, type);
    } else if (!prevQty) {
      updateQty(index, 1, productId, type);
    }
  };

  const handleDecrease = (index, prevQty, productId, type) => {
    if (prevQty && Number(prevQty) >= 1) {
      updateQty(index, Number(prevQty) - 1, productId, type);
    }
  };

  const updateQty = (index, qty, productId, type) => {
    updateQtyByTyping(qty, index, type);
    showEdited(index, qty, type);
    saveStock(productId, qty);
  };

  const handleKeyUp = (targetElem) => {
    if (targetElem) targetElem.focus();
  };

  const saveStock = (productID, quantity) => {
    const index = findIndex(quantitiesToStock, { productId: productID });
    pullAt(quantitiesToStock, [index]);
    if (!quantity) {
      setQuantitiesToStock([...quantitiesToStock])
    } else {
      const item = {
        productId: productID,
        quantity: parseInt(quantity)
      };

      setQuantitiesToStock([...quantitiesToStock, item])
    }
  };

  const showEdited = (i, quantity, type) => {
    if (type === 'full') {
      targetDiv = editedRefs.current[i];
      if (quantity > parseInt(0)) {
        return (targetDiv.style.visibility = "visible");
      } else {
        return (targetDiv.style.visibility = "hidden");
      }
    }
  };

  const clearEdit = (i, id) => {
    updateQtyByTyping(0, i, "full");
    const editedRow = document.getElementById("row" + id);
    let editedDiv = editedRefs.current[i];
    editedDiv.style.visibility = "hidden";
    editedRow.classList.remove("bg--gray");

    return saveStock(id);
  };

  const searchProduct = (filterInput, filterUL) => {
    let input, filter, ul, li, a, i;
    input = document.getElementById(filterInput);
    filter = input.value.toUpperCase();
    ul = document.getElementById(filterUL);
    li = ul.getElementsByTagName("tr");
    for (i = 0; i < li.length; i++) {
      if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
        console.log(li[i]);
      } else {
        li[i].style.display = "none";
      }
    }
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex gap-6">
          <img
            onClick={() => history.goBack()}
            className="van-img"
            src={arrowBackBox}
            alt=""
          />
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("receive_new_stock")}
          </h2>
        </div>
        <div className="bg-white mt-4 w-full rounded-md">
          <div className="py-5 flex-auto">
            <div className="flex title-step px-7 py-3">
              {/* <p className="title">Select Warehouse</p> */}
              <p className="text-sm title text-default font-normal">
                {t("select_products_received")}
              </p>
              <p className="step"
                style={{ color: "#000000" }}
              >{t("step 2of2")}</p>
            </div>
            <div className="stock-cont py-4">
              <div className="flex flex-wrap">
                <div className="w-full">
                  <div className="py-2 flex-auto">
                    <div className="tab-content tab-space">
                      <div className="block">
                        <div className="mt-3 px-4 flex">
                          <input
                            className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400"
                            id="searchInput"
                            type="text"
                            name="search"
                            style={{
                              width: "38.063rem",
                              backgroundColor: "#E5E5E5",
                            }}
                            onKeyUp={() =>
                              searchProduct("searchInput", "ProductsTbody")
                            }
                            placeholder={t("search_for_a_product")}
                          />
                          {/* <div className="flex pt-1">
                            <div
                              className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <p className="text-sm text-default font-normal">
                                Select Products(s)
                              </p>{" "}
                              <img
                                className="pl-3 pr-2"
                                src={arrowDown}
                                alt=""
                              />
                            </div>
                            <div
                              className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <p className="text-sm text-default font-normal">
                                All SKUs
                              </p>{" "}
                              <img
                                className="pl-3 pr-2"
                                src={arrowDown}
                                alt=""
                              />
                            </div>
                            <div className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                              <img className="pr-2" src={SortImg} alt="" />
                              <p className="text-sm text-default font-normal">
                                Sort By
                              </p>
                            </div>
                          </div> */}
                        </div>
                        <table className="min-w-full mt-8 divide-y divide-gray-200">
                          <thead className="bg-transparent ">
                            <tr className="">
                              <th
                                scope="col"
                                className="px-12 py-3 text-left text-sm font-semibold text-black tracking-wider"
                              >
                                {t("product")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-semibold text-black  tracking-wider"
                              >
                                {t("SKU")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-xs font-semibold text-black  tracking-wider"
                              >
                                {t("quantity_received")}
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            id="ProductsTbody"
                            className="bg-white px-6 divide-y divide-gray-200"
                          >
                            {allProducts.map((sku, index) => (
                              <tr key={sku.id}
                                id={`row${sku?.id}`}
                                className={`font-medium ${
                                  editedRefs.current[index]?.style.visibility ===
                                    "visible" && "bg--gray"
                                }`}
                              >
                                <td className="px-12 py-4 whitespace-nowrap">
                                  <div className="flex items-center h-14">
                                    <div className="flex-shrink-0 w-10">
                                      <img
                                        className="w-10 rounded-full"
                                        src={sku.imageUrl}
                                        alt=""
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {stripSkuFromBrandName(sku.brand)}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-2 my-7">
                                  {sku?.sku}
                                  <span className="ml-1 uppercase">({sku?.productType})</span>
                                </td>
                                <td className="px-6 py-2 my-7">
                                  <div className="flex">
                                    <div
                                      onClick={(e) => {
                                        handleDecrease(
                                          index,
                                          fullInputRefs.current[index].value ||
                                            sku?.quantity,
                                          sku.id,
                                          "full"
                                        );
                                      }}
                                      className={`h-6 w-6 mr-1 
                                        ${
                                          !fullInputRefs.current[index]?.value ||
                                          (fullInputRefs.current[index]?.value &&
                                            Number(fullInputRefs.current[index]?.value) ===
                                              0)
                                            ? "counter pointer-events-none"
                                            : "rounded-lg bg-black cursor-pointer"
                                        }`}
                                    >
                                      <p className="text-white">
                                        <RemoveIcon />
                                      </p>
                                    </div>
                                    <div className="relative">
                                      <input
                                        key={index}
                                        id={"input-qty" + sku.id}
                                        placeholder="0"
                                        defaultValue={sku?.quantity}
                                        onChange={(e) => {
                                          updateQty(
                                            index,
                                            e.target.value,
                                            sku.id,
                                            "full"
                                          );
                                        }}
                                        onKeyUp={(e) => {
                                          switch (e.key) {
                                            case "ArrowDown":
                                              targetElem =
                                                fullInputRefs.current[
                                                  index === updatedProducts.length - 1
                                                    ? 0
                                                    : index + 1
                                                ];

                                              break;
                                            case "ArrowUp":
                                              targetElem =
                                                fullInputRefs.current[
                                                  index === updatedProducts.length + 1
                                                    ? 0
                                                    : index - 1
                                                ];

                                              break;
                                            default:
                                              return "";
                                          }
                                          handleKeyUp(targetElem);
                                        }}
                                        ref={(el) => (fullInputRefs.current[index] = el)}
                                        className={`w-16 h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5
                                          ${
                                            updatedProducts[index]?.quantity
                                              ? "bg--gray-1"
                                              : "bg--gray-2"
                                          }`}
                                      />
                                    </div>
                                    <div
                                      onClick={(e) => {
                                        handleIncrease(
                                          index,
                                          fullInputRefs.current[index].value ||
                                            sku?.quantity,
                                          sku.id,
                                          "full"
                                        );
                                      }}
                                      className="h-6 w-6 ml-1 rounded-lg bg-black"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <p className="text-white">
                                        <AddIcon />
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <Fade>
                                    <div
                                      className="flex items-center px-4 invisible"
                                      key={sku.id}
                                      id={index}
                                      style={{ justifyContent: "flex-end" }}
                                      ref={(el) =>
                                        (editedRefs.current[index] = el)
                                      }
                                    >
                                      <div
                                        className="rounded-full px-5 py-2"
                                        style={{
                                          backgroundColor: "#74767E",
                                          color: "#FFFFFF",
                                          fontSize: 14,
                                          marginRight: 10,
                                        }}
                                      >
                                        {t("edited")}
                                      </div>
                                      <ArrowEdit
                                        style={{ cursor: "pointer" }}
                                        onClick={() => clearEdit(index, sku.id)}
                                      />
                                    </div>
                                  </Fade>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mx-4">
                <button
                  onClick={() => history.goBack()}
                  className="mt-8 px-14 py-3 previous text-black"
                >
                  <p>{t("previous")}</p>
                </button>
                <button
                  onClick={() => setEmptiesModal(true)}
                  className="mt-8 px-14 py-3 next"
                >
                  <p>{t("continue")}</p>
                </button>
              </div>
            </div>

            <Transition.Root show={emptiesModal} as={Fragment}>
              <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={() => setEmptiesModal(false)}
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
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-modal sm:w-5/12">
                      <CloseModal
                        className="ml-auto m-4 mb-0"
                        onClick={() => setEmptiesModal(false)}
                      />
                      <div className="py-6 px-8">
                        <p className="font-customGilroy font-medium text-center">{t("would_you_like_to_return_empties")}</p>
                      </div>

                      <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center gap-4 mb-10">
                        <button
                          className="rounded font-customGilroy text-white text-center text-sm font-bold not-italic py-2 w-48"
                          onClick={() => {
                            history.push(`/dashboard/return-empties/${dist_code}`)
                          }}
                          style={{
                            backgroundColor: countryConfig[country].buttonColor,
                            color: countryConfig[country].textColor,
                          }}
                        >
                          {t("yes, return empties")}
                        </button>

                        <button
                          className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic py-2 w-48"
                          onClick={() => {
                            setEmptiesModal(false);
                            dispatch(setApprovalModal(true));
                            dispatch(receiveNewStock(true));
                            dispatch(updateTransferQuantity(true));
                          }}
                        >
                          {t("no")}
                        </button>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>
          </div>
        </div>
      </div>
      {
        receiveStock &&
        <UnsavedReceiveNewStock 
          actionText={t("click_continue_to_save_selection")}
          backText={t("previous")}
          forwardText={t("continue")}
          onClickForward={() => {
            setEmptiesModal(true)
          }}
        />
      }
    </Dashboard>
  );
};


export default Step3;
