import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import warehouse from "../../../assets/svg/warehouse.svg";
import SortImg from "../../../assets/svg/sort.svg";
import {
  getAllInventory,
  getAllProduct,
  getAllProductsDest,
  getAllProductsOrigin,
  presentDist,
  transferQuantity,
  updateTransferQuantity,
} from "../../Inventory/actions/inventoryProductAction";
import { useEffect } from "react";
import { filter, findIndex, pullAt} from "lodash";
import { useTranslation } from "react-i18next";

const Tabs = ({ top, inventoryData, dist }) => {
const {t} = useTranslation()
  let targetElem = "";
  const inputRefs = useRef([]);
  const dispatch = useDispatch()
  const [quantitiesToTransfer, setQuantitiesToTransfer] = useState([])
  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );

  useEffect(() => {
    dispatch(presentDist(dist));
  }, [])
  
  if (!inventoryData?.length) {
    dispatch(getAllInventory(dist));
  }
  if (allInventory?.length) {
    inventoryData = allInventory
  }
  const fromLocation = useSelector((state) => state.DropPointReducer.from_dropPoint);
  const toLocation = useSelector((state) => state.DropPointReducer.to_dropPoint);

  // useEffect(() => {
  //   dispatch(getAllProductsDest(dist, toLocation));
  // }, [toLocation])
  // useEffect(() => {
  //   dispatch(getAllProductsOrigin(dist, fromLocation));
  // }, [fromLocation]);

  const originProducts = useSelector(
    (state) => state.InventoryReducer.all_origin_products
  );
  const destProducts = useSelector(
    (state) => state.InventoryReducer.all_dest_products
  );
  

  const getOriginQuantity = (productId) =>{
    const product = filter(originProducts, { productId: productId })[0];
    const value = product ? product?.quantity : 0;
    return value; 
  }

  const getDestQuantity = (productId) => {
    const product = filter(destProducts, { productId: productId })[0];
    const value = product ? product?.quantity : 0
    return value 
  };

  const handleKeyUp = (targetElem) => {
    if (targetElem) targetElem.focus();
  };

  const save = (productID, quantity, originQuantity) => {
    if (parseInt(quantity) === 0 || quantity > originQuantity){
      quantitiesToTransfer.length > 0
      ? dispatch(updateTransferQuantity(true))
      : dispatch(updateTransferQuantity(false));
      return
    }
    const index = findIndex(quantitiesToTransfer, { productId: productID });
    if (!quantity){
      pullAt(quantitiesToTransfer, [index])
      dispatch(transferQuantity(quantitiesToTransfer))
    }
    else {
      const item = {
        productId: productID,
        quantity: quantity,

      }
      
      if (index < 0) {
        quantitiesToTransfer.push(item)
      }
      else {
        quantitiesToTransfer[index] = item
      }
      dispatch(transferQuantity(quantitiesToTransfer, fromLocation, toLocation));
    }
    quantitiesToTransfer.length > 0
      ? dispatch(updateTransferQuantity(true))
      : dispatch(updateTransferQuantity(false));
  }
  
  


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
                  <div className="flex divide-y divide-gray-200 pl-8 pb-3">
                    <p
                      className="mx-3 mt-1"
                      style={{
                        color: "#2D2F39",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {t("select_products_to_teansfer")}
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
                      // onChange={(e) => onChange(e)}
                      placeholder={t("search_for_anything")}
                    />
                    <div className="flex pt-1">
                      <div
                        className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <p className="text-sm text-default font-normal">
                          {t("select_product(s)")}
                        </p>{" "}
                        <img className="pl-3 pr-2" src={arrowDown} alt="" />
                      </div>
                      <div
                        className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <p className="text-default font-normal">
                          All SKUs
                        </p>{" "}
                        <img className="pl-3 pr-2" src={arrowDown} alt="" />
                      </div>
                      <div className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                        <img className="pr-2" src={SortImg} alt="" />
                        <p className="text-default font-normal">
                          {t("sort_by")}
                        </p>
                      </div>
                    </div>
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
                            ({t("originating_warehouse")})
                          </p>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
                        >
                          <p>
                            {t("quantity_available")}
                            <br />
                            ({t("mobile_warehouse")})
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
                      {inventoryData?.map((sku, index) => (
                        <tr key={index}>
                          <td className="px-12 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-20 w-10">
                                <img
                                  className="h-20 w-10 rounded-full"
                                  src={sku.product.imageUrl}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {sku.product.brand + " " + sku.product.sku}
                                </div>
                                <div className="text-sm my-1 text-gray-500">
                                  {sku.product.productType}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-2">
                            <div
                              className="border-defaut qa font-normal text-sm rounded-md text-center border-1 w-20 h-9"
                              style={{ backgroundColor: "#CD2F34" }}
                            >
                              <p className="qa-text pt-2">
                                {getOriginQuantity(sku.productId)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div
                              className="border-defaut qa bg-blue font-normal text-sm rounded-md text-center border-1 w-20 h-9"
                              style={{ backgroundColor: "#3256D4" }}
                            >
                              <p className="qa-text pt-2">
                                {getDestQuantity(sku.productId)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-2 my-7">
                            <div className="border-defaut bg-red font-normal text-sm rounded-md text-center border-2 w-20 h-8">
                              <input
                                key={index}
                                placeholder="0"
                                id={"input" + index}
                                className="w-16 h-6 rounded border border-gray-300 font-customGilroy font-semibold text-grey-100 text-center not-italic text-sm py-1 px-2.5"
                                style={{ outline: "none", border: "none" }}
                                onChange={(e) => {
                                  const quantity = e.target.value;
                                  
                                  save(sku.productId, quantity, getOriginQuantity(sku.productId));
                                }}
                                onKeyUp={(e) => {
                                  switch (e.key) {
                                    case "ArrowDown":
                                      targetElem =
                                        inputRefs.current[
                                          index === inventoryData.length - 1
                                            ? 0
                                            : index + 1
                                        ];
                                      break;
                                    case "ArrowUp":
                                      targetElem =
                                        inputRefs.current[
                                          index === inventoryData.length + 1
                                            ? 0
                                            : index - 1
                                        ];
                                      break;
                                    default:
                                      return "";
                                  }
                                  handleKeyUp(targetElem);
                                }}
                                ref={(el) => (inputRefs.current[index] = el)}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div
                              style={{ cursor: "pointer" }}
                              className="border-defaut v-add font-normal text-sm rounded-md text-center border-2 w-20 h-9"
                            >
                              <p className="v-add-text pt-1">{t("add")}</p>
                            </div>
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
    </>
  );
};

export default Tabs;
