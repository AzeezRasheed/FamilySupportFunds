import { INVOICE_DATA } from "../actions/types";

const initial_state = {
  invoice: {},
};

const InvoiceReducer = (state = initial_state, action) => {
  switch (action.type) {
    case INVOICE_DATA:
      return {
        ...state,
        invoice: action.invoice,
      };
    default:
      return state;
  }
};
export default InvoiceReducer;
