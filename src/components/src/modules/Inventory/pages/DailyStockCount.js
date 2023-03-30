import React, { useEffect, useRef, useState } from "react";
import Dashboard from "../../../Layout/Dashboard";
import { cloneDeep } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Return } from "../../../assets/svg/adminIcons";
import {
  getAllInventory,
  transferQuantityDailyStock,
  updateDailysTOCKTransferQuantity,
} from "../actions/inventoryProductAction";

import { getAllProducts } from "../../Admin/Pricing/actions/AdminPricingAction";
import LoadingList from "../../../components/common/LoadingList";
import { default as ReactSelect } from "react-select";
import { OptionComp } from "../../../components/common/ReactSelect";
import { ReactComponent as ArrowEdit } from "../../../assets/svg/edit-arrow.svg";
import { Fade } from "react-reveal";
import { findIndex, pullAt } from "lodash";
import { t } from "i18next";
import {
  formatEmptiesQuantity,
  stripSkuFromBrandName,
  stripProductTypeFromSku,
} from "../../../utils/helperFunction";
import Tag from "../components/Tag";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import SearchFiltersDailyStock from "../../../components/common/SearchFiltersDailyStock";
import { getProductList, getSkuList } from "../../../utils/filters";

const DailyStockCount = ({ location }) => {
  const country = useSelector((state) => state.Auth.sessionUserData).country;
  const dispatch = useDispatch();
  const history = useHistory();
  const { Dist_Code } = useParams();
  const [productData, setPoductData] = useState("All Products");
  const [otherProducts, setOtherProducts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const fullInputRefs = useRef([]);
  const emptiesInputRefs = useRef([]);
  const editedRefs = useRef([]);
  const selectRefs = useRef([]);
  const reasonRefs = useRef([]);
  let targetElem = "";
  const [dailyStockReason, setDailyStockReason] = useState({});
  const [productId, setProductId] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [stockUpdated, setStockUpdated] = useState([]);

  const reasonOption = [
    { value: "breakages", label: "Breakage" },
    { value: "miscount", label: "Miscount" },
    { value: "theft", label: "Theft" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    dispatch(getAllInventory(Dist_Code));
  }, []);
  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );

  const productList = getProductList(allInventory);
  const skuList = getSkuList(allInventory);
  const [tempInventory, setTempInventory] = useState(allInventory);

  useEffect(() => {
    if (allInventory?.length > 0 && loadingState) {
      setLoadingState(false);
      setTempInventory(allInventory);
      dispatch(updateDailysTOCKTransferQuantity(false));
      const prevProducts = cloneDeep(allInventory);
      setUpdatedProducts(prevProducts);
    }
  }, [allInventory]);

  useEffect(() => {
    if (productId !== 0) {
      saveStock(productId, currentIndex);
    }
  }, [dailyStockReason]);

  useEffect(() => {
    if (stockUpdated.length === 0) {
      dispatch(updateDailysTOCKTransferQuantity(false));
    } else {
      dispatch(updateDailysTOCKTransferQuantity(true));
      dispatch(
        transferQuantityDailyStock({
          stockCounted: stockUpdated,
        })
      );
    }
  }, [stockUpdated]);

  const handleChangeDailyStock = (selected, productId, index) => {
    setDailyStockReason({
      ...dailyStockReason,
      [index]: { reason: selected.value, productId: productId },
    });
    setCurrentIndex(index);
    setProductId(productId);
  };

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
    let prevQty;
    if (type === "full") {
      prevQty = allInventory[index].quantity;
    } else {
      prevQty = allInventory[index].empties;
    }
    showSelectReason(index, qty, prevQty, type);
    saveStock(productId, index, qty);
  };

  const handleKeyUp = (targetElem) => {
    if (targetElem) targetElem.focus();
  };

  const showSelectReason = (i, newQuantity, quantity, type) => {
    let targetDiv = selectRefs.current[i];
    let editedDiv = editedRefs.current[i];
    if (!quantity && newQuantity && parseInt(newQuantity) != quantity) {
      editedDiv.style.visibility = "visible";
      return (targetDiv.style.visibility = "visible");
    }
    if (
      newQuantity &&
      (newQuantity > parseInt(quantity, 10) ||
        newQuantity < parseInt(quantity, 10))
    ) {
      editedDiv.style.visibility = "visible";
      return (targetDiv.style.visibility = "visible");
    } else {
      if (type === "full") {
        const newEmpties = Number(updatedProducts[i]?.empties);
        const empties = Number(allInventory[i]?.empties);

        if (empties !== newEmpties) {
          editedDiv.style.visibility = "visible";
          return (targetDiv.style.visibility = "visible");
        } else {
          pullAt(stockUpdated, [i]);
          reasonRefs.current[i].state.value = "";
          editedDiv.style.visibility = "hidden";
          return (targetDiv.style.visibility = "hidden");
        }
      } else {
        const newQty = Number(updatedProducts[i]?.quantity);
        const qty = Number(allInventory[i]?.quantity);

        if (qty !== newQty) {
          editedDiv.style.visibility = "visible";
          return (targetDiv.style.visibility = "visible");
        } else {
          pullAt(stockUpdated, [i]);
          reasonRefs.current[i].state.value = "";
          editedDiv.style.visibility = "hidden";
          return (targetDiv.style.visibility = "hidden");
        }
      }
    }
  };

  const clearEdit = (i, productId, id) => {
    updateQtyByTyping(allInventory[i].quantity, i, "full");
    if (document.getElementById("input-empties" + id)) {
      updateQtyByTyping(allInventory[i].empties, i, "empties");
    }
    const editedRow = document.getElementById("row" + id);
    let targetDiv = selectRefs.current[i];
    let editedDiv = editedRefs.current[i];
    editedDiv.style.visibility = "hidden";
    targetDiv.style.visibility = "hidden";
    editedRow.classList.remove("bg--gray");

    return saveStock(productId, i);
  };

  const saveStock = (productId, index, qty) => {
    const reason = dailyStockReason[index];
    let emptiesQuantity = updatedProducts[index]?.empties;
    let fullQuantity = updatedProducts[index]?.quantity;
    let prevEmptiesQuantity = allInventory[index]?.empties;
    let prevFullQuantity = allInventory[index]?.quantity;

    if ((!qty, reason)) {
      const i = findIndex(stockUpdated, { productId: productId });
      pullAt(stockUpdated, [i]);

      if (
        Number(fullQuantity) === Number(prevFullQuantity) &&
        Number(emptiesQuantity) === Number(prevEmptiesQuantity)
      ) {
        setStockUpdated([...stockUpdated]);
      } else {
        let item = {
          productId: productId,
          empties: !emptiesQuantity ? 0 : emptiesQuantity,
          quantity: fullQuantity,
          reason: [reason ? reason.reason : "miscount"],
        };
        setStockUpdated([...stockUpdated, item]);
      }
    }
  };


  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex">
          <div className="pr-7" onClick={() => history.goBack()}>
            <Return />
          </div>
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("daily_stock_count")}
          </h2>
        </div>
        <div className="py-2 px-10 bg-white w-full rounded-md mt-8">
          <div className="mt-3 filters flex w-full ">
            <SearchFiltersDailyStock
              tempInventory={tempInventory}
              allInventory={allInventory}
              setTempInventory={setTempInventory}
              skusList={skuList}
              productList={productList}
            />
            {/* <button
              className="text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2 cursor-pointer set-tab"
              style={{
                whiteSpace: "nowrap",
                background: `${
                  productData === "All Products"
                    ? countryConfig[country].buttonColor
                    : "white"
                }`,
              }}
              // product-cont-active
              onClick={() => {
                setPoductData("All Products");
              }}
            >
              <p
                style={{
                  whiteSpace: "nowrap",
                  color:
                    productData === "All Products" &&
                    countryConfig[country].textColor,
                }}
                className="text-default font-normal"
              >
                All Products
              </p>
            </button>
            <button
              className="text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2 cursor-pointer set-tab"
              style={{
                whiteSpace: "nowrap",
                background: `${
                  productData === "Non-ABI"
                    ? countryConfig[country].buttonColor
                    : "white"
                }`,
              }}
              // product-cont-active
              onClick={() => {
                setPoductData("Non-ABI");
              }}
            >
              <p
                style={{
                  whiteSpace: "nowrap",
                  color:
                    productData === "Non-ABI" &&
                    countryConfig[country].textColor,
                }}
                className="text-default font-normal"
              >
                Non-ABI Products
              </p>
            </button>  */}
          </div>
          {!loadingState ? (
            <table className="w-full mt-6 divide-y divide-gray-200 font-customGilroy overflow-x-scroll">
              <thead className="bg-transparent w-full ">
                <tr className="font-semibold">
                  <th
                    scope="col"
                    className="pl-8 py-3.5 text-left text-sm text-black tracking-wider"
                  >
                    {t("Product")}
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 text-sm text-black tracking-wider"
                  >
                    {t("inventory_quantity")}
                    <Tag className="bg--blue mt-2" tagName={t("fulls")} />
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 text-sm text-black tracking-wider"
                  >
                    {t("inventory_quantity")}
                    <Tag className="bg--accent mt-2" tagName={t("empties")} />
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 text-left text-sm text-black tracking-wider"
                  >
                    {t("quantity today")}
                    <Tag className="bg--blue mt-2" tagName={t("fulls")} />
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 text-left text-sm text-black tracking-wider"
                  >
                    {t("quantity today")}
                    <Tag className="bg--accent mt-2" tagName={t("empties")} />
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 text-left text-sm text-black tracking-wider w-24"
                  >
                    {/* Reason */}
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 text-left text-sm text-black tracking-wider"
                  ></th>
                </tr>
              </thead>
              <tbody
                id="products"
                className="bg-white px-6 divide-y divide-gray-200"
              >
                {(productData === "All Products"
                  ? tempInventory
                  : otherProducts
                ).map((sku, index) => (
                  <tr
                    key={sku?.id}
                    id={`row${sku?.id}`}
                    className={`font-medium ${
                      selectRefs.current[index]?.style.visibility ===
                        "visible" && "bg--gray"
                    }`}
                  >
                    <td className="pl-8 pt-3.5 pb-4 whitespace-nowrap">
                      <div className="flex items-center h-14">
                        <div className="flex-shrink-0 w-10">
                          <img
                            className="w-10 rounded-full"
                            src={sku?.product?.imageUrl}
                            alt={sku?.product?.brand}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {stripSkuFromBrandName(sku?.product?.brand)}
                          </div>
                          <div className="text-sm my-1 text-gray-500">
                            {stripProductTypeFromSku(sku.product?.sku)}
                            <span className="ml-1">
                              ({sku?.product?.productType})
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">{sku?.quantity}</td>
                    <td
                      className={`py-2 ${
                        formatEmptiesQuantity(
                          sku?.product?.productType,
                          sku?.empties
                        ) === "Nil" && "text--accent"
                      }`}
                    >
                      {formatEmptiesQuantity(
                        sku?.product?.productType,
                        sku?.empties
                      )}
                    </td>
                    <td className="py-2 my-7">
                      <div className="flex">
                        <div
                          onClick={(e) => {
                            handleDecrease(
                              index,
                              fullInputRefs.current[index].value ||
                                sku?.quantity,
                              sku.productId,
                              "full"
                            );
                          }}
                          className={`h-6 w-6 mr-1 
                            ${
                              (sku.quantity === (0 || null) &&
                                !fullInputRefs.current[index]?.value) ||
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
                                sku.productId,
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
                              sku.productId,
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
                    <td className="py-2 my-7">
                      {formatEmptiesQuantity(
                        sku?.product?.productType,
                        sku?.empties
                      ) === "Nil" ? (
                        <p className="text--accent">Nil</p>
                      ) : (
                        <div className="flex">
                          <div
                            onClick={(e) => {
                              handleDecrease(
                                index,
                                emptiesInputRefs.current[index].value ||
                                  sku?.empties,
                                sku.productId,
                                "empties"
                              );
                            }}
                            className={`h-6 w-6 mr-1 
                              ${
                                (sku.empties === (0 || null) &&
                                  !emptiesInputRefs.current[index]?.value) ||
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
                              id={"input-empties" + sku.id}
                              placeholder="0"
                              defaultValue={sku?.empties}
                              onChange={(e) => {
                                updateQty(
                                  index,
                                  e.target.value,
                                  sku.productId,
                                  "empties"
                                );
                              }}
                              onKeyUp={(e) => {
                                switch (e.key) {
                                  case "ArrowDown":
                                    targetElem =
                                      emptiesInputRefs.current[
                                        index === updatedProducts.length - 1
                                          ? 0
                                          : index + 1
                                      ];

                                    break;
                                  case "ArrowUp":
                                    targetElem =
                                      emptiesInputRefs.current[
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
                              ref={(el) =>
                                (emptiesInputRefs.current[index] = el)
                              }
                              className={`w-16 h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5
                                ${
                                  updatedProducts[index]?.empties
                                    ? "bg--gray-1"
                                    : "bg--gray-2"
                                }`}
                            />
                          </div>
                          <div
                            onClick={(e) => {
                              handleIncrease(
                                index,
                                emptiesInputRefs.current[index].value ||
                                  sku?.empties,
                                sku.productId,
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
                    <td className="w-24">
                      <div
                        className="d-inline-block invisible"
                        data-toggle="popover"
                        data-trigger="focus"
                        data-content="Please select"
                        ref={(el) => (selectRefs.current[index] = el)}
                      >
                        <ReactSelect
                          defaultValue=""
                          ref={(el) => (reasonRefs.current[index] = el)}
                          placeholder="Reason"
                          options={reasonOption}
                          isMulti={false}
                          closeMenuOnSelect={true}
                          hideSelectedOptions={false}
                          indicatorSeparator={false}
                          styles={{
                            control: (styles) => ({
                              ...styles,
                              backgroundColor: "transparent",
                              border: "none",
                              width: "90px",
                            }),
                            placeholder: (styles) => ({
                              ...styles,
                              color: "#090B17",
                            }),
                            indicatorSeparator: (styles) => ({
                              display: "none",
                            }),
                            dropdownIndicator: (styles) => ({
                              ...styles,
                              padding: "0px",
                              color: "#50525B",
                            }),
                          }}
                          components={{
                            OptionComp,
                          }}
                          onChange={(e) =>
                            handleChangeDailyStock(e, sku?.productId, index)
                          }
                          allowSelectAll={false}
                        />
                      </div>
                    </td>
                    <td className="p-0">
                      <Fade>
                        <div
                          className="flex items-center px-4 invisible mb-10"
                          key={sku?.id}
                          id={index}
                          ref={(el) => (editedRefs.current[index] = el)}
                        >
                          <div
                            className="rounded-2xl px-2 py-1 font-semibold"
                            style={{
                              backgroundColor: "#74767E",
                              color: "#FFFFFF",
                              fontSize: 14,
                              marginRight: 10,
                            }}
                          >
                            Edited
                          </div>
                          <ArrowEdit
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              clearEdit(index, sku.productId, sku.id);
                            }}
                          />
                        </div>
                      </Fade>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <LoadingList />
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default DailyStockCount;
