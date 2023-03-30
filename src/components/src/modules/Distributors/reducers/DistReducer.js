import {
  DIST_CODE,
  SHOW_CALENDAR,
  SELECTED_DATE_RANGE,
  SHOW_ANALYTICS_CALENDAR,
  SELECTED_ANALYTICS_DATE_RANGE,
  RESET_SELECTED_ANALYTICS_DATE_RANGE
} from "../actions/types";

const initial_state = {
  dist_code: "",
  show_calendar: false,
  show_analytics_calendar: false,
  selected_day_range: {},
  analytics_selected_day_range: {}
};

const DistReducer = (state = initial_state, action) => {
    switch (action.type) {
      case DIST_CODE:
        return {
          ...state,
          dist_code: action.dist_code,
        };
      case SHOW_CALENDAR:
        return {
          ...state,
          show_calendar: action.show,
        };
      case SELECTED_DATE_RANGE:
        return {
          ...state,
          selected_day_range: action.range,
        };
      case SHOW_ANALYTICS_CALENDAR:
        return {
          ...state,
          show_analytics_calendar: action.show,
        };
      case SELECTED_ANALYTICS_DATE_RANGE:
        return {
          ...state,
          analytics_selected_day_range: action.range,
        };
        case RESET_SELECTED_ANALYTICS_DATE_RANGE:
          return {
            ...state, analytics_selected_day_range: {}
          }
      default:
        return state;
    }
    
}
export default DistReducer;