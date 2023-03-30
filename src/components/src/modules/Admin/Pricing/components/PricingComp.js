import React, { useState, useEffect, useRef } from "react";
import { connect, useSelector } from "react-redux";
import { cloneDeep, concat, pull, isEqual } from "lodash";
import { Fade } from "react-reveal";
import arrowDown from "../../../../assets/svg/arrowDown.svg";
import { ReactComponent as ArrowEdit } from "../../../../assets/svg/edit-arrow.svg";
import SortImg from "../../../../assets/svg/sort.svg";
import {
  getAllProducts,
  updatePriceChange,
  updateProducts,
} from "../actions/AdminPricingAction";
import Loading from "../../../../components/common/Loading";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const PricingComp = ({
  // allProducts,
  updatePriceChange,
  priceChange,
  updateProducts,
  columns,
}) => {
  const dispatch = useDispatch();
  let targetElem = "";
  let targetDiv = "";
  const tableClassGrid = columns?.length + 2;
  const inputRefs = useRef([]);
  const editedRefs = useRef([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [itemsToSave, setItemsToSave] = useState([]);
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const country = AuthData?.country;
  // const country = "Zambia";
  const [searchValue, setSearchValue] = useState("");
  const [editAccess, setEditAccess] = useState(false);

  const { t } = useTranslation();
  const allProducts = useSelector((state) => state.PricingReducer.allProducts);
  const filteredProducts = allProducts?.filter(
    (product) => product.is_abi === true
  );
  useEffect(() => {
    if (itemsToSave.length > 0) {
      updatePriceChange(true);
    }
    if (itemsToSave.length === 0) {
      updatePriceChange(false);
    }
  }, [itemsToSave.length]);

  useEffect(() => {
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
    AuthData.roles === "Admin" && AuthData.super_admin === 1
      ? setEditAccess(true)
      : setEditAccess(false);
  }, []);

  useEffect(() => {
    const prevProducts = cloneDeep(filteredProducts);
    setUpdatedProducts(prevProducts);
  }, [filteredProducts.length]);

  useEffect(() => {
    if (priceChange === false) {
      const prevProducts = cloneDeep(filteredProducts);
      setUpdatedProducts(prevProducts);
    }
  }, [priceChange]);

  const updatePriceByTyping = (index, args) => {
    const newArray = [...updatedProducts];
    console.log(args);
    args.forEach((arg) => {
      newArray[index][arg.priceName] = +arg.price ?? 0;
    });
    setUpdatedProducts(newArray);
    updateProducts(newArray);
  };

  const showEdited = (targetDiv, i) => {
    const arrayIsEqual = isEqual(updatedProducts, filteredProducts);
    if (arrayIsEqual === false) {
      updatePriceChange(true);
    }
    else {
      updatePriceChange(false);
    }
  };
  const handleKeyUp = (targetElem) => {
    if (targetElem) targetElem.focus();
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
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded px-10 py-10">
      <div className="block tab-content tab-space flex-auto w-full">
        <div className="flex mt-3 mb-10 px-4">
          <input
            className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mr-4 text-black-400 "
            id="searchProduct"
            type="text"
            name="search"
            style={{ width: "35rem", backgroundColor: "#E5E5E5" }}
            // onChange={(e) => onChange(e)}
            placeholder={`${t("search_for_a_product")}...`}
            onChange={() => searchProduct("searchProduct", "productsUL")}
          />
        </div>
        <>
          {!updatedProducts.length ? (
            <center>
              <Loading /> <Loading /> <Loading />
            </center>
          ) : (
            ""
          )}
          <table style={{ width: "100%" }}>
            <thead className=" items-center">
              <tr>
                <th className={`w-1/${tableClassGrid}`}> </th>
                {columns?.map((column, index) => (
                  <th className={`w-1/${tableClassGrid} px-2.5`} key={index}>{column.name}</th>
                ))}

                <th className={`w-1/${tableClassGrid}`}> </th>
              </tr>
            </thead>

            <tbody id="productsUL">
              {updatedProducts?.map((product, index) => (
                <tr key={index} id={product.id}>
                  <td className={`w-1/${tableClassGrid}`}>
                    <div className="flex gap-4">
                      <img
                        className="h-20 w-10 rounded-full"
                        src={product.imageUrl}
                        // style={{ objectFit: "cover" }}
                        alt=""
                      />
                      <div>
                        <div className="text-base my-1 font-semibold mb-3">
                          {product.brand}&nbsp;{product.sku}&nbsp;
                          {product.volume}
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="font-customGilroy text-sm font-medium text-center align-middle text-white">
                            <button
                              className="rounded-full py-1 px-3"
                              style={{ backgroundColor: "#F49C00" }}
                            >
                              {product.productType}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  {columns?.map((column, i) => (
                    <td key={i}>
                      <div className="flex gap-1">
                        <input
                          key={index}
                          className="w-20 h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5"
                          disabled={!editAccess}
                          value={product[column.columnName]}
                          ref={(el) => (inputRefs.current[index] = el)}
                          onChange={(e) => {
                            let args = [];
                            columns.forEach((element) => {
                              args.push({
                                priceName: element.columnName,
                                price:
                                  element.columnName !== column.columnName
                                    ? product[element.columnName]
                                    : e.target.value,
                              });
                            });
                            editAccess && updatePriceByTyping(index, args);
                            targetDiv = editedRefs.current[index];
                            editAccess && showEdited(targetDiv, index);
                          }}
                        />
                      </div>
                    </td>
                  ))}
                  <td>
                    {/* <Fade>
                      <div
                        className={`flex items-center w-1/${tableClassGrid} px-4 invisible`}
                        key={product.id}
                        id={index}
                        style={{ justifyContent: "flex-end" }}
                        ref={(el) => (editedRefs.current[index] = el)}
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
                          onClick={() => {
                            const newArray = [...updatedProducts];
                            newArray[index].price = abiProducts[index].price;
                            setUpdatedProducts(newArray);
                            targetDiv = editedRefs.current[index];
                            showEdited(targetDiv, index);
                          }}
                        />
                      </div>
                    </Fade> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
        
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    priceChange: state.PricingReducer.priceChange,
  };
};

export default connect(mapStateToProps, {
  updatePriceChange,
  updateProducts,
})(PricingComp);
