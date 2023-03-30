import axios from "axios";
import {
  VIEW_ALL_ORDERS,
  ORDERS_DATA,
  VIEW_SINGLE_ORDER,
  VIEW_ORDERS_BY_BUYER_CODE,
  GET_ALL_ORDERS,
  GET_ALL_ORDERS_BY_DATE,
  GET_MINI_ADMIN_SUMMARY,
  ASSIGN_ORDER_TO_DRIVER,
  GET_ALL_DRIVERS_BY_OWNER_ID,
  GET_ALL_DRIVERS,
  GET_ALL_ORDERS_BY_DRIVER,
  DIST_COMPLETED_ORDERS,
  CAPTURE_SALES,
  CAPTURE_SALES_START,
  CAPTURE_SALES_FAILED,
  CAPTURE_SALES_CLEAR,
  RELOAD_INVENTORY,
  UPDATE_MULTIPLE_ORDERS,
  RELOAD_INVENTORY_END,
  RESET,
  GET_ALL_VSM,
  REJECT_ORDER,
  PICKUP,
} from "./types";

import {
  completedOrdersNet,
  orderNet,
  vehicleNet,
  createOrderNet,
  inventoryNet,
} from "../../../../utils/urls";
import {
  updateQuantityAfterAction,
  getAllInventory,
} from "../../../Inventory/actions/inventoryProductAction";
import moment from "moment";
import dotenv from "dotenv";
dotenv.config();
export const getAllOrdersByDistributor = (id, currentPage, status, pageSize, routeName, isWithVehicle) => async (dispatch) => {
  const orderApi = orderNet();
  try {
    const response = await orderApi.get(
      `GetOrder/GetOrderBySellerCompanyId/${id}?pageNumber=${currentPage}&orderStatus=${status}&pageSize=${pageSize}&routeName=${routeName}&isWithVehicle=${isWithVehicle}`
    );
    const { data } = response;
    return dispatch({
      type: VIEW_ALL_ORDERS,
      all_orders: data.order,
      totalOrdersCount: data.totalOrders
    });
  } catch (error) {
    return;
  }
};

export const fetchDataComputation = (id) => async (dispatch) => {
  const orderApi = orderNet();
  try {
    const response = await orderApi.get(`GetOrder/DistributorOrdersCalculation/${id}`)
    const { data } = response;
    return dispatch({
      type: ORDERS_DATA,
      data: data.data,
    });
  } catch (error) {
    return;
  }
}

export const getAllCompletedOrdersByDistributor = (id) => async (dispatch) => {
  const orderApi = completedOrdersNet();
  try {
    const response = await orderApi.get(id);
    const { data } = response;
    return dispatch({
      type: DIST_COMPLETED_ORDERS,
      dist_completed_orders: data.order,
    });
  } catch (error) {
    return;
  }
};

export const getSingleOrder = (id) => async (dispatch) => {
  const orderApi = orderNet();
  orderApi
    .get(`GetOrder/GetOrderByOrderId/${id}`)
    .then((response) => {
      const { data } = response;
      return dispatch({
        type: VIEW_SINGLE_ORDER,
        single_order: data && data.order[0],
      });
    })
    .catch((error) => {
      return;
    });
};

export const getSingleOrderByBuyerId = (code) => async (dispatch) => {
  const orderApi = orderNet();
  orderApi
    .get(`GetOrder/GetOrderByBuyerCompanyId/${code}`)
    .then((response) => {
      return dispatch({
        type: VIEW_ORDERS_BY_BUYER_CODE,
        order: response.data.order,
      });
    })
    .catch((error) => {
      return;
    });
};

export const assignOrdersToDrivers = (values) => async (dispatch) => {
  const orderApi = orderNet();
  orderApi
    .patch(`UpdateOrder/AssignOrderToDriver/`, values)
    .then((response) => {
      return dispatch({
        type: ASSIGN_ORDER_TO_DRIVER,
        assigned_order: response.data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const updateMultipleOrders = (values) => async (dispatch) => {
  const orderApi = orderNet();
  orderApi
    .patch("/UpdateOrder/UpdateMultipleOrderStatus", values)
    .then((response) => {
      return dispatch({
        type: UPDATE_MULTIPLE_ORDERS,
        updated_status: response.data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const pickUpOrders = (values) => async (dispatch) => {
  const orderApi = orderNet();
  orderApi
    .patch(`UpdateOrder/MarkAsPickUp/`, values)
    .then((response) => {
      return dispatch({
        type: PICKUP,
        pickup: response.data,
      });
    })
    .catch((error) => {
      return Promise.reject(error.data);
    });
};
export const getAllVSMs = (companyId) => async (dispatch) => {
  const vehicleApi = vehicleNet();
  vehicleApi
    .get(`GetVehicle/GetByOwnerCompanyId/${companyId}`)
    .then((response) => {
      return dispatch({
        type: GET_ALL_VSM,
        vsms: response.data.data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllDriversByOwnerId = (sellerCode) => async (dispatch) => {
  const vehicleApi = vehicleNet();
  vehicleApi
    .get(`GetVehicle/GetByOwnerCompanyId/${sellerCode}`)
    .then((response) => {
      const { data } = response.data;

      return dispatch({
        type: GET_ALL_DRIVERS_BY_OWNER_ID,
        all_drivers: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllDrivers = () => async (dispatch) => {
  const vehicleApi = vehicleNet();
  vehicleApi
    .get(`GetVehicle/GetAll`)
    .then((response) => {
      const { data } = response.data;
      return dispatch({
        type: GET_ALL_DRIVERS,
        all_system_drivers: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllOrderForDrivers = (vehicleId) => async (dispatch) => {
  const orderApi = orderNet();
  orderApi
    .get(`GetOrder/GetOrderByVehicleId/${vehicleId}`)
    .then((response) => {
      return dispatch({
        type: GET_ALL_ORDERS_BY_DRIVER,
        all_orders_driver: response.data.order,
      });
    })
    .catch(() => {
      return;
    });
};

export const getAllOrders = () => async (dispatch) => {
  const orderApi = orderNet();
  orderApi
    .get(`GetOrder/GetAll`)
    .then((response) => {
      return dispatch({
        type: GET_ALL_ORDERS,
        all_system_orders: response.data.order,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllOrdersByDateRange =
  (startRange, stopRange) => async (dispatch) => {
    const orderApi = orderNet();
    orderApi
      .get("GetOrder/GetAll/" + startRange + "/" + stopRange)
      .then((response) => {
        return dispatch({
          type: GET_ALL_ORDERS_BY_DATE,
          all_orders_by_date: response.data.order,
        });
      })
      .catch((error) => {
        return;
      });
  };

export const getMiniAdminOrdersByDateRange =
  (data, startRange, stopRange) => async (dispatch) => {
    const orderApi = orderNet();
    orderApi
      .post(`GetOrder/GetReportByMiniAdmin/${startRange}/${stopRange}`, data)
      .then((response) => {
        return dispatch({
          type: GET_ALL_ORDERS_BY_DATE,
          all_orders_by_date: response.data.order,
        });
      })
      .catch((error) => {
        return;
      });
  };

export const getMiniAdminSummary =
  ({ companyCodes, sellerIds, startRange, stopRange }) =>
  async (dispatch) => {
    const orderApi = orderNet();
    orderApi
      .post(`GetOrder/SalesReportByDistributorsUsingDateRange`, {
        sellerIds: sellerIds,
        startRange: startRange,
        stopRange: stopRange,
      })
      .then(async (order) => {
        const inventoryApi = inventoryNet();
        await inventoryApi
          .post(
            `one-pager?startRange=${moment(startRange).format(
              "YYYY-MM-DD"
            )}&stopRange=${moment(stopRange).format("YYYY-MM-DD")}`,
            {
              companyCodes,
            }
          )
          .then((stock) => {
            const { orders } = order.data;

            return dispatch({
              type: GET_MINI_ADMIN_SUMMARY,
              orders_by_date: orders,
              stocks_by_date: stock.data.data,
            });
          });
      })
      .catch((error) => {
        return;
      });
  };

export const setLoadingToDefault = () => async (dispatch) => {
  return dispatch({
    type: GET_ALL_ORDERS_BY_DATE,
    loading: true,
  });
};

export const getCountryOrdersByDateRange =
  (startRange, stopRange, country, type) => async (dispatch) => {
    const orderApi = orderNet();
    orderApi
      .get(
        `GetOrder/GetDataForReport/${country}/${startRange}/${stopRange}/${type}`
      )
      .then((response) => {
        return dispatch({
          type: GET_ALL_ORDERS_BY_DATE,
          all_orders_by_date: response.data.order,
          loading: false,
        });
      })
      .catch((error) => {
        return;
      });
  };

export const getDistOrdersByDateRange =
  (startRange, stopRange, dist_code) => async (dispatch) => {
    const orderApi = orderNet();
    orderApi
      .get(
        "GetOrder/GetOrderBySellerCompanyId/" +
          dist_code +
          "/" +
          startRange +
          "/" +
          stopRange
      )
      .then((response) => {
        return dispatch({
          type: GET_ALL_ORDERS_BY_DATE,
          all_orders_by_date: response.data.order,
          loading: false,
        });
      })
      .catch((error) => {
        return;
      });
  };

export const updateOrderItems = (payload) => async (dispatch) => {
  try {
    const orderApi = await orderNet();
    orderApi.patch(`UpdateOrder/UpdateReturnedOrders`, payload);
    // return dispatch(getAllOrdersByDistributor(payload.companyCode));
  } catch (error) {
    return;
  }
};

export const loadCaptureSales = () => {
  return {
    type: CAPTURE_SALES_START,
  };
};
export const CaptureSales = (payload) => {
  return {
    type: CAPTURE_SALES,
    payload,
  };
};
const CaptureSalesFailed = (payload) => {
  return {
    type: CAPTURE_SALES_FAILED,
    payload,
  };
};

const reload = () => {
  return {
    type: RELOAD_INVENTORY,
  };
};
const resetReload = () => {
  return {
    type: RELOAD_INVENTORY_END,
  };
};

export const updateOrderStatus = (orderId, values) => async (dispatch) => {
  const orderApi = orderNet();
  orderApi
    .patch(`UpdateOrder/UpdateStatus/${orderId}`, values)
    .then((response) => {
      dispatch({
        type: REJECT_ORDER,
        rejectOrder: response.data.message,
      });
    })
    .catch(() => {
      return;
    });
};

export const capture = (payload, afterSalesPayload, status, loading) => {
  const orderApi = createOrderNet();
  return async (dispatch) => {
    dispatch(loadCaptureSales());
    try {
      const res = await orderApi.post("", payload);
      dispatch(CaptureSales(res.data));
      if (res?.data) {
        await dispatch(updateQuantityAfterAction(afterSalesPayload));
        dispatch(getAllInventory(afterSalesPayload?.sellerCompanyId));
        // dispatch(reload())
      }
    } catch (err) {
      dispatch(CaptureSalesFailed(err.response.data));
    }
  };
};

export const clear = () => async (dispatch) => {
  dispatch({ type: CAPTURE_SALES_CLEAR });
};
export const reset = () => async (dispatch) => {
  dispatch({ type: RESET });
};
