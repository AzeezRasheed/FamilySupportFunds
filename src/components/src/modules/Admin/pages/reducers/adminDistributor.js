import {
  ADD_DISTRIBUTOR,
  DELETE_DISTRIBUTOR,
  EDIT_DISTRIBUTOR,
  VIEW_ALL_DISTRIBUTOR,
  VIEW_SINGLE_DISTRIBUTOR,
  VIEW_SINGLE_KPO,
  VIEW_MY_DISTRIBUTORS,
} from "../actions/types";

const initial_state = {
  distributor: {},
  all_distributors: [],
  my_distributors: [],
  kpo: {},
};

const addDistributorReducer = (state = initial_state, action) => {
  switch (action.type) {
    case ADD_DISTRIBUTOR:
      return {
        ...state,
        all_distributors: [...state.all_distributors, action.payload],
      };
    case VIEW_ALL_DISTRIBUTOR: {
      return { ...state, all_distributors: action.all_distributors };
    }
    case EDIT_DISTRIBUTOR: {
      return { ...state, distributor: action.payload };
    }
    case VIEW_SINGLE_KPO: {
      return { ...state, kpo: action.payload };
    }
    case VIEW_MY_DISTRIBUTORS: {
      return { ...state, my_distributors: action.payload };
    }
    case VIEW_SINGLE_DISTRIBUTOR: {
      return { ...state, distributor: action.payload };
    }
    default:
      return state;
  }
};

export default addDistributorReducer;
