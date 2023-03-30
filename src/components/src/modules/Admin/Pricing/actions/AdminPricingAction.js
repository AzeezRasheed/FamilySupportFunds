import {
  UNSAVED_CHANGES,
  UNSAVED_DIST_CHANGES,
  UNSAVED_QUANTITY_CHANGES,
  UPDATED_INVENTORY,
  VIEW_ALL_PRODUCTS,
  VIEW_ALL_PRODUCTS_NON_ABI,
  SAVE_PRICING,
  DIST_SAVE_PRICING,
  DISCARD_CHANGES,
  UPDATED_PRODUCTS,
  UPDATED_DIST_PRODUCTS,
  COUNTRY_PRODUCTS,
  COUNTRY_PRODUCTS_START,
  COUNTRY_PRODUCTS_FAILURE,
} from "./types";
import { productNet, productCatolgueNet } from "../../../../utils/urls";


export const saveProducts = (data, updatedProducts) => dispatch => {
  const product = productNet();
  product
    .post("price", data)
    .then((response) => {
      dispatch({
        type: SAVE_PRICING,
        updated_products: updatedProducts,
        price_loading: false
      });
    })
    .catch((error) => {
      return;
    });

};

export const saveDistProducts = (data, updatedProducts, companyId) => dispatch => {
  const productCatalogue = productCatolgueNet()
  productCatalogue
    .post(`CreateProductCatalogue/${companyId}`, data)
    .then((response) => {
      dispatch({
        type: DIST_SAVE_PRICING,
        updated_products: updatedProducts,
        loading: false
      });
    })
    .catch((error) => {
      return;
    });

};

export const updateProducts = (updatedPrices) => dispatch => {
  
  dispatch({
    type: UPDATED_PRODUCTS,
    updated_products: updatedPrices,
  });
};

export const updateInventory = (updatedQuantities) => dispatch => {
  dispatch({
    type: UPDATED_INVENTORY,
    updated_quantity: updatedQuantities,
  });
};

export const updateDistProducts = (updatedPrices) => dispatch => {
  dispatch({
    type: UPDATED_DIST_PRODUCTS,
    updated_products: updatedPrices,
  });
};

export const discardChanges = () => (dispatch) => {
  dispatch({
    type: DISCARD_CHANGES
  });
};

export const getAllProducts = (country) => async (dispatch) => {
  const product = productNet();
  product
    .get(`?country=${country}`)
    .then((response) => {
      const { data } = response.data
      return dispatch({
        type: VIEW_ALL_PRODUCTS,
        all_products: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllProductsNonAbi = (country) => async (dispatch) => {
  const product = productNet();
  product
    .get(`?country=${country}&nonabi=true`)
    .then((response) => {
      const { data } = response.data
      return dispatch({
        type: VIEW_ALL_PRODUCTS_NON_ABI,
        all_products_non_abi: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getOtherProducts = (country) => async (dispatch) => {
  const product = productNet();
  product
    .get("other_products?country=" + country)
    .then((response) => {
      const { data } = response.data;
      return dispatch({
        type: VIEW_ALL_PRODUCTS,
        all_products: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const updatePriceChange = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_CHANGES,
    price_change: action
  })
}

export const updateQuanityChange = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_QUANTITY_CHANGES,
    quantity_change: action
  })
}

export const updateDistPriceChange = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_DIST_CHANGES,
    dist_price_change: action
  })
}



const loadCountyProduct = () => {
  return {
    type: COUNTRY_PRODUCTS_START,
  };
}
const countyProduct = (payload) => {

  return {
    type: COUNTRY_PRODUCTS,
    payload
  };
}
const countyProductFailed = (payload) => {
  return {
    type: COUNTRY_PRODUCTS_FAILURE,
    payload
  };
}

export const getProductsByCountry = (country) => {
  return async (dispatch) => {
    dispatch(loadCountyProduct())
    try {
      const product = productNet();
      const res = await product.get('', {
        params: {
          country: country,
        }
      });
      dispatch(countyProduct(res.data.data))

    } catch (err) {
      dispatch(countyProductFailed(err.message));
    }
  };
}
