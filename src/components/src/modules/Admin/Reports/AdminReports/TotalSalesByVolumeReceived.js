import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import CalendarIcon from "../../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom"
import {
  getAllOrders,
  getAllOrdersByDateRange,
} from "../../order/actions/orderAction";
import { filter, flatten } from "lodash";
import { getAllProducts } from "../../Pricing/actions/AdminPricingAction";
import { formatNumber } from "../../../../utils/formatNumber";
import moment from "moment";
import Arrowdown from "../../../../assets/svg/arrowDown.svg";
import { showCalendar } from "../actions/ReportAction";
import Calendar from "../../../../components/common/Calendar";
import { inventoryNet } from "../../../../utils/urls";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";

const TotalSalesByVolumeSold = ({ location, distributor }) => {
  const {t} = useTranslation()
  const history = useHistory();
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.PricingReducer.allProducts);
    const AuthData = useSelector(state => state.Auth.sessionUserData);
    const country = AuthData?.country;

  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [calendarText, setCalendarText] = useState(t("this_month"));
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay);
  const [stopRange, setStopRange] = useState(stopDay);
  const [inventory, setInventory] = useState([]);

  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );

  useEffect(() => {
    if (Object.keys(selectedDayRange).length !== 0) {
      const start =
        selectedDayRange?.from?.year +
        "-" +
        selectedDayRange?.from?.month +
        "-" +
        selectedDayRange?.from?.day;

      setStartRange(start + " 00:00:00");

      const stop =
        selectedDayRange?.to?.year +
        "-" +
        selectedDayRange?.to?.month +
        "-" +
        selectedDayRange?.to?.day;
      setStopRange(stop + " 23:59:59");

      // Object.keys(selectedDayRange.to).length !== 0
      //   ? setStopRange(stop)
      //   : setStopRange(start + " 23:59:59");

      if (start !== stop) {
        setCalendarText(t("custom_date"));
        setCustomDate(
          selectedDayRange?.from?.year +
            "/" +
            selectedDayRange?.from?.month +
            "/" +
            selectedDayRange?.from?.day +
            "  ->  " +
            selectedDayRange?.to?.year +
            "/" +
            selectedDayRange?.to?.month +
            "/" +
            selectedDayRange?.to?.day
        );
      } else {
        start === stopDay && stop === stopDay
          ? setCalendarText(t("today"))
          : setCalendarText(t("custom_date"));
        setCustomDate("");
        setStartRange(start);
        setStopRange(stop);
      }
    }
  }, [selectedDayRange]);

  useEffect(() => {
    const inventory = inventoryNet()
    inventory
      .get(`total-volume?country=${country}&startRange=${startRange}&stopRange=${stopRange}`)
      .then((response) => {
        const { data } = response.data;
        setInventory(data);
      })
      .catch((error) => {
        return;
      });
  }, [startRange, stopRange]);

  const backButton = () => {
    // history.push("/admin-dashboard/reports");
     history.goBack();
  };

  const getProductDetails = (productID) => {
    let thisProduct = filter(allProducts, { productId: productID })[0];
    if (!thisProduct) {
      thisProduct = filter(allProducts, { id: parseInt(productID) })[0];
    }
    let value = thisProduct?.brand + " " + thisProduct?.sku;
    return value;
  };

  //////////get total volume per product /////////////

  let totalQ = 0;
  let data = [];
  inventory.map((item) => {
      totalQ =
        totalQ + item.quantity
        data.push({
          Product: item.product.brand + " " + item.product.sku,
          Volume: item.quantity,
        });
    })

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={backButton} style={{ cursor: "pointer" }} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("total_volume_received")}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            <span
              style={{
                backgroundColor: "#50525B",
                padding: "4px 8px",
                borderRadius: 4,
                color: "#FFFFFF",
                fontSize: 16,
              }}
            >
              <strong>{t("total_volume_received")}:</strong>{" "}
              {formatNumber(totalQ)}
            </span>
            <CSVLink
              data={data}
              filename={`${country}_volume_received_${startRange}-${stopRange}.csv`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} alt="" />
                <p className="report-download">{t("download_report")}</p>
              </div>
            </CSVLink>
          </div>
        </div>
        <div>
          <div style={{ maxWidth: 300, position: "absolute" }}>
            <Calendar />
          </div>
          <div
            className="flex mt-4 px-3 report-date-cont justify-between bg-white w-40 h-12"
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(showCalendar(true))}
          >
            <img
              style={{ height: "25px", margin: "auto" }}
              src={CalendarIcon}
              alt=""
            />
            <p className="report-date">{calendarText}</p>
            <div className="mx-1 my-auto">
              <img className="" src={Arrowdown} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-white mx-10 py-6"
        style={{
          boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2)",
          borderRadius: "8px",
        }}
      >
        <table className="min-w-full mt-3 divide-y divide-grey-500">
          <thead className="bg-transparent ">
            <tr className="">
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                S/N
              </th>
              <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                {t("product")}
              </th>
              <th className="px-10 py-3 text-left text-xs font-medium text-black align-middle">
                {t("volume_Cases")}
              </th>
              {/* <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                Amount
              </th> */}
            </tr>
          </thead>

          <tbody
            id="distributors"
            className="bg-white px-6 divide-y divide-gray-200"
          >
            {inventory?.map((product, index) => (
              <tr key={index}>
                <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {index + 1}
                </td>
                <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  {product.product.brand + " " + product.product.sku}
                </td>
                <td className="text-left align-middle cursor-pointer">
                  <p className="font-customGilroy pl-8 text-sm text-red-900 font-medium">
                    {product.quantity}
                  </p>
                </td>
                {/* <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                  ₦{formatNumber(product.price)}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Dashboard>
  );
};

export default TotalSalesByVolumeSold;
