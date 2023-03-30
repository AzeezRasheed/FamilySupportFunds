import React from "react";
import ReactDOM from "react-dom";
import jwtDecode from "jwt-decode";
import authTypes from "./modules/Auth/actions/auth.type";
import "./assets/main.scss";
import setAuthorizationToken from "./utils/authorization";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { createBrowserHistory } from "history";
import configureStore from "./redux/store";
import App from "./App";
import "./i18nextInit";
import { OidcProvider } from "redux-oidc";
import userManager from "./utils/userManager";
import { datadogRum } from "@datadog/browser-rum";
import dotenv from "dotenv";
dotenv.config();
const {
  REACT_APP_DATADOG_CLIENT_TOKEN,
  REACT_APP_DATADOG_APPLICATION_ID,
  REACT_APP_DATADOG_SITE,
  REACT_APP_BASE_URL
} = process.env;


const appId = REACT_APP_DATADOG_APPLICATION_ID;
const clientToken = REACT_APP_DATADOG_CLIENT_TOKEN;
const siteName = REACT_APP_DATADOG_SITE;
const baseUrl = REACT_APP_BASE_URL;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(history, initialState);
const token = localStorage.getItem("userData");

try {
  if (token) {
    setAuthorizationToken(token);
    store.dispatch({
      type: authTypes.LOAD_USER_DATA_SUCCESS,
      payload: jwtDecode(token),
      authenticated: true,
    });
  }
} catch (error) {
  localStorage.removeItem("userData"); //what you need to do incase the jwt is not valid
  console.log(error); //for your own debugging
}

datadogRum.init({
  applicationId: appId,
  clientToken: clientToken,
  site: siteName,
  service: "dms-qa",
  env: "afr-dms-qa",
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sampleRate: 100,
  premiumSampleRate: 100,
  trackInteractions: true,
  defaultPrivacyLevel: "mask-user-input",
});
datadogRum.startSessionReplayRecording();

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
      {/* <ConnectedRouter history={history}> */}
      <App />
      {/* </ConnectedRouter> */}
    </OidcProvider>
  </Provider>,
  rootElement
);

// registerServiceWorker();
