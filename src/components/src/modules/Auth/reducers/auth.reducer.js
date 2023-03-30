import authActionTypes from '../actions/auth.type';

const initialState = {

  loadingUser: false,
  loadError: null,

  sessionUser: null,
  sessionUserData: {},
  sessionError: null,


};

const reducer = (state = initialState, { type, payload, authenticated }) => {

  switch (type) {

    // Loading the user
    case authActionTypes.LOAD_USER_START:
      return {
        ...state,
        loadingUser: true,
      };
    case authActionTypes.LOAD_USER_FAILURE:
      return {
        ...state,
        sessionError: payload,
        loadingUser: false,
      };
    case authActionTypes.LOAD_USER_SUCCESS:
      return {
        ...state,
        sessionUser: payload,
        sessionError: null,
        loadingUser: false,
      };
      case authActionTypes.LOAD_USER_DATA_SUCCESS:
        return {
          ...state,
          loadingUser: false,
          sessionUserData: payload,
          authenticated
        };

    default:
      return state;
  }
}

export default reducer;