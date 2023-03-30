import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { routerReducer, routerMiddleware } from "react-router-redux";
import { loadUser, reducer as oidcReducer } from "redux-oidc";
import rootReducer from "./reducers";
import Auth from "../modules/Auth/reducers/auth.reducer";
import { AllDistributorReducer } from "../modules/Admin/pages/reducers";
import { OrderReducer } from "../modules/Admin/order/reducers";
import {
  PricingReducer,
  DistributorPricingReducer,
} from "../modules/Admin/Pricing/reducers";
import userManager from "../utils/userManager";

import { InventoryReducer } from "../modules/Inventory/reducers";
import { VanInventoryReducer } from "../modules/VanInventory/reducer";
import { AllUsersReducer } from "../modules/Admin/KPO/reducer";
import { CustomerReducer } from "../modules/Admin/customer/reducers";
import { DropPointReducer } from "../modules/Admin/drop-point/reducers";
import { DistReducer } from "../modules/Distributors/reducers";
import { ReportReducer } from "../modules/Admin/Reports/reducers";
import { AllAnalyticsReducer } from "../modules/Analytics/pages/reducers";
import DashboardTabReducer from "../modules/Analytics/pages/reducers/DashboardTabReducer";
import { InvoiceReducer } from "../modules/Reports/reducers";
import { ProductCatalogueReducer } from '../modules/Transaction/reducers'


export default function configureStore(history, initialState) {
  const reducers = {
    Auth,
    AllDistributorReducer,
    PricingReducer,
    DistributorPricingReducer,
    CustomerReducer,
    DropPointReducer,
    InventoryReducer,
    OrderReducer,
    VanInventoryReducer,
    AllUsersReducer,
    DistReducer,
    ReportReducer,
    InvoiceReducer,
    oidc: oidcReducer,
    AllAnalyticsReducer,
    DashboardTabReducer,
    ProductCatalogueReducer
  };

  const middleware = [thunk, routerMiddleware(history)];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === "development";
  if (
    isDevelopment &&
    typeof window !== "undefined" &&
    window.devToolsExtension
  ) {
    enhancers.push(window.devToolsExtension());
  }

  const allReducer = combineReducers({
    ...reducers,
    routing: routerReducer,
  });

  const store = createStore(
    allReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
  loadUser(store, userManager);

  return store;
}

// import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer from './reducers';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// const middlewares = [thunk];

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['Auth',]
//   // blacklist: ['Auth']
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const storeConfig = () => {
//   let store = createStore(persistedReducer, compose(
//     applyMiddleware(...middlewares)
//     // eslint-disable-next-line
//     // typeof window.__REDUX_DEVTOOLS_EXTENSION__ === "undefined"
//     // ? a => a
//     // : window.__REDUX_DEVTOOLS_EXTENSION__ &&
//     //     window.__REDUX_DEVTOOLS_EXTENSION__()
//   ))

//   let persistor = persistStore(store);

//   return { store, persistor };
// }

// export default storeConfig;
