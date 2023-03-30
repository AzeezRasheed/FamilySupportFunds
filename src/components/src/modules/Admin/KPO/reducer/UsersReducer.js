import {
  TOTAL_NO_KPO,
  VIEW_ALL_USERS,
  EDIT_ACTION,
  UPDATE_USER,
  VIEW_ALL_DISTRIBUTORS,
  FILTERED_DISTRIBUTORS,
  SELECTED_DISTRIBUTORS,
  SAVE_DISTRIBUTORS,
  ADD_ADMIN_ACTION,
  NEW_USER_DETAILS,
  SUSPEND_ACTION,
  UNSUSPEND_ACTION,
  SINGLE_USER,
  CHANGEROLE_ACTION,
  CHANGEDIST_ACTION,
  LOADING_STATE,
  UPDATE_USER_DATA,
} from "../types/UserTypes";

const initial_state = {
  allUsers: [],
  edit_action: false,
  suspend_action: false,
  unsuspend_action: false,
  changerole_action: false,
  changedist_action: false,
  add_admin_action: false,
  kpo_id: 0,
  customer_id: 0,
  allDistibutors: [],
  filteredDistributor: [],
  selectedDistributors: [],
  kpoDistributors: [],
  userDetails: {},
  single_user: {},
  loading: false,
  userData: 'Admin'
};

const UsersReducer = (state = initial_state, action) => {
  const {
    type,
    all_users,
    edit_action,
    kpo_id,
    updatedUsers,
    all_distributors,
    filtered_distributors,
    selected_distributors,
    new_distributors,
    add_admin_action,
    user_details,
    suspend_action,
    unsuspend_action,
    allUsers,
    single_user,
    changerole_action,
    changedist_action,
    customer_id,
    loading,
    userData
  } = action;
  switch (type) {
    case VIEW_ALL_USERS: {
      return { ...state, allUsers: all_users };
    }
    case SINGLE_USER: {
      return { ...state, single_user: single_user };
    }
    case EDIT_ACTION: {
      return { ...state, edit_action: edit_action, kpo_id: kpo_id };
    }
    case SUSPEND_ACTION: {
      return { ...state, suspend_action: suspend_action, kpo_id: kpo_id };
    }
    case UNSUSPEND_ACTION: {
      return { ...state, unsuspend_action: unsuspend_action, kpo_id: kpo_id };
    }
    case CHANGEROLE_ACTION: {
      return { ...state, changerole_action: changerole_action, kpo_id: kpo_id };
    }
    case CHANGEDIST_ACTION: {
      return {
        ...state,
        changedist_action: changedist_action,
        customer_id: customer_id,
      };
    }
    case ADD_ADMIN_ACTION: {
      return { ...state, add_admin_action: add_admin_action, kpo_id: kpo_id };
    }
    case UPDATE_USER: {
      return { ...state, allUsers: allUsers };
    }
    case LOADING_STATE: {
      return{...state, loading: loading}
    }
    case VIEW_ALL_DISTRIBUTORS: {
      return { ...state, allDistributors: all_distributors };
    }
    case FILTERED_DISTRIBUTORS: {
      return { ...state, filteredDistributors: filtered_distributors };
    }
    case SELECTED_DISTRIBUTORS: {
      return { ...state, selectedDistributors: selected_distributors };
    }
    case NEW_USER_DETAILS: {
      return { ...state, userDetails: user_details };
    }
    case SAVE_DISTRIBUTORS: {
      return {
        ...state,
        kpoDistributors: [...state.kpoDistributors, new_distributors],
      };
    }
    case UPDATE_USER_DATA: {
      return { ...state, userData: userData };
    }
    default:
      return state;
  }
};

export default UsersReducer;