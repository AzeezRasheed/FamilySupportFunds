import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "../Admin/KPO/actions/UsersAction";
import { getAllDistributor } from "../Admin/pages/actions/adminDistributorAction";
import { filter } from "lodash";
import { GetDistributors } from "./GetDistributors";
import {
  getMiniAdminOrdersByDateRange,
  getMiniAdminSummary,
  setLoadingToDefault,
} from "../Admin/order/actions/orderAction";
import moment from "moment";
import { useTranslation } from "react-i18next";

export const GetDistributorsOrders = async (type) => {
  const { t } = useTranslation();
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [distCodes, setDistCodes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const startDay = moment(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ).format("YYYY-MM-DD");
  const stopDay = moment(new Date(Date.now())).format("YYYY-MM-DD");
  const [customDate, setCustomDate] = useState("");
  const [startRange, setStartRange] = useState(startDay + " 00:00:00");
  const [stopRange, setStopRange] = useState(stopDay + " 23:59:59");
  const [grandTotal, SetGrandTotal] = useState(0);
  const [calendarText, setCalendarText] = useState(t("this_month"));
  const [SYS_CODES, setSysCode] = useState([]);
  const [DIST_Codes, setDistCode] = useState([]);

  const dispatch = useDispatch();
  const selectedDayRange = useSelector(
    (state) => state.ReportReducer.selected_day_range
  );
  const { selected_dist } = useSelector((state) => state.ReportReducer);

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

  let myDistributors = [];

  if (myDistributors.length === 0) {
    myDistributors = GetDistributors();
  }

  useEffect(() => {
    let CODES = [];
    let Dist_Codes = [];
    if (selected_dist.company_name === "all") {
      myDistributors.length > 0 &&
        myDistributors.forEach((distributor) => {
          //   const thisDist = filter(myDistributors, {
          //     DIST_Code: distributor?.DIST_Code,
          //   })[0];
          myDistributors.length > 0 && CODES.push(distributor?.SYS_Code);
          myDistributors.length > 0 && Dist_Codes.push(distributor?.DIST_Code);
        });
    } else {
      CODES.push(selected_dist?.SYS_Code);
      Dist_Codes.push(selected_dist?.DIST_Code);
    }
    setSysCode(CODES);
    setDistCode(Dist_Codes);
  }, [myDistributors.length, selected_dist]);

  useEffect(() => {
    if (type === "mini-admin-summary") {
      const data = {
        startRange: startRange,
        stopRange: stopRange,
        sellerIds: SYS_CODES,
        companyCodes: DIST_Codes,
      };
      if (SYS_CODES.length > 0) {
        dispatch(setLoadingToDefault());
        dispatch(getMiniAdminSummary(data));
      }
    } else {
      const data = {
        sellerCompanyIds: SYS_CODES,
        email: type,
      };

      if (SYS_CODES.length > 0) {
        dispatch(setLoadingToDefault());
        dispatch(getMiniAdminOrdersByDateRange(data, startRange, stopRange));
      }
    }
  }, [SYS_CODES, SYS_CODES.length, startRange, stopRange]);
};
