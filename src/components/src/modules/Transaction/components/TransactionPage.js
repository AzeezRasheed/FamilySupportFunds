import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { cloneDeep, concat, pull } from "lodash";
// import SortImg from "../../../assets/svg/sort.svg";
// import arrowDown from "../../../assets/svg/arrowDown.svg";
// import { Link } from "react-router-dom";
// import { Fade } from "react-reveal";
// import ArrowEdit from "../../../assets/svg/edit-arrow.svg";
import { connect, useSelector } from "react-redux";
import QuickActions from "../../../components/common/QuickActions";
import { TransactionQuickActions } from "../../../utils/quickActions";
import Dashboard from "../../../Layout/Dashboard";
import Loading from "../../../components/common/Loading";
import {
  // getAllProducts,
  updateDistPriceChange,
  updateDistProducts,
} from "../../Admin/Pricing/actions/AdminPricingAction";
import { formatPriceByCountrySymbol, formatPriceWithoutCurrency, getCountrySymbol } from "../../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import { pullAt, findIndex, filter } from "lodash";
import { useDispatch } from "react-redux";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { updateCataloguePrice, cataloguePriceChange, getCatalogueBySellerId } from '../actions/productCatalogue'
import { getAllInventory } from "../../Inventory/actions/inventoryProductAction";
import { formatNumber } from "../../../utils/formatNumber";
import { stripSkuFromBrandName } from "../../../utils/helperFunction";

const Transaction = ({
  location,
  sellersCatalogue,
  getAllInventory,
  getCatalogueBySellerId,
  updateDistPriceChange,
  priceChange,
  updateDistProducts,
  allInventory
  // allProducts
}) => {
  const {t} = useTranslation()
  const { distCode } = useParams();
  const quickActionsTransaction = TransactionQuickActions(distCode)
  let targetElem = "";
  let targetDiv = "";
  const inputRefs = useRef([]);
  const editedRefs = useRef([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [itemsToSave, setItemsToSave] = useState([]);
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const dispatch = useDispatch();

  // useEffect(() => {
  //   getAllProducts(country === "South Africa" ? "SA" : country);
  // }, [country]);
  useEffect(() => {
    getAllInventory(distCode);
    getCatalogueBySellerId(distCode)
  }, [distCode, sellersCatalogue.length]);

  // useEffect(() => {
  //   if (itemsToSave.length > 0) {
  //     updateDistPriceChange(true);
  //   }
  //   if (itemsToSave.length === 0) {
  //     updateDistPriceChange(false);
  //   }
  // }, [itemsToSave.length]);

  
  useEffect(() => {
    const prevProducts = cloneDeep(allInventory);
    setUpdatedProducts(prevProducts);
  }, [allInventory]);

  useEffect(() => {
    if (priceChange === false) {
      const prevProducts = cloneDeep(allInventory);
      setUpdatedProducts(prevProducts);
    }
  }, [priceChange]);

  const updatePriceByTyping = (newPrice, index) => {
    const price = newPrice.replace(/,/g, '');
    const formattedPrice = formatPriceWithoutCurrency(price);
    const newArray = [...updatedProducts];
    newArray[index].product.price = Number(price);
    setUpdatedProducts(newArray);
    updateDistProducts(newArray);
    inputRefs.current[index].value = formattedPrice;
  };

  const handleDecrease = (index, prevPrice, productId) => {
    let newPrice = Number(prevPrice.replace(/,/g, '')) - 1;
    AddedItems(newPrice.toString(), index, productId, getOriginalPrice(productId));
  };

  const handleIncrease = (index, prevPrice, productId) => {
    let newPrice = Number(prevPrice.replace(/,/g, '')) + 1;
    AddedItems(newPrice.toString(), index, productId, getOriginalPrice(productId));
  };

  const showLabel = (country) => {
    let value;
    switch (country) {
      case 'Nigeria':
        value = 'Recommended Price'
        break;
      case 'Uganda':
        value = 'Recommended Price'
        break;
      case 'Ghana':
        value = 'Price to Wholesaler'
        break;
      case 'South Africa':
        value = 'PFW'
        break;
      case 'Tanzania':
        value = 'Recommended Price'
        break;
      case 'Mozambique':
        value = 'Recommended Price'
        break;
      case 'Zambia':
        value = 'Recommended Price'
        break;
      default:
        value=value
        break;
    }
    return value
  }

  const getOriginalPrice = (productId) => {
    const product = filter(sellersCatalogue?.data, { productId: productId })[0];
    const value = product ? product?.price : 0;
    return value;
  };

  const AddedItems = (price, identifier, productID, originalPrice) => {
    updatePriceByTyping(price, identifier)
    price = Number(price.replace(',', ''));
    originalPrice = Number(originalPrice);
    if (price > originalPrice || price < originalPrice) {
      dispatch(updateCataloguePrice(true));
    } else {
      dispatch(updateCataloguePrice(false));
    }
    if (parseInt(price) === 0) {
      itemsToSave.length > 0
        ? dispatch(updateCataloguePrice(true))
        : dispatch(updateCataloguePrice(false));
    }

    const index = findIndex(itemsToSave, { productId: productID });

    if (!price) {
      pullAt(itemsToSave, [index]);
      dispatch(cataloguePriceChange(itemsToSave));
    } else {
      const item = {
        sellerCompanyId: distCode,
        price: price,
        productId: productID
      }

      if (index >= 0) {
        itemsToSave[index].price = item.price;
      } else {
        itemsToSave.push(item);
      }
      dispatch(cataloguePriceChange(itemsToSave));
    }

    // itemsToSave.length > 0
    //   ? dispatch(updateCataloguePrice(true))
    //   : dispatch(updateCataloguePrice(false));
  };

  const fetchPriceByDistributorId = (productId) => {
    if ( sellersCatalogue?.data === undefined || !sellersCatalogue) return;
    for (let value of sellersCatalogue?.data) {
      if (value && value?.productId === productId) {
        return formatPriceWithoutCurrency(value?.price)
      }
    }
    return "0.00";
  }

  const showEdited = (targetDiv, i, productId) => {
    const distPrice = Number(fetchPriceByDistributorId(productId).replace(',', ''))
    if (
      (distPrice > updatedProducts[i].product.price ||
      distPrice < updatedProducts[i].product.price) &&
      distPrice !== Number(inputRefs.current[i].value.replace(',', ''))
    ) {
      const concatt = concat(itemsToSave, i);
      setItemsToSave(concatt);
      targetDiv.style.cursor = "pointer";
      return (targetDiv.style.opacity = 1);
    } else {
      const array = [...itemsToSave];
      pull(array, i);
      const arr = array.filter(item => item.productId !== productId);
      setItemsToSave(arr);
      if (arr.length === 0) {
        dispatch(updateCataloguePrice(false));
        dispatch(cataloguePriceChange(arr));
      }
      targetDiv.style.cursor = "auto";
      return (targetDiv.style.opacity = 0.5);
    }
  };
  const handleKeyUp = (targetElem) => {
    if (targetElem) targetElem.focus();
  };

  const searchProduct = (filterInput, filterTbody) => {
    let input, filter, ul, li, a, i;
    input = document.getElementById(filterInput);
    filter = input.value.toUpperCase();
    ul = document.getElementById(filterTbody);
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
        <div className="flex van-replenish-cont">
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("transactions")}
          </h2>
        </div>
        <div className="mt-8 mb-12">
          <QuickActions data={quickActionsTransaction} />
        </div>
        <div className="bg-white mt-4 w-full rounded-md">
          <div className="py-5 flex-auto">
            <div className="flex title-step px-7 py-3">
              {/* <p className="title">Select Warehouse</p> */}
              <p className="text-sm title text-default font-normal">
                {t("price_setup")}
              </p>
            </div>
            <div className="stock-cont py-4">
              <div className="flex flex-wrap">
                <div className="w-full">
                  <div className="py-2 flex-auto">
                    <div className="tab-content tab-space">
                      <div className="block">
                        <div
                          className="mt-3 filters px-4 flex justify-between"
                          style={{ width: "100%" }}
                        >
                          <input
                            className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-2  text-black-400"
                            id="searchProduct"
                            type="text"
                            name="search"
                            style={{
                              width: "68%",
                              backgroundColor: "#E5E5E5",
                            }}
                            // onChange={(e) => onChange(e)}
                            placeholder={t("search_for_anything")}
                            onKeyUp={() =>
                              searchProduct("searchProduct", "productsAll")
                            }
                          />
                          {/* <div className="filters-2 mx-4 flex pt-1" style={{ width: "48%" }}>
                            <div
                              className="filter-content flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <p className="text-default font-normal">
                                Select Products(s)
                              </p>{" "}
                              <img
                                className="pl-3 pr-2"
                                src={arrowDown}
                                alt=""
                              />
                            </div>
                            <div
                              className="filter-content flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <p className="text-default font-normal">
                                All SKUs
                              </p>{" "}
                              <img
                                className="pl-3 pr-2"
                                src={arrowDown}
                                alt=""
                              />
                            </div>
                            <div className="filter-content flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                              <img className="pr-2" src={SortImg} alt="" />
                              <p className="text-default font-normal">
                                Sort By
                              </p>
                            </div>
                          </div> */}
                        </div>
                        
                        <table className="table-cont transactions flex flex-col flex-no wrap sm:table-row md:table-row lg:min-w-full mt-8 divide-y divide-gray-200">
                          <thead className="bg-transparent mt-4 table-head w-full">
                            <tr className="flex flex-no wrap sm:table-row md:table-row">
                              <th
                                scope="col"
                                className="pl-12 pr-6 md:w-96 py-3 text-left text-sm font-semibold text-black tracking-wider"
                              >
                                {t("product")}
                              </th>
                              {/* <th
                                scope="col"
                                className="px-4 md:w-30 py-3 text-left text-sm font-medium text-black tracking-wider"
                              >
                                SKU
                              </th> */}
                              <th
                                scope="col"
                                className="px-6 py-3 md:w-80 text-left text-sm font-semibold text-black tracking-wider"
                              >
                                Quantity Available
                              </th>
                              {/* <th
                                scope="col"
                                className="px-12 md:w-80 py-3 text-left text-sm font-medium text-black tracking-wider"
                              >
                                {t("recommended_price")}
                              </th> */}
                              {/* <th
                                scope="col"
                                className="px-12 md:w-80 py-3 text-left text-sm font-medium text-black tracking-wider"
                              /> */}
                              <th
                                scope="col"
                                className="px-6 md:w-80 py-3 text-left text-sm font-semibold text-black tracking-wider"
                              >
                                {showLabel(country) }
                              </th>
                               {country === 'Ghana' && (<th
                                scope="col"
                                className="px-6 md:w-80 py-3 text-left text-sm font-semibold text-black tracking-wider"
                              >
                                Price To Retailer
                              </th>)}
                              {country === 'South Africa' && (<th
                                scope="col"
                                className="px-6 md:w-80 py-3 text-left text-sm font-semibold text-black tracking-wider"
                              >
                                PTR
                              </th>)}
                              {country === "Zambia" && <th
                                scope="col"
                                className="px-6 md:w-80 py-3 pb-4 text-left text-sm font-semibold text-black tracking-wider"
                              >
                                {t("distributor_price")}
                              </th>}
                                 <th
                                scope="col"
                                className="px-6 md:w-80 py-3 text-left text-sm font-medium text-black tracking-wider"
                              />
                            </tr>
                          </thead>
                          <tbody
                            id="productsAll"
                            className="table-head w-full bg-white px-6 divide-y divide-gray-200"
                          >
                            <>
                              {!allInventory.length ? (
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
                                allInventory?.map((sku, index) => (
                                  <tr key={sku.id}>
                                    <td
                                      scope="col"
                                      className="pl-12 pr-6 md:w-96 py-3 text-left text-sm"
                                    >
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-20 w-10">
                                          <img
                                            className="h-20 w-10 rounded-full"
                                            src={sku.product.imageUrl}
                                            alt=""
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-semibold md:text-base text-gray-900">
                                            {stripSkuFromBrandName(sku.product.brand)}
                                          </div>
                                          <p
                                            className="mb-2.5"
                                            style={{ color: "#50525B" }}
                                          >
                                            {sku.product.sku}
                                          </p>
                                          <div
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                            style={{
                                              backgroundColor: "#F49C00",
                                            }}
                                          >
                                            {sku.product.productType}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    {/* <td
                                      scope="col"
                                      className="px-4 md:w-30 py-3 text-left text-sm"
                                    >
                                      <p
                                        className=""
                                        style={{ color: "#50525B" }}
                                      >
                                        {sku.sku}
                                      </p>
                                    </td> */}
                                    <td
                                      scope="col"
                                      className="px-6 md:w-80 py-3 text-left text-sm md:text-base"
                                    >
                                      <p className="pl-4" style={{ color: "#50525B" }}>
                                        {formatNumber(sku.quantity)}
                                      </p>
                                    </td>
                                    <td
                                      scope="col"
                                      className="px-6 md:w-80 py-3 text-left text-sm"
                                    >
                                      <div className="flex">
                                        <div
                                          className="border-defaut bg-red font-normal text-sm border-2 w-auto px-3 h-8 recommended-input"
                                          style={{
                                            borderRadius: "4px 0px 0px 4px",
                                          }}
                                        >
                                          <p className="pt-1">{formatPriceByCountrySymbol(country, sku.product.price)}</p>
                                        </div>
                                        <div
                                          className="h-8 w-14 counter"
                                          style={{
                                            cursor: "pointer",
                                            backgroundColor: "#50525B",
                                            borderRadius: "0px 4px 4px 0px",
                                          }}
                                          onClick={(e) => {
                                            const newArray = [
                                              ...updatedProducts,
                                            ];
                                            newArray[index].product.price =
                                              allInventory[index].product.price;
                                            inputRefs.current[index].value = formatPriceWithoutCurrency(allInventory[index].product.price);
                                            targetDiv =
                                              editedRefs.current[index];
                                            AddedItems(
                                              formatPriceWithoutCurrency(allInventory[index].product.price), 
                                              index, 
                                              sku.product.productId, 
                                              getOriginalPrice(sku.product.productId)
                                            );
                                            showEdited(targetDiv, index, sku?.product?.productId);
                                          }}
                                        >
                                          <p
                                            className="pt-1.5 text-center"
                                            style={{ color: "#fff" }}
                                          >
                                            {t("use")}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    {country === "Ghana" &&<td
                                      scope="col"
                                      className="px-6 md:w-80 py-3 text-left text-sm"
                                    >
                                      <div className="flex">
                                        <div
                                          className="border-defaut bg-red font-normal text-sm border-2 w-auto px-3 h-8 recommended-input"
                                          style={{
                                            borderRadius: "4px 0px 0px 4px",
                                          }}
                                        >
                                          <p className="pt-1">{formatPriceByCountrySymbol(country, sku.product.ptr_price)}</p>
                                        </div>
                                        <div
                                          className="h-8 w-14 counter"
                                          style={{
                                            cursor: "pointer",
                                            backgroundColor: "#50525B",
                                            borderRadius: "0px 4px 4px 0px",
                                          }}
                                          onClick={() => {
                                            const newArray = [
                                              ...updatedProducts,
                                            ];
                                            newArray[index].product.ptr_price =
                                              allInventory[index].product.ptr_price;
                                            setUpdatedProducts(newArray);
                                            targetDiv =
                                              editedRefs.current[index];
                                            showEdited(targetDiv, index, sku.product.ptr_price);
                                          }}
                                        >
                                          <p
                                            className="pt-1 text-center"
                                            style={{ color: "#fff" }}
                                          >
                                            Use
                                          </p>
                                        </div>
                                      </div>
                                    </td>}
                                    {country === "South Africa" &&<td
                                      scope="col"
                                      className="px-6 md:w-80 py-3 text-left text-sm"
                                    >
                                      <div className="flex">
                                        <div
                                          className="border-defaut bg-red font-normal text-sm border-2 w-auto px-3 h-8 recommended-input"
                                          style={{
                                            borderRadius: "4px 0px 0px 4px",
                                          }}
                                        >
                                          <p className="pt-1">{formatPriceByCountrySymbol(country, sku.product.poc_price)}</p>
                                        </div>
                                        <div
                                          className="h-8 w-14 counter"
                                          style={{
                                            cursor: "pointer",
                                            backgroundColor: "#50525B",
                                            borderRadius: "0px 4px 4px 0px",
                                          }}
                                          onClick={() => {
                                            const newArray = [
                                              ...updatedProducts,
                                            ];
                                            newArray[index].product.poc_price =
                                              allInventory[index].product.poc_price;
                                            setUpdatedProducts(newArray);
                                            targetDiv =
                                              editedRefs.current[index];
                                            showEdited(targetDiv, index, sku.product.poc_price);
                                          }}
                                        >
                                          <p
                                            className="pt-1 text-center"
                                            style={{ color: "#fff" }}
                                          >
                                            Use
                                          </p>
                                        </div>
                                      </div>
                                    </td>}
                                    {/* <td
                                      scope="col"
                                      className="px-12 md:w-80 py-3 text-left text-sm"
                                    /> */}
                                    {country === "Zambia" && <td
                                      scope="col"
                                      className="px-6 md:w-80 py-3 text-left text-sm"
                                    >
                                      <div className="flex">
                                        <div
                                          onClick={() => {
                                            handleDecrease(
                                              index, 
                                              inputRefs.current[index].value || fetchPriceByDistributorId(sku?.product?.productId), 
                                              sku.product.productId
                                            );
                                            targetDiv =
                                              editedRefs.current[index];
                                            showEdited(targetDiv, index, sku?.product?.productId);
                                          }}
                                          className="h-8 w-8 mr-2 counter"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <p className="couter-text pt-1 pl-1">
                                            <RemoveIcon />
                                          </p>
                                        </div>
                                        <div className="relative">
                                          <span className="absolute font-customGilroy font-medium text-grey-100 left-3 w-8 text-right text-sm md:text-base top-1">
                                            {getCountrySymbol(country)}
                                          </span>
                                          <input
                                            key={updatedProducts[index]?.id}
                                            id={updatedProducts[index]?.id}
                                            defaultValue={fetchPriceByDistributorId(sku?.product?.productId)}
                                            style={{maxWidth: "9rem"}}
                                            onChange={(e) => {
                                              AddedItems(
                                                e.target.value,
                                                index,
                                                sku.product.productId,
                                                getOriginalPrice(sku.product.productId)
                                              );
                                              targetDiv =
                                                editedRefs.current[index];
                                              showEdited(targetDiv, index, sku?.product?.productId);
                                            }}
                                            onKeyUp={(e) => {
                                              switch (e.key) {
                                                case "ArrowDown":
                                                  targetElem =
                                                    inputRefs.current[
                                                      index ===
                                                      updatedProducts.length - 1
                                                        ? 0
                                                        : index + 1
                                                    ];

                                                  break;
                                                case "ArrowUp":
                                                  targetElem =
                                                    inputRefs.current[
                                                      index ===
                                                      updatedProducts.length + 1
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
                                            className="rounded border border-gray-300 font-customGilroy font-medium text-grey-100 not-italic text-sm md:text-base md:leading-snug py-1 pr-5 pl-12"
                                          />
                                        </div>
                                        <div
                                          onClick={() => {
                                            handleIncrease(
                                              index, 
                                              inputRefs.current[index].value || fetchPriceByDistributorId(sku?.product?.productId), 
                                              sku.product.productId
                                            );
                                            targetDiv =
                                              editedRefs.current[index];
                                            showEdited(targetDiv, index, sku?.product?.productId);
                                          }}
                                          className="h-8 w-9 ml-2 counter"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <p className="couter-text pt-1 pl-1.5">
                                            <AddIcon />
                                          </p>
                                        </div>
                                      </div>
                                    </td>}
                                    {/* {country === 'Nigeria' && (<td
                                      scope="col"
                                      className="px-12 md:w-80 py-3 text-left text-sm"
                                    >
                                      <div className="flex">
                                        <div
                                          onClick={() => {
                                            handleDecrease(index, updatedProducts[index]?.price);
                                            targetDiv =
                                              editedRefs.current[index];
                                            showEdited(targetDiv, index);
                                          }}
                                          className="h-8 w-8 mr-2 counter"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <p className="couter-text pt-1 pl-3">
                                            -
                                          </p>
                                        </div>
                                        <input
                                          key={updatedProducts[index]?.id}
                                          id={updatedProducts[index]?.id}
                                          value={updatedProducts[index]?.price}
                                          onChange={(e) => {
                                            updatePriceByTyping(
                                              e.target.value,
                                              index
                                            );
                                            targetDiv =
                                              editedRefs.current[index];
                                            showEdited(targetDiv, index);
                                          }}
                                          onKeyUp={(e) => {
                                            switch (e.key) {
                                              case "ArrowDown":
                                                targetElem =
                                                  inputRefs.current[
                                                    index ===
                                                    updatedProducts.length - 1
                                                      ? 0
                                                      : index + 1
                                                  ];

                                                break;
                                              case "ArrowUp":
                                                targetElem =
                                                  inputRefs.current[
                                                    index ===
                                                    updatedProducts.length + 1
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
                                          className="w-16 h-6 mt-1 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5"
                                        />
                                        <div
                                          onClick={() => {
                                            handleIncrease(index, updatedProducts[index]?.price);
                                            targetDiv =
                                              editedRefs.current[index];
                                            showEdited(targetDiv, index);
                                          }}
                                          className="h-8 w-9 ml-2 counter"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <p className="couter-text pt-1 pl-3">
                                            +
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    )} */}
                                    {country === "Zambia" && <td
                                      scope="col"
                                      className="pl-6 pr-12 md:w-80 py-3 text-left text-sm"
                                    >
                                      {/* <Fade> */}
                                        <div
                                          className="flex items-center font-medium opacity-50"
                                          key={sku.id}
                                          id={index}
                                          style={{ color: "#45130F" }}
                                          ref={(el) =>
                                            (editedRefs.current[index] = el)
                                          }
                                          onClick={() => {
                                            const newArray = [
                                              ...updatedProducts,
                                            ];
                                            newArray[index].product.price =
                                              allInventory[index].product.price;
                                            setUpdatedProducts(newArray);
                                            inputRefs.current[index].value = formatPriceWithoutCurrency(fetchPriceByDistributorId(sku?.product?.productId));
                                            targetDiv =
                                              editedRefs.current[index];
                                            showEdited(targetDiv, index, sku?.product?.productId);
                                          }}
                                        >
                                          {t("Undo changes")}
                                          {/* <div
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
                                          <img
                                            src={ArrowEdit}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                              const newArray = [
                                                ...updatedProducts,
                                              ];
                                              newArray[index].price =
                                                allProducts[index].price;
                                              setUpdatedProducts(newArray);
                                              targetDiv =
                                                editedRefs.current[index];
                                              showEdited(targetDiv, index);
                                            }}
                                          /> */}
                                        </div>
                                      {/* </Fade> */}
                                    </td>}
                                  </tr>
                                ))
                              )}
                            </>
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
const mapStateToProps = (state) => {
  return {
    // allProducts: state.DistributorPricingReducer.allProducts,
    allInventory: state.InventoryReducer.all_inventory,
    priceChange: state.ProductCatalogueReducer.cataloguePriceChange,
    sellersCatalogue: state.ProductCatalogueReducer.allSellersCatalogue
  };
};

export default connect(mapStateToProps, {
  // getAllProducts,
  getAllInventory,
  updateDistPriceChange,
  updateDistProducts,
  getCatalogueBySellerId
})(Transaction);
