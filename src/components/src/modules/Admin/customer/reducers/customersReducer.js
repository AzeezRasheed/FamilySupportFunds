import {
  ADD_CUSTOMERS,
  DELETE_CUSTOMERS,
  CURRENT_CUSTOMER,
  EDIT_CUSTOMERS,
  VIEW_ALL_DISTRIBUTOR_CUSTOMERS,
  VIEW_ALL_DISTRIBUTOR_CUSTOMER_ORDERS,
  VIEW_SINGLE_DISTRIBUTOR_CUSTOMER,
  VIEW_SINGLE_DISTRIBUTOR_CUSTOMER_ORDER,
  ALL_CUSTOMERS,
  ALL_ONE_OFF_CUSTOMERS_START,
  ALL_ONE_OFF_CUSTOMERS,
  ALL_ONE_OFF_CUSTOMERS_FAILED,
  ADD_ONE_OFF_CUSTOMERS_START,
  ADD_ONE_OFF_CUSTOMERS,
  ADD_ONE_OFF_CUSTOMERS_FAILED,
  CLEAR_ONE_OFF_CUSTOMERS,
  PAGINATED_CUSTOMERS
} from "../actions/types";

const initial_state = {
  customer: {},
  all_dist_customers: [],
  all_dist_customers_order: [],
  customer_order: [],
  distributor_orders: [], //all orders of a particular distributor
  all_customers: [],
  loadAllCustomers: true,
  allOneOffCustomers: [],
  loadingallOneOffCustomers: false,
  allOneOffCustomersError: {},
  addOneOffCustomers: {},
  loadingAddOneOffCustomers: false,
  addOneOffCustomersError: {},
  total_pages: 1,
  paginated_customers: []
};

const customerReducer = (state = initial_state, action) => {
  switch (action.type) {
    case ADD_CUSTOMERS:
      return { ...state, all_dist_customers: [...state.all_dist_customers, action.customer.data.result] }
    case VIEW_ALL_DISTRIBUTOR_CUSTOMERS: {
      return { ...state, all_dist_customers: action.all_customers };
    }
    case ALL_CUSTOMERS: {
      return { ...state, all_customers: action.all_customers, loadAllCustomers: false };
    }
    case PAGINATED_CUSTOMERS: {
      return { 
        ...state, 
        paginated_customers: action.paginated_customers, 
        total_pages: action.total_pages
      };
    }
    case VIEW_ALL_DISTRIBUTOR_CUSTOMER_ORDERS: {
      return { ...state, all_dist_customers_order: action.all_dist_customers_order };
    }
    case VIEW_SINGLE_DISTRIBUTOR_CUSTOMER_ORDER: {
      return { ...state, customer_order: action.orders };
    }
    case EDIT_CUSTOMERS: {
      return { ...state, customer: action.customer }
    }
    case CURRENT_CUSTOMER:{
      return {...state, customer:action.customer}
    }
    case VIEW_SINGLE_DISTRIBUTOR_CUSTOMER: {
      return { ...state, customer: action.customer }
    }
    case ALL_ONE_OFF_CUSTOMERS_START: {
      return { ...state, loadingallOneOffCustomers: true }
    }

    case ALL_ONE_OFF_CUSTOMERS: {
      return { ...state, loadingallOneOffCustomers: false, allOneOffCustomers: action.payload }
    }
    case ALL_ONE_OFF_CUSTOMERS_FAILED: {

      return { ...state, loadingallOneOffCustomers: false, allOneOffCustomers: null, allOneOffCustomersError: action.payload }
    }
    case ADD_ONE_OFF_CUSTOMERS_START: {
      return { ...state, loadingAddOneOffCustomers: true }
    }

    case ADD_ONE_OFF_CUSTOMERS: {
      return { ...state, loadingAddOneOffCustomers: false, addOneOffCustomers: action.payload }
    }
    case ADD_ONE_OFF_CUSTOMERS_FAILED: {

      return { ...state, loadingAddOneOffCustomers: false, addOneOffCustomersError: action.payload, addOneOffCustomers: null }
    }
    case CLEAR_ONE_OFF_CUSTOMERS: {

      return { ...state, loadingAddOneOffCustomers: false, addOneOffCustomersError: {}, addOneOffCustomers: {} }
    }
    default:
      return state;
  }
}

export default customerReducer;


