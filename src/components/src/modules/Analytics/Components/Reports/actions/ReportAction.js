import { SHOW_CALENDAR, SELECTED_DATE_RANGE, INVOICE_DATA } from "./types";
import {reportNet} from '../../../utils/urls'

export const showCalendar = (action) => (dispatch) => {
  dispatch({
    type: SHOW_CALENDAR,
    show: action,
  });
};

export const setSelectedDateRange = (range) => (dispatch) => {
  dispatch({
    type: SELECTED_DATE_RANGE,
    range: range,
  });
};



export const addReportInvoice = (values) => (dispatch) => {
  const report = reportNet()
  report.post('create-invoice/sales-report', values).then((response) => {
    const { data } = response
    return dispatch({
      type: INVOICE_DATA,
      invoice: data
    })
  })
  .catch((error) => {
    return;
  });
}
