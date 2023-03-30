import {
  SHOW_CALENDAR,
  SELECTED_DATE_RANGE,
  GET_ALL_STOCKS_BY_DATE,
  SHOW_MINI_DISTRIBUTORS,
  SELECTED_DIST,
  DAILY_STOCK_AVERAGE_ACCURACY,
  GET_MINI_ADMIN_DAILY_STOCK_REPORT,
  GET_DAILY_STOCK_REPORT,
  GET_CLOSING_STOCK_REPORT,
  GET_MINI_ADMIN_CLOSING_STOCK_REPORT,
  GET_ALL_DISTRIBUTORS_STOCK_LEVEL,
  GET_ASSIGNED_DISTRIBUTORS_STOCK_LEVEL,
  SET_LOADING,
  GET_ALL_DISTRIBUTORS_STOCK_LEVEL_WITH_SKU,
  GET_ASSIGNED_DISTRIBUTORS_STOCK_LEVEL_WITH_SKU,
} from "../actions/types";

const initial_state = {
  dist_code: "",
  show_calendar: false,
  show_mini_admin_dist: false,
  selected_day_range: {},
  all_stocks_by_date: [],
  loading: true,
  selected_dist: { company_name: "all" },
  daily_stock_report: [],
  mini_admin_daily_stock_report: [],
  daily_stock_average_accuracy: "",
  distributors_stock: [],
  distributors_stock_with_sku: [],
  closing_stock_report: [], 
  mini_admin_closing_stock_report: [], 
};

const ReportReducer = (state = initial_state, action) => {
  switch (action.type) {
    case SHOW_CALENDAR:
      return {
        ...state,
        show_calendar: action.show,
      };
    case SET_LOADING: {
      return {
        ...state,
        loading: action.loading
      }
    }
    case SHOW_MINI_DISTRIBUTORS:
      return {
        ...state,
        show_mini_admin_dist: action.show,
      };
    case SELECTED_DATE_RANGE:
      return {
        ...state,
        selected_day_range: action.range,
      };
    case SELECTED_DIST:
      return {
        ...state,
        selected_dist: action.selected_dist,
      };
    case GET_ALL_STOCKS_BY_DATE: {
      return {
        ...state,
        all_stocks_by_date: action.all_stocks_by_date,
        loading: action.loading,
      };
    }
    case GET_DAILY_STOCK_REPORT: {
      return {
        ...state,
        daily_stock_report: action.daily_stock_report,
        loading: action.loading
      };
    } 
    case GET_CLOSING_STOCK_REPORT: {
      return {
        ...state,
        closing_stock_report: action.closing_stock_report,
        loading: action.loading
      };
    } 
    case GET_MINI_ADMIN_DAILY_STOCK_REPORT: {
      return {
        ...state,
        mini_admin_daily_stock_report: action.mini_admin_daily_stock_report,
        loading: action.loading
      };
    } 
    case GET_MINI_ADMIN_CLOSING_STOCK_REPORT: {
      return {
        ...state,
        mini_admin_closing_stock_report: action.mini_admin_closing_stock_report,
        loading: action.loading
      };
    }
    case DAILY_STOCK_AVERAGE_ACCURACY: {
      return {
        ...state,
        daily_stock_average_accuracy: action.daily_stock_average_accuracy,
        loading: action.loading
      };
    } 
    case GET_ALL_DISTRIBUTORS_STOCK_LEVEL: {
      return {
        ...state,
        distributors_stock: action.distributors_stock,
        loading: action.loading
      };
    }
    case GET_ASSIGNED_DISTRIBUTORS_STOCK_LEVEL: {
      return {
        ...state,
        distributors_stock: action.distributors_stock,
        loading: action.loading
      };
    }
    case GET_ALL_DISTRIBUTORS_STOCK_LEVEL_WITH_SKU: {
      return {
        ...state,
        distributors_stock_with_sku: action.distributors_stock_with_sku
      };
    }
    case GET_ASSIGNED_DISTRIBUTORS_STOCK_LEVEL_WITH_SKU: {
      return {
        ...state,
        distributors_stock_with_sku: action.distributors_stock_with_sku
      };
    }
    default:
      return state;
  }
};
export default ReportReducer;
