import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import SortImg from "../../../assets/svg/sort.svg";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import arrowBackBox from "../../../assets/svg/arrowBack.svg";
import { Link, useParams, useHistory } from "react-router-dom";
import Dashboard from "../../../Layout/Dashboard";
import { getAllProducts } from "../../Admin/Pricing/actions/AdminPricingAction";
import {
  getAllInventory,
  returnEmptiesQuantity,
  transferQuantity,
  updateEmptiesQuantity,
  updateExpiredQuantity,
  updateTransferQuantity,
} from "../actions/inventoryProductAction";
import { concat, findIndex, pullAt } from "lodash";
import { Fade } from "react-reveal";
import { ReactComponent as ArrowEdit } from "../../../assets/svg/edit-arrow.svg";
import { inventoryNet } from "../../../utils/urls";
import { default as ReactSelect } from "react-select";
import { OptionComp } from "../../../components/common/ReactSelect";
import { useTranslation } from "react-i18next";

const Return_Expired = ({ location }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { Dist_Code } = useParams();
  const history = useHistory();
  let targetElem = "";
  let targetDiv = "";
  let maxErrorDiv = "";
  let reasonDiv = "";
  const inputRefs = useRef([]);
  const editedRefs = useRef([]);
  const selectRefs = useRef([]);
  const maxQuantityRefs = useRef([]);
  const [quantitiesToReturn, setQuantitiesToReturn] = useState([]);
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [reason, setReason] = useState([]);
  const [prdId, setProductId] = useState(0);
  const [updateQuantity, setUpdateQuantity] = useState(0);
  const [formerQty, setFormerQty] = useState(0);

  const reasonOption = [
    { value: "expired", label: t("expired") },
    { value: "defective", label: t("defective") },
    { value: "other", label: t("other") },
  ];

  const allProducts = useSelector((state) => state.PricingReducer.allProducts);
  if (!allProducts) {
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }
  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  if (!dist_code) {
    dist_code = Dist_Code;
  }
  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );
  if (!allInventory.length) {
    dispatch(getAllInventory(dist_code));
  }

  const handleKeyUp = (targetElem) => {
    if (targetElem) targetElem.focus();
  };
  // useEffect(() => {
  //   console.log(quantitiesToReturn.length);
  //   quantitiesToReturn.length > 0
  //     ? dispatch(updateExpiredQuantity(true))
  //     : dispatch(updateExpiredQuantity(false));
  // }, [quantitiesToReturn.length, updateQuantity]);

  const save = (productID, quantity, inventoryQuantity, reason) => {
    const index = findIndex(quantitiesToReturn, { productId: productID });
    if (+quantity > inventoryQuantity) {
      pullAt(quantitiesToReturn, [index]);
      // showUnsavedChanges()
      // pullAt(reason, [reasonIndex]);
       quantitiesToReturn.length > 0
        ? dispatch(updateExpiredQuantity(true))
        : dispatch(updateExpiredQuantity(false));
      //  maxErrorDiv.style.visibility = "visible"
    } else {
      // if (maxErrorDiv) maxErrorDiv.style.visibility = "hidden";
      if (parseInt(quantity) === parseInt(0) || quantity > inventoryQuantity) {
        // showUnsavedChanges();
        quantitiesToReturn.length > 0
          ? dispatch(updateExpiredQuantity(true))
          : dispatch(updateExpiredQuantity(false));
        return;
      }
      //const index = findIndex(quantitiesToReturn, { productId: productID });
      if (!quantity) {
        pullAt(quantitiesToReturn, [index]);
        // pullAt(reason, [reasonIndex]);
        dispatch(transferQuantity(quantitiesToReturn));
      } else {
        const item = {
          productId: productID,
          quantity: quantity,
          reason: reason?.value,
        };

        if (index < 0) {
          quantitiesToReturn.push(item);
        } else {
          quantitiesToReturn[index] = item;
        }
        dispatch(transferQuantity(quantitiesToReturn));
        //dispatch(returnEmptiesQuantity(quantitiesToReturn));
        // inventoryNet.post("return-expired/" + dist_code, quantitiesToReturn)
        // .then(()=>{
        //   dispatch(getAllInventory(dist_code));
        // })
      }
      // showUnsavedChanges();
      quantitiesToReturn.length > 0
        ? dispatch(updateExpiredQuantity(true))
        : dispatch(updateExpiredQuantity(false));
    }
  };

  const showEdited = (targetDiv, i, quantity, inventoryQuantity) => {
    if (quantity > parseInt(0, 10) && quantity <= parseInt(inventoryQuantity, 10)) {
      return (targetDiv.style.visibility = "visible");
    } else {
      return (targetDiv.style.visibility = "hidden");
    }
  };

  // useEffect(() => {
  //   save(prdId, updateQuantity, formerQty);
  // }, [reason.length]);

  const showSelectReason = (targetDiv, quantity, productID, inventoryQuantity) => {
    if (quantity > parseInt(0, 10) && quantity <= parseInt(inventoryQuantity, 10)) {
      return (targetDiv.style.visibility = "visible");
    } else {
      const index = findIndex(quantitiesToReturn, { productId: productID });
      pullAt(quantitiesToReturn, [index]);
      quantitiesToReturn.length > 0
        ? dispatch(updateExpiredQuantity(true))
        : dispatch(updateExpiredQuantity(false));
      return (targetDiv.style.visibility = "hidden");
    }
  };

  const showMaxError = (targetDiv, quantity, inventoryQuantity) => {
    if (quantity > inventoryQuantity) {
      return (targetDiv.style.visibility = "visible");
    } else {
      return (targetDiv.style.visibility = "hidden");
    }
  };

  const handleChange = (productID, qty, inventoryQuantity) => {
    const index = findIndex(quantitiesToReturn, { productId: productID });
    if (qty > inventoryQuantity) {
      pullAt(quantitiesToReturn, [index]);
      quantitiesToReturn.length > 0
        ? dispatch(updateExpiredQuantity(true))
        : dispatch(updateExpiredQuantity(false));
      return;
    }

    if (index >= 0) {
      const array = {
        ...quantitiesToReturn[index],
      };
      array.quantity = qty;
      quantitiesToReturn[index] = array;
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

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex">
          <img
            onClick={() => history.push("/dashboard/inventory/" + dist_code)}
            className="van-img pr-7"
            src={arrowBackBox}
            alt=""
          />
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("return_products")}
          </h2>
        </div>
        <div className="bg-white mt-4 w-full rounded-md">
          <div className="py-5 flex-auto">
            <div className="flex title-step px-7 py-3">
              {/* <p className="title">Select Warehouse</p> */}
              <p className="text-sm title text-default font-normal">
                {t("select_product(s)")}
              </p>
              {/* <p className="step">Step 3 of 3</p> */}
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
                                className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                              >
                                {t("product")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                              >
                                {t("quantity_available")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                              >
                                {t("quantity_to_return")}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                              >
                                {t("reason")}
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            id="ProductsTbody"
                            className="bg-white px-6 divide-y divide-gray-200"
                          >
                            {allInventory?.map((sku, index) => (
                              <tr key={sku.id}>
                                <td className="px-12 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-20 w-10">
                                      <img
                                        className="h-20 w-10 rounded-full"
                                        src={sku?.product?.imageUrl}
                                        alt=""
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {sku?.product?.brand +
                                          " " +
                                          sku?.product?.sku}
                                      </div>
                                      <div
                                        className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                        style={{ backgroundColor: "#D86217" }}
                                      >
                                        {sku?.product?.productType}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-2 my-7">
                                  <div>{sku?.quantity}</div>
                                </td>
                                <td className="px-6 py-2 my-7">
                                  {/* <button
                                    className="w-6 h-6 rounded text-red-main font-bold bg-gray-200"
                                    onClick={() => {
                                      handleDecrease(sku.productId, sku.price);
                                      targetDiv = editedRefs.current[index];
                                      showEdited(targetDiv, index);
                                    }}
                                  >
                                    -
                                  </button> */}
                                  <input
                                    key={index}
                                    type="number"
                                    min="0"
                                    max={sku?.quantity}
                                    id={"input" + sku?.productId}
                                    placeholder="0"
                                    onChange={(e) => {
                                      handleChange(
                                        sku?.productId,
                                        e.target.value,
                                        sku?.quantity
                                      );
                                      maxErrorDiv =
                                        maxQuantityRefs.current[index];
                                      targetDiv = editedRefs.current[index];
                                      reasonDiv = selectRefs.current[index];

                                      // save(
                                      //   sku.productId,
                                      //   e.target.value,
                                      //   sku.quantity,
                                      //   maxErrorDiv,
                                      //   index
                                      // );

                                      showEdited(
                                        targetDiv,
                                        index,
                                        e.target.value,
                                        sku?.quantity
                                      );
                                      showSelectReason(
                                        reasonDiv,
                                        e.target.value,
                                        sku?.productId,
                                        sku?.quantity
                                      );
                                      showMaxError(
                                        maxErrorDiv,
                                        e.target.value,
                                        sku.quantity
                                      );
                                    }}
                                    onKeyUp={(e) => {
                                      switch (e.key) {
                                        case "ArrowDown":
                                          targetElem =
                                            inputRefs.current[
                                              index === allInventory.length - 1
                                                ? 0
                                                : index + 1
                                            ];

                                          break;
                                        case "ArrowUp":
                                          targetElem =
                                            inputRefs.current[
                                              index === allInventory.length + 1
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
                                    className="w-16 h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5"
                                  />
                                  <Fade>
                                    <div
                                      className="invisible"
                                      style={{ color: "red", fontSize: 9 }}
                                      ref={(el) =>
                                        (maxQuantityRefs.current[index] = el)
                                      }
                                    >
                                      {t("enter_a_lower_quantity")}
                                    </div>
                                  </Fade>

                                  {/* <button
                                    className="w-6 h-6 rounded text-red-main font-bold bg-gray-200"
                                    onClick={() => {
                                      handleIncrease(sku.productId, sku.price);
                                      targetDiv = editedRefs.current[index];
                                      showEdited(targetDiv, index);
                                    }}
                                  >
                                    +
                                  </button> */}
                                </td>
                                <td>
                                  <div
                                    className="d-inline-block invisible"
                                    data-toggle="popover"
                                    data-trigger="focus"
                                    data-content="Please select"
                                    ref={(el) =>
                                      (selectRefs.current[index] = el)
                                    }
                                  >
                                    <ReactSelect
                                      placeholder={t("select")}
                                      options={reasonOption}
                                      isMulti={false}
                                      closeMenuOnSelect={true}
                                      hideSelectedOptions={false}
                                      components={{
                                        OptionComp,
                                      }}
                                      onChange={(selectedOption) =>
                                        save(
                                          sku?.productId,
                                          inputRefs.current[index].value,
                                          sku?.quantity,
                                          selectedOption
                                        )
                                      }
                                      allowSelectAll={false}
                                      //   value={reason}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <Fade>
                                    <div
                                      className="flex items-center w-1/2 px-4 invisible"
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
                                        height={50}
                                        width={50}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          // const newArray = [...updatedProducts];
                                          // newArray[index].price =
                                          //   allProducts[index].price;
                                          // setUpdatedProducts(newArray);
                                          document.getElementById(
                                            "input" + sku.productId
                                          ).value = "";
                                          save(sku.productId, "");
                                          targetDiv = editedRefs.current[index];
                                          reasonDiv = selectRefs.current[index];
                                          showEdited(targetDiv, index);
                                          showSelectReason(reasonDiv, index);
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
    </Dashboard>
  );
};

export default Return_Expired;
