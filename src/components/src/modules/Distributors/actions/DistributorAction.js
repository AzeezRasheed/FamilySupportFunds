import moment from "moment";
import {
  DIST_CODE,
  SHOW_CALENDAR,
  SELECTED_DATE_RANGE,
  SHOW_ANALYTICS_CALENDAR,
  SELECTED_ANALYTICS_DATE_RANGE,
  RESET_SELECTED_ANALYTICS_DATE_RANGE,
} from "./types";

export const setDistCode = (dist) => (dispatch) => {
  dispatch({
    type: DIST_CODE,
    dist_code: dist,
  });
};

export const showCalendar = (action) => (dispatch) => {
  dispatch({
    type: SHOW_CALENDAR,
    show: action,
  });
};

export const setSelectedDateRange = (range) => (dispatch) => {
  dispatch({
    type: SELECTED_DATE_RANGE,
    range: range,
  });
};

export const showAnalyticsCalendar = (action) => (dispatch) => {
  dispatch({
    type: SHOW_ANALYTICS_CALENDAR,
    show: action,
  });
};

export const setAnalyticsSelectedDateRange = (range) => (dispatch) => {
  dispatch({
    type: SELECTED_ANALYTICS_DATE_RANGE,
    range: range,
  });
}

export const resetAnalyticsCalendar = () => (dispatch) => {
   const currentDateISO = moment().toISOString();
   const defaultD = {
     year: parseInt(moment(currentDateISO).format("YYYY")),
     month: parseInt(moment(currentDateISO).format("MM")),
     day: parseInt(moment(currentDateISO).format("DD")),
     // time: "00:00:00",
   };
dispatch({
  type: RESET_SELECTED_ANALYTICS_DATE_RANGE,
  range: {from: defaultD, to: defaultD}
});
}