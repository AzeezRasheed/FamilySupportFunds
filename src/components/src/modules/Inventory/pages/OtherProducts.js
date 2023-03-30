import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import SortImg from "../../../assets/svg/sort.svg";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import arrowBackBox from "../../../assets/svg/arrowBack.svg";
import { Link, useParams, useHistory } from "react-router-dom";
import Dashboard from "../../../Layout/Dashboard";
import {
  getAllProducts,
  getOtherProducts,
} from "../../Admin/Pricing/actions/AdminPricingAction";
import {
  getAllInventory,
  otherProductsToAdd,
  returnEmptiesQuantity,
  setSelectedOtherProducts,
  transferQuantity,
  updateEmptiesQuantity,
  updateExpiredQuantity,
  updateOtherProducts,
  updateTransferQuantity,
} from "../actions/inventoryProductAction";
import { concat, findIndex, pullAt, indexOf } from "lodash";
import { Fade } from "react-reveal";
import { ReactComponent as ArrowEdit } from "../../../assets/svg/edit-arrow.svg";
import { inventoryNet } from "../../../utils/urls";
import { default as ReactSelect } from "react-select";
import { OptionComp } from "../../../components/common/ReactSelect";
import { ReactComponent as NoProduct } from "../../../assets/svg/no-order.svg";
import BeerBox from "../../../assets/svg/beer-box.png";
import { ReactComponent as Delete } from "../../../assets/svg/delete.svg";
import countryConfig from "../../../utils/changesConfig.json";
import { t } from "i18next";

const Other_Products = ({ location }) => {
  const dispatch = useDispatch();
  const { DistCode } = useParams();
  const history = useHistory();
  const skuRefs = useRef([]);
  const typeRefs = useRef([]);
  const ptwRefs = useRef([]);
  // const ptrRefs = useRef([]);
  const qtyRefs = useRef([]);
  const btnRefs = useRef([]);
  const btnNameRefs = useRef([]);
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const country = AuthData?.country;
  // const country = "Zambia"
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [inputField, setInputField] = useState("");
  const [productFiltered, setProductFiltered] = useState([]);
  // const [clickedProducts, setClickedProducts] = useState([]);
  // const [selectedProd, setSelectedProd] = useState({})
  const [render, setRender] = useState(false);
  const [selectedProd, setSelectedProd] = useState("");
  const [productsToAdd, setProductsToAdd] = useState([]);

  const allProducts = useSelector((state) => state.PricingReducer.allProducts);

  const clickedProducts = useSelector(
    (state) => state.InventoryReducer.selected_other_products
  );
  const productsToSave = useSelector(
    (state) => state.InventoryReducer.otherProductsToSave
  );

  let dist_code = useSelector((state) => state.DistReducer.dist_code);
  if (!dist_code) {
    dist_code = DistCode;
  }

  useEffect(() => {
    dispatch(getOtherProducts(country === "South Africa" ? "SA" : country));
  }, []);

  useEffect(() => {
    // dispatch(setSelectedOtherProducts(selectedProducts));
    setRender(false);
  }, [render]);

  useEffect(() => {
    productsToAdd.length > 0
      ? dispatch(updateOtherProducts(true))
      : dispatch(updateOtherProducts(false));
  }, [productsToAdd.length]);

  if (!allProducts) {
    dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }

  // const [newProducts, setNewProducts] = useState({ brand: '', sku: '', imageUrl: ""});
  // const addToObject = setNewProducts({...newProducts, brand: ''})
  const onChange = (typedValue) => {
    const inputValue = typedValue.trim().toLowerCase();
    setInputField(inputValue);
    const filteredProduct = allProducts?.filter((product) =>
      product.brand.toLowerCase().includes(inputValue)
    );
    if (filteredProduct.length > 0) {
      setProductFiltered(filteredProduct);
      setSelectedProd("");
    } else {
      setSelectedProd(typedValue);
      setProductFiltered([]);
    }
  };

  const getProductPrice = async (productID) => {
    try {
      return inventoryNet()
        .get(`product-det/${DistCode}/${productID}`)
        .then((res) => {
          const { data } = res;
          return data.data;
        });
    } catch (err) {}
  };

  const onClick = async (item) => {
    setInputField("");
    // if (product.brand.toLowerCase().includes(inputValue)) {
    //   setProductFiltered(filteredProduct);
    // } else {
    //   setNewProducts({
    //     ...newProducts,
    //     brand: product.brand.toLowerCase(),
    //   });
    // }
    const founded = indexOf(clickedProducts, item);
    // eslint-disable-next-line no-unused-expressions
    if (founded === -1) {
      setRender(true);
      // const price = await getProductPrice(item.id); another way to implement this
      getProductPrice(item.id)
        .then((data) => {
          // selectedProducts.push({ ...item, price: price });
          const newProducts = [...clickedProducts, {item, price: data.price, quantity: data.quantity, sku: data?.sku }];
          dispatch(setSelectedOtherProducts(newProducts));
          //   // setSelectedProducts([...selectedProducts, { ...item, price: price }]);
        })
        .catch((error) => {
          const newProducts = [...clickedProducts, item];
          dispatch(setSelectedOtherProducts(newProducts));
        });
      // selectedProducts.push({ ...item, price: price }); another way to implement this
      // const newItem = { ...item, price: price };

      // setClickedProducts(selectedProducts);

      // console.log(selectedProducts);
    }
    // setSelectedProd(item)
  };

  const check = (index, exist) => {
    if (!exist) {
      if (skuRefs.current[index].value !== "") {
        skuRefs.current[index].style.borderColor = "#DEE0E4";
      }
      if (typeRefs.current[index].value !== "") {
        typeRefs.current[index].style.borderColor = "#DEE0E4";
      }
    }
    if (ptwRefs.current[index].value !== "") {
      ptwRefs.current[index].style.borderColor = "#DEE0E4";
    }
    // if (ptrRefs.current[index].value !== "") {
    //   ptrRefs.current[index].style.borderColor = "#DEE0E4";
    // }
    if (qtyRefs.current[index].value !== "") {
      qtyRefs.current[index].style.borderColor = "#DEE0E4";
    }
    if (
      !exist &&
      skuRefs.current[index].value !== "" &&
      typeRefs.current[index].value !== "" &&
      ptwRefs.current[index].value !== "" &&
      // ptrRefs.current[index].value !== "" &&
      qtyRefs.current[index].value !== ""
    ) {
      // btnNameRefs.current[index] = "Save";
      btnRefs.current[index].style.visibility = "visible";
    }
    if (
      exist &&
      ptwRefs.current[index].value !== "" &&
      // ptrRefs.current[index].value !== "" &&
      qtyRefs.current[index].value !== ""
    ) {
      btnRefs.current[index].style.visibility = "visible";
    }
    btnRefs.current[index].style.opacity = 1;
    btnRefs.current[index].disabled = false;
    // btnNameRefs.current[index].visibility = "hidden";
  };
  useEffect(() => {
    setSelectedProducts(clickedProducts);
  }, [clickedProducts]);

  const removeProduct = (index, sku) => {
    const tempId = sku.id
      ? sku.id
      : sku + skuRefs.current[index].value + typeRefs.current[index].value;
    const ind = findIndex(productsToAdd, { tempId: tempId });
    selectedProducts.splice(index, 1);
    console.log(selectedProducts);

    if (ind >= 0) {
      pullAt(productsToAdd, [ind]);
      dispatch(otherProductsToAdd(productsToAdd));
    }

    setRender(true);
    // onChange(inputField);
  };

  const save = (index, exist, sku) => {
    let itemSaved;
    if (!exist) {
      if (skuRefs.current[index].value === "") {
        skuRefs.current[index].style.borderColor = "#B11F24";
      }
      if (typeRefs.current[index].value === "") {
        typeRefs.current[index].style.borderColor = "#B11F24";
      }
    }
    if (ptwRefs.current[index].value === "") {
      ptwRefs.current[index].style.borderColor = "#B11F24";
    }
    // if (ptrRefs.current[index].value === "") {
    //   ptrRefs.current[index].style.borderColor = "#B11F24";
    // }
    if (qtyRefs.current[index].value === "") {
      qtyRefs.current[index].style.borderColor = "#B11F24";
    }
    if (sku.id) {
      if (
        ptwRefs.current[index].value !== "" &&
        // ptrRefs.current[index].value !== "" &&
        qtyRefs.current[index].value !== ""
      ) {
        itemSaved = {
          productId: sku.id,
          quantity: +qtyRefs.current[index].value,
          productPrice: parseFloat(ptwRefs.current[index].value),
          retailerPrice: 0, //parseFloat(ptrRefs.current[index].value),
          tempId: sku.id,
        };
      }
    } else {
      if (
        skuRefs.current[index].value !== "" &&
        typeRefs.current[index].value !== "" &&
        ptwRefs.current[index].value !== "" &&
        // ptrRefs.current[index].value !== "" &&
        qtyRefs.current[index].value !== ""
      ) {
        itemSaved = {
          brand: sku&&sku?.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
            letter.toUpperCase()
          ),
          quantity: +qtyRefs.current[index].value,
          sku: skuRefs.current[index].value,
          country: country === "South Africa" ? "SA" : country,
          productType: typeRefs.current[index].value.toLowerCase(),
          productPrice: parseFloat(ptwRefs.current[index].value),
          retailerPrice: 0, //parseFloat(ptrRefs.current[index].value),
          tempId:
            sku + skuRefs.current[index].value + typeRefs.current[index].value,
        };
      }
    }

    if (itemSaved) {
      const ind = findIndex(productsToAdd, { tempId: itemSaved.tempId });
      if (ind < 0) {
        productsToAdd.push(itemSaved);
      } else {
        productsToAdd[index] = itemSaved;
      }
      dispatch(otherProductsToAdd(productsToAdd));
      btnRefs.current[index].style.opacity = 0.5;
      btnRefs.current[index].disabled = true;
      // btnNameRefs.current[index].visibility = "visible";
    }
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex">
          <img
            onClick={() => history.goBack()} //push("/dashboard/inventory/" + dist_code)
            className="van-img pr-7"
            src={arrowBackBox}
            alt=""
          />
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            Add Non-ABI Products
          </h2>
        </div>
        <div className="bg-white mt-4 w-full rounded-md">
          <div className="py-5 flex-auto" style={{ paddingTop: 32 }}>
            <div className="flex title-step px-7">
              {/* <p className="title">Select Warehouse</p> */}
              <p className="text-sm desc text-default font-normal">
                Search or type to add a product
              </p>
              {/* <p className="step">Step 3 of 3</p> */}
            </div>
            <div className="stock-cont pt-1 pb-4">
              <div className="flex flex-wrap">
                <div className="w-full">
                  <div className="py-2 flex-auto">
                    <div className="tab-content tab-space">
                      <div className="block">
                        <div className=" px-4 flex">
                          <input
                            className="h-11 py-6 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400"
                            id="searchInput"
                            type="text"
                            name="search"
                            style={{
                              width: "25.0625rem",
                              borderColor: "#BBBDC2",
                              borderWidth: 1,
                            }}
                            // value={
                            //   selectedProd.brand &&
                            //   selectedProd.brand + " " + selectedProd.sku
                            // }
                            placeholder="e.g. Coca Cola 35cl (CAN)"
                            onChange={(ev) => {
                              onChange(ev.target.value);
                              // setSelectedProd(ev.target.value);
                            }}
                          />
                          {selectedProd && (
                            <button
                              className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-10 py-2"
                              style={{
                                backgroundColor:
                                  countryConfig[country].buttonColor,
                                color: countryConfig[country].textColor,
                              }}
                              onClick={() => onClick(selectedProd)}
                            >
                              Add
                            </button>
                          )}
                        </div>
                        {productFiltered.length > 0 && inputField.length ? (
                          <div style={styles.ddcontainer}>
                            {productFiltered.length > 0 &&
                              productFiltered?.map((item, index) => (
                                <div
                                  className="font-customGilroy flex items-center"
                                  key={index}
                                  style={styles.dditem}
                                  onClick={() => onClick(item)}
                                >
                                  <img
                                    className="h-15 w-10 rounded-full flex-shrink"
                                    src={item?.imageUrl}
                                    alt=""
                                  />
                                  {`${item.brand} ${item.sku}`}
                                </div>
                              ))}
                          </div>
                        ) : (
                          ""
                        )}
                        <table className="min-w-full mt-8 divide-y divide-gray-200">
                          <thead className="bg-transparent ">
                            <tr className="">
                              <th
                                scope="col"
                                className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                              >
                                Product
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                              >
                                SKU
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                              >
                                Type
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                              >
                                Price
                              </th>
                              {/* <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                              >
                                PTR
                              </th> */}
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                              >
                                Quantity
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                              >
                                {t("availability")}
                              </th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>

                          <tbody
                            id="ProductsTbody"
                            className="bg-white px-6 divide-y divide-gray-200"
                          >
                            {/* {clickedProducts.length === 0 && (
                              <tr>
                                <td colSpan={8}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                  }}
                                >
                                  <NoProduct />
                                </td>
                              </tr>
                            )} */}
                            {clickedProducts.length > 0 &&
                              clickedProducts&&clickedProducts?.map((sku, index) => (
                                <tr key={index}>
                                  <td className="px-12 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-15 w-10">
                                        <div className="h-15 w-10 rounded-full flex-shrink">
                                          <img
                                            src={
                                              sku.id ? sku?.imageUrl : BeerBox
                                            }
                                            alt=""
                                          />
                                        </div>
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {sku?.id
                                            ? sku&&sku?.brand?.replace(
                                                /(^\w{1})|(\s+\w{1})/g,
                                                (letter) => letter.toUpperCase()
                                              )
                                            : sku&&sku?.replace(
                                                /(^\w{1})|(\s+\w{1})/g,
                                                (letter) => letter.toUpperCase()
                                              )}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  {/* <NoProduct /> */}
                                  <td>
                                    <div className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold">
                                      {sku.id ? (
                                        sku?.sku
                                      ) : (
                                        <input
                                          id={"sku" + index}
                                          className="h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 not-italic text-sm py-1 px-2.5"
                                          placeholder="e.g. 600 ml × 12"
                                          ref={(el) =>
                                            (skuRefs.current[index] = el)
                                          }
                                          onChange={() => {
                                            const exist = sku.id ? true : false;
                                            check(index, exist);
                                          }}
                                        />
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold">
                                      {sku.id ? (
                                        sku.productType
                                      ) : (
                                        <input
                                          className="h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 not-italic text-sm py-1 px-2.5"
                                          placeholder="Can, Full, Pet, RB or NRB"
                                          id={"type" + index}
                                          ref={(el) =>
                                            (typeRefs.current[index] = el)
                                          }
                                          onChange={() => {
                                            const exist = sku.id ? true : false;
                                            check(index, exist);
                                          }}
                                        />
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      defaultValue={sku.price && sku.price}
                                      // key={index}
                                      id={"ptw" + index}
                                      placeholder="0"
                                      className="w-16 h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5"
                                      // value={}
                                      ref={(el) =>
                                        (ptwRefs.current[index] = el)
                                      }
                                      onChange={() => {
                                        const exist = sku.id ? true : false;
                                        const object = {
                                          ...clickedProducts[index],
                                          price: ptwRefs.current[index],
                                        };
                                        clickedProducts[index] = object;
                                        dispatch(
                                          setSelectedOtherProducts(
                                            clickedProducts
                                          )
                                          // setSelectedOtherProducts([
                                          //   ...clickedProducts,
                                          //   {
                                          //     ...clickedProducts[index],
                                          //     price: ptwRefs.current[index],
                                          //   },
                                          // ])
                                        );
                                        check(index, exist);
                                      }}
                                    />
                                  </td>
                                  {/* <td>
                                    <input
                                      key={index}
                                      id={"ptr" + index}
                                      placeholder="0"
                                      className="w-16 h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5"
                                      ref={(el) =>
                                        (ptrRefs.current[index] = el)
                                      }
                                      onChange={() => {
                                        const exist = sku.id ? true : false;
                                        check(index, exist);
                                      }}
                                    />
                                  </td> */}
                                  <td>
                                    <input
                                      key={index}
                                      id={"quantity" + index}
                                      placeholder="0"
                                      className="w-16 h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5"
                                      ref={(el) =>
                                        (qtyRefs.current[index] = el)
                                      }
                                      defaultValue={sku.price && 0}
                                      onChange={() => {
                                        const exist = sku.id ? true : false;
                                        check(index, exist);
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <div className="flex">
                                      <div
                                        className="flex h-10 justify-center px-2  font-normal text-sm"
                                        style={{
                                          width: 150,
                                          background: `${
                                            sku.quantity === null ||
                                            sku.quantity === undefined
                                              ? "#999999": sku.quantity === 0 ?
                                              "red"
                                              :"green"
                                          }`,
                                          borderRadius: "24px",
                                        }}
                                      >
                                        <p
                                          className="pt-3 pl-1 pr-3"
                                          style={{ color: "#fff" }}
                                        >
                                          {`${ sku.quantity > 0 ?
                                              `${sku.quantity} ${t(
                                                  "available"
                                                )}` : 0
                                          }`}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  <td>
                                    <button
                                      className="invisible bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-10 py-2"
                                      style={{
                                        backgroundColor:
                                          countryConfig[country].buttonColor,
                                        color: countryConfig[country].textColor,
                                      }}
                                      ref={(el) =>
                                        (btnRefs.current[index] = el)
                                      }
                                      onClick={() => {
                                        const exist = sku.id ? true : false;
                                        save(index, exist, sku);
                                      }}
                                      // value="Save"
                                    >
                                      Save
                                      {/* <span
                                        className="invisible"
                                        ref={(el) =>
                                          (btnNameRefs.current[index] = el)
                                        }
                                      >
                                        d
                                      </span> */}
                                    </button>
                                  </td>
                                  <td>
                                    <Delete
                                      onClick={() => removeProduct(index, sku)}
                                    />
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

export default Other_Products;

const styles = {
  dditem: {
    fontColor: "#2D2F39",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    padding: "16px 24px 16px 24px",
    borderBottom: "1px solid #DEE0E4",
  },
  ddcontainer: {
    backgroundColor: "#FFFFFF",
    boxShadow:
      "0px 0px 1px rgba(9, 11, 23, 0.15), 0px 8px 24px rgba(9, 11, 23, 0.15)",
    borderRadius: 4,
    // textAlign: "left",
    marginLeft: "2rem",
    width: "300px",
    position: "absolute",
    overflow: "auto",
    height: 300,
  },
};
