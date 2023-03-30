import { SET_DASHBOARD_TAB } from "../actions/types";

const initial_state = {
  activeTab: 1,
};

const DashboardTabReducer = (state = initial_state, action) => {
  switch (action.type) {
    case SET_DASHBOARD_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };
    default:
      return state;
  }
};

export default DashboardTabReducer;
