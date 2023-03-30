import React, { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import Dashboard from "../../../Layout/Dashboard";
import { getAllProducts } from "../../Admin/Pricing/actions/AdminPricingAction";
import {
  addInitialEmpties,
  getAllInventory,
  getTotalEmpties,
  transferQuantity,
  updateTransferQuantity,
} from "../actions/inventoryProductAction";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import { findIndex, pullAt } from "lodash";
import { Fade } from "react-reveal";
import { ReactComponent as ArrowEdit } from "../../../assets/svg/edit-arrow.svg";
import { CloseModal } from "../../../assets/svg/modalIcons";
import Loading from "../../../components/common/Loading";
import { inventoryNet } from "../../../utils/urls";
import { useTranslation } from "react-i18next";
import Tag from "../components/Tag";
import { formatEmptiesQuantity, stripProductTypeFromSku } from "../../../utils/helperFunction";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";

const InventorySetup = ({ location }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const history = useHistory();
  const { Dist_Code } = useParams();
  let targetElem = "";
  let targetDiv = "";
  const cancelButtonRef = useRef(null);
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const roles = AuthData.roles;
  const inputRefs = useRef([]);
  const editedRefs = useRef([]);
  const [quantitiesToStock, setQuantitiesToStock] = useState([]);
  const [open, setOpen] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empties, setEmpties] = useState(false);
  const [emptiesNo, setEmptiesNo] = useState(0);
  const [saveButton, setSaveButton] = useState(t("yes_please"));
  const country = AuthData?.country;
  const fullInputRefs = useRef([]);
  const emptiesInputRefs = useRef([]);
  const [userCountry, setUserCountry] = useState("Ghana");
  const [newStock, setNewStock] = useState([])
  const allProducts = useSelector((state) => state.PricingReducer.allProducts);

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);

  useEffect(() => {
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }, [country]);

  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  if (!dist_code) {
    dist_code = Dist_Code;
  }

  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );

  useEffect(() => {
    if (!allInventory.length) {
      dispatch(getAllInventory(dist_code));
    }
  }, [allInventory.length]);

  useEffect(() => {
    if (allInventory.length && allInventory.length > 0)
      history.push("/dashboard/inventory/" + dist_code);
  });

  useEffect(() => {
    const newStock = allProducts.map((product) => {
      return {
        productId: product.id,
        quantity: 0,
        empties: 0
      }
    })
    setNewStock(newStock);
  }, [allProducts])

  useEffect(() => {
    if (quantitiesToStock.length === 0) {
      dispatch(updateTransferQuantity(false));
    } else {
      dispatch(updateTransferQuantity(true));
      dispatch(
        transferQuantity({
          stockCounted: quantitiesToStock,
          type: 'setup'
        })
      );
    }
  }, [quantitiesToStock])

  const updateQty = (index, qty, productId, type) => {
    updateQtyByTyping(qty, index, type);
    showEdited(index, qty, type);
    save(productId, qty, index);
  };

  const updateQtyByTyping = (newQty, index, type) => {
    const newArray = [...newStock];
    if (type === "empties") {
      newStock[index].empties = Number(newQty);
      emptiesInputRefs.current[index].value = newQty;
    } else {
      newStock[index].quantity = Number(newQty);
      fullInputRefs.current[index].value = newQty;
    }
    setNewStock(newArray);
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

  const closeModal = () => {
    setWarningModal(false);
    setOpen(false);
  };


  const handleKeyUp = (targetElem) => {
    if (targetElem) targetElem.focus();
  };

  const save = (productID, quantity, i) => {
    const index = findIndex(quantitiesToStock, { productId: productID });
    pullAt(quantitiesToStock, [index]);

    if (!quantity) {
      setQuantitiesToStock([...quantitiesToStock])
    } else {
      let item = newStock[i];
      if (item.empties === 0) {
        item = {
          productId: item.productId,
          quantity: item.quantity
        }
      }
      setQuantitiesToStock([...quantitiesToStock, item]);
    }
  };

  const updateDB = () => {
    setLoading(true);
    setSaveButton(t("updating"));
    let toDB = {};
    toDB = {
      companyCode: dist_code,
      quantityToReturn: parseInt(emptiesNo),
    };

    //addInitialEmpties(toDB)
    const inventory = inventoryNet();
    inventory.post("empties/take-in", toDB).then((response) => {
      setApprovalModal(false);
      setEmpties(true);
      setLoading(false);
      setSaveButton(t("yes_please"));
      dispatch(addInitialEmpties(emptiesNo));
      dispatch(getTotalEmpties(dist_code));
    });
  };

  const handleReset = () => {
    setApprovalModal(false);
    setOpen(true);
  };

  const showEdited = (i, quantity, type) => {
    let targetDiv = editedRefs.current[i];

    if (quantity > parseInt(0)) {
      return (targetDiv.style.visibility = "visible");
    } else {
      if (type === "full") {
        const empties = Number(newStock[i]?.empties);
        if (empties > 0) {
          return (targetDiv.style.visibility = "visible");
        } else {
          return (targetDiv.style.visibility = "hidden");
        }
      } else {
        const full = Number(newStock[i]?.quantity);
        if (full > 0) {
          return (targetDiv.style.visibility = "visible");
        } else {
          return (targetDiv.style.visibility = "hidden");
        }
      }
    }
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
      } else {
        li[i].style.display = "none";
      }
    }
  };

  const clearEdit = (i, productId) => {
    updateQtyByTyping(0, i, "full");
    if (document.getElementById("input-empties" + productId)) {
      updateQtyByTyping(0, i, "empties");
    }
    const editedRow = document.getElementById("row" + productId);
    let editedDiv = editedRefs.current[i];
    editedDiv.style.visibility = "hidden";
    editedRow.classList.remove("bg--gray");

    return save(productId, 0, i);
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between">
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("new_inventory_setup")}
          </h2>
        </div>
        <div className="bg-white mt-4 w-full rounded-md">
          <div className="py-5 flex-auto">
            <div className="stock-cont py-4">
              <div className="flex flex-wrap">
                <div className="w-full">
                  <div className="pb-2 flex-auto">
                    <div className="tab-content tab-space">
                      <div className="block">
                        <div className="px-4 flex">
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
                                className="pl-12 pr-6 py-3 text-sm font-semibold text-black tracking-wider"
                              >
                                {t("product")}
                              </th>
                              <th
                                scope="col"
                                className="py-3 px-6 text-sm font-semibold text-black tracking-wider w-52"
                              >
                                SKU
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-sm font-semibold text-black tracking-wider w-64"
                              >
                                {t("quantity")}
                                <Tag className="bg--blue mt-2" tagName={t("fulls")} />
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-sm font-semibold text-black tracking-wider w-64"
                              >
                                {t("quantity")}
                                <Tag className="bg--accent mt-2" tagName={t("empties")} />
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            id="ProductsTbody"
                            className="bg-white px-6 divide-y divide-gray-200"
                          >
                            {allProducts.map((product, index) => (
                              <tr key={product.id}
                                id={`row${product?.id}`}
                                className={`font-medium ${
                                  editedRefs.current[index]?.style.visibility ===
                                    "visible" && "bg--gray border--dark_bottom"
                                }`}
                              >
                                <td className="pl-12 pr-6 py-3 whitespace-nowrap">
                                  <div className="flex items-center h-16">
                                    <div className="flex-shrink-0 w-10">
                                      <img
                                        className="w-10 rounded-full"
                                        src={product.imageUrl}
                                        alt={product.brand}
                                      />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 ml-4">
                                      {product.brand}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2 px-6">
                                  {stripProductTypeFromSku(product?.sku)} 
                                  <span className="uppercase ml-1">
                                    ({product?.productType})
                                  </span>
                                </td>
                                <td className="py-2 px-6 my-7">
                                  <div className="flex">
                                    <div
                                      onClick={(e) => {
                                        handleDecrease(
                                          index,
                                          fullInputRefs.current[index].value ||
                                            0,
                                            product.id,
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
                                        id={"input-qty" + product.id}
                                        placeholder="0"
                                        defaultValue={0}
                                        onChange={(e) => {
                                          updateQty(
                                            index,
                                            e.target.value,
                                            product.id,
                                            "full"
                                          );
                                        }}
                                        onKeyUp={(e) => {
                                          switch (e.key) {
                                            case "ArrowDown":
                                              targetElem =
                                                fullInputRefs.current[
                                                  index === allProducts.length - 1
                                                    ? 0
                                                    : index + 1
                                                ];

                                              break;
                                            case "ArrowUp":
                                              targetElem =
                                                fullInputRefs.current[
                                                  index === allProducts.length + 1
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
                                            newStock[index]?.quantity
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
                                          0,
                                          product.id,
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
                                <td className="py-2 px-6 my-7">
                                  {formatEmptiesQuantity(
                                    product?.productType,
                                    0
                                  ) === "Nil" ? (
                                    <p className="text--accent">Nil</p>
                                  ) : (
                                    <div className="flex">
                                      <div
                                        onClick={(e) => {
                                          handleDecrease(
                                            index,
                                            emptiesInputRefs.current[index].value,
                                            product.id,
                                            "empties"
                                          );
                                        }}
                                        className={`h-6 w-6 mr-1 
                                          ${
                                            !emptiesInputRefs.current[index]?.value ||
                                            (emptiesInputRefs.current[index]?.value &&
                                              Number(
                                                emptiesInputRefs.current[index]?.value
                                              ) === 0)
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
                                          id={"input-empties" + product.id}
                                          placeholder="0"
                                          defaultValue={0}
                                          onChange={(e) => {
                                            updateQty(
                                              index,
                                              e.target.value,
                                              product.id,
                                              "empties"
                                            );
                                          }}
                                          onKeyUp={(e) => {
                                            switch (e.key) {
                                              case "ArrowDown":
                                                targetElem =
                                                  emptiesInputRefs.current[
                                                    index === allProducts.length - 1
                                                      ? 0
                                                      : index + 1
                                                  ];

                                                break;
                                              case "ArrowUp":
                                                targetElem =
                                                  emptiesInputRefs.current[
                                                    index === allProducts.length + 1
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
                                            (emptiesInputRefs.current[index] = el)
                                          }
                                          className={`w-16 h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5
                                            ${
                                              allProducts[index]?.empties
                                                ? "bg--gray-1"
                                                : "bg--gray-2"
                                            }`}
                                        />
                                      </div>
                                      <div
                                        onClick={(e) => {
                                          handleIncrease(
                                            index,
                                            emptiesInputRefs.current[index].value,
                                            product.id,
                                            "empties"
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
                                  )}
                                </td>
                                <td className="w-24 pb-0 pt-2 align-top">
                                  <Fade>
                                    <div
                                      className="flex items-start px-4 invisible"
                                      key={product.id}
                                      id={index}
                                      ref={(el) =>
                                        (editedRefs.current[index] = el)
                                      }
                                    >
                                      <div
                                        className="rounded-full px-2 py-1"
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
                                        onClick={() => {
                                          clearEdit(index, product.id);
                                        }}
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
              {/* <div className=" mx-4">
                <button
                  // onClick={() => history.push(``)}
                  className="mt-8 px-14 py-3 next"
                  style={{ float: "right" }}
                >
                  <Link to="/dashboard/add-product">
                    <p className="van-text">Save</p>
                  </Link>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
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
                  onClick={() => setOpen(false)}
                />
                <div className="flex justify-between items-center px-6">
                  <p
                    className="font-customGilroy not-italic font-normal grey-100"
                    style={{ fontSize: "32px" }}
                  >
                    {t("empties_setup")}
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
                  }}
                />
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
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
                      {t("save")}
                    </div>
                  ) : (
                    <div
                      className="rounded p-3"
                      style={{
                        backgroundColor:
                          countryConfig[userCountry].unsavedButtonColor,
                        color:
                          countryConfig[userCountry].unsavedButtonTextColor,
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
                  )}
                  <button
                    className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                    onClick={() => setOpen(false)}
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
                    {t("Are you sure you want to add these empties?")}
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
                    {saveButton}
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
    </Dashboard>
  );
};

export default InventorySetup;
