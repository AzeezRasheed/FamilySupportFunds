import {
  GET_SINGLE_VAN_INVENTORY,
  LOAD_VAN_INVENTORY,
  UNSAVED_VAN_CHANGES,
  UPDATED_QUANTITY,
  DISCARD_CHANGES,
  DRIVER_DETAILS,
  ASSIGN_TO_VAN,
} from "./types";
import { inventory, inventoryNet, vehicleNet } from "../../../utils/urls";

export const getAllSingleVanInventory = (vanId) => async (dispatch) => {
  const inventoryApi = inventory();
  inventoryApi
    .get(`van/${vanId}`)
    .then((response) => {
      const { data } = response.data;
      dispatch({
        type: GET_SINGLE_VAN_INVENTORY,
        all_single_inventory: data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const transferQuantity =
  (quantitiesToSave, distCode, driverId) => (dispatch) => {
    dispatch({
      type: UPDATED_QUANTITY,
      transfer_quantities: quantitiesToSave,
      driverId,
      distCode,
    });
  };

export const discardChanges = () => (dispatch) => {
  dispatch({
    type: DISCARD_CHANGES,
  });
};

export const updateTransferQuantity = (action) => (dispatch) => {
  dispatch({
    type: UNSAVED_VAN_CHANGES,
    transfer_change: action,
  });
};

export const loadVanData = (values) => async (dispatch) => {
  const inventoryApi = inventory();
  inventoryApi
    .post(
      `van/replenish`,
      values
    )
    .then((response) => {
      return dispatch({
        type: LOAD_VAN_INVENTORY,
        loadVan: response.data,
      });
    })
    .catch((error) => {
      return;
    });
};

export const assignToVan = (values) => async (dispatch) => {
  let walkInStock = [];
  let otherStock = [];
  const companyCode = values.companyCode;
  const vehicleId = values.vehicleId;
  const inventoryApi = inventory();
  values.stocks.map((item) => {
    item.route === "Walk-In-Sales"
      ? walkInStock.push(item)
      : otherStock.push(item);
  });
  if (walkInStock.length > 0) {
    // console.log("will do walk in", walkInStock);
    inventoryApi
      .post(
        `van/assign-order?is_walk_in=true`,
        {
          companyCode,
          vehicleId,
          stocks: walkInStock,
        }
      )
      .then((response) => {
        return dispatch({
          type: ASSIGN_TO_VAN,
          assignToVan: response.data,
        });
      });
  }
  if (otherStock.length > 0) {
    // console.log("will do other stock", otherStock);
    inventoryApi
      .post(`van/assign-order`, {
        companyCode,
        vehicleId,
        stocks: otherStock,
      })
      .then((response) => {
        return dispatch({
          type: ASSIGN_TO_VAN,
          assignToVan: response.data,
        });
      });
  }

  // inventoryNet
  //   .post(
  //     ` /van/assign-order`,
  //     values
  //   )
  //   .then((response) => {
  //     return dispatch({
  //       type: ASSIGN_TO_VAN,
  //       assignToVan: response.data,
  //     });
  //   })
  //   .catch((error) => {
  //     return;
  //   });
};

export const getDriverDetails = (vehicleID) => async (dispatch) => {
  const vehicle = vehicleNet();
  vehicle
    .get(`GetVehicle/GetByVehicleId/${vehicleID}`)
    .then((response) => {
      return dispatch({
        type: DRIVER_DETAILS,
        driverDetails: response.data,
      });
    })
    .catch(() => {
      return;
    });
};
