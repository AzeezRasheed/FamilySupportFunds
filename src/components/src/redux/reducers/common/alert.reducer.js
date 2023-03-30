import alertActionTypes from '../../types/common/alert.type';

const initialState = [];

const reducer = (state = initialState, { type, payload }) => {

  switch (type) {
    case alertActionTypes.ADD_ALERT:
      return [...state, payload];

    case alertActionTypes.REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);

    case alertActionTypes.CLEAR_ALERTS:
      return initialState;

    default:
      return state;
  }
}

export default reducer;