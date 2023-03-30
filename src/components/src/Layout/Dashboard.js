import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { KpoRoutes } from "../utils/routes";
import countryConfig from "../utils/changesConfig.json";
import { getLocation } from "../utils/getUserLocation";
import {
  setDailyStockModal,
} from "../modules/Inventory/actions/inventoryProductAction";
import { inventoryNet } from "../utils/urls";
import DailyStockCountModal from "../modules/Distributors/components/DailyStockCountModal";

const Dashboard = ({ location, children, sessionUser }) => {
  const dispatch = useDispatch();
  const code = location.pathname.split("/")[3];
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const token = localStorage.getItem("userData");
  const ccountry = AuthData?.country;
  const routes = KpoRoutes(code, ccountry);
  // const [dropdown, setDropdownShow] = useState(false);
  // const showDropdown = () => {
  //   setDropdownShow(dropdown ? false : true);
  // };
  const [country, setCountry] = useState(ccountry);
  const route = location.pathname.split("/")[2];
  const countryConfigObject = countryConfig[ccountry];

  useEffect(() => {
    if (token) {
      const inventory = inventoryNet();
      inventory.get(code).then((response) => {
        const { data } = response.data;
        if (data.length > 0) {
          if (route !== "daily-stock") {
            inventory.get(`daily-inventory-check/${code}`).then((response) => {
              const { data } = response.data;
              data.status === false && dispatch(setDailyStockModal(true));
            });
          }
        }
      });
    }
  }, [AuthData, token, code]);

  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country]);

  const selected = localStorage.getItem("i18nextLng") || "en-US";
  const forMatLang = selected.split("-")[0] || "en";

  const translation = {
    Home: {
      en: "Home",
      pg: "Casa",
    },
    Inventory: {
      en: "Inventory",
      pg: "Inventário",
    },
    Stock: {
      en: "Stock",
      pg: "Inventário",
    },
    Transactions: {
      en: "Transactions",
      pg: "Transações",
    },
    "Van Warehouse": {
      en: "Van Warehouse",
      pg: "Armazém de vans",
    },
    Reports: {
      en: "Reports",
      pg: "Relatórios",
    },
    Customers: {
      en: "Customers",
      pg: "Clientes",
    },
    Analytics: {
      en: "Analytics",
      pg: "Análise",
    },
  };

  return (
    <div
      className="flex flex-col h-screen max-h-screen overflow-y-hidden"
      style={{
        backgroundColor: countryConfig[country].dashboardBackgroundColor,
      }}
    >
      <div className="grid grid-cols-10 gap-0 max-h-full h-full">
        <div
          className="sidebar"
          style={{ backgroundColor: countryConfig[country].navBackgroundColor }}
        >
          <img
            className="p-5"
            src={countryConfig[country].LogoVariation}
            alt="logo"
          />
          <ul className="sidebar-content">
            {routes.map((route, index) => {
              if (location.pathname === route.link) {
                return (
                  <li
                    key={index}
                    className="text-center py-4 mb-3 bg-transparent border-l-2 border-white bg-opacity-20"
                  >
                    <Link to={route.link}>
                      <div
                        // className="items-center"
                        style={{
                          display: "flex",
                          margin: "2% auto",
                          padding: "2px",
                          color: countryConfig[country].kujaColor,
                          justifyContent: "center",
                        }}
                      >
                        {route.icon}
                      </div>

                      {/* <img src={route.icon} style={{ margin: '2% auto', padding: "2px", background: countryConfig[country].kujaColor, borderRadius: "13px" }} /> */}
                      <span className="items-center space-x-6">
                        <span
                          className="text-sm font-customRoboto"
                          style={{ color: countryConfig[country].kujaColor }}
                        >
                          {translation[route?.label][forMatLang]}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              } else {
                return (
                  <li key={index} className="text-center mb-3 py-4">
                    <Link to={route.link}>
                      <div
                        style={{
                          display: "flex",
                          margin: "2% auto",
                          padding: "2px",
                          justifyContent: "center",
                          color: countryConfig[country].sidebarDefaultColor,
                        }}
                      >
                        {route.icon}
                      </div>
                      {/* <img src={route.icon} color={countryConfig[country].sidebarDefaultColor} style={{ margin: '2% auto' }} /> */}
                      <span className="items-center space-x-6">
                        <span
                          className="text-sm font-customRoboto"
                          style={{
                            color: countryConfig[country].sidebarDefaultColor,
                          }}
                        >
                          {translation[route?.label][forMatLang]}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <div className="col-span-9 w-full overflow-hidden h-full max-h-full position-relative">
          <Navbar
            location={location}
            // showDropdown={showDropdown}
            // dropdown={dropdown}
            sessionUser={sessionUser}
          />
          <div className="overflow-y-scroll max-h-full">{children}</div>
        </div>
      </div>

      <DailyStockCountModal
        code={code}
        countryConfigObject={countryConfigObject}
        country={country}
      />
    </div>
  );
};

export default Dashboard;
