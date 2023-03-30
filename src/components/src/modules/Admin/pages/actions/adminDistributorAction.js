import axios from "axios";
import {
  ADD_DISTRIBUTOR,
  DELETE_DISTRIBUTOR,
  EDIT_DISTRIBUTOR,
  VIEW_ALL_DISTRIBUTOR,
  VIEW_SINGLE_DISTRIBUTOR,
  VIEW_SINGLE_KPO,
  VIEW_MY_DISTRIBUTORS,
} from "./types";
import { distributorNet, userNet } from "../../../../utils/urls";

export const addDistributor = (details) => (dispatch) =>
  axios
    .post(`${process.env.REACT_APP_BASE_URL}/company/register`, details)
    .then((response) => {
      return dispatch({
        type: ADD_DISTRIBUTOR,
        payload: response,
      });
    })
    .catch((error) => Promise.reject(error.response.data.msg));

export const uploadCSV = (details) => {
  let formData = new FormData();
  formData.append("csv", details);
  axios
    .post("/upload-company", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      // console.log(response, "csv");
      return response;
    })
    .catch((error) => {});
};

export const editDistributor = (details) => (dispatch) => {
  const distributor = distributorNet();
  distributor
    .patch("", details)
    .then((response) => {
      return dispatch({
        type: EDIT_DISTRIBUTOR,
        payload: response,
      });
    })
    .catch((error) => {
      return;
    });
};

export const deleteDistributor = (details) => (dispatch) => {
  const distributor = distributorNet();
  distributor
    .delete("", details)
    .then((response) => {
      return dispatch({
        type: DELETE_DISTRIBUTOR,
        payload: response,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllDistributor = (country) => async (dispatch) => {
  try {
    const distributor = await distributorNet();

    const response = await distributor.get("company/companies/" + country);
    const { data } = response;
    return dispatch({
      type: VIEW_ALL_DISTRIBUTOR,
      all_distributors: data.result,
    });
  } catch (error) {
    return;
  }
};

export const getSingleDistributor = (code) => async (dispatch) => {
  const distributor = await distributorNet();
  distributor
    .get(`company/code/${code}`)
    .then((response) => {
      return dispatch({
        type: VIEW_SINGLE_DISTRIBUTOR,
        payload: response.data.result,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getSingleDistributorBySyspro = (code) => async (dispatch) => {
  const distributor = await distributorNet();
  distributor
    .get(`company/syspro/${code}`)
    .then((response) => {
      return dispatch({
        type: VIEW_SINGLE_DISTRIBUTOR,
        payload: response.data.result,
      });
    })
    .catch((error) => {
      return;
    });
};

export const getSingleKPO = (data) => async (dispatch) => {
  return dispatch({
    type: VIEW_SINGLE_KPO,
    payload: data,
  });
};

export const setMiniAdminDistributors = (data) => async (dispatch) => {
  return dispatch({
    type: VIEW_MY_DISTRIBUTORS,
    payload: data,
  });
};
