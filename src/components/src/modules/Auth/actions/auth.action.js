import axios from 'axios';
import authActionTypes from './auth.type';
import { userNet } from "../../../utils/urls"
import setAuthorization from '../../../utils/authorization';
import jwtDecode from 'jwt-decode';
import { faUserInjured } from '@fortawesome/free-solid-svg-icons';




const { REACT_APP_BASE_URL } = process.env;

console.log('====================================');
console.log(REACT_APP_BASE_URL);
console.log('====================================');





const loadUserStart = (payload) => {
  return {
    type: authActionTypes.LOAD_USER_START,
    payload,
  };
}

const loadUserFailed = (payload) => {
  return {
    type: authActionTypes.LOAD_USER_FAILURE,
    payload,
  };
}

const loadUserSuccess = (payload) => {
  return {
    type: authActionTypes.LOAD_USER_SUCCESS,
    payload,
  };
}
export const loadUserDataSuccess = (payload) => {
  return {
    type: authActionTypes.LOAD_USER_DATA_SUCCESS,
    payload,
    authenticated: true
  };
}


export const loadUser = () => async (dispatch) => {
  const userApi =  await userNet()
  
  dispatch(loadUserStart());
  const profile = await sessionStorage.getItem('oidc.user:https://dms20prod.b2clogin.com/dms20prod.onmicrosoft.com/B2C_1_dms_signup_signin:572c6a9e-48d3-4382-9452-6e58ca198f92')
  const list = JSON.parse(profile);
  try {
    if (!list.profile.emails[0]) {
      dispatch(loadUserFailed("User not found!!!"));
      
    } else {
      const res = userApi.get(`fetchuser/${list.profile.emails[0]}`)
      let token = res?.data?.result
      const currentUser = jwtDecode(token);
      if (token && currentUser?.email) {
        setAuthorization(token);
        dispatch(loadUserSuccess(currentUser)) 
      }
    }
  } catch (err) {
    return err   
  }
};


export const logoutUser = () => async (dispatch) => {
  const token = await localStorage.removeItem("userData")
  dispatch(loadUserFailed(token))
}