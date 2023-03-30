import { useSelector, useDispatch } from "react-redux";
import {
  SAVE_DISTRIBUTORS,
  VIEW_ALL_USERS,
  SINGLE_USER,
  EDIT_ACTION,
  SUSPEND_ACTION,
  UPDATE_USER,
  VIEW_ALL_DISTRIBUTORS,
  FILTERED_DISTRIBUTORS,
  SELECTED_DISTRIBUTORS,
  ADD_ADMIN_ACTION,
  NEW_USER_DETAILS,
  UNSUSPEND_ACTION,
  CHANGEROLE_ACTION,
  CHANGEDIST_ACTION,
  LOADING_STATE,
  UPDATE_USER_DATA,
} from "../types/UserTypes";

import { userNet, distributorNet, vehicleNet } from "../../../../utils/urls";


export const getAllUsers = (country) => async (dispatch) => {
  const userApi = userNet()
  userApi
    .get("fetchuser/getbycountry/"+country)
    .then((response) => {
      const { data } = response.data;
      dispatch({
        type: VIEW_ALL_USERS,
        all_users: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getSingleUser = (email) => async (dispatch) => {
  const userApi = await userNet()
   userApi
    .get("fetchuser/" + email)
    .then((response) => {
      const { data } = response.data;
      dispatch({
        type: SINGLE_USER,
        single_user: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const updateUser = (id, params, newUsersCopy, country) => async (dispatch) => {
  dispatch({
    type: LOADING_STATE,
    loading: true,
  });
  const userApi = await userNet()
  userApi
    .post("edit-profile/details/" + id, params)
    .then(() => {
      dispatch(getAllUsers(country));
      dispatch({
        type: LOADING_STATE,
        loading: false,
      });
      dispatch(setEditKPOOverlay(false));
    })
    .catch((error) => {
      return;
    });
};

export const updateUserData = (userData) => (dispatch) => {
  dispatch({
    type: UPDATE_USER_DATA,
    userData: userData,
  });
};

export const updateVehicle = (id, params, vehicleDetails, vehicleId, newUsersCopy, country) => (dispatch) => {
  const vehicleApi =  vehicleNet()
  const userApi =  userNet()
   userApi
    .post("edit-profile/details/" + id, params)
    .then(async() => {
      vehicleApi.patch("EditVehicle/" + vehicleId, vehicleDetails);
    })
    .finally(() => {
      dispatch(getAllUsers(country));
      dispatch({
        type: UPDATE_USER,
        allUsers: newUsersCopy,
      });
    });
};

export const setEditKPOOverlay = (action, kpo_id) => (dispatch) => {
  dispatch({
    type: EDIT_ACTION,
    edit_action: action, kpo_id: kpo_id
  })
}

export const setSuspendKPOOverlay = (action, kpo_id) => (dispatch) => {
  dispatch({
    type: SUSPEND_ACTION,
    suspend_action: action,
    kpo_id: kpo_id,
  });
};

export const setUnSuspendKPOOverlay = (action, kpo_id) => (dispatch) => {
  dispatch({
    type: UNSUSPEND_ACTION,
    unsuspend_action: action,
    kpo_id: kpo_id,
  });
};

export const setChangeRoleOverlay = (action, kpo_id) => (dispatch) => {
  dispatch({
    type: CHANGEROLE_ACTION,
    changerole_action: action,
    kpo_id: kpo_id,
  });
};

export const setChangeDistOverlay = (action, customer_id) => (dispatch) => {
  dispatch({
    type: CHANGEDIST_ACTION,
    changedist_action: action,
    customer_id: customer_id,
  });
};

export const setAddAdminOverlay = (action, kpo_id) => (dispatch) => {
  dispatch({
    type: ADD_ADMIN_ACTION,
    add_admin_action: action,
    kpo_id: kpo_id,
  });
};

export const getAllDistributors = (country) => async (dispatch) => {
  const distributor = await distributorNet();
         distributor
    .get("company/companies/"+country)
    .then((response) => {
      const { data } = response;
      dispatch({
        type: VIEW_ALL_DISTRIBUTORS,
        all_distributors: data.result,
      });
    })
    .catch((error) => {
      return;
    });
};

export const setFilteredDistributors = (data) => (dispatch) => {
  dispatch({
    type: FILTERED_DISTRIBUTORS,
    filtered_distributors: data
  });
}

export const setSelectedDistributors = (data) => (dispatch) => {
  dispatch({
    type: SELECTED_DISTRIBUTORS,
    selected_distributors: data,
  });
};


export const saveDist = (kpo_id, params, selectedDist) => (dispatch) => {
  const userApi =  userNet()
  userApi
    .patch("edit-profile/" + kpo_id, params)
    .then((result) => {
      dispatch({
        type: SAVE_DISTRIBUTORS,
        new_distributors: selectedDist
      });
    })
    .catch((error) => {
      return;
    });
};


export const setDetailsForAssignRole = (data) => (dispatch) => {
  dispatch({
    type: NEW_USER_DETAILS,
    user_details: data,
  });
};