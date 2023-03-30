import {
  ADD_INVENTORY_PRODUCT,
  DELETE_INVENTORY_PRODUCT,
  EDIT_INVENTORY_PRODUCT,
  VIEW_ALL_INVENTORY_PRODUCT,
  VIEW_SINGLE_INVENTORY_PRODUCT,
  VIEW_ALL_INVENTORY_COMPANY,
  GET_DISTRIBUTORS_CLOSING_STOCK,
  GET_CLOSING_STOCK,
  VIEW_ALL_LVAV_COMPANY,
  ALL_OUTOFSTOCK_PRODUCTS,
  VIEW_ALL_DEST_PRODUCT,
  VIEW_ALL_ORIGIN_PRODUCT,
  UPDATED_QUANTITY,
  UPDATED_QUANTITY_DAILY_STOCK,
  UPDATED_QUANTITY_DAILY_EMPTIES,
  UNSAVED_CHANGES,
  UNSAVED_CHANGES_DAILY_STOCK,
  DISCARD_CHANGES,
  PRESENT_DIST,
  SAVE_TRANSFER,
  ADD_INVENTORY,
  UNSAVED_EMPTIES_CHANGES,
  UNSAVED_EXPIRED_CHANGES,
  DISCARD_EMPTIES_CHANGES,
  RECEIVE_EMPTIES,
  RETURN_EMPTIES,
  VIEW_ALL_EMPTIES,
  RETURN_QUANTITY,
  ADD_EMPTIES,
  TOTAL_EMPTIES,
  EXPIRED_QUANTITY,
  RETURN_EMPTIES_BUTTON_CLICKED,
  RECEIVE_EMPTIES_BUTTON_CLICKED,
  EMPTIES_MODAL_BUTTON_CLICKED,
  RETURN_EXPIRED_QUANTITY,
  UPDATED_QUANTITY_SALES,
  UPDATED_QUANTITY_SALES_START,
  UPDATED_QUANTITY_SALES_FAILED,
  DISCARD_EXPIRED_CHANGES,
  INVENTORY_DOCUMENT_DETAILS,
  INVENTORY_CLEAR,
  WALK_IN_SALES_EMPTIES,
  WALK_IN_SALES_EMPTIES_START,
  WALK_IN_SALES_EMPTIES_FAILED,
  RETURN_SALES,
  RETURN_SALES_START,
  RETURN_SALES_FAILED,
  SELECTED_OTHERPRODUCTS,
  UNSAVED_OTHERPRODUCTS_CHANGES,
  OTHER_PRODUCTS_TO_SAVE,
  OTHER_PRODUCTS_TO_SAVE_START,
  VIEW_ABI_INVENTORY_COMPANY,
  SHOW_DAILY_STOCK_MODAL,
  SET_LOADING,
  ACCURATE_DAILY_STOCK_COUNT,
  UPDATE_DAILY_STOCK_COUNT_FAILED,
  UNSAVED_PRODUCT_CHANGES,
  SET_APPROVAL_MODAL,
} from "../actions/types";
import jwtDecode from 'jwt-decode';
import userManager from "../../../utils/userManager";

const initial_state = {
  product: {},
  all_products: [],
  all_inventory: [],
  closing_stock: [],
  dist_closing_stock:[],
  all_outOfStock: [],
  all_dest_products: [],
  all_origin_products: [],
  update: [],
  transfer_quantities: [],
  transfer_quantities_daily_stock: [],
  transfer_quantities_daily_empties: {},
  transferChange: false,
  transferChangeDailyStock: false,
  loading: true,
  present_dist: "",
  stockChange: false,
  emptiesChange: false,
  receive_empties_quantities: [],
  otherProductsChange: false,
  allEmpties: [],
  return_quantities: [],
  return_expired_quantities: [],
  totalEmpties: 0,
  loadingInventory: true,
  return_empties_button: false,
  empties_modal_button: false,
  receive_empties_button: false,
  updateQuantityAfterSales: {},
  loadingQuantityAfterSales: false,
  updateQuantityAfterSalesError: {},
  returnEmptiesModal: false,
  inventoryExist: true,
  inventoryDocumentDetails: {},
  approval_modal: false,
  walkinEmptiesRes: {},
  walkinEmptiesLoading: false,
  walkinEmptiesError: {},
  returnStatus: {},
  loadingReturnStatus: false,
  receive_new_stock: false,
  returnError: {},
  inventory_type: "",
  low_stock_values: [],
  selected_other_products: [],
  otherProductsToSave: [],
  otherProductsToSaveLoading: false,
  dailyStockModal: false,
  error: false,
  error_message: '',
  stock_count_updated: false
};
const token = localStorage.getItem("userData");
let role = null;
let AuthData = null;

if (token) {
  AuthData = jwtDecode(token);
  role = AuthData?.roles;
}

const InventoryReducer = (state = initial_state, action) => {
  switch (action.type) {
    case ADD_INVENTORY_PRODUCT:
      return {
        ...state,
        all_products: [...state.all_products, action.payload],
      };
    case VIEW_ALL_INVENTORY_PRODUCT: {
      return { ...state, all_products: action.all_products };
    }
    case EDIT_INVENTORY_PRODUCT: {
      return { ...state, product: action.payload };
    }
    case VIEW_ALL_INVENTORY_COMPANY: {
      return {
        ...state,
        all_inventory: action.all_inventory,
        loadingInventory: false,
        reloadInventoryState: action.reloadInventory,
        inventoryExist: action.inventoryExist,
      };
    }
    case GET_CLOSING_STOCK: {
      return {
        ...state,
        closing_stock: action.closing_stock,
        loadingInventory: false,
        
      };
    }
    case GET_DISTRIBUTORS_CLOSING_STOCK: {
      return {
        ...state,
        dist_closing_stock: action.dist_closing_stock,
        loadingInventory: false,
        
      };
    }
    case VIEW_ABI_INVENTORY_COMPANY: {
      return {
        ...state,
        abi_inventory: action.abi_inventory,
        loadingInventory: false,
        reloadInventoryState: action.reloadInventory,
        inventoryExist: action.inventoryExist,
      };
    }
    case VIEW_ALL_LVAV_COMPANY: {
      return {
        ...state,
        low_stock_values: action.low_stock_values,
      };
    }
    case INVENTORY_CLEAR: {
      return {
        ...state,
        // all_inventory: [],
        loadingInventory: true,
      };
    }
    case ALL_OUTOFSTOCK_PRODUCTS: {
      return {
        ...state,
        all_outOfStock: action.all_outOfStock,
      };
    }

    case VIEW_SINGLE_INVENTORY_PRODUCT: {
      return { ...state, product: action.payload };
    }
    case VIEW_ALL_DEST_PRODUCT: {
      return { ...state, all_dest_products: action.all_dest_products };
    }
    case VIEW_ALL_ORIGIN_PRODUCT: {
      return { ...state, all_origin_products: action.all_origin_products };
    }
    case UPDATED_QUANTITY: {
      return { ...state, transfer_quantities: action.transfer_quantities };
    }
    case ACCURATE_DAILY_STOCK_COUNT: {
      return {
        ...state,
        loading: action.loading,
        stock_count_updated: true
      }
    }
    case UPDATE_DAILY_STOCK_COUNT_FAILED: {
      return {
        ...state,
        error: action.error,
        error_message: action.errorMessage,
        stock_count_updated: true
      }
    }
    case UPDATED_QUANTITY_DAILY_STOCK: {
      return {
        ...state,
        transfer_quantities_daily_stock: action.transfer_quantities,
      };
    }
    case UPDATED_QUANTITY_DAILY_EMPTIES: {
      return {
        ...state,
        transfer_quantities_daily_empties: action.transfer_empties,
      };
    }
    case  SHOW_DAILY_STOCK_MODAL: {
      const doAction = role==="Mini-Admin" ? false : action.dailyStockModal
      return {
        ...state,
        dailyStockModal: doAction,
      };
      
    }
    case RETURN_QUANTITY: {
      return { ...state, return_quantities: action.return_quantities };
    }
    case OTHER_PRODUCTS_TO_SAVE: {
      return { ...state, otherProductsToSave: action.otherProductsToSave };
    }
    case OTHER_PRODUCTS_TO_SAVE_START: {
      return { ...state, otherProductsToSaveLoading: action.loading };
    }
    case RETURN_EXPIRED_QUANTITY: {
      return {
        ...state,
        return_expired_quantities: action.return_expired_quantities,
      };
    }
    case UNSAVED_CHANGES: {
      let stateAction =
        action.return_empties_modal !== "" ||
        action.return_empties_modal !== undefined
          ? {
              ...state,
              transferChange: action.transfer_change,
              returnEmptiesModal: action.return_empties_modal,
            }
          : {
              ...state,
              transferChange: action.transfer_change,
            };
      return stateAction;
    }
    case UNSAVED_PRODUCT_CHANGES: {
      return {
        ...state,
        receive_new_stock: action.receive_new_stock,
      };
    }
    case UNSAVED_CHANGES_DAILY_STOCK: {
      return {
        ...state,
        transferChangeDailyStock: action.transfer_change,
      };
    }
    case SET_APPROVAL_MODAL: {
      return {
        ...state,
        approval_modal: action.approval_modal,
      };
    }
    case DISCARD_CHANGES: {
      return { ...state, transferChange: false };
      //return {state}//clears the whole store
    }
    case PRESENT_DIST: {
      return { ...state, present_dist: action.present_dist };
    }
    case SAVE_TRANSFER: {
      return {
        ...state,
        priceChange: false,
      };
    }
    case ADD_INVENTORY: {
      return {
        ...state,
        stockChange: false,
        loading: action.loading,
      };
    }
    case UNSAVED_OTHERPRODUCTS_CHANGES: {
      return { ...state, otherProductsChange: action.other_products_change };
    }
    case UNSAVED_EXPIRED_CHANGES: {
      return { ...state, expiredChange: action.expired_change };
    }
    case UNSAVED_EMPTIES_CHANGES: {
      return { ...state, emptiesChange: action.empties_change };
    }
    case DISCARD_EMPTIES_CHANGES: {
      return { ...state, emptiesChange: false };
      //return {state}//clears the whole store
    }
    case DISCARD_EXPIRED_CHANGES: {
      return { ...state, expiredChange: false };
      //return {state}//clears the whole store
    }
    case RECEIVE_EMPTIES: {
      return { ...state, receive_empties_quantities: action.receive_empties };
    }
    case VIEW_ALL_EMPTIES: {
      return { ...state, allEmpties: action.payload };
    }
    case ADD_EMPTIES: {
      return { ...state, totalEmpties: action.payload };
    }
    case TOTAL_EMPTIES: {
      return { ...state, totalEmpties: action.payload };
    }
    case RETURN_EMPTIES_BUTTON_CLICKED: {
      return { ...state, return_empties_button: action.payload };
    }
    case RECEIVE_EMPTIES_BUTTON_CLICKED: {
      return { ...state, receive_empties_button: action.payload };
    }
    case EMPTIES_MODAL_BUTTON_CLICKED: {
      return { ...state, empties_modal_button: action.payload };
    }

    case UPDATED_QUANTITY_SALES_START: {
      return { ...state, loadingQuantityAfterSales: true };
    }
    case UPDATED_QUANTITY_SALES: {
      return {
        ...state,
        loadingQuantityAfterSales: false,
        updateQuantityAfterSales: action.payload,
      };
    }
    case UPDATED_QUANTITY_SALES_FAILED: {
      return {
        ...state,
        loadingQuantityAfterSales: false,
        updateQuantityAfterSales: {},
        updateQuantityAfterSalesError: action.payload,
      };
    }
    case INVENTORY_DOCUMENT_DETAILS: {
      return {
        ...state,
        inventoryDocumentDetails: action.payload,
      };
    }
    case WALK_IN_SALES_EMPTIES_START: {
      return {
        ...state,
        walkinEmptiesLoading: true,
      };
    }
    case WALK_IN_SALES_EMPTIES: {
      return {
        ...state,
        walkinEmptiesRes: action.payload,
        walkinEmptiesLoading: false,
      };
    }
    case WALK_IN_SALES_EMPTIES_FAILED: {
      return {
        ...state,
        walkinEmptiesError: action.payload,
        walkinEmptiesRes: null,
        walkinEmptiesLoading: false,
      };
    }

    case RETURN_SALES_START: {
      return {
        ...state,
        loadingReturnStatus: true,
      };
    }
    case RETURN_SALES: {
      return {
        ...state,
        loadingReturnStatus: false,
        returnStatus: action.payload,
        returnError: null,
      };
    }
    case RETURN_SALES_FAILED: {
      return {
        ...state,
        loadingReturnStatus: false,
        returnStatus: null,
        returnError: action.payload,
      };
    }
    case SELECTED_OTHERPRODUCTS: {
      return {
        ...state,
        selected_other_products: action.selected_other_products,
      };
    }
    case SET_LOADING: {
      return {
        ...state,
        loadingInventory: action.loadingInventory
      }
    }
    default:
      return state;
  }
}

export default InventoryReducer;

