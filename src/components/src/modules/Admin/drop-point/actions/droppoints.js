import axios from "axios"
import {
  GET_COMPANY_DROPPOINT,
  ADD_COMPANY_DROPPOINT,
  SET_FROM_DROPPOINT,
  SET_TO_DROPPOINT,
} from "./types";

import { locationNet } from "../../../../utils/urls";

export const addDropPoint = (details) => (dispatch) =>  axios
.post('http://20.87.33.90/register', details)
    .then((response) => {
      return dispatch({
        type: ADD_COMPANY_DROPPOINT,
        droppoints: response,
      });
    })
    .catch((error) => {
    });

export const getDroppointsByCompanyId =
  (sellercode) => (dispatch) => {
    const location = locationNet()
    location
      .get(`drop-point/company/${sellercode}`)
      .then((response) => {
        const { data } = response
        return dispatch({
          type: GET_COMPANY_DROPPOINT,
          droppoints: data.results,
        });
      })
      .catch((error) => {
        return;
      });
  };

  export const setFromLocation = (fromDroppoint) => (dispatch) => {
        return dispatch({
          type: SET_FROM_DROPPOINT,
          fromDroppoint: fromDroppoint,
        });
    }
    export const setToLocation = (toDroppoint) => (dispatch) => {
      return dispatch({
        type: SET_TO_DROPPOINT,
        toDroppoint: toDroppoint,
      });
    };