import {
  GET_SINGLE_VAN_INVENTORY,
  UPDATED_QUANTITY,
  UNSAVED_VAN_CHANGES,
  LOAD_VAN_INVENTORY,
  DISCARD_CHANGES,
  DRIVER_DETAILS,
} from "../actions/types";

const initial_state = {
  all_single_van_inventory: [],
  load_van: {},
  transfer_quantities: [],
  driverId: null,
  distCode: null,
  driverDetails: {},
  transferVanChange: false,
};
const VanReducer = (state = initial_state, action) => {
  switch (action.type) {
    case LOAD_VAN_INVENTORY:
      return {
        ...state,
        all_single_van_inventory: [
          ...state.all_single_van_inventory,
          action.loadVan,
        ],
      };
    case UPDATED_QUANTITY: {
      return {
        ...state,
        transfer_quantities: action.transfer_quantities,
        driverId: action.driverId,
        distCode: action.distCode,
      };
    }
    case UNSAVED_VAN_CHANGES: {
      return { ...state, transferVanChange: action.transfer_change };
    }
    case DISCARD_CHANGES: {
      return { ...state, transferChange: false };
      //return {state}//clears the whole store
    }
    case GET_SINGLE_VAN_INVENTORY: {
      return {
        ...state,
        all_single_van_inventory: action.all_single_inventory,
      };
    }
    case DRIVER_DETAILS: {
      return {
        ...state,
        driverDetails: action.driverDetails.data,
      };
    }
    default:
      return state;
  }
};

export default VanReducer;
