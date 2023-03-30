import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ToastProvider } from "react-toast-notifications";
import { ConnectivityListener } from "./components/common/ConnectivityListener";
import CallBackPage from "./callBack";
import AuthRoute from "./components/common/AuthRoute";
import CreateAccount from "./modules/Auth/pages/CreateAccount";
import Login from "./modules/Auth/pages/Login";
// import ForgotPassword from "./modules/Auth/pages/ForgotPassword"
import configureStore from "./redux/store";
import { useDispatch } from "react-redux";
import PrivateRoute from "./components/common/PrivateRoute";
import AuthEmail from "./modules/Auth/pages/AuthEmail";
import DistributorList from "./modules/Distributors/pages/DistributorList";
import Overview from "./modules/Distributors/pages/DistributorDashboard";
import Notifications from "./modules/Notification/pages/NotificationList";
import AdminNotifications from "./modules/Notification/pages/AdminNotificationList";
import Inventory from "./modules/Inventory/pages/InventoryHome";
import InventoryAdjustment from "./modules/InventoryAdjusment/pages/InventoryHome";
import Transactions from "./modules/Transaction/components/TransactionPage";
import SingleOrder from "./modules/Transaction/pages/singleOrder";
import VanInventory from "./modules/VanInventory/pages/VanInventoryHome";
import AdminDashboard from "./modules/Admin/pages/AdminDashboard";
import MiniAdminDashboard from "./modules/Mini-Admin/pages/Dashboard";
import AdminDistroDetails from "./modules/Admin/pages/AdminDistroDetails";
import VanReplenishment from "./modules/VanInventory/pages/VanReplenishment/pages";
import WarehouseTransfer from "./modules/WarehouseTransfer/pages";
import Stock from "./modules/Stock/pages/ReceiveStock";
import AddDetails from "./modules/Stock/components/step2";
import AddProduct from "./modules/Stock/components/step3";
import { ToastNotifications } from "./components/common/ToastNotifications";
import NigFav from "./assets/svg/favicon.ico";
import GhaFav from "./assets/svg/kuja-logo.svg";

import {
  loadUser,
  loadUserDataSuccess,
} from "./modules/Auth/actions/auth.action";
import userManager from "./utils/userManager";
import { OidcProvider } from "redux-oidc";
import { createBrowserHistory } from "history";
import CaptureSales from "./modules/Transaction/components/CaptureSales";
import DistroCustomer from "./modules/Admin/pages/DistroCustomer";
import KpoCustomers from "./modules/customer/list";
import Customers from "./modules/Admin/customer/list";
import AllCustomers from "./modules/Admin/customer/AllCustomers";
import MinAdminCustomers from "./modules/Mini-Admin/customer/list";
import User from "./modules/Admin/user";
import ManageCustomer from "./modules/Admin/customer/manage";
import KpoManageCustomer from "./modules/customer/manage";
import Orders from "./modules/Admin/order/list";
import OrderSummary from "./modules/Admin/order/summary";
import KpoOrderSummary from "./modules/order/summary";
import KpoOrderList from "./modules/order/lists";
import Pricing from "./modules/Admin/Pricing";
import DropPoint from "./modules/Admin/drop-point";
import KPO from "./modules/Admin/KPO/ListKPO";
import ManageKPO from "./modules/Admin/KPO/ManageKPO";
import Settings from "./modules/Settings/index";
import DistributorReports from "./modules/Admin/Reports/Distributors";
import AdminReports from "./modules/Admin/Reports/AdminReports";
import AdminTotalSalesReport from "./modules/Admin/Reports/AdminReports/TotalSalesReport";
import AdminTotalDelivery from "./modules/Admin/Reports/AdminReports/TotalSalesByDelivery";
import AdminTotalVolumeSold from "./modules/Admin/Reports/AdminReports/TotalSalesByVolumeSold";
import AdminTotalVolumeReceived from "./modules/Admin/Reports/AdminReports/TotalSalesByVolumeReceived";
import AdminStockReceived from "./modules/Admin/Reports/AdminReports/AdminStockReceived";
import AdminSingleStockReceived from "./modules/Admin/Reports/AdminReports/AdminSingleStock";
import AdminTotalWalkInSales from "./modules/Admin/Reports/AdminReports/TotalSalesByWalkin";
import AdminTotalVanSales from "./modules/Admin/Reports/AdminReports/TotalSalesByVan";
import AdminDailyStockCount from "./modules/Admin/Reports/AdminReports/DailyStockCount";
import ClosingStockReport from "./modules/Admin/Reports/AdminReports/ClosingStock";
import AdminStockLevel from "./modules/Admin/Reports/AdminReports/StockLevel";
import MiniAdminReports from "./modules/Mini-Admin/Reports";
import MiniAdminTotalSalesReport from "./modules/Mini-Admin/Reports/TotalSalesReport";
import MiniAdminTotalDelivery from "./modules/Mini-Admin/Reports/TotalSalesByDelivery";
import MiniAdminTotalVolumeSold from "./modules/Mini-Admin/Reports/TotalSalesByVolumeSold";
import MiniAdminTotalVolumeReceived from "./modules/Mini-Admin/Reports/TotalSalesByVolumeReceived";
import MiniAdminStockReceived from "./modules/Mini-Admin/Reports/StockReceived";
import MiniAdminSingleStockReceived from "./modules/Mini-Admin/Reports/SingleStock";
import MiniAdminTotalWalkInSales from "./modules/Mini-Admin/Reports/TotalSalesByWalkin";
import MinAdminSummary from "./modules/Mini-Admin/pages/Summary";
import MiniAdminTotalVanSales from "./modules/Mini-Admin/Reports/TotalSalesByVan";
import MiniAdminDailyStockCount from "./modules/Mini-Admin/Reports/DailyStockCount";
import MiniAdminStockLevel from "./modules/Mini-Admin/Reports/StockLevel";
import MiniAdminClosingStock from "./modules/Mini-Admin/Reports/ClosingStock";
import MiniAdminDistributorStockLevel from "./modules/Mini-Admin/Reports/Distributors/StockLevel";
import MiniAdminDistributorClosingStock from "./modules/Mini-Admin/Reports/Distributors/ClosingStock";
import MiniAdminUsers from "./modules/Mini-Admin/Users/ListUsers";
import UnAssigned from "./modules/Auth/Layout/UnAssigned";
import DistributorTotalSales from "./modules/Admin/Reports/Distributors/TotalSales";
import DistributorTotalDelivery from "./modules/Admin/Reports/Distributors/SalesByDelivery";
import DistributorWalkInSales from "./modules/Admin/Reports/Distributors/WalkInSales";
import DistributorVanSales from "./modules/Admin/Reports/Distributors/VanSales";
import DistributorVolumeSold from "./modules/Admin/Reports/Distributors/VolumeSold";
import DistributorVolumeReceived from "./modules/Admin/Reports/Distributors/VolumeReceived";
import DistributorStockReceived from "./modules/Admin/Reports/Distributors/StockReceived";
import DistributorAllCustomerReport from "./modules/Admin/Reports/Distributors/AllCustomers";
import DistributorStockLevel from "./modules/Admin/Reports/Distributors/StockLevel";
import DistributorClosingStock from "./modules/Admin/Reports/Distributors/ClosingStock";
import DashboardTotalSales from "./modules/Reports/TotalSales";
import DashboardTotalDelivery from "./modules/Reports/SalesByDelivery";
import DashboardWalkInSales from "./modules/Reports/WalkInSales";
import DashboardOneOffSales from "./modules/Reports/OneOffSales";
import DashboardVanSales from "./modules/Reports/VanSales";
import DashboardVolumeSold from "./modules/Reports/VolumeSold";
import DashboardVolumeReceived from "./modules/Reports/VolumeReceived";
import DashboardStockReceived from "./modules/Reports/StockReceived";
import DashboardSingleStockReceived from "./modules/Reports/SingleStockReceived";
import DashboardAllCustomerReport from "./modules/Reports/AllCustomers";
import ReceiveEmpties from "./modules/Inventory/pages/ReceiveEmpties";
import ReturnEmpties from "./modules/Inventory/pages/ReturnEmpties";
import DashboardDropPoints from "./modules/Settings/DropPoints";
import InventorySetup from "./modules/Inventory/pages/InventorySetup";
import ReturnProducts from "./modules/Inventory/pages/ReturnProducts";
import Reports from "./modules/Reports";
import DriverRedirect from "./modules/Driver/Driver";
import SalesReturn from "./modules/order/SalesReturn";
import ReturnSummary from "./modules/order/ReturnSummary";
import VanTransactions from "./modules/VanInventory/pages/VanTransactions";
import VanSalesMen from "./modules/VanInventory/pages/VanSalesMen";
import Blocked from "./modules/Auth/Layout/Blocked";
import ManageVsm from "./modules/VanInventory/pages/VanSalesMen/ManageVsms";
import VolumeSoldPerProduct from "./modules/Reports/VolumeSoldPerProduct";
import Drivers from "./modules/Admin/Drivers/ListDrivers";
import Users from "./modules/Admin/Users/ListUsers";
import ManageUser from "./modules/Admin/Users/ManageUsers";
import ManageMiniAdminUser from "./modules/Mini-Admin/Users/ManageUsers";
import Other_Products from "./modules/Inventory/pages/OtherProducts";
import TotalSalesBySAP from "./modules/Admin/Reports/AdminReports/TotalSalesBySAP";
import SalesBySAP from "./modules/Reports/SalesBySAP";
import Analytics from "./modules/Analytics/pages";
import DailyStockCount from "./modules/Inventory/pages/DailyStockCount";
import useHotjar from "react-use-hotjar";
const { REACT_APP_HOTJAR } = process.env;

let { store, persistor } = configureStore();
// let { store } = configureStore();

const App = () => {
  const dispatch = useDispatch();
  const { initHotjar, stateChange } = useHotjar();
  // const [userCountry, setUserCountry] = useState('Ghana');

  useEffect(() => {
    initHotjar(REACT_APP_HOTJAR, 6, false);
  }, [initHotjar]);
  useEffect(() => {
    stateChange(window.location.pathname);
  }, [stateChange]);

  useEffect(async () => {
    // const loc = await getLocation();
    // setUserCountry(loc);
    // const faviconUpdate = async () => {
    //   //grab favicon element by ID
    //   const favicon = document.getElementById("favicon");
    //   //check count value, if below 0 we change href property to our red circle image path
    //   if (userCountry === "Ghana") {
    //     favicon.href = GhaFav;
    //     console.log(favicon);
    //   }
    //   //if above 0, we set back to green
    //   else {
    //     favicon.href = NigFav;
    //   }
    // };
    // //run our function here
    // faviconUpdate();

    loadUser();
  }, []);

  return (
    <ToastProvider>
      <ConnectivityListener />
      <ToastNotifications />
      <BrowserRouter>
        <Switch>
          <Route path="/" component={AuthEmail} exact />
          <Route path="/email" component={AuthEmail} />
          <AuthRoute path="/create-account" component={CreateAccount} />
          <AuthRoute path="/login" component={Login} />
          <AuthRoute path="/callback" component={CallBackPage} />
          {/* <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/password-reset/:token" component={PasswordReset} />
          <Route path="/reset-success-email" component={PasswordResetEmail} /> */}
          <PrivateRoute
            exact
            path="/dashboard/overview/:Dist_Code"
            component={Overview}
          />
          <PrivateRoute
            path="/dashboard/inventory/:Dist_Code"
            component={Inventory}
          />
       
          <PrivateRoute
            path="/dashboard/inventory-adjustment/:Dist_Code"
            component={InventoryAdjustment}
          />
          <PrivateRoute
            path="/dashboard/transactions/:distCode"
            component={Transactions}
          />
          <Route path="/dashboard/settings/:distCode" component={Settings} />
          <Route
            path="/dashboard/drop-points/:distCode"
            component={DashboardDropPoints}
          />
          <PrivateRoute
            path="/dashboard/walk-in-sales/:distCode"
            component={CaptureSales}
          />
          <PrivateRoute path="/dashboard/order/id" component={SingleOrder} />
          <PrivateRoute path="/dashboard/stock/:Dist_Code" component={Stock} />
          <PrivateRoute
            path="/dashboard/inventory-setup/:Dist_Code"
            component={InventorySetup}
          />
          <PrivateRoute
            path="/dashboard/return-products/:Dist_Code"
            component={ReturnProducts}
          />
          <PrivateRoute
            path="/dashboard/add-details/:Dist_Code"
            component={AddDetails}
          />
          <PrivateRoute
            path="/dashboard/sales-return/:Dist_Code"
            component={SalesReturn}
          />
          <PrivateRoute
            path="/dashboard/add-product/:Dist_Code"
            component={AddProduct}
          />
             <PrivateRoute
            path="/dashboard/receive-empties/:Dist_Code"
            component={ReceiveEmpties}
          />
          <PrivateRoute
            path="/dashboard/return-empties/:Dist_Code"
            component={ReturnEmpties}
          />
          <PrivateRoute
            path="/dashboard/van-replenishment/:distcode"
            component={VanReplenishment}
          />
          <PrivateRoute
            path="/dashboard/warehouse-transfer/:distributorCode"
            component={WarehouseTransfer}
          />
          <PrivateRoute
            path="/dashboard/van-inventory/:distCode"
            component={VanInventory}
          />
          <Route path="/dashboard/notifications/:distCode" component={Notifications} />
          <Route
            role="Admin"
            path="/admin/overview"
            component={DistributorList}
          />
          <PrivateRoute role="KPO" path="/kpo/overview" component={Overview} />
          <Route path="/callback" component={CallBackPage} />
          {/* <PrivateRoute path="/dashboard/overview" component={Overview} /> */}
          <PrivateRoute
            exact
            path="/dashboard/inventory/:distCode"
            component={Inventory}
          />
          <PrivateRoute
            exact
            path="/dashboard/daily-stock/:Dist_Code"
            component={DailyStockCount}
          />
          <PrivateRoute path="/dashboard/stock" component={Stock} />
          <PrivateRoute
            exact
            path="/min-admin-dashboard"
            component={MiniAdminDashboard}
          />
          <PrivateRoute
            exact
            path="/admin-dashboard"
            component={AdminDashboard}
          />
          {/* <Route path="/admin/customer" component={DistroCustomer} /> */}
          <PrivateRoute
            path="/admin-distributor/:code"
            component={AdminDistroDetails}
          />
          <PrivateRoute
            exact
            path="/dashboard/van-replenishment/:distCode"
            component={VanReplenishment}
          />
          {/* <Route
            exact
            path="/dashboard/van-inventory/:distCode"
            component={VanInventory}
          /> */}
          <PrivateRoute
            exact
            path="/dashboard/notifications/:distCode"
            component={Notifications}
          />
          <PrivateRoute
            path="/dashboard/admin-notifications"
            component={AdminNotifications}
          />
          <PrivateRoute
            role="Admin"
            exact
            path="/kpo-supervisor/overview/:Dist_Code/:id"
            component={DistributorList}
          />
          <PrivateRoute role="KPO" path="/kpo/overview" component={Overview} />
          <PrivateRoute
            exact
            path="/distributor/customers/:distCode"
            component={Customers}
          />
          <PrivateRoute
            exact
            path="/admin-dashboard/customers"
            component={AllCustomers}
          />
          <PrivateRoute
            exact
            path="/dashboard/other-products/:DistCode"
            component={Other_Products}
          />
          <PrivateRoute
            exact
            path="/dashboard/customers/:Dist_Code"
            component={KpoCustomers}
          />
          <PrivateRoute
            exact
            path="/dashboard/analytics/:Dist_Code"
            component={Analytics}
          />
          <PrivateRoute
            exact
            path="/dashboard/van-transactions/:distCode"
            component={VanTransactions}
          />
          <PrivateRoute
            exact
            path="/dashboard/van-sales-men/:distCode"
            component={VanSalesMen}
          />
          <PrivateRoute
            path="/distributor/manage-customer/:distCode/:id"
            component={ManageCustomer}
          />
          <PrivateRoute
            path="/dashboard/manage-customer/:distCode/:id"
            component={KpoManageCustomer}
          />
          <PrivateRoute path="/distributor/users/:distCode" component={User} />
          <PrivateRoute
            path="/distributor/orders/:distCode"
            component={Orders}
          />
          <PrivateRoute
            path="/distributor/order-summary/:orderId/:buyerCode"
            component={OrderSummary}
          />
          <PrivateRoute
            path="/dashboard/orders-list/:distCode"
            component={KpoOrderList}
          />
          <PrivateRoute
            path="/dashboard/order-summary/:sellerId/:orderId/:buyerId"
            component={KpoOrderSummary}
          />
          <PrivateRoute
            path="/dashboard/sales-return-summary/:sellerId/:orderId/:buyerId"
            component={ReturnSummary}
          />
          <PrivateRoute path="/distributor/pricings" component={Pricing} />
          <PrivateRoute
            path="/distributor/drop-point/:id"
            component={DropPoint}
          />
          <PrivateRoute path="/distributor/backoffice" component={KPO} />
          <PrivateRoute path="/distributor/drivers" component={Drivers} />
          <PrivateRoute path="/admin-dashboard/users" component={Users} />
          <PrivateRoute
            path="/distributor/manage-backoffice/:id"
            component={ManageKPO}
          />
          <PrivateRoute
            path="/admin-dashboard/manage-user/:userType/:id"
            component={ManageUser}
          />
          <PrivateRoute
            exact
            path="/distributor/vsm-summary/:distCode/:vehicleId"
            component={ManageVsm}
          />
          <PrivateRoute
            exact
            path="/distributor/reports/:Dist_Code"
            component={DistributorReports}
          />
          <PrivateRoute
            exact
            path="/dashboard/reports/:Dist_Code"
            component={Reports}
          />
          <PrivateRoute
            exact
            path="/admin-dashboard/reports"
            component={AdminReports}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/totalsales"
            component={AdminTotalSalesReport}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/delivery"
            component={AdminTotalDelivery}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/sap"
            component={TotalSalesBySAP}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/volumesold"
            component={AdminTotalVolumeSold}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/volumereceived"
            component={AdminTotalVolumeReceived}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/stockreceived"
            component={AdminStockReceived}
          />
          <Route
            path="/admin-dashboard/reports/singlestockreceived/:Dist_Code/:docNo"
            component={AdminSingleStockReceived}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/walk-in-sales"
            component={AdminTotalWalkInSales}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/van-sales"
            component={AdminTotalVanSales}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/daily-stock-count"
            component={AdminDailyStockCount}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/closing-stock"
            component={ClosingStockReport}
          />
          <PrivateRoute
            path="/admin-dashboard/reports/stock-level"
            component={AdminStockLevel}
          />

          <PrivateRoute
            exact
            path="/min-admin-dashboard/reports"
            component={MiniAdminReports}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/totalsales"
            component={MiniAdminTotalSalesReport}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/delivery"
            component={MiniAdminTotalDelivery}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/volumesold"
            component={MiniAdminTotalVolumeSold}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/volumereceived"
            component={MiniAdminTotalVolumeReceived}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/stockreceived"
            component={MiniAdminStockReceived}
          />
          <Route
            path="/min-admin-dashboard/reports/singlestockreceived/:Dist_Code/:docNo"
            component={MiniAdminSingleStockReceived}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/walk-in-sales"
            component={MiniAdminTotalWalkInSales}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/van-sales"
            component={MiniAdminTotalVanSales}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/daily-stock-count"
            component={MiniAdminDailyStockCount}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/stock-level/:Dist_Code"
            component={MiniAdminDistributorStockLevel}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/closing-stock/:Dist_Code"
            component={MiniAdminDistributorClosingStock}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/stock-level"
            component={MiniAdminStockLevel}
          />
          <PrivateRoute
            path="/min-admin-dashboard/reports/closing-stock"
            component={MiniAdminClosingStock}
          />
          <PrivateRoute
            path="/min-admin-dashboard/users"
            component={MiniAdminUsers}
          />
          <PrivateRoute
            path="/min-admin-dashboard/users"
            component={MiniAdminUsers}
          />
          <PrivateRoute
            path="/min-admin-dashboard/manage-user/:id"
            component={ManageMiniAdminUser}
          />
          <PrivateRoute
            exact
            path="/min-admin-dashboard/customers"
            component={MinAdminCustomers}
          />
          <PrivateRoute
            exact
            path="/min-admin-dashboard/summary"
            component={MinAdminSummary}
          />

          <Route path="/auth/unassigned" component={UnAssigned} />
          <Route path="/auth/blocked" component={Blocked} />
          <Route
            path="/distributor/reports/totalsales/:Dist_Code"
            component={DistributorTotalSales}
          />
          <PrivateRoute
            path="/distributor/reports/stockreceived/:Dist_Code"
            component={DistributorStockReceived}
          />
          <PrivateRoute
            path="/distributor/reports/stock-level/:Dist_Code"
            component={DistributorStockLevel}
          />
          <PrivateRoute
            path="/distributor/reports/closing-stock/:Dist_Code"
            component={DistributorClosingStock}
          />
          <PrivateRoute
            path="/distributor/reports/volumesold/:Dist_Code"
            component={DistributorVolumeSold}
          />
          <PrivateRoute
            path="/distributor/reports/volumereceived/:Dist_Code"
            component={DistributorVolumeReceived}
          />
          <PrivateRoute
            path="/distributor/reports/sales-by-delivery/:Dist_Code"
            component={DistributorTotalDelivery}
          />
          <PrivateRoute
            path="/distributor/reports/walk-in-sales/:Dist_Code"
            component={DistributorWalkInSales}
          />
          <PrivateRoute
            path="/distributor/reports/van-sales/:Dist_Code"
            component={DistributorVanSales}
          />
          <PrivateRoute
            path="/distributor/reports/all-customers/:Dist_Code"
            component={DistributorAllCustomerReport}
          />
          <PrivateRoute
            path="/dashboard/totalsales/:Dist_Code"
            component={DashboardTotalSales}
          />
          <PrivateRoute
            path="/dashboard/volumesold/:Dist_Code"
            component={DashboardVolumeSold}
          />
          <PrivateRoute
            path="/dashboard/volumereceived/:Dist_Code"
            component={DashboardVolumeReceived}
          />
          <PrivateRoute
            path="/dashboard/sales-by-delivery/:Dist_Code"
            component={DashboardTotalDelivery}
          />
          <PrivateRoute
            path="/dashboard/sap/:Dist_Code"
            component={SalesBySAP}
          />
          <PrivateRoute
            path="/dashboard/walkinsales/:Dist_Code"
            component={DashboardWalkInSales}
          />
          <PrivateRoute
            path="/dashboard/oneoffsales/:Dist_Code"
            component={DashboardOneOffSales}
          />
          <PrivateRoute
            path="/dashboard/stockreceived/:Dist_Code"
            component={DashboardStockReceived}
          />
          <Route
            path="/dashboard/singlestockreceived/:Dist_Code/:docNo"
            component={DashboardSingleStockReceived}
          />
          <PrivateRoute
            path="/dashboard/productvolumesold/:Dist_Code/:productCode/:startRange/:stopRange"
            component={VolumeSoldPerProduct}
          />
          <PrivateRoute
            path="/dashboard/van-sales/:Dist_Code"
            component={DashboardVanSales}
          />
          <PrivateRoute
            path="/dashboard/all-customers/:Dist_Code"
            component={DashboardAllCustomerReport}
          />
          <Route path="/driver/redirect-driver" component={DriverRedirect} />
        </Switch>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
