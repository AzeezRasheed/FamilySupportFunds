import { GetDistributors } from "../../../Mini-Admin/GetDistributors";
import {
  VIEW_ALL_ORDERS,
  VIEW_SINGLE_ORDER,
  VIEW_ORDERS_BY_BUYER_CODE,
  GET_ALL_ORDERS,
  ASSIGN_ORDER_TO_DRIVER,
  GET_ALL_DRIVERS_BY_OWNER_ID,
  GET_ALL_DRIVERS,
  DIST_COMPLETED_ORDERS,
  CAPTURE_SALES,
  CAPTURE_SALES_START,
  CAPTURE_SALES_FAILED,
  CAPTURE_SALES_CLEAR,
  RELOAD_INVENTORY,
  RELOAD_INVENTORY_END,
  GET_ALL_ORDERS_BY_DATE,
  GET_MINI_ADMIN_SUMMARY,
  GET_ALL_VSM,
  GET_ALL_ORDERS_BY_DRIVER,
  RESET,
  ORDERS_DATA
} from "../actions/types";

const initial_state = {
  order: {},
  total_orders: {},
  all_orders: [],
  totalOrdersCount: 0,
  buyer_orders: [],
  all_system_orders: [],
  all_orders_by_date: [],
  all_drivers: [],
  all_orders_driver: [],
  assigned_orders: {},
  dist_completed_orders: [],
  captureSalesRes: {},
  loadingcaptureSalesRes: false,
  captureSalesError: null,
  reloadinv: false,
  vsms: [],
  loading: true,
  all_system_drivers: [],
  
};

const ordersReducer = (state = initial_state, action) => {
  switch (action.type) {
    case VIEW_ALL_ORDERS: {
      return { ...state, all_orders: action.all_orders, totalOrdersCount: action.totalOrdersCount };
    }
    case ORDERS_DATA: {
      return { ...state, total_orders: action.data };
    }
    case VIEW_SINGLE_ORDER: {
      return {
        ...state,
        order: action.single_order,
        loadingsales: false,
        loading: false,
      };
    }
    case RESET: {
      return { ...state, order: {}, loadingsales: true };
    }
    case VIEW_ORDERS_BY_BUYER_CODE: {
      return { ...state, buyer_orders: action.order };
    }
    case GET_ALL_ORDERS_BY_DRIVER: {
      return { ...state, all_orders_driver: action.all_orders_driver };
    }
    case GET_ALL_ORDERS: {
      return { ...state, all_system_orders: action.all_system_orders };
    }
    case GET_ALL_ORDERS_BY_DATE: {
      return {
        ...state,
        all_orders_by_date: action.all_orders_by_date,
        loading: action.loading,
      };
    }

    case GET_MINI_ADMIN_SUMMARY: {
      return {
        ...state,
        orders_by_date: action.orders_by_date,
        stocks_by_date: action.stocks_by_date,
        dists: action.dists,
        loading: action.loading,
      };
    }
    case ASSIGN_ORDER_TO_DRIVER: {
      return { ...state, assigned_orders: action.assigned_order };
    }
    case GET_ALL_DRIVERS_BY_OWNER_ID: {
      return { ...state, all_drivers: action.all_drivers };
    }
    case GET_ALL_DRIVERS: {
      return { ...state, all_system_drivers: action.all_system_drivers };
    }
    case DIST_COMPLETED_ORDERS: {
      return { ...state, dist_completed_orders: action.dist_completed_orders };
    }
    case CAPTURE_SALES_START: {
      return { ...state, loadingcaptureSalesRes: true };
    }
    case RELOAD_INVENTORY: {
      return { ...state, reloadinv: true };
    }
    case RELOAD_INVENTORY_END: {
      return { ...state, reloadinv: false };
    }
    case GET_ALL_VSM: {
      return { ...state, vsms: action.vsms };
    }
    case CAPTURE_SALES: {
      return {
        ...state,
        loadingcaptureSalesRes: false,
        captureSalesRes: action.payload,
        captureSalesError: null,
      };
    }
    case CAPTURE_SALES_FAILED: {
      return {
        ...state,
        loadingcaptureSalesRes: false,
        captureSalesRes: null,
        captureSalesError: action.payload,
      };
    }
    case CAPTURE_SALES_CLEAR: {
      return {
        ...state,
        loadingcaptureSalesRes: false,
        captureSalesRes: {},
        captureSalesError: null,
      };
    }
    default:
      return state;
  }
};

export default ordersReducer;
