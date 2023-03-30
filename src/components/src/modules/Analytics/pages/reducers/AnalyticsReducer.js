import {
  GET_SALES_PERFORMANCE,
  GET_INVENTORY_MGT,
  SET_TOTAL_SELL_IN,
  SET_TOTAL_SELL_OUT,
  SET_DATE_FILTER,
} from "../actions/types";

const initial_state = {
  sell_out_products: [],
  sell_in_products: [],
  salesAnalysis: {},
  total_sell_in: 0,
  total_sell_out: 0,
  dateFilter: "TODAY"
};

const AnalyticsReducer = (state = initial_state, action) => {
  switch (action.type) {
    case GET_SALES_PERFORMANCE:
      return {
        ...state,
        salesAnalysis: action.payload,
        sell_out_products: action.payload.Cases.Cases_Count_By_ProductType,
        total_sell_out: action.payload.Cases.Total_Cases_Sold,
      };
    case GET_INVENTORY_MGT:
      return {
        ...state,
        sell_in_products: action.payload.result,
        total_sell_in: action.payload.totalSellIn,
      };
    case SET_TOTAL_SELL_IN:
      return {
        ...state,
        total_sell_in: action.payload,
      };
    case SET_TOTAL_SELL_OUT:
      return {
        ...state,
        total_sell_out: action.payload,
      };
      case SET_DATE_FILTER:
        return {
          ...state, dateFilter: action.payload
        }
    default:
      return state;
  }
};

export default AnalyticsReducer;
