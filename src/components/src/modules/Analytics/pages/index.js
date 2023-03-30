import React, { useState, useRef, useEffect } from "react";
import AnalyticsDasboard from "../Components/Dashboard";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { dashboardTabHeaderData as header } from "../../../utils/data";
import { dashboardTableContent as content } from "../../../utils/data";
import Tab from "../../../components/common/Tabs";
import Dashboard from "../../../Layout/Dashboard";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import {
  getInventoryMgtData,
  getSalesPerformance,
  setDateFilter,
} from "./actions/analyticsAction";
// import { getAllDistributors } from "../../Admin/KPO/actions/UsersAction";
import { getSingleDistributor } from "../../Admin/pages/actions/adminDistributorAction";
import {
  resetAnalyticsCalendar,
  showCalendar,
} from "../../Distributors/actions/DistributorAction";
import Reports from "../Components/Reports";

const Analytics = ({ location }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [userCountry, setUserCountry] = useState("Ghana");
  const [openTab, setOpenTab] = useState(1);
  const { Dist_Code } = useParams();
  // const [dateFilter, setDateFilter] = useState("TODAY");
  const distDetails = useSelector(
    (state) => state.AllDistributorReducer.distributor
  );
  const currentDateISO = moment().toISOString();
  const todayStartTime =
    moment(currentDateISO).format("YYYY-MM-DD") + " 00:00:00";
  const todayEndTime =
    moment(currentDateISO).format("YYYY-MM-DD") + " 23:59:59";
  const [startRange, setStartRange] = useState(todayStartTime);
  const [stopRange, setStopRange] = useState(todayEndTime);
  const [customDate, setCustomDate] = useState("");
  const selectedDayRange = useSelector(
    (state) => state.DistReducer.analytics_selected_day_range
  );
  const { dateFilter } = useSelector((state) => state.AllAnalyticsReducer);

  // const onChange = (item) => {
  //   setDateFilter(item.value)
  // }

  useEffect(() => {
    dispatch(getSingleDistributor(Dist_Code));
  }, []);

  useEffect(() => {
    console.log(selectedDayRange);
    if (dateFilter !== "Date_Range") {
      setStartRange(todayStartTime);
      setStopRange(todayEndTime);
      // dispatch(resetAnalyticsCalendar());
    }
    // if(startRange) {
    // setDateFilter("Date_Range")
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
      if (start !== stop) {
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
        setCustomDate("");
      }
    } else {
      // dispatch(resetAnalyticsCalendar());
    }
    // }
    // else {
    // dispatch(setDateFilter("TODAY"));
    // }

    dispatch(getInventoryMgtData(startRange, stopRange, dateFilter, Dist_Code));
    distDetails?.SYS_Code &&
      dispatch(
        getSalesPerformance(
          startRange,
          stopRange,
          dateFilter,
          distDetails?.SYS_Code
        )
      );
    //}
  }, [
    distDetails?.SYS_Code,
    selectedDayRange,
    startRange,
    dateFilter,
    stopRange,
    Dist_Code,
  ]);

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  });

  const borderActive = countryConfig[userCountry].borderBottomColor;
  const buttonColor = countryConfig[userCountry].buttonColor;
  const color = countryConfig[userCountry].textColor;

  const { activeTab } = useSelector((state) => state.DashboardTabReducer);

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-5 pb-15 md:pb-36 lg:pb-36">
        <Tab
          dataHeader={header}
          onChange={""}
          customDate={customDate}
          dataSection={true}
          borderActive={borderActive}
          dataContent={content}
          openTab={openTab}
          setOpenTab={setOpenTab}
          top="mt-4"
          analytics={true}
        >
          {activeTab === 1 ? (
            <AnalyticsDasboard />
          ) : (
            <Reports location={location} />
          )}
          
        </Tab>
      </div>
    </Dashboard>
  );
};

export default Analytics;
