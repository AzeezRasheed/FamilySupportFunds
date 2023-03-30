import {
  UNSAVED_DIST_CHANGES,
  VIEW_ALL_PRODUCTS,
  VIEW_ALL_PRODUCTS_NON_ABI,
  DIST_SAVE_PRICING,
  DISCARD_CHANGES,
  UPDATED_PRODUCTS,
  UPDATED_DIST_PRODUCTS,
  COUNTRY_PRODUCTS,
  COUNTRY_PRODUCTS_START,
  COUNTRY_PRODUCTS_FAILURE,
} from "../actions/types";

const initial_state = {
  allProducts: [],
  allProductsNonAbi: [],
  distPriceChange: false,
  updatedProducts: [],
  loading: true,
  loadingCountryProduct: false,
  countryProduct: [],
  countryProductError: {},
};


const DistributorPricingReducer = (state = initial_state, action) => {
  const { type, all_products, all_products_non_abi, dist_price_change, updated_products, clear, payload } = action;
  switch (type) {
    case VIEW_ALL_PRODUCTS: {
      return { ...state, allProducts: all_products };
    }
    case VIEW_ALL_PRODUCTS_NON_ABI: {
      return { ...state, allProductsNonAbi: all_products_non_abi };
    }
    case UNSAVED_DIST_CHANGES: {
      return { ...state, distPriceChange: dist_price_change };
    }
    case UPDATED_DIST_PRODUCTS: {
      return { ...state, updatedProducts: updated_products };
    }
    case DISCARD_CHANGES: {
      return { ...state, distPriceChange: false };
      //return {clear_state}//clears the whole store
    }
    case DIST_SAVE_PRICING: {
      return {
        ...state,
        allProducts: updated_products,
        distPriceChange: false,
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

export default DistributorPricingReducer;
