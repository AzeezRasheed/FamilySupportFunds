import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useLocation, Route } from 'react-router-dom';
import {
  loadUserDataSuccess,
  loadUser,
  logoutUser
} from "../../modules/Auth/actions/auth.action";
import { userNet } from "../../utils/urls";
import jwtDecode from "jwt-decode";
import Jwt from 'jsonwebtoken';

const PrivateRoute = ({ component: Component, oidc, ...rest }) => {
  const location = useLocation();
  const key = process.env.REACT_APP_SECRET_KEY;
  const token = localStorage.getItem('userData');
  const loadingState = useSelector((state) => state.Auth.loadingUser);
  const dispatch = useDispatch();
  let AuthData = jwtDecode(token);

  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const code = location.pathname.split('/')[3]  //   let role = sessionUser?.user?.role;
  useEffect(() => {
    if (token) {
      if (AuthData &&
        (AuthData?.DIST_Code === null || AuthData?.DIST_Code === "" || AuthData.roles === "Admin" || AuthData.roles === "Mini-Admin" || (JSON.parse(AuthData?.DIST_Code) &&
          JSON.parse(AuthData?.DIST_Code).includes(code && code)))) {
        setIsAuthenticated(true)
      }

      // if (
      //   AuthData &&
      //   JSON.parse(AuthData?.DIST_Code) &&
      //   JSON.parse(AuthData?.DIST_Code).includes(code && code)
      // ) {
      //   setIsAuthenticated(true)
      // }
    }
    else {
      setIsAuthenticated(false)
      logoutUser();
      setTimeout(() => {
        return <Redirect to="/" />
      }, 3000)
    }
  }, [AuthData?.DIST_Code, token])

  return (
    <Route
      {...rest}
      render={props => {
        return isAuthenticated && <Component {...props} />
      }
      }
    />
    // <Route component={component} {...rest} />
  );
};


export default PrivateRoute;