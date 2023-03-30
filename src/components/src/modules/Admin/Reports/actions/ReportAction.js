import {
  SHOW_CALENDAR,
  SELECTED_DATE_RANGE,
  GET_ALL_STOCKS_BY_DATE,
  SHOW_MINI_DISTRIBUTORS,
  SELECTED_DIST,
  DAILY_STOCK_AVERAGE_ACCURACY,
  GET_DAILY_STOCK_REPORT,
  GET_CLOSING_STOCK_REPORT,
  GET_MINI_ADMIN_CLOSING_STOCK_REPORT,
  GET_MINI_ADMIN_DAILY_STOCK_REPORT,
  GET_ASSIGNED_DISTRIBUTORS_STOCK_LEVEL,
  GET_ALL_DISTRIBUTORS_STOCK_LEVEL,
  SET_LOADING,
  GET_ALL_DISTRIBUTORS_STOCK_LEVEL_WITH_SKU,
  GET_ASSIGNED_DISTRIBUTORS_STOCK_LEVEL_WITH_SKU,
} from "./types";
import { inventory, inventoryNet } from "../../../../utils/urls";

export const showCalendar = (action) => (dispatch) => {
  dispatch({
    type: SHOW_CALENDAR,
    show: action,
  });
};

export const setLoadingToDefault = () => async (dispatch) => {
  return dispatch({
    type: SET_LOADING,
    loading: true,
  });
};

export const showMinDistributors = (action) => (dispatch) => {
  dispatch({
    type: SHOW_MINI_DISTRIBUTORS,
    show: action,
  });
};

export const setSelectedDist = (dist) => (dispatch) => {
  dispatch({
    type: SELECTED_DIST,
    selected_dist: dist,
  });
};

export const setSelectedDateRange = (range) => (dispatch) => {
  dispatch({
    type: SELECTED_DATE_RANGE,
    range: range,
  });
};

export const getAllStocksByDateRange =
  (startRange, stopRange, country) => async (dispatch) => {
    const inventory = inventoryNet()
    inventory
      .get("stocks/" + country + "/" + startRange + "/" + stopRange)
      .then((response) => {
        
        return dispatch({
          type: GET_ALL_STOCKS_BY_DATE,
          all_stocks_by_date: response.data.data,
          loading: false
        });
      })
      .catch((error) => {
        return;
      });
  };

  export const getMiniAdminStocksByDateRange =
    (startRange, stopRange, data) => async (dispatch) => {
      const inventory = inventoryNet()
    inventory
        .post(`companies-total-volume?startRange=${startRange}&stopRange=${stopRange}`, data)
        .then((response) => {
          return dispatch({
            type: GET_ALL_STOCKS_BY_DATE,
            all_stocks_by_date: response.data.data,
            loading: false,
          });
        })
        .catch((error) => {
          return;
        });
    };

export const getDailyStockReport = (startRange, stopRange, country) => (dispatch) => {
  const report = inventory()
  report.get(`reports/daily-stock/${country}/${startRange}/${stopRange}`).then((response) => {
    return dispatch({
      type: GET_DAILY_STOCK_REPORT,
      daily_stock_report: response.data.data,
      loading: false
    })
  })
  .catch((error) => {
    return;
  });
}
export const getClosingStockReport = (startRange, stopRange, country) => (dispatch) => {
  const report = inventory()
  report.get(`reports/closing-stock/${country}/${startRange}/${stopRange}`).then((response) => {
    return dispatch({
      type: GET_CLOSING_STOCK_REPORT,
      closing_stock_report: response.data.data,
      loading: false
    })
  })
  .catch((error) => {
    return;
  });
}
export const getMiniAdminClosingStockReport = (startRange, stopRange, country, data) => (dispatch) => {
  const report = inventory()
    // report.post(`https://dmsqa20.azure-api.net/inventory/api/v1/reports/closing-stock/Tanzania/2023-02-06/2023-02-10`, data).then((response) => {

  report.post(`reports/closing-stock-sku/${country}/${startRange}/${stopRange}`,data).then((response) => {
    return dispatch({
      type: GET_MINI_ADMIN_CLOSING_STOCK_REPORT,
      mini_admin_closing_stock_report: response.data.data,
      loading: false
    })
  })
  .catch((error) => {
    return;
  });
}
export const getMiniAdminDailyStockReport = (startRange, stopRange, country, data) => (dispatch) => {
  const report = inventory()
  report.post(`reports/daily-stock/${country}/${startRange}/${stopRange}`, data).then((response) => {
    return dispatch({
      type: GET_MINI_ADMIN_DAILY_STOCK_REPORT,
      mini_admin_daily_stock_report: response.data.data,
      loading: false
    })
  })
  .catch((error) => {
    return;
  });
}

export const getDailyStockAverageAccuracy = (country) => (dispatch) => {
  const report = inventory()
  report.get(`reports/average-accuracy/${country}`).then((response) => {
    return dispatch({
      type: DAILY_STOCK_AVERAGE_ACCURACY,
      daily_stock_average_accuracy: response.data.data,
      loading: false
    })
  })
  .catch((error) => {
    return;
  });
}

export const getMiniAdminDailyStockAverageAccuracy = (country, data) => (dispatch) => {
  const report = inventory()
  report.post(`reports/average-accuracy/${country}`, data).then((response) => {
    return dispatch({
      type: DAILY_STOCK_AVERAGE_ACCURACY,
      daily_stock_average_accuracy: response.data.data,
      loading: false
    })
  })
  .catch((error) => {
    return;
  });
}

export const getAllDistributorsStockLevel = (country) => (dispatch) => {
  const report = inventory()
  report.get(`reports/stock-level/${country}`).then((response) => {
    return dispatch({
      type: GET_ALL_DISTRIBUTORS_STOCK_LEVEL,
      distributors_stock: response.data.data,
      loading: false
    })
  })
  .catch((error) => {
    return;
  });
}

export const getAssignedDistributorsStockLevel = (country, data) => (dispatch) => {
  const report = inventory()
  report.post(`reports/stock-level/${country}`, data).then((response) => {
    return dispatch({
      type: GET_ASSIGNED_DISTRIBUTORS_STOCK_LEVEL,
      distributors_stock: response.data.data,
      loading: false
    })
  })
  .catch((error) => {
    return;
  });
}

export const getAllDistributorsStockLevelWithSku = (country) => (dispatch) => {
  const report = inventory()
  report.get(`reports/stock-level-sku/${country}`).then((response) => {
    return dispatch({
      type: GET_ALL_DISTRIBUTORS_STOCK_LEVEL_WITH_SKU,
      distributors_stock_with_sku: response.data.data,
    })
  })
  .catch((error) => {
    return;
  });
}

export const getAssignedDistributorsStockLevelWithSku = (country, data) => (dispatch) => {
  const report = inventory()
  report.post(`reports/stock-level-sku/${country}`, data).then((response) => {
    return dispatch({
      type: GET_ASSIGNED_DISTRIBUTORS_STOCK_LEVEL_WITH_SKU,
      distributors_stock_with_sku: response.data.data,
    })
  })
  .catch((error) => {
    return;
  });
}

