import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { loadUserDataSuccess } from "../../modules/Auth/actions/auth.action"
import Navbar from './Navbar'
import { Link } from "react-router-dom";
import countryConfig from '../../utils/changesConfig.json'
import { getLocation } from '../../utils/getUserLocation'
import { AdminRoutes } from "../../utils/routes";
import userManager from '../../utils/userManager';
import { useLocation } from 'react-router';
import { MinAdminRoutes } from "../../utils/routes";
import { useTranslation } from "react-i18next";

const Dashboard = ({ location, children, sessionUser }) => {
  const dispatch = useDispatch()
  const token = localStorage.getItem('userData');

  const AuthData = useSelector(state => state.Auth.sessionUserData)
  const role = AuthData.roles;
  const [country, setCountry] = useState('Ghana');
useEffect(() => {
  if(token) {
    dispatch(loadUserDataSuccess(AuthData))
  }
  }, [AuthData, token])

  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country])
  const Location = useLocation()
  const selected = localStorage.getItem("i18nextLng") || "en-US";
  const forMatLang = selected.split('-')[0] || "en"

  const translation = {
    Pricings: {
      en: 'Pricings',
      pg: 'preços'
    },
    Notifications: {
      en: 'Notifications',
      pg: 'Noticações'
    },
    Distributors: {
      en: 'Distributors',
      pg: 'Distribuidores'
    },
    Customers: {
      en: 'Customers',
      pg: 'Clientes'
    },
    Reports: {
      en: 'Reports',
      pg: 'Relatórios'
    },
    Users: {
      en: 'Users',
      pg: 'Usuarios'
    }
  }

  const handleLogout = () => {
    userManager.signoutRedirect();
    localStorage.clear()
  }

  return (
    <div
      className="flex flex-col h-screen max-h-screen overflow-y-hidden"
      style={{
        backgroundColor: countryConfig[country].dashboardBackgroundColor,
      }}
    >
      <div className="grid grid-cols-10 gap-0 max-h-full h-full">
        <div
          style={{ backgroundColor: countryConfig[country].navBackgroundColor }}
        >
          <img
            className="p-5"
            src={countryConfig[country].LogoVariation}
            alt="logo"
          />
          {role === "Admin" && (
            <ul className="mt-4">
              {AdminRoutes?.map((route, index) => {
                if (Location.pathname === route.link) {
                  return (
                    <li
                      key={index}
                      className="text-center py-3 bg-transparent border-l-2 border-white bg-opacity-20"
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
                    <li key={index} className="text-center py-4">
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
                        {/* <img src={route.icon} color={countryConfig[country].sidebarDefaultColor} style={{ margin: '2% auto' }}/> */}
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
          )}
          {role==="Mini-Admin" && <ul className="mt-4">
            {MinAdminRoutes?.map((route, index) => {
              if (Location.pathname === route.link) {
                return (
                  <li
                    key={index}
                    className="text-center py-3 bg-transparent border-l-2 border-white bg-opacity-20"
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
                  <li key={index} className="text-center py-4">
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
                      {/* <img src={route.icon} color={countryConfig[country].sidebarDefaultColor} style={{ margin: '2% auto' }}/> */}
                      <span className="items-center space-x-6">
                        <span
                          className="text-sm font-customRoboto"
                          style={{
                            color: countryConfig?.[country]?.sidebarDefaultColor,
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
          </ul>}
        </div>

        <div className="col-span-9 w-full overflow-hidden h-full max-h-full">
          <Navbar
            // showDropdown={showDropdown}
            // dropdown={dropdown}
            logOut={handleLogout}
            sessionUser={sessionUser}
          />
          <div className="overflow-y-scroll max-h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
