import { v4 as uuidv4 } from 'uuid';
import alertActionTypes from '../../types/common/alert.type';

const addAlert = (payload) => {
  return {
    type: alertActionTypes.ADD_ALERT,
    payload,
  };
}

const removeAlert = (payload) => {
  return {
    type: alertActionTypes.REMOVE_ALERT,
    payload,
  };
}

export const setAlert = (title, body, type, timeout = 9000) => (dispatch) => {
  const id = uuidv4();
  dispatch(addAlert({ title, body, type, id }));

  setTimeout(() => {
    dispatch(removeAlert(id));
  }, timeout);
};

export const clearAlerts = () => {
  return {
    type: alertActionTypes.CLEAR_ALERTS,
  };
};
