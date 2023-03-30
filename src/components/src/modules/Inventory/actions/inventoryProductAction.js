import axios from "axios";
import {
  ADD_INVENTORY_PRODUCT,
  DELETE_INVENTORY_PRODUCT,
  EDIT_INVENTORY_PRODUCT,
  VIEW_ALL_INVENTORY_PRODUCT,
  VIEW_SINGLE_INVENTORY_PRODUCT,
  VIEW_ALL_INVENTORY_COMPANY,
  VIEW_ALL_LVAV_COMPANY,
  ALL_OUTOFSTOCK_PRODUCTS,
  VIEW_ALL_DEST_PRODUCT,
  VIEW_ALL_ORIGIN_PRODUCT,
  UPDATED_QUANTITY,
  UPDATED_QUANTITY_DAILY_STOCK,
  UPDATED_QUANTITY_DAILY_EMPTIES,
  UNSAVED_CHANGES,
  DISCARD_CHANGES,
  PRESENT_DIST,
  SAVE_TRANSFER,
  ADD_INVENTORY,
  DISCARD_EMPTIES_CHANGES,
  TRANSFER_EMPTIES_CHANGES,
  UNSAVED_EMPTIES_CHANGES,
  RECEIVE_EMPTIES,
  UNSAVED_EXPIRED_CHANGES,
  VIEW_ALL_EMPTIES,
  RETURN_QUANTITY,
  ADD_EMPTIES,
  TOTAL_EMPTIES,
  RETURN_EXPIRED_QUANTITY,
  RETURN_EMPTIES_BUTTON_CLICKED,
  RECEIVE_EMPTIES_BUTTON_CLICKED,
  EMPTIES_MODAL_BUTTON_CLICKED,
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
  UNSAVED_CHANGES_DAILY_STOCK,
  SHOW_DAILY_STOCK_MODAL,
  SET_LOADING,
  ACCURATE_DAILY_STOCK_COUNT,
  UPDATE_DAILY_STOCK_COUNT_FAILED,
  UNSAVED_PRODUCT_CHANGES,
  SET_APPROVAL_MODAL,
  GET_DISTRIBUTORS_CLOSING_STOCK,
  GET_CLOSING_STOCK
} from "./types";
import {
  inventoryNet,
  inventoryNetTemp,
  overallInventoryNet,
  inventory
} from "../../../utils/urls";

export const addProduct = (details) => (dispatch) =>
  axios
    .post(`${process.env.REACT_APP_BASE_URL}/product/register`, details)
    .then((response) => {
      return dispatch({
        type: ADD_INVENTORY_PRODUCT,
        payload: response,
      }).catch((error) => {
        console.log(error);
      });
    });

export const editProduct = (details) => (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .patch("", details)
    .then((response) => {
      return dispatch({
        type: EDIT_INVENTORY_PRODUCT,
        payload: response,
      });
    })
    .catch((error) => {
      return;
    });
};

export const deleteProduct = (details) => (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .delete("", details)
    .then((response) => {
      return dispatch({
        type: DELETE_INVENTORY_PRODUCT,
        payload: response,
      });
    })
    .catch((error) => {
      return;
    });
};

//get all products in a company location
export const getAllProduct = (CompID, LocID) => async (dispatch) => {
  let productsConcat = [];
  let singleProduct = {};
  const inventory = inventoryNet();
  inventory
    .get(CompID + "/" + LocID)
    .then((response) => {
      const { data } = response.data;
      dispatch({
        type: VIEW_ALL_INVENTORY_PRODUCT,
        all_products: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllProductsOrigin = (CompID, LocID) => async (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .get(CompID + "/" + LocID)
    .then((response) => {
      const { data } = response.data;
      dispatch({
        type: VIEW_ALL_ORIGIN_PRODUCT,
        all_origin_products: data,
      });
    })
    .catch((error) => {
      return;
    });
};
export const getAllProductsDest = (CompID, LocID) => async (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .get(CompID + "/" + LocID)
    .then((response) => {
      const { data } = response.data;
      dispatch({
        type: VIEW_ALL_DEST_PRODUCT,
        all_dest_products: data,
      });
    })
    .catch((error) => {
      return;
    });
};

//get all products in a company
export const getAllInventory = (CompID) => async (dispatch) => {
  const inventory = overallInventoryNet();
  inventory
    .get(CompID)
    .then((response) => {
      const { data } = response.data;
      const inventoryExist = data.length === 0 ? false : true;
      dispatch({
        type: VIEW_ALL_INVENTORY_COMPANY,
        all_inventory: data,
        inventoryExist: inventoryExist,
      });
    })
    .catch((error) => {
      return;
    });
};

// get closing-inventory
export const getClosingInventory = (range,country,code) => async (dispatch) => {
  const stock = inventory();
  stock
    // .post(`reports/closing-stock-sku/Tanzania/2023-02-06/2023-02-10`,code)
    .post(`reports/closing-stock-sku/${country}/${range}`,code)
    .then((response) => {
      const { data } = response.data;
      dispatch({
         type: GET_CLOSING_STOCK,
        closing_stock: data,
        loading: false,
      });
    })
    .catch((error) => {
      return;
    });
};
export const getDistributorsClosingInventory = (range,country,CompID) => async (dispatch) => {
  const stock = inventory();
  stock
    .get(`reports/closing-stock-sku/${country}/${range}`,{companyCodes:[CompID]})
    .then((response) => {
      const { data } = response.data;
      dispatch({
       type: GET_DISTRIBUTORS_CLOSING_STOCK,
        dist_closing_stock: data,
        loading: false,
      });
    })
    .catch((error) => {
      return;
    });
};

// get abi products in a company
export const getAbiInventory = (CompID) => async (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .get(CompID)
    .then((response) => {
      const { data } = response.data;
      const inventoryExist = data.length === 0 ? false : true;
      dispatch({
        type: VIEW_ABI_INVENTORY_COMPANY,
        abi_inventory: data,
        inventoryExist: inventoryExist,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getLVAV = (CompID) => async (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .get("low-stock/" + CompID)
    .then((response) => {
      const { data } = response.data;
      dispatch({
        type: VIEW_ALL_LVAV_COMPANY,
        low_stock_values: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getSingleProduct = (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .get("")
    .then((response) => {
      return dispatch({
        type: VIEW_SINGLE_INVENTORY_PRODUCT,
        payload: response,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllOutOfStock = (CompID) => (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .get("company-out-of-stock/" + CompID)
    .then((response) => {
      const { data } = response;
      return dispatch({
        type: ALL_OUTOFSTOCK_PRODUCTS,
        all_outOfStock: data.data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllEmpties = (CompID) => (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .get("empties/" + CompID)
    .then((response) => {
      const { data } = response.data;
      return dispatch({
        type: VIEW_ALL_EMPTIES,
        payload: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const addInitialEmpties = (data) => (dispatch) => {
  return dispatch({
    type: ADD_EMPTIES,
    payload: data,
  });
};

export const transferQuantity =
  (quantitiesToSave, inventorytype) => (dispatch) => {
    dispatch({
      type: UPDATED_QUANTITY,
      transfer_quantities: quantitiesToSave,
      inventory_type: inventorytype,
    });
  };

export const transferQuantityDailyStock =
  (quantitiesToSave, inventorytype) => (dispatch) => {
    dispatch({
      type: UPDATED_QUANTITY_DAILY_STOCK,
      transfer_quantities: quantitiesToSave,
      inventory_type: inventorytype,
    });
  };

export const transferQuantityDailyEmpties = (empties, reason) => (dispatch) => {
  dispatch({
    type: UPDATED_QUANTITY_DAILY_EMPTIES,
    transfer_empties: empties,
  });
};

export const setDailyStockModal = (payload) => (dispatch) => {
  dispatch({
    type: SHOW_DAILY_STOCK_MODAL,
    dailyStockModal: payload,
  });
};

export const returnQuantity = (quantitiesToSave) => (dispatch) => {
  dispatch({
    type: RETURN_QUANTITY,
    return_quantities: quantitiesToSave,
  });
};

export const updateOtherProducts = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_OTHERPRODUCTS_CHANGES,
    other_products_change: action,
  });
};

export const otherProductsToAdd = (itemsToSave) => (dispatch) => {
  // console.log(action);
  dispatch({
    type: OTHER_PRODUCTS_TO_SAVE,
    otherProductsToSave: itemsToSave,
  });
};

export const otherProductsToAddStart = (action) => (dispatch) => {
  dispatch({
    type: OTHER_PRODUCTS_TO_SAVE_START,
    loading: action,
  });
};

export const returnEmptiesQuantity = (quantitiesToSave) => (dispatch) => {
  //const data
  dispatch({
    type: UPDATED_QUANTITY,
    empties_quantities: quantitiesToSave,
  });
};

export const updateTransferQuantity =
  (action, returnEmptiesModal) => (dispatch) => {
    dispatch({
      type: UNSAVED_CHANGES,
      transfer_change: action,
      return_empties_modal: returnEmptiesModal,
    });
  };

export const receiveNewStock = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_PRODUCT_CHANGES,
    receive_new_stock: action
  });
};

export const setApprovalModal = (action) => (dispatch) => {
  dispatch({
    type: SET_APPROVAL_MODAL,
    approval_modal: action
  });
}

export const updateDailysTOCKTransferQuantity = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_CHANGES_DAILY_STOCK,
    transfer_change: action,
  });
};

export const updateEmptiesQuantity = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_EMPTIES_CHANGES,
    empties_change: action,
  });
};

export const receiveEmpties = (action) => (dispatch) =>{
  dispatch({
    type: RECEIVE_EMPTIES,
    receive_empties: action
  })
}

export const updateExpiredQuantity = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_EXPIRED_CHANGES,
    expired_change: action,
  });
};

export const discardChanges = () => (dispatch) => {
  dispatch({
    type: DISCARD_CHANGES,
  });
};

export const discardEmptiesChanges = () => (dispatch) => {
  dispatch({
    type: DISCARD_EMPTIES_CHANGES,
  });
};

export const discardExpiredChanges = () => (dispatch) => {
  dispatch({
    type: DISCARD_EXPIRED_CHANGES,
  });
};

export const saveProducts = (data, Dist_Code) => (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .post("warehouse-transfer/", data)
    .then((response) => {
      dispatch({
        type: SAVE_TRANSFER,
        loading: false,
      });
    })
    .catch((error) => {
      return;
    });
};

export const saveInventory = (data) => (dispatch) => {
  const inventory = inventoryNet();
  inventory
    .post("add-stock/", data)
    .then((response) => {
      console.log("response", response);
      dispatch({
        type: ADD_INVENTORY,
        loading: false,
      });
    })
    .catch((error) => {
      console.log(error);
      return;
    });
};

export const presentDist = (dist) => (dispatch) => {
  dispatch({
    type: PRESENT_DIST,
    present_dist: dist,
  });
};

export const updateTransferChange = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_CHANGES,
    price_change: action,
  });
};

export const openReturnTotalEmptiesButton = (action) => (dispatch) => {
  dispatch({
    type: RETURN_EMPTIES_BUTTON_CLICKED,
    payload: action,
  });
};

export const openReceiveEmptiesButton = (action) => (dispatch) => {
  dispatch({
    type: RECEIVE_EMPTIES_BUTTON_CLICKED,
    payload: action,
  });
};

export const openEmptiesButton = (action) => (dispatch) => {
  dispatch({
    type: EMPTIES_MODAL_BUTTON_CLICKED,
    payload: action,
  });
};

export const getTotalEmpties = (code) => (dispatch) => {
  const inventory = inventoryNet();
  inventory.get("get-empties/" + code).then((response) => {
    const { data } = response.data;
    return dispatch({
      type: TOTAL_EMPTIES,
      payload:
        data.quantity === "" || data.quantity === undefined ? 0 : data.quantity,
    });
  });
};

export const updateAccurateDailyStockCount = (data) => (dispatch) => {
  const inventory = inventoryNet();
  inventory.post("daily-stock-entry", data)
  .then((response) => {
    return dispatch({
      type: ACCURATE_DAILY_STOCK_COUNT,
      loading: false
    });
  })
  .catch((error) => {
    return dispatch({
      type: UPDATE_DAILY_STOCK_COUNT_FAILED,
      error: true,
      errorMessage: error.response.data.message || error.response.data.error.message
    });
  });
}

const updateQuantityStart = () => {
  return {
    type: UPDATED_QUANTITY_SALES_START,
  };
};
const updateQuantityAfter = (payload) => {
  return {
    type: UPDATED_QUANTITY_SALES,
    payload,
  };
};
const updateQuantityAfterFailed = (payload) => {
  return {
    type: UPDATED_QUANTITY_SALES_FAILED,
    payload,
  };
};

export const updateQuantityAfterAction = (payload) => {
  const inventory = inventoryNet();
  return async (dispatch) => {
    dispatch(updateQuantityStart());
    try {
      const res = await inventory.put("update-quantity", payload);
      dispatch(updateQuantityAfter(res.data));
    } catch (err) {
      dispatch(updateQuantityAfterFailed(err.response.data));
    }
  };
};

export const setInventoryDocument = (report) => (dispatch) => {
  dispatch({
    type: INVENTORY_DOCUMENT_DETAILS,
    payload: report,
  });
};

export const clearInvent = () => async (dispatch) => {
  dispatch({ type: INVENTORY_CLEAR });
};

const walkinEmptyStart = () => {
  return {
    type: WALK_IN_SALES_EMPTIES_START,
  };
};
const walkinEmpty = (payload) => {
  return {
    type: WALK_IN_SALES_EMPTIES,
    payload,
  };
};
const walkinEmptyFailed = (payload) => {
  return {
    type: WALK_IN_SALES_EMPTIES_FAILED,
    payload,
  };
};

export const walkinEmptyAction = (companyCode, quantityToReturn) => {
  const inventory = inventoryNet();
  return async (dispatch) => {
    dispatch(walkinEmptyStart());
    try {
      const res = await inventory.post("empties/take-in", {
        companyCode,
        quantityToReturn,
      });
      dispatch(walkinEmpty(res.data));
    } catch (err) {
      dispatch(walkinEmptyFailed(err.response.data));
    }
  };
};

const returnSalesStart = () => {
  return {
    type: RETURN_SALES_START,
  };
};

const returnSales = (payload) => {
  return {
    type: RETURN_SALES,
    payload,
  };
};

const returnSalesFailed = (payload) => {
  return {
    type: RETURN_SALES_FAILED,
    payload,
  };
};

export const returnSalesAction = (payload) => {
  const inventory = inventoryNet();
  return async (dispatch) => {
    dispatch(returnSalesStart());
    const { companyCode, empties, orderItems } = payload;
    console.log("====================================");
    console.log("====================================");
    try {
      const res = await inventory.post(
        "sales-return",
        { companyCode, orderItems, empties }
        // const res = await inventoryNetTemp.post('sales-return', { companyCode, orderItems, empties }
      );
      console.log("====================================");
      console.log("====================================");
      dispatch(returnSales(res.data));
    } catch (err) {
      dispatch(returnSalesFailed(err.response.data));
    }
  };
};

export const setSelectedOtherProducts = (data) => (dispatch) => {
  dispatch({
    type: SELECTED_OTHERPRODUCTS,
    selected_other_products: data,
  });
};

export const setLoadingToDefault = () => async (dispatch) => {
  return dispatch({
    type: SET_LOADING,
    loadingInventory: true,
  });
};


