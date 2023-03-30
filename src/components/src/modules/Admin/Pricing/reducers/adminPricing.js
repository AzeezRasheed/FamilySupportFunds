import {
  UNSAVED_CHANGES,
  VIEW_ALL_PRODUCTS,
  SAVE_PRICING,
  DISCARD_CHANGES,
  UPDATED_PRODUCTS,
  UPDATED_INVENTORY,
  COUNTRY_PRODUCTS,
  COUNTRY_PRODUCTS_START,
  VIEW_ALL_PRODUCTS_NON_ABI,
  COUNTRY_PRODUCTS_FAILURE,
  UNSAVED_QUANTITY_CHANGES
} from "../actions/types";

const initial_state = {
  allProducts: [],
  allProductsNonAbi: [],
  priceChange: false,
  quantityChange: false,
  updatedProducts: [],
  updatedInventory: [],
  loading: true,
  loadingCountryProduct: false,
  countryProduct: [],
  countryProductError: {},
};


const AdminPricingReducer = (state = initial_state, action) => {
  const { type, all_products, all_products_non_abi, price_change, quantity_change, updated_quantity, updated_products, clear, payload, price_loading } = action;
  switch (type) {
    case VIEW_ALL_PRODUCTS: {
      return { ...state, allProducts: all_products };
    }
    case VIEW_ALL_PRODUCTS_NON_ABI: {
      return { ...state, allProductsNonAbi: all_products_non_abi };
    }
    case UNSAVED_CHANGES: {
      return { ...state, priceChange: price_change };
    }
    case UNSAVED_QUANTITY_CHANGES: {
      return { ...state, quantityChange: quantity_change };
    }
    case UPDATED_PRODUCTS: {
      return { ...state, updatedProducts: updated_products };
    }
    case UPDATED_INVENTORY: {
      return { ...state, updatedInventory: updated_quantity };
    }
    case DISCARD_CHANGES: {
      return { ...state, priceChange: false };
      //return {clear_state}//clears the whole store
    }
    case SAVE_PRICING: {
      return {
        ...state,
        allProducts: updated_products,
        priceChange: false,
        loading: price_loading
      };
    }
    case COUNTRY_PRODUCTS_START: {
      return {
        ...state,
        loadingCountryProduct: true,

      };
    }
    case COUNTRY_PRODUCTS: {
      return {
        ...state,
        countryProduct: payload,
        loadingCountryProduct: false,

      };
    }
    case COUNTRY_PRODUCTS_FAILURE: {
      return {
        ...state,
        countryProductError: payload,
        loadingCountryProduct: false,

      };
    }
    default:
      return state;
  }
};

export default AdminPricingReducer;
