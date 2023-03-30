/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useMemo, useEffect, useRef } from "react";
import moment from "moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { formatPriceByCountrySymbol } from "../../../utils/formatPrice";
import Loading from "../../../components/common/Loading";
import {
  getAllDistributorCustomers,
  updateCustomerStatus,
  getAllCustomers,
} from "../../Admin/customer/actions/customer";
import { addReportInvoice } from "../../Reports/actions/ReportAction";
import {
  getAllOneOffCustomers,
  addOneOffCustomerAction,
  clearOneOff,
} from "../../Admin/customer/actions/customer";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import {
  updateOrderStatus,
  loadCaptureSales,
  CaptureSales,
  setLoadingToDefault,
} from "../../Admin/order/actions/orderAction";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal, Checked } from "../../../assets/svg/modalIcons";
import Delete from "../../../assets/svg/trash.svg";
import Warning from "../../../assets/svg/warning.svg";
import {
  walkinEmptyAction,
  updateQuantityAfterAction,
  getAllInventory,
} from "../../Inventory/actions/inventoryProductAction";
import html2canvas from "html2canvas";
import { getCatalogueBySellerId } from "../actions/productCatalogue";
import { getSingleDistributor } from "../../Admin/pages/actions/adminDistributorAction";
import { useTranslation } from "react-i18next";
import {
  customerNet,
  createOrderNet,
  reportNet,
  inventoryNet,
} from "../../../utils/urls";
import ConfirmationModal from "../../../components/common/confirmationModal";
import { formatEmptiesQuantity } from "../../../utils/helperFunction";

const WalkInSales = ({
  inventoryData,
  distributorDetails,
  loading,
  clearInvent,
}) => {
  const { t } = useTranslation();
  const [saleLoading, setSaleLoading] = useState(false);
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const sellersCatalogue = useSelector(
    (state) => state.ProductCatalogueReducer.allSellersCatalogue
  );
  const [isDistPrice, setDistPrice] = useState({});
  const ccountry = AuthData?.country;
  // const ccountry = "Zambia";
  const [userCountry, setUserCountry] = useState("Ghana");
  const [thisCustomer, setThisCustomer] = useState();
  const history = useHistory();
  const [dataRows, setDataRows] = useState([]);
  const confirmationToggleState = useState(false);
  const [confirmationToggled, setConfirmationToggled] = confirmationToggleState;
  const [currentDeleteIndex, setCurrentDeleteIndex] = useState(-1);

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);

  let countryCode = "";

  const checkCustomerTypeOneOff = (country) => {
    let customerType = "Poc";
    switch (country) {
      case "Uganda":
        customerType = "Reseller";
        break;
      case "Tanzania":
        customerType = "Stockist";
        break;
      case "Ghana":
        customerType = "Low End";
        break;
      case "Zambia":
        customerType = "Low End";
        break;
      case "Nigeria":
        customerType = customerType;
        break;
      case "South Africa":
        customerType = customerType;
        break;
      case "Mozambique":
        customerType = "Low End";
        break;
      default:
        customerType = customerType;
        break;
    }
    return customerType;
  };

  switch (ccountry) {
    case "Nigeria":
      countryCode = "NG";
      break;
    case "Uganda":
      countryCode = "UG";
      break;
    case "Tanzania":
      countryCode = "TZ";
      break;
    case "Ghana":
      countryCode = "GH";
      break;
    case "Mozambique":
      countryCode = "MZ";
      break;
    case "Zambia":
      countryCode = "ZM";
      break;
    case "South Africa":
      countryCode = "SA";
      break;
    default:
      break;
  }

  const dispatch = useDispatch();
  const [productData, setPoductData] = useState("");

  const [counter, setCounter] = useState({});

  const [search, setSearch] = useState("");
  const [toolTip, setTooltip] = useState(false);
  const [searchOneOff, setSearchOneOff] = useState("");
  const [customerDetails, setCustomer] = useState({
    phoneNumber: "",
    name2: "",
    custType: "",
  });

  const [successModal, setSuccessModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [receipyPayload, setReceiptPayload] = useState([]);
  const [tzPrice, setTzPrice] = useState("");
  const cancelButtonRef = useRef(null);

  const { phoneNumber, name2 } = customerDetails;
  const [open, setOpen] = useState(false);
  const [buyerEmpties, setBuyerEmpties] = useState(null);
  const [actualEmpties, setActualEmpties] = useState(0);
  const [orderItemsState, setOrderItemsState] = useState([]);
  const [totalSaleQty, setTotalSaleQty] = useState(0);
  const [isSaleCaptured, setIsSaleCaptured] = useState(false);
  const [emptyError, setEmptyError] = useState({ 0: false });
  const [emptyInputValue, setEmptyInputValue] = useState({ 0: 0 });
  const [customerType, setCustomerType] = useState("");
  const [VAT, setVAT] = useState(0);
  const [invoiceSubotal, setInvoiceSubTotal] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [productIdToDelete, setProductIdToDelete] = useState("");
  // const [invoiceNumber, setInvoiceNumber] = useState("");

  const [newOrderItem, setNewOrderItem] = useState({
    buyerCompanyId: "",
    routeName: "",
    SFlineID: "",
    buyerName: "",
    buyerType: "",
    priceGroup: "",
    buyerPhoneNumber: "",
    buyerAddress: "",
    buyerStatus: "",
    buyerId: "",
    orderId: "",
  });

  const {
    buyerCompanyId,
    sellerCompanyId,
    routeName,
    orderId,
    buyerName,
    priceGroup,
    buyerType,
    buyerPhoneNumber,
    buyerAddress,
    buyerStatus,
    buyerId,
  } = newOrderItem;

  const {
    all_customers,
    all_dist_customers,
    allOneOffCustomers,
    addOneOffCustomers,
    loadingAddOneOffCustomers,
  } = useSelector((state) => state.CustomerReducer);

  const { invoice } = useSelector((state) => state.InvoiceReducer);

  const { distributor } = useSelector((state) => state.AllDistributorReducer);
  const { captureSalesRes, loadingcaptureSalesRes, reloadinv } = useSelector(
    (state) => state.OrderReducer
  );
  const { updateQuantityAfterSales, loadingQuantityAfterSales } = useSelector(
    (state) => state.InventoryReducer
  );

  const [oneOffDetails, setOneOffDetails] = useState({
    oneOffNumber: "",
    oneOffName: "",
    oneOffPriceGroup: "",
    oneOffType: checkCustomerTypeOneOff(distributor?.country),
    country: distributor?.country,
  });

  const { oneOffNumber, oneOffName, country, oneOffType, oneOffPriceGroup } =
    oneOffDetails;

  useEffect(() => {}, [loadingcaptureSalesRes]);

  useEffect(() => {
    const subT = receipyPayload?.orderItems?.reduce((a, b) => a + b.price, 0);
    const emptiesTotal = receipyPayload?.costOfEmptiesReturned ?? 0;
    let vatCalc =
      ccountry === "South Africa"
        ? 0.15 * subT
        : ccountry === "Zambia"
        ? 0.16 * subT
        : 0;
    setVAT(vatCalc);
    setInvoiceSubTotal(subT);
    receipyPayload && setInvoiceTotal(subT + vatCalc + emptiesTotal);
  }, [receipyPayload, country]);

  const handleBuyerEmpties = (e) => {
    if (e.target.value >= 0) {
      setBuyerEmpties(e.target.value);
    }
  };

  // const handleSingleEmpty = (e, quantity) => {
  //   if (e.target.value > quantity) {
  //     console.log(emptyError);
  //     setEmptyError(true);
  //     // setActualEmpty(e.target.value);
  //   }
  // };

  const removeDuplicates = (inventoryData) => {
    let distinct = new Set();
    for (var i = 0; i < inventoryData.length; i++) {
      if (!distinct.has(inventoryData[i]?.product?.brand)) {
        distinct.add(inventoryData[i]?.product?.brand);
      }
    }
    return Array.from(distinct);
  };

  const displayFilterProductsBasedOnCountry = (inventoryData) => {
    return removeDuplicates(inventoryData).map((product, index) => {
      return (
        <button
          className="text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2 cursor-pointer"
          onClick={(e) => {
            setPoductData(product);
          }}
          key={index}
          style={{
            whiteSpace: "nowrap",
            background: `${
              productData === product
                ? countryConfig[userCountry].buttonColor
                : "white"
            }`,
          }}
        >
          <p
            style={{
              whiteSpace: "nowrap",
              color:
                productData === product && countryConfig[userCountry].textColor,
            }}
            className="text-default font-normal"
          >
            {product}
          </p>{" "}
        </button>
      );
    });
  };

  const countryPriceGroup = (price_group, product) => {
    switch (price_group) {
      case "A":
        return product["A"];
      case "B":
        return product["B"];
      case "C":
        return product["C"];
      case "D":
        return product["D"];
      case "E":
        return product["E"];
      case "F":
        return product["F"];
      case "centre":
        return product["centre"];
      case "north":
        return product["north"];
      case "south":
        return product["south"];
      default:
        return product?.price;
    }
  };

  const fetchPriceByDistributorId = (
    shouldMultiply,
    productId,
    price,
    isSubTotal,
    acc
  ) => {
    if (sellersCatalogue?.data === undefined || !sellersCatalogue) return;
    for (let value of sellersCatalogue?.data) {
      if (value && value?.productId === productId) {
        if (isSubTotal && shouldMultiply) {
          return acc + parseInt(counter[productId] || 0) * value?.price;
        }

        if (shouldMultiply) {
          return parseInt(counter[productId] || 0) * value?.price;
        } else {
          return value?.price;
        }
      }
    }
    return price;
  };

  const priceToCustomer = (
    customerType,
    is_abi,
    productPrice,
    product,
    country,
    priceGroup
  ) => {
    let price;
    switch (customerType) {
      case "Bulkbreaker":
        switch (country) {
          case "Nigeria":
            price = formatPriceByCountrySymbol(ccountry, product?.price);
            break;
          case "South Africa":
            price = formatPriceByCountrySymbol(ccountry, product?.price);
            break;
          default:
            price = formatPriceByCountrySymbol(ccountry, product?.price);
            break;
        }
        break;
      case "Poc":
        switch (country) {
          case "Nigeria":
            price = formatPriceByCountrySymbol(ccountry, product?.poc_price);
            break;
          case "South Africa":
            price = formatPriceByCountrySymbol(ccountry, product?.poc_price);
            break;
          default:
            price = formatPriceByCountrySymbol(ccountry, product?.poc_price);
            break;
        }
        break;
      case "Mainstream":
        switch (country) {
          case "Uganda":
            price = formatPriceByCountrySymbol(
              ccountry,
              product?.main_stream_price
            );
            break;
          case "Tanzania":
            if (is_abi === false) {
              price = formatPriceByCountrySymbol(ccountry, product?.price);
            } else {
              price = formatPriceByCountrySymbol(
                ccountry,
                countryPriceGroup(priceGroup, product)
              );
            }
            break;
          case "Mozambique":
            price = formatPriceByCountrySymbol(
              ccountry,
              countryPriceGroup(priceGroup, product)
            );
            break;
          case "Ghana":
            price = formatPriceByCountrySymbol(ccountry, product?.ptr_price);
            break;
          case "Zambia":
            if (is_abi === false) {
              price = formatPriceByCountrySymbol(ccountry, product?.price);
            } else {
              let productPrices = product?.price;
              price = formatPriceByCountrySymbol(
                ccountry,
                fetchPriceByDistributorId(
                  false,
                  product?.productId,
                  productPrices,
                  false,
                  0
                )
              );
            }
            break;
          default:
            price = formatPriceByCountrySymbol(
              ccountry,
              product?.main_stream_price
            );
            break;
        }
        break;
      case "Reseller":
        switch (country) {
          case "Uganda":
            price = formatPriceByCountrySymbol(
              ccountry,
              product?.reseller_price
            );
            break;
          case "Ghana":
            price = formatPriceByCountrySymbol(ccountry, product?.ptw_price);
            break;
          case "Mozambique":
            price = formatPriceByCountrySymbol(
              ccountry,
              countryPriceGroup(priceGroup, product)
            );
            break;
          default:
            price = formatPriceByCountrySymbol(
              ccountry,
              product?.reseller_price
            );
            break;
        }
        break;
      case "Stockist":
        switch (country) {
          case "Tanzania":
            if (is_abi === false) {
              price = formatPriceByCountrySymbol(ccountry, product?.price);
            } else {
              price = formatPriceByCountrySymbol(
                ccountry,
                countryPriceGroup(priceGroup, product)
              );
            }
            break;
          case "Mozambique":
            price = formatPriceByCountrySymbol(
              ccountry,
              countryPriceGroup(priceGroup, product)
            );
            break;
          default:
            price = formatPriceByCountrySymbol(ccountry, product?.price);
            break;
        }
        break;
      case "High End":
        switch (country) {
          case "Uganda":
            price = formatPriceByCountrySymbol(
              ccountry,
              product?.high_end_price
            );
            break;
          case "Tanzania":
            if (is_abi === false) {
              price = formatPriceByCountrySymbol(ccountry, product?.price);
            } else {
              price = formatPriceByCountrySymbol(
                ccountry,
                countryPriceGroup(priceGroup, product)
              );
            }
            break;
          case "Mozambique":
            price = formatPriceByCountrySymbol(
              ccountry,
              countryPriceGroup(priceGroup, product)
            );
            break;
          case "Ghana":
            price = formatPriceByCountrySymbol(ccountry, product?.ptr_price);
            break;
          case "Zambia":
            if (is_abi === false) {
              price = formatPriceByCountrySymbol(ccountry, product?.price);
            } else {
              let productPrices = product?.price;
              price = formatPriceByCountrySymbol(
                ccountry,
                fetchPriceByDistributorId(
                  false,
                  product?.productId,
                  productPrices,
                  false,
                  0
                )
              );
            }
            break;
          default:
            price = formatPriceByCountrySymbol(ccountry, product?.price);
            break;
        }
        break;
      case "Low End":
        switch (country) {
          case "Uganda":
            price = formatPriceByCountrySymbol(
              ccountry,
              product?.low_end_price
            );
            break;
          case "Tanzania":
            if (is_abi === false) {
              price = formatPriceByCountrySymbol(ccountry, product?.price);
            } else {
              price = formatPriceByCountrySymbol(
                ccountry,
                countryPriceGroup(priceGroup, product)
              );
            }
            break;
          case "Mozambique":
            price = formatPriceByCountrySymbol(
              ccountry,
              countryPriceGroup(priceGroup, product)
            );
            break;
          case "Ghana":
            price = formatPriceByCountrySymbol(ccountry, product?.ptr_price);
            break;
          case "Zambia":
            if (is_abi === false) {
              price = formatPriceByCountrySymbol(ccountry, product?.price);
            } else {
              let productPrices = product?.price;
              price = formatPriceByCountrySymbol(
                ccountry,
                fetchPriceByDistributorId(
                  false,
                  product?.productId,
                  productPrices,
                  false,
                  0
                )
              );
            }
            break;
          default:
            price = formatPriceByCountrySymbol(ccountry, product?.price);
            break;
        }
        break;
      default:
        switch (country) {
          case "Nigeria":
            price = formatPriceByCountrySymbol(ccountry, product?.price);
            break;
          case "Uganda":
            price = formatPriceByCountrySymbol(
              ccountry,
              product?.reseller_price
            );
            break;
          case "Ghana":
            price = formatPriceByCountrySymbol(ccountry, product?.ptr_price);
            break;
          case "Tanzania":
            if (is_abi === false) {
              price = formatPriceByCountrySymbol(ccountry, product?.price);
            } else {
              price = formatPriceByCountrySymbol(
                ccountry,
                countryPriceGroup(priceGroup, product)
              );
            }
            break;
          case "Zambia":
            if (is_abi === false) {
              price = formatPriceByCountrySymbol(ccountry, product?.price);
            } else {
              let productPrices = product?.price;
              price = formatPriceByCountrySymbol(
                ccountry,
                fetchPriceByDistributorId(
                  false,
                  product?.productId,
                  productPrices,
                  false,
                  0
                )
              );
            }
            break;
          case "Mozambique":
            price = formatPriceByCountrySymbol(ccountry, product["centre"]);
            break;
          case "South Africa":
            price = formatPriceByCountrySymbol(ccountry, product?.poc_price);
            break;
          default:
            price = formatPriceByCountrySymbol(ccountry, product?.price);
            break;
        }
        break;
    }
    return price;
  };

  const subTotal = useMemo(
    () =>
      inventoryData.reduce((acc, item) => {
        let sum;
        switch (customerType) {
          case "Bulkbreaker":
            switch (ccountry) {
              case "Nigeria":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.price;
                break;
              case "South Africa":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.price;
                break;
              default:
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.price;
                break;
            }
            break;
          case "Poc":
            switch (ccountry) {
              case "Nigeria":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.poc_price;
                break;
              case "South Africa":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product.poc_price;
                break;
              default:
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.poc_price;

                break;
            }
            break;
          case "Mainstream":
            switch (ccountry) {
              case "Uganda":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.main_stream_price;
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      countryPriceGroup(priceGroup, item?.product);
                }
                break;
              case "Mozambique":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    countryPriceGroup(priceGroup, item?.product);
                break;
              case "Ghana":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.ptr_price;
                break;
              case "Zambia":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.price;
                } else {
                  let productPrice =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                  sum = fetchPriceByDistributorId(
                    true,
                    item?.product?.productId,
                    productPrice,
                    true,
                    acc
                  );
                }
                break;
              default:
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.main_stream_price;
                }
                break;
            }
            break;
          case "Reseller":
            switch (ccountry) {
              case "Uganda":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.reseller_price;
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      countryPriceGroup(priceGroup, item?.product);
                }
                break;
              case "Mozambique":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    countryPriceGroup(priceGroup, item?.product);
                break;
              case "Ghana":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.ptw_price;
                break;
              default:
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.reseller_price;
                }
                break;
            }
            break;
          case "Stockist":
            switch (ccountry) {
              case "Tanzania":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      countryPriceGroup(priceGroup, item?.product);
                }
                break;
              case "Mozambique":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    countryPriceGroup(priceGroup, item?.product);
                break;
              default:
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      countryPriceGroup(priceGroup, item?.product);
                }
                break;
            }
            break;
          case "High End":
            switch (ccountry) {
              case "Uganda":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.high_end_price;
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      countryPriceGroup(priceGroup, item?.product);
                }
                break;
              case "Mozambique":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    countryPriceGroup(priceGroup, item?.product);
                break;
              case "Ghana":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.ptr_price;
                break;
              case "Zambia":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.price;
                } else {
                  let productPrice =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                  sum = fetchPriceByDistributorId(
                    true,
                    item?.product?.productId,
                    productPrice,
                    true,
                    acc
                  );
                }
                break;
              default:
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.high_end_price;
                }
                break;
            }
            break;
          case "Low End":
            switch (ccountry) {
              case "Uganda":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.low_end_price;
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      countryPriceGroup(priceGroup, item?.product);
                }
                break;
              case "Mozambique":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    countryPriceGroup(priceGroup, item?.product);
                break;
              case "Ghana":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.ptr_price;
                break;
              case "Zambia":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.price;
                } else {
                  let productPrice =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                  sum = fetchPriceByDistributorId(
                    true,
                    item?.product?.productId,
                    productPrice,
                    true,
                    acc
                  );
                }
                break;
              default:
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.low_end_price;
                }
            }
            break;
          default:
            switch (country) {
              case "Nigeria":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.price;
                break;
              case "South Africa":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product.poc_price;
                break;
              case "Uganda":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.reseller_price;
                break;
              case "Ghana":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.ptr_price;
                break;
              case "Zambia":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  let productPrice =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                  sum = fetchPriceByDistributorId(
                    true,
                    item?.product?.productId,
                    productPrice,
                    true,
                    acc
                  );
                }
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      countryPriceGroup(priceGroup, item?.product);
                }
                break;
              case "Mozambique":
                sum =
                  acc +
                  parseInt(counter[item?.product?.productId] || 0) *
                    item?.product?.price;
                break;
              default:
                if (item?.is_abi === false) {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                } else {
                  sum =
                    acc +
                    parseInt(counter[item?.product?.productId] || 0) *
                      item?.product?.price;
                }
                break;
            }
            break;
        }

        return sum;
      }, 0),
    [counter, customerType]
  );

  const subTotalExtended = useMemo(() => {
    const priceList = dataRows.map((item) => item.price * item.quantity);
    return priceList.length
      ? priceList.reduce((accum, next) => accum + next, 0)
      : 0;
  }, [counter, dataRows]);

  const sumAmount = (
    customerType,
    is_abi,
    price,
    productId,
    product,
    priceGroup
  ) => {
    let sum;
    switch (customerType) {
      case "Bulkbreaker":
        switch (ccountry) {
          case "Nigeria":
            sum = parseInt(counter[productId] || 0) * product?.price;
            break;
          case "South Africa":
            sum = parseInt(counter[productId] || 0) * product?.price;
            break;
          default:
            sum = parseInt(counter[productId] || 0) * product?.price;
            break;
        }
        break;
      case "Poc":
        switch (ccountry) {
          case "Nigeria":
            sum = parseInt(counter[productId] || 0) * product?.poc_price;
            break;
          case "South Africa":
            sum = parseInt(counter[productId] || 0) * product.poc_price;
            break;
          default:
            sum = parseInt(counter[productId] || 0) * product?.poc_price;

            break;
        }
        break;
      case "Mainstream":
        switch (ccountry) {
          case "Uganda":
            sum =
              parseInt(counter[productId] || 0) * product?.main_stream_price;
            break;
          case "Tanzania":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * product?.price;
            } else {
              sum =
                parseInt(counter[productId] || 0) *
                countryPriceGroup(priceGroup, product);
            }
            break;
          case "Mozambique":
            sum =
              parseInt(counter[productId] || 0) *
              countryPriceGroup(priceGroup, product);
            break;
          case "Ghana":
            sum = parseInt(counter[productId] || 0) * product?.ptr_price;
            break;
          case "Zambia":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * price;
            } else {
              let productPrice =
                parseInt(counter[productId] || 0) * product?.price;
              sum = fetchPriceByDistributorId(
                true,
                productId,
                productPrice,
                false,
                0
              );
            }
            break;
          default:
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * product?.price;
            } else {
              sum =
                parseInt(counter[productId] || 0) * product?.main_stream_price;
            }
            break;
        }
        break;
      case "Reseller":
        switch (ccountry) {
          case "Uganda":
            sum = parseInt(counter[productId] || 0) * product?.reseller_price;
            break;
          case "Ghana":
            sum = parseInt(counter[productId] || 0) * product?.ptw_price;
            break;
          case "Tanzania":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * price;
            } else {
              sum =
                parseInt(counter[productId] || 0) *
                countryPriceGroup(priceGroup, product);
            }
            break;
          case "Mozambique":
            sum =
              parseInt(counter[productId] || 0) *
              countryPriceGroup(priceGroup, product);
            break;
          default:
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * product?.price;
            } else {
              sum = parseInt(counter[productId] || 0) * product?.reseller_price;
            }
            break;
        }
        break;
      case "Stockist":
        switch (ccountry) {
          case "Tanzania":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * product?.price;
            } else {
              sum =
                parseInt(counter[productId] || 0) *
                countryPriceGroup(priceGroup, product);
            }
            break;
          case "Mozambique":
            sum =
              parseInt(counter[productId] || 0) *
              countryPriceGroup(priceGroup, product);
            break;
          default:
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * product?.price;
            } else {
              sum = parseInt(counter[productId] || 0) * product?.reseller_price;
            }
            break;
        }
        break;
      case "High End":
        switch (ccountry) {
          case "Uganda":
            sum = parseInt(counter[productId] || 0) * product?.high_end_price;
            break;
          case "Tanzania":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * price;
            } else {
              sum =
                parseInt(counter[productId] || 0) *
                countryPriceGroup(priceGroup, product);
            }
            break;
          case "Mozambique":
            sum =
              parseInt(counter[productId] || 0) *
              countryPriceGroup(priceGroup, product);
            break;
          case "Ghana":
            sum = parseInt(counter[productId] || 0) * product?.ptr_price;
            break;
          case "Zambia":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * price;
            } else {
              let productPrice =
                parseInt(counter[productId] || 0) * product?.price;
              sum = fetchPriceByDistributorId(
                true,
                productId,
                productPrice,
                false,
                0
              );
            }
            break;
          default:
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * product?.price;
            } else {
              sum = parseInt(counter[productId] || 0) * product?.high_end_price;
            }
            break;
        }
        break;
      case "Low End":
        switch (ccountry) {
          case "Uganda":
            sum = parseInt(counter[productId] || 0) * product?.low_end_price;
            break;
          case "Tanzania":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * product?.price;
            } else {
              sum =
                parseInt(counter[productId] || 0) *
                countryPriceGroup(priceGroup, product);
            }
            break;
          case "Mozambique":
            sum =
              parseInt(counter[productId] || 0) *
              countryPriceGroup(priceGroup, product);
            break;
          case "Ghana":
            sum = parseInt(counter[productId] || 0) * product?.ptr_price;
            break;
          case "Zambia":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * price;
            } else {
              let productPrice =
                parseInt(counter[productId] || 0) * product?.price;
              sum = fetchPriceByDistributorId(
                true,
                productId,
                productPrice,
                false,
                0
              );
            }
            break;
          default:
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * product?.price;
            } else {
              sum = parseInt(counter[productId] || 0) * product?.low_end_price;
            }
            break;
        }
        break;
      default:
        switch (country) {
          case "Nigeria":
            sum = parseInt(counter[productId] || 0) * product?.price;
            break;
          case "South Africa":
            sum = parseInt(counter[productId] || 0) * product.poc_price;
            break;
          case "Uganda":
            sum = parseInt(counter[productId] || 0) * product?.reseller_price;
            break;
          case "Ghana":
            sum = parseInt(counter[productId] || 0) * product?.ptr_price;
            break;
          case "Zambia":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * price;
            } else {
              let productPrice =
                parseInt(counter[productId] || 0) * product?.price;
              sum = fetchPriceByDistributorId(
                true,
                productId,
                productPrice,
                false,
                0
              );
            }
            break;
          case "Tanzania":
            if (is_abi === false) {
              sum = parseInt(counter[productId] || 0) * product?.price;
            } else {
              sum = parseInt(counter[productId] || 0) * product?.A;
            }
            break;
          case "Mozambique":
            sum = parseInt(counter[productId] || 0) * product?.price;
            break;
          default:
            sum = parseInt(counter[productId] || 0) * product?.price;
            break;
        }
        break;
    }
    return sum;
  };

  const totalEmptiesPrice = useMemo(() => {
    const emptiesPriceList = dataRows.map(
      (item) => item?.products?.empty_price || 0
    );
    const emptiesPriceTotal = emptiesPriceList.length
      ? emptiesPriceList.reduce((prev, next) => prev + next, 0)
      : 0;
    const totalemp = Number(actualEmpties) * emptiesPriceTotal;
    return totalemp;
  }, [actualEmpties, dataRows]);

  function validateLatLng(lat, lng) {
    let pattern = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}");

    return pattern.test(lat) && pattern.test(lng);
  }

  const [showCapture, setshowCapture] = useState(false);

  useEffect(() => {
    if (
      buyerCompanyId &&
      routeName &&
      buyerName &&
      buyerPhoneNumber &&
      (buyerAddress ? buyerAddress : ccountry) &&
      Number(subTotal) > 0
    ) {
      setshowCapture(true);
    } else {
      setshowCapture(false);
    }
  }, [
    buyerCompanyId,
    routeName,
    buyerName,
    buyerPhoneNumber,
    buyerAddress,
    subTotal,
    ccountry,
  ]);

  useEffect(() => {
    // console.log(distributor, 'distributor');
    getSingleDistributor();
    dispatch(getAllDistributorCustomers(distributor?.SYS_Code));
    dispatch(getAllCustomers(country));
    dispatch(getAllOneOffCustomers(ccountry));
    dispatch(getCatalogueBySellerId(distributor?.DIST_Code));
  }, [distributor?.SYS_Code, distributor?.DIST_Code, country, ccountry]);

  useEffect(() => {
    if (captureSalesRes?.isSuccess) {
      setCounter({});
      setNewOrderItem({
        ...newOrderItem,
        buyerId: "",
        buyerCompanyId: "",
        routeName: "",
        buyerName: "",
        priceGroup: "",
        buyerPhoneNumber: "",
        buyerAddress: "",
        buyerStatus: "",
        orderId: captureSalesRes?.data?.orderId,
      });
      setCustomer({ ...customerDetails, phoneNumber: "", name2: "" });
      setBuyerEmpties(0);
      setActualEmpties(0);
    }
  }, [captureSalesRes]);

  useEffect(() => {
    if (addOneOffCustomers?.success) {
      setOneOffDetails({
        ...oneOffDetails,
        oneOffNumber: "",
        oneOffName: "",
        oneOffPriceGroup: "",
        oneOffType: checkCustomerTypeOneOff(distributor?.country),
        country: distributor?.country,
      });
      setSearchOneOff("");

      setTimeout(() => {
        dispatch(clearOneOff());
      }, 3000);
    }

    // eslint-disable-next-line
  }, [addOneOffCustomers?.success, country]);

  useEffect(() => {
    if (addOneOffCustomers) dispatch(getAllOneOffCustomers(ccountry));
  }, [addOneOffCustomers, country]);
  // const {} = useSelector(state => state.CustomerReducer?.all_customers)

  function capitalizeFirstLetter(string) {
    return string && string.toLowerCase();
  }

  const sortOrder = inventoryData.filter((data) => {
    return data?.product?.brand
      .toLowerCase()
      .startsWith(`${productData.toLowerCase()}`);
  });

  const getCustomerData = (country) => {
    let customerData = all_customers;
    switch (country) {
      case "Nigeria":
        customerData = customerData;
        break;
      case "Uganda":
        customerData = all_dist_customers;
        break;
      case "Tanzania":
        customerData = all_dist_customers;
        break;
      case "Ghana":
        customerData = all_dist_customers;
        break;
      case "Mozambique":
        customerData = all_dist_customers;
        break;
      case "Zambia":
        customerData = all_dist_customers;
        break;
      case "South Africa":
        customerData = all_dist_customers;
        break;
      default:
        customerData = customerData;
        break;
    }
    return customerData;
  };

  const lowercasedSearchFilter = search.toLowerCase();
  const miniAdmin = AuthData.roles === "Mini-Admin";
  const sortCustomer = getCustomerData(ccountry).filter((item) => {
    return Object.keys(item).some(
      (key) =>
        (item[key] !== null &&
          item[key] !== undefined &&
          item[key]
            .toString()
            .toLowerCase()
            .includes(lowercasedSearchFilter)) ||
        !lowercasedSearchFilter
    );
  });

  const lowercasedFilter = searchOneOff.toLowerCase();

  const sortOneOffCustomer =
    allOneOffCustomers === null
      ? []
      : allOneOffCustomers.filter((item) => {
          return Object.keys(item).some(
            (key) =>
              item[key] &&
              item[key].toString().toLowerCase().includes(lowercasedFilter)
          );
        });

  const incrementCounter = (productId, stock) => {
    const quantity = parseInt(counter[productId] ?? 0) + 1;
    if (quantity <= stock) {
      setCounter({ ...counter, [productId]: quantity });
      setTooltip(true);
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
    if (quantity === Number(stock)) {
      // setCounter({ ...counter, [productId]: quantity })
      setTooltip(true);
    }
  };

  const onChangeOneOffNumber = (e) => {
    setOneOffDetails({ ...oneOffDetails, oneOffNumber: e.target.value });
    setSearchOneOff(e.target.value);
  };
  const onChangeOneOffName = (e) => {
    setOneOffDetails({ ...oneOffDetails, oneOffName: e.target.value });
    setSearchOneOff(e.target.value);
  };

  const setDetails = (
    id,
    phone,
    name,
    type,
    priceGroup,
    buyerCompanyId,
    routeName,
    buyerAddress,
    status
  ) => {
    setNewOrderItem({
      ...newOrderItem,
      buyerId: id,
      buyerCompanyId: buyerCompanyId,
      routeName: routeName,
      buyerName: name,
      buyerType: type,
      priceGroup: priceGroup,
      buyerStatus: status,
      buyerPhoneNumber: phone,
      orderId: captureSalesRes?.data?.orderId,
      buyerAddress: buyerAddress ? buyerAddress : ccountry,
    });
    setCustomerType(type);
    setCustomer({
      ...customerDetails,
      phoneNumber: phone,
      name2: name,
      custType: type,
    });
    setSearch("");
  };

  const addOneOffDetails = (
    phone,
    name,
    type,
    buyerCompanyId,
    priceGroup,
    routeName
  ) => {
    setNewOrderItem({
      ...newOrderItem,
      buyerCompanyId: buyerCompanyId,
      routeName: routeName,
      buyerName: name,
      priceGroup: priceGroup,
      buyerType: type,
      buyerPhoneNumber: phone,
      buyerStatus: "",
      // orderId: captureSalesRes?.data?.orderId,
      buyerAddress: distributor?.country,
    });
    setOneOffDetails({
      ...oneOffDetails,
      oneOffNumber: phone,
      oneOffName: name,
      oneOffType: type,
      oneOffPriceGroup: priceGroup,
      country: distributor?.country,
    });
    setSearchOneOff("");
  };
  const resetOneOff = () => {
    setOneOffDetails({
      ...oneOffDetails,
      oneOffNumber: "",
      oneOffName: "",
      oneOffType: checkCustomerTypeOneOff(distributor?.country),
      country: distributor?.country,
    });
    setSearchOneOff("");
    setshowCapture(false);
  };

  const reset = () => {
    setCustomer({ ...customerDetails, phoneNumber: "", name2: "" });
    setSearch("");
    setshowCapture(false);
  };

  const resetNewCustomer = () => {
    setCustomer({ ...customerDetails, phoneNumber: "", name2: "" });
    setSearch("");
    setOpen(!open);
  };

  const OnsubmitAddOneOff = () => {
    dispatch(
      addOneOffCustomerAction(oneOffName, oneOffNumber, distributor?.country)
    );
  };

  useEffect(() => {
    const itemSummaryIds = Object.keys(counter);
    const itemSummary = inventoryData
      .filter(
        ({ productId, product }) =>
          counter[product?.productId] &&
          itemSummaryIds.includes(product?.productId.toString())
      )
      .map((item) => {
        const product = dataRows.find((data) => data?.products?.productId === item?.product?.productId)
        return {
          unreturnedEmpties: product ? product.unreturnedEmpties : counter[item?.product?.productId],
          is_abi: item?.is_abi,
          products: item.product,
          price: item?.is_abi ? item?.product?.price : item?.price,
          quantity: counter[item?.product?.productId],
          productId: item?.productId,
          emptiesQuantity: product ? product?.emptiesQuantity : 0,
          // total: subTotal,
        };
      });
    setDataRows([...itemSummary]);
  }, [inventoryData, counter]);

  const handleDelete = (i, productId) => {
    setCounter({ ...counter, [productId]: 0 })
    setDataRows((initState) => {
      return [...(initState.filter((_, index) => i !== index) || [])];
    });
    setConfirmationToggled(false);
    setProductIdToDelete("");
  };

  const handleActualEmpties = (e, quantity, i) => {
    // setDataRow
    let inputValue = e.target.value;
    if (inputValue > quantity || inputValue < 0) {
      setEmptyError({ ...emptyError, [i]: true });
      setEmptyInputValue({ ...emptyInputValue, [i]: quantity });
      inputValue = quantity;
    } else {
      setEmptyError({ ...emptyError, [i]: false });
      setEmptyInputValue({ ...emptyInputValue, [i]: inputValue });
    }

    setDataRows((initState) => {
      return [
        ...initState.map((item, index) => {
          if (index === i) {
            return {
              ...item,
              unreturnedEmpties: item.quantity - +inputValue,
              emptiesQuantity: +inputValue,
            };
          }
          return item;
        }),
      ];
    });
  };

  useEffect(() => {
    const itemsToRemove = ['can', 'pet', 'nrb'];
    if(!dataRows.length) return
    const allQuantities = dataRows.filter((item)  => 
      !itemsToRemove.includes(item?.products?.productType.toLowerCase()))
      .map((item)  => 
        item.quantity - (item.emptiesQuantity || 0)
      );
    const allProductQuantities = dataRows.map((item) => item.quantity || 0);
    const totalQuantity = allQuantities.reduce(
      (next, current) => current + next, 0
    );
    const totalProductQuantity = allProductQuantities.reduce(
      (next, current) => current + next, 0
    );
    setActualEmpties(totalQuantity);
    setTotalSaleQty(totalProductQuantity);
  }, [dataRows]);

  const downloadInvoice = () => {
    // html2canvas
    html2canvas(document.getElementById("receipt")).then((canvas) => {
      document
        .getElementById("downloader")
        .setAttribute("href", canvas.toDataURL());
      setTimeout(() => {
        document.getElementById("downloader").click();
      }, 500);
    });
    // setShowReceipt(false)
  };

  const updateToCompleted = (orderId) => {
    const value = {
      status: "Completed",
    };
    dispatch(updateOrderStatus(orderId, value));
    setSuccessModal(false);
    // window.location.reload()
    setTimeout(() => {
      setShowReceipt(true);
    }, 1000);
  };

  const updateToPlaced = (orderId) => {
    setSuccessModal(false);
    setTimeout(() => {
      window.location.pathname = `/dashboard/orders-list/${distributor?.DIST_Code}`;
    }, 1000);
  };

  const onSubmit = async (price_group) => {
    // debugger
    setSaleLoading(true);
    const selectedProductIds = Object.keys(counter);
    const orderItems = inventoryData
      .filter(
        ({ productId, product }) =>
          counter[product?.productId] &&
          selectedProductIds.includes(product?.productId.toString())
      )
      .map((item) => {
        let price;
        switch (buyerType) {
          case "Bulkbreaker":
            switch (ccountry) {
              case "Nigeria":
                price =
                  item?.product?.price * counter[item?.product?.productId];
                break;
              default:
                break;
            }
            break;
          case "Poc":
            switch (ccountry) {
              case "Nigeria":
                price =
                  item?.product?.price * counter[item?.product?.productId];
                break;
              case "South Africa":
                price =
                  item?.product?.poc_price * counter[item?.product?.productId];
                break;
              default:
                break;
            }
            break;
          case "Mainstream":
            switch (ccountry) {
              case "Uganda":
                price =
                  item?.product?.main_stream_price *
                  counter[item?.product?.productId];
                break;
              case "Ghana":
                price =
                  item?.product?.ptr_price * counter[item?.product?.productId];
                break;
              case "Zambia":
                if (item?.is_abi === false) {
                  price = item?.price * counter[item?.product?.productId];
                } else {
                  let productPrice =
                    item?.product?.price * counter[item?.product?.productId];
                  price = fetchPriceByDistributorId(
                    true,
                    item?.product?.productId,
                    productPrice,
                    false,
                    0
                  );
                }
                break;
              case "Mozambique":
                price =
                  countryPriceGroup(price_group, item?.product) *
                  counter[item?.product?.productId];
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  price =
                    item?.product?.price * counter[item?.product?.productId];
                } else {
                  price =
                    countryPriceGroup(price_group, item?.product) *
                    counter[item?.product?.productId];
                }
                break;
              default:
                price =
                  item?.product?.price * counter[item?.product?.productId];
                break;
            }
            break;
          case "Reseller":
            switch (ccountry) {
              case "Uganda":
                price =
                  item?.product?.reseller_price *
                  counter[item?.product?.productId];
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  price =
                    item?.product?.price * counter[item?.product?.productId];
                } else {
                  price =
                    countryPriceGroup(price_group, item?.product) *
                    counter[item?.product?.productId];
                }
                break;
              case "Ghana":
                price =
                  item?.product?.ptw_price * counter[item?.product?.productId];
                break;
              default:
                if (item?.is_abi === false) {
                  price =
                    item?.product?.price * counter[item?.product?.productId];
                } else {
                  price =
                    item?.product?.price * counter[item?.product?.productId];
                }
                break;
            }
            break;
          case "Stockist":
            switch (ccountry) {
              case "Tanzania":
                if (item?.is_abi === false) {
                  price =
                    item?.product?.price * counter[item?.product?.productId];
                } else {
                  price =
                    countryPriceGroup(price_group, item?.product) *
                    counter[item?.product?.productId];
                }
                break;
              default:
                price =
                  item?.product?.price * counter[item?.product?.productId];
                break;
            }
            break;
          case "High End":
            switch (ccountry) {
              case "Uganda":
                price =
                  item?.product?.high_end_price *
                  counter[item?.product?.productId];
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  price =
                    item?.product?.price * counter[item?.product?.productId];
                } else {
                  price =
                    countryPriceGroup(price_group, item?.product) *
                    counter[item?.product?.productId];
                }
                break;
              case "Mozambique":
                price =
                  countryPriceGroup(price_group, item?.product) *
                  counter[item?.product?.productId];
                break;
              case "Ghana":
                price =
                  item?.product?.ptr_price * counter[item?.product?.productId];
                break;
              case "Zambia":
                if (item?.is_abi === false) {
                  price = item?.price * counter[item?.product?.productId];
                } else {
                  let productPrice =
                    item?.product?.price * counter[item?.product?.productId];
                  price = fetchPriceByDistributorId(
                    true,
                    item?.product?.productId,
                    productPrice,
                    false,
                    0
                  );
                }
                break;
              default:
                price =
                  item?.product?.price * counter[item?.product?.productId];
                break;
            }
            break;
          case "Low End":
            switch (ccountry) {
              case "Uganda":
                price =
                  item?.product?.low_end_price *
                  counter[item?.product?.productId];
                break;
              case "Mozambique":
                price =
                  countryPriceGroup(price_group, item?.product) *
                  counter[item?.product?.productId];
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  price =
                    item?.product?.price * counter[item?.product?.productId];
                } else {
                  price =
                    countryPriceGroup(price_group, item?.product) *
                    counter[item?.product?.productId];
                }
                break;
              case "Ghana":
                price =
                  item?.product?.ptr_price * counter[item?.product?.productId];
                break;
              case "Zambia":
                if (item?.is_abi === false) {
                  price = item?.price * counter[item?.product?.productId];
                } else {
                  let productPrice =
                    item?.product?.price * counter[item?.product?.productId];
                  price = fetchPriceByDistributorId(
                    true,
                    item?.product?.productId,
                    productPrice,
                    false,
                    0
                  );
                }
                break;
              default:
                price =
                  item?.product?.price * counter[item?.product?.productId];
                break;
            }
            break;
          default:
            switch (country) {
              case "Nigeria":
                price =
                  item?.product?.price * counter[item?.product?.productId];
                break;
              case "Uganda":
                price =
                  item?.product?.reseller_price *
                  counter[item?.product?.productId];
                break;
              case "Tanzania":
                if (item?.is_abi === false) {
                  price =
                    item?.product?.price * counter[item?.product?.productId];
                } else {
                  price =
                    countryPriceGroup(price_group, item?.product) *
                    counter[item?.product?.productId];
                }
                break;
              case "Mozambique":
                price =
                  item?.product["centre"] * counter[item?.product?.productId];
                break;
              case "Ghana":
                price =
                  item?.product?.ptr_price * counter[item?.product?.productId];
                break;
              case "Zambia":
                if (item?.is_abi === false) {
                  price = item?.price * counter[item?.product?.productId];
                } else {
                  let productPrice =
                    item?.product?.price * counter[item?.product?.productId];
                  price = fetchPriceByDistributorId(
                    true,
                    item?.product?.productId,
                    productPrice,
                    false,
                    0
                  );
                }
                break;
              default:
                price =
                  item?.product?.price * counter[item?.product?.productId];
                break;
            }
            break;
        }
        return {
          productId: item.product?.productId,
          price: price,
          quantity: counter[item?.product?.productId],
          name: item?.product?.brand + " " + item?.product?.sku,
          inventoryProductId: item?.productId,
        };
      });

    const payload = {
      buyerCompanyId: buyerCompanyId.toString(),
      sellerCompanyId: distributor?.SYS_Code,
      emptiesReturned: Number(actualEmpties),
      costOfEmptiesReturned: Number(totalEmptiesPrice),
      // orderId: captureSalesRes?.data?.orderId,
      routeName: routeName,
      // "One-Off",
      referenceId: routeName,
      datePlaced: new Date(Date.now()),
      // datePlaced: Date.now().toDateString(),
      shipToCode: buyerCompanyId,
      // billToCode: '',
      sysproCode: distributor?.SYS_Code,
      salesforceCode: distributor?.SF_Code,
      country: countryCode,
      buyerDetails: {
        buyerName: buyerName,
        buyerPhoneNumber: buyerPhoneNumber,
        buyerAddress: buyerAddress ? buyerAddress : ccountry,
      },
      orderItems,
    };

    if (Object.keys(payload).length > 0 && payload?.buyerCompanyId !== "") {
      const customerApi = customerNet();
      customerApi
        .post(`customer/salesforce/${payload.buyerCompanyId}`, {
          country: ccountry,
        })
        .then((response) => {
          const { result } = response.data;
          setThisCustomer(result[0]);
        });
      // https://dmsprd20.azure-api.net/customer/customer/salesforce/0000695795
    }

    const newItemAfterSales = orderItems.map((elem) => {
      return {
        productId: elem.inventoryProductId,
        quantity: elem.quantity,
      };
    });

    const afterSalesPayload = {
      sellerCompanyId: distributor?.DIST_Code,
      orderItems: newItemAfterSales,
    };
    dispatch(loadCaptureSales());
    // axios.defaults.headers["Authorization"] = `Bearer ${process.env.REACT_APP_ORDER_TOKEN}`
    const orderApi = createOrderNet();
    const captureSalesRes = await orderApi.post("", payload);
    dispatch(CaptureSales(captureSalesRes.data));
    if (captureSalesRes?.data) {
      setWarningModal(false);
      setSaleLoading(false);
      setSuccessModal(true);
      await dispatch(updateQuantityAfterAction(afterSalesPayload));
      dispatch(getAllInventory(afterSalesPayload?.sellerCompanyId));
    }

    if (captureSalesRes?.data?.isSuccess) {
      const { data } = captureSalesRes?.data;
      const invoiceValues = {
        orderId: data.orderId,
        truckNumber: "N/A",
        country: ccountry,
        distCode: distributor?.SYS_Code,
        discount: 0,
        customerId: buyerCompanyId,
        totalQuantity: orderItems[0]?.quantity,
        totalAmount: orderItems[0]?.price,
        routeName: routeName,
      };
      dispatch(addReportInvoice(invoiceValues));

      // setWarningModal(false);
      // setSaleLoading(false);
      // setSuccessModal(true);
      dispatch(clearInvent());
    }
    if (
      buyerStatus === null ||
      buyerStatus === "" ||
      buyerStatus === "Inactive"
    ) {
      const value = {
        status: "Active",
      };
      dispatch(updateCustomerStatus(buyerId, value));
    }
    const inventory = inventoryNet();
    const valuesToDB = {
      companyCode: distributor?.DIST_Code,
      customerName: buyerName,
      phoneNumber: buyerPhoneNumber,
      stocks: dataRows.filter((item) => item?.emptiesQuantity > 0).map((item) => {
        return {
          productId: item?.productId,
          quantity: item?.emptiesQuantity
        }
      })
    }
    inventory.post("empties/take-in", valuesToDB)
    .then((response) => {
      setOrderItemsState(orderItems);
      setReceiptPayload(payload);
    })
    .catch((error) => { 
      console.log(error);
    });
  };

  const handleKeyUp = (targetElem) => {
    if (targetElem) targetElem.focus();
  };
  let targetElem = "";
  let targetDiv = "";
  const inputRefs = useRef([]);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex " style={{ flexGrow: 1 }}>
          <div style={{ flexGrow: 0.15, position: "relative", Width: "100%" }}>
            <p className="select-customer mt-10 mb-1">{t("select_customer")}</p>
            <input
              className="h-12 px-2"
              style={{
                width: "100%",
                border: "1px solid #BBBDC2",
                borderRadius: "4px",
                outline: "none",
              }}
              placeholder="Type name or phone number here ..."
              onChange={(e) => setSearch(e.target.value)}
              value={search || phoneNumber}
            />
            {(search || phoneNumber) && (
              <span
                onClick={() => reset()}
                style={{
                  position: "absolute",
                  top: 70,
                  right: "15px",
                  color: "red",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                X
              </span>
            )}
            <div className="h-2  py-2 mb-2">
              <p>{name2}</p>
            </div>

            {search && (
              <div
                className=" bg-white pt-2 mt-1 shadow-lg -ml-2 "
                style={{
                  width: "100%",
                  zIndex: 1000,
                  position: "absolute",
                  borderRadius: 10,
                  overflow: "scroll",
                  maxHeight: "600px",
                  marginTop: "-20px",
                }}
              >
                {sortCustomer.length === 0 ? (
                  <div style={{ minHeight: "100px" }}>
                    {" "}
                    <p className="text-center px-2 py-2">
                      {t("customer_not_in_database")}
                    </p>{" "}
                  </div>
                ) : (
                  sortCustomer.map((customer) => (
                    <div
                      className="border-b-2 pt-1 mb-3 flex flex-col cursor-pointer"
                      onClick={() =>
                        setDetails(
                          customer.id,
                          customer?.phoneNumber,
                          customer?.CUST_Name,
                          customer?.CUST_Type,
                          customer.price_group,
                          customer?.SF_Code,
                          "Walk-In-Sales",
                          customer?.address,
                          customer?.status
                        )
                      }
                    >
                      <span
                        className="px-5 py-1"
                        style={{
                          color: "#2D2F39",
                          fontSize: 14,
                          fontWeight: 600,
                          lineHeight: "16px",
                        }}
                      >
                        {customer?.phoneNumber}
                      </span>
                      <span
                        className="px-5 py-1"
                        style={{
                          color: "#50525B",
                          fontSize: 12,
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        {customer?.CUST_Name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {!miniAdmin && (
            <div
              className="flex  ml-3 items-center mt-10 mt-5 cursor-pointer "
              onClick={() => resetNewCustomer()}
            >
              <img src={countryConfig[userCountry].plusIcon} />{" "}
              <button className="ml-1">
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#090B17",
                  }}
                >
                  {" "}
                  {t("new_customer")}
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center mt-10 pt-4">
          {showCapture && (
            <button
              style={{
                minWidth: 220,
                background: countryConfig[userCountry].buttonColor,
                borderRadius: 4,
                minHeight: 48,
              }}
              // onClick={onSubmit}
              onClick={() => setWarningModal(true)}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: countryConfig[userCountry].textColor,
                }}
              >
                {" "}
                {loadingcaptureSalesRes ? (
                  <span className="flex items-center justify-center">
                    <Loading />
                  </span>
                ) : (
                  "Capture Sale"
                )}
              </span>
            </button>
          )}
        </div>
      </div>
      {open && (
        <>
          <div
            className="bg-white mt-4 w-full rounded-md flex "
            style={{ height: 56 }}
          >
            <div
              style={{
                width: 10,
                background: countryConfig[userCountry].orderTypeColor,
              }}
            ></div>
            <div className="flex justify-between flex-grow">
              <div className="flex justify-center items-center ml-2">
                {t("new_one_off_customer")}
              </div>
              <div
                className=" flex justify-end items-center pr-5 cursor-pointer"
                style={{ color: "#9799A0" }}
                onClick={() => resetNewCustomer()}
              >
                X
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-10">
            <div
              className="flex flex-col flex-grow "
              style={{ position: "relative" }}
            >
              <div style={{ width: "50%", position: "relative" }}>
                <p className="select-customer  mb-1">Phone number</p>
                <input
                  className="h-12 px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #BBBDC2",
                    borderRadius: "4px",
                    outline: "none",
                    marginRight: "30px",
                    position: "relative",
                  }}
                  placeholder="Type name or phone number here..."
                  onChange={(e) => onChangeOneOffNumber(e)}
                  value={oneOffNumber}
                  name="oneOffNumber"
                  type="text"
                />
                {oneOffNumber && (
                  <span
                    onClick={() => resetOneOff()}
                    style={{
                      position: "absolute",
                      top: 35,
                      right: "15px",
                      color: "red",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    X
                  </span>
                )}
              </div>

              {searchOneOff && (
                <div
                  className=" bg-white pt-2 mt-3 shadow-lg -ml-1 "
                  style={{
                    width: "52%",
                    zIndex: 1000,
                    position: "absolute",
                    borderRadius: 10,
                    overflow: "scroll",
                    maxHeight: "600px",
                    marginTop: "70px",
                  }}
                >
                  {sortOneOffCustomer && sortOneOffCustomer.length === 0 ? (
                    <div style={{ minHeight: "100px" }}>
                      {" "}
                      <p className="text-center px-2 py-2">
                        {t("customer_not_in_database")}
                      </p>{" "}
                    </div>
                  ) : (
                    allOneOffCustomers &&
                    sortOneOffCustomer.map((customer) => (
                      <div
                        className="border-b-2 pt-1 mb-3 flex flex-col cursor-pointer"
                        onClick={() =>
                          addOneOffDetails(
                            // customer?.id,
                            customer?.phoneNumber,
                            customer?.CUST_Name,
                            checkCustomerTypeOneOff(distributor?.country),
                            customer?.id,
                            customer.price_group,
                            "One-Off"
                          )
                        }
                      >
                        <span
                          className="px-5 py-1"
                          style={{
                            color: "#2D2F39",
                            fontSize: 14,
                            fontWeight: 600,
                            lineHeight: "16px",
                          }}
                        >
                          {customer?.phoneNumber}
                        </span>
                        <span
                          className="px-5 py-1"
                          style={{
                            color: "#50525B",
                            fontSize: 12,
                            fontWeight: 400,
                            lineHeight: "16px",
                          }}
                        >
                          {customer?.CUST_Name}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
              {/* <div className='h-2  py-2 mb-2 ' style={{ position: 'absolute', bottom: 0 }}><p>{oneOffName}</p></div> */}
            </div>
            <div className="flex flex-col flex-grow">
              <p className="select-customer mb-1">{t("name")}</p>
              <input
                className="h-12 px-2"
                style={{
                  width: "70%",
                  border: "1px solid #BBBDC2",
                  borderRadius: "4px",
                  outline: "none",
                  marginRight: "30px",
                }}
                placeholder={t("type_here")}
                onChange={(e) => onChangeOneOffName(e)}
                value={oneOffName}
                name="oneOffName"
              />
            </div>

            <div className="flex items-end">
              {oneOffName && sortOneOffCustomer.length === 0 && oneOffNumber ? (
                <button
                  style={{
                    minWidth: 100,
                    background: countryConfig[userCountry].buttonColor,
                    borderRadius: 4,
                    minHeight: 48,
                  }}
                  // disabled={formCompleted ? false : true}
                  onClick={() => OnsubmitAddOneOff()}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      lineHeight: "24px",
                      color: countryConfig[userCountry].textColor,
                    }}
                  >
                    {loadingAddOneOffCustomers ? (
                      <span className="flex items-center justify-center">
                        <Loading />
                      </span>
                    ) : (
                      "Add"
                    )}
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </>
      )}
      <div className="bg-white mt-4 w-full rounded-md">
        <div
          className="flex justify-center items-center mt-3"
          style={{ color: "green", fontWeight: 500 }}
        >
          {addOneOffCustomers?.msg}
        </div>
        {/* {captureSalesRes?.isSuccess && <div className='flex justify-center items-center mt-3' style={{ color: 'green', fontWeight: 500 }}>{'Sales Captured Successfully'}</div>} */}
        <div className="py-5 flex-auto">
          <div className="stock-cont py-4">
            <div className="flex flex-wrap">
              <div className="w-full">
                <div className="py-2 flex-auto">
                  <div className="tab-content tab-space">
                    <div className="block">
                      <hr className="mb-5" />
                      <div
                        className="mt-3 px-4 flex justify-between"
                        style={{ width: "100%" }}
                      >
                        <input
                          className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400"
                          id="search"
                          type="text"
                          name="search"
                          style={{
                            width: "30%",
                            backgroundColor: "#E5E5E5",
                          }}
                          onChange={(e) => setPoductData(e.target.value)}
                          placeholder={t("search_for_anything")}
                        />
                        <div
                          className="flex pt-1"
                          style={{ width: "70%", overflowX: "scroll" }}
                        >
                          <button
                            className="text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2 cursor-pointer set-tab"
                            style={{
                              whiteSpace: "nowrap",
                              background: `${
                                productData === ""
                                  ? countryConfig[userCountry].buttonColor
                                  : "white"
                              }`,
                            }}
                            // product-cont-active
                            onClick={() => {
                              setPoductData("");
                            }}
                          >
                            <p
                              style={{
                                whiteSpace: "nowrap",
                                color:
                                  productData === "" &&
                                  countryConfig[userCountry].textColor,
                              }}
                              className="text-default font-normal"
                            >
                              {/* product-text-active */}
                              {t("all_products")}
                            </p>{" "}
                          </button>
                          {displayFilterProductsBasedOnCountry([
                            ...new Set(inventoryData),
                          ])}
                        </div>
                      </div>
                      {!distributorDetails ||
                      loading ||
                      loadingQuantityAfterSales ? (
                        <center
                          className=" flex justify-center items-center mx-auto flex-col"
                          style={{ marginTop: 20, marginBottom: 20 }}
                        >
                          <Loading /> <Loading /> <Loading />
                        </center>
                      ) : (
                        <table className="min-w-full mt-8 divide-y divide-gray-200">
                          <thead className="bg-transparent ">
                            <tr className="">
                              <th
                                scope="col"
                                className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                              >
                                {t("product")}
                              </th>
                              {/* <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                          >
                            SKU
                          </th> */}
                              <th
                                scope="col"
                                className="px-24 py-3 text-left text-sm font-medium text-black tracking-wider"
                              >
                                {t("quantity")}
                              </th>
                              <th
                                scope="col"
                                className="px-20 py-3 text-left text-sm font-medium text-black tracking-wider"
                              >
                                {t("availability")}
                              </th>
                              <th
                                scope="col"
                                className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                              >
                                {t("amount")}
                              </th>
                            </tr>
                          </thead>
                          {/* {!loadingState && <center style={{ marginTop: 20, marginBottom: 20 }}>
                        <Loading />
                        <Loading />
                        <Loading />
                      </center>} */}

                          <tbody className="bg-white px-6 divide-y divide-gray-200">
                            {sortOrder.length === 0 ||
                            inventoryData.length === 0 ? (
                              <div className="flex justify-start ml-10">
                                {" "}
                                <p className="py-4 pl-2">
                                  {" "}
                                  {t("not_available")}
                                </p>{" "}
                              </div>
                            ) : (
                              (productData === ""
                                ? inventoryData
                                : sortOrder
                              ).map(
                                (
                                  {
                                    product,
                                    is_abi,
                                    price,
                                    quantity,
                                    productId,
                                  },
                                  i
                                ) => (
                                  <tr key={product?.id}>
                                    {/* <td
                                      scope="col"
                                      className="px-12 py-3 text-left text-sm"
                                    >
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
                                          <div className="flex">
                                            <div
                                              className="px-2 mt-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                              style={{
                                                backgroundColor: "#F49C00",
                                              }}
                                            >
                                              <span className="capitalize">
                                                {product?.productType}
                                              </span>
                                            </div>
                                            <p
                                              className="mt-3 ml-4"
                                              style={{ color: "black" }}
                                            >
                                              {priceToCustomer(
                                                newOrderItem?.buyerType,
                                                is_abi,
                                                price,
                                                product,
                                                ccountry,
                                                oneOffNumber
                                                  ? oneOffPriceGroup
                                                  : newOrderItem?.priceGroup
                                              )}
                                              / {t("case")}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </td> */}
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
                                  {/* <div className="text-sm font-medium text-gray-900">
                                    {product?.brand +
                                      " " +
                                      product?.sku}
																	</div>
																	<div
																		className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                    style={{ backgroundColor: "#D86217" }}
                                  >
                                    {product?.productType}
																	</div> */}
                              		<div className="text-sm font-semibold capitalize text-gray-900">
																		{product?.brand}
																	</div>
																	<div className=" py-1 font-customGilroy inline-flex text-xs leading-5 rounded-full">
																		{product?.sku}
																	</div>
																	<div className=" py-1 font-customGilroy text-xs leading-5 rounded-full w-12 uppercase semi-bold text-center quantity_badge quantity_empty_badge" style={{ backgroundColor: "#D86217" }}>
																		{product?.productType}
																	</div>
																</div>
															</div>
														</td>

                                    {/* <td
                              scope="col"
                              className="px-12 py-3 text-left text-sm"
                            >
                              <p className="" style={{ color: "#45130F" }}>
                                {product.productType}
                              </p>
                            </td> */}

                                    <td
                                      scope="col"
                                      className="px-12 py-3 text-left text-sm"
                                    >
                                      <div className="flex relative">
                                        <div
                                          style={{
                                            position: "absolute",
                                            top: "-25px",
                                            left: 20,
                                            fontSize: 12,
                                            color:
                                              "rgba(177, 31, 36, var(--tw-bg-opacity))",
                                          }}
                                        >
                                          {toolTip &&
                                          Number(quantity) <
                                            Number(counter[productId])
                                            ? `${t(
                                                "max_availability_is"
                                              )} ${quantity}`
                                            : ""}
                                        </div>
                                        <button
                                          className="border-gray-200 border-2 h-8 w-8 mr-2 counter cursor-pointer"
                                          disabled={miniAdmin}
                                          onClick={() =>
                                            decrementCounter(
                                              product.productId,
                                              quantity
                                            )
                                          }
                                          style={{
                                            backgroundColor:
                                              countryConfig[userCountry]
                                                .textColor,
                                            opacity: `${
                                              counter[productId] === 0
                                                ? "0.3"
                                                : "1"
                                            }`,
                                          }}
                                        >
                                          <p
                                            style={{
                                              color:
                                                countryConfig[userCountry]
                                                  .inverseColor2,
                                            }}
                                            className="couter-text"
                                          >
                                            -
                                          </p>
                                        </button>

                                        <input
                                          type="number"
                                          min="0"
                                          max={quantity}
                                          id="quantity-input"
                                          placeholder="0"
                                          value={counter[product.productId]}
                                          name={product.productId}
                                          onChange={(e) =>
                                            handleChange(e, productId, quantity)
                                          }
                                          readOnly={miniAdmin}
                                          className="border-defaut bg-red font-normal text-sm rounded-md text-center border-2 w-20 h-8 pl-2"
                                        />
                                        {/* <p className="pt-1">{counter}</p> */}
                                        {/* </div> */}
                                        <button
                                          className="border-gray-200 border-2 h-8 w-9 ml-2 counter cursor-pointer"
                                          disabled={miniAdmin}
                                          onClick={() =>
                                            incrementCounter(
                                              product.productId,
                                              quantity
                                            )
                                          }
                                          style={{
                                            backgroundColor:
                                              countryConfig[userCountry]
                                                .textColor,
                                            opacity: `${
                                              counter[productId] === quantity
                                                ? "0.3"
                                                : "1"
                                            }`,
                                          }}
                                        >
                                          <p
                                            className="couter-text"
                                            style={{
                                              color:
                                                countryConfig[userCountry]
                                                  .inverseColor2,
                                            }}
                                          >
                                            +
                                          </p>
                                        </button>
                                      </div>
                                    </td>
                                    <td
                                      scope="col"
                                      className="px-12 py-3 text-left text-sm"
                                    >
                                      <div className="flex">
                                        {!reloadinv && (
                                          <div
                                            className="flex h-10 justify-center px-2  font-normal text-sm"
                                            style={{
                                              width: 150,
                                              background: `${
                                                quantity === 0 ? "red" : "green"
                                              }`,
                                              borderRadius: "24px",
                                            }}
                                          >
                                            <p
                                              className="pt-3 pl-1 pr-3"
                                              style={{ color: "#fff" }}
                                            >
                                              {`${
                                                quantity === 0
                                                  ? t("out_of_stock")
                                                  : `${quantity} ${t(
                                                      "available"
                                                    )}`
                                              }`}
                                            </p>
                                            {/* <img style={{ height: "55%" }} className="pt-2 pr-2" src={sku.statusImage} /> */}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td
                                      scope="col"
                                      className="px-12 py-3 text-left text-sm"
                                    >
                                      <p
                                        className=""
                                        style={{ color: "#45130F" }}
                                      >
                                        {counter[productId] > quantity
                                          ? t("not_available")
                                          : `${formatPriceByCountrySymbol(
                                              ccountry,
                                              sumAmount(
                                                newOrderItem?.buyerType,
                                                is_abi,
                                                price,
                                                product.productId,
                                                product,
                                                oneOffNumber
                                                  ? oneOffPriceGroup
                                                  : newOrderItem?.priceGroup
                                                  ? newOrderItem?.priceGroup
                                                  : ""
                                              )
                                            )}`}
                                      </p>
                                    </td>
                                  </tr>
                                )
                              )
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between bg-white mt-4 w-full rounded-md py-3 px-10">
        <div>
          {showCapture && (
            <button
              style={{
                minWidth: 220,
                background: countryConfig[userCountry].buttonColor,
                borderRadius: 4,
                minHeight: 48,
              }}
              onClick={() => setWarningModal(true)}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: countryConfig[userCountry].textColor,
                }}
              >
                {loadingcaptureSalesRes ? (
                  <span className="flex items-center justify-center">
                    <Loading />
                  </span>
                ) : (
                  t("capture_sales")
                )}
              </span>
            </button>
          )}
        </div>
        <div className="flex-col">
          <p>{t("subtotal")}</p>
          {<p> {formatPriceByCountrySymbol(ccountry, subTotal)} </p>}
        </div>
      </div>

      <Transition.Root show={warningModal} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 " onClose={setWarningModal}>
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
              {/* Modal */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:mt-1 sm:align-middle w-large-modal font-customGilroy">
                <div className="flex flex-col">
                  <div className="bg-white flex rounded-lg px-8 pt-6">
                    <p className="text-3xl font-customGilroy font-normal">
                      Order Summary
                    </p>

                    <div
                      onClick={() => setWarningModal(false)}
                      className="cursor-pointer ml-auto"
                    >
                      <CloseModal className="" />
                    </div>
                    {/* <p className="pt-3">
                    {t("how_many_cases_of_empties_is_the_customer_returning")}
                  </p> */}
                    {/* <input
                    type="number"
                    value={
                      Number(buyerEmpties) > 0 ? Number(buyerEmpties) : 0 || 0
                    }
                    // name={productId}
                    onChange={handleBuyerEmpties}
                    // disabled={counter[productId] > quantity ? true : false}
                    className="border-defaut bg-red font-normal text-sm rounded-md text-center border-2 w-20 h-8 pl-2 mt-3"
                  /> */}
                  </div>

                  <div
                    className="overflow-auto mt-1 "
                    style={{ maxHeight: 400 }}
                  >
                    {confirmationToggled && (
                      <ConfirmationModal
                        action={() => handleDelete(currentDeleteIndex, productIdToDelete)}
                        toggleState={confirmationToggleState}
                        message="Are you sure you want to delete this item?"
                        actionText="Delete"
                        loading={false}
                      />
                    )}
                    <table className="min-w-full mt-8 divide-y divide-gray-200">
                      <thead className="bg-transparent ">
                        <tr className="">
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider font-customGilroy text-small font-semibold"
                            style={{ color: "black" }}
                          >
                            {t("product")}
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider font-customGilroy text-small font-semibold"
                            style={{ color: "black" }}
                          >
                            {t("quantity")}
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider font-customGilroy text-small font-semibold"
                            style={{ color: "black" }}
                          >
                            {t("amount")}
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider font-customGilroy text-small font-semibold"
                            style={{ color: "black" }}
                          >
                            {t("empties_returned")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white px-6 divide-y divide-gray-200">
                        {dataRows.map((item, i) => (
                          <tr key={item.id}>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left text-sm "
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-20 w-10">
                                  <img
                                    className="h-20 w-10 rounded-full"
                                    src={item.products?.imageUrl}
                                    alt="product"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div
                                    className="text-sm font-medium text-gray-900 font-customGilroy text-larger font-semibold"
                                    style={{ color: "#262626" }}
                                  >
                                    <p>{`${
                                      item.products?.brand.charAt(0) +
                                      item.products?.brand
                                        .slice(1)
                                        .toLowerCase()
                                    } 
                                    ${item.products?.sku}`}</p>
                                     <p className=" py-1 font-customGilroy text-xs leading-5 rounded-full w-12 uppercase semi-bold text-center quantity_badge quantity_empty_badge" style={{ backgroundColor: "#D86217" }}>
																		{item.products?.productType}
																	</p>
                                  </div>
                                  <div className="flex">
                                    <p
                                      className="mt-3 font-customGilroy text-larger font-medium"
                                      style={{ color: "#262626" }}
                                    >
                                      {`${priceToCustomer(
                                        customerType,
                                        item?.is_abi,
                                        item?.price,
                                        item.products,
                                        ccountry,
                                        oneOffNumber
                                          ? oneOffPriceGroup
                                          : newOrderItem?.priceGroup
                                          ? newOrderItem?.priceGroup
                                          : ""
                                      )} `}
                                    </p>
                                    <p
                                      className="mt-3 font-customGilroy text-larger"
                                      style={{ color: "#262626" }}
                                    >
                                      {`\u00A0 / ${t("case")}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left font-customGilroy text-larger font-semibold"
                            >
                              <div className="h-8 w-8 mr-2 ">
                                {item.quantity}
                              </div>
                            </td>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left font-customGilroy text-larger font-semibold"
                            >
                              <p className="" style={{ color: "black" }}>
                                {formatPriceByCountrySymbol(
                                  ccountry,
                                  sumAmount(
                                    customerType,
                                    item?.is_abi,
                                    item?.price,
                                    item?.products.productId,
                                    item?.products,
                                    oneOffNumber
                                      ? oneOffPriceGroup
                                      : newOrderItem?.priceGroup
                                      ? newOrderItem?.priceGroup
                                      : ""
                                  )
                                )}
                              </p>
                            </td>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left text-sm"
                            >
                              {emptyError[i] === true ? (
                                <div>
                                  <input
                                    type="number"
                                    placeholder="0"
                                    name={item.productId}
                                    disabled={
                                      formatEmptiesQuantity(
                                        item.products.productType,
                                        item?.empties
                                      ) === "Nil" && "true"
                                    }
                                    value={item.emptiesQuantity}
                                    onChange={(e) =>
                                      handleActualEmpties(e, item.quantity, i)
                                    }
                                    className={`font-normal text-sm rounded-md text-center border-2 w-20 h-8 pl-2 border-critical bg-critical-bg opacity-80
                                  ${
                                    formatEmptiesQuantity(
                                      item.products.productType,
                                      item?.empties
                                    ) === "Nil" && "bg-neutral-300 opacity-50"
                                  }
                                `}
                                  />
                                  <div className="flex">
                                    <div className="flex-shrink-0 h-6 w-6 cursor-pointer mt-0.5">
                                      <img src={Warning} alt="waring" />
                                    </div>
                                    <span className="text-critical">
                                      Max quantity is {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  placeholder="0"
                                  name={item.productId}
                                  disabled={
                                    formatEmptiesQuantity(
                                      item.products.productType,
                                      item?.empties
                                    ) === "Nil" && "true"
                                  }
                                  value={item.emptiesQuantity}
                                  onChange={(e) =>
                                    handleActualEmpties(e, item.quantity, i)
                                  }
                                  className={`border-default font-normal text-sm rounded-md text-center border-2 w-20 h-8 pl-2
                                  ${
                                    formatEmptiesQuantity(
                                      item.products.productType,
                                      item?.empties
                                    ) === "Nil" && "bg-neutral-300 opacity-50"
                                  }
                                `}
                                />
                              )}
                            </td>
                            {/* Delete row */}
                            <td scope="col" className="pr-4">
                              <div
                                className="flex-shrink-0 h-6 w-6 cursor-pointer -my-8"
                                onClick={() => {
                                  setCurrentDeleteIndex(i);
                                  setProductIdToDelete(item.products.productId);
                                  setConfirmationToggled(true);
                                }}
                              >
                                <img src={Delete} alt="delete" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex bg-gray-50 px-4 py-3 sm:px-8 sm:flex gap-4 ml-3 rounded-lg">
                    <div className="flex flex-col">
                      <div className="flex flex-col ml-3">
                        <p className="text-small text-grey-text">
                          {t("subtotal")}{" "}
                        </p>
                        <p className="text-base font-semibold mt-1">
                          {" "}
                          {formatPriceByCountrySymbol(
                            ccountry,
                            subTotal
                          )}{" "}
                        </p>
                      </div>
                      <div className="flex flex-col ml-3 mt-4">
                        <p className="text-small text-grey-text">
                          Empties charge
                        </p>
                        <div className="flex mt-1 mb-4">
                          <p className="text-base text-grey-text mr-1">
                            Qty:{"\u00A0 "}
                          </p>
                          <p className="text-base font-semibold mr-4">
                            {actualEmpties}{" "}
                          </p>
                          <p className="text-base text-grey-text">
                            Price:{"\u00A0 "}
                          </p>
                          <p className="text-base font-semibold">
                            {formatPriceByCountrySymbol(
                              ccountry,
                              totalEmptiesPrice || 0
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 ml-40">
                      <p className="text-small-text text-grey-text">
                        {t("total")}
                      </p>
                      <p className="font-bold text-large-text">
                        {formatPriceByCountrySymbol(
                          ccountry,
                          totalEmptiesPrice + subTotal || 0
                        )}
                      </p>
                    </div>

                    <div
                      className="ml-auto mt-10"
                      style={{
                        borderBottomRightRadius: "0.5rem",
                        borderBottomLeftRadius: "0.5rem",
                      }}
                    >
                      <button
                        className=" rounded font-customGilroy text-center text-larger  font-bold not-italic px-14 py-3 shadow-lg"
                        onClick={() =>
                          onSubmit(
                            oneOffNumber
                              ? oneOffPriceGroup
                              : newOrderItem?.priceGroup
                          )
                        }
                        style={{
                          backgroundColor:
                            countryConfig[userCountry].buttonColor,
                          color: countryConfig[userCountry].textColor,
                        }}
                      >
                        {/* {loadingcaptureSalesRes ? ( */}
                        {saleLoading ? (
                          <span className="flex items-center justify-center">
                            <Loading />
                          </span>
                        ) : (
                          t("confirm")
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* success modal  */}

      <Transition.Root show={successModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setSuccessModal}
        >
          <div
            className="flex items-end justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0 min-h-screen"
            style={{ height: 100 }}
          >
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
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                {/* <button
									className="flex justify-center ml-auto m-4 mb-0"
									onClick={() => setSuccessModal(false)}
								>
									<CloseModal />
								</button> */}
                <div
                  className="flex flex-col justify-center items-center w-modal h-sub-modal -mt-12"
                  style={{ height: 300 }}
                >
                  <Checked />
                  {oneOffNumber ? (
                    <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                      {t("Sales Captured Successfully. View Invoice")}
                    </p>
                  ) : (
                    <p className="font-customGilroy not-italic font-medium text-xl text-center text-grey-85 mt-4">
                      {
                        "Sales Captured Successfully. Would you like to assign to a Driver or Continue?"
                      }
                    </p>
                  )}
                </div>
                <div className="flex border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  {oneOffNumber ? (
                    <button
                      className="rounded font-customGilroy text-center text-sm font-bold not-italic px-8 py-2"
                      onClick={() => {
                        setSuccessModal(false);
                        setShowReceipt(true);
                        resetOneOff();
                      }}
                      style={{
                        backgroundColor: countryConfig[userCountry].buttonColor,
                        color: countryConfig[userCountry].textColor,
                      }}
                    >
                      {t("okay_view_invoice")}
                    </button>
                  ) : (
                    <>
                      <button
                        className="rounded font-customGilroy text-center text-sm font-bold not-italic px-8 py-2"
                        onClick={() => {
                          updateToCompleted(orderId);
                        }}
                        style={{
                          backgroundColor:
                            countryConfig[userCountry].buttonColor,
                          color: countryConfig[userCountry].textColor,
                        }}
                      >
                        {t("okay_view_invoice")}
                      </button>
                      <div
                        className="rounded font-customGilroy text-center text-sm font-bold not-italic px-8 py-2"
                        onClick={() => {
                          updateToPlaced(orderId);
                        }}
                        style={{
                          backgroundColor:
                            countryConfig[userCountry].buttonColor,
                          color: countryConfig[userCountry].textColor,
                          cursor: "pointer",
                        }}
                      >
                        {t("assign_to_driver")}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Receipt */}
      <Transition.Root show={showReceipt} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => setShowReceipt(false)}
        >
          <div className="flex items-end justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0 min-h-screen">
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
              {ccountry === "South Africa" ? (
                <div
                  className="inline-block align-bottom rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle"
                  style={{ backgroundColor: "#fff" }}
                >
                  {/* base64 downloader */}
                  <div id="receipt">
                    <div
                      className="flex"
                      // style={{borderBottom: "1px dashed"}}
                    >
                      <img
                        className="my-2"
                        src={countryConfig[userCountry].invoiceLogo}
                        alt="logo"
                      />
                      <a href="" id="downloader" download="Invoice"></a>
                      <p
                        className="ml-8 mt-2 mb-2"
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        The South African Breweries (Pty) Ltd
                        <br />
                        65 Park Lane
                        <br />
                        Sandown Sandton 2146
                        <br />
                        Reg No. 1998/006375/07
                        <br /> VAT Reg no. 4160180495
                      </p>
                    </div>

                    <div
                      className="flex flex-col w-modal  -mt-12"
                      style={{ width: 650 }}
                    >
                      <div
                        className=""
                        style={{
                          width: "100%",
                          backgroundColor:
                            countryConfig[userCountry].borderBottomColor,
                          padding: "1px",
                          marginTop: "50px",
                        }}
                      ></div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 25px 1px",
                          fontSize: "14px",
                          color: "#000",
                          borderBottom: "1px dashed #9799A0",
                        }}
                      >
                        <div style={{ fontSize: "12px" }}>
                          <p
                            style={{
                              fontWeight: "bold",
                              paddingTop: "20px",
                              color: "#9799A0",
                              marginBottom: 6,
                            }}
                          >
                            Invoice
                          </p>
                          <p style={{ marginBottom: 4 }}>
                            Date:{" "}
                            {moment(receipyPayload?.datePlaced).format(
                              "MMMM Do YYYY"
                            )}
                          </p>
                          <p style={{ marginBottom: 4 }}>Invoice:</p>
                          <p style={{ marginBottom: 4 }}>
                            Order no: {captureSalesRes?.data?.orderId}
                          </p>
                          <p style={{ marginBottom: 4 }}>
                            Issuing Distributor: {distributor?.company_name}
                            <br />
                            c/o{" "}
                            {`${distributor?.address}, ${
                              distributor?.state === null
                                ? ""
                                : distributor?.state
                            }`}
                          </p>
                          <p style={{ marginBottom: 4 }}>NLA No: RG/000773</p>
                          <p style={{ marginBottom: 4 }}>Salesman:</p>
                        </div>
                        <div style={{ fontSize: "12px" }}>
                          <p style={{ marginBottom: 4 }}>
                            Sold to: {thisCustomer?.SF_Code}
                          </p>
                          <p style={{ marginBottom: 4 }}>
                            Account No: {thisCustomer?.account_number}
                          </p>
                          <p style={{ marginBottom: 4 }}>
                            {receipyPayload?.buyerDetails?.buyerName}
                          </p>
                          <p style={{ marginBottom: 4 }}>
                            {receipyPayload?.buyerDetails?.buyerAddress}
                          </p>
                          {/* <p style={{ marginBottom: 4 }}>State</p> */}
                          {/* <p style={{ marginBottom: 4 }}>1960</p> */}
                          <p style={{ marginBottom: 4 }}>
                            Customer Banking ref: {thisCustomer?.banking_ref}
                          </p>
                          <p style={{ marginBottom: 4 }}>
                            Liq Lic No: {thisCustomer?.liquid_license_number}
                          </p>
                        </div>
                      </div>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          padding: "10px 25px 1px",
                        }}
                      >
                        Order and Payment Terms
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 25px 1px",
                          fontSize: "12px",
                          color: "#000",
                          borderBottom: "1px dashed #9799A0",
                          paddingBottom: 20,
                        }}
                      >
                        <div style={{ fontSize: "12px" }}>
                          <p style={{ marginBottom: 8 }}>
                            {thisCustomer?.payment_term}
                          </p>
                          <p>Subject to any terms of trade</p>
                        </div>
                        <div style={{ fontSize: "12px" }}>
                          <p style={{ marginBottom: 8 }}>
                            Payment Method: {thisCustomer?.payment_methods}
                          </p>
                          <p>Customer VAT No: {thisCustomer?.tax_id}</p>
                        </div>
                      </div>
                      {/* <div
                    style={{
                      fontWeight: "bold",
                      marginTop: "10px",
                      textAlign: "center",
                      color: "#000",
                    }}
                  >
                  Invoice
                  </div> */}
                      {/* <div style={{ padding: "10px 25px 1px" }}> */}
                      <table style={{ fontSize: 12, margin: "10px 25px 1px" }}>
                        <thead
                          style={{
                            // borderBottom: "1px solid #000000",
                            paddingBottom: 20,
                          }}
                        >
                          <th style={{ paddingLeft: 7 }}>No</th>
                          <th style={{ paddingLeft: 7 }}>
                            Product Description
                          </th>
                          <th style={{ paddingLeft: 7 }}>Quantity</th>
                          <th style={{ paddingLeft: 7 }}>Unit Price</th>
                          <th style={{ paddingLeft: 7 }}>Amount</th>
                        </thead>
                        {receipyPayload?.orderItems?.map((item, index) => (
                          <tr key={index}>
                            <td style={{ fontSize: 12 }}>{index + 1}</td>
                            <td style={{ fontSize: 12 }}>{item?.name}</td>
                            <td style={{ fontSize: 12 }}>{item?.quantity}</td>
                            <td style={{ fontSize: 12 }}>
                              {formatPriceByCountrySymbol(
                                ccountry,
                                item?.price / item?.quantity
                              )}
                            </td>
                            <td style={{ fontSize: 12 }}>
                              {formatPriceByCountrySymbol(
                                ccountry,
                                item?.price
                              )}
                            </td>
                          </tr>
                        ))}
                      </table>
                      {/* </div> */}
                      <div
                        style={{
                          backgroundColor: "#DEE0E4",
                          padding: "10px 25px 1px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #000000",
                            paddingBottom: 10,
                          }}
                        >
                          <p style={{ fontSize: 14 }}>Additional Information</p>
                          <p style={{ fontSize: 14 }}>Sub Total: </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            // borderBottom: "1px solid #000000",
                            paddingBottom: 10,
                            paddingTop: 10,
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <p style={{ fontSize: 13 }}>
                              Sub Total:{" "}
                              {formatPriceByCountrySymbol(
                                ccountry,
                                parseFloat(
                                  receipyPayload?.orderItems?.reduce(
                                    (a, b) => a + parseFloat(b.price),
                                    0
                                  )
                                )
                              )}
                            </p>
                            <p style={{ fontSize: 12 }}>
                              VAT 15%:{" "}
                              {formatPriceByCountrySymbol(
                                ccountry,
                                parseFloat(
                                  receipyPayload?.orderItems?.reduce(
                                    (a, b) => a + parseFloat(b.price),
                                    0
                                  ) * 0.15
                                )
                              )}
                            </p>
                            <p style={{ fontSize: 11 }}>
                              Total Invoice Value:{" "}
                              {formatPriceByCountrySymbol(
                                ccountry,
                                parseFloat(
                                  receipyPayload?.orderItems?.reduce(
                                    (a, b) => a + parseFloat(b.price),
                                    0
                                  )
                                ) +
                                  parseFloat(
                                    receipyPayload?.orderItems?.reduce(
                                      (a, b) => a + parseFloat(b.price),
                                      0
                                    ) * 0.15
                                  )
                              )}
                            </p>
                          </div>
                          <p style={{ fontWeight: "bold" }}>
                            {formatPriceByCountrySymbol(
                              ccountry,
                              parseFloat(
                                receipyPayload?.orderItems?.reduce(
                                  (a, b) => a + parseFloat(b.price),
                                  0
                                )
                              )
                            )}
                          </p>
                        </div>
                      </div>

                      {/* <div style={{width: '100%', padding: '12px', marginTop: '12px', borderTop: '5px solid #B11F24'}}> */}

                      {/* <div
                    className=""
                    style={{
                      width: "100%",
                      backgroundColor:
                        countryConfig[userCountry].borderBottomColor,
                      padding: "1px",
                    }}
                  ></div> */}
                      {/* </div> */}
                    </div>
                  </div>

                  <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      className="rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                      onClick={() => downloadInvoice()}
                      style={{
                        backgroundColor:
                          countryConfig[userCountry].borderBottomColor,
                        color: countryConfig[userCountry].textColor,
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ) : ccountry === "Zambia" ? (
                <div
                  className="inline-block align-bottom text-left shadow-xl transform transition-all sm:my-8 sm:align-middle"
                  style={{
                    backgroundColor: "#fff",
                    width: 612,
                    overflow: "scroll",
                  }}
                >
                  {/* base64 downloader */}
                  <div id="receipt">
                    <div
                      className="text-center py-5"
                      style={{
                        backgroundColor: "#EBEEF2",
                      }}
                    >
                      <a href="" id="downloader" download="Invoice"></a>
                      <p className="text-lg text-center font-bold ">
                        {distributor?.company_name}
                      </p>
                      <p className="text-xs font-medium py-1">
                        {`${distributor?.address}, ${
                          distributor?.state === null ? "" : distributor?.state
                        }`}
                      </p>
                      <div className="flex gap-4 justify-center">
                        <div className="flex gap-1 items-center">
                          <p className="font-bold text-xs">Company reg:</p>
                          <p className="text-xs font-medium">
                            {distributor?.company_reg_number ?? "N/A"}
                          </p>
                        </div>
                        <div className="flex gap-1 items-center">
                          <p className="font-bold text-xs">TPIN:</p>
                          <p className="text-xs font-medium">
                            {distributor?.TPIN}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-10 pt-4 pb-10">
                      <p
                        className="text-[#828297] pb-1 font-bold text-2xl"
                        style={{
                          color: "#828297",
                        }}
                      >
                        Tax Invoice
                      </p>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex gap-1 items-center pb-1">
                            <p className="font-bold text-xs">Date:</p>
                            <p className="text-xs font-medium">
                              {moment(receipyPayload?.datePlaced).format(
                                "DD-MM-YYYY"
                              )}
                            </p>
                          </div>
                          <div className="flex gap-1 items-center pb-1">
                            <p className="font-bold text-xs">Time:</p>
                            <p className="text-xs font-medium">
                              {moment(receipyPayload?.datePlaced).format(
                                "HH:mm"
                              )}
                            </p>
                          </div>
                          <div className="flex gap-1 items-center">
                            <p className="font-bold text-xs">Invoice no:</p>
                            <p className="text-xs font-medium">
                              #{invoice?.invoice_number}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium pb-1">SOLD TO</p>
                          <p className="font-bold text-xs pb-1">
                            {receipyPayload?.buyerDetails?.buyerName}
                          </p>
                          <p className="text-xs font-medium pb-1">
                            {receipyPayload?.buyerDetails?.buyerAddress}
                          </p>
                          <div className="flex gap-1 items-center">
                            <p className="font-bold text-xs">Customer TPIN:</p>
                            <p className="text-xs font-medium">
                              {thisCustomer?.TPIN ?? "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <table
                        style={{ fontSize: 12, marginTop: 20 }}
                        className="w-full"
                      >
                        <thead
                          style={{
                            borderBottom: "1px solid #EBEEF2",
                            // paddingBottom: 20,
                          }}
                        >
                          <th style={{ paddingLeft: 7, paddingBottom: 7 }}>
                            No.
                          </th>
                          <th style={{ paddingLeft: 7, paddingBottom: 7 }}>
                            Product
                          </th>
                          <th style={{ paddingLeft: 7, paddingBottom: 7 }}>
                            Qty
                          </th>
                          <th style={{ paddingLeft: 7, paddingBottom: 7 }}>
                            Unit Price
                          </th>
                          <th style={{ paddingLeft: 7, paddingBottom: 7 }}>
                            Total
                          </th>
                        </thead>
                        {receipyPayload?.orderItems?.map((item, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                fontSize: 12,
                                borderBottom: "0px",
                                paddingBottom: 0,
                              }}
                            >
                              {index + 1}.
                            </td>
                            <td
                              style={{
                                fontSize: 12,
                                color: "#111118",
                                borderBottom: "0px",
                                paddingBottom: 0,
                              }}
                            >
                              {item?.name}
                            </td>
                            <td
                              style={{
                                fontSize: 12,
                                borderBottom: "0px",
                                paddingBottom: 0,
                              }}
                            >
                              {item?.quantity}
                            </td>
                            <td
                              style={{
                                fontSize: 12,
                                borderBottom: "0px",
                                paddingBottom: 0,
                              }}
                            >
                              {formatPriceByCountrySymbol(
                                ccountry,
                                item?.price / item?.quantity
                              )}
                            </td>
                            <td
                              style={{
                                fontSize: 12,
                                borderBottom: "0px",
                                paddingBottom: 0,
                              }}
                            >
                              {formatPriceByCountrySymbol(
                                ccountry,
                                item?.price
                              )}
                            </td>
                          </tr>
                        ))}
                      </table>
                      <div className="flex justify-between pb-2 pt-6">
                        <p className="font-bold text-xs">Summary</p>
                        <p className="font-bold text-xs">Grand Total:</p>
                      </div>
                      <div className="border-t-2 border-b-2 py-4 border-black flex justify-between items-center">
                        <div className="flex gap-2">
                          <div>
                            <p className="font-normal text-xs pb-1">
                              Subtotal:
                            </p>
                            <p className="font-normal text-xs pb-1">
                              VAT (16%):
                            </p>
                            <p className="font-normal text-xs">Empties Paid:</p>
                          </div>
                          <div>
                            <p className="font-medium text-xs pb-1">
                              {formatPriceByCountrySymbol(
                                ccountry,
                                parseFloat(invoiceSubotal)
                              )}
                            </p>
                            <p className="font-medium text-xs pb-1">
                              {formatPriceByCountrySymbol(
                                ccountry,
                                parseFloat(VAT)
                              )}
                            </p>
                            <p className="font-medium text-xs">
                              {formatPriceByCountrySymbol(
                                ccountry,
                                receipyPayload?.costOfEmptiesReturned
                              ) ?? 0}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p
                            className="font-bold text-3xl"
                            style={{ colors: "#09090C" }}
                          >
                            {formatPriceByCountrySymbol(
                              ccountry,
                              parseFloat(invoiceTotal)
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      className="rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                      onClick={() => downloadInvoice()}
                      style={{
                        backgroundColor:
                          countryConfig[userCountry].borderBottomColor,
                        color: countryConfig[userCountry].textColor,
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="inline-block align-bottom rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle"
                  style={{ backgroundColor: "#fff" }}
                >
                  {/* base64 downloader */}
                  <div id="receipt">
                    <img
                      className="my-2"
                      src={countryConfig[userCountry].invoiceLogo}
                      alt="logo"
                    />
                    <a href="" id="downloader" download="Invoice"></a>

                    <div
                      className="flex flex-col w-modal -mt-12"
                      style={{ width: 500 }}
                    >
                      <div
                        className=""
                        style={{
                          width: "100%",
                          backgroundColor:
                            countryConfig[userCountry].borderBottomColor,
                          padding: "1px",
                          marginTop: "50px",
                        }}
                      ></div>
                      <div
                        style={{
                          fontWeight: "bold",
                          marginTop: "10px",
                          textAlign: "center",
                          color: "#000",
                        }}
                      >
                        {t("invoice")}
                      </div>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 25px 1px",
                            fontSize: "14px",
                            color: "#000",
                            marginTop: 20,
                          }}
                        >
                          <div>{t("buyer_name")}:</div>
                          <div style={{ fontWeight: "bold" }}>
                            {" "}
                            {receipyPayload?.buyerDetails?.buyerName}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "1px 25px",
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          <div>{t("distributor_name")}:</div>
                          <div style={{ fontWeight: "bold" }}>
                            {" "}
                            {distributor?.company_name}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "1px 25px",
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          <div>{t("date_placed")}:</div>
                          <div style={{ fontWeight: "bold" }}>
                            {moment(receipyPayload?.datePlaced).format(
                              "MMMM Do, YYYY"
                            )}
                          </div>
                        </div>

                        {/* <div style={{width: '100%', padding: '12px', marginTop: '12px', borderTop: '5px solid #B11F24'}}> */}
                        <table
                          style={{
                            fontSize: 12,
                            margin: "30px 15px 1px",
                          }}
                        >
                          <thead>
                            <th style={styles.th}>S/N</th>
                            <th style={styles.th}>
                              {t("product_description")}
                            </th>
                            <th style={styles.th}>{t("quantity")}</th>
                            <th style={styles.th}>{t("unit_price")}</th>
                            <th style={styles.th}>{t("amount")}</th>
                          </thead>
                          {/* <tbody style={{ color: "#000" }}> */}
                          {receipyPayload?.orderItems?.map((item, index) => (
                            <tr key={index}>
                              <td style={styles.td}>{index + 1}</td>
                              <td style={styles.td}>{item?.name}</td>
                              <td style={styles.td}>{item?.quantity}</td>
                              <td style={styles.td}>
                                {formatPriceByCountrySymbol(
                                  ccountry,
                                  item?.price / item?.quantity
                                )}
                              </td>
                              <td style={styles.td}>
                                {formatPriceByCountrySymbol(
                                  ccountry,
                                  item?.price
                                )}
                              </td>
                            </tr>
                          ))}
                          {/* </tbody> */}
                        </table>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 25px 1px",
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          <div>{t("empties")}:</div>
                          <div style={{ fontWeight: "bold" }}>
                            {receipyPayload?.emptiesReturned}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 25px 1px",
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          <div>{t("price_of_empties_owed")}:</div>
                          <div style={{ fontWeight: "bold" }}>
                            {" "}
                            {formatPriceByCountrySymbol(
                              ccountry,
                              receipyPayload?.costOfEmptiesReturned
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "1px 25px",
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          <div>{t("subtotal")}:</div>
                          <div style={{ fontWeight: "bold" }}>
                            {formatPriceByCountrySymbol(
                              ccountry,
                              parseFloat(invoiceSubotal)
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "1px 25px",
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          <div style={{ fontWeight: "bold" }}>
                            {t("total")}:
                          </div>
                          <div style={{ fontWeight: "bold" }}>
                            {" "}
                            {formatPriceByCountrySymbol(
                              ccountry,
                              parseFloat(invoiceTotal)
                            )}
                          </div>
                        </div>
                        {ccountry === "Tanzania" && (
                          <div
                            style={{
                              display: "flex",
                              // justifyContent: "space-between",
                              padding: "1px 25px",
                              fontSize: "14px",
                              color: "#000",
                            }}
                          >
                            <div>(**The price is inclusive of VAT)</div>
                            {/* <div style={{ fontWeight: "bold" }}>
                          {formatPriceByCountrySymbol(
                            ccountry,
                            parseFloat(VAT)
                          )}
                        </div> */}
                          </div>
                        )}

                        <div
                          className=""
                          style={{
                            width: "100%",
                            backgroundColor:
                              countryConfig[userCountry].borderBottomColor,
                            padding: "1px",
                            marginTop: "20px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ">
                    <button
                      className="rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                      onClick={() => downloadInvoice()}
                      style={{
                        backgroundColor:
                          countryConfig[userCountry].borderBottomColor,
                        color: countryConfig[userCountry].textColor,
                      }}
                    >
                      {t("download")}
                    </button>
                  </div>
                </div>
              )}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default WalkInSales;

const styles = {
  th: {
    color: "#000",
    paddingLeft: 7,
  },
  td: { fontSize: 12, color: "#000" },
};
