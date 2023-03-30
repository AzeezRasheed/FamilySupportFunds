import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Return } from "../../../assets/svg/adminIcons";
import Dashboard from "../../../Layout/Dashboard";
import { getAllProducts } from "../../Admin/Pricing/actions/AdminPricingAction";
import {
  getAllInventory,
  receiveNewStock,
  transferQuantity,
  updateTransferQuantity,
} from "../../Inventory/actions/inventoryProductAction";
import { cloneDeep, findIndex, pullAt } from "lodash";
import { Fade } from "react-reveal";
import { default as ReactSelect } from "react-select";
import { ReactComponent as ArrowEdit } from "../../../assets/svg/edit-arrow.svg";
import { OptionComp } from "../../../components/common/ReactSelect";
import { useTranslation } from "react-i18next";
import { getLocation } from "../../../utils/getUserLocation";
import Tag from "../../Inventory/components/Tag";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { formatEmptiesQuantity, stripSkuFromBrandName } from "../../../utils/helperFunction";

// import TotalEmpties from "../components/TotalEmpties";
const InventoryAdjusment = ({
  location,
}) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { Dist_Code } = useParams();
	let targetElem = "";
	const editedRefs = useRef([]);
	const selectRefs = useRef([]);
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const {t} = useTranslation()
  const fullInputRefs = useRef([]);
  const emptiesInputRefs = useRef([]);
  const reasonRefs = useRef([]);
  const [inventoryAdjustmentReason, setInventoryAdjustmentReason] = useState({});
  const [productId, setProductId] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stockUpdated, setStockUpdated] = useState([]);

	const [userCountry, setUserCountry] = useState(
     useSelector(state => state.Auth.sessionUserData).country
  );

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);

	const country = AuthData?.country;

	let dist_code = useSelector((state) => state.DistReducer.dist_code);
	if (!dist_code) {
		dist_code = Dist_Code;
	}

	const totalEmpties = useSelector(
		(state) => state.InventoryReducer.totalEmpties
	);

	const allInventory = useSelector(
		(state) => state.InventoryReducer.all_inventory
	);	

	const reasonOption = [
		{ value: "breakages", label: t("breakage") },
    { value: "miscount", label: t("miscount") },
    { value: "theft", label: t("theft") },
    { value: "other", label: t("other") },
	];

	useEffect(() => {
		dispatch(getAllInventory(Dist_Code));
	}, [allInventory.length]);

  useEffect(() => {
    dispatch(receiveNewStock(false));
  }, [])

  useEffect(() => {
    if (allInventory?.length > 0) {
      const prevProducts = cloneDeep(allInventory);
      setUpdatedProducts(prevProducts);
    }
  }, [allInventory]);

  useEffect(() => {
    if (productId !== 0) {
      saveStock(productId, currentIndex);
    }
  }, [inventoryAdjustmentReason]);

  useEffect(() => {
    if (stockUpdated.length === 0) {
      dispatch(updateTransferQuantity(false));
    } else {
      dispatch(updateTransferQuantity(true));
      dispatch(
        transferQuantity({
          stockCounted: stockUpdated,
          type: 'edit'
        })
      );
    }
  }, [stockUpdated]);

	const allProducts = useSelector((state) => state.PricingReducer.allProducts);
	const quantityChange = useSelector(
		(state) => state.PricingReducer.quantityChange
	);

	if (!allProducts) {
		dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
	}

	const handleKeyUp = (targetElem) => {
		if (targetElem) targetElem.focus();

	};

  const handleChangeReason = (selected, productId, index) => {
    setInventoryAdjustmentReason({
      ...inventoryAdjustmentReason,
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

	// const save = (productID, quantity, formerQuantity) => {
	// 	if (parseInt(quantity) === parseInt(0) && parseInt(quantity) === parseInt(formerQuantity)) {
	// 		reason.length > 0 ||
	// 		(emptiesReason &&
	// 			(parseInt(empties) > parseInt(totalEmpties) ||
	// 				parseInt(empties) < parseInt(totalEmpties)))
	// 			? dispatch(updateTransferQuantity(true))
	// 			: dispatch(updateTransferQuantity(false));
	// 		return;
	// 	}
	// 	const index = findIndex(quantitiesToStock, { productId: productID });
	// 	const reasonIndex = findIndex(reason, { productId: productID });

	// 	if (!quantity) {
	// 		pullAt(quantitiesToStock, [index]);
	// 		pullAt(reason, [reasonIndex]);
	// 		// reason.splice(reasonIndex, 1)
	// 		// reason.filter((val)=>val.productId===productID)

	// 		dispatch(
	// 			transferQuantity({
	// 				type: "stock-adjustment",
	// 				quantitiesToStock,
	// 			})
	// 		);
	// 	} else {
	// 		const productReasons = reason.filter((val) => val.productId === productID);
  //     const thisReason = productReasons[productReasons.length - 1];
	// 		const item = {
	// 			productId: productID,
	// 			quantity: quantity ? quantity : formerQty,
	// 			reason: thisReason?.value ? thisReason?.value : "miscount",
	// 		};

	// 		if (index < 0) {
	// 			quantitiesToStock.push(item);
	// 		} else if (empties < 0) {
	// 			quantitiesToStock.push(item);
	// 		} else {
	// 			quantitiesToStock[index] = item;
	// 		}
	// 		dispatch(
	// 			transferQuantity({
	// 				type: "stock-adjustment",
	// 				quantitiesToStock,
	// 			})
	// 		);
	// 	}
	// 	reason.length > 0 ||
	// 	(emptiesReason &&
	// 		(parseInt(empties) > parseInt(totalEmpties) ||
	// 			parseInt(empties) < parseInt(totalEmpties)))
	// 		? dispatch(updateTransferQuantity(true))
	// 		: dispatch(updateTransferQuantity(false));
	// };

	
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
    const reason = inventoryAdjustmentReason[index];
    let emptiesQuantity = updatedProducts[index]?.empties;
    let fullQuantity = updatedProducts[index]?.quantity;
    let prevEmptiesQuantity = allInventory[index]?.empties;
    let prevFullQuantity = allInventory[index]?.quantity;

    if (!qty, reason) {
      const i = findIndex(stockUpdated, { productId: productId });
      pullAt(stockUpdated, [i]);

      if (
        Number(fullQuantity) === Number(prevFullQuantity) &&
        Number(emptiesQuantity) === Number(prevEmptiesQuantity)
      ) {
        setStockUpdated([...stockUpdated]);
      } else {
        const isEmpties = formatEmptiesQuantity(
          allInventory[index]?.product?.productType,
          allInventory[index]?.empties
        )
        let item;
        if (isEmpties === "Nil") {
          item = {
            productId: parseInt(productId),
            quantity: parseInt(fullQuantity),
            productType: allInventory[index]?.product?.productType,
            reason: reason ? reason.reason : "miscount",
          };
        } else {
          item = {
            productId: parseInt(productId),
            empties: !emptiesQuantity ? 0 : parseInt(emptiesQuantity),
            quantity: parseInt(fullQuantity),
            productType: allInventory[index]?.product?.productType,
            reason: reason ? reason.reason : "miscount",
          };
        }
        setStockUpdated([...stockUpdated, item]);
      }
    }
  };

	return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <div onClick={() => history.goBack()}>
                <Return />
            </div>
            <h2 className="font-customRoboto text-black font-bold text-2xl">
            { country === "Tanzania" ? "Stock" : "Inventory"} Adjustment
            </h2>
          </div>
         
          {/* <div className="flex items-center">
            <button
              style={{
                minWidth: 220,
                backgroundColor: countryConfig[userCountry].buttonColor,
                borderRadius: 4,
                minHeight: 48,
              }}
              // onClick={onSubmit}
              onClick={handleOpen}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: "24px",

                  color: countryConfig[userCountry].textColor,
                }}
              >
                {t("Adjust_Empty")}
              </span>
            </button>
          </div> */}
        </div>
        <div className="bg-white mt-4 w-full rounded-md">
          <div className="py-5 flex-auto">
            <div className="flex title-step px-7 py-3">
              <p className="text-sm title text-default font-normal">
                {t("select_product(s)")}
              </p>
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
                            placeholder={`${t("search_for_a_product")}...`}
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
                        <table className="w-full mt-8 divide-y divide-gray-200">
                          <thead className="bg-transparent w-full">
                            <tr className="">
                              <th
                                scope="col"
                                className="pl-8 py-3 text-left text-sm font-semibold text-black tracking-wider"
                              >
                                {t("product")}
                              </th>
                              <th
                                scope="col"
                                className="py-3 pl-4 text-left text-sm font-semibold text-black tracking-wider"
                              >
                                SKU
                              </th>
                              <th
                                scope="col"
                                className="py-3 text-xs font-semibold text-black tracking-wider"
                              >
                                {t("quantity")}
                                <Tag className="bg--blue mt-2" tagName={t("fulls")} />
                              </th>
                              <th
                                scope="col"
                                className="py-3 text-left text-xs font-semibold text-black tracking-wider"
                              >
                                {t("quantity")}
                                <Tag className="bg--accent mt-2" tagName={t("empties")} />
                              </th>
                              <th
                                scope="col"
                                className="py-3 text-left text-xs font-semibold text-black  tracking-wider"
                              >
                                {/* {t("reason")} */}
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            id="ProductsTbody"
                            className="bg-white divide-y divide-gray-200"
                          >
                            {allInventory.map((sku, index) => (
                              <tr key={sku?.id}
                                id={`row${sku?.id}`}
                                className={`font-medium ${
                                  selectRefs.current[index]?.style.visibility ===
                                    "visible" && "bg--gray"
                                }`}
                              >
                                <td className="pl-8 py-4 whitespace-nowrap">
                                  <div className="flex items-center h-14">
                                    <div className="flex-shrink-0 w-10">
                                      <img
                                        className="w-10 rounded-full"
                                        src={sku?.product?.imageUrl}
                                        alt=""
                                      />
                                    </div>
                                    <div className="text-sm ml-4 font-semibold text-gray-900">
                                      {stripSkuFromBrandName(sku?.product?.brand)}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2 pl-4 w-64">
                                  {sku.product?.sku} 
                                  <span className="uppercase ml-1">
                                    ({sku?.product?.productType})
                                  </span>
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
                                        handleChangeReason(e, sku?.productId, index)
                                      }
                                      allowSelectAll={false}
                                    />
                                  </div>
                                </td>
                                <td className="p-0">
                                  <Fade>
                                    <div
                                      className="flex items-end invisible mb-10"
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default InventoryAdjusment;
