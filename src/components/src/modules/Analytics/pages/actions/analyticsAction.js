import moment from "moment";
import { inventoryNet, orderNet } from "../../../../utils/urls";
import {
  GET_SALES_PERFORMANCE,
  GET_INVENTORY_MGT,
  SET_TOTAL_SELL_OUT,
  SET_TOTAL_SELL_IN,
  SET_DATE_FILTER,
} from "./types";

export const getInventoryMgtData =
  (startRange, stopRange, dateType, code) => async (dispatch) => {
    const inventory = inventoryNet();
    await inventory
      .get(
        `inventory-management/${code}?startRange=${startRange}&stopRange=${stopRange}&dateType=${dateType}`
      )
      .then((response) => {
        return dispatch({
          type: GET_INVENTORY_MGT,
          payload: response.data.data,
        });
      });
  };

export const getSalesPerformance =
  (startRange, stopRange, dateType, code) => (dispatch) => {
    const order = orderNet();
    order
      .get(
        `GetOrder/DistributorAnalyticsDashboard/${code}?startRange=${startRange}&stopRange=${stopRange}&dateType=${dateType}`
      )
      .then((response) => {
        return dispatch({
          type: GET_SALES_PERFORMANCE,
          payload: response.data.orders,
        });
      });
  };

export const setTotalSellIn = (data) => (dispatch) => {
  return dispatch({
    type: SET_TOTAL_SELL_IN,
    payload: data,
  });
};

export const setTotalSellOut = (data) => (dispatch) => {
  return dispatch({
    type: SET_TOTAL_SELL_OUT,
    payload: data,
  });
};

export const setDateFilter = (data) => (dispatch) => {
 
  return dispatch({
    type: SET_DATE_FILTER,
    payload: data,
  });
};

