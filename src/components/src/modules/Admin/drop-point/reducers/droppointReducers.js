import {
  ADD_COMPANY_DROPPOINT,
  GET_COMPANY_DROPPOINT,
  SET_TO_DROPPOINT,
  SET_FROM_DROPPOINT,
} from "../actions/types";
  
  const initial_state = {
    drop_points: [],
    to_dropPoint: "",
    from_dropPoint: ""
  };
  
  const DropPointReducer = (state = initial_state, action) => {
    switch (action.type) {
      case ADD_COMPANY_DROPPOINT:
        return {
          ...state,
          drop_points: [...state.drop_points, action.droppoints.data.result],
        };
      case GET_COMPANY_DROPPOINT: {
        return { ...state, drop_points: action.droppoints };
      }
      case SET_TO_DROPPOINT: {
        return { ...state, to_dropPoint: action.toDroppoint };
      }
      case SET_FROM_DROPPOINT: {
        return { ...state, from_dropPoint: action.fromDroppoint };
      }
      default:
        return state;
    }
  }
  
  export default DropPointReducer;
  
  
  