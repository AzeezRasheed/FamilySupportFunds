import Calendar from "../../modules/Analytics/Assets/svgs/calender.svg";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { useDispatch } from "react-redux";
import { showAnalyticsCalendar, showCalendar } from "../../modules/Distributors/actions/DistributorAction";
import AnalyticsCalendar from "./AnalyticsCalendar";
import { useState } from "react";

const DateRangePicker = ({customDate}) => {
  const dispatch = useDispatch();
  const [isToggled, toggleCalender] = useState(false);    
  return (
     <AnalyticsCalendar setShowColendar={toggleCalender} showCalendar={isToggled} customDate={customDate} />
  );
};

export default DateRangePicker;
