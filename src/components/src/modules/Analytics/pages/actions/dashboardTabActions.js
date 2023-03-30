import { SET_DASHBOARD_TAB } from "./types";

export const setDashboardTab = (data) => (dispatch) => {
  return dispatch({
    type: SET_DASHBOARD_TAB,
    payload: data,
  });
};
