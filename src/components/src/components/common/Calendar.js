import React, { useEffect, useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDateRange, showCalendar } from "../../modules/Distributors/actions/DistributorAction";
import countryConfig from "../../utils/changesConfig.json";
import { getLocation } from "../../utils/getUserLocation";
import { useTranslation } from "react-i18next";

const CalendarComponent = ({maximumDate, defaultDate}) => {
  const {t} = useTranslation()
  const [userCountry, setUserCountry] = useState(
     useSelector(state => state.Auth.sessionUserData).country
  );

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);

  const dispatch = useDispatch()
  const show_calendar = useSelector((state) => state.DistReducer.show_calendar);

  const currentDateISO = moment().toISOString();
  const todayStartTime = moment(currentDateISO).format("YYYY-MM-DD");
  const defaultFrom = {
    year: parseInt(moment(currentDateISO).format("YYYY")),
    month: parseInt(moment(currentDateISO).format("MM")),
    day: parseInt(moment(currentDateISO).format("DD")),
    // time: "00:00:00",
  };
  const defaultTo = {
    year: parseInt(moment(currentDateISO).format("YYYY")),
    month: parseInt(moment(currentDateISO).format("MM")),
    day: parseInt(moment(currentDateISO).format("DD")),
  };
  const defaultValue = {
    from: defaultDate || defaultFrom,
    to:  defaultDate || defaultTo,
  };
  const [selectedDayRange, setSelectedDayRange] = useState(defaultValue);
  const apply = () => {
    if(selectedDayRange.to === null){
      selectedDayRange.to = selectedDayRange.from
    }
    dispatch(setSelectedDateRange(selectedDayRange))
    dispatch(showCalendar(false));
  }

  const closeCalender = () => {
    setSelectedDayRange(defaultValue);
    dispatch(showCalendar(false))
    
  };
  return (
    <div  className={`${show_calendar ? "block" : "hidden"}`}>
      <Calendar
        
        value={selectedDayRange}
        onChange={setSelectedDayRange}
        calendarClassName="custom-calendar"
        colorPrimary={countryConfig[userCountry].primaryColor} // added this
        colorPrimaryLight="rgba(254, 247, 247)" // and this
        // calendarTodayClassName="custom-today-day"
        maximumDate={maximumDate}
        shouldHighlightWeekends
        renderFooter={() => (
          <>
            <p
              style={{ textAlign: "center", fontWeight: "bold", fontSize: 14 }}
            >
              {selectedDayRange.from.day +
                "/" +
                selectedDayRange.from.month +
                "/" +
                selectedDayRange.from.year}
              {selectedDayRange.to &&
              selectedDayRange.from !== selectedDayRange.to
                ? " - " +
                  selectedDayRange.to.day +
                  "/" +
                  selectedDayRange.to.month +
                  "/" +
                  selectedDayRange.to.year
                : ""}
            </p>
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
  );
};

export default CalendarComponent;
