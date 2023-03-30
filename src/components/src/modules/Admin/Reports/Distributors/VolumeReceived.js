import React, { useEffect, useState } from "react";
import moment from "moment";
import Dashboard from "../../../../Layout/Admin/Dashboard";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import CalendarIcon from "../../../../assets/svg/calendarIcon.svg";
import { useHistory } from "react-router-dom" 
import  { connect, useDispatch, useSelector } from "react-redux";
import { getSingleDistributor } from "../../pages/actions/adminDistributorAction";
import { getAllDistributors } from "../../KPO/actions/UsersAction";
import { filter, flatten } from "lodash";
import Arrowdown from "../../../../assets/svg/arrowDown.svg";
import { showCalendar } from "../actions/ReportAction";
import Calendar from "../../../../components/common/Calendar";
import { inventoryNet } from "../../../../utils/urls";
import { getAllInventory } from "../../../Inventory/actions/inventoryProductAction";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";

const VolumeSold = ({ location, distributor, getSingleDistributor }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {t} = useTranslation()

  const code = location.pathname.split("/").at(-1);
  useEffect(() => {
    getSingleDistributor(code);
  }, []);
  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [calendarText, setCalendarText] = useState(t("this_month"));
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
  const [inventory, setInventory] = useState([]);

  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );

  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );

  useEffect(() => {
    dispatch(getAllInventory(code));
  }, []);

  // if (!allInventory.length) {

  // }

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
        setStartRange(start + " 00:00:00");
        setStopRange(stop + " 23:59:59");
      }
    }
  }, [selectedDayRange]);

  useEffect(() => {
    const inventory = inventoryNet()
    inventory
      .get(
        `total-volume/${code}?startRange=${startRange}&stopRange=${stopRange}`
      )
      .then((response) => {
        const { data } = response.data;
        setInventory(data);
      })
      .catch((error) => {
        return;
      });
  }, [startRange, stopRange]);

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;

  if (!allDistributors) {
    dispatch(getAllDistributors(country));
  }

  const backButton = () => {
    // history.push("/distributor/reports/" + code);
    history.goBack();
  };
  const getDistributorName = (code) => {
    let thisDistributor = filter(allDistributors, { SYS_Code: code })[0];
    if (!thisDistributor) {
      thisDistributor = filter(allDistributors, { DIST_Code: code })[0];
    }
    return thisDistributor;
  };

  let dd = [];
  allInventory.map((data) => {
    dd.push({
      Syspro_Code: getDistributorName(code)?.SYS_Code,
      Date: moment(new Date(Date.now())).format("YYYY-MM-DD"),
      Product: data.product?.brand + " " + data.product?.sku,
      "Quantity Available": data.quantity,
    });
  });

  const data = dd;

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-10 lg:pb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={() => backButton()} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {getDistributorName(code)?.company_name}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            <CSVLink
              data={data}
              filename={`${
                getDistributorName(code)?.SYS_Code
              }_daily_inventory.csv`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} alt="" />
                <p className="report-download">
                  {t("download_daily_inventory")}
                </p>
              </div>
            </CSVLink>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
            <p className="font-normal text-gray-400">{t("distributor")}</p>/
            <p className="font-medium text-grey-100">
              {getDistributorName(code)?.company_name}
            </p>
            /
            <p className="font-medium text-grey-100">
              {t("total_volume_received")}
            </p>
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
                  ₦{product.price.toLocaleString(undefined)}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Dashboard>
  );
};

const mapStateToProps = (state) => {
  return {
    distributor: state.AllDistributorReducer.distributor,
  };
};

export default connect(mapStateToProps, {
  getSingleDistributor,
})(VolumeSold);
