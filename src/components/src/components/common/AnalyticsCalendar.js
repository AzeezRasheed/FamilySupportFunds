import React, { useEffect, useState } from "react";
import DateIcon from "../../modules/Analytics/Assets/svgs/calender.svg";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  setAnalyticsSelectedDateRange,
  setSelectedDateRange,
  showAnalyticsCalendar,
  showCalendar,
} from "../../modules/Distributors/actions/DistributorAction";
import countryConfig from "../../utils/changesConfig.json";
import { getLocation } from "../../utils/getUserLocation";
import { useTranslation } from "react-i18next";
import { setDateFilter } from "../../modules/Analytics/pages/actions/analyticsAction";

const AnalyticsCalendar = ({ setShowColendar, showCalendar, customDate }) => {
  const { t } = useTranslation();
  const [userCountry, setUserCountry] = useState(
    useSelector((state) => state.Auth.sessionUserData).country
  );

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);

  const dispatch = useDispatch();
  const { show_analytics_calendar } = useSelector((state) => state.DistReducer);
  const { dateFilter, selectedDayRange } = useSelector(
    (state) => state.AllAnalyticsReducer
  );

  const currentDateISO = moment().toISOString();
  const todayStartTime = moment(currentDateISO).format("YYYY-MM-DD");
  const defaultV = {
    year: parseInt(moment(currentDateISO).format("YYYY")),
    month: parseInt(moment(currentDateISO).format("MM")),
    day: parseInt(moment(currentDateISO).format("DD")),
    // time: "00:00:00",
  };

  const defaultValue = {
    from: defaultV,
    to: defaultV,
  };
  const [selectedDayRang, setSelectedDayRang] = useState(defaultValue);

  useEffect(() => {
    dateFilter !== "Date_Range" && setSelectedDayRang(defaultValue);
  }, [dateFilter]);

  const apply = () => {
    if (selectedDayRang.from === null) {
      selectedDayRang.to = selectedDayRang.from;
    }
    dispatch(setAnalyticsSelectedDateRange(selectedDayRang));
    setShowColendar(false);
    dispatch(setDateFilter("Date_Range"));
  };

  const closeCalender = () => {
    setSelectedDayRang(defaultValue);
    setShowColendar(false);
  };
  return (
    <div className="relative">
      <div
        className="dropdown__toggle flex relative"
        style={{ width: "240px" }}
        onClick={() => setShowColendar(!showCalendar)}
      >
        <div className="w-100 h-100 flex items-center px-3 flex-between">
          <span>Date: {dateFilter === "Date_Range" && customDate}</span>
          <span>
            <img src={DateIcon} alt="" />
          </span>
        </div>
      </div>
      <div
        className="calendar__wizard"
        style={{
          marginRight: "31%",
          position: "absolute",
          display: showCalendar ? "block" : "none",
        }}
      >
        <Calendar
          value={selectedDayRang}
          onChange={setSelectedDayRang}
          calendarClassName="custom-calendar"
          colorPrimary={countryConfig[userCountry].primaryColor} // added this
          colorPrimaryLight="rgba(254, 247, 247)" // and this
          // calendarTodayClassName="custom-today-day"
          shouldHighlightWeekends
          renderFooter={() => (
            <>
              {/* <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                {selectedDayRange?.from?.day +
                  "/" +
                  selectedDayRange?.from?.month +
                  "/" +
                  selectedDayRange?.from?.year}
                {selectedDayRange?.to &&
                selectedDayRange?.from !== selectedDayRange?.to
                  ? " - " +
                    selectedDayRange?.to?.day +
                    "/" +
                    selectedDayRange?.to?.month +
                    "/" +
                    selectedDayRange?.to?.year
                  : ""}
              </p> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "1rem 2rem",
                }}
              >
                <button
                  type="button"
                  onClick={closeCalender}
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid #BCBDC2",
                    color: "#00000",
                    fontWeight: "bold",
                    fontSize: "14px",
                    borderRadius: "0.5rem",
                    padding: "7px 2rem",
                  }}
                >
                  {t("clear")}
                </button>
                <button
                  type="button"
                  onClick={apply}
                  style={{
                    marginLeft: "2%",
                    backgroundColor: countryConfig[userCountry].buttonColor,
                    color: countryConfig[userCountry].textColor,
                    fontWeight: "bold",
                    fontSize: "14px",
                    borderRadius: "0.5rem",
                    padding: "7px 2rem",
                  }}
                >
                  {t("apply")}
                </button>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default AnalyticsCalendar;
