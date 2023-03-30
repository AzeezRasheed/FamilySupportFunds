import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const distributorNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/company/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const productNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/product/api/v1/products/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const inventoryNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/inventory/api/v1/inventory/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const inventory = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/inventory/api/v1/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const overallInventoryNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL:
      `${process.env.REACT_APP_BASE_URL}/inventory/api/v1/inventory/overall/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const inventoryNetTemp = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: "http://20.87.34.168/api/v1/inventory/",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const orderNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/order/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const createOrderNet = () => {
  const token = process.env.REACT_APP_ORDER_TOKEN;
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/order/CreateOrder`,
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const userNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/user/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const openOrdersNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL:
      `${process.env.REACT_APP_BASE_URL}/order/GetOrder/GetOpenOrderBySellerCompanyId/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const completedOrdersNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL:
      `${process.env.REACT_APP_BASE_URL}/order/GetOrder/GetCompletedOrderBySellerCompanyId/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const customerNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/customer/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const vehicleNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/vehicle/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const locationNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: "http://20.87.33.90/",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const customerNetBase = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/customer/customer`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const reportNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/report/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const vsm = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: "http://102.133.206.181/GetVehicle/",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const productCatolgueNet = () => {
  const token = localStorage.getItem("userData");
  return axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/productcatalogue/`,
    headers: { Authorization: `Bearer ${token}` },
  });
};

const urls = {
  distributorNet,
  productCatolgueNet,
  productNet,
  orderNet,
  inventoryNet,
  userNet,
  inventoryNetTemp,
  overallInventoryNet,
};

export default urls;
