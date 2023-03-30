import axios from "axios";
import {
	ADD_CUSTOMERS,
	DELETE_CUSTOMERS,
	EDIT_CUSTOMERS,
	VIEW_ALL_DISTRIBUTOR_CUSTOMERS,
	VIEW_ALL_DISTRIBUTOR_CUSTOMER_ORDERS,
	VIEW_SINGLE_DISTRIBUTOR_CUSTOMER,
	VIEW_SINGLE_DISTRIBUTOR_CUSTOMER_ORDER,
	ALL_CUSTOMERS,
	ALL_ONE_OFF_CUSTOMERS_START,
	ALL_ONE_OFF_CUSTOMERS,
	ALL_ONE_OFF_CUSTOMERS_FAILED,
	ADD_ONE_OFF_CUSTOMERS_START,
	ADD_ONE_OFF_CUSTOMERS,
	ADD_ONE_OFF_CUSTOMERS_FAILED,
	CLEAR_ONE_OFF_CUSTOMERS,
	UPDATE_CUSTOMER_STATUS,
	CURRENT_CUSTOMER,
	PAGINATED_CUSTOMERS
} from "./types";
import { customerNet, customerNetBase, orderNet } from "../../../../utils/urls";

export const addCustomers = (details) => (dispatch) =>
	customerNet()
		.post("register", details)
		.then((response) => {
			return dispatch({
				type: ADD_CUSTOMERS,
				customer: response,
			});
		})
		.catch((error) => Promise.reject(error.response.data.msg));

export const editCustomers = (details, id) => (dispatch) => {
	const customerApi = customerNetBase();
	customerApi
		.patch(`/updatecustomer/profile/${id}`, details)
		.then((response) => {
			return dispatch({
				type: EDIT_CUSTOMERS,
				customer: response,
			});
		})
		.catch((error) => {
			return;
		});
};

export const deleteCustomers = (details) => (dispatch) => {
	const customerApi = customerNetBase();
	customerApi
		.delete("", details)
		.then((response) => {
			return dispatch({
				type: DELETE_CUSTOMERS,
				payload: response,
			});
		})
		.catch((error) => {
			return;
		});
};

export const getAllCustomers = (country) => async (dispatch) => {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_BASE_URL}/customer/customer/getbycountry/${country}`
		);
		const { data } = response;
		return dispatch({
			type: ALL_CUSTOMERS,
			all_customers: data.result
		});
	} catch (error) {
		console.log(error, "Error..");
		return;
	}
};

export const getPaginatedCustomers = (country, currentPage, customerType) => async (dispatch) => {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_BASE_URL}/customer/customer/getbycountry/${country}?page=${currentPage}&limit=10&customerType=${customerType}`
		);
		const { data } = response;
		return dispatch({
			type: PAGINATED_CUSTOMERS,
			paginated_customers: data.result,
			total_pages: data.totalPages
		});
	} catch (error) {
		console.log(error, "Error..");
		return;
	}
};

export const getMiniAdminCustomers = (dist) => async (dispatch) => {
	try {
		const customerApi = customerNetBase();
		const response = await customerApi.post(`/getbydistributor-array/`, dist);
		const { data } = response;
		return dispatch({
			type: ALL_CUSTOMERS,
			all_customers: data.results,
		});
	} catch (error) {
		return;
	}
};

export const updateCustomerStatus = (customerId, value) => async (dispatch) => {
	try {
		const customerApi = customerNet();
		const response = await customerApi.patch(
			`/updatecustomer/status/${customerId}`,
			value
		);
		const { data } = response;
		return dispatch({
			type: UPDATE_CUSTOMER_STATUS,
			updatedStaus: data,
		});
	} catch (error) {
		return;
	}
};

export const getAllDistributorCustomers = (code) => async (dispatch) => {
	try {
		const response = await axios.get(
			` ${process.env.REACT_APP_BASE_URL}/customer/customer/distributor/${code}`
		);
		const { data } = response;
		return dispatch({
			type: VIEW_ALL_DISTRIBUTOR_CUSTOMERS,
			all_customers: data.result,
		});
	} catch (error) {
		return;
	}
};

export const getAllDistributorCustomerOrders =
	(customerId) => async (dispatch) => {
		const orderApi = orderNet();
		try {
			const response = await orderApi.get(
				`GetOrderByBuyerCompanyId/${customerId}`
			);
			const { data } = response;
			return dispatch({
				type: VIEW_ALL_DISTRIBUTOR_CUSTOMER_ORDERS,
				all_dist_customers_orders: data.result,
			});
		} catch (error) {
			return;
		}
	};

export const getSingleDistributorCustomers =
	(id, country) => async (dispatch) => {
		const customerApi = customerNetBase();
		customerApi
			.post(`salesforce/${id}`, { country: country })
			.then((response) => {
				return dispatch({
					type: VIEW_SINGLE_DISTRIBUTOR_CUSTOMER,
					customer: response.data.result,
				});
			})
			.catch((error) => {
				return;
			});
	};

export const getSingleDistributorCustomerOrder =
	(buyercode, sellercodecode) => async (dispatch) => {
		const orderApi = orderNet();
		orderApi
			.get(
				`/GetOrder/GetOrderByBuyerDistributorId/${buyercode}/${sellercodecode}`
			)
			.then((response) => {
				return dispatch({
					type: VIEW_SINGLE_DISTRIBUTOR_CUSTOMER_ORDER,
					orders: response.data.order,
				});
			})
			.catch((error) => {
				return;
			});
	};

const loadAllOneOffCustomers = () => {
	return {
		type: ALL_ONE_OFF_CUSTOMERS_START,
	};
};
const allOneOffCustomers = (payload) => {
	return {
		type: ALL_ONE_OFF_CUSTOMERS,
		payload,
	};
};
const allOneOffCustomersFailed = (payload) => {
	return {
		type: ALL_ONE_OFF_CUSTOMERS_FAILED,
		payload,
	};
};

export const getAllOneOffCustomers = (country) => {
	const customerApi = customerNet();
	return async (dispatch) => {
		dispatch(loadAllOneOffCustomers());
		try {
			const res = await customerApi.get(
				"/oneoff-customer/getbycountry/" + country
			);
			dispatch(allOneOffCustomers(res.data.result));
		} catch (err) {
			dispatch(allOneOffCustomersFailed("Internal sever error"));
		}
	};
};

const loadAddOneOffCustomers = () => {
	return {
		type: ADD_ONE_OFF_CUSTOMERS_START,
	};
};
const addOneOffCustomer = (payload) => {
	return {
		type: ADD_ONE_OFF_CUSTOMERS,
		payload,
	};
};
const addOneOffCustomerFailed = (payload) => {
	return {
		type: ADD_ONE_OFF_CUSTOMERS_FAILED,
		payload,
	};
};

export const updateCustomer = (action) => (dispatch) =>{
  dispatch({
    type: CURRENT_CUSTOMER,
    customer: action
  })
}

export const addOneOffCustomerAction = (customerName, phoneNumber, country) => {
	const customerApi = customerNet();
	return async (dispatch) => {
		dispatch(loadAddOneOffCustomers());
		try {
			const res = customerApi.post("/oneoff-customer/register", {
				customerName,
				phoneNumber,
				country,
			});
			dispatch(addOneOffCustomer(res.data));
		} catch (err) {
			dispatch(addOneOffCustomerFailed(err.response.data));
		}
	};
};

export const clearOneOff = () => async (dispatch) => {
	dispatch({ type: CLEAR_ONE_OFF_CUSTOMERS });
};

export const uploadCSVCustomerList = (file) => {
	const formData = new FormData();
	formData.append("csv", file)
	return async () => {
		const customerApi = customerNet();
		try {
			const res = await customerApi.post("/uploadcsv/upload", formData);
			return {
				isError: false
			}
		} catch (err) {
			console.log(err.response)
			const { reason: reasons, message} = err.response.data || {}
			return {
				isError: true,
				reasons,
				message
			}
		}
	};
};
